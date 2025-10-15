import styles from "../styles/CostumeEditor.module.css";
import Tooltip from "./Tooltip.jsx";
import clsx from "clsx";

export default function Topbar({
    mode, setMode, lastLineMode, setShowTopbarHint, showTopbarHint,
    dismissTopbarHint, presetIdx, setPresetIdx, resetAll, doExportSVG,
    isExporting,
}) {
    const modeGroup =
        (mode === 'paint' || mode === 'deleteFill') ? 'fill' :
            (mode === 'add' || mode === 'delete' || mode === 'insert' || mode === 'deleteVertex') ? 'line' :
                (mode === 'variants' ? 'variants' : 'preview');

    return (
        <div className={styles.topbar}>
            {/* Режимы (иконки) */}
            <div className={styles.tbLeft} role="toolbar" aria-label="Режимы">
                <Tooltip label="Просмотр (Esc)">
                    <button
                        className={clsx(styles.iconBtn, mode === "preview" && styles.iconActive)}
                        aria-label="Просмотр"
                        aria-keyshortcuts="Esc"
                        aria-pressed={mode === "preview"}
                        onClick={() => { dismissTopbarHint(); setMode("preview"); }}
                    >👁️</button>
                </Tooltip>

                <Tooltip label="Заливка (F)">
                    <button
                        className={clsx(styles.iconBtn, (mode === "paint" || mode === "deleteFill") && styles.iconActive)}
                        aria-label="Заливка"
                        aria-keyshortcuts="F"
                        aria-pressed={mode === "paint" || mode === "deleteFill"}
                        onClick={() => { dismissTopbarHint(); setMode("paint"); }}
                    >🪣</button>
                </Tooltip>

                <Tooltip label="Линии (A)">
                    <button
                        className={clsx(styles.iconBtn, modeGroup === "line" && styles.iconActive)}
                        aria-label="Линии"
                        aria-keyshortcuts="A"
                        aria-pressed={modeGroup === "line"}
                        onClick={() => { dismissTopbarHint(); setMode(lastLineMode || "add"); }}
                    >✏️</button>
                </Tooltip>

                <Tooltip label="Варианты (V)">
                    <button
                        className={clsx(styles.iconBtn, mode === "variants" && styles.iconActive)}
                        aria-label="Варианты деталей одежды"
                        aria-keyshortcuts="V"
                        aria-pressed={mode === "variants"}
                        onClick={() => { dismissTopbarHint(); setMode("variants"); }}
                    >🧩</button>
                </Tooltip>


                <Tooltip label="Показать подсказку (H)">
                    <button
                        className={styles.iconBtn}
                        aria-label="Справка"
                        aria-keyshortcuts="H"
                        onClick={() => { try { localStorage.removeItem('ce.topbarHint.v1'); } catch { }; setShowTopbarHint(true); }}
                    >?</button>
                </Tooltip>
            </div>


            {showTopbarHint && (
                <div className={styles.topbarHint} role="dialog" aria-label="Подсказка по режимам">
                    <div className={styles.hintClose} onClick={dismissTopbarHint} aria-label="Закрыть">×</div>
                    <div className={styles.hintTitle}>Быстрый старт</div>
                    <div className={styles.hintRow}>
                        Нажмите <span className={styles.kbd}>F</span> — заливка,
                        <span className={styles.kbd} style={{ marginLeft: 6 }}>A</span> — линии,
                        <span className={styles.kbd} style={{ marginLeft: 6 }}>V</span> — варианты деталей одежды,
                        <span className={styles.kbd} style={{ marginLeft: 6 }}>Esc</span> — просмотр,
                        <span className={styles.kbd} style={{ marginLeft: 6 }}>←</span> или
                        <span className={styles.kbd} style={{ marginLeft: 6 }}>→</span> — поменять сторону,
                        <span className={styles.kbd} style={{ marginLeft: 6 }}>Q</span> или
                        <span className={styles.kbd} style={{ marginLeft: 6 }}>E</span> — поменять сторону.
                    </div>
                    <div className={styles.hintRow} style={{ marginTop: 6 }}>
                        Или кликните по иконкам слева. Подсказка больше не появится.
                    </div>
                </div>
            )}

            {/* контейнер табов */}
            <div className={clsx(styles.topbarGroup, styles.tbCenter)} role="tablist" aria-label="Деталь">
                <button
                    role="tab"
                    id="tab-front"
                    aria-selected={presetIdx === 0}
                    aria-controls="panel-front"
                    className={clsx(styles.segBtn, presetIdx === 0 && styles.segActive)}
                    onClick={() => setPresetIdx(0)}
                    aria-keyshortcuts="Q"
                    title="Перед (Q)"
                >Перед</button>

                <button
                    role="tab"
                    id="tab-back"
                    aria-selected={presetIdx === 1}
                    aria-controls="panel-back"
                    className={clsx(styles.segBtn, presetIdx === 1 && styles.segActive)}
                    onClick={() => setPresetIdx(1)}
                    aria-keyshortcuts="E"
                    title="Спинка (E)"
                >Спинка</button>
            </div>

            {/* Сброс — одна кнопка */}
            <div className={styles.tbRight}>
                <button
                    className={styles.resetBtn}
                    onClick={resetAll}
                    aria-label="Сбросить всё"
                    title="Сбросить всё"
                >
                    ⚠️ Сбросить всё
                </button>

                <button
                    className={styles.exportBtn}
                    onClick={doExportSVG}
                    disabled={isExporting}
                    aria-label="Выгрузить в SVG"
                    title="Выгрузить в SVG"
                >
                    {isExporting ? "Экспорт…" : "Экспорт SVG"}
                </button>
            </div>

        </div>
    );
}