import {
    area, waveAlongPolyline
} from "../geometry/geometry.js";
import {
    splitSegsIntoSubpaths, polylineFromSubpath,
    facePath, faceKey, segsToD, catmullRomToBezierPath
} from "../svg/svgParse.js";
import { buildFacesForExport } from "./facesForExport.js";

const shortId = (id) => {
    const s = String(id);
    return s.includes("-") ? s.split("-").pop() : s;
};

/** Рендер одной стороны (цвета, контуры, линии) */
export const renderPresetGroup = (panels, curvesByPanelLocal = {}, fillsLocal = [], opts = { inkscapeCompat: true }) => {
    const pieces = [];

    // 0) Faces + внешние кольца
    const facesByPanel = buildFacesForExport(panels, curvesByPanelLocal);

    const ringByPanel = {};
    for (const p of panels) {
        const subs = splitSegsIntoSubpaths(p.segs);
        let best = null, bestA = -Infinity;
        for (const sp of subs) {
            const r = polylineFromSubpath(sp);
            if (r.length >= 3) {
                const A = Math.abs(area(r));
                if (A > bestA) { bestA = A; best = r; }
            }
        }
        ringByPanel[p.id] = best;
    }

    // 1) Заливки по faceKey (учитываем префиксные/короткие id)
    for (const p of panels) {
        const full = String(p.id), short = shortId(p.id);
        const panelFills = (Array.isArray(fillsLocal) ? fillsLocal : []).filter(f => {
            const fid = String(f.panelId);
            return fid === full || fid === short;
        });
        if (!panelFills.length) continue;

        const faces = facesByPanel[p.id] || [];
        const ring = ringByPanel[p.id];

        for (const f of panelFills) {
            const poly = faces.find(poly => faceKey(poly) === f.faceKey) || f.poly || ring;
            if (!poly) continue;
            pieces.push(`<path d="${facePath(poly)}" fill="${f.color}" fill-opacity="0.9" stroke="none"/>`);
        }
    }

    // 2) Контуры деталей
    for (const p of panels) {
        const ring = ringByPanel[p.id];
        if (ring) {
            // без vector-effect для Inkscape-совместимости
            pieces.push(`<path d="${facePath(ring)}" fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round"/>`);
        }
    }

    // 3) Пользовательские линии (cubic, d, segs, wavy) — с учётом shortId
    for (const p of panels) {
        const arr = (curvesByPanelLocal?.[p.id] || curvesByPanelLocal?.[shortId(p.id)] || []);
        for (const c of arr) {
            let d = null;
            if (c.type === "cubic" && c.ax != null) {
                d = `M ${c.ax} ${c.ay} C ${c.c1.x} ${c.c1.y} ${c.c2.x} ${c.c2.y} ${c.bx} ${c.by}`;
            }
            if (!d && typeof c.d === "string") d = c.d;
            if (!d && Array.isArray(c.segs) && c.segs.length) d = segsToD(c.segs);
            if (!d && Array.isArray(c.pts) && c.pts.length >= 2 && (c.type === "wavy" || c.lineStyle === "wavy")) {
                const waved = waveAlongPolyline(c.pts, c.waveAmpPx ?? 6, c.waveLenPx ?? 28);
                d = catmullRomToBezierPath(waved);
            }
            if (d) {
                pieces.push(
                    `<path d="${d}" fill="none" stroke="${c.color || "#1f2937"}" stroke-width="${c.width || 2}" stroke-linecap="round"/>`
                );
            }
        }
    }

    return `<g>${pieces.join("")}</g>`;
};