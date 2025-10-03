// CostumeEditor.jsx
import { useEffect, useMemo, useRef, useState, useLayoutEffect, useCallback } from "react";
import styles from "./CostumeEditor.module.css";
import clsx from "clsx";
import {
    area, getBounds, sampleBezier, sampleBezierPoints,
    pointsToPairedPolyline, waveAlongPolyline, segsSignature, cumulativeLengths,
    nearestOnPolyline
} from "../../utils/geometry.js";
import {
    polylinesFromSegs, segmentsFromPolylines, splitSegsIntoSubpaths, polylineFromSubpath,
    catmullRomToBezierPath, facePath, faceKey, segsToD
} from "../../utils/svgParse.js";
import { splitByIntersections } from "../../utils/intersections.js";
import { buildFacesFromSegments, extractPanels, pointInAnyFace } from "../../utils/panels.js";
import { makeUserCurveBetween } from "../../utils/routes.js";
import { applyMatrixToSegs } from "../../utils/transforms.js";
import { collectAnchors } from "../../utils/anchors.js";

// --- PRESETS: базовая папка с заранее подготовленными SVG
const SVG_BASE = "/2d/svg/Hoodie";
// Каждый preset может быть single-file (file) или multi-file (sources[])
const PRESETS = [
    {
        id: "front",
        title: "Перед",
        sources: [
            // Файлы из public/2d/svg/Hoodie/Front/*.svg
            // dx/dy/scale — опциональны; начните с 0,0,1, а потом подправите позиции.
            { file: "Front/body.svg", dx: 0, dy: 0, scale: 1, idPrefix: "F-B", labelPrefix: "Front • " },
            { file: "Front/belt.svg", dx: 0, dy: 0, scale: 1, idPrefix: "F-Be", labelPrefix: "Front • " },
            { file: "Front/sleeve_left.svg", dx: 0, dy: 0, scale: 1, idPrefix: "F-SL", labelPrefix: "Front • " },
            { file: "Front/sleeve_right.svg", dx: 0, dy: 0, scale: 1, idPrefix: "F-SR", labelPrefix: "Front • " },
            { file: "Front/cuff_left.svg", dx: 0, dy: 0, scale: 1, idPrefix: "F-CL", labelPrefix: "Front • " },
            { file: "Front/cuff_right.svg", dx: 0, dy: 0, scale: 1, idPrefix: "F-CR", labelPrefix: "Front • " },
        ]
    },
    {
        id: "back",
        title: "Спинка",
        sources: [
            // Файлы из public/2d/svg/Hoodie/Back/*.svg
            { file: "Back/body.svg", dx: 0, dy: 0, scale: 1, idPrefix: "B-B", labelPrefix: "Back • " },
            { file: "Back/belt.svg", dx: 0, dy: 0, scale: 1, idPrefix: "B-Be", labelPrefix: "Back • " },
            { file: "Back/sleeve_left.svg", dx: 0, dy: 0, scale: 1, idPrefix: "B-SL", labelPrefix: "Back • " },
            { file: "Back/sleeve_right.svg", dx: 0, dy: 0, scale: 1, idPrefix: "B-SR", labelPrefix: "Back • " },
            { file: "Back/cuff_left.svg", dx: 0, dy: 0, scale: 1, idPrefix: "B-CL", labelPrefix: "Back • " },
            { file: "Back/cuff_right.svg", dx: 0, dy: 0, scale: 1, idPrefix: "B-CR", labelPrefix: "Back • " },
        ]
    },

    // Оставляем совместимость с одиночными файлами на всякий случай:
    { id: "front_legacy", title: "Перед (single)", file: "Front.svg" },
    { id: "back_legacy", title: "Спинка (single)", file: "Back.svg" },
];


/* ================== компонент ================== */
export default function CostumeEditor({ initialSVG }) {
    const scopeRef = useRef(null);
    const [composedPanels, setComposedPanels] = useState(null);
    // кеш SVG по пресетам и сохранённые пользовательские состояния по пресетам
    const [svgCache, setSvgCache] = useState({}); // { [presetId]: rawSVG }
    const [savedByPreset, setSavedByPreset] = useState({}); // { [presetId]: { curvesByPanel, fills, activePanelId } }
    const currentPresetIdRef = useRef(PRESETS[0]?.id || "front");
    // минимальный зазор между вершинами (в мировых единицах SVG)
    const [minGapWorld, setMinGapWorld] = useState(20); // подредактируете под «5 см» в своих единицах
    // превью точки для вставки вершины
    const [insertPreview, setInsertPreview] = useState(null); // { panelId, curveId, x, y, allowed }
    // state для «запоминания» последнего подрежима
    const [lastFillMode, setLastFillMode] = useState('paint');   // 'paint' | 'deleteFill'
    const [lastLineMode, setLastLineMode] = useState('add');     // 'add' | 'delete
    const [rawSVG, setRawSVG] = useState(initialSVG || "");
    const [panels, setPanels] = useState([]);
    const [activePanelId, setActivePanelId] = useState(null);
    // для анимации "из-за спины"
    const [prevPanels, setPrevPanels] = useState(null);
    const [isSwapping, setIsSwapping] = useState(false);
    const SWAP_MS = 420;
    const didEverSwapRef = useRef(false);
    const swapTimerRef = useRef(null);
    // чтобы поймать "старые" панели до перезаписи
    const panelsRef = useRef(panels);
    // --- PRESETS state
    const [presetIdx, setPresetIdx] = useState(0);   // 0: Перед, 1: Спинка
    const [isLoadingPreset, setIsLoadingPreset] = useState(false);
    // красивый ре-монтаж svg при смене пресета (для анимации появления)
    const [svgMountKey, setSvgMountKey] = useState(0);
    // кривые: 'cubic' или 'routed' (по контуру)
    const [curvesByPanel, setCurvesByPanel] = useState({});
    const [fills, setFills] = useState([]);
    const [paintColor, setPaintColor] = useState("#f26522");
    const [mode, setMode] = useState("preview");
    const [addBuffer, setAddBuffer] = useState(null);
    const [hoverAnchorIdx, setHoverAnchorIdx] = useState(null);
    const [hoverCurveKey, setHoverCurveKey] = useState(null);
    const [clickedCurveKey, setClickedCurveKey] = useState(null);
    const [hoverFace, setHoverFace] = useState(null);
    const [toast, setToast] = useState(null);
    // тип пользовательской линии
    const [lineStyle, setLineStyle] = useState("straight"); // 'straight' | 'wavy'
    // параметры волны (в пикселях экрана)
    const [waveAmpPx, setWaveAmpPx] = useState(6);
    const [waveLenPx, setWaveLenPx] = useState(36);
    const [paletteOpen, setPaletteOpen] = useState(false);
    const paletteRef = useRef(null);
    const translateScaleMatrix = (dx = 0, dy = 0, s = 1) => ({ a: s, b: 0, c: 0, d: s, e: dx, f: dy });

    // Загружает пресет: если sources[] — склеивает их в один набор панелей; если file — вернёт строку SVG (как раньше)
    const loadPresetToPanels = async (preset) => {
        if (Array.isArray(preset.sources) && preset.sources.length) {
            const partsAll = [];
            for (let i = 0; i < preset.sources.length; i++) {
                const src = preset.sources[i];
                const txt = await fetch(`${SVG_BASE}/${src.file}`).then(r => r.text());
                const parts = extractPanels(txt); // парсим в панели (как обычно)
                const M = translateScaleMatrix(src.dx || 0, src.dy || 0, src.scale || 1);

                for (const p of parts) {
                    const segsT = applyMatrixToSegs(p.segs, M);
                    partsAll.push({
                        id: `${src.idPrefix || (i + 1)}-${p.id}`,
                        label: `${src.labelPrefix || ""}${p.label || p.id}`,
                        segs: segsT,
                        anchors: collectAnchors(segsT),
                    });
                }
            }
            return partsAll;
        }

        // single-file режим — сохраняем прежнее поведение
        const txt = await fetch(`${SVG_BASE}/${preset.file}`).then(r => r.text());
        return txt;
    };

    // --- PRESETS: кнопки/клавиши
    const prevPreset = () => setPresetIdx(i => (i - 1 + PRESETS.length) % PRESETS.length);
    const nextPreset = () => setPresetIdx(i => (i + 1) % PRESETS.length);
    // общий bbox сцены — используется и для viewBox, и для сетки
    const worldBBox = useMemo(() => {
        let bb = null;
        for (const p of panels) {
            const b = getBounds(p.segs);
            if (!bb) bb = { ...b };
            else {
                const x1 = Math.min(bb.x, b.x);
                const y1 = Math.min(bb.y, b.y);
                const x2 = Math.max(bb.x + bb.w, b.x + b.w);
                const y2 = Math.max(bb.y + bb.h, b.y + b.h);
                bb = { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
            }
        }
        return bb || { x: 0, y: 0, w: 800, h: 500 };
    }, [panels]);
    // осн. окно на основе общего bbox
    const viewBox = useMemo(() => {
        const pad = Math.max(worldBBox.w, worldBBox.h) * 0.06;
        return `${worldBBox.x - pad} ${worldBBox.y - pad} ${worldBBox.w + pad * 2} ${worldBBox.h + pad * 2}`;
    }, [worldBBox]);
    const svgRef = useRef(null);
    const [scale, setScale] = useState({ k: 1 });
    const baseFacesCacheRef = useRef(new Map()); // panelId -> { sig, faces }

    const snapshotFor = useCallback(() => ({
        curvesByPanel,
        fills,
        activePanelId,
    }), [curvesByPanel, fills, activePanelId]);

    const applySnapshot = useCallback((snap, panelsParsed) => {
        // Если есть снимок — восстановим, иначе дефолты
        setCurvesByPanel(snap?.curvesByPanel || {});
        setFills(snap?.fills || []);
        setActivePanelId(snap?.activePanelId || panelsParsed[0]?.id || null);
        setMode("preview");
    }, []);


    const closestPointOnCurve = (panel, curve, P) => {
        // возвращает {x,y,t,total,poly,L} где t — доля 0..1
        let poly = null;
        if (curve.type === 'cubic') {
            const a = panel.anchors?.[curve.aIdx] ?? (curve.ax != null ? { x: curve.ax, y: curve.ay } : null);
            const b = panel.anchors?.[curve.bIdx] ?? (curve.bx != null ? { x: curve.bx, y: curve.by } : null);
            if (!a || !b) return null;
            poly = sampleBezierPoints(a.x, a.y, curve.c1.x, curve.c1.y, curve.c2.x, curve.c2.y, b.x, b.y, 128);
        } else if (Array.isArray(curve.pts)) {
            poly = curve.pts;
        }
        if (!poly || poly.length < 2 || !P) return null;
        const near = nearestOnPolyline(poly, P);               // ✅ сюда передаём координату курсора
        const L = cumulativeLengths(poly);
        const total = L[L.length - 1] || 1;
        const t = total > 0 ? near.s / total : 0;
        return { x: near.x, y: near.y, t, total, poly, L };
    };

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
        return pts.some(q => Math.hypot(q.x - testPt.x, q.y - testPt.y) < (minGapWorld || 0));
    };

    /* -------- базовые faces и кольца контура -------- */
    const baseFacesByPanel = useMemo(() => {
        const res = {};
        for (const p of panels) {
            const sig = segsSignature(p.segs);
            const cached = baseFacesCacheRef.current.get(p.id);
            if (cached && cached.sig === sig) {
                res[p.id] = cached.faces;
                continue;
            }
            const baseLines = polylinesFromSegs(p.segs);
            const segsFlat = segmentsFromPolylines(baseLines);
            const faces = buildFacesFromSegments(splitByIntersections(segsFlat));
            baseFacesCacheRef.current.set(p.id, { sig, faces });
            res[p.id] = faces;
        }
        return res;
    }, [panels]);

    const ringsByPanel = useMemo(() => {
        const res = {};
        for (const p of panels) {
            const subs = splitSegsIntoSubpaths(p.segs);
            res[p.id] = subs.map(polylineFromSubpath).filter(r => r.length >= 3);
        }
        return res;
    }, [panels]);

    const [defaultSubCount, setDefaultSubCount] = useState(2); // используется только при создании новых линий
    const [selectedCurveKey, setSelectedCurveKey] = useState(null); // `${panelId}:${curveId}`

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
        if (mode === "preview") return;      // в preview ничего не делаем
        if (mode !== "delete") {
            setSelectedCurveKey(null);
        }
    }, [mode]);

    const onPanelActivate = (panelId) => {
        if (mode === 'preview') return;
        // В режиме заливки не мешаем покраске
        if (mode === 'paint' || mode === 'deleteFill') return;
        setActivePanelId(panelId);
        setSelectedCurveKey(null);
        setHoverCurveKey(null);
        setAddBuffer(null);
    };

    const recomputeWaveForCurve = (pid, cid, ampPx, lenPx) => {
        setCurvesByPanel(prev => {
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
        });
    };

    // линейная интерполяция точки на полилинии по «дуговой длине»
    const pointAtS = (pts, Larr, s) => {
        // Larr — cumulativeLengths(pts)
        const total = Larr[Larr.length - 1] || 1;
        const t = Math.max(0, Math.min(total, s));
        let i = 0;
        while (i + 1 < Larr.length && Larr[i + 1] < t) i++;
        const l0 = Larr[i], l1 = Larr[Math.min(Larr.length - 1, i + 1)];
        const p0 = pts[i], p1 = pts[Math.min(pts.length - 1, i + 1)];
        const seg = Math.max(1e-12, l1 - l0);
        const a = (t - l0) / seg;
        return { x: p0.x + (p1.x - p0.x) * a, y: p0.y + (p1.y - p0.y) * a };
    };

    //вычисляем «экстра-якоря» (виртуальные вершины) для всех кривых панели
    const extraAnchorsByPanel = useMemo(() => {
        const map = {};
        for (const p of panels) {
            const arr = [];
            const curves = (curvesByPanel[p.id] || []);
            for (const c of curves) {
                // получаем опорные точки полилинии кривой
                let poly = null;
                if (c.type === "cubic") {
                    const a = p.anchors?.[c.aIdx] ?? (c.ax != null ? { x: c.ax, y: c.ay } : null);
                    const b = p.anchors?.[c.bIdx] ?? (c.bx != null ? { x: c.bx, y: c.by } : null);
                    if (!a || !b) continue;
                    poly = sampleBezierPoints(a.x, a.y, c.c1.x, c.c1.y, c.c2.x, c.c2.y, b.x, b.y, 128);
                } else {
                    // для wavy берём дискретизацию самой линии
                    if (Array.isArray(c.pts) && c.pts.length >= 2) {
                        poly = c.pts;
                    } else {
                        continue;
                    }
                }

                if (!poly || poly.length < 2) continue;

                const L = cumulativeLengths(poly);
                const total = L[L.length - 1] || 1;
                const n = Math.max(2, Math.min(10, c?.subCount ?? defaultSubCount ?? 2));
                for (let k = 1; k <= n; k++) {
                    const s = (total * k) / (n + 1);
                    const pt = pointAtS(poly, L, s);
                    arr.push({ id: `${c.id}:${k}`, x: pt.x, y: pt.y });
                }

                // ручные точки (новое): extraStops — доли 0..1
                if (Array.isArray(c.extraStops)) {
                    c.extraStops.forEach((stop, idx) => {
                        const t = typeof stop === 'number' ? stop : (stop?.t ?? 0);
                        const s = Math.max(0, Math.min(1, t)) * total;
                        const pt = pointAtS(poly, L, s);
                        // id можно оставить индексный — удалять будем по t:
                        arr.push({ id: `${c.id}@m${idx}`, x: pt.x, y: pt.y, t });
                    });
                }
            }
            map[p.id] = arr;
        }
        return map;
    }, [panels, curvesByPanel, defaultSubCount]);

    // утилита для объединённого списка вершин панели
    const mergedAnchorsOf = useCallback((p) => {
        const extras = extraAnchorsByPanel[p.id] || [];
        // порядок важен: базовые, затем дополнительные — индексы merged совпадут с кликами
        return [...(p.anchors || []), ...extras];
    }, [extraAnchorsByPanel]);

    // faces с учётом пользовательских линий
    const facesByPanel = useMemo(() => {
        const res = {};
        for (const p of panels) {
            const baseLines = polylinesFromSegs(p.segs);
            const merged = mergedAnchorsOf(p);

            const userLines = (curvesByPanel[p.id] || []).flatMap(c => {
                if (c.type === "cubic") {
                    const a = merged[c.aIdx] ?? (c.ax != null ? { x: c.ax, y: c.ay } : null);
                    const b = merged[c.bIdx] ?? (c.bx != null ? { x: c.bx, y: c.by } : null);
                    if (!a || !b) return []; // пропускаем некорректную кривую
                    return [sampleBezier(a.x, a.y, c.c1.x, c.c1.y, c.c2.x, c.c2.y, b.x, b.y)];
                }
                else {
                    // wavy: используем уже дискретизированные точки линии
                    if (Array.isArray(c.pts) && c.pts.length >= 2) {
                        return [pointsToPairedPolyline(c.pts)];
                    }
                    return [];
                }
            });

            const segsFlat = segmentsFromPolylines([...baseLines, ...userLines]);
            res[p.id] = buildFacesFromSegments(splitByIntersections(segsFlat));
        }
        return res;
    }, [panels, curvesByPanel, mergedAnchorsOf]);

    const modeGroup =
        (mode === 'paint' || mode === 'deleteFill') ? 'fill' :
            (mode === 'add' || mode === 'delete' || mode === 'insert' || mode === 'deleteVertex') ? 'line' : 'preview';

    const gridDef = useMemo(() => {
        const step = Math.max(1e-6, Math.min(worldBBox.w, worldBBox.h) / 20);
        return { step, b: { x: worldBBox.x, y: worldBBox.y, w: worldBBox.w, h: worldBBox.h } };
    }, [worldBBox]);

    const outerRingByPanel = useMemo(() => {
        const res = {};
        for (const p of panels) {
            const rings = ringsByPanel[p.id] || [];
            if (!rings.length) { res[p.id] = null; continue; }
            let best = null, bestA = -Infinity;
            for (const r of rings) {
                const A = Math.abs(area(r));
                if (A > bestA) { bestA = A; best = r; }
            }
            res[p.id] = best;
        }
        return res;
    }, [panels, ringsByPanel]);
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
                setCurvesByPanel((map) => {
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
                });
            }
            else {
                // внутренняя волнистая линия
                const base = sampleBezierPoints(a.x, a.y, draft.c1.x, draft.c1.y, draft.c2.x, draft.c2.y, b.x, b.y, 64);
                const ampW = waveAmpPx * (scale.k || 1);
                const lambdaW = waveLenPx * (scale.k || 1);
                let wpts = waveAlongPolyline(base, ampW, lambdaW, null);
                wpts = snapEnds(wpts, a.x, a.y, b.x, b.y); // ← фикс концов
                const d = catmullRomToBezierPath(wpts);

                setCurvesByPanel((map) => {
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
                });
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
        setCurvesByPanel(prev => {
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
        });
    };

    const eraseManualAnchor = (panelId, manual) => {
        const manualId = String(manual?.id ?? '');
        const manualT = Number(manual?.t ?? NaN);
        const curveId = manualId.split('@m')[0];
        if (!curveId) return;

        setCurvesByPanel(prev => {
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
        });
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
        setFills(fs => {
            const i = fs.findIndex(f => f.panelId === panelId && f.faceKey === fk);
            if (i >= 0) { const cp = fs.slice(); cp[i] = { ...cp[i], color: paintColor }; return cp; }
            return [...fs, { id: crypto.randomUUID(), panelId, faceKey: fk, color: paintColor }];
        });
    };
    const onFilledEnter = (panelId, fk) => { if (mode === "deleteFill") setHoverFace({ panelId, faceKey: fk }); };
    const onFilledLeave = (panelId, fk) => { if (mode === "deleteFill") setHoverFace(h => (h && h.panelId === panelId && h.faceKey === fk ? null : h)); };
    const onFilledClick = (panelId, fk) => {
        if (mode !== "deleteFill") return;
        setFills(fs => fs.filter(f => !(f.panelId === panelId && f.faceKey === fk)));
        setHoverFace(null);
    };

    useEffect(() => { svgCache.current = svgCache; }, [svgCache]);

    // авто-выход из deleteVertex, когда ручных вершин нет
    useEffect(() => {
        if (mode !== 'deleteVertex') return;
        if (manualLeftInActive === 0) {
            setMode('insert');                     // ← включаем добавление вершин
            setToast({ text: 'Все ручные вершины удалены — переключаюсь в «Вставить вершину»' });
        }
    }, [mode, manualLeftInActive]);

    useEffect(() => {
        if (initialSVG) return; // внешний SVG — не трогаем

        const target = PRESETS[presetIdx];
        if (!target) return;

        let alive = true;
        setIsLoadingPreset(true);

        // сохраним снапшот предыдущего пресета
        const prevId = currentPresetIdRef.current;
        setSavedByPreset(prev => ({ ...prev, [prevId]: snapshotFor() }));
        currentPresetIdRef.current = target.id;

        (async () => {
            try {

                // 0) Кэш: если уже загружали этот пресет — не фетчим снова
                const cached = svgCache.current[target.id];
                if (cached !== undefined) {
                    if (Array.isArray(cached)) {
                        setComposedPanels(cached);
                        setRawSVG(`<!-- COMPOSED:${target.id} -->`);
                    } else {
                        setComposedPanels(null);
                        setRawSVG(cached); // строка SVG
                    }
                    setSvgMountKey(k => k + 1);
                    setIsLoadingPreset(false);
                    return;
                }

                const loaded = await loadPresetToPanels(target);
                if (!alive) return;

                if (Array.isArray(loaded)) {
                    setComposedPanels(loaded);                 // множественные панели
                    setRawSVG(`<!-- COMPOSED:${target.id} -->`); // мягкий триггер для пайплайна
                    setSvgCache(prev => ({ ...prev, [target.id]: loaded }));
                }
                else {
                    setComposedPanels(null);                   // одиночный SVG
                    setRawSVG(loaded);
                    setSvgCache(prev => ({ ...prev, [target.id]: loaded }));
                }
                setSvgMountKey(k => k + 1);
            }
            catch (e) {
                if (alive) { setComposedPanels(null); setRawSVG(""); }
            }
            finally {
                if (alive) setIsLoadingPreset(false);
            }
        })();

        return () => { alive = false; };
    }, [presetIdx, initialSVG]);


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
        if (mode === 'paint' || mode === 'deleteFill') setLastFillMode(mode);
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
        if (!rawSVG && !composedPanels) return;

        const parts = Array.isArray(composedPanels) ? composedPanels : extractPanels(rawSVG);

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

        // восстановить сохранённый снапшот для текущего пресета
        const presetId = currentPresetIdRef.current;
        const snap = savedByPreset[presetId];
        applySnapshot(snap, parts);

        // диагностика «пустого» SVG только для одиночного режима
        if (!parts.length && !composedPanels) {
            const hasImage = /<image\b[^>]+(?:href|xlink:href)=["']data:image\//i.test(rawSVG) ||
                /<image\b[^>]+(?:href|xlink:href)=["'][^"']+\.(png|jpe?g|webp)/i.test(rawSVG);
            const hasForeign = /<foreignObject\b/i.test(rawSVG);
            const hasVectorTags = /<(path|polygon|polyline|rect|circle|ellipse|line)\b/i.test(rawSVG);

            let msg =
                "В SVG не найдено векторных контуров для деталей. Экспортируйте выкройку как вектор (path/polygon/polyline/rect/circle/ellipse/line).";

            if (hasImage && !hasVectorTags) {
                msg = "Похоже, это растровая картинка, встроенная в SVG (<image>). Нужно экспортировать именно векторные контуры.";
            } else if (hasForeign && !hasVectorTags) {
                msg = "Файл использует <foreignObject>. Экспортируйте чистый векторный SVG без foreignObject.";
            }

            setToast({ text: msg });
        } else {
            if (toast) setToast(null);
        }

        return () => {
            if (swapTimerRef.current) {
                clearTimeout(swapTimerRef.current);
                swapTimerRef.current = null;
            }
        };
    }, [rawSVG, composedPanels]);


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

    useEffect(() => {
        setFills(fs => fs.filter(f => (facesByPanel[f.panelId] || []).some(poly => faceKey(poly) === f.faceKey)));
    }, [facesByPanel]);

    useEffect(() => {
        const el = scopeRef.current;
        if (!el) return;

        const onKey = (e) => {
            // работаем только когда фокус внутри редактора
            if (document.activeElement !== el) return;

            if (e.key === 'Escape') { setMode('preview'); setAddBuffer(null); e.preventDefault(); }
            else if (e.key === 'a' || e.key === 'A') { setMode('add'); setAddBuffer(null); e.preventDefault(); }
            else if (e.key === 'd' || e.key === 'D') { setMode('delete'); e.preventDefault(); }
            else if (e.key === 'f' || e.key === 'F') { setMode('paint'); e.preventDefault(); }
            else if (e.key === 'x' || e.key === 'X') { setMode('deleteFill'); e.preventDefault(); }
        };

        el.addEventListener('keydown', onKey);
        return () => el.removeEventListener('keydown', onKey);
    }, []);

    return (
        <div ref={scopeRef} className={styles.layout} tabIndex={0}>
            <div className={styles.canvasWrap} onMouseDown={() => scopeRef.current?.focus()}>
                {toast && <div className={styles.toast}>{toast.text}</div>}
                {isLoadingPreset && <div className={styles.loader}>Загрузка…</div>}

                {/* === два слоя поверх друг друга === */}
                <div className={styles.canvasStack}>
                    {/* нижний: предыдущая сцена (только outline), без интерактивности */}
                    {prevPanels && (
                        <svg
                            className={`${styles.canvas} ${styles.stage} ${styles.swapOut}`}
                            viewBox={viewBox}
                            preserveAspectRatio="xMidYMid meet"
                            style={{ pointerEvents: "none" }}
                        >
                            <g>
                                {prevPanels.map(p => (
                                    <path
                                        key={`prev-${p.id}`}
                                        d={segsToD(p.segs)}
                                        fill="none"
                                        stroke="#c9ced6"
                                        strokeWidth={1.2}
                                        vectorEffect="non-scaling-stroke"
                                    />
                                ))}
                            </g>
                        </svg>
                    )}

                    {/* верхний: текущая (новая) сцена — полноценный интерактивный рендер */}
                    <svg
                        key={svgMountKey} // у вас уже есть, оставляем — красиво монтирует svg
                        ref={svgRef}
                        className={`${styles.canvas} ${styles.stage} ${isSwapping ? styles.swapIn : (!didEverSwapRef.current ? styles.svgEnter : "")}`}
                        viewBox={viewBox}
                        preserveAspectRatio="xMidYMid meet"
                        onClick={onCanvasClick}
                    >
                        {/* GRID */}
                        <defs>
                            <pattern id={`grid-${svgMountKey}`} width={gridDef.step} height={gridDef.step} patternUnits="userSpaceOnUse">
                                <path d={`M ${gridDef.step} 0 L 0 0 0 ${gridDef.step}`} fill="none"
                                    stroke="#000" strokeOpacity=".06" strokeWidth={0.6 * (scale.k || 1)} />
                            </pattern>
                        </defs>
                        <rect x={gridDef.b.x} y={gridDef.b.y} width={gridDef.b.w} height={gridDef.b.h} fill={`url(#grid-${svgMountKey})`} />

                        {/* FILLS + OUTLINES + CURVES + ANCHORS */}
                        {panels.map(p => {
                            const faces = facesByPanel[p.id] || [];
                            const ring = outerRingByPanel[p.id];
                            const isActive = activePanel?.id === p.id;

                            const clickableFaces = faces.length ? faces : (ring ? [ring] : []);
                            const dimInactive = mode !== 'preview' && !isActive;

                            return (
                                <g key={p.id} className={dimInactive ? styles.panelDimmed : undefined}>

                                    {/* hit-target для выбора детали (только не заливка/preview) */}
                                    {ring && (mode !== 'preview') && (mode !== 'paint') && (mode !== 'deleteFill') && (
                                        <path
                                            d={facePath(ring)}
                                            fill="transparent"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => onPanelActivate(p.id)}
                                        />
                                    )}

                                    {clickableFaces.map(poly => {
                                        const fk = faceKey(poly);
                                        const fill = (fills.find(f => f.panelId === p.id && f.faceKey === fk)?.color) || "none";
                                        const hasFill = fill !== "none";
                                        const isHover = !!hoverFace && hoverFace.panelId === p.id && hoverFace.faceKey === fk;
                                        const canFaceHit = mode === 'paint' || mode === 'deleteFill';

                                        return (
                                            <g key={fk}>
                                                <path
                                                    d={facePath(poly)}
                                                    fill={hasFill ? fill : (mode === 'paint' && isHover ? '#9ca3af' : 'transparent')}
                                                    fillOpacity={hasFill ? 0.9 : (mode === 'paint' && isHover ? 0.35 : 0.001)}
                                                    stroke="none"
                                                    style={{ pointerEvents: canFaceHit ? 'all' : 'none', cursor: canFaceHit ? 'pointer' : 'default' }}
                                                    onMouseEnter={() => hasFill ? onFilledEnter(p.id, fk) : onFaceEnter(p.id, poly)}
                                                    onMouseLeave={() => hasFill ? onFilledLeave(p.id, fk) : onFaceLeave(p.id, poly)}
                                                    onClick={() => hasFill ? onFilledClick(p.id, fk) : onFaceClick(p.id, poly)}
                                                />
                                                {/* оверлей для deleteFill: слегка затемняем уже залитую грань при ховере */}
                                                {hasFill && mode === 'deleteFill' && isHover && (
                                                    <path
                                                        key={`${fk}-overlay`}
                                                        d={facePath(poly)}
                                                        fill="#000"
                                                        fillOpacity={0.18}
                                                        style={{ pointerEvents: 'none' }}
                                                    />
                                                )}
                                            </g>
                                        );
                                    })}

                                    {/* внешний контур — без событий, чтобы не перекрывал клики */}
                                    {ring && (
                                        <path
                                            d={facePath(ring)}
                                            fill="none"
                                            stroke="#111"
                                            strokeWidth={1.8 * (scale.k || 1)}
                                            style={{ pointerEvents: "none" }}   // важно
                                        />
                                    )}

                                    {/* USER CURVES (швы/линии пользователя) */}
                                    {(curvesByPanel[p.id] || []).map(c => {
                                        const merged = mergedAnchorsOf(p);
                                        const a = merged[c.aIdx] ?? (c.ax != null ? { x: c.ax, y: c.ay } : null);
                                        const b = merged[c.bIdx] ?? (c.bx != null ? { x: c.bx, y: c.by } : null);
                                        if (!a || !b)
                                            return null;

                                        const d = c.type === 'cubic'
                                            ? `M ${a.x} ${a.y} C ${c.c1.x} ${c.c1.y} ${c.c2.x} ${c.c2.y} ${b.x} ${b.y}`
                                            : c.d; // 'routed'/'wavy'

                                        const key = `${p.id}:${c.id}`;
                                        const isHover = hoverCurveKey === key;
                                        const isSelected = selectedCurveKey === key;
                                        const isClicked = clickedCurveKey === key;
                                        const cls = clsx(
                                            styles.userCurve,
                                            mode === 'preview' && styles.userCurvePreview,   // мягче в preview
                                            (mode === 'delete' && isHover) && styles.userCurveDeleteHover, // красный в delete
                                            isSelected && styles.userCurveSelected,          // выбранная линия (толще/подсветка)
                                            isClicked && styles.userCurveClicked             // короткая вспышка при клике
                                        );
                                        return (
                                            <path
                                                key={c.id}
                                                d={d}
                                                className={cls}
                                                onMouseEnter={() => { if (isActive) onCurveEnter(p.id, c.id); }}
                                                onMouseLeave={(e) => {
                                                    if (mode === 'insert') setInsertPreview(prev => (prev && prev.curveId === c.id ? null : prev));
                                                    onCurveLeave(p.id, c.id);
                                                }}
                                                onMouseMove={(e) => {
                                                    if (!isActive || mode !== 'insert') return;
                                                    const svg = svgRef.current; if (!svg) return;
                                                    const p2 = svg.createSVGPoint(); p2.x = e.clientX; p2.y = e.clientY;
                                                    const loc = p2.matrixTransform(svg.getScreenCTM().inverse());
                                                    // ближайшая точка
                                                    const hit = closestPointOnCurve(p, c, loc);
                                                    if (!hit) return;
                                                    const allowed = !tooCloseToExistingAnchors(p, c, { x: hit.x, y: hit.y });
                                                    setInsertPreview({ panelId: p.id, curveId: c.id, x: hit.x, y: hit.y, t: hit.t, allowed });
                                                }}
                                                onClick={(e) => {
                                                    if (!isActive) return;
                                                    if (mode === 'insert') {
                                                        if (!selectedCurveKey)
                                                            setSelectedCurveKey(`${p.id}:${c.id}`); // выделяем текущую линию

                                                        e.stopPropagation();
                                                        if (!insertPreview || insertPreview.curveId !== c.id) return;
                                                        if (!insertPreview.allowed) {
                                                            setToast({ text: 'Слишком близко к существующей вершине' });
                                                            return;
                                                        }
                                                        // добавляем ручную стоп-метку в кривую
                                                        setCurvesByPanel(prev => {
                                                            const list = [...(prev[p.id] || [])];
                                                            const i = list.findIndex(x => x.id === c.id);
                                                            if (i < 0) return prev;
                                                            const cur = list[i];
                                                            const stops = Array.isArray(cur.extraStops) ? [...cur.extraStops] : [];
                                                            stops.push(Math.max(0, Math.min(1, insertPreview.t)));
                                                            const uniq = Array.from(new Set(stops)); // без округления
                                                            uniq.sort((a, b) => a - b);              // порядок по оси длины
                                                            list[i] = { ...cur, extraStops: uniq };
                                                            return { ...prev, [p.id]: list };
                                                        });
                                                        setInsertPreview(null);   // просто очищаем превью и продолжаем вставку
                                                        return;
                                                    }
                                                    // прежняя логика выбора/удаления
                                                    onCurveClick(p.id, c.id, e);
                                                }}
                                                style={{ cursor: (mode === 'preview' || !isActive) ? 'default' : (mode === 'insert' ? 'copy' : 'pointer') }}
                                                pointerEvents={(mode === 'preview' || !isActive || mode === 'deleteVertex') ? 'none' : 'auto'}
                                                strokeLinecap="round"
                                            />
                                        );
                                    })}

                                    {isActive && mode === 'insert' && insertPreview && insertPreview.panelId === p.id && (
                                        <circle
                                            cx={insertPreview.x}
                                            cy={insertPreview.y}
                                            r={insertPreview.allowed ? 4 : 4}
                                            fill={insertPreview.allowed ? '#22c55e' : '#ef4444'}
                                            stroke={insertPreview.allowed ? '#166534' : '#991b1b'}
                                            strokeWidth={1.5}
                                            style={{ pointerEvents: 'none' }}
                                        />
                                    )}

                                    {/* ANCHORS (базовые + новые) — кликаем по merged-индексам */}
                                    {isActive && (mode === 'add' || mode === 'delete' || mode === 'insert') && (() => {
                                        const base = p.anchors || [];
                                        const extras = extraAnchorsByPanel[p.id] || [];
                                        const merged = [...base, ...extras];

                                        return merged.map((pt, mi) => (
                                            <circle
                                                key={`m-${mi}`}
                                                cx={pt.x}
                                                cy={pt.y}
                                                r={3.5}
                                                className={clsx(
                                                    styles.anchor,
                                                    styles.anchorClickable,
                                                    mi === hoverAnchorIdx && styles.anchorHovered,
                                                    mi === addBuffer && styles.anchorSelectedA
                                                )}
                                                onClick={(e) => { e.stopPropagation(); onAnchorClickAddMode(mi); }}
                                                onMouseEnter={() => setHoverAnchorIdx(mi)}
                                                onMouseLeave={() => setHoverAnchorIdx(null)}
                                            />
                                        ));
                                    })()}

                                    {/* Только ручные вершинкы в режиме удаления вершин */}
                                    {isActive && mode === 'deleteVertex' && (() => {
                                        const extras = (extraAnchorsByPanel[p.id] || []).filter(ex => ex?.id?.includes('@m'));
                                        return extras.map(ex => (
                                            <circle
                                                key={ex.id}
                                                cx={ex.x}
                                                cy={ex.y}
                                                r={4}
                                                className={styles.anchorManualDelete}
                                                onClick={(e) => { e.stopPropagation(); eraseManualAnchor(p.id, ex); }}
                                            />
                                        ));
                                    })()}

                                </g>
                            );
                        })}


                    </svg>
                </div>

                {/* — навигация пресетов снизу — */}
                <div className={styles.presetNav}>
                    <button className={styles.navBtn} onClick={prevPreset} aria-label="Предыдущая заготовка">⟵</button>
                    <div className={styles.presetChip}>{PRESETS[presetIdx]?.title || "—"}</div>
                    <button className={styles.navBtn} onClick={nextPreset} aria-label="Следующая заготовка">⟶</button>
                </div>
            </div>

            {/* sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.panel}>
                    <h3 className={styles.panelTitle}>Редактор</h3>
                    {/* Объект внутри заготовки */}
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Объект</div>
                        <div className={styles.segmented} style={{ flexWrap: 'wrap' }}>
                            {panels.map(p => (
                                <button
                                    key={p.id}
                                    className={`${styles.segBtn} ${activePanel?.id === p.id ? styles.segActive : ''}`}
                                    onClick={() => setActivePanelId(p.id)}
                                >
                                    {p.label || p.id}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Деталь: Перед/Спинка */}
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Деталь</div>
                        <div className={styles.segmented}>
                            <button
                                className={`${styles.segBtn} ${presetIdx === 0 ? styles.segActive : ''}`}
                                onClick={() => setPresetIdx(0)}
                            >
                                Перед
                            </button>
                            <button
                                className={`${styles.segBtn} ${presetIdx === 1 ? styles.segActive : ''}`}
                                onClick={() => setPresetIdx(1)}
                            >
                                Спинка
                            </button>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Сброс</div>
                        <div className={styles.btnGroupV}>
                            <button
                                className={styles.btn}
                                onClick={() => {
                                    // Сбросим всё: снимки и текущие состояния
                                    setSavedByPreset({});
                                    setCurvesByPanel({});
                                    setFills([]);
                                    setActivePanelId(panels[0]?.id ?? null);
                                    setMode("preview");
                                }}
                            >
                                Сбросить всё
                                <span className={styles.kbd}>Ctrl+R (перезагрузка)</span>
                            </button>

                            <button
                                className={styles.btnGhost}
                                onClick={() => {
                                    const id = "front";
                                    setSavedByPreset(prev => ({ ...prev, [id]: undefined }));
                                    if (currentPresetIdRef.current === id) {
                                        setCurvesByPanel({});
                                        setFills([]);
                                        setActivePanelId(panels[0]?.id ?? null);
                                        setMode("preview");
                                    }
                                }}
                            >
                                Сбросить перед
                            </button>

                            <button
                                className={styles.btnGhost}
                                onClick={() => {
                                    const id = "back";
                                    setSavedByPreset(prev => ({ ...prev, [id]: undefined }));
                                    if (currentPresetIdRef.current === id) {
                                        setCurvesByPanel({});
                                        setFills([]);
                                        setActivePanelId(panels[0]?.id ?? null);
                                        setMode("preview");
                                    }
                                }}
                            >
                                Сбросить спинку
                            </button>
                        </div>
                        <div className={styles.hintSmall} style={{ marginTop: 6 }}>
                            Переключение между «Перед» и «Спинка» сохраняет линии и заливки отдельно. Полный сброс — только по кнопке или обновлению страницы.
                        </div>
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Режим</div>
                        <div className={`${styles.segmented} ${styles.tabs3}`}>
                            <button className={`${styles.segBtn} ${styles.segBtnSmall} ${modeGroup === 'preview' ? styles.segActive : ''}`}
                                onClick={() => setMode('preview')}>Просмотр</button>
                            <button className={`${styles.segBtn} ${styles.segBtnSmall} ${modeGroup === 'fill' ? styles.segActive : ''}`}
                                onClick={() => setMode(lastFillMode)}>Заливка</button>
                            <button className={`${styles.segBtn} ${styles.segBtnSmall} ${modeGroup === 'line' ? styles.segActive : ''}`}
                                onClick={() => { setAddBuffer(null); setMode(lastLineMode); }}>Линии</button>
                        </div>
                    </div>

                    {/* Цвет заливки — видна только в режимах покраски */}

                    {modeGroup === 'fill' && (
                        <div className={styles.section}>
                            <div className={styles.sectionTitle}>Цвет заливки</div>

                            <div className={`${styles.segmented}`} style={{ marginBottom: 8, gap: 8 }}>
                                <button className={`${styles.segBtn} ${mode === 'paint' ? styles.segActive : ''}`} onClick={() => setMode('paint')}>🪣 Залить</button>
                                <button className={`${styles.segBtn} ${mode === 'deleteFill' ? styles.segActive : ''}`} onClick={() => setMode('deleteFill')}>✖ Стереть</button>
                            </div>

                            <div className={styles.colorRow}>
                                <button className={`${styles.colorChip} ${mode === 'deleteFill' ? styles.colorChipDisabled : ''}`}
                                    style={{ background: paintColor }}
                                    onClick={() => mode !== 'deleteFill' && setPaletteOpen(v => !v)} />
                                {paletteOpen && mode !== 'deleteFill' && (<div className={styles.palettePopover}>
                                    {/* dropdown-палитра */}
                                    {paletteOpen && (
                                        <div ref={paletteRef} className={styles.palette}>
                                            <div className={styles.paletteGrid}>
                                                {[
                                                    "#f26522", "#30302e", "#93c5fd", "#a7f3d0", "#fde68a", "#d8b4fe",
                                                    "#ef4444", "#10b981", "#22c55e", "#0ea5e9", "#f59e0b", "#a855f7"
                                                ].map(c => (
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
                                                    aria-label="Произвольный цвет"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>)}
                            </div>
                        </div>
                    )}

                    {modeGroup === 'line' && (
                        <div className={styles.section}>
                            <div className={styles.sectionTitle}>Линия</div>

                            {/* Тип линии и параметры — как было */}
                            <div className={styles.segmented}>
                                <button
                                    className={`${styles.segBtn} ${lineStyle === 'straight' ? styles.segActive : ''}`}
                                    onClick={() => {
                                        setLineStyle('straight');
                                        setSelectedCurveKey(null);
                                        setHoverCurveKey(null);
                                        if (mode === 'delete' || mode === 'deleteVertex') { // если до этого был «удалить»
                                            setMode('add');
                                            setLastLineMode('add');
                                        }
                                    }}
                                >Прямая</button>
                                <button
                                    className={`${styles.segBtn} ${lineStyle === 'wavy' ? styles.segActive : ''}`}
                                    onClick={() => {
                                        setLineStyle('wavy');
                                        setSelectedCurveKey(null);
                                        setHoverCurveKey(null);
                                        if (mode === 'delete' || mode === 'deleteVertex') {
                                            setMode('add');
                                            setLastLineMode('add');
                                        }
                                    }}
                                >Волнистая</button>
                            </div>

                            <div className={`${styles.segmented} ${styles.two}`} style={{ marginBottom: 8 }}>
                                <button className={`${styles.segBtn} ${mode === 'add' ? styles.segActive : ''}`}
                                    onClick={() => { setMode('add'); setAddBuffer(null); setSelectedCurveKey(null); setHoverCurveKey(null); }}>＋ Добавить</button>
                                <button className={`${styles.segBtn} ${mode === 'delete' ? styles.segActive : ''}`}
                                    onClick={() => { setMode('delete'); setSelectedCurveKey(null); setHoverCurveKey(null); }}>🗑 Удалить</button>
                                <button className={`${styles.segBtn} ${mode === 'insert' ? styles.segActive : ''}`}
                                    onClick={() => { setMode('insert'); setSelectedCurveKey(null); setHoverCurveKey(null); setAddBuffer(null); }}>● Вставить вершину</button>
                                <button
                                    className={`${styles.segBtn} ${mode === 'deleteVertex' ? styles.segActive : ''}`}
                                    onClick={() => { setMode('deleteVertex'); setSelectedCurveKey(null); setHoverCurveKey(null); setAddBuffer(null); }}>○ Удалить вершину</button>
                            </div>

                            <div className={styles.subRow} style={{ marginTop: 6 }}>
                                <span className={styles.slimLabel}>Мин. расстояние между вершинами</span>
                                <input
                                    type="range" min={2} max={80} step={1}
                                    value={minGapWorld}
                                    onChange={e => setMinGapWorld(+e.target.value)}
                                    className={styles.rangeCompact}
                                />
                                <span className={styles.value}>{minGapWorld}</span>
                            </div>

                            {/* === НАСТРОЙКИ ЛИНИИ: преднастройка или редактирование выбранной === */}
                            {(() => {
                                const hasSelection = !!selectedCurveKey;
                                let curve = null, pid = null, cid = null;
                                if (hasSelection) {
                                    [pid, cid] = selectedCurveKey.split(':');
                                    curve = (curvesByPanel[pid] || []).find(c => c.id === cid) || null;
                                }

                                // --- ВЕРШИНЫ (всегда видимы) ---
                                const currentSub = hasSelection
                                    ? Math.max(2, Math.min(10, curve?.subCount ?? 2))
                                    : Math.max(2, Math.min(10, defaultSubCount));

                                // РУЧНЫЕ вершины на выбранной линии
                                const manualCount = hasSelection && Array.isArray(curve?.extraStops) ? curve.extraStops.length : 0;
                                const manualLock = hasSelection && manualCount > 0;

                                const changeSub = (n) => {
                                    if (hasSelection) {
                                        if (manualLock)
                                            return; // заблокировано ручными вершинами

                                        setCurvesByPanel(prev => {
                                            const arr = [...(prev[pid] || [])];
                                            const i = arr.findIndex(x => x.id === cid);
                                            if (i >= 0) arr[i] = { ...arr[i], subCount: n };
                                            return { ...prev, [pid]: arr };
                                        });
                                    } else {
                                        setDefaultSubCount(n); // преднастройка для новой линии
                                    }
                                };

                                // --- ВОЛНА (видна только когда lineStyle === 'wavy') ---
                                const curveIsWavyCapable = !!(curve && curve.type === 'wavy' && curve.basePts);
                                const currentAmp = hasSelection ? (curve?.waveAmpPx ?? waveAmpPx) : waveAmpPx;
                                const currentLen = hasSelection ? (curve?.waveLenPx ?? waveLenPx) : waveLenPx;

                                const changeAmp = (val) => {
                                    if (hasSelection && curveIsWavyCapable) {
                                        recomputeWaveForCurve(pid, cid, val, currentLen); // live-редактирование выбранной волнистой
                                    } else {
                                        setWaveAmpPx(val); // преднастройка для новой волнистой
                                    }
                                };
                                const changeLen = (val) => {
                                    if (hasSelection && curveIsWavyCapable) {
                                        recomputeWaveForCurve(pid, cid, currentAmp, val);
                                    } else {
                                        setWaveLenPx(val); // преднастройка для новой волнистой
                                    }
                                };

                                return (
                                    <>
                                        {/* индикатор */}
                                        <div className={styles.hintSmall} style={{ marginTop: 6, marginBottom: 4 }}>
                                            {hasSelection
                                                ? 'Редактирование выбранной линии'
                                                : `Преднастройка новой линии (${lineStyle === 'wavy' ? 'волнистая' : 'прямая'})`}
                                        </div>

                                        {/* Вершины — всегда */}
                                        <div className={styles.subRow} style={{ marginTop: 6 }}>
                                            <span className={styles.slimLabel}>
                                                {hasSelection ? 'Вершины на линии' : 'Вершины (для новой)'}
                                            </span>
                                            <input
                                                type="range" min={2} max={10} step={1}
                                                value={currentSub}
                                                onChange={e => changeSub(+e.target.value)}
                                                className={styles.rangeCompact}
                                                disabled={manualLock}
                                            />
                                            <span className={styles.value}>{currentSub}</span>
                                        </div>

                                        {manualLock && (
                                            <div className={styles.lockNote}>
                                                На линии есть ручные вершины ({manualCount}). Автоматическое распределение отключено.
                                                Чтобы снова редактировать количество вершин, удалите все ручные точки.
                                                <div style={{ marginTop: 6 }}>
                                                    <button
                                                        type="button"
                                                        className={styles.linkBtn}
                                                        onClick={() => {
                                                            if (!hasSelection) return;
                                                            const [pp, cc] = selectedCurveKey.split(':');
                                                            setCurvesByPanel(prev => {
                                                                const list = [...(prev[pp] || [])];
                                                                const i = list.findIndex(x => x.id === cc);
                                                                if (i < 0) return prev;
                                                                const cur = list[i];
                                                                if (!Array.isArray(cur.extraStops) || cur.extraStops.length === 0) return prev;
                                                                list[i] = { ...cur, extraStops: [] }; // удалить ВСЕ ручные вершины на выбранной линии
                                                                return { ...prev, [pp]: list };
                                                            });
                                                        }}
                                                    >Удалить все ручные вершины</button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Амплитуда/Длина волны — показываем только в режиме волнистой линии */}
                                        {lineStyle === 'wavy' && (
                                            <>
                                                <div className={styles.subRow} style={{ marginTop: 8 }}>
                                                    <span className={styles.slimLabel}>
                                                        {hasSelection
                                                            ? (curveIsWavyCapable ? 'Амплитуда на линии' : 'Амплитуда (шаблон)')
                                                            : 'Амплитуда (для новой волнистой)'}
                                                    </span>
                                                    <input
                                                        type="range" min={2} max={24} step={1}
                                                        value={currentAmp}
                                                        onChange={e => changeAmp(+e.target.value)}
                                                        disabled={manualLock}
                                                        className={styles.rangeCompact}
                                                    />
                                                    <span className={styles.value}>{currentAmp}px</span>
                                                </div>

                                                <div className={styles.subRow}>
                                                    <span className={styles.slimLabel}>
                                                        {hasSelection
                                                            ? (curveIsWavyCapable ? 'Длина волны на линии' : 'Длина волны (шаблон)')
                                                            : 'Длина волны (для новой)'}
                                                    </span>
                                                    <input
                                                        type="range" min={12} max={80} step={2}
                                                        value={currentLen}
                                                        onChange={e => changeLen(+e.target.value)}
                                                        disabled={manualLock}
                                                        className={styles.rangeCompact}
                                                    />
                                                    <span className={styles.value}>{currentLen}px</span>
                                                </div>
                                            </>
                                        )}
                                    </>
                                );
                            })()}

                        </div>
                    )}

                </div>
            </aside>

        </div>
    );
}