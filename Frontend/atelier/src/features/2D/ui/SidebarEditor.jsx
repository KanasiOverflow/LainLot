import { useState, useEffect } from "react";
import clsx from "clsx";
import styles from "../styles/CostumeEditor.module.css";
import SectionSlider from "./SectionSlider.jsx";
import VariantsGrid from "./VariantsGrid.jsx";
import { getVisibleSlotsForFace } from "../../../core/variables/variants.js";

const PALETTE = [
    "#f26522", "#30302e", "#93c5fd", "#a7f3d0", "#fde68a", "#d8b4fe",
    "#ef4444", "#10b981", "#22c55e", "#0ea5e9", "#f59e0b", "#a855f7"
];

export default function SidebarEditor(props) {
    const {
        mode, setMode, modeGroup,
        // заливка
        paintColor, setPaintColor, paletteOpen, setPaletteOpen, paletteRef,

        // линии
        lineStyle, setLineStyle, defaultSubCount, setDefaultSubCount,
        selectedCurveKey, setSelectedCurveKey, setHoverCurveKey,
        curvesByPanel, setCurvesByPanelExtern, // см. использование ниже
        recomputeWaveForCurve, waveAmpPx, setWaveAmpPx, waveLenPx, setWaveLenPx,

        // история
        historyItems, historyIndex, historyUndo, historyRedo, canUndo, canRedo,

        details, setDetails, activeDetailId,

        setSlotVariant
    } = props;

    // какие слоты доступны на текущей стороне
    const [visibleSlots, setVisibleSlots] = useState(new Set());
    useEffect(() => {
        let alive = true;
        (async () => {
            const arr = await getVisibleSlotsForFace(activeDetailId); // 'front' | 'back'
            if (!alive) return;
            setVisibleSlots(new Set(arr.map(s => String(s).toLowerCase())));
        })();
        return () => { alive = false; };
    }, [activeDetailId]);

    const [historyOpen, setHistoryOpen] = useState(false);

    useEffect(() => {
        try { setHistoryOpen(localStorage.getItem("ce.history.open") === "1"); } catch { }
    }, []);

    const toggleHistory = () => {
        setHistoryOpen(v => {
            const nv = !v;
            try { localStorage.setItem("ce.history.open", nv ? "1" : "0"); } catch { }
            return nv;
        });
    };

    // какой пресет сейчас активен

    const hasSelection = !!selectedCurveKey;
    let curve = null, pid = null, cid = null;
    if (hasSelection) {
        [pid, cid] = selectedCurveKey.split(":");
        curve = (curvesByPanel[pid] || []).find(c => c.id === cid) || null;
    }
    const currentSub = hasSelection
        ? Math.max(2, Math.min(10, curve?.subCount ?? 2))
        : Math.max(2, Math.min(10, defaultSubCount));

    const manualCount = hasSelection && Array.isArray(curve?.extraStops) ? curve.extraStops.length : 0;
    const manualLock = hasSelection && manualCount > 0;

    const changeSub = (n) => {
        if (hasSelection) {
            if (manualLock) return;
            setCurvesByPanelExtern(prev => {
                const arr = [...(prev[pid] || [])];
                const i = arr.findIndex(x => x.id === cid);
                if (i >= 0) arr[i] = { ...arr[i], subCount: n };
                return { ...prev, [pid]: arr };
            }, `Вершины: ${n}`);
        } else {
            setDefaultSubCount(n);
        }
    };

    const curveIsWavyCapable = !!(curve && curve.type === "wavy" && curve.basePts);
    const currentAmp = hasSelection ? (curve?.waveAmpPx ?? waveAmpPx) : waveAmpPx;
    const currentLen = hasSelection ? (curve?.waveLenPx ?? waveLenPx) : waveLenPx;
    const changeAmp = (val) => {
        if (hasSelection && curveIsWavyCapable)
            recomputeWaveForCurve(pid, cid, val, currentLen, `Амплитуда: ${val}px`);
        else
            setWaveAmpPx(val);
    };
    const changeLen = (val) => {
        if (hasSelection && curveIsWavyCapable)
            recomputeWaveForCurve(pid, cid, currentAmp, val, `Длина волны: ${val}px`);
        else
            setWaveLenPx(val);
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.panel}>
                <h3 className={styles.panelTitle}>Редактор</h3>

                {/* Палитра */}
                {modeGroup === "fill" && (
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Цвет заливки</div>

                        {/* Подрежимы */}
                        <div className={styles.segmented} style={{ gap: 8, marginBottom: 8 }}>
                            <button
                                className={clsx(styles.segBtn, mode === "paint" && styles.segActive)}
                                onClick={() => setMode("paint")}
                            >🪣 Залить</button>

                            <button
                                className={clsx(styles.segBtn, mode === "deleteFill" && styles.segActive)}
                                onClick={() => setMode("deleteFill")}
                            >✖ Стереть</button>
                        </div>

                        {mode === "paint" ? (
                            <>
                                {/* Текущий цвет + поповер */}
                                <div className={styles.colorRow}>
                                    <button
                                        className={styles.colorChip}
                                        style={{ background: paintColor }}
                                        onClick={() => setPaletteOpen(v => !v)}
                                        aria-label="Открыть палитру"
                                    />
                                    {paletteOpen && (
                                        <div className={styles.palettePopover}>
                                            <div ref={paletteRef} className={styles.palette}>
                                                <div className={styles.paletteGrid}>
                                                    {PALETTE.map(c => (
                                                        <button
                                                            key={c}
                                                            className={styles.swatchBtn}
                                                            style={{ background: c }}
                                                            onClick={() => { setPaintColor(c); setPaletteOpen(false); }}
                                                            aria-label={c}
                                                        />
                                                    ))}
                                                </div>
                                                <div className={styles.paletteFooter}>
                                                    <span className={styles.paletteLabel}>Произвольный</span>
                                                    <input
                                                        type="color"
                                                        className={styles.colorInline}
                                                        value={paintColor}
                                                        onChange={(e) => setPaintColor(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Быстрые цвета */}
                                <div className={styles.swatches} style={{ marginTop: 8 }}>
                                    {PALETTE.map(c => (
                                        <button
                                            key={c}
                                            className={styles.swatch}
                                            style={{ background: c }}
                                            title={c}
                                            onClick={() => setPaintColor(c)}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className={styles.hintSmall} style={{ marginTop: 8 }}>
                                Режим очистки: кликните по закрашенной области, чтобы удалить цвет. Горячая клавиша: <span className={styles.kbd}>X</span>.
                            </div>
                        )}
                    </div>
                )}

                {/* Линии */}
                {modeGroup === "line" && (
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Линия</div>

                        <div className={styles.segmented}>
                            <button className={clsx(styles.segBtn, lineStyle === "straight" && styles.segActive)}
                                onClick={() => { setLineStyle("straight"); setSelectedCurveKey(null); setHoverCurveKey(null); }}>Прямая</button>
                            <button className={clsx(styles.segBtn, lineStyle === "wavy" && styles.segActive)}
                                onClick={() => { setLineStyle("wavy"); setSelectedCurveKey(null); setHoverCurveKey(null); }}>Волнистая</button>
                        </div>

                        <div className={clsx(styles.segmented, styles.two)} style={{ marginBottom: 8 }}>
                            <button className={clsx(styles.segBtn, mode === "add" && styles.segActive)} onClick={() => { setMode("add"); setSelectedCurveKey(null); setHoverCurveKey(null); }}>＋ Добавить</button>
                            <button className={clsx(styles.segBtn, mode === "delete" && styles.segActive)} onClick={() => { setMode("delete"); setSelectedCurveKey(null); setHoverCurveKey(null); }}>🗑 Удалить</button>
                            <button className={clsx(styles.segBtn, mode === "insert" && styles.segActive)} onClick={() => { setMode("insert"); setSelectedCurveKey(null); setHoverCurveKey(null); }}>● Вставить вершину</button>
                            <button className={clsx(styles.segBtn, mode === "deleteVertex" && styles.segActive)} onClick={() => { setMode("deleteVertex"); setSelectedCurveKey(null); setHoverCurveKey(null); }}>○ Удалить вершину</button>
                        </div>

                        {/* Настройки */}
                        <SectionSlider label={hasSelection ? "Вершины на линии" : "Вершины (для новой)"}
                            value={currentSub} min={2} max={10} step={1}
                            onChange={changeSub} disabled={manualLock} />

                        {manualLock && (
                            <div className={styles.lockNote}>
                                На линии есть ручные вершины ({manualCount}). Автоматическое распределение отключено.
                                <div style={{ marginTop: 6 }}>
                                    <button type="button" className={styles.linkBtn}
                                        onClick={() => {
                                            if (!hasSelection) return;
                                            const [pp, cc] = selectedCurveKey.split(":");
                                            setCurvesByPanelExtern(prev => {
                                                const list = [...(prev[pp] || [])];
                                                const i = list.findIndex(x => x.id === cc);
                                                if (i < 0) return prev;
                                                list[i] = { ...list[i], extraStops: [] };
                                                return { ...prev, [pp]: list };
                                            });
                                        }}>
                                        Удалить все ручные вершины
                                    </button>
                                </div>
                            </div>
                        )}

                        {lineStyle === "wavy" && (
                            <>
                                <SectionSlider
                                    label={hasSelection ? (curveIsWavyCapable ? "Амплитуда на линии" : "Амплитуда (шаблон)") : "Амплитуда (для новой)"}
                                    value={currentAmp} min={2} max={24} step={1}
                                    onChange={changeAmp} disabled={manualLock} suffix="px"
                                />

                                <SectionSlider
                                    label={hasSelection ? (curveIsWavyCapable ? "Длина волны на линии" : "Длина волны (шаблон)") : "Длина волны (для новой)"}
                                    value={currentLen} min={12} max={80} step={2}
                                    onChange={changeLen} disabled={manualLock} suffix="px"
                                />

                            </>
                        )}
                    </div>
                )}

                {mode === "variants" && (
                    <>
                        {/* --- ХУДИ --- */}
                        {[
                            { slot: "hoodie.cuff", title: "Манжета" },
                            { slot: "hoodie.sleeve", title: "Рукав" },
                            { slot: "hoodie.neck", title: "Шея" },
                            { slot: "hoodie.belt", title: "Пояс" },
                            { slot: "hoodie.body", title: "Тело" },
                            { slot: "hoodie.hood", title: "Капюшон" },
                            { slot: "hoodie.pocket", title: "Карман" }
                        ]
                            // visibleSlots содержит "чистые" имена (cuff, belt, ...)
                            .filter(sec => visibleSlots.has(sec.slot.toLowerCase()))
                            .map(sec => {
                                const slotPure = sec.slot.split(".").pop(); // для VariantsGrid/манифеста
                                return (
                                    <div className={styles.section} key={sec.slot}>
                                        <div className={styles.sectionTitle}>{sec.title}</div>
                                        <VariantsGrid
                                            slot={slotPure}                 // ← сюда идёт "чистый" слот
                                            face={activeDetailId}
                                            value={details[activeDetailId]?.[sec.slot] || "base"}   // ← state по полному ключу
                                            onChange={(id) => setSlotVariant(activeDetailId, sec.slot, id)}
                                        />
                                    </div>
                                );
                            })}

                        {/* --- ШТАНЫ --- */}
                        {[
                            { slot: "pants.leg", title: "Брючины" },
                            { slot: "pants.belt", title: "Пояс" },
                            { slot: "pants.cuff", title: "Манжета" }
                            // при необходимости добавите сюда "pants_cuff", "pants_belt" и т.д.
                        ]
                            .filter(sec => visibleSlots.has(sec.slot.toLowerCase()))
                            .map(sec => {
                                const slotPure = sec.slot.split(".").pop();
                                return (
                                    <div className={styles.section} key={`pants-${sec.slot}`}>
                                        <div className={styles.sectionTitle}>{sec.title}</div>
                                        <VariantsGrid
                                            slot={slotPure}
                                            face={activeDetailId}
                                            value={details[activeDetailId]?.[sec.slot] || "base"}
                                            onChange={(id) => setSlotVariant(activeDetailId, sec.slot, id)}
                                        />
                                    </div>
                                );
                            })}
                    </>
                )}

                {/* История (только не в preview — сам сайдбар скрыт в preview) */}
                <div className={styles.section}>
                    <div className={styles.historyHeader}>
                        <div className={styles.sectionTitle}>История</div>

                        <div className={styles.historyToggles}>
                            <button
                                className={styles.historyToggleBtn}
                                aria-label={historyOpen ? "Свернуть историю" : "Развернуть историю"}
                                aria-expanded={historyOpen}
                                aria-controls="history-panel"
                                title={historyOpen ? "Свернуть" : "Развернуть"}
                                onClick={toggleHistory}
                            >
                                {historyOpen ? "▾" : "▸"}
                            </button>

                            <button
                                className={styles.historyBtn}
                                onClick={historyUndo}
                                disabled={!canUndo}
                                aria-label="Отменить (Ctrl+Z)"
                                title="Отменить (Ctrl+Z)"
                            >↶</button>

                            <button
                                className={styles.historyBtn}
                                onClick={historyRedo}
                                disabled={!canRedo}
                                aria-label="Повторить (Ctrl+Y / Ctrl+Shift+Z)"
                                title="Повторить (Ctrl+Y / Ctrl+Shift+Z)"
                            >↷</button>
                        </div>
                    </div>

                    {/* Только два состояния: открыт -> показываем всю ленту, закрыт -> ничего */}
                    {historyOpen && (
                        <div id="history-panel" className={styles.historyViewport}>
                            <ol className={styles.historyList} aria-label="История действий">
                                {historyItems.map((it, i) => (
                                    <li
                                        key={i}
                                        className={[
                                            styles.histItem,
                                            i === historyIndex ? ' ' + styles.now : '',
                                            i > historyIndex ? ' ' + styles.future : '',
                                        ].join('')}
                                        title={new Date(it.at).toLocaleTimeString()}
                                    >
                                        <span className={styles.histStep}>{i}</span>
                                        <span className={styles.histLabel}>{it.label}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>


            </div>
        </aside>
    );
}