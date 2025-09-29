export const area = (poly) => {
    let s = 0; for (let i = 0; i < poly.length; i++) {
        const a = poly[i], b = poly[(i + 1) % poly.length]; s += a.x * b.y - b.x * a.y;
    }

    return s / 2;
}

export const getBounds = (segs) => {
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

export const sampleBezier = (ax, ay, x1, y1, x2, y2, x, y, steps = 36) => {
    const pts = []; let px = ax, py = ay;
    for (let k = 1; k <= steps; k++) {
        const t = k / steps, mt = 1 - t;
        const xt = mt * mt * mt * ax + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x;
        const yt = mt * mt * mt * ay + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y;
        pts.push({ x: px, y: py }, { x: xt, y: yt }); px = xt; py = yt;
    }

    return pts;
}

export const sampleBezierPoints = (ax, ay, x1, y1, x2, y2, x, y, steps = 56) => {
    const out = []; for (let k = 0; k <= steps; k++) {
        const t = k / steps, mt = 1 - t;
        out.push({
            x: mt * mt * mt * ax + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x,
            y: mt * mt * mt * ay + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y
        });
    }

    return out;
}

export const sampleLine = (ax, ay, x, y) => {
    return [{ x: ax, y: ay }, { x, y }];
}

/* ---- доп. helpers для дуги по контуру ---- */
export const lerpPt = (A, B, t) => {
    return { x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t };
}

export const segLen = (A, B) => {
    return Math.hypot(B.x - A.x, B.y - A.y);
}

export const projectPointToSegment = (P, A, B) => {
    const vx = B.x - A.x, vy = B.y - A.y;
    const len2 = vx * vx + vy * vy || 1e-9;
    let t = ((P.x - A.x) * vx + (P.y - A.y) * vy) / len2;
    t = Math.max(0, Math.min(1, t));
    const x = A.x + t * vx, y = A.y + t * vy;
    const dx = P.x - x, dy = P.y - y;

    return { x, y, t, d2: dx * dx + dy * dy };
}

/* ========== утилиты «внутри/снаружи» ========== */
export const pointOnSegment = (p, a, b) => {
    const cross = (p.x - a.x) * (b.y - a.y) - (p.y - a.y) * (b.x - a.x);
    if (Math.abs(cross) > 1e-6) return false;
    const dot = (p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y);
    if (dot < -1e-6) return false;
    const len2 = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;

    return dot <= len2 + 1e-6;
}

export const pointInPolygon = (p, poly) => {
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

export const bboxIoU = (a, b) => {
    const x1 = Math.max(a.x, b.x);
    const y1 = Math.max(a.y, b.y);
    const x2 = Math.min(a.x + a.w, b.x + b.w);
    const y2 = Math.min(a.y + a.h, b.y + b.h);
    const iw = Math.max(0, x2 - x1), ih = Math.max(0, y2 - y1);
    const inter = iw * ih;
    const union = a.w * a.h + b.w * b.h - inter || 1;

    return inter / union;
}

export const nearestOnRing = (P, ringPts) => {
    let best = null, idx = -1, d2 = Infinity;
    for (let i = 0; i < ringPts.length; i++) {
        const A = ringPts[i], B = ringPts[(i + 1) % ringPts.length];
        const pr = projectPointToSegment(P, A, B);
        if (pr.d2 < d2) { d2 = pr.d2; best = { ...pr, A, B }; idx = i; }
    }

    return { ...best, idx };
}

export const arcOnRing = (ringPts, posA, posB) => {
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

export const offsetArcInside = (arcPts, outlinePoly, inset) => {
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

export const pointsToPairedPolyline = (pts) => {
    const line = [];
    for (let i = 0; i + 1 < pts.length; i++) {
        line.push(pts[i], pts[i + 1]);
    }

    return line;
}

export const cumulativeLengths = (pts) => {
    const L = [0];
    for (let i = 1; i < pts.length; i++) {
        L.push(L[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
    }

    return L;
}

export const normalsOnPolyline = (pts) => {
    const nrm = [];
    for (let i = 0; i < pts.length; i++) {
        const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
        let tx = b.x - a.x, ty = b.y - a.y;
        const len = Math.hypot(tx, ty) || 1; tx /= len; ty /= len;
        nrm.push({ x: -ty, y: tx });
    }

    return nrm;
}

/** волна вдоль ломаной pts. amp/lambda — в мировых единицах. 
 *  Если outlinePoly задан, точка при необходимости отражается внутрь детали. */
export const waveAlongPolyline = (pts, amp, lambda, outlinePoly = null, phase = 0) => {
    if (!pts || pts.length < 2) return pts || [];
    const L = cumulativeLengths(pts), total = L[L.length - 1] || 1;
    const nrms = normalsOnPolyline(pts);
    const out = [];
    for (let i = 0; i < pts.length; i++) {
        const s = L[i];
        const a = amp * Math.sin((2 * Math.PI * s) / lambda + phase);
        let p = { x: pts[i].x + nrms[i].x * a, y: pts[i].y + nrms[i].y * a };
        if (outlinePoly && !pointInPolygon(p, outlinePoly)) {
            // если «выстрелили» наружу — перегибаем на другую сторону
            p = { x: pts[i].x - nrms[i].x * a, y: pts[i].y - nrms[i].y * a };
        }
        out.push(p);
    }
    // гарантируем совпадение концов с исходными
    out[0] = { ...pts[0] };
    out[out.length - 1] = { ...pts[pts.length - 1] };

    return out;
}

export const segsSignature = (segs) => {
    // стабильный «отпечаток» геометрии
    const parts = [];

    for (const s of segs) {
        if (s.kind === "M") parts.push(`M${s.x.toFixed(3)},${s.y.toFixed(3)}`);
        else if
            (s.kind === "L") parts.push(`L${s.x.toFixed(3)},${s.y.toFixed(3)}`);

        else if (s.kind === "C") parts.push(
            `C${s.x1.toFixed(3)},${s.y1.toFixed(3)},${s.x2.toFixed(3)},${s.y2.toFixed(3)},${s.x.toFixed(3)},${s.y.toFixed(3)}`);
        else if
            (s.kind === "Z") parts.push("Z");
    }

    return parts.join(";");
}