import { pointInPolygon } from "../geometry/polygonOps.js";
import { area } from "../geometry/bounds.js";

export const buildFacesFromSegments = (segments) => {
    const nodes = new Map();
    const PREC = 1e-4; // при необходимости можно 1e-5
    const norm = (v) => Math.round(v / PREC) * PREC;
    const key = (p) => `${norm(p.x)}_${norm(p.y)}`;
    const node = (p) => {
        const k = key(p);
        if (!nodes.has(k)) nodes.set(k, { ...p, out: [] });
        return nodes.get(k);
    };
    const half = [];
    const add = (A, B) => {
        const h = {
            from: A, to: B, ang: Math.atan2(B.y - A.y, B.x - A.x), twin: null, next: null, visited: false
        };
        half.push(h); A.out.push(h);
        return h;
    };
    for (const s of segments) {
        const A = node(s.a), B = node(s.b);
        const h1 = add(A, B), h2 = add(B, A); h1.twin = h2; h2.twin = h1;
    }
    for (const n of nodes.values())
        n.out.sort((a, b) => a.ang - b.ang); // не критично, но удобно иметь CCW

    const TAU = Math.PI * 2;
    const dpos = (a, b) => {            // положительная разница углов a - b  в (0, 2π]
        let d = a - b;
        while (d <= 0) d += TAU;
        while (d > TAU) d -= TAU;
        return d;
    };

    for (const n of nodes.values()) {
        for (const h of n.out) {
            const arr = h.to.out;
            let best = null, bestDelta = Infinity;

            for (const e of arr) {
                if (e === h.twin)
                    continue;

                const delta = dpos(e.ang, h.twin.ang); // «сразу после twin» против часовой (левый поворот)
                if (delta < bestDelta - 1e-9) {
                    bestDelta = delta; best = e;
                }
            }
            h.next = best || h.twin; // на всякий случай fallback
        }
    }

    const faces = [];
    for (const h of half) {
        if (h.visited)
            continue;

        const poly = []; let cur = h, guard = 0;

        while (!cur.visited && guard++ < 20000) {
            cur.visited = true; poly.push({
                x: cur.from.x, y: cur.from.y
            }); cur = cur.next;
            if (cur === h)
                break;
        }
        if (poly.length >= 3)
            faces.push(poly);
    }
    if (faces.length) {
        const idxMax = faces.map((p, i) => ({
            i, A: Math.abs(area(p))
        })).sort((a, b) => b.A - a.A)[0].i;
        faces.splice(idxMax, 1);
    }
    const cleaned = faces.filter(poly => Math.abs(area(poly)) > 1e-4);

    return cleaned;
}

export const pointInAnyFace = (p, faces) => {
    for (const poly of faces) {
        if (pointInPolygon(p, poly))
            return true;
    }
    return false;
}