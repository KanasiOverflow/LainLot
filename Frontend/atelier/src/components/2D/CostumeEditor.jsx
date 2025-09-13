import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import styles from "./CostumeEditor.module.css";

/* ===================== utils ===================== */
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
                    segs.push({ kind: "L", x1: curr.x, y1: curr.y, x: nx2, y: ny2, ax: curr.x, ay: curr.y });
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
                segs.push({ kind: "L", x1: curr.x, y1: curr.y, x: nx, y: ny, ax: curr.x, ay: curr.y });
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
    if (!segs || !segs.length) return null;
    const xs = [], ys = [];
    const push = (x, y) => { xs.push(x); ys.push(y); };
    for (const s of segs) {
        if (s.kind === "M") push(s.x, s.y);
        if (s.kind === "L") { push(s.ax, s.ay); push(s.x, s.y); }
        if (s.kind === "C") { push(s.ax, s.ay); push(s.x1, s.y1); push(s.x2, s.y2); push(s.x, s.y); }
    }
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

function collectAnchorPoints(segs) {
    const anchors = [];
    let last = null;
    segs.forEach((s) => {
        if (s.kind === "M") { anchors.push({ x: s.x, y: s.y }); last = { x: s.x, y: s.y }; }
        else if (s.kind === "L") { anchors.push({ x: s.x, y: s.y }); last = { x: s.x, y: s.y }; }
        else if (s.kind === "C") { anchors.push({ x: s.x, y: s.y }); last = { x: s.x, y: s.y }; }
        else if (s.kind === "Z" && last) { /* ignore */ }
    });
    return anchors;
}

function dist2(a, b) { const dx = a.x - b.x, dy = a.y - b.y; return dx * dx + dy * dy; }
/* ===================== /utils ===================== */

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

    // режимы: 'preview' | 'add' | 'delete'
    const [mode, setMode] = useState("preview");
    const [addBuffer, setAddBuffer] = useState(null);
    const [hoverAnchorIdx, setHoverAnchorIdx] = useState(null);

    // пользовательские кривые
    const [curves, setCurves] = useState([]);             // [{id,aIdx,bIdx,c1,c2, ghostA,ghostB}]
    const [hoverCurveId, setHoverCurveId] = useState(null);

    // help
    const [showHelp, setShowHelp] = useState(false);

    // pointer/scale
    const svgRef = useRef(null);
    const drag = useRef(null); // { kind:'c1'|'c2'|'endA'|'endB', curveId }
    const [scale, setScale] = useState({ kx: 1, ky: 1, k: 1 });

    const onFile = async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const text = await f.text();
        setRawSVG(text);
    };

    useEffect(() => {
        if (!rawSVG) return;
        const m = rawSVG.match(/<path[^>]*\sd="([^"]+)"[^>]*>/i);
        if (!m) return;
        const s = parsePathD(m[1]);
        setSegs(s);
        setAnchors(collectAnchorPoints(s));
        setCurves([]);
        setAddBuffer(null);
        setMode("preview");
    }, [rawSVG]);

    useLayoutEffect(() => {
        const update = () => {
            const svg = svgRef.current;
            if (!svg) return;
            const vb = svg.viewBox.baseVal;
            const kx = vb.width / svg.clientWidth;
            const ky = vb.height / svg.clientHeight;
            setScale({ kx, ky, k: Math.max(kx, ky) });
        };
        update();
        const ro = new ResizeObserver(update);
        if (svgRef.current) ro.observe(svgRef.current);
        window.addEventListener("resize", update);
        return () => { ro.disconnect(); window.removeEventListener("resize", update); };
    }, [segs]);

    const pathD = useMemo(() => (segs ? buildPathD(segs) : ""), [segs]);
    const viewBox = useMemo(() => {
        if (!segs) return "0 0 800 500";
        const b = getBounds(segs);
        const pad = Math.max(b.w, b.h) * 0.05;
        return `${b.x - pad} ${b.y - pad} ${b.w + pad * 2} ${b.h + pad * 2}`;
    }, [segs]);

    const gridDef = useMemo(() => {
        const b = segs ? getBounds(segs) : { w: 800, h: 500, x: 0, y: 0 };
        const step = Math.max(1e-6, Math.min(b.w, b.h) / 20);
        return { step, b };
    }, [segs]);

    /* ---------- добавить кривую: клик по 2 якорям ---------- */
    const onAnchorClickAddMode = (idx) => {
        if (addBuffer == null) {
            setAddBuffer(idx);
        } else if (addBuffer !== idx) {
            const aIdx = addBuffer, bIdx = idx;
            const a = anchors[aIdx], b = anchors[bIdx];
            const { c1, c2 } = makeUserCurveBetween(a, b);
            setCurves(cs => [...cs, { id: crypto.randomUUID(), aIdx, bIdx, c1, c2 }]);
            setAddBuffer(null);
            setMode("preview");
        }
    };

    /* ---------- перетаскивание контрольных/концов ---------- */
    const onPointerMove = (e) => {
        if (!drag.current) return;
        const payload = drag.current;
        const svg = svgRef.current;
        const vb = svg.viewBox.baseVal;
        const dx = e.movementX * (vb.width / svg.clientWidth);
        const dy = e.movementY * (vb.height / svg.clientHeight);

        setCurves(cur => {
            const list = cur.map(c => ({ ...c, c1: { ...c.c1 }, c2: { ...c.c2 } }));
            const c = list.find(x => x.id === payload.curveId);
            if (!c) return cur;

            if (payload.kind === "c1") { c.c1.x += dx; c.c1.y += dy; }
            if (payload.kind === "c2") { c.c2.x += dx; c.c2.y += dy; }
            if (payload.kind === "endA" || payload.kind === "endB") {
                const key = payload.kind === "endA" ? "ghostA" : "ghostB";
                const base = payload.kind === "endA" ? anchors[c.aIdx] : anchors[c.bIdx];
                const g = c[key] || { x: base.x, y: base.y };
                g.x += dx; g.y += dy;
                c[key] = g;
            }
            return list;
        });
    };

    const onPointerUp = () => {
        if (!drag.current) return;
        const payload = drag.current;
        drag.current = null;

        if (payload.kind === "endA" || payload.kind === "endB") {
            setCurves(cur => {
                const list = cur.map(c => ({ ...c }));
                const c = list.find(x => x.id === payload.curveId);
                if (!c) return cur;

                const ghost = payload.kind === "endA" ? c.ghostA : c.ghostB;
                if (!ghost) return cur;

                const svg = svgRef.current;
                const vb = svg.viewBox.baseVal;
                const pxTol = 20;
                const tol2 = (pxTol * (vb.width / svg.clientWidth)) ** 2;

                let best = { idx: null, d2: Infinity };
                anchors.forEach((a, idx) => {
                    const d2 = dist2(a, ghost);
                    if (d2 < best.d2) best = { idx, d2 };
                });

                if (best.idx != null && best.d2 <= tol2) {
                    if (payload.kind === "endA") c.aIdx = best.idx;
                    else c.bIdx = best.idx;
                }
                delete c.ghostA; delete c.ghostB;
                return list;
            });
        }
    };

    const startDrag = (payload) => (e) => {
        const svg = svgRef.current;
        drag.current = payload;
        try { svg?.setPointerCapture?.(e.pointerId); } catch { }
    };

    /* ---------- удаление: hover + click в режиме 'delete' ---------- */
    const onCurveEnter = (id) => { if (mode === "delete") setHoverCurveId(id); };
    const onCurveLeave = (id) => { if (mode === "delete") setHoverCurveId(cur => (cur === id ? null : cur)); };
    const onCurveClickDelete = (id) => {
        if (mode !== "delete") return;
        setCurves(cs => cs.filter(c => c.id !== id));
        setHoverCurveId(null);
    };

    /* ---------- горячие клавиши ---------- */
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") setMode("preview");
            if (e.key.toLowerCase?.() === "a") { setMode("add"); setAddBuffer(null); }
            if (e.key.toLowerCase?.() === "d") { setMode("delete"); setHoverCurveId(null); }
            if (e.key === "?") setShowHelp(v => !v);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    /* ---------- render ---------- */
    const isPreview = mode === "preview";

    return (
        <div className={styles.container} onContextMenu={(e) => { e.preventDefault(); setShowHelp(true); }}>
            <div className={styles.toolbar}>
                <input type="file" accept=".svg,image/svg+xml" onChange={onFile} />
                <button onClick={() => setRawSVG(`<svg><path d="M 20 40 C 50 10 120 70 160 40 Z"/></svg>`)}>Демо</button>

                <div className={styles.spacer} />

                <button
                    className={`${styles.btn} ${isPreview ? styles.btnActive : ""}`}
                    onClick={() => { setMode("preview"); setAddBuffer(null); setHoverCurveId(null); }}
                    title="Просмотр: Esc"
                >
                    Просмотр <span className={styles.hotkey}>Esc</span>
                </button>

                <button
                    className={`${styles.btn} ${mode === "add" ? styles.btnActive : ""}`}
                    onClick={() => { setMode("add"); setAddBuffer(null); }}
                    title="Добавить кривую: A"
                >
                    Добавить кривую <span className={styles.hotkey}>A</span>
                </button>

                <button
                    className={`${styles.btn} ${mode === "delete" ? styles.btnDangerActive : ""}`}
                    onClick={() => { setMode("delete"); setHoverCurveId(null); }}
                    title="Удалить линию: D"
                >
                    Удалить линию <span className={styles.hotkey}>D</span>
                </button>

                <button
                    className={styles.btnIcon}
                    onClick={() => setShowHelp(v => !v)}
                    title="Горячие клавиши (?) или ПКМ по холсту"
                    aria-label="Help / Горячие клавиши"
                >
                    ?
                </button>
            </div>

            {/* мини-окно со справкой */}
            {showHelp && (
                <div className={styles.help}>
                    <div className={styles.helpHeader}>
                        <strong>Горячие клавиши</strong>
                        <button className={styles.helpClose} onClick={() => setShowHelp(false)} aria-label="Закрыть">×</button>
                    </div>
                    <ul className={styles.helpList}>
                        <li><span className={styles.hotkey}>Esc</span> — режим «Просмотр»</li>
                        <li><span className={styles.hotkey}>A</span> — «Добавить кривую» (кликните по 2 вершинам исходника)</li>
                        <li><span className={styles.hotkey}>D</span> — «Удалить линию» (наведите на кривую и кликните)</li>
                        <li><span className={styles.hotkey}>ПКМ</span> по холсту — открыть это окно</li>
                        <li>Перетаскивайте зелёные точки — контрольные точки кривой</li>
                        <li>Перетаскивайте оранжевые ромбы — перепривяжите концы к другим вершинам</li>
                    </ul>
                </div>
            )}

            <svg
                ref={svgRef}
                className={styles.canvas}
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
            >
                {/* сетка */}
                <defs>
                    <pattern id="grid" width={gridDef.step} height={gridDef.step} patternUnits="userSpaceOnUse">
                        <path d={`M 0 0 L ${gridDef.step} 0 M 0 0 L 0 ${gridDef.step}`} stroke="#e5e7eb" strokeWidth="1" vectorEffect="non-scaling-stroke" />
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

                {/* исходный путь */}
                {pathD && (
                    <path d={pathD} fill="none" stroke="#111" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                )}

                {/* вершины исходника — видны только в add */}
                {!isPreview && anchors.map((p, idx) => {
                    const R = 6 * scale.k;
                    const inAdd = mode === "add";
                    const isFirst = addBuffer === idx;
                    const isHover = inAdd && hoverAnchorIdx === idx;
                    const classes = [
                        styles.anchor,
                        inAdd ? styles.anchorClickable : styles.anchorHidden,
                        isFirst ? styles.anchorSelectedA : "",
                        (!isFirst && isHover) ? styles.anchorSelectedB : "",
                    ].join(" ");

                    return (
                        <circle
                            key={`a${idx}`}
                            cx={p.x} cy={p.y} r={R}
                            className={classes}
                            onPointerEnter={() => inAdd && setHoverAnchorIdx(idx)}
                            onPointerLeave={() => inAdd && setHoverAnchorIdx(null)}
                            onPointerDown={inAdd ? () => onAnchorClickAddMode(idx) : undefined}
                        />
                    );
                })}

                {/* пользовательские кривые */}
                {curves.map(c => {
                    const a = anchors[c.aIdx], b = anchors[c.bIdx];
                    if (!a || !b) return null;
                    const d = `M ${a.x} ${a.y} C ${c.c1.x} ${c.c1.y} ${c.c2.x} ${c.c2.y} ${b.x} ${b.y}`;
                    const R = 6 * scale.k, Rc = 5 * scale.k, Rh = 7 * scale.k;

                    const deleteHover = mode === "delete" && hoverCurveId === c.id;

                    return (
                        <g key={c.id}>
                            <path
                                d={d}
                                className={
                                    isPreview
                                        ? styles.userCurvePreview
                                        : deleteHover
                                            ? styles.userCurveDeleteHover
                                            : styles.userCurve
                                }
                                fill="none"
                                vectorEffect="non-scaling-stroke"
                                onPointerEnter={() => onCurveEnter(c.id)}
                                onPointerLeave={() => onCurveLeave(c.id)}
                                onPointerDown={() => onCurveClickDelete(c.id)}
                                style={isPreview ? { pointerEvents: "none" } : undefined}
                            />

                            {!isPreview && (
                                <>
                                    <line x1={a.x} y1={a.y} x2={c.c1.x} y2={c.c1.y} className={styles.userHelper} />
                                    <line x1={b.x} y1={b.y} x2={c.c2.x} y2={c.c2.y} className={styles.userHelper} />

                                    {mode !== "delete" && (
                                        <>
                                            <circle cx={c.c1.x} cy={c.c1.y} r={Rc}
                                                className={styles.control}
                                                onPointerDown={startDrag({ kind: "c1", curveId: c.id })} />
                                            <circle cx={c.c2.x} cy={c.c2.y} r={Rc}
                                                className={styles.control}
                                                onPointerDown={startDrag({ kind: "c2", curveId: c.id })} />

                                            <rect x={(c.ghostA?.x ?? a.x) - Rh / 2} y={(c.ghostA?.y ?? a.y) - Rh / 2}
                                                width={Rh} height={Rh}
                                                transform={`rotate(45 ${(c.ghostA?.x ?? a.x)} ${(c.ghostA?.y ?? a.y)})`}
                                                className={styles.userEnd}
                                                onPointerDown={startDrag({ kind: "endA", curveId: c.id })} />
                                            <rect x={(c.ghostB?.x ?? b.x) - Rh / 2} y={(c.ghostB?.y ?? b.y) - Rh / 2}
                                                width={Rh} height={Rh}
                                                transform={`rotate(45 ${(c.ghostB?.x ?? b.x)} ${(c.ghostB?.y ?? b.y)})`}
                                                className={styles.userEnd}
                                                onPointerDown={startDrag({ kind: "endB", curveId: c.id })} />
                                        </>
                                    )}
                                </>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
