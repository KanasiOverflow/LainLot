// CostumeEditor.jsx
import { useEffect, useMemo, useRef, useState, useLayoutEffect, useCallback } from "react";
import styles from "../styles/CostumeEditor.module.css";
import clsx from "clsx";
import { sampleBezierPoints } from "../../../core/geometry/geometry.js";
import { waveAlongPolyline } from "../../../core/geometry/polylineOps.js";
import { faceKey } from "../../../core/svg/faceUtils.js";
import { catmullRomToBezierPath } from "../../../core/svg/polylineOps.js";
import { pointInAnyFace } from "../../../core/svg/buildFaces.js";
import { loadPresetToPanels, composePanelsForSide } from "../../../core/svg/extractPanels.js";
import { makeUserCurveBetween } from "../../../core/svg/curves.js";

import { downloadText } from "../../../core/export/export.js";
import { buildCombinedSVG } from "../../../core/export/buildCombinedSVG.js";

import { useHistory } from "../../../shared/hooks/useHistory.jsx";
import { useInsertPreviewRAF } from "../../../shared/hooks/useInsertPreviewRAF.jsx";
import { useSceneGeometry } from "../../../shared/hooks/useSceneGeometry.jsx";
import { useEditorPrefs } from "../../../shared/hooks/useEditorPrefs.jsx";
import { useVariantsComposition } from "../../../shared/hooks/useVariantsComposition.jsx";

import SidebarEditor from "./SidebarEditor.jsx";
import BodyParams from "./BodyParams.jsx";
import OrderForm from "./OrderForm.jsx";
import Topbar from "./Topbar.jsx";
import CanvasStage from "./CanvasStage.jsx";

import { PRESETS } from "../../../core/variables/presets.js";
import { getBaseSources, loadSvgManifest, reduceSetSlotVariant } from "../../../core/variables/variants.js";

/* ================== компонент ================== */
export default function CostumeEditor() {
    const scopeRef = useRef(null);
    const [showTopbarHint, setShowTopbarHint] = useState(false);
    const [composedPanels, setComposedPanels] = useState(null);
    // Минимальный зазор между вершинами (в мировых единицах SVG). Настраивается из кода.
    const MIN_GAP_WORLD = 20; // TODO: подберите под ваши единицы (напр., «5 см»)
    // state для «запоминания» последнего подрежима
    const [lastLineMode, setLastLineMode] = useState('add');     // 'add' | 'delete

    const [activePanelId, setActivePanelId] = useState(null);
    // для анимации "из-за спины"
    const [prevPanels, setPrevPanels] = useState(null);
    const [isSwapping, setIsSwapping] = useState(false);
    const SWAP_MS = 180; // синхрон с .swapIn/.swapOut (180ms)
    const didEverSwapRef = useRef(false);
    const swapTimerRef = useRef(null);
    // --- PRESETS state
    const [presetIdx, setPresetIdx] = useState(0);   // 0: Перед, 1: Спинка
    const activeId = presetIdx === 0 ? "front" : "back";
    // кривые: 'cubic' или 'routed' (по контуру)
    const [curvesByPanel, setCurvesByPanel] = useState({});
    const [fills, setFills] = useState([]);
    const [paintColor, setPaintColor] = useState("#f26522");
    const [mode, setMode] = useState("preview");
    const [defaultSubCount, setDefaultSubCount] = useState(2); // используется только при создании новых линий
    const [selectedCurveKey, setSelectedCurveKey] = useState(null); // `${panelId}:${curveId}`
    // тип пользовательской линии
    const [lineStyle, setLineStyle] = useState("straight"); // 'straight' | 'wavy'
    const [addBuffer, setAddBuffer] = useState(null);
    const [hoverAnchorIdx, setHoverAnchorIdx] = useState(null);
    const [hoverCurveKey, setHoverCurveKey] = useState(null);
    const [clickedCurveKey, setClickedCurveKey] = useState(null);
    const [hoverFace, setHoverFace] = useState(null);
    const [toast, setToast] = useState(null);

    // параметры волны (в пикселях экрана)
    const [waveAmpPx, setWaveAmpPx] = useState(6);
    const [waveLenPx, setWaveLenPx] = useState(36);
    const [paletteOpen, setPaletteOpen] = useState(false);
    const paletteRef = useRef(null);

    const activeDetailId = (presetIdx === 0 ? "front" : "back");
    const [details, setDetails] = useState({ front: { cuff: "base" }, back: { cuff: "base" } }); // пока работаем только с манжетами

    const [savedByPreset, setSavedByPreset] = useState({}); // { [presetId]: { curvesByPanel, fills, activePanelId } }
    const savedByPresetRef = useRef({});

    const dismissTopbarHint = useCallback(() => {
        if (!showTopbarHint) return;
        setShowTopbarHint(false);
        try { localStorage.setItem("ce.topbarHint.v1", "1"); } catch (e) { }
    }, [showTopbarHint]);

    // --- PRESETS: кнопки/клавиши
    const prevPreset = () => setPresetIdx(i => (i - 1 + PRESETS.length) % PRESETS.length);
    const nextPreset = () => setPresetIdx(i => (i + 1) % PRESETS.length);
    // общий bbox сцены — используется и для viewBox, и для сетки

    const snapshotFor = useCallback(() => ({
        curvesByPanel,
        fills,
        activePanelId,
    }), [curvesByPanel, fills, activePanelId]);

    const applySnapshot = useCallback((snap, panelsParsed) => {
        if (!snap) return; // нет снимка — ничего не трогаем
        const allowed = new Set((panelsParsed || []).map(p => p.id));
        const curvesIn = snap.curvesByPanel || {};
        const curves = Object.fromEntries(Object.entries(curvesIn).filter(([pid]) => allowed.has(pid)));
        const fills = (snap.fills || []).filter(f => allowed.has(f.panelId));
        // активная панель — если нет в текущих parts, берём первую
        const active = allowed.has(snap.activePanelId) ? snap.activePanelId : (panelsParsed[0]?.id || null);
        setCurvesByPanel(curves);
        setFills(fills);
        setActivePanelId(active);
    }, []);

    const {
        historyUndo, historyRedo, canUndo, canRedo,
        applyFillChange, applyCurvesChange,
        historyItems, historyIndex,
    } = useHistory({
        fills, curvesByPanel, presetIdx,
        setFills, setCurvesByPanel,
        max: 50, // можно поменять
    });

    const {
        manifest, setManifest, isLoadingPreset, panels, setPanels,
        svgCacheRef, svgCache, setSvgCache, svgMountKey, hoodPanelIds,
        hoodRings, hoodHoles, panelSlotMapRef, currentPresetIdRef
    } = useVariantsComposition({ presetIdx, details, savedByPresetRef, applySnapshot });

    // чтобы поймать "старые" панели до перезаписи
    const panelsRef = useRef(panels);

    const { insertPreview, setInsertPreview, setInsertPreviewRAF } = useInsertPreviewRAF();

    const { svgRef, viewBox, scale, gridDef,
        baseFacesByPanel, ringsByPanel, outerRingByPanel, facesByPanel,
        extraAnchorsByPanel, mergedAnchorsOf, getCursorWorld, closestPointOnCurve,
        setScale
    } = useSceneGeometry({ panels, curvesByPanel, defaultSubCount });

    const { applyingPrefsRef, setPrefs, setBothLastModePreview } = useEditorPrefs({
        activeId, mode, setMode, paintColor, setPaintColor,
        lineStyle, setLineStyle, defaultSubCount, setDefaultSubCount, waveAmpPx,
        setWaveAmpPx, waveLenPx, setWaveLenPx, lastLineMode, setLastLineMode,
        presetIdx
    });

    const tooCloseToExistingAnchors = (panel, curve, testPt) => {
        // берём все уже существующие «снимки» якорей для этой кривой:
        const merged = mergedAnchorsOf(panel);
        // кандидаты: концы линии + все extraAnchorsByPanel от этой кривой
        const pts = [];
        const a = merged[curve.aIdx] ?? (curve.ax != null ? { x: curve.ax, y: curve.ay } : null);
        const b = merged[curve.bIdx] ?? (curve.bx != null ? { x: curve.bx, y: curve.by } : null);
        if (a) pts.push(a);
        if (b) pts.push(b);
        const extras = extraAnchorsByPanel[panel.id] || [];
        for (const e of extras) {
            if ((e.id || '').startsWith(`${curve.id}:`) || (e.id || '').startsWith(`${curve.id}@m`)) {
                pts.push({ x: e.x, y: e.y });
            }
        }
        return pts.some(q => Math.hypot(q.x - testPt.x, q.y - testPt.y) < MIN_GAP_WORLD);
    };

    const onCurveClick = (panelId, curveId, e) => {
        if (mode === "delete") {
            onCurveClickDelete(panelId, curveId);
            return;
        }
        if (mode === "preview") {
            e?.stopPropagation?.();
            return;
        }

        e?.stopPropagation?.();
        setSelectedCurveKey(`${panelId}:${curveId}`);
        setClickedCurveKey(`${panelId}:${curveId}`);
        setTimeout(() => setClickedCurveKey(k => (k === `${panelId}:${curveId}` ? null : k)), 220);
    };

    // Клик по пустому месту канвы — снимаем выделение
    const onCanvasClick = useCallback(() => {
        if (mode === "preview" || applyingPrefsRef.current)
            return;      // в preview ничего не делаем
        if (mode !== "delete") {
            setSelectedCurveKey(null);
        }
    }, [mode]);

    const onPanelActivate = (panelId) => {
        if (mode === 'preview')
            return;

        // В режиме заливки не мешаем покраске
        if (mode === 'paint' || mode === 'deleteFill')
            return;

        setActivePanelId(panelId);
        setSelectedCurveKey(null);
        setHoverCurveKey(null);
        setAddBuffer(null);
    };

    const recomputeWaveForCurve = (pid, cid, ampPx, lenPx) => {
        applyCurvesChange(prev => {
            const list = [...(prev[pid] || [])];
            const i = list.findIndex(x => x.id === cid);
            if (i < 0) return prev;
            const c = list[i];

            const ampW = ampPx * (scale.k || 1);
            const lambdaW = lenPx * (scale.k || 1);

            if (c.type === 'wavy' && Array.isArray(c.basePts) && c.basePts.length >= 2) {
                let wpts = waveAlongPolyline(c.basePts, ampW, lambdaW, null);
                wpts = snapEnds(wpts, c.ax, c.ay, c.bx, c.by);
                const d = catmullRomToBezierPath(wpts);
                list[i] = { ...c, pts: wpts, d, waveAmpPx: ampPx, waveLenPx: lenPx };
                return { ...prev, [pid]: list };
            }

            return prev;
        }, "Параметры волны");
    };

    // линейная интерполяция точки на полилинии по «дуговой длине»

    const modeGroup =
        (mode === 'paint' || mode === 'deleteFill') ? 'fill' :
            (mode === 'add' || mode === 'delete' || mode === 'insert' || mode === 'deleteVertex') ? 'line' :
                (mode === 'variants' ? 'variants' : 'preview');


    /* ===== действия ===== */
    const activePanel = useMemo(
        () => panels.find(p => p.id === activePanelId) || panels[0] || null,
        [panels, activePanelId]
    );

    // сколько ручных вершин осталось в активной детали
    const manualLeftInActive = useMemo(() => {
        if (!activePanel) return 0;
        const extras = extraAnchorsByPanel[activePanel.id] || [];
        return extras.filter(a => String(a.id).includes('@m')).length;
    }, [extraAnchorsByPanel, activePanel]);

    const snapEnds = (pts, ax, ay, bx, by) => {
        if (!Array.isArray(pts) || pts.length < 2) return pts;
        const out = pts.slice();
        out[0] = { x: ax, y: ay };
        out[out.length - 1] = { x: bx, y: by };
        return out;
    };

    // определить источник точки по merged-индексу
    const makeRefForMergedIndex = (panel, mi) => {
        const base = panel.anchors || [];
        const extras = extraAnchorsByPanel[panel.id] || [];
        if (mi < base.length) {
            return { type: 'base', panelId: panel.id, anchorIndex: mi };
        }
        const ex = extras[mi - base.length];
        // ex.id = `${curveId}:${k}`
        let curveId = null, subIdx = null;
        if (ex?.id) {
            const [cid, k] = String(ex.id).split(':');
            curveId = cid || null;
            subIdx = k != null ? +k : null;
        }
        return { type: 'extra', panelId: panel.id, curveId, subIdx };
    };

    // idx теперь — индекс в mergedAnchorsOf(activePanel)
    const onAnchorClickAddMode = (idx) => {
        if (!activePanel) return;

        // первый клик — запоминаем начальную вершину
        if (addBuffer == null) {
            setAddBuffer(idx);
            return;
        }

        // клик по той же вершине — игнор
        if (addBuffer === idx) { setAddBuffer(null); return; }

        const merged = mergedAnchorsOf(activePanel);
        const a = merged[addBuffer];
        const b = merged[idx];

        // черновая «прямая» (кубик) между вершинами
        const { c1, c2 } = makeUserCurveBetween(a, b);

        const aRef = makeRefForMergedIndex(activePanel, addBuffer);
        const bRef = makeRefForMergedIndex(activePanel, idx);

        const draft = {
            id: crypto.randomUUID(),
            aIdx: addBuffer, // важно: индексы в merged
            bIdx: idx,
            c1,
            c2,
        };

        // 1) Если вся дискретизация прямой внутри объединения базовых граней —
        //    сохраняем обычный кубик (ровная внутренняя линия).
        const faces = baseFacesByPanel[activePanel.id] || [];
        const allInside = sampleBezierPoints(
            a.x, a.y, c1.x, c1.y, c2.x, c2.y, b.x, b.y, 40
        ).every((pt) => pointInAnyFace(pt, faces));

        if (allInside) {
            if (lineStyle === "straight") {
                // прежнее поведение: внутренняя ровная линия
                applyCurvesChange((map) => {
                    const arr = [...(map[activePanel.id] || [])];
                    arr.push({
                        ...draft,
                        type: "cubic",
                        ax: a.x,
                        ay: a.y,
                        bx: b.x,
                        by: b.y,
                        aRef,
                        bRef,
                        subCount: defaultSubCount
                    });
                    return { ...map, [activePanel.id]: arr };
                }, `Добавить линию прямая`);
            }
            else {
                // внутренняя волнистая линия
                const base = sampleBezierPoints(a.x, a.y, draft.c1.x, draft.c1.y, draft.c2.x, draft.c2.y, b.x, b.y, 64);
                const ampW = waveAmpPx * (scale.k || 1);
                const lambdaW = waveLenPx * (scale.k || 1);
                let wpts = waveAlongPolyline(base, ampW, lambdaW, null);
                wpts = snapEnds(wpts, a.x, a.y, b.x, b.y); // ← фикс концов
                const d = catmullRomToBezierPath(wpts);

                applyCurvesChange((map) => {
                    const arr = [...(map[activePanel.id] || [])];
                    arr.push({
                        id: draft.id,
                        type: "wavy",
                        aIdx: addBuffer, bIdx: idx,
                        d, pts: wpts,
                        // база для пересчёта:
                        basePts: base,                    // ← исходная «ровная» полилиния
                        waveAmpPx, waveLenPx,             // ← параметры в пикселях экрана
                        // остальное
                        ax: a.x, ay: a.y, bx: b.x, by: b.y, aRef, bRef,
                        subCount: defaultSubCount
                    });
                    return { ...map, [activePanel.id]: arr };
                }, `Добавить линию волнистая`);
            }

            //  внутренняя линия добавлена — выходим из обработчика
            setAddBuffer(null);
            return;
        }

        //  иначе (вышла за деталь) — прижатые запрещены
        setToast({ text: "Линия выходит за пределы детали. Прижатые к краю линии отключены." });
        setAddBuffer(null);
        return;
    };

    const cascadeDeleteCurve = (panelId, rootCurveId) => {
        applyCurvesChange(prev => {
            const arr = [...(prev[panelId] || [])];
            const toDelete = new Set([rootCurveId]);
            let changed = true;
            while (changed) {
                changed = false;
                for (const c of arr) {
                    if (toDelete.has(c.id)) continue;
                    const aHit = c.aRef?.type === 'extra' && c.aRef.curveId && toDelete.has(c.aRef.curveId);
                    const bHit = c.bRef?.type === 'extra' && c.bRef.curveId && toDelete.has(c.bRef.curveId);
                    if (aHit || bHit) { toDelete.add(c.id); changed = true; }
                }
            }
            // сброс выбора, если выбранная линия попала в toDelete
            if (selectedCurveKey) {
                const [pid, cid] = selectedCurveKey.split(':');
                if (pid === panelId && toDelete.has(cid)) setSelectedCurveKey(null);
            }
            const kept = arr.filter(c => !toDelete.has(c.id));
            return { ...prev, [panelId]: kept };
        }, "Удалить линию");
    };

    const eraseManualAnchor = (panelId, manual) => {
        const manualId = String(manual?.id ?? '');
        const manualT = Number(manual?.t ?? NaN);
        const curveId = manualId.split('@m')[0];
        if (!curveId) return;

        applyCurvesChange(prev => {
            const list = [...(prev[panelId] || [])];
            const i = list.findIndex(c => c.id === curveId);
            if (i < 0) return prev;

            const cur = list[i];

            let stops = Array.isArray(cur.extraStops) ? cur.extraStops.slice() : [];
            if (stops.length === 0) return prev;
            // поддержим оба формата: [number] и [{t,id?}]
            if (typeof stops[0] === 'number') {
                // удаляем ближайшее по t — индексы не важны
                const idx = Number.isFinite(manualT)
                    ? stops.reduce((best, v, j) =>
                        Math.abs(v - manualT) < Math.abs(stops[best] - manualT) ? j : best, 0)
                    : -1;
                if (idx >= 0) stops.splice(idx, 1);
            } else {
                // объекты вида {t, id?}
                const ts = stops.map(s => s?.t ?? 0);
                let idx = Number.isFinite(manualT)
                    ? ts.reduce((best, v, j) =>
                        Math.abs(v - manualT) < Math.abs(ts[best] - manualT) ? j : best, 0)
                    : -1;
                if (idx >= 0) stops.splice(idx, 1);
            }
            list[i] = { ...cur, extraStops: stops };
            return { ...prev, [panelId]: list };
        }, "Удалить вершину");
    };

    const onCurveEnter = (panelId, id) => {
        if (mode === 'preview')
            return;
        setHoverCurveKey(`${panelId}:${id}`);
    };
    const onCurveLeave = (panelId, id) => {
        if (mode === 'preview')
            return;
        setHoverCurveKey(k => (k === `${panelId}:${id}` ? null : k));
    };
    const onCurveClickDelete = (panelId, id) => {
        if (mode !== "delete") return;
        cascadeDeleteCurve(panelId, id);
        setHoverCurveKey(null);
    };

    const onFaceEnter = (panelId, poly) => { if (mode === "paint") setHoverFace({ panelId, faceKey: faceKey(poly) }); };
    const onFaceLeave = (panelId, poly) => { if (mode === "paint") setHoverFace(h => (h && h.panelId === panelId && h.faceKey === faceKey(poly) ? null : h)); };
    const onFaceClick = (panelId, poly) => {
        if (mode !== "paint") return;
        const fk = faceKey(poly);
        applyFillChange(fs => {
            const i = fs.findIndex(f => f.panelId === panelId && f.faceKey === fk);
            if (i >= 0) { const cp = fs.slice(); cp[i] = { ...cp[i], color: paintColor }; return cp; }
            return [...fs, { id: crypto.randomUUID(), panelId, faceKey: fk, color: paintColor }];
        }, `Заливка (${presetIdx === 0 ? 'Перед' : 'Спинка'})`);

    };
    const onFilledEnter = (panelId, fk) => { if (mode === "deleteFill") setHoverFace({ panelId, faceKey: fk }); };
    const onFilledLeave = (panelId, fk) => { if (mode === "deleteFill") setHoverFace(h => (h && h.panelId === panelId && h.faceKey === fk ? null : h)); };
    const onFilledClick = (panelId, fk) => {
        if (mode !== "deleteFill") return;
        applyFillChange(fs => fs.filter(f => !(f.panelId === panelId && f.faceKey === fk)),
            `Очистка заливки (${presetIdx === 0 ? 'Перед' : 'Спинка'})`);
        setHoverFace(null);
    };

    const [isExporting, setIsExporting] = useState(false);

    const doExportSVG = async () => {
        if (isExporting) return;
        try {
            setIsExporting(true);

            // гарантируем, что обе стороны собраны, даже если вкладку не открывали
            const [frontPanels, backPanels] = await Promise.all([
                (svgCacheRef.current.front?.length ? svgCacheRef.current.front : composePanelsForSide("front", details, manifest)),
                (svgCacheRef.current.back?.length ? svgCacheRef.current.back : composePanelsForSide("back", details, manifest)),
            ]);
            svgCacheRef.current = { ...svgCacheRef.current, front: frontPanels, back: backPanels };

            const svgText = await buildCombinedSVG({
                svgCache: svgCacheRef.current,
                currentPresetId: PRESETS[presetIdx]?.id || "front",
                currentCurves: curvesByPanel,
                currentFills: fills,
                savedByPreset
            });
            downloadText("costume.svg", svgText);
        } finally {
            setIsExporting(false);
        }
    };

    const BP_DEF = {
        hoodie: { chest: "", waist: "", hips: "", height: "", sleeve: "", back: "" },
        pants: { waist: "", hips: "", outseam: "", inseam: "", thigh: "", ankle: "" }
    };

    const OF_DEF = {
        fullName: "", email: "", phone: "", country: "", region: "", city: "",
        district: "", street: "", house: "", apt: "", postal: "", notes: ""
    };

    const [bodyParams, setBodyParams] = useState(() => {
        try { return JSON.parse(localStorage.getItem("ce.bodyParams.v1")) || BP_DEF; } catch { return BP_DEF; }
    });
    const [orderInfo, setOrderInfo] = useState(() => {
        try { return JSON.parse(localStorage.getItem("ce.orderInfo.v1")) || OF_DEF; } catch { return OF_DEF; }
    });

    const isOrderValid = (() => {
        const e = orderInfo?.email?.trim?.() || "";
        const p = orderInfo?.phone?.trim?.() || "";
        const n = orderInfo?.fullName?.trim?.() || "";
        return n.length > 1 && /.+@.+\..+/.test(e) && p.length >= 6;
    })();

    // сохраняем выбранную шею, когда включается капюшон, чтобы вернуть её при выключении
    const prevNeckByFaceRef = useRef({ front: null, back: null });

    // централизованный апдейтер + правила «капюшон ↔ шея»
    const setSlotVariant = (face, slot, variantId) => {
        setDetails(prev => {
            const { nextDetails, nextPrevNeck } = reduceSetSlotVariant(prev, {
                face,
                slot,
                variantId,
                prevNeckByFace: prevNeckByFaceRef.current
            });
            prevNeckByFaceRef.current = nextPrevNeck; // обновили «память шеи»
            return nextDetails;
        });
    };
    const changeKindRef = useRef(null); // 'preset' | 'slot' | null

    const detailsRef = useRef(details);
    const lastChangedSlotRef = useRef(null); // { presetId: 'front'|'back', slot: 'cuff'|... } | null
    const restoringPresetRef = useRef(false); // true — пока восстанавливаем снапшот пресета


    // единая кнопка "Сбросить всё"
    const resetAll = useCallback(() => {
        if (!confirm("Точно сбросить всё? Это удалит заливки и линии на обеих деталях."))
            return;

        // 1) чистим snapshots и состояния
        savedByPresetRef.current = {};
        setSavedByPreset({});
        setCurvesByPanel({});
        setFills([]);
        setActivePanelId(panels[0]?.id ?? null);
        setDetails({ front: {}, back: {} });
        setMode("preview");

        // 2) фиксируем «preview» как последний режим для обеих сторон
        setBothLastModePreview();
    }, [panels, setSavedByPreset, setCurvesByPanel, setFills, setActivePanelId, setDetails, setMode, setPrefs]);

    useEffect(() => {
        try { localStorage.setItem("ce.activeFace", presetIdx === 0 ? "front" : "back"); } catch { }
    }, [presetIdx]);

    useEffect(() => { savedByPresetRef.current = savedByPreset; }, [savedByPreset]);

    useEffect(() => {
        // на время восстановления/переключения пресета — ничего не сохраняем
        if (restoringPresetRef.current) return;
        if (changeKindRef.current === 'preset') return;

        const id = currentPresetIdRef.current;
        const snap = snapshotFor();
        // <-- важное: обновляем ref синхронно, чтобы не было "окна"
        savedByPresetRef.current = { ...savedByPresetRef.current, [id]: snap };
        setSavedByPreset(prev => ({ ...prev, [id]: snap }));
    }, [fills, curvesByPanel, activePanelId]);

    useEffect(() => {
        const target = PRESETS[presetIdx];
        if (!target)
            return;

        // Это именно смена пресета: сразу включаем «замок»,
        // чтобы никакие автосохранения не стреляли не в ту сторону.
        changeKindRef.current = 'preset';
        restoringPresetRef.current = true;               // ← NEW
        // сначала сохраняем СТАРУЮ сторону под её id (и синхронно обновляем ref)
        const oldId = currentPresetIdRef.current;
        const snap = snapshotFor();
        savedByPresetRef.current = { ...savedByPresetRef.current, [oldId]: snap };
        setSavedByPreset(prev => ({ ...prev, [oldId]: snap }));
        // переключаем текущий id на новую сторону
        currentPresetIdRef.current = target.id;
    }, [presetIdx]);

    useEffect(() => {
        try {
            localStorage.setItem("ce.bodyParams.v1", JSON.stringify(bodyParams));
        }
        catch { }
    }, [bodyParams]);

    useEffect(() => {
        try {
            localStorage.setItem("ce.orderInfo.v1", JSON.stringify(orderInfo));
        }
        catch { }
    }, [orderInfo]);

    useEffect(() => {
        const onKey = (e) => {
            const ctrl = e.ctrlKey || e.metaKey;
            if (!ctrl)
                return;

            const k = e.key.toLowerCase();
            if (k === 'z') {
                e.preventDefault();
                if (e.shiftKey)
                    historyRedo();
                else historyUndo();
            }
            else if (k === 'y') {
                e.preventDefault();
                historyRedo();
            }
        };
        window.addEventListener('keydown', onKey);

        return () => window.removeEventListener('keydown', onKey);
    }, [historyUndo, historyRedo]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key.toLowerCase() === 'h') {
                e.preventDefault();
                try { localStorage.removeItem('ce.topbarHint.v1'); } catch { }
                setShowTopbarHint(true);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);


    useEffect(() => {
        try {
            const seen = localStorage.getItem("ce.topbarHint.v1");
            setShowTopbarHint(seen !== "1");
        } catch (e) { /* noop */ }
    }, []);

    useEffect(() => { svgCacheRef.current = svgCache; }, [svgCache]);

    // авто-выход из deleteVertex, когда ручных вершин нет
    useEffect(() => {
        if (mode !== 'deleteVertex') return;
        if (manualLeftInActive === 0) {
            setMode('insert');                     // ← включаем добавление вершин
            setToast({ text: 'Все ручные вершины удалены — переключаюсь в «Вставить вершину»' });
        }
    }, [mode, manualLeftInActive]);

    // Когда входим в preview — снимаем выбор/ховер и сбрасываем буфер добавления
    useEffect(() => {
        if (mode === 'preview') {
            setSelectedCurveKey(null);
            setHoverCurveKey(null);
            setAddBuffer(null);
        }
    }, [mode]);

    useEffect(() => { panelsRef.current = panels; }, [panels]);

    useEffect(() => {
        if (!paletteOpen) return;
        const onKey = (e) => e.key === "Escape" && setPaletteOpen(false);
        const onClick = (e) => {
            if (paletteRef.current && !paletteRef.current.contains(e.target)) setPaletteOpen(false);
        };
        window.addEventListener("keydown", onKey);
        window.addEventListener("pointerdown", onClick);
        return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("pointerdown", onClick); };
    }, [paletteOpen]);

    useEffect(() => {
        if (mode === 'add' || mode === 'delete' || mode === 'insert') setLastLineMode(mode);
    }, [mode]);

    useEffect(() => {
        if (mode !== 'insert') setInsertPreview(null);
    }, [mode]);

    useEffect(() => {
        const el = scopeRef.current;
        if (!el) return;

        const onKey = (e) => {
            const tag = (e.target?.tagName || "").toLowerCase();
            if (["input", "textarea", "select", "button"].includes(tag) || e.target?.isContentEditable) return;
            if (e.ctrlKey || e.metaKey || e.altKey) return;

            const k = e.key.toLowerCase?.();
            if (k === "arrowleft") prevPreset();
            if (k === "arrowright") nextPreset();

            // Быстрый выбор стороны: Q — Перед, W — Спинка
            if (k === "Q" || k === "q") { setPresetIdx(0); e.preventDefault(); }
            if (k === "E" || k === "e") { setPresetIdx(1); e.preventDefault(); }

            if (k === '[') {
                if (panels.length) {
                    const i = Math.max(0, panels.findIndex(p => p.id === activePanel?.id));
                    const prev = panels[(i - 1 + panels.length) % panels.length];
                    setActivePanelId(prev?.id ?? panels[0]?.id ?? null);
                }
            }
            if (k === ']') {
                if (panels.length) {
                    const i = Math.max(0, panels.findIndex(p => p.id === activePanel?.id));
                    const next = panels[(i + 1) % panels.length];
                    setActivePanelId(next?.id ?? panels[0]?.id ?? null);
                }
            }
        };

        el.addEventListener("keydown", onKey);
        return () => el.removeEventListener("keydown", onKey);
    }, [panels, activePanel]);

    useEffect(() => {
        if (!composedPanels)
            return;

        // предотвращаем раннюю чистку fills пока восстанавливаем снапшот пресета
        const kind = changeKindRef.current;
        if (kind === 'preset')
            restoringPresetRef.current = true;

        const parts = composedPanels;

        // старая логика анимации/переключений
        const old = panelsRef.current;
        if (old && old.length) {
            didEverSwapRef.current = true;
            setPrevPanels(old);
            setIsSwapping(true);
            if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
            swapTimerRef.current = setTimeout(() => {
                setPrevPanels(null);
                setIsSwapping(false);
                swapTimerRef.current = null;
            }, SWAP_MS);
        }

        setPanels(parts);

        // обновим карту принадлежности панелей слотам
        const map = new Map();
        for (const p of parts) {
            const slot = p.meta?.slot || null;
            map.set(p.id, slot);
        }
        panelSlotMapRef.current = map;

        // --- основная логика восстановления/сохранения состояния ---
        const presetId = currentPresetIdRef.current;
        const changed = lastChangedSlotRef.current;

        if (kind === 'preset') {
            // 🔹 ТОЛЬКО при смене пресета — восстановить снапшот
            const snap = savedByPresetRef.current[presetId];
            applySnapshot(snap, parts);
        } else if (changed) {
            // 🔹 Смена варианта слота — чистим только затронутые панели
            const { presetId: chPreset, slot: chSlot } = changed;
            if (chPreset === presetId && chSlot) {
                const panelSlotMap = panelSlotMapRef.current;
                setFills(fs => fs.filter(f => panelSlotMap.get(f.panelId) !== chSlot));
                setCurvesByPanel(prev => {
                    const next = { ...prev };
                    for (const pid of Object.keys(next)) {
                        if (panelSlotMap.get(pid) === chSlot) {
                            delete next[pid];
                        }
                    }
                    return next;
                });
            }
        }

        // сбрасываем маркеры после обработки
        changeKindRef.current = null;
        lastChangedSlotRef.current = null;

        if (toast)
            setToast(null);

        // разблокировать чистильщик заливок — следующей микротаской,
        // чтобы успели пересчитаться faces по восстановленным curves/fills
        if (restoringPresetRef.current) {
            setTimeout(() => { restoringPresetRef.current = false; }, 0);
        }

        return () => {
            if (swapTimerRef.current) {
                clearTimeout(swapTimerRef.current);
                swapTimerRef.current = null;
            }
        };
    }, [composedPanels]);

    useLayoutEffect(() => {
        const update = () => {
            const svg = svgRef.current; if (!svg || !panels.length) return;
            const vb = svg.viewBox.baseVal; const kx = vb.width / svg.clientWidth, ky = vb.height / svg.clientHeight;
            setScale({ k: Math.max(kx, ky) });
        };
        update();
        const ro = new ResizeObserver(update); if (svgRef.current) ro.observe(svgRef.current);
        window.addEventListener("resize", update);
        return () => { ro.disconnect(); window.removeEventListener("resize", update); };
    }, [panels.length]);

    // стало — чистим только то, что относится к ТЕКУЩИМ панелям
    useEffect(() => {
        if (restoringPresetRef.current) return;

        // список видимых сейчас панелей (активный пресет)
        const visibleIds = new Set(Object.keys(facesByPanel).map(String));

        setFills(fs =>
            fs.filter(f => {
                const pid = String(f.panelId);

                // если панель не из текущего пресета — ничего не трогаем
                if (!visibleIds.has(pid)) return true;

                // иначе проверяем валидность faceKey внутри этой панели
                const polys = facesByPanel[pid] || [];
                return polys.some(poly => faceKey(poly) === f.faceKey);
            })
        );
    }, [facesByPanel]);

    // Keyboard checker
    useEffect(() => {
        const el = scopeRef.current;
        if (!el) return;

        const onKey = (e) => {
            // работаем только когда фокус внутри редактора
            if (document.activeElement !== el) return;

            if (e.key === 'Escape') {
                setMode('preview');
                setAddBuffer(null); e.preventDefault();
            }
            else if (e.key === 'a' || e.key === 'A') {
                setMode('add');
                setAddBuffer(null);
                e.preventDefault();
            }
            else if (e.key === 'd' || e.key === 'D') {
                setMode('delete');
                e.preventDefault();
            }
            else if (e.key === 'f' || e.key === 'F') {
                setMode('paint');
                e.preventDefault();
            }
            else if (e.key === 'x' || e.key === 'X') {
                setMode('deleteFill');
                e.preventDefault();
            }
            else if (e.key === 'v' || e.key === 'V') {
                setMode('variants');
                e.preventDefault();
            }
        };

        el.addEventListener('keydown', onKey);
        return () => el.removeEventListener('keydown', onKey);
    }, []);

    return (
        <div>
            <div
                ref={scopeRef}
                className={clsx(styles.layout, modeGroup === 'preview' && styles.layoutPreview)}
                tabIndex={0}
                role="region"
                aria-label="Редактор костюма"
            >
                {/* Левая область: канвас */}
                <div className={styles.canvasWrap} onMouseDown={() => scopeRef.current?.focus()}>
                    {toast && (
                        <div className={styles.toast} role="status" aria-live="polite">
                            {toast.text}
                        </div>
                    )}

                    {isLoadingPreset && <div className={styles.loader}>Загрузка…</div>}

                    {/* ВЕРХНЯЯ ПАНЕЛЬ: режимы, деталь, сброс */}
                    <Topbar
                        mode={mode}
                        setMode={setMode}
                        lastLineMode={lastLineMode}
                        setShowTopbarHint={setShowTopbarHint}
                        showTopbarHint={showTopbarHint}
                        dismissTopbarHint={dismissTopbarHint}
                        presetIdx={presetIdx}
                        setPresetIdx={setPresetIdx}
                        resetAll={resetAll}
                        doExportSVG={doExportSVG}
                        isExporting={isExporting}
                    />

                    {/* Стек SVG: предыдущая сцена (для анимации) + текущая */}
                    <CanvasStage
                        mode={mode}
                        scale={scale}
                        facesByPanel={facesByPanel}
                        outerRingByPanel={outerRingByPanel}
                        activePanel={activePanel}
                        onPanelActivate={onPanelActivate}
                        fills={fills}
                        onFilledEnter={onFilledEnter}
                        onFaceEnter={onFaceEnter}
                        onFilledLeave={onFilledLeave}
                        onFaceLeave={onFaceLeave}
                        onFilledClick={onFilledClick}
                        onFaceClick={onFaceClick}
                        onCurveLeave={onCurveLeave}
                        mergedAnchorsOf={mergedAnchorsOf}
                        curvesByPanel={curvesByPanel}
                        setInsertPreview={setInsertPreview}
                        getCursorWorld={getCursorWorld}
                        closestPointOnCurve={closestPointOnCurve}
                        tooCloseToExistingAnchors={tooCloseToExistingAnchors}
                        setInsertPreviewRAF={setInsertPreviewRAF}
                        applyCurvesChange={applyCurvesChange}
                        insertPreview={insertPreview}
                        extraAnchorsByPanel={extraAnchorsByPanel}
                        setHoverAnchorIdx={setHoverAnchorIdx}
                        eraseManualAnchor={eraseManualAnchor}
                        hoverFace={hoverFace}
                        hoverAnchorIdx={hoverAnchorIdx}
                        addBuffer={addBuffer}
                        onAnchorClickAddMode={onAnchorClickAddMode}
                        hoverCurveKey={hoverCurveKey}
                        selectedCurveKey={selectedCurveKey}
                        clickedCurveKey={clickedCurveKey}
                        onCurveEnter={onCurveEnter}
                        setToast={setToast}
                        onCurveClickDelete={onCurveClickDelete}
                        onCurveClick={onCurveClick}
                        svgRef={svgRef}
                        viewBox={viewBox}
                        gridDef={gridDef}
                        svgMountKey={svgMountKey}
                        panels={panels}
                        prevPanels={prevPanels}
                        isSwapping={isSwapping}
                        hoodPanelIds={hoodPanelIds}
                        hoodRings={hoodRings}
                        hoodHoles={hoodHoles}
                        onCanvasClick={onCanvasClick}
                        didEverSwapRef={didEverSwapRef}
                        presetIdx={presetIdx}
                        PRESETS={PRESETS}
                    />

                    {/* навигация пресетов снизу */}
                    <div className={styles.presetNav}>
                        <button className={styles.navBtn} onClick={prevPreset} aria-label="Предыдущая заготовка">⟵</button>
                        <div className={styles.presetChip}>{PRESETS[presetIdx]?.title || "—"}</div>
                        <button className={styles.navBtn} onClick={nextPreset} aria-label="Следующая заготовка">⟶</button>
                    </div>

                </div>

                {/* Правая панель рендерится только вне preview */}
                {
                    modeGroup !== 'preview' && (
                        <SidebarEditor
                            mode={mode}
                            setMode={setMode}
                            modeGroup={modeGroup}
                            paintColor={paintColor}
                            setPaintColor={setPaintColor}
                            paletteOpen={paletteOpen}
                            setPaletteOpen={setPaletteOpen}
                            paletteRef={paletteRef}
                            lineStyle={lineStyle}
                            setLineStyle={setLineStyle}
                            defaultSubCount={defaultSubCount}
                            setDefaultSubCount={setDefaultSubCount}
                            selectedCurveKey={selectedCurveKey}
                            setSelectedCurveKey={setSelectedCurveKey}
                            hoverCurveKey={hoverCurveKey}
                            setHoverCurveKey={setHoverCurveKey}
                            curvesByPanel={curvesByPanel}
                            setCurvesByPanelExtern={applyCurvesChange}
                            recomputeWaveForCurve={recomputeWaveForCurve}
                            waveAmpPx={waveAmpPx}
                            setWaveAmpPx={setWaveAmpPx}
                            waveLenPx={waveLenPx}
                            setWaveLenPx={setWaveLenPx}
                            historyItems={historyItems}
                            historyIndex={historyIndex}
                            historyUndo={historyUndo}
                            historyRedo={historyRedo}
                            canUndo={canUndo}
                            canRedo={canRedo}
                            details={details}
                            setDetails={setDetails}
                            activeDetailId={activeDetailId}
                            setSlotVariant={setSlotVariant}
                        />
                    )
                }
            </div >

            {/* ====== FLOW UNDER THE EDITOR (mini-landing) ====== */}
            < section className={styles.flow} aria-label="Оформление заказа" >
                <div className={styles.flowContainer}>
                    <header className={styles.flowHeader}>
                        <h2 className={styles.flowTitle}>Оформление заказа</h2>
                        <p className={styles.flowSub}>Шаг за шагом: параметры → адрес → финализация</p>
                    </header>

                    {/* Шаг 1 */}
                    <div className={styles.stepCard} id="step-body">
                        <div className={styles.stepTitle}><span className={styles.stepBadge}>1</span> Параметры тела</div>
                        <BodyParams value={bodyParams} onChange={setBodyParams} />
                    </div>

                    {/* Шаг 2 */}
                    <div className={styles.stepCard} id="step-order">
                        <div className={styles.stepTitle}><span className={styles.stepBadge}>2</span> Данные и адрес доставки</div>
                        <OrderForm value={orderInfo} onChange={setOrderInfo} />
                    </div>

                    {/* CTA */}
                    <div className={styles.ctaBar}>
                        <button
                            type="button"
                            className={styles.ctaButton}
                            disabled={!isOrderValid}
                            onClick={() => {
                                // временно: просто подсветим недостающие поля/сохраним
                                if (!isOrderValid) { alert("Заполни ФИО, email и телефон — и поехали!"); return; }
                                // тут позже: переход на страницу финализации с превью
                                console.log("Finalize payload", { bodyParams, orderInfo, fills, curvesByPanel });
                            }}
                        >
                            Перейти к финализации
                        </button>
                        {!isOrderValid && <div className={styles.ctaNote}>Чтобы активировать кнопку, заполни ФИО, email и телефон.</div>}
                    </div>
                </div>
            </section >

        </div >
    );
}