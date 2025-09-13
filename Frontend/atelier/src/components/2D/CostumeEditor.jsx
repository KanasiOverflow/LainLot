import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import styles from "./CostumeEditor.module.css";

/* ===================== utils ===================== */
// --- парсинг исходного path ---
function parsePathD(d) {
    d = d.replace(/,/g, " ").replace(/\s+/g, " ").trim();
    const tokens = d.match(/[MLCZmlcz]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) || [];
    let i = 0, cmd = null;
    const segs = [];
    let curr = { x: 0, y: 0 }, start = { x: 0, y: 0 };
    const read = () => parseFloat(tokens[i++]);

    while (i < tokens.length) {
        const t = tokens[i++];
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
/* ===================== дискретизация и граф ===================== */
const TOL_KEY = 2; // десятых пикселя в ключе узла

function keyOf(p) { return `${p.x.toFixed(TOL_KEY)}_${p.y.toFixed(TOL_KEY)}`; }

function sampleBezier(ax, ay, x1, y1, x2, y2, x, y, steps = 24) {
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
function sampleLine(ax, ay, x, y, steps = 1) {
    const pts = [];
    let px = ax, py = ay;
    for (let k = 1; k <= steps; k++) {
        const t = k / steps;
        const xt = ax + (x - ax) * t;
        const yt = ay + (y - ay) * t;
        pts.push({ x: px, y: py }, { x: xt, y: yt });
        px = xt; py = yt;
    }
    return pts;
}

/* полурёбра и обход граней */
function angle(from, to) { return Math.atan2(to.y - from.y, to.x - from.x); }
function area(poly) {
    let s = 0;
    for (let i = 0; i < poly.length; i++) {
        const a = poly[i], b = poly[(i + 1) % poly.length];
        s += a.x * b.y - b.x * a.y;
    }
    return s / 2;
}

// === пересечения отрезков и нарезка на под-отрезки ===
const EPS = 1e-9;
function onSegment(t) { return t > EPS && t < 1 - EPS; } // строго внутри (края игнорируем)

function segIntersect(p, q, r, s) {
    // p->q и r->s, вернёт {t,u, x,y} либо null
    const ux = q.x - p.x, uy = q.y - p.y;
    const vx = s.x - r.x, vy = s.y - r.y;
    const wx = p.x - r.x, wy = p.y - r.y;
    const D = ux * vy - uy * vx;
    if (Math.abs(D) < EPS) return null; // параллельны или совпадают — для простоты пропустим
    const t = (vx * wy - vy * wx) / D;  // p + t*u
    const u = (ux * wy - uy * wx) / D;  // r + u*v
    if (t <= EPS || t >= 1 - EPS || u <= EPS || u >= 1 - EPS) return null; // только «истинные» пересечения
    return { t, u, x: p.x + t * ux, y: p.y + t * uy };
}

function splitByIntersections(segments) {
    // segments: [{a:{x,y}, b:{x,y}}]
    const lists = segments.map(() => [0, 1]);         // t-координаты для каждого сегмента
    const pts = segments.map(() => ({}));          // t -> {x,y}

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

function buildFaces(segments) {
    const nodes = new Map();
    const key = (p) => `${p.x.toFixed(2)}_${p.y.toFixed(2)}`;
    const getNode = (p) => {
        const k = key(p);
        if (!nodes.has(k)) nodes.set(k, { ...p, out: [] });
        return nodes.get(k);
    };

    // полурёбра
    const half = [];
    const addHalf = (A, B) => {
        const h = { from: A, to: B, ang: Math.atan2(B.y - A.y, B.x - A.x), twin: null, next: null, visited: false };
        half.push(h);
        A.out.push(h);
        return h;
    };

    for (const s of segments) {
        const A = getNode(s.a), B = getNode(s.b);
        const h1 = addHalf(A, B);
        const h2 = addHalf(B, A);
        h1.twin = h2; h2.twin = h1;
    }

    // сортировка исходящих по убыванию угла (по часовой) для «правой руки»
    for (const n of nodes.values()) n.out.sort((a, b) => b.ang - a.ang);
    for (const n of nodes.values()) {
        for (const h of n.out) {
            const arr = h.to.out;
            const i = arr.indexOf(h.twin);
            h.next = arr[(i - 1 + arr.length) % arr.length];
        }
    }

    // обход граней
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
    // убрать внешнюю (по модулю площади самая большая)
    if (faces.length) {
        const idxMax = faces.map((p, i) => ({ i, A: Math.abs(area(p)) })).sort((a, b) => b.A - a.A)[0].i;
        faces.splice(idxMax, 1);
    }
    return faces;
}

/* =============================================================== */

function makeUserCurveBetween(a, b) {
    const k = 1 / 3;
    const c1 = { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
    const c2 = { x: b.x - (b.x - a.x) * k, y: b.y - (b.y - a.y) * k };
    return { c1, c2 };
}

export default function CostumeEditor({ initialSVG }) {
    const [rawSVG, setRawSVG] = useState(initialSVG || "");
    const [segs, setSegs] = useState(null);
    const [anchors, setAnchors] = useState([]);

    // режимы: preview | add | delete | paint | deleteFill
    const [mode, setMode] = useState("preview");

    // добавление кривых (как раньше)
    const [addBuffer, setAddBuffer] = useState(null);
    const [hoverAnchorIdx, setHoverAnchorIdx] = useState(null);
    const [curves, setCurves] = useState([]);          // {id,aIdx,bIdx,c1,c2}
    const [hoverCurveId, setHoverCurveId] = useState(null);

    // заливки по faces
    const [paintColor, setPaintColor] = useState("#ffda79");
    const [fills, setFills] = useState([]);            // [{id,color,faceKey}]
    const [hoverFaceKey, setHoverFaceKey] = useState(null);

    // рассчитанные faces (массив полигонов)
    const faces = useMemo(() => {
        if (!segs) return [];
        const polylines = [];

        // 1) базовый путь
        let start = null, curr = null;
        for (const s of segs) {
            if (s.kind === "M") { start = { x: s.x, y: s.y }; curr = start; }
            else if (s.kind === "L") { polylines.push(sampleLine(s.ax, s.ay, s.x, s.y, 1)); curr = { x: s.x, y: s.y }; }
            else if (s.kind === "C") { polylines.push(sampleBezier(s.ax, s.ay, s.x1, s.y1, s.x2, s.y2, s.x, s.y, 36)); curr = { x: s.x, y: s.y }; }
            else if (s.kind === "Z" && curr && start && (curr.x !== start.x || curr.y !== start.y)) {
                polylines.push(sampleLine(curr.x, curr.y, start.x, start.y, 1));
            }
        }
        // 2) пользовательские кривые
        curves.forEach(c => {
            const a = anchors[c.aIdx], b = anchors[c.bIdx];
            polylines.push(sampleBezier(a.x, a.y, c.c1.x, c.c1.y, c.c2.x, c.c2.y, b.x, b.y, 36));
        });

        // 3) превращаем в список отрезков
        const segsFlat = [];
        for (const line of polylines) {
            for (let i = 0; i + 1 < line.length; i += 2) {
                segsFlat.push({ a: line[i], b: line[i + 1] });
            }
        }

        // 4) режем по пересечениям
        const cut = splitByIntersections(segsFlat);

        // 5) строим грани
        return buildFaces(cut);
    }, [segs, anchors, curves]);


    const facePath = (poly) => `M ${poly.map(p => `${p.x} ${p.y}`).join(" L ")} Z`;
    const faceKey = (poly) => poly.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join("|");

    // загрузка svg
    const onFile = async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const text = await f.text();
        setRawSVG(text);
    };

    // парсинг и сбор якорей
    useEffect(() => {
        if (!rawSVG) return;
        const m = rawSVG.match(/<path[^>]*\sd="([^"]+)"[^>]*>/i);
        if (!m) return;
        const s = parsePathD(m[1]);
        setSegs(s);
        // якоря — все конечные точки L/C + M
        const anchors = [];
        s.forEach(seg => {
            if (seg.kind === "M") anchors.push({ x: seg.x, y: seg.y });
            if (seg.kind === "L" || seg.kind === "C") anchors.push({ x: seg.x, y: seg.y });
        });
        setAnchors(anchors);
        setCurves([]);
        setFills([]);
        setMode("preview");
    }, [rawSVG]);

    // масштаб
    const svgRef = useRef(null);
    const [scale, setScale] = useState({ k: 1 });
    useLayoutEffect(() => {
        const update = () => {
            const svg = svgRef.current;
            if (!svg || !segs) return;
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
    }, [segs]);

    const viewBox = useMemo(() => {
        if (!segs) return "0 0 800 500";
        const b = getBounds(segs);
        const pad = Math.max(b.w, b.h) * 0.05;
        return `${b.x - pad} ${b.y - pad} ${b.w + pad * 2} ${b.h + pad * 2}`;
    }, [segs]);

    const pathD = useMemo(() => (segs ? buildPathD(segs) : ""), [segs]);

    /* ---------------- режимы и действия ---------------- */
    // добавление кривой
    const onAnchorClickAddMode = (idx) => {
        if (addBuffer == null) {
            setAddBuffer(idx);
        } else if (addBuffer !== idx) {
            const a = anchors[addBuffer], b = anchors[idx];
            const { c1, c2 } = makeUserCurveBetween(a, b);
            setCurves(cs => [...cs, { id: crypto.randomUUID(), aIdx: addBuffer, bIdx: idx, c1, c2 }]);
            setAddBuffer(null);
            setMode("preview");
        }
    };

    // удаление кривой
    const onCurveEnter = (id) => { if (mode === "delete") setHoverCurveId(id); };
    const onCurveLeave = (id) => { if (mode === "delete") setHoverCurveId(c => (c === id ? null : c)); };
    const onCurveClickDelete = (id) => {
        if (mode !== "delete") return;
        setCurves(cs => cs.filter(c => c.id !== id));
        setHoverCurveId(null);
    };

    // заливка по faces
    const onFaceEnter = (poly) => { if (mode === "paint") setHoverFaceKey(faceKey(poly)); };
    const onFaceLeave = (poly) => { if (mode === "paint") setHoverFaceKey(k => (k === faceKey(poly) ? null : k)); };
    const onFaceClick = (poly) => {
        if (mode !== "paint") return;
        const fk = faceKey(poly);
        setFills(fs => {
            // если уже залито — заменить цвет (или можно игнорировать)
            const i = fs.findIndex(f => f.faceKey === fk);
            if (i >= 0) {
                const copy = fs.slice(); copy[i] = { ...copy[i], color: paintColor }; return copy;
            }
            return [...fs, { id: crypto.randomUUID(), faceKey: fk, color: paintColor }];
        });
    };

    const onFilledEnter = (fk) => { if (mode === "deleteFill") setHoverFaceKey(fk); };
    const onFilledLeave = (fk) => { if (mode === "deleteFill") setHoverFaceKey(k => (k === fk ? null : k)); };
    const onFilledClick = (fk) => {
        if (mode !== "deleteFill") return;
        setFills(fs => fs.filter(f => f.faceKey !== fk));
        setHoverFaceKey(null);
    };

    // хоткеи
    useEffect(() => {
        const onKey = (e) => {
            const k = e.key.toLowerCase?.();
            if (e.key === "Escape") setMode("preview");
            else if (k === "a") { setMode("add"); setAddBuffer(null); }
            else if (k === "d") setMode("delete");
            else if (k === "f") setMode("paint");
            else if (k === "x") setMode("deletefill");
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // сетка
    const gridDef = useMemo(() => {
        const b = segs ? getBounds(segs) : { w: 800, h: 500, x: 0, y: 0 };
        const step = Math.max(1e-6, Math.min(b.w, b.h) / 20);
        return { step, b };
    }, [segs]);

    const isPreview = mode === "preview";
    const R = 6 * scale.k;

    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                <input type="file" accept=".svg,image/svg+xml" onChange={onFile} />
                <button onClick={() => setRawSVG(`<svg><path d="M 20 40 C 60 10 140 70 180 40 L 180 80 L 20 80 Z"/></svg>`)}>Демо</button>

                <div className={styles.spacer} />

                <button className={`${styles.btn} ${isPreview ? styles.btnActive : ""}`} onClick={() => setMode("preview")} title="Esc">
                    Просмотр <span className={styles.hotkey}>Esc</span>
                </button>
                <button className={`${styles.btn} ${mode === "add" ? styles.btnActive : ""}`} onClick={() => { setMode("add"); setAddBuffer(null); }} title="A">
                    Добавить кривую <span className={styles.hotkey}>A</span>
                </button>
                <button className={`${styles.btn} ${mode === "delete" ? styles.btnDangerActive : ""}`} onClick={() => setMode("delete")} title="D">
                    Удалить линию <span className={styles.hotkey}>D</span>
                </button>

                <div className={styles.paintGroup}>
                    <button className={`${styles.btn} ${mode === "paint" ? styles.btnActive : ""}`} onClick={() => setMode("paint")} title="F">
                        🪣 Заливка <span className={styles.hotkey}>F</span>
                    </button>
                    <input type="color" className={styles.color} value={paintColor} onChange={(e) => setPaintColor(e.target.value)} />
                    <div className={styles.swatches}>
                        {["#ffda79", "#a7f3d0", "#93c5fd", "#fca5a5", "#fde68a", "#d8b4fe"].map(c => (
                            <button key={c} className={styles.swatch} style={{ background: c }} onClick={() => setPaintColor(c)} />
                        ))}
                    </div>
                    <button className={`${styles.btn} ${mode === "deletefill" ? styles.btnDangerActive : ""}`} onClick={() => setMode("deleteFill")} title="X">
                        Удалить заливку <span className={styles.hotkey}>X</span>
                    </button>
                </div>
            </div>

            <svg
                ref={svgRef}
                className={styles.canvas}
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
            >
                {/* grid */}
                <defs>
                    <pattern id="grid" width={gridDef.step} height={gridDef.step} patternUnits="userSpaceOnUse">
                        <path d={`M 0 0 L ${gridDef.step} 0 M 0 0 L 0 ${gridDef.step}`} stroke="#eee" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    </pattern>
                </defs>
                {segs && (
                    <rect
                        x={gridDef.b.x - gridDef.b.w}
                        y={gridDef.b.y - gridDef.b.h}
                        width={gridDef.b.w * 3}
                        height={gridDef.b.h * 3}
                        fill="url(#grid)"
                    />
                )}

                {/* заливки */}
                {faces.map((poly) => {
                    const d = facePath(poly);
                    const fk = faceKey(poly);
                    // если уже залито — рисуем цветом
                    const existing = fills.find(f => f.faceKey === fk);
                    if (existing) {
                        const isDelHover = mode === "deleteFill" && hoverFaceKey === fk;
                        return (
                            <path key={`fill-${fk}`}
                                d={d}
                                fill={existing.color}
                                fillOpacity={isDelHover ? 0.55 : 0.35}
                                stroke="none"
                                onPointerEnter={() => onFilledEnter(fk)}
                                onPointerLeave={() => onFilledLeave(fk)}
                                onPointerDown={() => onFilledClick(fk)}
                                style={mode === "preview" ? { pointerEvents: "none" } : undefined}
                            />
                        );
                    }
                    // иначе — это «хит-таргет» для наведения/клика в режиме покраски
                    const isHover = mode === "paint" && hoverFaceKey === fk;
                    return (
                        <path key={`face-${fk}`}
                            d={d}
                            fill={isHover ? "#000" : "transparent"}
                            fillOpacity={isHover ? 0.08 : 0}
                            stroke="none"
                            onPointerEnter={() => onFaceEnter(poly)}
                            onPointerLeave={() => onFaceLeave(poly)}
                            onPointerDown={() => onFaceClick(poly)}
                            style={mode === "paint" ? undefined : { pointerEvents: "none" }}
                        />
                    );
                })}

                {/* исходный путь */}
                {pathD && <path d={pathD} fill="none" stroke="#111" strokeWidth="2" vectorEffect="non-scaling-stroke" />}

                {/* пользовательские кривые */}
                {curves.map(c => {
                    const a = anchors[c.aIdx], b = anchors[c.bIdx];
                    const d = `M ${a.x} ${a.y} C ${c.c1.x} ${c.c1.y} ${c.c2.x} ${c.c2.y} ${b.x} ${b.y}`;
                    const del = mode === "delete" && hoverCurveId === c.id;
                    return (
                        <path
                            key={c.id}
                            d={d}
                            className={del ? styles.userCurveDeleteHover : styles.userCurve}
                            onPointerEnter={() => onCurveEnter(c.id)}
                            onPointerLeave={() => onCurveLeave(c.id)}
                            onPointerDown={() => onCurveClickDelete(c.id)}
                            fill="none"
                            vectorEffect="non-scaling-stroke"
                            style={mode === "preview" ? { pointerEvents: "none" } : undefined}
                        />
                    );
                })}

                {/* точки исходника — только в add-режиме для выбора */}
                {mode === "add" && anchors.map((p, idx) => {
                    const isFirst = addBuffer === idx;
                    const isHover = hoverAnchorIdx === idx;
                    const classes = [
                        styles.anchor,
                        styles.anchorClickable,
                        isFirst ? styles.anchorSelectedA : "",
                        (!isFirst && isHover) ? styles.anchorSelectedB : "",
                    ].join(" ");
                    return (
                        <circle key={idx}
                            cx={p.x} cy={p.y} r={R}
                            className={classes}
                            onPointerEnter={() => setHoverAnchorIdx(idx)}
                            onPointerLeave={() => setHoverAnchorIdx(null)}
                            onPointerDown={() => onAnchorClickAddMode(idx)}
                        />
                    );
                })}
            </svg>
        </div>
    );
}
