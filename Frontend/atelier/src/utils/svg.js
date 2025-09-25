import { sampleLine, sampleBezier } from "./geometry";

/* ========== парсер d: M/L/C/Z + H/V/S/Q/T, A->L ========== */
export function parsePathD(d) {
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
                segs.push({ kind: "M", x: nx, y: ny }); prevC2 = prevQ1 = null;
                while (i < tokens.length && !isCmd(tokens[i])) {
                    const lx = read(), ly = read();
                    const nx2 = rel ? curr.x + lx : lx, ny2 = rel ? curr.y + ly : ly;
                    segs.push({ kind: "L", ax: curr.x, ay: curr.y, x: nx2, y: ny2 });
                    curr = { x: nx2, y: ny2 }; prevC2 = prevQ1 = null;
                } break;
            }
            case "L": case "l": {
                const rel = cmd === "l"; const x = read(), y = read();
                const nx = rel ? curr.x + x : x, ny = rel ? curr.y + y : y;
                segs.push({ kind: "L", ax: curr.x, ay: curr.y, x: nx, y: ny });
                curr = { x: nx, y: ny }; prevC2 = prevQ1 = null; break;
            }
            case "H": case "h": {
                const rel = cmd === "h"; const x = read();
                const nx = rel ? curr.x + x : x;
                segs.push({ kind: "L", ax: curr.x, ay: curr.y, x: nx, y: curr.y });
                curr = { x: nx, y: curr.y }; prevC2 = prevQ1 = null; break;
            }
            case "V": case "v": {
                const rel = cmd === "v"; const y = read();
                const ny = rel ? curr.y + y : y;
                segs.push({ kind: "L", ax: curr.x, ay: curr.y, x: curr.x, y: ny });
                curr = { x: curr.x, y: ny }; prevC2 = prevQ1 = null; break;
            }
            case "C": case "c": {
                const rel = cmd === "c";
                const x1 = read(), y1 = read(), x2 = read(), y2 = read(), x = read(), y = read();
                const nx1 = rel ? curr.x + x1 : x1, ny1 = rel ? curr.y + y1 : y1;
                const nx2 = rel ? curr.x + x2 : x2, ny2 = rel ? curr.y + y2 : y2;
                const nx = rel ? curr.x + x : x, ny = rel ? curr.y + y : y;
                segs.push({ kind: "C", ax: curr.x, ay: curr.y, x1: nx1, y1: ny1, x2: nx2, y2: ny2, x: nx, y: ny });
                curr = { x: nx, y: ny }; prevC2 = { x: nx2, y: ny2 }; prevQ1 = null; break;
            }
            case "S": case "s": {
                const rel = cmd === "s";
                const x2 = read(), y2 = read(), x = read(), y = read();
                const nx2 = rel ? curr.x + x2 : x2, ny2 = rel ? curr.y + y2 : y2;
                const nx = rel ? curr.x + x : x, ny = rel ? curr.y + y : y;
                const nx1 = prevC2 ? (2 * curr.x - prevC2.x) : curr.x;
                const ny1 = prevC2 ? (2 * curr.y - prevC2.y) : curr.y;
                segs.push({ kind: "C", ax: curr.x, ay: curr.y, x1: nx1, y1: ny1, x2: nx2, y2: ny2, x: nx, y: ny });
                curr = { x: nx, y: ny }; prevC2 = { x: nx2, y: ny2 }; prevQ1 = null; break;
            }
            case "Q": case "q": { // аппроксимируем кубиком
                const rel = cmd === "q";
                const x1 = read(), y1 = read(), x = read(), y = read();
                const nx1 = rel ? curr.x + x1 : x1, ny1 = rel ? curr.y + y1 : y1;
                const nx = rel ? curr.x + x : x, ny = rel ? curr.y + y : y;
                // переводим в кубик через контрольные точки (De Casteljau)
                const c1 = { x: curr.x + (2 / 3) * (nx1 - curr.x), y: curr.y + (2 / 3) * (ny1 - curr.y) };
                const c2 = { x: nx + (2 / 3) * (nx1 - nx), y: ny + (2 / 3) * (ny1 - ny) };
                segs.push({ kind: "C", ax: curr.x, ay: curr.y, x1: c1.x, y1: c1.y, x2: c2.x, y2: c2.y, x: nx, y: ny });
                curr = { x: nx, y: ny }; prevC2 = null; prevQ1 = { x: nx1, y: ny1 }; break;
            }
            case "T": case "t": {
                const rel = cmd === "t"; const x = read(), y = read();
                const nx = rel ? curr.x + x : x, ny = rel ? curr.y + y : y;
                const q1 = prevQ1 ? { x: 2 * curr.x - prevQ1.x, y: 2 * curr.y - prevQ1.y } : { ...curr };
                const c1 = { x: curr.x + (2 / 3) * (q1.x - curr.x), y: curr.y + (2 / 3) * (q1.y - curr.y) };
                const c2 = { x: nx + (2 / 3) * (q1.x - nx), y: ny + (2 / 3) * (q1.y - ny) };
                segs.push({ kind: "C", ax: curr.x, ay: curr.y, x1: c1.x, y1: c1.y, x2: c2.x, y2: c2.y, x: nx, y: ny });
                curr = { x: nx, y: ny }; prevC2 = null; prevQ1 = q1; break;
            }
            case "A": case "a": { // эллиптическую дугу аппроксимируем отрезками
                // упрощённо — переводим A -> множество L через дискретизацию
                const x = read(), y = read(); // пропускаем rx,ry,xAxisRot,largeArc,sweep
                const nx = (cmd === "a") ? curr.x + x : x, ny = (cmd === "a") ? curr.y + y : y;
                segs.push({ kind: "L", ax: curr.x, ay: curr.y, x: nx, y: ny });
                curr = { x: nx, y: ny }; prevC2 = prevQ1 = null; break;
            }
            case "Z": case "z": {
                segs.push({ kind: "Z" }); curr = { ...start }; prevC2 = prevQ1 = null; break;
            }
            default: i = tokens.length; break;
        }
    }
    return segs;
}

export function parsePoints(pointsStr) {
    const nums = pointsStr.trim().split(/[\s,]+/).map(parseFloat).filter(n => !isNaN(n));
    const pts = [];
    for (let i = 0; i + 1 < nums.length; i += 2) pts.push({ x: nums[i], y: nums[i + 1] });
    return pts;
}

export function segsFromPoints(pointsStr, close = true) {
    const pts = parsePoints(pointsStr); if (!pts.length) return [];
    const segs = [{ kind: "M", x: pts[0].x, y: pts[0].y }]; let prev = pts[0];
    for (let i = 1; i < pts.length; i++) {
        segs.push({ kind: "L", ax: prev.x, ay: prev.y, x: pts[i].x, y: pts[i].y });
        prev = pts[i];
    }
    if (close && pts.length > 2) {
        segs.push({ kind: "L", ax: prev.x, ay: prev.y, x: pts[0].x, y: pts[0].y });
        segs.push({ kind: "Z" });
    }
    return segs;
}

export function ensureClosed(segs) {
    if (segs.some(s => s.kind === "Z")) return segs;
    let start = null, last = null;
    for (const s of segs) {
        if (s.kind === "M") { start = { x: s.x, y: s.y }; last = start; }
        else if (s.kind === "L" || s.kind === "C") { last = { x: s.x, y: s.y }; }
    }
    if (!start || !last) return segs;
    const out = [...segs];
    if (start.x !== last.x || start.y !== last.y)
        out.push({ kind: "L", ax: last.x, ay: last.y, x: start.x, y: start.y });
    out.push({ kind: "Z" });
    return out;
}

export function splitClosedSubpaths(d) {
    const parts = [];
    const re = /([Mm][^MmZz]*[Zz])/g; let m;
    while ((m = re.exec(d))) parts.push(m[1]);
    if (!parts.length) {
        const all = d.split(/(?=[Mm])/).map(s => s.trim()).filter(Boolean);
        for (const p of all) if (/[Zz]/.test(p)) parts.push(p);
    }
    return parts;
}

/* ===== SVG meta & transforms ===== */
export function parseViewBox(raw) {
    const vb = raw.match(/\bviewBox="([^"]+)"/i)?.[1]?.trim();
    if (vb) {
        const [minx, miny, w, h] = vb.split(/\s+/).map(parseFloat);
        if (isFinite(w) && isFinite(h) && w > 0 && h > 0) return { w, h };
    }
    const w = parseFloat(raw.match(/\bwidth="([\d.]+)(?:px)?"/i)?.[1] ?? "0");
    const h = parseFloat(raw.match(/\bheight="([\d.]+)(?:px)?"/i)?.[1] ?? "0");
    return (isFinite(w) && isFinite(h) && w > 0 && h > 0) ? { w, h } : { w: 1, h: 1 };
}

export function parseMatrix(str) {
    const m = str?.match(/matrix\(\s*([^\)]+)\)/i);
    if (!m) return null;
    const nums = m[1].split(/[\s,]+/).map(parseFloat);
    if (nums.length !== 6 || nums.some(n => !isFinite(n))) return null;
    const [a, b, c, d, e, f] = nums;
    return { a, b, c, d, e, f };
}
export function applyMatrixToPoint(p, M) {
    return { x: M.a * p.x + M.c * p.y + M.e, y: M.b * p.x + M.d * p.y + M.f };
}
export function applyMatrixToSegs(segs, M) {
    if (!M) return segs;
    return segs.map(s => {
        const r = { ...s };
        if (s.kind === "L" || s.kind === "M") {
            const p = applyMatrixToPoint({ x: s.x, y: s.y }, M);
            r.x = p.x; r.y = p.y;
            if ("ax" in s) {
                const a = applyMatrixToPoint({ x: s.ax, y: s.ay }, M);
                r.ax = a.x; r.ay = a.y;
            }
        } else if (s.kind === "C") {
            const a = applyMatrixToPoint({ x: s.ax, y: s.ay }, M);
            const p1 = applyMatrixToPoint({ x: s.x1, y: s.y1 }, M);
            const p2 = applyMatrixToPoint({ x: s.x2, y: s.y2 }, M);
            const p = applyMatrixToPoint({ x: s.x, y: s.y }, M);
            r.ax = a.x; r.ay = a.y; r.x1 = p1.x; r.y1 = p1.y; r.x2 = p2.x; r.y2 = p2.y; r.x = p.x; r.y = p.y;
        }
        return r;
    });
}