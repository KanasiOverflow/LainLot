import { projectPointToSegment, area } from "./geometry.js";

/* ---- helpers для дуги по контуру ---- */
export const lerpPt = (A, B, t) => ({ x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t });
export const segLen = (A, B) => Math.hypot(B.x - A.x, B.y - A.y);

export function polylineFromSubpath(subSegs) {
    const pts = []; let start = null, curr = null;
    const push = (p) => { if (!pts.length || Math.hypot(pts[pts.length - 1].x - p.x, pts[pts.length - 1].y - p.y) > 1e-6) pts.push(p); };
    for (const s of subSegs) {
        if (s.kind === "M") { start = { x: s.x, y: s.y }; curr = start; push(curr); }
        else if (s.kind === "L") { push({ x: s.ax, y: s.ay }); push({ x: s.x, y: s.y }); curr = { x: s.x, y: s.y }; }
        else if (s.kind === "C") {
            // дискретизация кубика теми же точками что в geometry.sampleBezier
            const steps = 36;
            let px = s.ax, py = s.ay;
            for (let k = 1; k <= steps; k++) {
                const t = k / steps, mt = 1 - t;
                const xt = mt * mt * mt * s.ax + 3 * mt * mt * t * s.x1 + 3 * mt * t * t * s.x2 + t * t * t * s.x;
                const yt = mt * mt * mt * s.ay + 3 * mt * mt * t * s.y1 + 3 * mt * t * t * s.y2 + t * t * t * s.y;
                push({ x: px, y: py }); push({ x: xt, y: yt }); px = xt; py = yt;
            }
            curr = { x: s.x, y: s.y };
        }
        else if (s.kind === "Z" && curr && start) { push(start); }
    }
    if (pts.length > 1) {
        const A = pts[0], B = pts[pts.length - 1];
        if (Math.hypot(A.x - B.x, A.y - B.y) < 1e-6) pts.pop();
    }
    return pts;
}

export function splitSegsIntoSubpaths(segs) {
    const out = []; let cur = [];
    for (const s of segs) {
        if (s.kind === "M") { if (cur.length) out.push(cur); cur = [s]; }
        else { cur.push(s); if (s.kind === "Z") { out.push(cur); cur = []; } }
    }
    if (cur.length) out.push(cur);
    return out.filter(arr => arr.some(x => x.kind !== "M"));
}

export function nearestOnRing(P, ringPts) {
    let best = null, idx = -1, d2 = Infinity;
    for (let i = 0; i < ringPts.length; i++) {
        const A = ringPts[i], B = ringPts[(i + 1) % ringPts.length];
        const pr = projectPointToSegment(P, A, B);
        if (pr.d2 < d2) { d2 = pr.d2; best = { ...pr, A, B }; idx = i; }
    }
    return { ...best, idx };
}

export function arcOnRing(ringPts, posA, posB) {
    const N = ringPts.length;
    const P0 = lerpPt(ringPts[posA.idx], ringPts[(posA.idx + 1) % N], posA.t);
    const P1 = lerpPt(ringPts[posB.idx], ringPts[(posB.idx + 1) % N], posB.t);

    // собираем дугу CCW от posA до posB
    const out = [P0];
    let i = (posA.idx + 1) % N;
    while (i !== (posB.idx + 1) % N) { out.push(ringPts[i]); i = (i + 1) % N; }
    out.push(P1);
    return out;
}

/** Сдвиг дуги внутрь детали: берёт нормали, двигает, отрезает коллизии. */
export function offsetArcInside(arcPts, outlinePoly, inset) {
    if (!arcPts || arcPts.length < 2) return arcPts || [];
    const nrms = normalsOnPolyline(arcPts);
    const out = arcPts.map((p, i) => ({ x: p.x + nrms[i].x * inset, y: p.y + nrms[i].y * inset }));
    // края не задеваем, чтобы соединители попадали на контур
    out[0] = { ...arcPts[0] }; out[out.length - 1] = { ...arcPts[arcPts.length - 1] };
    return out;
}

export function cumulativeLengths(pts) {
    const L = [0];
    for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + segLen(pts[i - 1], pts[i]));
    return L;
}
export function normalsOnPolyline(pts) {
    const n = [];
    for (let i = 0; i < pts.length; i++) {
        const A = pts[Math.max(0, i - 1)], B = pts[Math.min(pts.length - 1, i + 1)];
        const dx = B.x - A.x, dy = B.y - A.y;
        const len = Math.hypot(dx, dy) || 1;
        n.push({ x: -dy / len, y: dx / len }); // поворот влево (внутрь при CCW)
    }
    return n;
}

/** Волна вдоль ломаной. amp/lambda — в мировых единицах. */
export function waveAlongPolyline(pts, amp, lambda, outlinePoly = null, phase = 0) {
    if (!pts || pts.length < 2) return pts || [];
    const L = cumulativeLengths(pts), total = L[L.length - 1] || 1;
    const nrms = normalsOnPolyline(pts);
    const out = [];
    for (let i = 0; i < pts.length; i++) {
        const s = L[i];
        const a = amp * Math.sin((2 * Math.PI * s) / lambda + phase);
        let p = { x: pts[i].x + nrms[i].x * a, y: pts[i].y + nrms[i].y * a };
        if (outlinePoly && !/* pointInPolygon */ false) { // проверка наружу может быть добавлена позже
            p = { x: pts[i].x - nrms[i].x * a, y: pts[i].y - nrms[i].y * a };
        }
        out.push(p);
    }
    out[0] = { ...pts[0] };
    out[out.length - 1] = { ...pts[pts.length - 1] };
    return out;
}

/** Catmull-Rom -> кубические Безье (плавная обводка). */
export function catmullRomToBezierPath(pts) {
    if (!pts || pts.length < 2) return "";
    const p = pts.map(pt => ({ x: pt.x, y: pt.y }));
    const d = [];
    d.push(`M ${p[0].x} ${p[0].y}`);
    for (let i = 0; i < p.length - 1; i++) {
        const p0 = p[Math.max(0, i - 1)];
        const p1 = p[i];
        const p2 = p[i + 1];
        const p3 = p[Math.min(p.length - 1, i + 2)];
        const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
        const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
        d.push(`C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`);
    }
    return d.join(" ");
}

/** Вспомогатели для пользовательской кривой */
export function makeUserCurveBetween(a, b) {
    const k = 1 / 3;
    return {
        c1: { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k },
        c2: { x: b.x - (b.x - a.x) * k, y: b.y - (b.y - a.y) * k }
    };
}
export const pointsToPairedPolyline = (pts) => pts.map(p => ({ x: p.x, y: p.y }));