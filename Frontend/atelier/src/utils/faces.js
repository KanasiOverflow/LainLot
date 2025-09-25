import { sampleLine, sampleBezier, area } from "./geometry.js";

/* ========== полилинии/сегменты ========== */
export function polylinesFromSegs(segs) {
    const lines = []; let start = null, curr = null;
    for (const s of segs) {
        if (s.kind === "M") { start = { x: s.x, y: s.y }; curr = start; }
        else if (s.kind === "L") { lines.push(sampleLine(s.ax, s.ay, s.x, s.y)); curr = { x: s.x, y: s.y }; }
        else if (s.kind === "C") { lines.push(sampleBezier(s.ax, s.ay, s.x1, s.y1, s.x2, s.y2, s.x, s.y)); curr = { x: s.x, y: s.y }; }
        else if (s.kind === "Z" && curr && start && (curr.x !== start.x || curr.y !== start.y)) {
            lines.push(sampleLine(curr.x, curr.y, start.x, start.y));
        }
    }
    return lines;
}
export function segmentsFromPolylines(polylines) {
    const segs = [];
    for (const line of polylines)
        for (let i = 0; i + 1 < line.length; i += 2)
            segs.push({ a: line[i], b: line[i + 1] });
    return segs;
}

/* ========== пересечения и DCEL ==========
   segIntersect, splitByIntersections, buildFacesFromSegments */
export function segIntersect(A, B, C, D) {
    const ux = B.x - A.x, uy = B.y - A.y;
    const vx = D.x - C.x, vy = D.y - C.y;
    const wx = A.x - C.x, wy = A.y - C.y;
    const det = ux * vy - uy * vx;
    if (Math.abs(det) < 1e-9) return null;
    const s = (vx * wy - vy * wx) / det;
    const t = (ux * wy - uy * wx) / det;
    if (s <= 1e-9 || s >= 1 - 1e-9 || t <= 1e-9 || t >= 1 - 1e-9) return null;
    return { x: A.x + ux * s, y: A.y + uy * s, t: s, u: t };
}

export function splitByIntersections(segments) {
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
        const tsRaw = lists[i].slice().sort((a, b) => a - b);
        const ts = [];
        for (const t of tsRaw) if (!ts.length || Math.abs(t - ts[ts.length - 1]) > 1e-6) ts.push(Math.max(0, Math.min(1, t)));
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

export function buildFacesFromSegments(segments) {
    const nodes = new Map();
    const PREC = 1e-4;
    const norm = (v) => Math.round(v / PREC) * PREC;
    const key = (p) => `${norm(p.x)}_${norm(p.y)}`;
    const node = (p) => {
        const k = key(p);
        if (!nodes.has(k)) nodes.set(k, { p, out: [] });
        return nodes.get(k);
    };
    const half = [];
    const add = (A, B) => {
        const h = { from: A, to: B, ang: Math.atan2(B.y - A.y, B.x - A.x), twin: null, next: null, visited: false };
        half.push(h); A.out.push(h); return h;
    };
    for (const s of segments) { const A = node(s.a), B = node(s.b); const h1 = add(A, B), h2 = add(B, A); h1.twin = h2; h2.twin = h1; }
    for (const n of nodes.values()) n.out.sort((a, b) => a.ang - b.ang);

    const TAU = Math.PI * 2;
    const dpos = (a, b) => { let d = a - b; while (d <= 0) d += TAU; while (d > TAU) d -= TAU; return d; };

    for (const n of nodes.values()) {
        for (const h of n.out) {
            const arr = h.to.out;
            let best = null, bestDelta = Infinity;
            for (const e of arr) {
                if (e === h.twin) continue;
                const delta = dpos(e.ang, h.twin.ang);
                if (delta < bestDelta - 1e-9) { bestDelta = delta; best = e; }
            }
            h.next = best || h.twin;
        }
    }

    const faces = [];
    for (const h of half) {
        if (h.visited) continue;
        const poly = []; let cur = h, guard = 0;
        while (!cur.visited && guard++ < 20000) {
            cur.visited = true; poly.push({ x: cur.from.x, y: cur.from.y }); cur = cur.next; if (cur === h) break;
        }
        if (poly.length >= 3) faces.push(poly);
    }
    if (faces.length) {
        const idxMax = faces.map((p, i) => ({ i, A: Math.abs(area(p)) }))
            .reduce((acc, v) => (!acc || v.A > acc.A) ? v : acc, null)?.i ?? -1;
        if (idxMax >= 0) faces.splice(idxMax, 1); // выкидываем внешнюю бесконечную грань
    }
    return faces;
}

/* ===== утилиты для face-рендера (простые, «немые») ===== */
export const facePath = (poly) => `M ${poly.map(p => `${p.x} ${p.y}`).join(" L ")} Z`;
export const faceKey = (poly) => poly.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join("|");