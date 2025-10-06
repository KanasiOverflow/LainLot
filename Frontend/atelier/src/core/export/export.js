import {
    area, getBounds, sampleBezier, pointsToPairedPolyline, waveAlongPolyline
} from "./geometry.js";
import {
    polylinesFromSegs, segmentsFromPolylines, splitSegsIntoSubpaths, polylineFromSubpath,
    facePath, faceKey, segsToD, catmullRomToBezierPath
} from "./svgParse.js";
import { buildFacesFromSegments } from "./panels.js";
import { splitByIntersections } from "./intersections.js";

/* ============ helpers ============ */
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const shortId = (id) => {
    const s = String(id);
    return s.includes("-") ? s.split("-").pop() : s;
};

/** bbox по массиву панелей */
const bboxForPanels = (panels) => {
    let bb = null;
    for (const p of panels) {
        const b = getBounds(p.segs);
        if (!bb) bb = { ...b };
        else {
            const x1 = Math.min(bb.x, b.x);
            const y1 = Math.min(bb.y, b.y);
            const x2 = Math.max(bb.x + bb.w, b.x + b.w);
            const y2 = Math.max(bb.y + bb.h, b.y + b.h);
            bb = { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
        }
    }
    return bb || { x: 0, y: 0, w: 800, h: 500 };
};

/** Faces с учётом пользовательских линий (как на канве) */
const buildFacesForExport = (panels, curvesByPanelLocal = {}) => {
    const res = {};
    for (const p of panels) {
        const baseLines = polylinesFromSegs(p.segs);

        // Пользовательские линии в виде полилиний (для разбиения на faces)
        const userLines =
            (curvesByPanelLocal[p.id] || curvesByPanelLocal[shortId(p.id)] || [])
                .flatMap(c => {
                    if (c.type === "cubic" && c.ax != null) {
                        return [sampleBezier(c.ax, c.ay, c.c1.x, c.c1.y, c.c2.x, c.c2.y, c.bx, c.by)];
                    }
                    if (Array.isArray(c.pts) && c.pts.length >= 2) {
                        return [pointsToPairedPolyline(c.pts)];
                    }
                    return [];
                });

        const segsFlat = segmentsFromPolylines([...baseLines, ...userLines]);
        res[p.id] = buildFacesFromSegments(splitByIntersections(segsFlat));
    }
    return res;
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

/** Склейка «Перед» и «Спинка» в один SVG */
export const buildCombinedSVG = async ({
    svgCache, loadPresetToPanels,
    currentPresetId, currentCurves, currentFills,
    savedByPreset,
    inkscapeCompat = true
}) => {
    // обновим снап активного пресета
    const mergedSnaps = {
        ...savedByPreset,
        [currentPresetId]: {
            ...(savedByPreset?.[currentPresetId] || {}),
            curvesByPanel: currentCurves,
            fills: currentFills
        }
    };

    const frontPanels = Array.isArray(svgCache.front) ? svgCache.front : await loadPresetToPanels({ id: "front" });
    const backPanels = Array.isArray(svgCache.back) ? svgCache.back : await loadPresetToPanels({ id: "back" });

    const gFront = renderPresetGroup(frontPanels, mergedSnaps.front?.curvesByPanel, mergedSnaps.front?.fills, { inkscapeCompat });
    const gBack = renderPresetGroup(backPanels, mergedSnaps.back?.curvesByPanel, mergedSnaps.back?.fills, { inkscapeCompat });

    // раскладка
    const bbF = bboxForPanels(frontPanels);
    const bbB = bboxForPanels(backPanels);
    const pad = 24, gap = Math.max(60, Math.round(Math.max(bbF.h, bbB.h) * 0.08));
    const width = pad + bbF.w + gap + bbB.w + pad;
    const height = pad + Math.max(bbF.h, bbB.h) + pad;

    const tFront = `translate(${pad - bbF.x}, ${pad - bbF.y})`;
    const tBack = `translate(${pad + bbF.w + gap - bbB.x}, ${pad - bbB.y})`;

    const w = Math.round(width), h = Math.round(height);

    return [
        `<?xml version="1.0" encoding="UTF-8"?>`,
        `<svg xmlns="http://www.w3.org/2000/svg" width="${w}px" height="${h}px" viewBox="0 0 ${w} ${h}">`,
        `  <desc>${esc("Costume — front & back")}</desc>`,
        `  <g transform="${tFront}">${gFront}</g>`,
        `  <g transform="${tBack}">${gBack}</g>`,
        `</svg>`
    ].join("\n");
};

export const downloadText = (filename, text) => {
    const blob = new Blob([text], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: filename });
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
};