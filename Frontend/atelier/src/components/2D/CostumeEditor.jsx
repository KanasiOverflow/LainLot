import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import styles from "./CostumeEditor.module.css";

/* ================== настройки ================== */
const PANEL_MAX_COUNT = 12;
const PANEL_MIN_AREA_RATIO_DEFAULT = 0.08;
const KEYWORDS = {
    front: /(^|[^a-z])(front|перед)([^a-z]|$)/i,
    back: /(^|[^a-z])(back|спинка)([^a-z]|$)/i,
    hood: /(^|[^a-z])(hood|капюш)([^a-z]|$)/i,
    sleeve: /(^|[^a-z])(sleeve|рукав)([^a-z]|$)/i,
    pocket: /(^|[^a-z])(pocket|карман)([^a-z]|$)/i,
};

/* ================== геометрия ================== */
function area(poly) { let s = 0; for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; s += a.x * b.y - b.x * a.y; } return s / 2; }
function getBounds(segs) {
    const xs = [], ys = [];
    for (const s of segs) {
        if (s.kind === "M") { xs.push(s.x); ys.push(s.y); }
        if (s.kind === "L") { xs.push(s.ax, s.x); ys.push(s.ay, s.y); }
        if (s.kind === "C") { xs.push(s.ax, s.x1, s.x2, s.x); ys.push(s.ay, s.y1, s.y2, s.y); }
    }
    if (!xs.length) return { x: 0, y: 0, w: 1, h: 1 };
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
function sampleBezierPoints(ax, ay, x1, y1, x2, y2, x, y, steps = 56) {
    const out = []; for (let k = 0; k <= steps; k++) {
        const t = k / steps, mt = 1 - t;
        out.push({
            x: mt * mt * mt * ax + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x,
            y: mt * mt * mt * ay + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y
        });
    } return out;
}
function sampleLine(ax, ay, x, y) { return [{ x: ax, y: ay }, { x, y }]; }

/* ========== парсер d: M/L/C/Z + H/V/S/Q/T, A->L ========== */
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
                curr = { x: nx, y: ny }; start = { ...curr }; segs.push({ kind: "M", x: nx, y: ny }); prevC2 = prevQ1 = null;
                while (i < tokens.length && !isCmd(tokens[i])) {
                    const lx = read(), ly = read(); const nx2 = rel ? curr.x + lx : lx, ny2 = rel ? curr.y + ly : ly;
                    segs.push({ kind: "L", ax: curr.x, ay: curr.y, x: nx2, y: ny2 }); curr = { x: nx2, y: ny2 }; prevC2 = prevQ1 = null;
                } break;
            }
            case "L": case "l": {
                const rel = cmd === "l"; const x = read(), y = read(); const nx = rel ? curr.x + x : x, ny = rel ? curr.y + y : y;
                segs.push({ kind: "L", ax: curr.x, ay: curr.y, x: nx, y: ny }); curr = { x: nx, y: ny }; prevC2 = prevQ1 = null; break;
            }
            case "H": case "h": {
                const rel = cmd === "h"; const x = read(); const nx = rel ? curr.x + x : x, ny = curr.y;
                segs.push({ kind: "L", ax: curr.x, ay: curr.y, x: nx, y: ny }); curr = { x: nx, y: ny }; prevC2 = prevQ1 = null; break;
            }
            case "V": case "v": {
                const rel = cmd === "v"; const y = read(); const nx = curr.x, ny = rel ? curr.y + y : y;
                segs.push({ kind: "L", ax: curr.x, ay: curr.y, x: nx, y: ny }); curr = { x: nx, y: ny }; prevC2 = prevQ1 = null; break;
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
                segs.push(seg); prevC2 = { x: seg.x2, y: seg.y2 }; prevQ1 = null; curr = { x: seg.x, y: seg.y }; break;
            }
            case "S": case "s": {
                const rel = cmd === "s"; const x2 = read(), y2 = read(), x = read(), y = read();
                const x1 = prevC2 ? 2 * curr.x - prevC2.x : curr.x;
                const y1 = prevC2 ? 2 * curr.y - prevC2.y : curr.y;
                const seg = {
                    kind: "C", ax: curr.x, ay: curr.y,
                    x1, y1,
                    x2: rel ? curr.x + x2 : x2, y2: rel ? curr.y + y2 : y2,
                    x: rel ? curr.x + x : x, y: rel ? curr.y + y : y
                };
                segs.push(seg); prevC2 = { x: seg.x2, y: seg.y2 }; prevQ1 = null; curr = { x: seg.x, y: seg.y }; break;
            }
            case "Q": case "q": {
                const rel = cmd === "q"; const qx = read(), qy = read(), x = read(), y = read();
                const Q1 = { x: rel ? curr.x + qx : qx, y: rel ? curr.y + qy : qy };
                const P0 = { ...curr }, P2 = { x: rel ? curr.x + x : x, y: rel ? curr.y + y : y };
                const C1 = { x: P0.x + (2 / 3) * (Q1.x - P0.x), y: P0.y + (2 / 3) * (Q1.y - P0.y) };
                const C2 = { x: P2.x + (2 / 3) * (Q1.x - P2.x), y: P2.y + (2 / 3) * (Q1.y - P2.y) };
                segs.push({ kind: "C", ax: P0.x, ay: P0.y, x1: C1.x, y1: C1.y, x2: C2.x, y2: C2.y, x: P2.x, y: P2.y });
                curr = P2; prevC2 = { ...C2 }; prevQ1 = { ...Q1 }; break;
            }
            case "T": case "t": {
                const rel = cmd === "t"; const refl = prevQ1 ? { x: 2 * curr.x - prevQ1.x, y: 2 * curr.y - prevQ1.y } : { ...curr };
                const x = read(), y = read(); const P2 = { x: rel ? curr.x + x : x, y: rel ? curr.y + y : y };
                const C1 = { x: curr.x + (2 / 3) * (refl.x - curr.x), y: curr.y + (2 / 3) * (refl.y - curr.y) };
                const C2 = { x: P2.x + (2 / 3) * (refl.x - P2.x), y: P2.y + (2 / 3) * (refl.y - P2.y) };
                segs.push({ kind: "C", ax: curr.x, ay: curr.y, x1: C1.x, y1: C1.y, x2: C2.x, y2: C2.y, x: P2.x, y: P2.y });
                curr = P2; prevC2 = { ...C2 }; prevQ1 = { ...refl }; break;
            }
            case "A": case "a": {
                const rel = cmd === "a";
                const _rx = read(), _ry = read(), _rot = read(), _laf = read(), _sw = read();
                const x = read(), y = read(); const nx = rel ? curr.x + x : x, ny = rel ? curr.y + y : y;
                segs.push({ kind: "L", ax: curr.x, ay: curr.y, x: nx, y: ny });
                curr = { x: nx, y: ny }; prevC2 = prevQ1 = null; break;
            }
            case "Z": case "z": segs.push({ kind: "Z" }); curr = { ...start }; prevC2 = prevQ1 = null; break;
            default: break;
        }
    }
    return segs;
}

/* ========== polygon / polyline ========== */
function parsePoints(pointsStr) {
    const nums = pointsStr.trim().split(/[\s,]+/).map(parseFloat).filter(n => !isNaN(n));
    const pts = []; for (let i = 0; i + 1 < nums.length; i += 2) pts.push({ x: nums[i], y: nums[i + 1] }); return pts;
}
function segsFromPoints(pointsStr, close = true) {
    const pts = parsePoints(pointsStr); if (!pts.length) return [];
    const segs = [{ kind: "M", x: pts[0].x, y: pts[0].y }]; let prev = pts[0];
    for (let i = 1; i < pts.length; i++) { const p = pts[i]; segs.push({ kind: "L", ax: prev.x, ay: prev.y, x: p.x, y: p.y }); prev = p; }
    if (close && (prev.x !== pts[0].x || prev.y !== pts[0].y)) segs.push({ kind: "L", ax: prev.x, ay: prev.y, x: pts[0].x, y: pts[0].y });
    if (close) segs.push({ kind: "Z" }); return segs;
}

/* ========== построение граней ========== */
const EPS = 1e-9;
function segIntersect(p, q, r, s) {
    const ux = q.x - p.x, uy = q.y - p.y, vx = s.x - r.x, vy = s.y - r.y, wx = p.x - r.x, wy = p.y - r.y;
    const D = ux * vy - uy * vx; if (Math.abs(D) < EPS) return null;
    const t = (vx * wy - vy * wx) / D, u = (ux * wy - uy * wx) / D;

    // вне отрезков — нет
    if (t < -EPS || t > 1 + EPS || u < -EPS || u > 1 + EPS) return null;

    const onEndT = (t <= EPS || t >= 1 - EPS);
    const onEndU = (u <= EPS || u >= 1 - EPS);

    // если оба только на концах (общая вершина) — пропускаем
    if (onEndT && onEndU) return null;

    // иначе допускаем (конец-внутрь или внутрь-внутрь)
    return {
        t: Math.max(0, Math.min(1, t)),
        u: Math.max(0, Math.min(1, u)),
        x: p.x + t * ux,
        y: p.y + t * uy
    };
}

function splitByIntersections(segments) {
    const lists = segments.map(() => [0, 1]); const pts = segments.map(() => ({}));
    for (let i = 0; i < segments.length; i++) {
        for (let j = i + 1; j < segments.length; j++) {
            const A = segments[i], B = segments[j]; const hit = segIntersect(A.a, A.b, B.a, B.b);
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
            const P1 = pts[i][t1] || p(t1); const P2 = pts[i][t2] || p(t2); res.push({ a: P1, b: P2 });
        }
    }
    return res;
}
function buildFacesFromSegments(segments) {
    const nodes = new Map();
    const key = (p) => `${p.x.toFixed(2)}_${p.y.toFixed(2)}`;
    const node = (p) => { const k = key(p); if (!nodes.has(k)) nodes.set(k, { ...p, out: [] }); return nodes.get(k); };
    const half = []; const add = (A, B) => { const h = { from: A, to: B, ang: Math.atan2(B.y - A.y, B.x - A.x), twin: null, next: null, visited: false }; half.push(h); A.out.push(h); return h; };
    for (const s of segments) { const A = node(s.a), B = node(s.b); const h1 = add(A, B), h2 = add(B, A); h1.twin = h2; h2.twin = h1; }
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
        faces.splice(idxMax, 1);
    }
    return faces;
}

/* ========== полилинии/сегменты ========== */
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

/* ========== якоря/прочее ========== */
function collectAnchors(segs) {
    const out = []; for (const s of segs) { if (s.kind === "M") out.push({ x: s.x, y: s.y }); if (s.kind === "L" || s.kind === "C") out.push({ x: s.x, y: s.y }); }
    return out;
}
function makeUserCurveBetween(a, b) {
    const k = 1 / 3; return { c1: { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k }, c2: { x: b.x - (b.x - a.x) * k, y: b.y - (b.y - a.y) * k } };
}
function ensureClosed(segs) {
    if (segs.some(s => s.kind === "Z")) return segs;
    let start = null, last = null;
    for (const s of segs) { if (s.kind === "M") { start = { x: s.x, y: s.y }; last = start; } else if (s.kind === "L" || s.kind === "C") { last = { x: s.x, y: s.y }; } }
    if (!start || !last) return segs;
    const out = [...segs];
    if (start.x !== last.x || start.y !== last.y) out.push({ kind: "L", ax: last.x, ay: last.y, x: start.x, y: start.y });
    out.push({ kind: "Z" }); return out;
}

/* ========== разбор svg в панели ========== */
function splitClosedSubpaths(d) {
    const parts = []; const re = /([Mm][^MmZz]*[Zz])/g; let m; while ((m = re.exec(d))) { parts.push(m[1]); }
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

    for (const tag of pathTags) {
        const dMatch = tag.match(/\sd="([^"]+)"/i); if (!dMatch) continue;
        const idMatch = tag.match(/\sid="([^"]+)"/i);
        const label = idMatch?.[1] || ""; const d = dMatch[1];
        const subs = splitClosedSubpaths(d);
        if (subs.length) {
            for (const subD of subs) {
                const segs = parsePathD(subD); if (!segs.length) continue;
                const bb = getBounds(segs); const bboxArea = Math.abs(bb.w * bb.h) || 1;
                candidates.push({ segs, label, bboxArea });
            }
        } else {
            const segs0 = ensureClosed(parsePathD(d)); if (segs0.length) {
                const bb = getBounds(segs0);
                candidates.push({ segs: segs0, label, bboxArea: Math.abs(bb.w * bb.h) || 1 });
            }
        }
    }
    for (const tag of polygonTags) {
        const pts = tag.match(/\spoints="([^"]+)"/i)?.[1]; if (!pts) continue;
        const idMatch = tag.match(/\sid="([^"]+)"/i); const label = idMatch?.[1] || "";
        const segs = segsFromPoints(pts, true); if (segs.length) {
            const bb = getBounds(segs);
            candidates.push({ segs, label, bboxArea: Math.abs(bb.w * bb.h) || 1 });
        }
    }
    for (const tag of polylineTags) {
        const pts = tag.match(/\spoints="([^"]+)"/i)?.[1]; if (!pts) continue;
        const idMatch = tag.match(/\sid="([^"]+)"/i); const label = idMatch?.[1] || "";
        const segs = ensureClosed(segsFromPoints(pts, false)); if (segs.length) {
            const bb = getBounds(segs);
            candidates.push({ segs, label, bboxArea: Math.abs(bb.w * bb.h) || 1 });
        }
    }
    if (!candidates.length) {
        const m = rawSVG.match(/<path[^>]*\sd="([^"]+)"[^>]*>/i);
        if (m) {
            const segs0 = ensureClosed(parsePathD(m[1])); const bb = getBounds(segs0);
            candidates.push({ segs: segs0, label: "Панель", bboxArea: Math.abs(bb.w * bb.h) || 1 });
        }
    }
    if (!candidates.length) return [];

    candidates.sort((a, b) => b.bboxArea - a.bboxArea);
    const maxA = candidates[0].bboxArea || 1;
    const ratio = candidates.length <= 3 ? 0 : PANEL_MIN_AREA_RATIO_DEFAULT;
    let filtered = candidates.filter(c => (c.bboxArea / maxA) >= ratio);

    const uniq = [];
    for (const c of filtered) {
        const same = uniq.some(u => (Math.min(u.bboxArea, c.bboxArea) / Math.max(u.bboxArea, c.bboxArea)) > 0.92);
        if (!same) uniq.push(c);
        if (uniq.length >= PANEL_MAX_COUNT) break;
    }

    return uniq.map((c, idx) => {
        let name = c.label || `Панель ${idx + 1}`; const lbl = c.label || "";
        if (KEYWORDS.front.test(lbl)) name = "Перед"; else if (KEYWORDS.back.test(lbl)) name = "Спинка";
        else if (KEYWORDS.hood.test(lbl)) name = "Капюшон"; else if (KEYWORDS.pocket.test(lbl)) name = "Карман";
        else if (KEYWORDS.sleeve.test(lbl)) name = "Рукав";
        return { id: String(idx + 1), label: name, segs: c.segs, anchors: collectAnchors(c.segs) };
    });
}

/* ========== утилиты «внутри/снаружи» ========== */
function pointOnSegment(p, a, b) {
    const cross = (p.x - a.x) * (b.y - a.y) - (p.y - a.y) * (b.x - a.x);
    if (Math.abs(cross) > 1e-6) return false;
    const dot = (p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y);
    if (dot < -1e-6) return false;
    const len2 = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
    return dot <= len2 + 1e-6;
}
function pointInPolygon(p, poly) {
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        if (pointOnSegment(p, poly[j], poly[i])) return true;
    }
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i].x, yi = poly[i].y, xj = poly[j].x, yj = poly[j].y;
        const intersect = ((yi > p.y) != (yj > p.y)) && (p.x < (xj - xi) * (p.y - yi) / (yj - yi + 1e-12) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}
function projectPointToSegment(P, A, B) {
    const vx = B.x - A.x, vy = B.y - A.y;
    const len2 = vx * vx + vy * vy || 1e-9;
    let t = ((P.x - A.x) * vx + (P.y - A.y) * vy) / len2;
    t = Math.max(0, Math.min(1, t));
    const x = A.x + t * vx, y = A.y + t * vy;
    const dx = P.x - x, dy = P.y - y;
    return { x, y, t, d2: dx * dx + dy * dy };
}
function catmullRomToBezierPath(pts) {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = i > 0 ? pts[i - 1] : pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = i + 2 < pts.length ? pts[i + 2] : p2;
        const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
        const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
        d += ` C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
    }
    return d;
}

/* ---- доп. helpers для дуги по контуру ---- */
function lerpPt(A, B, t) { return { x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t }; }
function segLen(A, B) { return Math.hypot(B.x - A.x, B.y - A.y); }
function polylineFromSubpath(subSegs) {
    const pts = []; let start = null, curr = null;
    const push = (p) => { if (!pts.length || Math.hypot(pts[pts.length - 1].x - p.x, pts[pts.length - 1].y - p.y) > 1e-6) pts.push(p); };
    for (const s of subSegs) {
        if (s.kind === "M") { start = { x: s.x, y: s.y }; curr = start; push(curr); }
        else if (s.kind === "L") { const line = sampleLine(s.ax, s.ay, s.x, s.y); for (const p of line) push(p); curr = { x: s.x, y: s.y }; }
        else if (s.kind === "C") { const line = sampleBezier(s.ax, s.ay, s.x1, s.y1, s.x2, s.y2, s.x, s.y); for (const p of line) push(p); curr = { x: s.x, y: s.y }; }
        else if (s.kind === "Z" && curr && start) { push(start); }
    }
    if (pts.length > 1) {
        const A = pts[0], B = pts[pts.length - 1];
        if (Math.hypot(A.x - B.x, A.y - B.y) < 1e-6) pts.pop();
    }
    return pts;
}
function splitSegsIntoSubpaths(segs) {
    const out = []; let cur = [];
    for (const s of segs) {
        if (s.kind === "M") { if (cur.length) out.push(cur); cur = [s]; }
        else { cur.push(s); if (s.kind === "Z") { out.push(cur); cur = []; } }
    }
    if (cur.length) out.push(cur);
    return out.filter(arr => arr.some(x => x.kind !== "M"));
}
function pointInAnyFace(p, faces) { for (const poly of faces) { if (pointInPolygon(p, poly)) return true; } return false; }
function nearestOnRing(P, ringPts) {
    let best = null, idx = -1, d2 = Infinity;
    for (let i = 0; i < ringPts.length; i++) {
        const A = ringPts[i], B = ringPts[(i + 1) % ringPts.length];
        const pr = projectPointToSegment(P, A, B);
        if (pr.d2 < d2) { d2 = pr.d2; best = { ...pr, A, B }; idx = i; }
    }
    return { ...best, idx };
}
function arcOnRing(ringPts, posA, posB) {
    const N = ringPts.length;
    const P0 = lerpPt(ringPts[posA.idx], ringPts[(posA.idx + 1) % N], posA.t);
    const P1 = lerpPt(ringPts[posB.idx], ringPts[(posB.idx + 1) % N], posB.t);

    const forward = [P0];
    let i = posA.idx;
    if (posA.t < 1 - 1e-6) forward.push(ringPts[(i + 1) % N]);
    i = (i + 1) % N;
    while (i !== posB.idx) { forward.push(ringPts[i]); i = (i + 1) % N; }
    forward.push(P1);

    const backward = [P0];
    i = posA.idx;
    while (i !== (posB.idx + 1 + N) % N) { backward.push(ringPts[i]); i = (i - 1 + N) % N; }
    backward.push(P1);

    const len = arr => arr.slice(0, -1).reduce((s, _, k) => s + segLen(arr[k], arr[k + 1]), 0);
    return (len(forward) <= len(backward)) ? forward : backward;
}
function offsetArcInside(arcPts, outlinePoly, inset) {
    const res = [];
    for (let k = 0; k < arcPts.length; k++) {
        const pPrev = arcPts[Math.max(0, k - 1)], pNext = arcPts[Math.min(arcPts.length - 1, k + 1)];
        let tx = pNext.x - pPrev.x, ty = pNext.y - pPrev.y; const L = Math.hypot(tx, ty) || 1; tx /= L; ty /= L;
        let nx = -ty, ny = tx;
        let P = { x: arcPts[k].x + nx * inset, y: arcPts[k].y + ny * inset };
        if (!pointInPolygon(P, outlinePoly)) P = { x: arcPts[k].x - nx * inset, y: arcPts[k].y - ny * inset };
        res.push(P);
    }
    return res;
}
function pointsToPairedPolyline(pts) { const line = []; for (let i = 0; i + 1 < pts.length; i++) { line.push(pts[i], pts[i + 1]); } return line; }

/* ================== компонент ================== */
export default function CostumeEditor({ initialSVG }) {
    const [rawSVG, setRawSVG] = useState(initialSVG || "");
    const [panels, setPanels] = useState([]);
    const [activePanelId, setActivePanelId] = useState(null);

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

    const onFile = async (e) => { const f = e.target.files?.[0]; if (!f) return; setRawSVG(await f.text()); };

    useEffect(() => {
        if (!rawSVG) return;
        const parts = extractPanels(rawSVG);
        setPanels(parts);
        setActivePanelId(parts[0]?.id || null);
        setCurvesByPanel({});
        setFills([]);
        setMode("preview");
    }, [rawSVG]);

    const loadDemo = () => {
        const demo = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
  <path id="front" d="M 80 120 C 100 60 300 60 420 120 L 420 460 C 420 520 100 520 80 460 Z" />
  <path id="back"  d="M 480 120 C 500 60 700 60 820 120 L 820 460 C 820 520 500 520 480 460 Z" />
</svg>`;
        setRawSVG(demo);
    };

    // осн. окна
    const viewBox = useMemo(() => {
        if (!panels.length) return "0 0 800 500";
        const boxes = panels.map(p => getBounds(p.segs));
        const minX = Math.min(...boxes.map(b => b.x)), minY = Math.min(...boxes.map(b => b.y));
        const maxX = Math.max(...boxes.map(b => b.x + b.w)), maxY = Math.max(...boxes.map(b => b.y + b.h));
        const w = maxX - minX, h = maxY - minY, pad = Math.max(w, h) * 0.06;
        return `${minX - pad} ${minY - pad} ${w + pad * 2} ${h + pad * 2}`;
    }, [panels]);

    const svgRef = useRef(null);
    const [scale, setScale] = useState({ k: 1 });
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

    /* -------- базовые faces и кольца контура -------- */
    const baseFacesByPanel = useMemo(() => {
        const res = {};
        for (const p of panels) {
            const baseLines = polylinesFromSegs(p.segs);
            const segsFlat = segmentsFromPolylines(baseLines);
            res[p.id] = buildFacesFromSegments(splitByIntersections(segsFlat));
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

    // faces с учётом пользовательских линий
    const facesByPanel = useMemo(() => {
        const res = {};
        for (const p of panels) {
            const baseLines = polylinesFromSegs(p.segs);
            const userLines = (curvesByPanel[p.id] || []).flatMap(c => {
                if (c.type === "cubic") {
                    const a = p.anchors[c.aIdx], b = p.anchors[c.bIdx];
                    return [sampleBezier(a.x, a.y, c.c1.x, c.c1.y, c.c2.x, c.c2.y, b.x, b.y)];
                } else {
                    const lines = [pointsToPairedPolyline(c.pts)];
                    if (c.connA && c.connA.length === 2) lines.push(pointsToPairedPolyline(c.connA));
                    if (c.connB && c.connB.length === 2) lines.push(pointsToPairedPolyline(c.connB));
                    return lines;
                }
            });

            const segsFlat = segmentsFromPolylines([...baseLines, ...userLines]);
            res[p.id] = buildFacesFromSegments(splitByIntersections(segsFlat));
        }
        return res;
    }, [panels, curvesByPanel]);

    useEffect(() => {
        setFills(fs => fs.filter(f => (facesByPanel[f.panelId] || []).some(poly => faceKey(poly) === f.faceKey)));
    }, [facesByPanel]);

    const gridDef = useMemo(() => {
        if (!panels.length) return { step: 40, b: { x: 0, y: 0, w: 800, h: 500 } };
        const boxes = panels.map(p => getBounds(p.segs));
        const minX = Math.min(...boxes.map(b => b.x)), minY = Math.min(...boxes.map(b => b.y));
        const maxX = Math.max(...boxes.map(b => b.x + b.w)), maxY = Math.max(...boxes.map(b => b.y + b.h));
        const w = maxX - minX, h = maxY - minY; const step = Math.max(1e-6, Math.min(w, h) / 20);
        return { step, b: { x: minX, y: minY, w, h } };
    }, [panels]);

    // уже есть: splitSegsIntoSubpaths, polylineFromSubpath, area(...)

    const outerRingByPanel = useMemo(() => {
        const res = {};
        for (const p of panels) {
            const subpaths = splitSegsIntoSubpaths(p.segs);          // M..Z блоки
            const rings = subpaths.map(polylineFromSubpath)          // дискретизируем
                .filter(r => r.length >= 3);
            if (!rings.length) continue;
            // выбираем самое большое по модулю площади кольцо — это внешний силуэт
            const best = rings.reduce((acc, r) => {
                const A = Math.abs(area(r));
                return (!acc || A > acc.A) ? { ring: r, A } : acc;
            }, null);
            res[p.id] = best?.ring || null;
        }
        return res;
    }, [panels]);

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

    /* ===== действия ===== */
    const activePanel = panels.find(p => p.id === activePanelId);
    const R = 6 * scale.k;
    const isPreview = mode === "preview";

    function facePath(poly) { return `M ${poly.map(p => `${p.x} ${p.y}`).join(" L ")} Z`; }
    function faceKey(poly) { return poly.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join("|"); }

    function routeCurveAlongOutline(panel, draftCurve, insetWorld) {
        const rings = ringsByPanel[panel.id] || [];
        if (!rings.length) return null;

        const a = panel.anchors[draftCurve.aIdx], b = panel.anchors[draftCurve.bIdx];

        let best = null;
        for (const ring of rings) {
            const pa = nearestOnRing(a, ring);
            const pb = nearestOnRing(b, ring);
            if (pa && pb) {
                const score = (pa.d2 || 0) + (pb.d2 || 0);
                if (!best || score < best.score) best = { ring, pa, pb, score };
            }
        }
        if (!best) return null;

        const arc = arcOnRing(best.ring, best.pa, best.pb);
        const offsetArc = offsetArcInside(arc, best.ring, insetWorld);
        if (offsetArc.length < 2) return null;

        const d = catmullRomToBezierPath(offsetArc);

        // точки на контуре (без отступа)
        const N = best.ring.length;
        const P0 = lerpPt(best.ring[best.pa.idx], best.ring[(best.pa.idx + 1) % N], best.pa.t);
        const P1 = lerpPt(best.ring[best.pb.idx], best.ring[(best.pb.idx + 1) % N], best.pb.t);
        // точки на прижатой дуге (с отступом)
        const Q0 = offsetArc[0];
        const Q1 = offsetArc[offsetArc.length - 1];

        return {
            d,
            pts: offsetArc,
            connA: [Q0, P0],   // невидимый коннектор к контуру
            connB: [Q1, P1]
        };
    }

    const onAnchorClickAddMode = (idx) => {
        if (!activePanel) return;

        // первый клик — запоминаем начальную вершину
        if (addBuffer == null) {
            setAddBuffer(idx);
            return;
        }

        // клик по той же вершине — игнор
        if (addBuffer === idx) return;

        const a = activePanel.anchors[addBuffer];
        const b = activePanel.anchors[idx];

        // черновая «прямая» (кубик) между вершинами
        const { c1, c2 } = makeUserCurveBetween(a, b);
        const draft = {
            id: crypto.randomUUID(),
            aIdx: addBuffer,
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
            setCurvesByPanel((map) => {
                const arr = [...(map[activePanel.id] || [])];
                arr.push({ ...draft, type: "cubic" });
                return { ...map, [activePanel.id]: arr };
            });
            setAddBuffer(null);
            setMode("preview");
            return;
        }

        // 2) Иначе ведём линию по кратчайшей дуге кромки с отступом внутрь.
        //    Отступ задаётся в пикселях экрана (edgeInsetPx), здесь переводим в мировые.
        const inset = Math.max(0, edgeInsetPx) * (scale.k || 1);
        const routed = routeCurveAlongOutline(activePanel, draft, inset);

        // Если не удалось прижать (крайний случай) — просто выходим в просмотр.
        if (!routed) {
            setAddBuffer(null);
            setMode("preview");
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
            });
            return { ...map, [activePanel.id]: arr };
        });

        // очистка состояния
        setAddBuffer(null);
        setMode("preview");
    };



    const onCurveEnter = (panelId, id) => { if (mode === "delete") setHoverCurveKey(`${panelId}:${id}`); };
    const onCurveLeave = (panelId, id) => { if (mode === "delete") setHoverCurveKey(k => (k === `${panelId}:${id}` ? null : k)); };
    const onCurveClickDelete = (panelId, id) => {
        if (mode !== "delete") return;
        setCurvesByPanel(map => ({ ...map, [panelId]: (map[panelId] || []).filter(c => c.id !== id) }));
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

    return (
        <div className={styles.layout}>
            <div className={styles.canvasWrap}>
                {toast && (
                    <div style={{
                        position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
                        background: "#30302e", color: "#fff", padding: "8px 12px",
                        borderRadius: 8, fontSize: 13, boxShadow: "0 8px 24px rgba(0,0,0,.15)", zIndex: 3
                    }}>{toast.text}</div>
                )}

                <svg ref={svgRef} className={styles.canvas} viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <pattern id="grid" width={gridDef.step} height={gridDef.step} patternUnits="userSpaceOnUse">
                            <path
                                d={`M 0 0 L ${gridDef.step} 0 M 0 0 L 0 ${gridDef.step}`}
                                stroke="#eee"
                                strokeWidth="1"
                                vectorEffect="non-scaling-stroke"
                            />
                        </pattern>

                        {panels.map(p => {
                            const faces = baseFacesByPanel[p.id] || [];

                            // Fallback: если вдруг faces не собрался (очень редкий случай) — клипуём исходным d
                            const fallbackD = p.segs.map(s => {
                                if (s.kind === "M") return `M ${s.x} ${s.y}`;
                                if (s.kind === "L") return `L ${s.x} ${s.y}`;
                                if (s.kind === "C") return `C ${s.x1} ${s.y1} ${s.x2} ${s.y2} ${s.x} ${s.y}`;
                                if (s.kind === "Z") return `Z`;
                                return "";
                            }).join(" ");

                            return (
                                <clipPath key={`clip-${p.id}`} id={`clip-${p.id}`} clipPathUnits="userSpaceOnUse">
                                    {faces.length
                                        ? faces.map((poly, i) => (
                                            <path key={i}
                                                d={`M ${poly.map(pt => `${pt.x} ${pt.y}`).join(" L ")} Z`}
                                            /* ВАЖНО: без clipRule="evenodd". Несколько <path> внутри clipPath
                                               дают объединение областей — именно то, что нам нужно. */
                                            />
                                        ))
                                        : <path d={fallbackD} />
                                    }
                                </clipPath>
                            );
                        })}
                    </defs>


                    <rect x={gridDef.b.x - gridDef.b.w} y={gridDef.b.y - gridDef.b.h} width={gridDef.b.w * 3} height={gridDef.b.h * 3} fill="url(#grid)" />

                    {panels.map(p => {
                        const clip = `url(#clip-${p.id})`;
                        const curves = (curvesByPanel[p.id] || []);
                        return (
                            <g key={`panel-${p.id}`}>
                                <g clipPath={clip}>
                                    {(facesByPanel[p.id] || []).map(poly => {
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

                                    {/* пользовательские кривые (клипнутые) */}
                                    {curves.map(c => {
                                        let d, key = `${p.id}:${c.id}`;
                                        if (c.type === "cubic") {
                                            const a = p.anchors[c.aIdx], b = p.anchors[c.bIdx];
                                            d = `M ${a.x} ${a.y} C ${c.c1.x} ${c.c1.y} ${c.c2.x} ${c.c2.y} ${b.x} ${b.y}`;
                                        } else {
                                            d = c.d;
                                        }
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

                                {/* базовый контур */}
                                <path d={p.segs.map(s => {
                                    if (s.kind === "M") return `M ${s.x} ${s.y}`;
                                    if (s.kind === "L") return `L ${s.x} ${s.y}`;
                                    if (s.kind === "C") return `C ${s.x1} ${s.y1} ${s.x2} ${s.y2} ${s.x} ${s.y}`;
                                    if (s.kind === "Z") return `Z`; return "";
                                }).join(" ")}
                                    fill="none" stroke="#111" strokeWidth="2" vectorEffect="non-scaling-stroke"
                                />
                            </g>
                        );
                    })}

                    {/* якоря для режима добавления */}
                    {mode === "add" && activePanel && activePanel.anchors.map((pt, idx) => {
                        const isFirst = addBuffer === idx;
                        const isHover = hoverAnchorIdx === idx;
                        const cls = [styles.anchor, styles.anchorClickable, isFirst ? styles.anchorSelectedA : "", (!isFirst && isHover) ? styles.anchorSelectedB : ""].join(" ");
                        return (
                            <circle key={idx} cx={pt.x} cy={pt.y} r={R}
                                className={cls}
                                onPointerEnter={() => setHoverAnchorIdx(idx)}
                                onPointerLeave={() => setHoverAnchorIdx(null)}
                                onPointerDown={() => onAnchorClickAddMode(idx)}
                            />
                        );
                    })}
                </svg>
            </div>

            {/* sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.panel}>
                    <h3 className={styles.panelTitle}>Редактор</h3>

                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Файл</div>
                        <label className={styles.fileBtn}>
                            Загрузить SVG (1+ деталей)
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

                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Отступ от края</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <input
                                type="range"
                                min={0}
                                max={24}
                                step={1}
                                value={edgeInsetPx}
                                onChange={(e) => setEdgeInsetPx(+e.target.value)}
                                style={{ flex: 1 }}
                                aria-label="Отступ от кромки"
                            />
                            <div style={{ width: 40, textAlign: "right" }}>{edgeInsetPx}px</div>
                        </div>
                        <div style={{ fontSize: 12, opacity: .7, marginTop: 6 }}>
                            Используется, когда прямая выходит за деталь: линия ведётся по кромке с этим отступом внутрь.
                        </div>
                    </div>

                </div>
            </aside>
        </div>
    );
}
