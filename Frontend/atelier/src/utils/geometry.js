/* ===== площадь, bbox, пересечения bbox ===== */
export function area(poly) {
    let s = 0;
    for (let i = 0; i < poly.length; i++) {
        const a = poly[i], b = poly[(i + 1) % poly.length];
        s += a.x * b.y - b.x * a.y;
    }
    return s / 2;
}

export function getBounds(segs) {
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

export function bboxIoU(a, b) {
    const x1 = Math.max(a.x, b.x), y1 = Math.max(a.y, b.y);
    const x2 = Math.min(a.x + a.w, b.x + b.w), y2 = Math.min(a.y + a.h, b.y + b.h);
    const iw = Math.max(0, x2 - x1), ih = Math.max(0, y2 - y1);
    const inter = iw * ih;
    const union = a.w * a.h + b.w * b.h - inter || 1;
    return inter / union;
}

/* ===== дискретизация линий ===== */
export function sampleLine(ax, ay, x, y) {
    return [{ x: ax, y: ay }, { x, y }];
}
export function sampleBezier(ax, ay, x1, y1, x2, y2, x, y, steps = 36) {
    const pts = []; let px = ax, py = ay;
    for (let k = 1; k <= steps; k++) {
        const t = k / steps, mt = 1 - t;
        const xt = mt * mt * mt * ax + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x;
        const yt = mt * mt * mt * ay + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y;
        pts.push({ x: px, y: py }, { x: xt, y: yt }); px = xt; py = yt;
    }
    return pts;
}
export function sampleBezierPoints(ax, ay, x1, y1, x2, y2, x, y, steps = 56) {
    const out = [];
    for (let k = 0; k <= steps; k++) {
        const t = k / steps, mt = 1 - t;
        out.push({
            x: mt * mt * mt * ax + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x,
            y: mt * mt * mt * ay + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y
        });
    }
    return out;
}

/* ===== предикаты ===== */
export function pointOnSegment(p, a, b, eps = 1e-6) {
    const cross = (b.y - a.y) * (p.x - a.x) - (b.x - a.x) * (p.y - a.y);
    if (Math.abs(cross) > eps) return false;
    const dot = (p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y);
    if (dot < -eps) return false;
    const len2 = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
    if (dot - len2 > eps) return false;
    return true;
}
export function pointInPolygon(p, poly) {
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        if (pointOnSegment(p, poly[j], poly[i])) return true;
    }
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i].x, yi = poly[i].y, xj = poly[j].x, yj = poly[j].y;
        const intersect = ((yi > p.y) !== (yj > p.y)) &&
            (p.x < (xj - xi) * (p.y - yi) / ((yj - yi) || 1e-9) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}
export function projectPointToSegment(P, A, B) {
    const vx = B.x - A.x, vy = B.y - A.y;
    const len2 = vx * vx + vy * vy || 1e-9;
    let t = ((P.x - A.x) * vx + (P.y - A.y) * vy) / len2;
    t = Math.max(0, Math.min(1, t));
    const x = A.x + vx * t, y = A.y + vy * t;
    const dx = P.x - x, dy = P.y - y;
    return { x, y, t, d2: dx * dx + dy * dy };
}