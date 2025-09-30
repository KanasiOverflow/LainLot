// CostumeEditor.jsx
import { useEffect, useMemo, useRef, useState, useLayoutEffect, useCallback } from "react";
import styles from "./CostumeEditor.module.css";
import clsx from "clsx";
import {
    area, getBounds, sampleBezier, sampleBezierPoints,
    pointsToPairedPolyline, waveAlongPolyline, segsSignature, cumulativeLengths
} from "../../utils/geometry.js";
import {
    polylinesFromSegs, segmentsFromPolylines, splitSegsIntoSubpaths, polylineFromSubpath,
    catmullRomToBezierPath, facePath, faceKey, segsToD
} from "../../utils/svgParse.js";
import { splitByIntersections } from "../../utils/intersections.js";
import { buildFacesFromSegments, extractPanels, pointInAnyFace } from "../../utils/panels.js";
import { makeUserCurveBetween, routeCurveAlongOutline } from "../../utils/routes.js";

// --- PRESETS: базовая папка с заранее подготовленными SVG
const SVG_BASE = "/2d/svg";
const PRESETS = [
    { id: "front", title: "Перед", file: "Front.svg" },
    { id: "back", title: "Спинка", file: "Back.svg" },
    // при желании добавь сюда "hood", "sleeve" и т. п.
];

/* ================== компонент ================== */
export default function CostumeEditor({ initialSVG }) {
    const scopeRef = useRef(null);

    // state для «запоминания» последнего подрежима
    const [lastFillMode, setLastFillMode] = useState('paint');   // 'paint' | 'deleteFill'
    const [lastLineMode, setLastLineMode] = useState('add');     // 'add' | 'delete
    const [rawSVG, setRawSVG] = useState(initialSVG || "");
    const [panels, setPanels] = useState([]);
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
    const [hoverFace, setHoverFace] = useState(null);
    const [toast, setToast] = useState(null);
    // тип пользовательской линии
    const [lineStyle, setLineStyle] = useState("straight"); // 'straight' | 'wavy'
    // параметры волны (в пикселях экрана)
    const [waveAmpPx, setWaveAmpPx] = useState(6);
    const [waveLenPx, setWaveLenPx] = useState(36);
    const [paletteOpen, setPaletteOpen] = useState(false);
    const paletteRef = useRef(null);
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

    const [subAnchorCount, setSubAnchorCount] = useState(2); // 2..10

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
                    // 'wavy' | 'routed' — уже есть дискретизация в c.pts
                    poly = c.pts;
                }
                if (!poly || poly.length < 2) continue;

                const L = cumulativeLengths(poly);
                const total = L[L.length - 1] || 1;
                const n = Math.max(2, Math.min(10, subAnchorCount));
                for (let k = 1; k <= n; k++) {
                    const s = (total * k) / (n + 1);
                    const pt = pointAtS(poly, L, s);
                    arr.push({ id: `${c.id}:${k}`, x: pt.x, y: pt.y });
                }
            }
            map[p.id] = arr;
        }
        return map;
    }, [panels, curvesByPanel, subAnchorCount]);

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

                    return [sampleBezier(a.x, a.y, c.c1.x, c.c1.y, c.c2.x, c.c2.y, b.x, b.y)];
                }
                else {
                    const lines = [pointsToPairedPolyline(c.pts)];
                    if (c.connA && c.connA.length === 2)
                        lines.push(pointsToPairedPolyline(c.connA));
                    if (c.connB && c.connB.length === 2)
                        lines.push(pointsToPairedPolyline(c.connB));

                    return lines;
                }
            });

            const segsFlat = segmentsFromPolylines([...baseLines, ...userLines]);
            res[p.id] = buildFacesFromSegments(splitByIntersections(segsFlat));
        }
        return res;
    }, [panels, curvesByPanel, mergedAnchorsOf]);

    const modeGroup =
        (mode === 'paint' || mode === 'deleteFill') ? 'fill' :
            (mode === 'add' || mode === 'delete') ? 'line' : 'preview';

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
    const activePanel = panels[0] || null;

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
                    arr.push({ ...draft, type: "cubic", ax: a.x, ay: a.y, bx: b.x, by: b.y, aRef, bRef });
                    return { ...map, [activePanel.id]: arr };
                });
            }
            else {
                // внутренняя волнистая линия
                const base = sampleBezierPoints(a.x, a.y, draft.c1.x, draft.c1.y, draft.c2.x, draft.c2.y, b.x, b.y, 64);
                const ampW = waveAmpPx * (scale.k || 1);
                const lambdaW = waveLenPx * (scale.k || 1);
                const wpts = waveAlongPolyline(base, ampW, lambdaW, null);
                const d = catmullRomToBezierPath(wpts);
                setCurvesByPanel((map) => {
                    const arr = [...(map[activePanel.id] || [])];
                    arr.push({ id: draft.id, type: "wavy", aIdx: addBuffer, bIdx: idx, d, pts: wpts, ax: a.x, ay: a.y, bx: b.x, by: b.y, aRef, bRef });
                    return { ...map, [activePanel.id]: arr };
                });
            }

            setAddBuffer(null);
            return;
        }

        // 2) Иначе ведём линию по кратчайшей дуге кромки с отступом внутрь.
        //    Отступ задаётся в пикселях экрана (edgeInsetPx), здесь переводим в мировые.
        const inset = Math.max(0, edgeInsetPx) * (scale.k || 1);
        // подменяем anchors на merged, чтобы routeCurveAlongOutline видел «новые вершины»
        const panelWithMerged = { ...activePanel, anchors: merged };
        const routed = routeCurveAlongOutline(
            panelWithMerged,
            draft,
            inset,
            lineStyle === "wavy"
                ? { style: "wavy", ampWorld: waveAmpPx * (scale.k || 1), lambdaWorld: waveLenPx * (scale.k || 1) }
                : { style: "straight" },
            ringsByPanel
        );

        // Если не удалось прижать (крайний случай) — просто выходим в просмотр.
        if (!routed) {
            setAddBuffer(null); // остаёмся в режиме добавления
            return;
        }

        // 3) Сохраняем «прижатую» кривую и невидимые коннекторы к контуру (для корректной заливки).
        setCurvesByPanel((map) => {
            const arr = [...(map[activePanel.id] || [])];
            arr.push({
                id: draft.id,
                type: "routed",
                aIdx: addBuffer,
                bIdx: idx,
                d: routed.d,       // сглаженный путь для рендера
                pts: routed.pts,   // точки прижатой дуги (для faces)
                connA: routed.connA, // [Q0, P0] — коннектор к кромке
                connB: routed.connB, // [Q1, P1] — коннектор к кромке
                ax: a.x, ay: a.y, bx: b.x, by: b.y,
                aRef,
                bRef
            });
            return { ...map, [activePanel.id]: arr };
        });

        // очистка состояния
        setAddBuffer(null);
    };

    const cascadeDeleteCurve = (panelId, rootCurveId) => {
        setCurvesByPanel(prev => {
            const arr = [...(prev[panelId] || [])];
            // 1) собираем id всех зависимых кривых (BFS)
            const toDelete = new Set([rootCurveId]);
            let changed = true;
            while (changed) {
                changed = false;
                for (const c of arr) {
                    if (toDelete.has(c.id)) continue;
                    const aHit = c.aRef?.type === 'extra' && c.aRef.curveId && toDelete.has(c.aRef.curveId);
                    const bHit = c.bRef?.type === 'extra' && c.bRef.curveId && toDelete.has(c.bRef.curveId);
                    if (aHit || bHit) {
                        toDelete.add(c.id);
                        changed = true;
                    }
                }
            }
            // 2) фильтруем
            const kept = arr.filter(c => !toDelete.has(c.id));
            return { ...prev, [panelId]: kept };
        });
    };

    const onCurveEnter = (panelId, id) => { if (mode === "delete") setHoverCurveKey(`${panelId}:${id}`); };
    const onCurveLeave = (panelId, id) => { if (mode === "delete") setHoverCurveKey(k => (k === `${panelId}:${id}` ? null : k)); };
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

    // ...другие состояния
    const [edgeInsetPx, setEdgeInsetPx] = useState(8); // отступ от края, px экрана

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
        if (mode === 'add' || mode === 'delete') setLastLineMode(mode);
    }, [mode]);

    // --- PRESETS: начальная подгрузка и переключение
    useEffect(() => {
        if (initialSVG) return; // если SVG уже пришёл сверху — не грузим пресеты
        const p = PRESETS[presetIdx];
        if (!p) return;
        let alive = true;
        setIsLoadingPreset(true);
        fetch(`${SVG_BASE}/${p.file}`)
            .then(r => r.text())
            .then(txt => { if (alive) { setRawSVG(txt); setSvgMountKey(k => k + 1); } })
            .catch(() => { if (alive) setRawSVG(""); })
            .finally(() => { if (alive) setIsLoadingPreset(false); });
        return () => { alive = false; };
    }, [presetIdx, initialSVG]);

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
        };

        el.addEventListener("keydown", onKey);
        return () => el.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        if (!rawSVG) return;

        const parts = extractPanels(rawSVG);

        // Снимок прежней сцены для анимации
        const old = panelsRef.current;
        if (old && old.length) {
            didEverSwapRef.current = true;

            setPrevPanels(old);
            setIsSwapping(true);

            // не допускаем наложения таймеров
            if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
            swapTimerRef.current = setTimeout(() => {
                setPrevPanels(null);
                setIsSwapping(false);
                swapTimerRef.current = null;
            }, SWAP_MS);
        }

        setPanels(parts);
        setCurvesByPanel({});
        setFills([]);
        setMode("preview");

        if (!parts.length) {
            // Диагностика причин
            const hasImage = /<image\b[^>]+(?:href|xlink:href)=["']data:image\//i.test(rawSVG) ||
                /<image\b[^>]+(?:href|xlink:href)=["'][^"']+\.(png|jpe?g|webp)/i.test(rawSVG);
            const hasForeign = /<foreignObject\b/i.test(rawSVG);
            const hasVectorTags = /<(path|polygon|polyline|rect|circle|ellipse|line)\b/i.test(rawSVG);

            let msg =
                "В SVG не найдено векторных контуров для деталей. " +
                "Экспортируйте выкройку как вектор (path/polygon/polyline/rect/circle/ellipse/line).";

            if (hasImage && !hasVectorTags) {
                msg = "Похоже, это растровая картинка, встроенная в SVG (<image>). " +
                    "Нужно экспортировать из исходной программы именно векторные контуры (path и др.).";
            } else if (hasForeign && !hasVectorTags) {
                msg = "Файл использует <foreignObject> (встроенный HTML/растровый контент). " +
                    "Экспортируйте чистый векторный SVG без foreignObject.";
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
    }, [rawSVG]);

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

                            const clickableFaces = faces.length ? faces : (ring ? [ring] : []);

                            return (
                                <g key={p.id}>
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
                                        const cls = (mode === 'delete' && hoverCurveKey === key)
                                            ? styles.userCurveDeleteHover
                                            : (mode === 'preview' ? styles.userCurvePreview : styles.userCurve);

                                        return (
                                            <path
                                                key={c.id}
                                                d={d}
                                                className={cls}
                                                onMouseEnter={() => onCurveEnter(p.id, c.id)}
                                                onMouseLeave={() => onCurveLeave(p.id, c.id)}
                                                onClick={() => onCurveClickDelete(p.id, c.id)}
                                            />
                                        );
                                    })}

                                    {/* ANCHORS (базовые + новые) — кликаем по merged-индексам */}
                                    {activePanel?.id === p.id && (mode === 'add' || mode === 'delete') && (() => {
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
                                                onClick={() => onAnchorClickAddMode(mi)}
                                                onMouseEnter={() => setHoverAnchorIdx(mi)}
                                                onMouseLeave={() => setHoverAnchorIdx(null)}
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

                            <div className={`${styles.segmented} ${styles.two}`} style={{ marginBottom: 8 }}>
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

                            <div className={`${styles.segmented} ${styles.two}`} style={{ marginBottom: 8 }}>
                                <button className={`${styles.segBtn} ${mode === 'add' ? styles.segActive : ''}`} onClick={() => { setMode('add'); setAddBuffer(null); }}>＋ Добавить</button>
                                <button className={`${styles.segBtn} ${mode === 'delete' ? styles.segActive : ''}`} onClick={() => setMode('delete')}>🗑 Удалить</button>
                            </div>

                            {/* Тип линии и параметры — как было */}
                            <div className={styles.segmented}>
                                <button
                                    className={`${styles.segBtn} ${lineStyle === 'straight' ? styles.segActive : ''}`}
                                    onClick={() => setLineStyle('straight')}
                                >Прямая</button>
                                <button
                                    className={`${styles.segBtn} ${lineStyle === 'wavy' ? styles.segActive : ''}`}
                                    onClick={() => setLineStyle('wavy')}
                                >Волнистая</button>
                            </div>

                            {lineStyle === 'wavy' && (
                                <>
                                    <div className={styles.subRow}>
                                        <span className={styles.slimLabel}>Амплитуда</span>
                                        <input type="range" min={2} max={24} step={1}
                                            value={waveAmpPx} onChange={e => setWaveAmpPx(+e.target.value)}
                                            className={styles.rangeCompact} />
                                        <span className={styles.value}>{waveAmpPx}px</span>
                                    </div>
                                    <div className={styles.subRow}>
                                        <span className={styles.slimLabel}>Длина волны</span>
                                        <input type="range" min={12} max={80} step={2}
                                            value={waveLenPx} onChange={e => setWaveLenPx(+e.target.value)}
                                            className={styles.rangeCompact} />
                                        <span className={styles.value}>{waveLenPx}px</span>
                                    </div>
                                </>
                            )}

                            {lineStyle === 'straight' && (
                                <>
                                    <div className={styles.subRow} style={{ marginTop: 8 }}>
                                        <span className={styles.slimLabel}>Отступ от края</span>
                                        <input type="range" min={0} max={24} step={1}
                                            value={edgeInsetPx} onChange={e => setEdgeInsetPx(+e.target.value)}
                                            className={styles.rangeCompact} />
                                        <span className={styles.value}>{edgeInsetPx}px</span>
                                    </div>
                                    <div className={styles.hintSmall}>
                                        Используется, когда прямая выходит за деталь: линия ведётся по кромке с этим отступом внутрь.
                                    </div>
                                </>
                            )}

                            {/* NEW: количество новых вершин на любой пользовательской линии */}
                            <div className={styles.subRow} style={{ marginTop: 10 }}>
                                <span className={styles.slimLabel}>Новые вершины</span>
                                <input
                                    type="range"
                                    min={2}
                                    max={10}
                                    step={1}
                                    value={subAnchorCount}
                                    onChange={e => setSubAnchorCount(+e.target.value)}
                                    className={styles.rangeCompact}
                                />
                                <span className={styles.value}>{subAnchorCount}</span>
                            </div>
                        </div>
                    )}

                </div>
            </aside>

        </div>
    );
}