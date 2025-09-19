import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import styles from "./CostumeEditor.module.css";

/* ===== Настройки отбора панелей (бережно) ===== */
const PANEL_MAX_COUNT = 12;                // максимум деталей в списке
const PANEL_MIN_AREA_RATIO_DEFAULT = 0.08; // порог доли от крупнейшей
const KEYWORDS = {
    front: /(^|[^a-z])(front|перед)([^a-z]|$)/i,
    back: /(^|[^a-z])(back|спинка)([^a-z]|$)/i,
    hood: /(^|[^a-z])(hood|капюш|капюшон)([^a-z]|$)/i,
    sleeve: /(^|[^a-z])(sleeve|рукав)([^a-z]|$)/i,
    pocket: /(^|[^a-z])(pocket|карман)([^a-z]|$)/i,
};

/* ===== Гео-утилиты ===== */
function area(poly) { let s = 0; for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; s += a.x * b.y - b.x * a.y; } return s / 2; }
function getBounds(segs) {
    const xs = [], ys = [];
    for (const s of segs) {
        if (s.kind === "M") { xs.push(s.x); ys.push(s.y); }
        if (s.kind === "L") { xs.push(s.ax, s.x); ys.push(s.ay, s.y); }
        if (s.kind === "C") { xs.push(s.ax, s.x1, s.x2, s.x); ys.push(s.ay, s.y1, s.y2, s.y); }
    }
    if (!xs.length) { return { x: 0, y: 0, w: 1, h: 1 }; }
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}
function sampleBezier(ax, ay, x1, y1, x2, y2, x, y, steps = 36) {
    const pts = []; let px = ax, py = ay;
    for (let k = 1; k <= steps; k++) {
        const t = k / steps, mt = 1 - t;
        const xt = mt * mt * mt * ax + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x;
        const yt = mt * mt * mt * ay + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y;
        pts.push({ x: px, y: py }, { x: xt, y: yt }); px = xt; py = yt;
    }
    return pts;
}
function sampleLine(ax, ay, x, y) { return [{ x: ax, y: ay }, { x, y }]; }

/* ===== Парсер d: M/L/C/Z + H/V/S/Q/T, A→L ===== */
function parsePathD(d) {
    d = d.replace(/,/g, " ").replace(/\s+/g, " ").trim();
    const tokens = d.match(/[MLHVCSQTAZmlhvcsqtaz]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) || [];
    let i = 0, cmd = null;
    const segs = [];
    let curr = { x: 0, y: 0 }, start = { x: 0, y: 0 };
    let prevC2 = null, prevQ1 = null;
    const read = () => parseFloat(tokens[i++]);
    const isCmd = (t) => /[MLHVCSQTAZmlhvcsqtaz]/.test(t);

    while (i < tokens.length) {
        if (isCmd(tokens[i])) cmd = tokens[i++];

        switch (cmd) {
            case "M": case "m": {
                const rel = cmd === "m"; const x = read(), y = read();
                const nx = rel ? curr.x + x : x, ny = rel ? curr.y + y : y;
                curr = { x: nx, y: ny }; start = { ...curr };
                segs.push({ kind: "M", x: nx, y: ny });
                prevC2 = prevQ1 = null;
                while (i < tokens.length && !isCmd(tokens[i])) {
                    const lx = read(), ly = read();
                    const nx2 = rel ? curr.x + lx : lx, ny2 = rel ? curr.y + ly : ly;
                    segs.push({ kind: "L", ax: curr.x, ay: curr.y, x: nx2, y: ny2 });
                    curr = { x: nx2, y: ny2 }; prevC2 = prevQ1 = null;
                }
                break;
            }
            case "L": case "l": {
                const rel = cmd === "l"; const x = read(), y = read();
                const nx = rel ? curr.x + x : x, ny = rel ? curr.y + y : y;
                segs.push({ kind: "L", ax: curr.x, ay: curr.y, x: nx, y: ny });
                curr = { x: nx, y: ny }; prevC2 = prevQ1 = null;
                break;
            }
            case "H": case "h": {
                const rel = cmd === "h"; const x = read();
                const nx = rel ? curr.x + x : x, ny = curr.y;
                segs.push({ kind: "L", ax: curr.x, ay: curr.y, x: nx, y: ny });
                curr = { x: nx, y: ny }; prevC2 = prevQ1 = null;
                break;
            }
            case "V": case "v": {
                const rel = cmd === "v"; const y = read();
                const nx = curr.x, ny = rel ? curr.y + y : y;
                segs.push({ kind: "L", ax: curr.x, ay: curr.y, x: nx, y: ny });
                curr = { x: nx, y: ny }; prevC2 = prevQ1 = null;
                break;
            }
            case "C": case "c": {
                const rel = cmd === "c";
                const x1 = read(), y1 = read(), x2 = read(), y2 = read(), x = read(), y = read();
                const seg = {
                    kind: "C", ax: curr.x, ay: curr.y,
                    x1: rel ? curr.x + x1 : x1, y1: rel ? curr.y + y1 : y1,
                    x2: rel ? curr.x + x2 : x2, y2: rel ? curr.y + y2 : y2,
                    x: rel ? curr.x + x : x, y: rel ? curr.y + y : y
                };
                segs.push(seg); prevC2 = { x: seg.x2, y: seg.y2 }; prevQ1 = null; curr = { x: seg.x, y: seg.y };
                break;
            }
            case "S": case "s": {
                const rel = cmd === "s"; const x2 = read(), y2 = read(), x = read(), y = read();
                const x1 = prevC2 ? (2 * curr.x - prevC2.x) : curr.x;
                const y1 = prevC2 ? (2 * curr.y - prevC2.y) : curr.y;
                const seg = {
                    kind: "C", ax: curr.x, ay: curr.y,
                    x1, y1,
                    x2: rel ? curr.x + x2 : x2, y2: rel ? curr.y + y2 : y2,
                    x: rel ? curr.x + x : x, y: rel ? curr.y + y : y
                };
                segs.push(seg); prevC2 = { x: seg.x2, y: seg.y2 }; prevQ1 = null; curr = { x: seg.x, y: seg.y };
                break;
            }
            case "Q": case "q": {
                const rel = cmd === "q"; const qx = read(), qy = read(), x = read(), y = read();
                const Q1 = { x: rel ? curr.x + qx : qx, y: rel ? curr.y + qy : qy };
                const P0 = { ...curr }, P2 = { x: rel ? curr.x + x : x, y: rel ? curr.y + y : y };
                const C1 = { x: P0.x + (2 / 3) * (Q1.x - P0.x), y: P0.y + (2 / 3) * (Q1.y - P0.y) };
                const C2 = { x: P2.x + (2 / 3) * (Q1.x - P2.x), y: P2.y + (2 / 3) * (Q1.y - P2.y) };
                segs.push({ kind: "C", ax: P0.x, ay: P0.y, x1: C1.x, y1: C1.y, x2: C2.x, y2: C2.y, x: P2.x, y: P2.y });
                curr = P2; prevC2 = { ...C2 }; prevQ1 = { ...Q1 };
                break;
            }
            case "T": case "t": {
                const rel = cmd === "t";
                const refl = prevQ1 ? { x: 2 * curr.x - prevQ1.x, y: 2 * curr.y - prevQ1.y } : { ...curr };
                const x = read(), y = read();
                const P2 = { x: rel ? curr.x + x : x, y: rel ? curr.y + y : y };
                const C1 = { x: curr.x + (2 / 3) * (refl.x - curr.x), y: curr.y + (2 / 3) * (refl.y - curr.y) };
                const C2 = { x: P2.x + (2 / 3) * (refl.x - P2.x), y: P2.y + (2 / 3) * (refl.y - P2.y) };
                segs.push({ kind: "C", ax: curr.x, ay: curr.y, x1: C1.x, y1: C1.y, x2: C2.x, y2: C2.y, x: P2.x, y: P2.y });
                curr = P2; prevC2 = { ...C2 }; prevQ1 = { ...refl };
                break;
            }
            case "A": case "a": {
                // упрощённо — линия до конца
                const rel = cmd === "a";
                const _rx = read(), _ry = read(), _rot = read(), _laf = read(), _sw = read();
                const x = read(), y = read();
                const nx = rel ? curr.x + x : x, ny = rel ? curr.y + y : y;
                segs.push({ kind: "L", ax: curr.x, ay: curr.y, x: nx, y: ny });
                curr = { x: nx, y: ny }; prevC2 = prevQ1 = null;
                break;
            }
            case "Z": case "z":
                segs.push({ kind: "Z" }); curr = { ...start }; prevC2 = prevQ1 = null; break;
            default: break;
        }
    }
    return segs;
}

/* ===== Polygon/Polyline → segs ===== */
function parsePoints(pointsStr) {
    // "x,y x,y ..." или "x y, x y"
    const nums = pointsStr.trim().split(/[\s,]+/).map(parseFloat).filter(n => !isNaN(n));
    const pts = []; for (let i = 0; i + 1 < nums.length; i += 2) pts.push({ x: nums[i], y: nums[i + 1] });
    return pts;
}
function segsFromPoints(pointsStr, close = true) {
    const pts = parsePoints(pointsStr);
    if (!pts.length) return [];
    const segs = [{ kind: "M", x: pts[0].x, y: pts[0].y }];
    let prev = pts[0];
    for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        segs.push({ kind: "L", ax: prev.x, ay: prev.y, x: p.x, y: p.y });
        prev = p;
    }
    if (close && (pts[0].x !== prev.x || pts[0].y !== prev.y)) {
        segs.push({ kind: "L", ax: prev.x, ay: prev.y, x: pts[0].x, y: pts[0].y });
        segs.push({ kind: "Z" });
    } else if (close) {
        segs.push({ kind: "Z" });
    }
    return segs;
}

/* ===== Дискретизация и построение граней ===== */
const EPS = 1e-9;
function segIntersect(p, q, r, s) {
    const ux = q.x - p.x, uy = q.y - p.y, vx = s.x - r.x, vy = s.y - r.y, wx = p.x - r.x, wy = p.y - r.y;
    const D = ux * vy - uy * vx; if (Math.abs(D) < EPS) return null;
    const t = (vx * wy - vy * wx) / D, u = (ux * wy - uy * wx) / D;
    if (t <= EPS || t >= 1 - EPS || u <= EPS || u >= 1 - EPS) return null;
    return { t, u, x: p.x + t * ux, y: p.y + t * uy };
}
function splitByIntersections(segments) {
    const lists = segments.map(() => [0, 1]); const pts = segments.map(() => ({}));
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
        const S = segments[i]; const ts = Array.from(new Set(lists[i])).sort((a, b) => a - b);
        const p = (t) => ({ x: S.a.x + (S.b.x - S.a.x) * t, y: S.a.y + (S.b.y - S.a.y) * t });
        for (let k = 0; k + 1 < ts.length; k++) {
            const t1 = ts[k], t2 = ts[k + 1]; if (t2 - t1 < 1e-6) continue;
            const P1 = pts[i][t1] || p(t1); const P2 = pts[i][t2] || p(t2);
            res.push({ a: P1, b: P2 });
        }
    }
    return res;
}
function buildFacesFromSegments(segments) {
    const nodes = new Map();
    const key = (p) => `${p.x.toFixed(2)}_${p.y.toFixed(2)}`;
    const getNode = (p) => { const k = key(p); if (!nodes.has(k)) nodes.set(k, { ...p, out: [] }); return nodes.get(k); };
    const half = []; const add = (A, B) => { const h = { from: A, to: B, ang: Math.atan2(B.y - A.y, B.x - A.x), twin: null, next: null, visited: false }; half.push(h); A.out.push(h); return h; };
    for (const s of segments) { const A = getNode(s.a), B = getNode(s.b); const h1 = add(A, B), h2 = add(B, A); h1.twin = h2; h2.twin = h1; }
    for (const n of nodes.values()) n.out.sort((a, b) => b.ang - a.ang);
    for (const n of nodes.values()) for (const h of n.out) { const arr = h.to.out; const i = arr.indexOf(h.twin); h.next = arr[(i - 1 + arr.length) % arr.length]; }
    const faces = [];
    for (const h of half) {
        if (h.visited) continue;
        const poly = []; let cur = h, guard = 0;
        while (!cur.visited && guard++ < 20000) { cur.visited = true; poly.push({ x: cur.from.x, y: cur.from.y }); cur = cur.next; if (cur === h) break; }
        if (poly.length >= 3) faces.push(poly);
    }
    if (faces.length) {
        const idxMax = faces.map((p, i) => ({ i, A: Math.abs(area(p)) })).sort((a, b) => b.A - a.A)[0].i;
        faces.splice(idxMax, 1); // внешнюю убрать
    }
    return faces;
}

/* ===== Полилинии/сегменты ===== */
function polylinesFromSegs(segs) {
    const lines = []; let start = null, curr = null;
    for (const s of segs) {
        if (s.kind === "M") { start = { x: s.x, y: s.y }; curr = start; }
        else if (s.kind === "L") { lines.push(sampleLine(s.ax, s.ay, s.x, s.y)); curr = { x: s.x, y: s.y }; }
        else if (s.kind === "C") { lines.push(sampleBezier(s.ax, s.ay, s.x1, s.y1, s.x2, s.y2, s.x, s.y)); curr = { x: s.x, y: s.y }; }
        else if (s.kind === "Z" && curr && start && (curr.x !== start.x || curr.y !== start.y)) { lines.push(sampleLine(curr.x, curr.y, start.x, start.y)); }
    }
    return lines;
}
function segmentsFromPolylines(polylines) {
    const segs = []; for (const line of polylines) for (let i = 0; i + 1 < line.length; i += 2) segs.push({ a: line[i], b: line[i + 1] }); return segs;
}

/* ===== Якоря / кривые ===== */
function collectAnchors(segs) {
    const out = []; for (const s of segs) { if (s.kind === "M") out.push({ x: s.x, y: s.y }); if (s.kind === "L" || s.kind === "C") out.push({ x: s.x, y: s.y }); }
    return out;
}
function makeUserCurveBetween(a, b) {
    const k = 1 / 3; return { c1: { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k }, c2: { x: b.x - (b.x - a.x) * k, y: b.y - (b.y - a.y) * k } };
}
function ensureClosed(segs) {
    // если нет Z — мягко замкнём
    const hasZ = segs.some(s => s.kind === "Z");
    if (hasZ) return segs;
    // ищем M и последнюю точку
    let start = null, last = null;
    for (const s of segs) {
        if (s.kind === "M") { start = { x: s.x, y: s.y }; last = start; }
        else if (s.kind === "L" || s.kind === "C") { last = { x: s.x, y: s.y }; }
    }
    if (!start || !last) return segs;
    const out = [...segs];
    if (start.x !== last.x || start.y !== last.y) {
        out.push({ kind: "L", ax: last.x, ay: last.y, x: start.x, y: start.y });
    }
    out.push({ kind: "Z" });
    return out;
}

/* ===== Разбор SVG в панели (Path + Polygon + Polyline, с фолбэком) ===== */
function splitClosedSubpaths(d) {
    const parts = [];
    const re = /([Mm][^MmZz]*[Zz])/g;
    let m; while ((m = re.exec(d))) { parts.push(m[1]); }
    if (!parts.length) {
        const all = d.split(/(?=[Mm])/).map(s => s.trim()).filter(Boolean);
        for (const p of all) { if (/[Zz]/.test(p)) parts.push(p); }
    }
    return parts;
}

function extractPanels(rawSVG) {
    const pathTags = [...rawSVG.matchAll(/<path\b([^>]*?)>/gi)].map(m => m[0]);
    const polygonTags = [...rawSVG.matchAll(/<polygon\b([^>]*?)>/gi)].map(m => m[0]);
    const polylineTags = [...rawSVG.matchAll(/<polyline\b([^>]*?)>/gi)].map(m => m[0]);

    let candidates = [];

    // PATH -> subpaths
    for (const tag of pathTags) {
        const dMatch = tag.match(/\sd="([^"]+)"/i); if (!dMatch) continue;
        const idMatch = tag.match(/\sid="([^"]+)"/i);
        const label = idMatch?.[1] || "";
        const d = dMatch[1];
        const subs = splitClosedSubpaths(d);
        if (subs.length) {
            for (const subD of subs) {
                const segs = parsePathD(subD); if (!segs.length) continue;
                const bb = getBounds(segs); const bboxArea = Math.abs(bb.w * bb.h) || 1;
                candidates.push({ segs, label, bboxArea });
            }
        } else {
            // нет явных Z — используем весь d и мягко замкнём
            const segs0 = ensureClosed(parsePathD(d));
            if (segs0.length) {
                const bb = getBounds(segs0); const bboxArea = Math.abs(bb.w * bb.h) || 1;
                candidates.push({ segs: segs0, label, bboxArea });
            }
        }
    }

    // POLYGON
    for (const tag of polygonTags) {
        const ptsMatch = tag.match(/\spoints="([^"]+)"/i); if (!ptsMatch) continue;
        const idMatch = tag.match(/\sid="([^"]+)"/i);
        const label = idMatch?.[1] || "";
        const segs = segsFromPoints(ptsMatch[1], true);
        if (segs.length) {
            const bb = getBounds(segs); const bboxArea = Math.abs(bb.w * bb.h) || 1;
            candidates.push({ segs, label, bboxArea });
        }
    }

    // POLYLINE (замкнём автоматически)
    for (const tag of polylineTags) {
        const ptsMatch = tag.match(/\spoints="([^"]+)"/i); if (!ptsMatch) continue;
        const idMatch = tag.match(/\sid="([^"]+)"/i);
        const label = idMatch?.[1] || "";
        const segs = ensureClosed(segsFromPoints(ptsMatch[1], false));
        if (segs.length) {
            const bb = getBounds(segs); const bboxArea = Math.abs(bb.w * bb.h) || 1;
            candidates.push({ segs, label, bboxArea });
        }
    }

    // === ФОЛБЭК: если ничего не нашли вообще — берём первый <path> и замыкаем ===
    if (!candidates.length) {
        const m = rawSVG.match(/<path[^>]*\sd="([^"]+)"[^>]*>/i);
        if (m) {
            const segs0 = ensureClosed(parsePathD(m[1]));
            const bb = getBounds(segs0); const bboxArea = Math.abs(bb.w * bb.h) || 1;
            candidates.push({ segs: segs0, label: "Панель", bboxArea });
        }
    }

    if (!candidates.length) return [];

    // Сортировка по размеру
    candidates.sort((a, b) => b.bboxArea - a.bboxArea);
    const maxA = candidates[0].bboxArea || 1;

    // Адаптивный порог: если деталей ≤3 — не отбрасываем ни одну.
    const dynamicRatio = candidates.length <= 3 ? 0 : PANEL_MIN_AREA_RATIO_DEFAULT;

    // Фильтр по площади
    let filtered = candidates.filter(c => (c.bboxArea / maxA) >= dynamicRatio);

    // Удаление дублей (почти равные по bbox)
    const uniq = [];
    for (const c of filtered) {
        const same = uniq.some(u => {
            const ratio = Math.min(u.bboxArea, c.bboxArea) / Math.max(u.bboxArea, c.bboxArea);
            return ratio > 0.92;
        });
        if (!same) uniq.push(c);
        if (uniq.length >= PANEL_MAX_COUNT) break;
    }

    // Имёна
    return uniq.map((c, idx) => {
        let name = c.label || `Панель ${idx + 1}`;
        const lbl = c.label || "";
        if (KEYWORDS.front.test(lbl)) name = "Перед";
        else if (KEYWORDS.back.test(lbl)) name = "Спинка";
        else if (KEYWORDS.hood.test(lbl)) name = "Капюшон";
        else if (KEYWORDS.pocket.test(lbl)) name = "Карман";
        else if (KEYWORDS.sleeve.test(lbl)) name = "Рукав";
        return { id: String(idx + 1), label: name, segs: c.segs, anchors: collectAnchors(c.segs) };
    });
}

/* ===== Компонент ===== */
export default function CostumeEditor({ initialSVG }) {
    const [rawSVG, setRawSVG] = useState(initialSVG || "");
    const [panels, setPanels] = useState([]);      // {id,label,segs,anchors}[]
    const [activePanelId, setActivePanelId] = useState(null);

    const [curvesByPanel, setCurvesByPanel] = useState({}); // {[id]: [{id,aIdx,bIdx,c1,c2}]}
    const [fills, setFills] = useState([]);                 // [{id,panelId,faceKey,color}]
    const [paintColor, setPaintColor] = useState("#f26522");

    const [mode, setMode] = useState("preview");
    const [addBuffer, setAddBuffer] = useState(null);
    const [hoverAnchorIdx, setHoverAnchorIdx] = useState(null);
    const [hoverCurveKey, setHoverCurveKey] = useState(null);
    const [hoverFace, setHoverFace] = useState(null);

    const onFile = async (e) => { const f = e.target.files?.[0]; if (!f) return; setRawSVG(await f.text()); };

    // Разбор SVG → панели (с фолбэком для старых файлов)
    useEffect(() => {
        if (!rawSVG) return;
        const parts = extractPanels(rawSVG);
        setPanels(parts);
        setActivePanelId(parts[0]?.id || null);
        setCurvesByPanel({});
        setFills([]);
        setMode("preview");
    }, [rawSVG]);

    // ДЕМО
    const loadDemo = () => {
        const demo = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
  <path id="front" d="M 80 120 C 100 60 300 60 420 120 L 420 460 C 420 520 100 520 80 460 Z" />
  <path id="back"  d="M 480 120 C 500 60 700 60 820 120 L 820 460 C 820 520 500 520 480 460 Z" />
</svg>`;
        setRawSVG(demo);
    };

    // Общий viewBox
    const viewBox = useMemo(() => {
        if (!panels.length) return "0 0 800 500";
        const boxes = panels.map(p => getBounds(p.segs));
        const minX = Math.min(...boxes.map(b => b.x)), minY = Math.min(...boxes.map(b => b.y));
        const maxX = Math.max(...boxes.map(b => b.x + b.w)), maxY = Math.max(...boxes.map(b => b.y + b.h));
        const w = maxX - minX, h = maxY - minY; const pad = Math.max(w, h) * 0.06;
        return `${minX - pad} ${minY - pad} ${w + pad * 2} ${h + pad * 2}`;
    }, [panels]);

    // Масштаб к контейнеру
    const svgRef = useRef(null);
    const [scale, setScale] = useState({ k: 1 });
    useLayoutEffect(() => {
        const update = () => {
            const svg = svgRef.current; if (!svg || !panels.length) return;
            const vb = svg.viewBox.baseVal;
            const kx = vb.width / svg.clientWidth; const ky = vb.height / svg.clientHeight;
            setScale({ k: Math.max(kx, ky) });
        };
        update();
        const ro = new ResizeObserver(update);
        if (svgRef.current) ro.observe(svgRef.current);
        window.addEventListener("resize", update);
        return () => { ro.disconnect(); window.removeEventListener("resize", update); };
    }, [panels.length]);

    // Грани по панелям
    const facesByPanel = useMemo(() => {
        const res = {};
        for (const p of panels) {
            const baseLines = polylinesFromSegs(p.segs);
            const userLines = (curvesByPanel[p.id] || []).map(c => {
                const a = p.anchors[c.aIdx], b = p.anchors[c.bIdx];
                return sampleBezier(a.x, a.y, c.c1.x, c.c1.y, c.c2.x, c.c2.y, b.x, b.y);
            });
            const segsFlat = segmentsFromPolylines([...baseLines, ...userLines]);
            res[p.id] = buildFacesFromSegments(splitByIntersections(segsFlat));
        }
        return res;
    }, [panels, curvesByPanel]);

    // Чистим «протухшие» заливки
    useEffect(() => {
        setFills(fs => fs.filter(f => (facesByPanel[f.panelId] || []).some(poly => faceKey(poly) === f.faceKey)));
    }, [facesByPanel]);

    // Сетка
    const gridDef = useMemo(() => {
        if (!panels.length) return { step: 40, b: { x: 0, y: 0, w: 800, h: 500 } };
        const boxes = panels.map(p => getBounds(p.segs));
        const minX = Math.min(...boxes.map(b => b.x)), minY = Math.min(...boxes.map(b => b.y));
        const maxX = Math.max(...boxes.map(b => b.x + b.w)), maxY = Math.max(...boxes.map(b => b.y + b.h));
        const w = maxX - minX, h = maxY - minY; const step = Math.max(1e-6, Math.min(w, h) / 20);
        return { step, b: { x: minX, y: minY, w, h } };
    }, [panels]);

    // Хоткеи
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

    /* ==== Действия ==== */
    const activePanel = panels.find(p => p.id === activePanelId);
    const R = 6 * scale.k;
    const isPreview = mode === "preview";

    function facePath(poly) { return `M ${poly.map(p => `${p.x} ${p.y}`).join(" L ")} Z`; }
    function faceKey(poly) { return poly.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join("|"); }

    const onAnchorClickAddMode = (idx) => {
        if (!activePanel) return;
        if (addBuffer == null) setAddBuffer(idx);
        else if (addBuffer !== idx) {
            const a = activePanel.anchors[addBuffer], b = activePanel.anchors[idx];
            const { c1, c2 } = makeUserCurveBetween(a, b);
            setCurvesByPanel(map => {
                const arr = [...(map[activePanel.id] || [])];
                arr.push({ id: crypto.randomUUID(), aIdx: addBuffer, bIdx: idx, c1, c2 });
                return { ...map, [activePanel.id]: arr };
            });
            setAddBuffer(null); setMode("preview");
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

    /* ==== Рендер ==== */
    return (
        <div className={styles.layout}>
            {/* CANVAS */}
            <div className={styles.canvasWrap}>
                <svg ref={svgRef} className={styles.canvas} viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <pattern id="grid" width={gridDef.step} height={gridDef.step} patternUnits="userSpaceOnUse">
                            <path d={`M 0 0 L ${gridDef.step} 0 M 0 0 L 0 ${gridDef.step}`} stroke="#eee" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                        </pattern>
                    </defs>
                    <rect x={gridDef.b.x - gridDef.b.w} y={gridDef.b.y - gridDef.b.h} width={gridDef.b.w * 3} height={gridDef.b.h * 3} fill="url(#grid)" />

                    {/* FACES / FILLS */}
                    {panels.map(p => (
                        <g key={`faces-${p.id}`}>
                            {((facesByPanel[p.id]) || []).map(poly => {
                                const d = facePath(poly), fk = faceKey(poly);
                                const exist = fills.find(f => f.panelId === p.id && f.faceKey === fk);
                                if (exist) {
                                    const hovering = hoverFace && hoverFace.panelId === p.id && hoverFace.faceKey === fk && mode === "deleteFill";
                                    return (
                                        <path key={`fill-${p.id}-${fk}`} d={d} fill={exist.color} fillOpacity={hovering ? 0.55 : 0.35}
                                            stroke="none"
                                            onPointerEnter={() => onFilledEnter(p.id, fk)}
                                            onPointerLeave={() => onFilledLeave(p.id, fk)}
                                            onPointerDown={() => onFilledClick(p.id, fk)}
                                            style={isPreview ? { pointerEvents: "none" } : undefined}
                                        />
                                    );
                                }
                                const hover = hoverFace && hoverFace.panelId === p.id && hoverFace.faceKey === fk && mode === "paint";
                                return (
                                    <path key={`face-${p.id}-${fk}`} d={d} fill={hover ? "#000" : "transparent"} fillOpacity={hover ? 0.08 : 0}
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
                        const d = p.segs.map(s => {
                            if (s.kind === "M") return `M ${s.x} ${s.y}`;
                            if (s.kind === "L") return `L ${s.x} ${s.y}`;
                            if (s.kind === "C") return `C ${s.x1} ${s.y1} ${s.x2} ${s.y2} ${s.x} ${s.y}`;
                            if (s.kind === "Z") return `Z`;
                            return "";
                        }).join(" ");
                        return <path key={`base-${p.id}`} d={d} fill="none" stroke="#111" strokeWidth="2" vectorEffect="non-scaling-stroke" />;
                    })}

                    {/* USER CURVES */}
                    {panels.map(p => {
                        const curves = (curvesByPanel[p.id] || []);
                        return (
                            <g key={`curves-${p.id}`}>
                                {curves.map(c => {
                                    const a = p.anchors[c.aIdx], b = p.anchors[c.bIdx];
                                    const d = `M ${a.x} ${a.y} C ${c.c1.x} ${c.c1.y} ${c.c2.x} ${c.c2.y} ${b.x} ${b.y}`;
                                    const key = `${p.id}:${c.id}`;
                                    const del = mode === "delete" && hoverCurveKey === key;
                                    const pe = (isPreview || mode === "paint" || mode === "deleteFill") ? "none" : (p.id === activePanelId ? "auto" : "none");
                                    return (
                                        <path key={key} d={d}
                                            className={del ? styles.userCurveDeleteHover : styles.userCurve}
                                            onPointerEnter={() => onCurveEnter(p.id, c.id)}
                                            onPointerLeave={() => onCurveLeave(p.id, c.id)}
                                            onPointerDown={() => onCurveClickDelete(p.id, c.id)}
                                            fill="none" vectorEffect="non-scaling-stroke"
                                            style={{ pointerEvents: pe }}
                                        />
                                    );
                                })}
                            </g>
                        );
                    })}

                    {/* ANCHORS (только активной панели в режиме add) */}
                    {mode === "add" && activePanel && activePanel.anchors.map((pt, idx) => {
                        const isFirst = addBuffer === idx;
                        const isHover = hoverAnchorIdx === idx;
                        const classes = [styles.anchor, styles.anchorClickable, isFirst ? styles.anchorSelectedA : "", (!isFirst && isHover) ? styles.anchorSelectedB : ""].join(" ");
                        return (
                            <circle key={idx} cx={pt.x} cy={pt.y} r={R}
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
                            Загрузить SVG (1+ деталей, path/polygon/polyline)
                            <input type="file" accept=".svg,image/svg+xml" onChange={onFile} />
                        </label>
                        <button className={styles.btnGhost} onClick={loadDemo}>Демо: 2 панели</button>
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Панели</div>
                        <div className={styles.btnGroupV}>
                            {panels.map(p => (
                                <button key={p.id}
                                    className={`${styles.btn} ${activePanelId === p.id ? styles.btnActive : ""}`}
                                    onClick={() => setActivePanelId(p.id)}>
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
