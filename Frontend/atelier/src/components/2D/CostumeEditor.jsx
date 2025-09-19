import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import styles from "./CostumeEditor.module.css";

/* ===================== PATH PARSER (M/L/C/Z) ===================== */
function parsePathD(d) {
    d = d.replace(/,/g, " ").replace(/\s+/g, " ").trim();
    const tokens = d.match(/[MLCZmlcz]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) || [];
    let i = 0, cmd = null;
    const segs = [];
    let curr = { x: 0, y: 0 }, start = { x: 0, y: 0 };
    const read = () => parseFloat(tokens[i++]);

    while (i < tokens.length) {
        let t = tokens[i++];
        if (/[MLCZmlcz]/.test(t)) cmd = t;

        switch (cmd) {
            case "M":
            case "m": {
                const rel = cmd === "m";
                const x = read(), y = read();
                const nx = rel ? curr.x + x : x;
                const ny = rel ? curr.y + y : y;
                curr = { x: nx, y: ny };
                start = { ...curr };
                segs.push({ kind: "M", x: nx, y: ny });
                while (i < tokens.length && !/[MLCZmlcz]/.test(tokens[i])) {
                    const lx = read(), ly = read();
                    const nx2 = rel ? curr.x + lx : lx;
                    const ny2 = rel ? curr.y + ly : ly;
                    segs.push({ kind: "L", ax: curr.x, ay: curr.y, x: nx2, y: ny2 });
                    curr = { x: nx2, y: ny2 };
                }
                break;
            }
            case "L":
            case "l": {
                const rel = cmd === "l";
                const x = read(), y = read();
                const nx = rel ? curr.x + x : x;
                const ny = rel ? curr.y + y : y;
                segs.push({ kind: "L", ax: curr.x, ay: curr.y, x: nx, y: ny });
                curr = { x: nx, y: ny };
                break;
            }
            case "C":
            case "c": {
                const rel = cmd === "c";
                const x1 = read(), y1 = read();
                const x2 = read(), y2 = read();
                const x = read(), y = read();
                const seg = {
                    kind: "C",
                    ax: curr.x, ay: curr.y,
                    x1: rel ? curr.x + x1 : x1,
                    y1: rel ? curr.y + y1 : y1,
                    x2: rel ? curr.x + x2 : x2,
                    y2: rel ? curr.y + y2 : y2,
                    x: rel ? curr.x + x : x,
                    y: rel ? curr.y + y : y
                };
                segs.push(seg);
                curr = { x: seg.x, y: seg.y };
                break;
            }
            case "Z":
            case "z":
                segs.push({ kind: "Z" });
                curr = { ...start };
                break;
            default:
                // игнорируем прочие команды (H/V/S/Q/A) — лучше отфлэттить в редакторе
                break;
        }
    }
    return segs;
}

function buildPathD(segs) {
    return segs.map(s => {
        if (s.kind === "M") return `M ${s.x} ${s.y}`;
        if (s.kind === "L") return `L ${s.x} ${s.y}`;
        if (s.kind === "C") return `C ${s.x1} ${s.y1} ${s.x2} ${s.y2} ${s.x} ${s.y}`;
        if (s.kind === "Z") return `Z`;
        return "";
    }).join(" ");
}

function getBounds(segs) {
    const xs = [], ys = [];
    for (const s of segs) {
        if (s.kind === "M") { xs.push(s.x); ys.push(s.y); }
        if (s.kind === "L") { xs.push(s.ax, s.x); ys.push(s.ay, s.y); }
        if (s.kind === "C") { xs.push(s.ax, s.x1, s.x2, s.x); ys.push(s.ay, s.y1, s.y2, s.y); }
    }
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

/* ===================== DISCRETIZATION ===================== */
function sampleBezier(ax, ay, x1, y1, x2, y2, x, y, steps = 36) {
    const pts = [];
    let px = ax, py = ay;
    for (let k = 1; k <= steps; k++) {
        const t = k / steps;
        const xt = (1 - t) ** 3 * ax + 3 * (1 - t) ** 2 * t * x1 + 3 * (1 - t) * t ** 2 * x2 + t ** 3 * x;
        const yt = (1 - t) ** 3 * ay + 3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3 * y;
        pts.push({ x: px, y: py }, { x: xt, y: yt });
        px = xt; py = yt;
    }
    return pts;
}
function sampleLine(ax, ay, x, y) {
    return [{ x: ax, y: ay }, { x, y }];
}

/* ===================== PLANAR GRAPH / FACES ===================== */
const EPS = 1e-9;
function area(poly) {
    let s = 0;
    for (let i = 0; i < poly.length; i++) {
        const a = poly[i], b = poly[(i + 1) % poly.length];
        s += a.x * b.y - b.x * a.y;
    }
    return s / 2;
}
function segIntersect(p, q, r, s) {
    const ux = q.x - p.x, uy = q.y - p.y;
    const vx = s.x - r.x, vy = s.y - r.y;
    const wx = p.x - r.x, wy = p.y - r.y;
    const D = ux * vy - uy * vx;
    if (Math.abs(D) < EPS) return null;
    const t = (vx * wy - vy * wx) / D;
    const u = (ux * wy - uy * wx) / D;
    if (t <= EPS || t >= 1 - EPS || u <= EPS || u >= 1 - EPS) return null;
    return { t, u, x: p.x + t * ux, y: p.y + t * uy };
}
function splitByIntersections(segments) {
    const lists = segments.map(() => [0, 1]);
    const pts = segments.map(() => ({}));
    for (let i = 0; i < segments.length; i++) {
        for (let j = i + 1; j < segments.length; j++) {
            const A = segments[i], B = segments[j];
            const hit = segIntersect(A.a, A.b, B.a, B.b);
            if (!hit) continue;
            lists[i].push(hit.t); pts[i][hit.t] = { x: hit.x, y: hit.y };
            lists[j].push(hit.u); pts[j][hit.u] = { x: hit.x, y: hit.y };
        }
    }
    const res = [];
    for (let i = 0; i < segments.length; i++) {
        const S = segments[i];
        const ts = Array.from(new Set(lists[i])).sort((a, b) => a - b);
        const p = (t) => ({ x: S.a.x + (S.b.x - S.a.x) * t, y: S.a.y + (S.b.y - S.a.y) * t });
        for (let k = 0; k + 1 < ts.length; k++) {
            const t1 = ts[k], t2 = ts[k + 1];
            if (t2 - t1 < 1e-6) continue;
            const P1 = pts[i][t1] || p(t1);
            const P2 = pts[i][t2] || p(t2);
            res.push({ a: P1, b: P2 });
        }
    }
    return res;
}
function buildFacesFromSegments(segments) {
    const nodes = new Map();
    const key = (p) => `${p.x.toFixed(2)}_${p.y.toFixed(2)}`;
    const getNode = (p) => {
        const k = key(p);
        if (!nodes.has(k)) nodes.set(k, { ...p, out: [] });
        return nodes.get(k);
    };
    const half = [];
    const addHalf = (A, B) => {
        const h = { from: A, to: B, ang: Math.atan2(B.y - A.y, B.x - A.x), twin: null, next: null, visited: false };
        half.push(h); A.out.push(h); return h;
    };
    for (const s of segments) {
        const A = getNode(s.a), B = getNode(s.b);
        const h1 = addHalf(A, B), h2 = addHalf(B, A);
        h1.twin = h2; h2.twin = h1;
    }
    for (const n of nodes.values()) n.out.sort((a, b) => b.ang - a.ang);
    for (const n of nodes.values()) {
        for (const h of n.out) {
            const arr = h.to.out;
            const i = arr.indexOf(h.twin);
            h.next = arr[(i - 1 + arr.length) % arr.length];
        }
    }
    const faces = [];
    for (const h of half) {
        if (h.visited) continue;
        const poly = [];
        let cur = h, guard = 0;
        while (!cur.visited && guard++ < 20000) {
            cur.visited = true;
            poly.push({ x: cur.from.x, y: cur.from.y });
            cur = cur.next;
            if (cur === h) break;
        }
        if (poly.length >= 3) faces.push(poly);
    }
    if (faces.length) {
        const idxMax = faces.map((p, i) => ({ i, A: Math.abs(area(p)) })).sort((a, b) => b.A - a.A)[0].i;
        faces.splice(idxMax, 1);
    }
    return faces;
}

/* ===================== HELPERS ===================== */
function collectAnchors(segs) {
    const out = [];
    segs.forEach(s => {
        if (s.kind === "M") out.push({ x: s.x, y: s.y });
        if (s.kind === "L" || s.kind === "C") out.push({ x: s.x, y: s.y });
    });
    return out;
}
function makeUserCurveBetween(a, b) {
    const k = 1 / 3;
    const c1 = { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
    const c2 = { x: b.x - (b.x - a.x) * k, y: b.y - (b.y - a.y) * k };
    return { c1, c2 };
}

/* ===================== EXTRACT MULTIPLE PATHS FROM SVG ===================== */
function extractPaths(rawSVG) {
    // найдём все <path ...> и вытащим d + id/label
    const tags = [...rawSVG.matchAll(/<path\b([^>]*?)\/?>/gi)].map(m => m[0]);
    const items = [];
    for (const tag of tags) {
        const dMatch = tag.match(/\sd="([^"]+)"/i);
        if (!dMatch) continue;
        const idMatch = tag.match(/\sid="([^"]+)"/i);
        const label = idMatch?.[1] || null;
        const d = dMatch[1];
        // используем только ЗАМКНУТЫЕ пути (содержат Z/z)
        if (!/[Zz]/.test(d)) continue;
        // парсим; если в d попались не-MLCZ, парсер их проигнорит — такой путь может получиться пустым
        const segs = parsePathD(d);
        if (!segs.length) continue;
        // грубая площадь по bbox для сортировки
        const b = getBounds(segs);
        const bboxArea = Math.abs(b.w * b.h);
        items.push({ d, segs, label, bboxArea });
    }
    // отсортируем по площади, крупные детали вверху
    items.sort((a, b) => b.bboxArea - a.bboxArea);
    // можно отсечь совсем мелкие (надсечки/швы), оставим топ-8
    return items.slice(0, 8);
}

/* ===================== COMPONENT ===================== */
// Панель: { id, label, segs, anchors }
export default function CostumeEditor({ initialSVG }) {
    const [rawSVG, setRawSVG] = useState(initialSVG || "");
    const [panels, setPanels] = useState([]); // массив панелей
    const [activePanelId, setActivePanelId] = useState(null);

    // user curves per panelId
    const [curvesByPanel, setCurvesByPanel] = useState({}); // { [panelId]: Array<{id,aIdx,bIdx,c1,c2}> }
    const [hoverCurveKey, setHoverCurveKey] = useState(null); // `${panelId}:${curveId}`

    // fills per panel
    const [fills, setFills] = useState([]); // {panelId, faceKey, color, id}
    const [hoverFace, setHoverFace] = useState(null); // {panelId, faceKey} | null
    const [paintColor, setPaintColor] = useState("#f26522");

    // modes
    const [mode, setMode] = useState("preview"); // preview | add | delete | paint | deleteFill
    const [addBuffer, setAddBuffer] = useState(null); // anchor index for active panel
    const [hoverAnchorIdx, setHoverAnchorIdx] = useState(null);

    // svg / scale
    const svgRef = useRef(null);
    const [scale, setScale] = useState({ k: 1 });

    // LOAD SVG
    const onFile = async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const text = await f.text();
        setRawSVG(text);
    };

    // Parse SVG into panels
    useEffect(() => {
        if (!rawSVG) return;
        const items = extractPaths(rawSVG);
        const mapped = items.map((it, idx) => ({
            id: String(idx + 1),
            label: it.label || (idx === 0 ? "Перед" : idx === 1 ? "Спинка" : `Панель ${idx + 1}`),
            segs: it.segs,
            anchors: collectAnchors(it.segs),
        }));
        setPanels(mapped);
        setActivePanelId(mapped[0]?.id || null);
        setCurvesByPanel({});
        setFills([]);
        setMode("preview");
    }, [rawSVG]);

    // DEMO with 2 panels
    const loadDemo = () => {
        const demo = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
  <path id="front" d="M 80 120 C 100 60 300 60 420 120 L 420 460 C 420 520 100 520 80 460 Z" />
  <path id="back"  d="M 480 120 C 500 60 700 60 820 120 L 820 460 C 820 520 500 520 480 460 Z" />
</svg>`;
        setRawSVG(demo);
    };

    // scale / viewBox for entire scene (all panels)
    const viewBox = useMemo(() => {
        if (!panels.length) return "0 0 800 500";
        // объединённые границы
        const boxes = panels.map(p => getBounds(p.segs));
        const minX = Math.min(...boxes.map(b => b.x)), minY = Math.min(...boxes.map(b => b.y));
        const maxX = Math.max(...boxes.map(b => b.x + b.w)), maxY = Math.max(...boxes.map(b => b.y + b.h));
        const w = maxX - minX, h = maxY - minY;
        const pad = Math.max(w, h) * 0.06;
        return `${minX - pad} ${minY - pad} ${w + pad * 2} ${h + pad * 2}`;
    }, [panels]);

    useLayoutEffect(() => {
        const update = () => {
            const svg = svgRef.current;
            if (!svg || !panels.length) return;
            const vb = svg.viewBox.baseVal;
            const kx = vb.width / svg.clientWidth;
            const ky = vb.height / svg.clientHeight;
            setScale({ k: Math.max(kx, ky) });
        };
        update();
        const ro = new ResizeObserver(update);
        if (svgRef.current) ro.observe(svgRef.current);
        window.addEventListener("resize", update);
        return () => { ro.disconnect(); window.removeEventListener("resize", update); };
    }, [panels.length]);

    // faces per panel (computed independently)
    const facesByPanel = useMemo(() => {
        const result = {};
        for (const p of panels) {
            // base polylines from segs
            const polylines = [];
            let start = null, curr = null;
            for (const s of p.segs) {
                if (s.kind === "M") { start = { x: s.x, y: s.y }; curr = start; }
                else if (s.kind === "L") { polylines.push(sampleLine(s.ax, s.ay, s.x, s.y)); curr = { x: s.x, y: s.y }; }
                else if (s.kind === "C") { polylines.push(sampleBezier(s.ax, s.ay, s.x1, s.y1, s.x2, s.y2, s.x, s.y)); curr = { x: s.x, y: s.y }; }
                else if (s.kind === "Z" && curr && start && (curr.x !== start.x || curr.y !== start.y)) {
                    polylines.push(sampleLine(curr.x, curr.y, start.x, start.y));
                }
            }
            // user curves for this panel
            const curves = curvesByPanel[p.id] || [];
            curves.forEach(c => {
                const a = p.anchors[c.aIdx], b = p.anchors[c.bIdx];
                polylines.push(sampleBezier(a.x, a.y, c.c1.x, c.c1.y, c.c2.x, c.c2.y, b.x, b.y));
            });

            // polyline -> segments -> cut -> faces
            const segsFlat = [];
            for (const line of polylines)
                for (let i = 0; i + 1 < line.length; i += 2) segsFlat.push({ a: line[i], b: line[i + 1] });

            const cut = splitByIntersections(segsFlat);
            result[p.id] = buildFacesFromSegments(cut);
        }
        return result;
    }, [panels, curvesByPanel]);

    // clean stale fills when faces change
    useEffect(() => {
        setFills(fs => fs.filter(f => (facesByPanel[f.panelId] || []).some(poly => faceKey(poly) === f.faceKey)));
    }, [facesByPanel]);

    // grid
    const gridDef = useMemo(() => {
        if (!panels.length) return { step: 40, b: { x: 0, y: 0, w: 800, h: 500 } };
        const boxes = panels.map(p => getBounds(p.segs));
        const minX = Math.min(...boxes.map(b => b.x)), minY = Math.min(...boxes.map(b => b.y));
        const maxX = Math.max(...boxes.map(b => b.x + b.w)), maxY = Math.max(...boxes.map(b => b.y + b.h));
        const w = maxX - minX, h = maxY - minY;
        const step = Math.max(1e-6, Math.min(w, h) / 20);
        return { step, b: { x: minX, y: minY, w, h } };
    }, [panels]);

    // hotkeys
    useEffect(() => {
        const onKey = (e) => {
            const k = e.key.toLowerCase?.();
            if (e.key === "Escape") setMode("preview");
            else if (k === "a") { setMode("add"); setAddBuffer(null); }
            else if (k === "d") setMode("delete");
            else if (k === "f") setMode("paint");
            else if (k === "x") setMode("deleteFill");
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    /* ===================== ACTIONS ===================== */
    const activePanel = panels.find(p => p.id === activePanelId);

    const onAnchorClickAddMode = (idx) => {
        if (!activePanel) return;
        if (addBuffer == null) setAddBuffer(idx);
        else if (addBuffer !== idx) {
            const a = activePanel.anchors[addBuffer];
            const b = activePanel.anchors[idx];
            const { c1, c2 } = makeUserCurveBetween(a, b);
            setCurvesByPanel(map => {
                const arr = [...(map[activePanel.id] || [])];
                arr.push({ id: crypto.randomUUID(), aIdx: addBuffer, bIdx: idx, c1, c2 });
                return { ...map, [activePanel.id]: arr };
            });
            setAddBuffer(null);
            setMode("preview");
        }
    };

    const onCurveEnter = (panelId, id) => { if (mode === "delete") setHoverCurveKey(`${panelId}:${id}`); };
    const onCurveLeave = (panelId, id) => { if (mode === "delete") setHoverCurveKey(k => (k === `${panelId}:${id}` ? null : k)); };
    const onCurveClickDelete = (panelId, id) => {
        if (mode !== "delete") return;
        setCurvesByPanel(map => {
            const arr = (map[panelId] || []).filter(c => c.id !== id);
            return { ...map, [panelId]: arr };
        });
        setHoverCurveKey(null);
    };

    const facePath = (poly) => `M ${poly.map(p => `${p.x} ${p.y}`).join(" L ")} Z`;
    const faceKey = (poly) => poly.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join("|");

    const onFaceEnter = (panelId, poly) => { if (mode === "paint") setHoverFace({ panelId, faceKey: faceKey(poly) }); };
    const onFaceLeave = (panelId, poly) => { if (mode === "paint") setHoverFace(h => (h && h.panelId === panelId && h.faceKey === faceKey(poly) ? null : h)); };
    const onFaceClick = (panelId, poly) => {
        if (mode !== "paint") return;
        const fk = faceKey(poly);
        setFills(fs => {
            const i = fs.findIndex(f => f.panelId === panelId && f.faceKey === fk);
            if (i >= 0) {
                const copy = fs.slice(); copy[i] = { ...copy[i], color: paintColor }; return copy;
            }
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

    const isPreview = mode === "preview";
    const R = 6 * scale.k;

    return (
        <div className={styles.layout}>
            {/* CANVAS */}
            <div className={styles.canvasWrap}>
                <svg
                    ref={svgRef}
                    className={styles.canvas}
                    viewBox={viewBox}
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <pattern id="grid" width={gridDef.step} height={gridDef.step} patternUnits="userSpaceOnUse">
                            <path d={`M 0 0 L ${gridDef.step} 0 M 0 0 L 0 ${gridDef.step}`} stroke="#eee" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                        </pattern>
                    </defs>
                    <rect
                        x={gridDef.b.x - gridDef.b.w}
                        y={gridDef.b.y - gridDef.b.h}
                        width={gridDef.b.w * 3}
                        height={gridDef.b.h * 3}
                        fill="url(#grid)"
                    />

                    {/* FILLS & FACE HIT TARGETS (for each panel) */}
                    {panels.map(p => (
                        <g key={`fills-${p.id}`}>
                            {(facesByPanel[p.id] || []).map(poly => {
                                const d = facePath(poly);
                                const fk = faceKey(poly);
                                const existing = fills.find(f => f.panelId === p.id && f.faceKey === fk);
                                if (existing) {
                                    const hovering = hoverFace && hoverFace.panelId === p.id && hoverFace.faceKey === fk && mode === "deleteFill";
                                    return (
                                        <path key={`fill-${p.id}-${fk}`}
                                            d={d}
                                            fill={existing.color}
                                            fillOpacity={hovering ? 0.55 : 0.35}
                                            stroke="none"
                                            onPointerEnter={() => onFilledEnter(p.id, fk)}
                                            onPointerLeave={() => onFilledLeave(p.id, fk)}
                                            onPointerDown={() => onFilledClick(p.id, fk)}
                                            style={mode === "preview" ? { pointerEvents: "none" } : undefined}
                                        />
                                    );
                                }
                                const hover = hoverFace && hoverFace.panelId === p.id && hoverFace.faceKey === fk && mode === "paint";
                                return (
                                    <path key={`face-${p.id}-${fk}`}
                                        d={d}
                                        fill={hover ? "#000" : "transparent"}
                                        fillOpacity={hover ? 0.08 : 0}
                                        stroke="none"
                                        onPointerEnter={() => onFaceEnter(p.id, poly)}
                                        onPointerLeave={() => onFaceLeave(p.id, poly)}
                                        onPointerDown={() => onFaceClick(p.id, poly)}
                                        style={mode === "paint" ? undefined : { pointerEvents: "none" }}
                                    />
                                );
                            })}
                        </g>
                    ))}

                    {/* BASE OUTLINES */}
                    {panels.map(p => {
                        const d = buildPathD(p.segs);
                        return <path key={`base-${p.id}`} d={d} fill="none" stroke="#111" strokeWidth="2" vectorEffect="non-scaling-stroke" />;
                    })}

                    {/* USER CURVES (all panels, but clickable only when that panel active) */}
                    {panels.map(p => {
                        const curves = curvesByPanel[p.id] || [];
                        return (
                            <g key={`curves-${p.id}`}>
                                {curves.map(c => {
                                    const a = p.anchors[c.aIdx], b = p.anchors[c.bIdx];
                                    const d = `M ${a.x} ${a.y} C ${c.c1.x} ${c.c1.y} ${c.c2.x} ${c.c2.y} ${b.x} ${b.y}`;
                                    const key = `${p.id}:${c.id}`;
                                    const del = mode === "delete" && hoverCurveKey === key;
                                    const pe = (mode === "preview" || mode === "paint" || mode === "deleteFill") ? "none" : (p.id === activePanelId ? "auto" : "none");
                                    return (
                                        <path
                                            key={key}
                                            d={d}
                                            className={del ? styles.userCurveDeleteHover : styles.userCurve}
                                            onPointerEnter={() => onCurveEnter(p.id, c.id)}
                                            onPointerLeave={() => onCurveLeave(p.id, c.id)}
                                            onPointerDown={() => onCurveClickDelete(p.id, c.id)}
                                            fill="none"
                                            vectorEffect="non-scaling-stroke"
                                            style={{ pointerEvents: pe }}
                                        />
                                    );
                                })}
                            </g>
                        );
                    })}

                    {/* ANCHORS (only active panel in add-mode) */}
                    {mode === "add" && activePanel && activePanel.anchors.map((pt, idx) => {
                        const isFirst = addBuffer === idx;
                        const isHover = hoverAnchorIdx === idx;
                        const classes = [
                            styles.anchor, styles.anchorClickable,
                            isFirst ? styles.anchorSelectedA : "",
                            (!isFirst && isHover) ? styles.anchorSelectedB : "",
                        ].join(" ");
                        return (
                            <circle key={idx}
                                cx={pt.x} cy={pt.y} r={R}
                                className={classes}
                                onPointerEnter={() => setHoverAnchorIdx(idx)}
                                onPointerLeave={() => setHoverAnchorIdx(null)}
                                onPointerDown={() => onAnchorClickAddMode(idx)}
                            />
                        );
                    })}
                </svg>
            </div>

            {/* SIDEBAR */}
            <aside className={styles.sidebar}>
                <div className={styles.panel}>
                    <h3 className={styles.panelTitle}>Редактор</h3>

                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Файл</div>
                        <label className={styles.fileBtn}>
                            Загрузить SVG (перед+спинка в одном)
                            <input type="file" accept=".svg,image/svg+xml" onChange={onFile} />
                        </label>
                        <button className={styles.btnGhost} onClick={loadDemo}>Демо: 2 панели</button>
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Панели</div>
                        <div className={styles.btnGroupV}>
                            {panels.map(p => (
                                <button
                                    key={p.id}
                                    className={`${styles.btn} ${activePanelId === p.id ? styles.btnActive : ""}`}
                                    onClick={() => setActivePanelId(p.id)}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Режим</div>
                        <div className={styles.btnGroupV}>
                            <button className={`${styles.btn} ${isPreview ? styles.btnActive : ""}`} onClick={() => setMode("preview")}>Просмотр <kbd className={styles.kbd}>Esc</kbd></button>
                            <button className={`${styles.btn} ${mode === "add" ? styles.btnActive : ""}`} onClick={() => { setMode("add"); setAddBuffer(null); }}>Добавить кривую <kbd className={styles.kbd}>A</kbd></button>
                            <button className={`${styles.btn} ${mode === "delete" ? styles.btnDangerActive : ""}`} onClick={() => setMode("delete")}>Удалить линию <kbd className={styles.kbd}>D</kbd></button>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Заливка</div>
                        <div className={styles.paintRow}>
                            <button className={`${styles.btn} ${mode === "paint" ? styles.btnActive : ""}`} onClick={() => setMode("paint")}>🪣 Заливка <kbd className={styles.kbd}>F</kbd></button>
                            <input type="color" className={styles.color} value={paintColor} onChange={(e) => setPaintColor(e.target.value)} />
                        </div>
                        <div className={styles.swatches}>
                            {["#f26522", "#30302e", "#93c5fd", "#a7f3d0", "#fde68a", "#d8b4fe"].map(c => (
                                <button key={c} className={styles.swatch} style={{ background: c }} onClick={() => setPaintColor(c)} />
                            ))}
                        </div>
                        <button className={`${styles.btn} ${mode === "deleteFill" ? styles.btnDangerActive : ""}`} onClick={() => setMode("deleteFill")}>Удалить заливку <kbd className={styles.kbd}>X</kbd></button>
                    </div>
                </div>
            </aside>
        </div>
    );
}
