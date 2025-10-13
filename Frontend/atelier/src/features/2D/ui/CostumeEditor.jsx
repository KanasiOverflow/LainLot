// CostumeEditor.jsx
import { useEffect, useMemo, useRef, useState, useLayoutEffect, useCallback } from "react";
import styles from "../styles/CostumeEditor.module.css";
import clsx from "clsx";
import { sampleBezier, sampleBezierPoints, segsSignature } from "../../../core/geometry/geometry.js";
import { area, getBounds } from "../../../core/geometry/bounds.js";
import { cumulativeLengths, nearestOnPolyline, pointsToPairedPolyline, waveAlongPolyline } from "../../../core/geometry/polylineOps.js";
import { facePath, faceKey, segsToD } from "../../../core/svg/faceUtils.js";
import {
    polylinesFromSegs, segmentsFromPolylines, splitSegsIntoSubpaths, polylineFromSubpath,
    catmullRomToBezierPath
} from "../../../core/svg/polylineOps.js";
import { splitByIntersections } from "../../../core/geometry/intersections.js";
import { buildFacesFromSegments, pointInAnyFace } from "../../../core/svg/buildFaces.js";
import { extractPanels } from "../../../core/svg/extractPanels.js";
import { makeUserCurveBetween } from "../../../core/svg/curves.js";
import { applyMatrixToSegs } from "../../../core/geometry/matrix.js";
import { collectAnchors } from "../../../core/svg/anchors.js";
import { useHistory } from "../../../shared/hooks/useHistory.jsx";
import { downloadText } from "../../../core/export/export.js";
import { buildCombinedSVG } from "../../../core/export/buildCombinedSVG.js";

import SidebarEditor from "./SidebarEditor.jsx";
import Tooltip from "./Tooltip.jsx";
import BodyParams from "./BodyParams.jsx";
import OrderForm from "./OrderForm.jsx";

import { PRESETS } from "../../../core/variables/presets.js";
import { SVG_BASE, MANIFEST_URL } from "../../../core/variables/svgPath.js";
import { getBaseSources, getVariantsForSlot, loadSvgManifest } from "../../../core/variables/variants.js";

/* ================== компонент ================== */
export default function CostumeEditor() {
    const scopeRef = useRef(null);
    const [showTopbarHint, setShowTopbarHint] = useState(false);
    const [composedPanels, setComposedPanels] = useState(null);
    // кеш SVG по пресетам и сохранённые пользовательские состояния по пресетам
    const svgCacheRef = useRef({});
    const [svgCache, setSvgCache] = useState({}); // { [presetId]: rawSVG }
    const currentPresetIdRef = useRef(PRESETS[0]?.id || "front");
    // Минимальный зазор между вершинами (в мировых единицах SVG). Настраивается из кода.
    const MIN_GAP_WORLD = 20; // TODO: подберите под ваши единицы (напр., «5 см»)
    // превью точки для вставки вершины
    const [insertPreview, setInsertPreview] = useState(null); // { panelId, curveId, x, y, allowed }
    // state для «запоминания» последнего подрежима
    const [lastLineMode, setLastLineMode] = useState('add');     // 'add' | 'delete
    const [panels, setPanels] = useState([]);
    const [activePanelId, setActivePanelId] = useState(null);
    // для анимации "из-за спины"
    const [prevPanels, setPrevPanels] = useState(null);
    const [isSwapping, setIsSwapping] = useState(false);
    const SWAP_MS = 180; // синхрон с .swapIn/.swapOut (180ms)
    const didEverSwapRef = useRef(false);
    const swapTimerRef = useRef(null);
    // чтобы поймать "старые" панели до перезаписи
    const panelsRef = useRef(panels);
    // --- PRESETS state
    const [presetIdx, setPresetIdx] = useState(0);   // 0: Перед, 1: Спинка
    // === Prefs per detail (persist in LS) ===
    const [prefs, setPrefs] = useState({ front: {}, back: {} });
    const activeId = presetIdx === 0 ? "front" : "back";
    const [isLoadingPreset, setIsLoadingPreset] = useState(false);
    // красивый ре-монтаж svg при смене пресета (для анимации появления)
    const [svgMountKey, setSvgMountKey] = useState(0);
    // кривые: 'cubic' или 'routed' (по контуру)
    const [curvesByPanel, setCurvesByPanel] = useState({});
    const [fills, setFills] = useState([]);
    const [paintColor, setPaintColor] = useState("#f26522");
    const [mode, setMode] = useState("preview");

    // ↓ внутри CostumeEditor(), рядом с остальными useState/useRef
    const applyingPrefsRef = useRef(false);   // сейчас применяем prefs -> не писать их обратно
    const [prefsLoaded, setPrefsLoaded] = useState(false); // prefs из LS уже загружены

    const {
        historyUndo, historyRedo, canUndo, canRedo,
        applyFillChange, applyCurvesChange,
        historyItems, historyIndex,
    } = useHistory({
        fills, curvesByPanel, presetIdx,
        setFills, setCurvesByPanel,
        max: 50, // можно поменять
    });


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

    const dismissTopbarHint = useCallback(() => {
        if (!showTopbarHint) return;
        setShowTopbarHint(false);
        try { localStorage.setItem("ce.topbarHint.v1", "1"); } catch (e) { }
    }, [showTopbarHint]);

    // рядом с loadPresetToPanels
    const urlForSrcFile = (p) => {
        if (!p) return "";
        const clean = p.replace(/^\/+/, "");                 // убрали ведущие слэши
        // если уже начинается с "2d/" — значит путь от корня public, берём его как есть
        if (clean.startsWith("2d/")) return `/${clean}`;
        // иначе это относительный путь (типа "Front/xxx.svg") — достраиваем от SVG_BASE
        return `${SVG_BASE}/${clean}`;
    };

    // Загружает пресет: если sources[] — склеивает их в один набор панелей; если file — вернёт строку SVG (как раньше)
    const loadPresetToPanels = async (preset) => {
        if (Array.isArray(preset.sources) && preset.sources.length) {
            const partsAll = [];
            for (let i = 0; i < preset.sources.length; i++) {
                const src = preset.sources[i];
                const fileResolved = src.file; // (или твой resolveSourceFile, если используешь)
                const url = urlForSrcFile(fileResolved);
                const txt = await fetch(url).then(r => r.text())
                const parts = extractPanels(txt); // парсим в панели (как обычно)
                const M = translateScaleMatrix(src.dx || 0, src.dy || 0, src.scale || 1);

                // детерминированный префикс по слоту/стороне/варианту:
                const prefix = (src.idPrefix ||
                    // включаем ИД пресета (front/back), чтобы у спинки и переда НЕ совпадали panelId
                    [String(preset?.id || 'part'), src.slot || 'part', src.side || 'both', src.which || 'main'].join('_'))
                    .toLowerCase();

                let localIdx = 0;
                for (const p of parts) {
                    const segsT = applyMatrixToSegs(p.segs, M);
                    partsAll.push({
                        // стаб. id: НЕ зависит от внутренних id в svg-файле
                        id: `${prefix}__${localIdx++}`,
                        segs: segsT,
                        anchors: collectAnchors(segsT),
                        meta: { slot: src.slot || null, side: src.side || null, which: src.which || null }
                    });
                }
            }
            return partsAll;
        }

        console.warn('Preset without "sources" is not supported anymore:', preset);
        return [];
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
        return pts.some(q => Math.hypot(q.x - testPt.x, q.y - testPt.y) < MIN_GAP_WORLD);
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
            (mode === 'add' || mode === 'delete' || mode === 'insert' || mode === 'deleteVertex') ? 'line' :
                (mode === 'variants' ? 'variants' : 'preview');


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
            const svgText = await buildCombinedSVG({
                svgCache: svgCacheRef.current,
                loadPresetToPanels,
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

    const activeDetailId = (presetIdx === 0 ? "front" : "back");
    const [manifest, setManifest] = useState(null);
    const [details, setDetails] = useState({ front: { cuff: "base" }, back: { cuff: "base" } }); // пока работаем только с манжетами

    // какие слоты синхронизируем между передом/спинкой
    const shouldSyncSlot = (slot) => slot && slot.toLowerCase() !== "pocket";

    // централизованный апдейтер + правила «капюшон ↔ шея»
    const setSlotVariant = (face /* 'front'|'back' */, slot, variantId) => {
        setDetails(prev => {
            const other = face === "front" ? "back" : "front";
            const curFace = { ...(prev[face] || {}) };
            const curOther = { ...(prev[other] || {}) };

            const hoodIsTurningOn = slot === "hood" && variantId && variantId !== "base";
            const hoodIsTurningOff = slot === "hood" && (variantId === "base" || variantId == null);
            const neckIsChanging = slot === "neck";

            // Если пользователь меняет шею, а капюшон включён — капюшон отключаем автоматически
            if (neckIsChanging) {
                const hoodActive = (curFace.hood && curFace.hood !== "base");
                if (hoodActive) {
                    // сбрасываем капюшон
                    delete curFace.hood;
                }
            }

            // Включение капюшона: запомним текущую шею и «обнулим» её выбор
            if (hoodIsTurningOn) {
                // сохраняем «какой была шея» (если нет — считаем 'base')
                prevNeckByFaceRef.current[face] = curFace.neck ?? "base";
                // убираем выбранную шею (капюшон перекрывает её)
                delete curFace.neck;
            }

            // Выключение капюшона: восстановим шею
            if (hoodIsTurningOff) {
                const prevNeck = prevNeckByFaceRef.current[face];
                if (prevNeck) {
                    if (prevNeck === "base") delete curFace.neck;
                    else curFace.neck = prevNeck;
                }
                prevNeckByFaceRef.current[face] = null;
            }

            // Применяем текущее изменение слота
            if (variantId === "base" || variantId == null) {
                delete curFace[slot];
                if (shouldSyncSlot(slot)) delete curOther[slot];
            } else {
                curFace[slot] = variantId;
                if (shouldSyncSlot(slot)) curOther[slot] = variantId;
            }

            // Если пользователь менял шею — это «явный» выбор, перезапишем память,
            // чтобы в будущем не было неожиданного восстановления старой шеи.
            if (neckIsChanging) {
                prevNeckByFaceRef.current[face] = curFace.neck ?? "base";
            }

            return { ...prev, [face]: curFace, [other]: curOther };
        });
    };

    const panelSlotMapRef = useRef(new Map()); // panelId -> slot
    const changeKindRef = useRef(null); // 'preset' | 'slot' | null

    const detailsRef = useRef(details);
    const lastChangedSlotRef = useRef(null); // { presetId: 'front'|'back', slot: 'cuff'|... } | null
    const restoringPresetRef = useRef(false); // true — пока восстанавливаем снапшот пресета

    // сохраняем выбранную шею, когда включается капюшон, чтобы вернуть её при выключении
    const prevNeckByFaceRef = useRef({ front: null, back: null });

    const [savedByPreset, setSavedByPreset] = useState({}); // { [presetId]: { curvesByPanel, fills, activePanelId } }
    const savedByPresetRef = useRef({});

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
        setPrefs(prev => {
            const next = {
                ...prev,
                front: { ...(prev.front || {}), lastMode: "preview" },
                back: { ...(prev.back || {}), lastMode: "preview" }
            };
            try { localStorage.setItem("ce.prefs.v1", JSON.stringify(next)); } catch { }
            return next;
        });
    }, [panels, setSavedByPreset, setCurvesByPanel, setFills, setActivePanelId, setDetails, setMode, setPrefs]);

    // панели-капюшоны
    const hoodPanelIds = useMemo(() => {
        return new Set(
            panels
                .filter(p => String(p.meta?.slot || '').toLowerCase() === 'hood')
                .map(p => p.id)
        );
    }, [panels]);

    // внешние кольца (силуэты) капюшона
    const hoodRings = useMemo(() => {
        return panels
            .filter(p => hoodPanelIds.has(p.id))
            .map(p => outerRingByPanel[p.id])
            .filter(Boolean);
    }, [panels, outerRingByPanel, hoodPanelIds]);

    // ➕ ДОБАВЬТЕ: внутренние отверстия (inner rings) капюшона
    const hoodHoles = useMemo(() => {
        const holes = [];
        for (const p of panels) {
            if (!hoodPanelIds.has(p.id)) continue;
            const rings = ringsByPanel[p.id] || [];
            const outer = outerRingByPanel[p.id];
            for (const r of rings) {
                if (!outer || r !== outer) holes.push(r);
            }
        }
        return holes;
    }, [panels, ringsByPanel, outerRingByPanel, hoodPanelIds]);

    // Рендер одной панели
    const renderPanel = (p) => {
        const faces = facesByPanel[p.id] || [];
        const ring = outerRingByPanel[p.id];
        const isActive = activePanel?.id === p.id;
        const clickableFaces = faces.length ? faces : (ring ? [ring] : []);
        const dimInactive = mode !== "preview" && !isActive;

        return (
            <g key={p.id} className={dimInactive ? styles.panelDimmed : undefined}>
                {/* выбор детали (не мешаем заливке) */}
                {ring && mode !== "preview" && mode !== "paint" && mode !== "deleteFill" && (
                    <path
                        d={facePath(ring)}
                        fill="transparent"
                        style={{ cursor: "pointer" }}
                        onClick={() => onPanelActivate(p.id)}
                    />
                )}

                {/* грани для покраски / очистки */}
                {clickableFaces.map(poly => {
                    const fk = faceKey(poly);
                    const fill = (fills.find(f => f.panelId === p.id && f.faceKey === fk)?.color) || "none";
                    const hasFill = fill !== "none";
                    const isHover = !!hoverFace && hoverFace.panelId === p.id && hoverFace.faceKey === fk;
                    const canHit = mode === "paint" || mode === "deleteFill";

                    return (
                        <g key={fk}>
                            <path
                                d={facePath(poly)}
                                fill={hasFill ? fill : (mode === "paint" && isHover ? "#9ca3af" : "transparent")}
                                fillOpacity={hasFill ? 0.9 : (mode === "paint" && isHover ? 0.35 : 0.001)}
                                stroke="none"
                                style={{ pointerEvents: canHit ? 'all' : 'none', cursor: canHit ? 'crosshair' : 'default' }}
                                onMouseEnter={() => (hasFill ? onFilledEnter(p.id, fk) : onFaceEnter(p.id, poly))}
                                onMouseLeave={() => (hasFill ? onFilledLeave(p.id, fk) : onFaceLeave(p.id, poly))}
                                onClick={() => (hasFill ? onFilledClick(p.id, fk) : onFaceClick(p.id, poly))}
                            />
                            {hasFill && mode === "deleteFill" && isHover && (
                                <path d={facePath(poly)} fill="#000" fillOpacity={0.18} style={{ pointerEvents: "none" }} />
                            )}
                        </g>
                    );
                })}

                {/* внешний контур */}
                {ring && (
                    <path
                        d={segsToD(p.segs)}
                        fill="none"
                        stroke="#111"
                        strokeWidth={1.8 * (scale.k || 1)}
                        style={{ pointerEvents: "none" }}
                    />
                )}

                {/* пользовательские линии */}
                {(curvesByPanel[p.id] || []).map(c => {
                    const merged = mergedAnchorsOf(p);
                    const a = merged[c.aIdx] ?? (c.ax != null ? { x: c.ax, y: c.ay } : null);
                    const b = merged[c.bIdx] ?? (c.bx != null ? { x: c.x, y: c.y } : null);
                    if (!a || !b) return null;

                    const d = c.type === "cubic"
                        ? `M ${a.x} ${a.y} C ${c.c1.x} ${c.c1.y} ${c.c2.x} ${c.c2.y} ${b.x} ${b.y}`
                        : c.d;

                    const key = `${p.id}:${c.id}`;
                    const isHover = hoverCurveKey === key;
                    const isSelected = selectedCurveKey === key;
                    const isClicked = clickedCurveKey === key;

                    const cls = clsx(
                        styles.userCurve,
                        mode === "preview" && styles.userCurvePreview,
                        mode === "delete" && isHover && styles.userCurveDeleteHover,
                        isSelected && styles.userCurveSelected,
                        isClicked && styles.userCurveClicked
                    );

                    return (
                        <path
                            key={c.id}
                            d={d}
                            className={cls}
                            onMouseEnter={() => { if (isActive) onCurveEnter(p.id, c.id); }}
                            onMouseLeave={() => {
                                if (mode === "insert") setInsertPreview(prev => (prev && prev.curveId === c.id ? null : prev));
                                onCurveLeave(p.id, c.id);
                            }}
                            onMouseMove={(e) => { /* твой существующий onMouseMove код */ }}
                            onClick={(e) => { /* твой существующий onClick код */ }}
                            style={{ cursor: (mode === 'preview' || !isActive) ? 'default' : (mode === 'insert' ? 'copy' : 'pointer') }}
                            pointerEvents={(mode === "preview" || !isActive || mode === "deleteVertex") ? "none" : "auto"}
                            strokeLinecap="round"
                        />
                    );
                })}

                {/* превью точки вставки */}
                {isActive && mode === "insert" && insertPreview && insertPreview.panelId === p.id && (
                    <circle
                        cx={insertPreview.x}
                        cy={insertPreview.y}
                        r={4}
                        fill={insertPreview.allowed ? "#22c55e" : "#ef4444"}
                        stroke={insertPreview.allowed ? "#166534" : "#991b1b"}
                        strokeWidth={1.5}
                        style={{ pointerEvents: "none" }}
                    />
                )}

                {/* базовые + доп. якоря */}
                {isActive && (mode === "add" || mode === "delete" || mode === "insert") && (() => {
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

                {/* ручные вершины — для удаления */}
                {isActive && mode === "deleteVertex" && (() => {
                    const extras = (extraAnchorsByPanel[p.id] || []).filter(ex => ex?.id?.includes("@m"));
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
    };

    useEffect(() => {
        try { localStorage.setItem("ce.activeFace", presetIdx === 0 ? "front" : "back"); } catch { }
    }, [presetIdx]);

    useEffect(() => { savedByPresetRef.current = savedByPreset; }, [savedByPreset]);

    useEffect(() => {
        const prev = detailsRef.current;
        const cur = details;

        // собираем все изменения
        const changes = [];
        for (const face of ['front', 'back']) {
            const p = prev[face] || {}, c = cur[face] || {};
            for (const slot of Object.keys({ ...p, ...c })) {
                if (p[slot] !== c[slot]) {
                    changes.push({ presetId: face, slot });
                }
            }
        }

        if (changes.length) {
            changeKindRef.current = 'slot';
            // приоритет — для текущей активной стороны (чтобы чистились заливки/линии именно там)
            const curFace = currentPresetIdRef.current;
            const preferred = changes.find(ch => ch.presetId === curFace) || changes[0];
            lastChangedSlotRef.current = preferred;
        }

        detailsRef.current = cur;
    }, [details]);


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
        (async () => {
            try {
                const m = await loadSvgManifest();
                setManifest(m);
            } catch (e) {
                console.error(e);
                // опционально: показать в UI подсказку
                // toast.error("Не найден manifest.json. Запусти npm run build:svg-manifest");
            }
        })();
    }, []);

    useEffect(() => {
        if (!manifest) return;        // ⬅️ без манифеста ничего не делаем
        let alive = true;
        (async () => {
            const preset = PRESETS[presetIdx];
            if (!preset) return;
            setIsLoadingPreset(true);

            // ВАЖНО: делаем глубокую копию, чтобы подмены не трогали manifest.base[*]
            let baseSources = await getBaseSources(preset.id);
            baseSources = (Array.isArray(baseSources) ? baseSources : []).map(e => ({
                file: e.file,
                slot: e.slot ?? null,
                side: e.side ?? null,
                which: e.which ?? null
            }));

            // индекс базовых частей по (slot,side,which)
            const keyOf = (s) => [s.slot || "", s.side || "", s.which || ""].join("|");
            const baseIdx = new Map(baseSources.map(s => [keyOf(s), s]));

            // находим, какие слоты у нас вообще выбраны на этой стороне (details[preset.id])
            const chosen = details[preset.id] || {};
            const hoodActive = !!(chosen.hood && chosen.hood !== "base");

            // Если капюшон активен — полностью убираем из базы любые части слота 'neck'
            // (иначе базовая шея будет торчать под капюшоном)
            if (hoodActive) {
                baseSources = baseSources.filter(s => (s.slot || "").toLowerCase() !== "neck");
            }

            // начнём с копии базы
            const sources = baseSources.slice();

            // для каждого выбранного слота подставляем/добавляем файлы из варианта
            for (const [slot, variantId] of Object.entries(chosen)) {
                if (!variantId || variantId === "base") continue; // база: ничего не меняем
                const list = manifest?.variants?.[slot] || [];
                const v = list.find(x => x.id === variantId);
                if (!v) continue;

                const fmap = v.files?.[preset.id] || {}; // files для текущей стороны

                // Если на этой стороне у варианта нет ни одного файла — пропускаем,
                // чтобы не "очищать" базу и не ломать канву
                if (!fmap || Object.keys(fmap).length === 0) {
                    // console.warn(`[variants] empty files for ${slot}/${variantId} on ${preset.id}`);
                    continue;
                }
                // после выбора варианта слота v и нахождения подходящей ветки files для active side:
                const sLower = (slot || "").toLowerCase();
                const allowSides = (sLower === "cuff" || sLower === "sleeve");

                let entries = [];
                if (fmap.file) entries.push({ file: fmap.file, side: null, which: null });
                if (allowSides && fmap.left) entries.push({ file: fmap.left, side: "left", which: null });
                if (allowSides && fmap.right) entries.push({ file: fmap.right, side: "right", which: null });
                if (fmap.inner) entries.push({ file: fmap.inner, side: null, which: "inner" });

                // 3) не создаём новые под-части, которых нет в базе (кроме hood)
                const hasBaseFor = (side, which) => baseIdx.has([slot, side || "", which || ""].join("|"));
                if (sLower !== "hood") {
                    entries = entries.filter(e => hasBaseFor(e.side, e.which));
                }

                for (const e of entries) {
                    const k = [slot, e.side || "", e.which || ""].join("|");
                    const baseHit = baseIdx.get(k);
                    if (baseHit) {
                        // заменяем файл в уже существующем базовом источнике
                        baseHit.file = e.file;
                    } else {
                        // базы нет — добавляем новый кусок
                        sources.push({ file: e.file, slot, side: e.side || null, which: e.which || null });
                    }
                }
            }

            // === ВАЖНО: капюшон поверх всего ===
            // Положим все куски слота 'hood' в конец, чтобы они рисовались последними
            // (и визуально перекрывали остальные детали)
            if (sources.length) {
                const hoodParts = [];
                const rest = [];
                for (const src of sources) {
                    if ((src.slot || "").toLowerCase() === "hood") hoodParts.push(src);
                    else rest.push(src);
                }
                // если хотим ещё и шнурки/подкладку поверх остальных частей капюшона — можно тоньше сортировать
                // но базово достаточно просто положить hoodParts в конец
                sources.length = 0;
                sources.push(...rest, ...hoodParts);
            }

            const compiled = await loadPresetToPanels({ ...preset, sources });
            if (!alive) return;
            setComposedPanels(Array.isArray(compiled) ? compiled : []);
            setSvgCache(prev => ({ ...prev, [preset.id]: Array.isArray(compiled) ? compiled : [] }));
            setSvgMountKey(k => k + 1);

        })().catch(() => {
            if (alive)
                setComposedPanels([]);
        }).finally(() => {
            if (alive)
                setIsLoadingPreset(false);
        });
        return () => { alive = false; };
    }, [presetIdx, manifest, details]);

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

    // загрузка prefs
    useEffect(() => {
        try {
            const v = JSON.parse(localStorage.getItem("ce.prefs.v1") || "{}");
            setPrefs({ front: {}, back: {}, ...v });
            setPrefsLoaded(true);
        } catch { }
    }, []);

    useEffect(() => {
        if (!prefsLoaded) return;       // ещё не загрузили из LS — ничего не делать

        const p = prefs[activeId] || {};

        // Включаем "фазу применения" — остальные эффекты записей не должны срабатывать
        applyingPrefsRef.current = true;

        if (p.paintColor && p.paintColor !== paintColor) setPaintColor(p.paintColor);
        if (p.lineStyle && p.lineStyle !== lineStyle) setLineStyle(p.lineStyle);
        if (Number.isFinite(p.defaultSubCount) && p.defaultSubCount !== defaultSubCount) setDefaultSubCount(p.defaultSubCount);
        if (Number.isFinite(p.waveAmpPx) && p.waveAmpPx !== waveAmpPx) setWaveAmpPx(p.waveAmpPx);
        if (Number.isFinite(p.waveLenPx) && p.waveLenPx !== waveLenPx) setWaveLenPx(p.waveLenPx);
        if (p.lastLineMode && p.lastLineMode !== lastLineMode) setLastLineMode(p.lastLineMode);

        // применяем сохранённый режим (preview допускается)
        const desired = p.lastMode ?? "preview";                // можно оставить без фоллбэка, но так предсказуемей
        const safe = desired === "deleteFill" ? "paint" : desired;
        if (safe !== mode) setMode(safe);

        Promise.resolve().then(() => { applyingPrefsRef.current = false; });
    }, [presetIdx, prefsLoaded]);  // зависимости — только смена детали/загрузка prefs

    useEffect(() => {
        // во время применения prefs не пишем обратно
        if (applyingPrefsRef.current) return;

        // единственная “правка безопасности”: не возвращаемся в deleteFill
        const safe = mode === "deleteFill" ? "paint" : mode;

        setPrefs(prev => {
            const cur = prev[activeId] || {};
            if (cur.lastMode === safe) return prev;            // ничего не меняется
            const next = { ...prev, [activeId]: { ...cur, lastMode: safe } };
            try { localStorage.setItem("ce.prefs.v1", JSON.stringify(next)); } catch { }
            return next;
        });
    }, [mode, activeId]);


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
        if (applyingPrefsRef.current) return;    // во время применения ничего не пишем
        setPrefs(prev => {
            const cur = prev[activeId] || {};
            const nextDetail = {
                ...cur,
                paintColor, lineStyle, defaultSubCount, waveAmpPx, waveLenPx, lastLineMode,
            };

            // shallow-equal: если ничего не поменялось — не дергаем setPrefs, чтобы не раскручивать эффекты
            const same =
                cur.paintColor === nextDetail.paintColor &&
                cur.lineStyle === nextDetail.lineStyle &&
                cur.defaultSubCount === nextDetail.defaultSubCount &&
                cur.waveAmpPx === nextDetail.waveAmpPx &&
                cur.waveLenPx === nextDetail.waveLenPx &&
                cur.lastLineMode === nextDetail.lastLineMode;

            if (same)
                return prev;

            const next = { ...prev, [activeId]: nextDetail };
            try { localStorage.setItem("ce.prefs.v1", JSON.stringify(next)); } catch { }

            return next;
        });
    }, [activeId, paintColor, lineStyle, defaultSubCount, waveAmpPx, waveLenPx, lastLineMode]);


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

                    {/* Стек SVG: предыдущая сцена (для анимации) + текущая */}
                    <div className={styles.canvasStack}>
                        {/* нижний слой — пред. сцена, только контуры */}
                        {prevPanels && (
                            <svg
                                className={`${styles.canvas} ${styles.stage} ${styles.swapOut}`}
                                viewBox={viewBox}
                                preserveAspectRatio="xMidYMid meet"
                                style={{ pointerEvents: "none" }}
                                aria-hidden="true"
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

                        {/* верхний слой — текущая интерактивная сцена */}
                        <svg
                            key={svgMountKey}
                            ref={svgRef}
                            className={`${styles.canvas} ${styles.stage} ${isSwapping ? styles.swapIn : (!didEverSwapRef.current ? styles.svgEnter : "")}`}
                            viewBox={viewBox}
                            preserveAspectRatio="xMidYMid meet"
                            onClick={onCanvasClick}
                            role="tabpanel"
                            id={presetIdx === 0 ? "panel-front" : "panel-back"}
                            aria-labelledby={presetIdx === 0 ? "tab-front" : "tab-back"}
                        >
                            <title>Деталь: {PRESETS[presetIdx]?.title || "—"}</title>
                            {/* GRID */}
                            <defs>
                                <pattern id={`grid-${svgMountKey}`} width={gridDef.step} height={gridDef.step} patternUnits="userSpaceOnUse">
                                    <path
                                        d={`M ${gridDef.step} 0 L 0 0 0 ${gridDef.step}`}
                                        fill="none"
                                        stroke="#000"
                                        strokeOpacity=".06"
                                        strokeWidth={0.6 * (scale.k || 1)}
                                        vectorEffect="non-scaling-stroke"
                                        shapeRendering="crispEdges"
                                    />
                                </pattern>

                                {/* Маска, которая спрячeт всё под капюшоном */}
                                <mask id={`under-hood-mask-${svgMountKey}`} maskUnits="userSpaceOnUse">
                                    {/* всё показываем по умолчанию */}
                                    <rect
                                        x={gridDef.b.x}
                                        y={gridDef.b.y}
                                        width={gridDef.b.w}
                                        height={gridDef.b.h}
                                        fill="#fff"
                                    />
                                    {/* а область капюшона вычёркиваем (чёрным) */}
                                    {hoodRings.map((poly, i) => (
                                        <path key={i} d={facePath(poly)} fill="#000" />
                                    ))}
                                </mask>
                            </defs>
                            <rect
                                x={gridDef.b.x}
                                y={gridDef.b.y}
                                width={gridDef.b.w}
                                height={gridDef.b.h}
                                fill={`url(#grid-${svgMountKey})`} pointerEvents="none"
                            />

                            {/* 1) Все детали, КРОМЕ капюшона — под маской */}
                            <g mask={`url(#under-hood-mask-${svgMountKey})`}>
                                {panels.filter(p => !hoodPanelIds.has(p.id)).map(renderPanel)}
                            </g>

                            {/* 2) Капюшон — поверх, без «белых ластиков» */}
                            {panels.filter(p => hoodPanelIds.has(p.id)).map(renderPanel)}

                        </svg>
                    </div>

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