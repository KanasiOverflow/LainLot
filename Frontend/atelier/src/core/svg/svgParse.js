import { sampleBezier } from "../../core/geometry/geometry.js";
import { sampleLine } from "../../core/geometry/polylineOps.js";

/* ========== парсер d: M/L/C/Z + H/V/S/Q/T, A->L ========== */
export const parsePathD = (d) => {
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
                const rel = cmd === "m";
                const x = read(), y = read();
                const nx = rel ? curr.x + x : x, ny = rel ? curr.y + y : y;
                curr = { x: nx, y: ny };
                start = { ...curr };
                segs.push({
                    kind: "M", x: nx, y: ny
                });
                prevC2 = prevQ1 = null;

                while (i < tokens.length && !isCmd(tokens[i])) {
                    const lx = read(), ly = read();
                    const nx2 = rel ? curr.x + lx : lx, ny2 = rel ? curr.y + ly : ly;
                    segs.push({
                        kind: "L", ax: curr.x, ay: curr.y, x: nx2, y: ny2
                    });
                    curr = { x: nx2, y: ny2 };
                    prevC2 = prevQ1 = null;
                }

                break;
            }
            case "L": case "l": {
                const rel = cmd === "l";
                const x = read(), y = read();
                const nx = rel ? curr.x + x : x, ny = rel ? curr.y + y : y;
                segs.push({
                    kind: "L", ax: curr.x, ay: curr.y, x: nx, y: ny
                });
                curr = {
                    x: nx, y: ny
                };
                prevC2 = prevQ1 = null;

                break;
            }
            case "H": case "h": {
                const rel = cmd === "h"; const x = read();
                const nx = rel ? curr.x + x : x, ny = curr.y;
                segs.push({
                    kind: "L", ax: curr.x, ay: curr.y, x: nx, y: ny
                });
                curr = {
                    x: nx, y: ny
                };
                prevC2 = prevQ1 = null;

                break;
            }
            case "V": case "v": {
                const rel = cmd === "v"; const y = read();
                const nx = curr.x, ny = rel ? curr.y + y : y;
                segs.push({
                    kind: "L", ax: curr.x, ay: curr.y, x: nx, y: ny
                });
                curr = {
                    x: nx, y: ny
                };
                prevC2 = prevQ1 = null;

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
                segs.push(seg);
                prevC2 = {
                    x: seg.x2, y: seg.y2
                };
                prevQ1 = null; curr = {
                    x: seg.x, y: seg.y
                };

                break;
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
                segs.push(seg);
                prevC2 = {
                    x: seg.x2, y: seg.y2
                };
                prevQ1 = null;
                curr = {
                    x: seg.x, y: seg.y
                };

                break;
            }
            case "Q": case "q": {
                const rel = cmd === "q"; const qx = read(), qy = read(), x = read(), y = read();
                const Q1 = {
                    x: rel ? curr.x + qx : qx, y: rel ? curr.y + qy : qy
                };
                const P0 = { ...curr }, P2 = { x: rel ? curr.x + x : x, y: rel ? curr.y + y : y };
                const C1 = {
                    x: P0.x + (2 / 3) * (Q1.x - P0.x), y: P0.y + (2 / 3) * (Q1.y - P0.y)
                };
                const C2 = {
                    x: P2.x + (2 / 3) * (Q1.x - P2.x), y: P2.y + (2 / 3) * (Q1.y - P2.y)
                };
                segs.push({
                    kind: "C", ax: P0.x, ay: P0.y, x1: C1.x, y1: C1.y, x2: C2.x, y2: C2.y, x: P2.x, y: P2.y
                });
                curr = P2;
                prevC2 = { ...C2 };
                prevQ1 = { ...Q1 };

                break;
            }
            case "T": case "t": {
                const rel = cmd === "t"; const refl = prevQ1 ? {
                    x: 2 * curr.x - prevQ1.x, y: 2 * curr.y - prevQ1.y
                } : { ...curr };
                const x = read(), y = read();
                const P2 = {
                    x: rel ? curr.x + x : x, y: rel ? curr.y + y : y
                };
                const C1 = {
                    x: curr.x + (2 / 3) * (refl.x - curr.x), y: curr.y + (2 / 3) * (refl.y - curr.y)
                };
                const C2 = {
                    x: P2.x + (2 / 3) * (refl.x - P2.x), y: P2.y + (2 / 3) * (refl.y - P2.y)
                };
                segs.push({
                    kind: "C", ax: curr.x, ay: curr.y, x1: C1.x, y1: C1.y, x2: C2.x, y2: C2.y, x: P2.x, y: P2.y
                });
                curr = P2; prevC2 = { ...C2 }; prevQ1 = { ...refl };

                break;
            }
            case "A": case "a": {
                const rel = cmd === "a";
                const _rx = read(), _ry = read(), _rot = read(), _laf = read(), _sw = read();
                const x = read(), y = read();
                const nx = rel ? curr.x + x : x, ny = rel ? curr.y + y : y;
                segs.push({
                    kind: "L", ax: curr.x, ay: curr.y, x: nx, y: ny
                });
                curr = { x: nx, y: ny }; prevC2 = prevQ1 = null;

                break;
            }
            case "Z":
            case "z": segs.push({ kind: "Z" });
                curr = { ...start }; prevC2 = prevQ1 = null;

                break;

            default:
                break;
        }
    }

    return segs;
}

/* ========== polygon / polyline ========== */
export const parsePoints = (pointsStr) => {
    const nums = pointsStr.trim().split(/[\s,]+/).map(parseFloat).filter(n => !isNaN(n));
    const pts = [];
    for (let i = 0; i + 1 < nums.length; i += 2)
        pts.push({ x: nums[i], y: nums[i + 1] });

    return pts;
}

export const segsFromPoints = (pointsStr, close = true) => {
    const pts = parsePoints(pointsStr); if (!pts.length) return [];
    const segs = [{ kind: "M", x: pts[0].x, y: pts[0].y }]; let prev = pts[0];
    for (let i = 1; i < pts.length; i++) {
        const p = pts[i]; segs.push({
            kind: "L", ax: prev.x, ay: prev.y, x: p.x, y: p.y
        });
        prev = p;
    }
    if (close && (prev.x !== pts[0].x || prev.y !== pts[0].y))
        segs.push({ kind: "L", ax: prev.x, ay: prev.y, x: pts[0].x, y: pts[0].y });
    if (close)
        segs.push({ kind: "Z" });

    return segs;
}

/* ========== полилинии/сегменты ========== */
export const polylinesFromSegs = (segs) => {
    const lines = []; let start = null, curr = null;
    for (const s of segs) {
        if (s.kind === "M") {
            start = {
                x: s.x, y: s.y
            };
            curr = start;
        }
        else if (s.kind === "L") {
            lines.push(sampleLine(s.ax, s.ay, s.x, s.y));
            curr = {
                x: s.x, y: s.y
            };
        }
        else if (s.kind === "C") {
            lines.push(sampleBezier(s.ax, s.ay, s.x1, s.y1, s.x2, s.y2, s.x, s.y));
            curr = {
                x: s.x, y: s.y
            };
        }
        else if (s.kind === "Z" && curr && start && (curr.x !== start.x || curr.y !== start.y)) {
            lines.push(sampleLine(curr.x, curr.y, start.x, start.y));
        }
    }
    return lines;
}

export const segmentsFromPolylines = (polylines) => {
    const segs = [];
    for (const line of polylines)
        for (let i = 0; i + 1 < line.length; i += 2)
            segs.push({ a: line[i], b: line[i + 1] });

    return segs;
}

export const ensureClosed = (segs) => {
    if (segs.some(s => s.kind === "Z"))
        return segs;

    let start = null, last = null;

    for (const s of segs) {
        if (s.kind === "M") {
            start = {
                x: s.x, y: s.y
            };
            last = start;
        } else if (s.kind === "L" || s.kind === "C") {
            last = { x: s.x, y: s.y };
        }
    }

    if (!start || !last)
        return segs;

    const out = [...segs];

    if (start.x !== last.x || start.y !== last.y) {
        out.push({
            kind: "L", ax: last.x, ay: last.y, x: start.x, y: start.y
        });
    }

    out.push({ kind: "Z" });

    return out;
}

/* ========== разбор svg в панели ========== */
export const splitClosedSubpaths = (d) => {
    const parts = [];
    const re = /([Mm][^MmZz]*[Zz])/g; let m; while ((m = re.exec(d))) {
        parts.push(m[1]);
    }

    if (!parts.length) {
        const all = d.split(/(?=[Mm])/).map(s => s.trim()).filter(Boolean);
        for (const p of all) {
            if (/[Zz]/.test(p)) parts.push(p);
        }
    }

    return parts;
}

export const splitSegsIntoSubpaths = (segs) => {
    const out = [];
    let cur = [];
    for (const s of segs) {
        if (s.kind === "M") {
            if (cur.length) out.push(cur);
            cur = [s];
        }
        else {
            cur.push(s);
            if (s.kind === "Z") {
                out.push(cur);
                cur = [];
            }
        }
    }
    if (cur.length) {
        out.push(cur);
    }

    return out.filter(arr => arr.some(x => x.kind !== "M"));
}

export const polylineFromSubpath = (subSegs) => {
    const pts = [];
    let start = null, curr = null;
    const push = (p) => {
        if (!pts.length || Math.hypot(pts[pts.length - 1].x - p.x, pts[pts.length - 1].y - p.y) > 1e-6) {
            pts.push(p);
        }
    };
    for (const s of subSegs) {
        if (s.kind === "M") {
            start = { x: s.x, y: s.y };
            curr = start; push(curr);
        }
        else if (s.kind === "L") {
            const line = sampleLine(s.ax, s.ay, s.x, s.y);
            for (const p of line) push(p);
            curr = { x: s.x, y: s.y };
        }
        else if (s.kind === "C") {
            const line = sampleBezier(s.ax, s.ay, s.x1, s.y1, s.x2, s.y2, s.x, s.y);
            for (const p of line) {
                push(p);
            }
            curr = {
                x: s.x, y: s.y
            };
        }
        else if (s.kind === "Z" && curr && start) {
            push(start);
        }
    }
    if (pts.length > 1) {
        const A = pts[0], B = pts[pts.length - 1];
        if (Math.hypot(A.x - B.x, A.y - B.y) < 1e-6) {
            pts.pop();
        }
    }
    return pts;
}

export const catmullRomToBezierPath = (pts) => {
    if (pts.length < 2)
        return "";

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

export const facePath = (poly) => {
    return `M ${poly.map(p => `${p.x} ${p.y}`).join(" L ")} Z`;
}

export const faceKey = (poly) => {
    return poly.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join("|");
}

// утилита для простого outline-пути из сегментов (для нижнего слоя)
export const segsToD = (segs) =>
    segs.map(s => s.kind === "M" ? `M ${s.x} ${s.y}` :
        s.kind === "L" ? `L ${s.x} ${s.y}` :
            s.kind === "C" ? `C ${s.x1} ${s.y1} ${s.x2} ${s.y2} ${s.x} ${s.y}`
                : "Z").join(" ");