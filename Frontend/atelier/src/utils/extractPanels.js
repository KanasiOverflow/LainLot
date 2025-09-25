import { getBounds } from "./geometry.js";
import { parsePathD, segsFromPoints, ensureClosed, parseViewBox, parseMatrix, applyMatrixToSegs, splitClosedSubpaths } from "./svg.js";
import { KEYWORDS } from "./config.js";

/** эвристика «фон/рамка» — выкидываем только когда кандидатов больше одного */
export function looksLikeBackground(cand, root) {
    const { bbox, rawTag } = cand;
    const rootBox = { x: 0, y: 0, w: root.w, h: root.h };
    const A = Math.abs(bbox.w * bbox.h), Av = Math.max(1, root.w * root.h);
    const areaFrac = A / Av;
    const coverW = bbox.w / root.w, coverH = bbox.h / root.h;
    const isBig = areaFrac > 0.48 || (coverW > 0.90 && coverH > 0.90);

    const isRectTag = /^<rect\b/i.test(rawTag);

    // прямоугольник по геометрии (ось X/Y, площадь ≈ bbox)
    let rectLike = false;
    // делаем грубую проверку: если path/polygon без кривых и близко к bbox
    if (/\b(path|polygon|polyline)\b/i.test(rawTag)) {
        rectLike = /\scurve|C\b/i.test(rawTag) ? false : true;
    }

    const namedBg = /inkscape:label="background"|id="(?:background|bg|frame|artboard)"/i.test(rawTag);
    const styleBg = /\sfill="(?!none)/i.test(rawTag) || /(?:\s|;)fill\s*:\s*[^;#)]/i.test(rawTag) || /\sstroke="none"/i.test(rawTag);

    return isBig && (isRectTag || rectLike || namedBg || styleBg);
}

function pushCandidate(candidates, segs, tag, label) {
    if (!segs || !segs.length) return;
    const bb = getBounds(segs);
    candidates.push({
        segs,
        label: label ?? (tag.match(/\sid="([^"]+)"/i)?.[1] || ""),
        bbox: bb,
        bboxArea: Math.abs(bb.w * bb.h) || 1,
        rawTag: tag
    });
}

export function extractPanels(rawSVG) {
    const rootBox = parseViewBox(rawSVG);

    // --- собираем теги
    const pathTags = [...rawSVG.matchAll(/<path\b[^>]*>/gi)].map(m => m[0]);
    const polygonTags = [...rawSVG.matchAll(/<polygon\b[^>]*>/gi)].map(m => m[0]);
    const polylineTags = [...rawSVG.matchAll(/<polyline\b[^>]*>/gi)].map(m => m[0]);
    const rectTags = [...rawSVG.matchAll(/<rect\b[^>]*>/gi)].map(m => m[0]);
    const circleTags = [...rawSVG.matchAll(/<circle\b[^>]*>/gi)].map(m => m[0]);
    const ellipseTags = [...rawSVG.matchAll(/<ellipse\b[^>]*>/gi)].map(m => m[0]);
    const lineTags = [...rawSVG.matchAll(/<line\b[^>]*>/gi)].map(m => m[0]);

    const skipByAttr = (tag) => /\bmask=|\bfilter=/i.test(tag);

    let candidates = [];
    const push = (segs, tag, label) => pushCandidate(candidates, segs, tag, label);

    // PATH
    for (const tag of pathTags) {
        if (skipByAttr(tag)) continue;
        const d = tag.match(/\sd="([^"]+)"/i)?.[1]; if (!d) continue;
        const M = parseMatrix(tag.match(/\btransform="([^"]+)"/i)?.[1] || "");
        const subs = splitClosedSubpaths(d);
        const chunks = subs.length ? subs : [d];
        for (const subD of chunks) {
            let segs = parsePathD(subD);
            if (M) segs = applyMatrixToSegs(segs, M);
            push(segs, tag);
        }
    }

    // POLYGON
    for (const tag of polygonTags) {
        if (skipByAttr(tag)) continue;
        const pts = tag.match(/\spoints="([^"]+)"/i)?.[1]; if (!pts) continue;
        let segs = segsFromPoints(pts, true);
        const M = parseMatrix(tag.match(/\btransform="([^"]+)"/i)?.[1] || "");
        if (M) segs = applyMatrixToSegs(segs, M);
        push(segs, tag);
    }

    // POLYLINE (закрываем)
    for (const tag of polylineTags) {
        if (skipByAttr(tag)) continue;
        const pts = tag.match(/\spoints="([^"]+)"/i)?.[1]; if (!pts) continue;
        let segs = ensureClosed(segsFromPoints(pts, false));
        const M = parseMatrix(tag.match(/\btransform="([^"]+)"/i)?.[1] || "");
        if (M) segs = applyMatrixToSegs(segs, M);
        push(segs, tag);
    }

    // RECT
    for (const tag of rectTags) {
        if (skipByAttr(tag)) continue;
        const get = (n, def = 0) => +(tag.match(new RegExp(`\\s${n}="([^"]+)"`, "i"))?.[1] ?? def);
        let x = get("x"), y = get("y"), w = get("width"), h = get("height");
        if (!(isFinite(w) && isFinite(h) && w > 0 && h > 0)) continue;
        const rx = Math.max(0, get("rx")), ry = Math.max(0, get("ry"));
        const r = Math.min(rx || ry || 0, Math.min(w, h) / 2);
        const pts = r > 0
            ? // скруглённый прямоугольник — многоугольником
            [
                { x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }
            ]
            : [
                { x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }
            ];
        let segs = ensureClosed(segsFromPoints(pts.map(p => `${p.x},${p.y}`).join(" "), true));
        const M = parseMatrix(tag.match(/\btransform="([^"]+)"/i)?.[1] || "");
        if (M) segs = applyMatrixToSegs(segs, M);
        push(segs, tag);
    }

    // CIRCLE/ELLIPSE/LINE — упрощаем в ломаные
    for (const tag of [...circleTags, ...ellipseTags, ...lineTags]) {
        // для MVP можно пропустить, большинство выкроек — path/polygon
        continue;
    }

    if (!candidates.length) return [];

    // отфильтровать фон/рамку (если кандидатов > 1)
    if (candidates.length > 1) {
        candidates = candidates.filter(c => !looksLikeBackground(c, rootBox));
    }

    // выбрать панели: сгруппировать по label и bbox, простая эвристика
    const panels = candidates
        .slice(0, 50)
        .map((c, i) => ({
            id: `panel_${i}`,
            label:
                (c.label && (KEYWORDS.front.test(c.label) ? "Перед"
                    : KEYWORDS.back.test(c.label) ? "Спинка"
                        : c.label)) || `Деталь ${i + 1}`,
            segs: c.segs,
            anchors: collectAnchors(c.segs)
        }));

    return panels;
}

// локальный импорт: собрать якоря (чтобы не тянуть весь faces.js)
function collectAnchors(segs) {
    const out = [];
    for (const s of segs) {
        if (s.kind === "M") out.push({ x: s.x, y: s.y });
        if (s.kind === "L" || s.kind === "C") out.push({ x: s.x, y: s.y });
    }
    return out;
}