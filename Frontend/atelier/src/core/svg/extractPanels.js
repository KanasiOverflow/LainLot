import { bboxIoU, segsSignature } from "../geometry/geometry.js";
import { getBounds } from "../geometry/bounds.js";
import { ensureClosed, splitClosedSubpaths } from "../svg/polylineOps.js";
import { parsePathD, segsFromPoints } from "../svg/parsePath.js";
import { looksLikeBackground } from "../svg/heuristics.js";
import { parseViewBox, parseMatrix, applyMatrixToSegs } from "../geometry/matrix.js";
import { collectAnchors } from "../svg/anchors.js";

/* ================== настройки ================== */
const PANEL_MAX_COUNT = 12;
const PANEL_MIN_AREA_RATIO_DEFAULT = 0.005; // 0.3–0.8% обычно хватает для деталей

export const pushCandidate = (candidates, segs, tag, label) => {
    if (!segs || !segs.length) return;
    const bb = getBounds(segs);
    // имя берём строго из SVG: label → id
    const mLabel = tag.match(/\s(?:inkscape:label|data-name|title)=["']([^"']+)["']/i);
    const mId = tag.match(/\sid=["']([^"']+)["']/i);
    const name = (label ?? mLabel?.[1] ?? mId?.[1] ?? "").trim();
    candidates.push({
        segs,
        label: name,
        bbox: bb,
        bboxArea: Math.abs(bb.w * bb.h) || 1,
        rawTag: tag
    });
}

export const extractPanels = (rawSVG) => {
    const rootBox = parseViewBox(rawSVG);

    // --- собираем теги
    const pathTags = [...rawSVG.matchAll(/<path\b[^>]*>/gi)].map(m => m[0]);
    const polygonTags = [...rawSVG.matchAll(/<polygon\b[^>]*>/gi)].map(m => m[0]);
    const polylineTags = [...rawSVG.matchAll(/<polyline\b[^>]*>/gi)].map(m => m[0]);
    const rectTags = [...rawSVG.matchAll(/<rect\b[^>]*>/gi)].map(m => m[0]);
    const circleTags = [...rawSVG.matchAll(/<circle\b[^>]*>/gi)].map(m => m[0]);
    const ellipseTags = [...rawSVG.matchAll(/<ellipse\b[^>]*>/gi)].map(m => m[0]);
    const lineTags = [...rawSVG.matchAll(/<line\b[^>]*>/gi)].map(m => m[0]);

    // маски/фильтры пропускаем, clip-path НЕ режем (часто это просто «окно»)
    const skipByAttr = (tag) => /\bmask=|\bfilter=/i.test(tag);

    let candidates = [];
    const push = (segs, tag, label) => {
        pushCandidate(candidates, segs, tag, label);
    };

    // ----- PATH
    for (const tag of pathTags) {
        if (skipByAttr(tag))
            continue;

        const d = tag.match(/\sd="([^"]+)"/i)?.[1]; if (!d)
            continue;

        const M = parseMatrix(tag.match(/\btransform="([^"]+)"/i)?.[1] || "");
        const subs = splitClosedSubpaths(d);
        const chunks = subs.length ? subs : [d];
        for (const subD of chunks) {
            let segs = parsePathD(subD);

            if (M)
                segs = applyMatrixToSegs(segs, M);

            push(segs, tag);
        }
    }

    // ----- POLYGON
    for (const tag of polygonTags) {
        if (skipByAttr(tag))
            continue;

        const pts = tag.match(/\spoints="([^"]+)"/i)?.[1]; if (!pts)
            continue;

        let segs = segsFromPoints(pts, true);
        const M = parseMatrix(tag.match(/\btransform="([^"]+)"/i)?.[1] || "");

        if (M)
            segs = applyMatrixToSegs(segs, M);

        push(segs, tag);
    }

    // ----- POLYLINE (закрываем)
    for (const tag of polylineTags) {
        if (skipByAttr(tag))
            continue;

        const pts = tag.match(/\spoints="([^"]+)"/i)?.[1]; if (!pts)
            continue;

        let segs = ensureClosed(segsFromPoints(pts, false));
        const M = parseMatrix(tag.match(/\btransform="([^"]+)"/i)?.[1] || "");

        if (M)
            segs = applyMatrixToSegs(segs, M);

        push(segs, tag);
    }

    // ----- RECT
    for (const tag of rectTags) {
        if (skipByAttr(tag))
            continue;

        const get = (n, def = 0) => +(tag.match(new RegExp(`\\s${n}="([^"]+)"`, "i"))?.[1] ?? def);
        let x = get("x"), y = get("y"), w = get("width"), h = get("height");

        if (!(isFinite(w) && isFinite(h) && w > 0 && h > 0))
            continue;

        const rx = Math.max(0, get("rx")), ry = Math.max(0, get("ry"));
        const r = Math.min(rx || ry || 0, Math.min(w, h) / 2);
        const pts = r > 0
            ? [{ x: x + r, y }, { x: x + w - r, y }, { x: x + w, y: y + r }, { x: x + w, y: y + h - r }, { x: x + w - r, y: y + h }, { x: x + r, y: y + h }, { x, y: y + h - r }, { x, y: y + r }]
            : [{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }];
        let segs = segsFromPoints(pts.map(p => `${p.x},${p.y}`).join(" "), true);
        const M = parseMatrix(tag.match(/\btransform="([^"]+)"/i)?.[1] || "");

        if (M)
            segs = applyMatrixToSegs(segs, M);

        push(segs, tag);
    }

    // ----- CIRCLE/ELLIPSE (аппроксимация многоугольником)
    const approxEllipse = (cx, cy, rx, ry, steps = 72) => {
        const pts = [];
        for (let k = 0; k < steps; k++) {
            const t = (k / steps) * Math.PI * 2;
            pts.push({
                x: cx + rx * Math.cos(t), y: cy + ry * Math.sin(t)
            });
        }

        return segsFromPoints(pts.map(p => `${p.x},${p.y}`).join(" "), true);
    };

    for (const tag of circleTags) {
        if (skipByAttr(tag))
            continue;

        const get = (n, def = 0) => +(tag.match(new RegExp(`\\s${n}="([^"]+)"`, "i"))?.[1] ?? def);
        const cx = get("cx"), cy = get("cy"), r = get("r");

        if (!(isFinite(r) && r > 0))
            continue;

        let segs = approxEllipse(cx, cy, r, r);
        const M = parseMatrix(tag.match(/\btransform="([^"]+)"/i)?.[1] || "");

        if (M)
            segs = applyMatrixToSegs(segs, M);

        push(segs, tag);
    }

    for (const tag of ellipseTags) {
        if (skipByAttr(tag))
            continue;

        const get = (n, def = 0) => +(tag.match(new RegExp(`\\s${n}="([^"]+)"`, "i"))?.[1] ?? def);

        const cx = get("cx"), cy = get("cy"), rx = get("rx"), ry = get("ry"); if (!(isFinite(rx) && rx > 0 && isFinite(ry) && ry > 0))
            continue;

        let segs = approxEllipse(cx, cy, rx, ry);
        const M = parseMatrix(tag.match(/\btransform="([^"]+)"/i)?.[1] || "");

        if (M)
            segs = applyMatrixToSegs(segs, M);

        push(segs, tag);
    }

    // ----- LINE → тонкий «прямоугольник» по stroke-width
    for (const tag of lineTags) {
        if (skipByAttr(tag))
            continue;

        const get = (n, def = 0) => +(tag.match(new RegExp(`\\s${n}="([^"]+)"`, "i"))?.[1] ?? def);

        const x1 = get("x1"), y1 = get("y1"), x2 = get("x2"), y2 = get("y2"); if (![x1, y1, x2, y2].every(isFinite))
            continue;

        const sw = +(tag.match(/\sstroke-width="([^"]+)"/i)?.[1] ?? 1);
        const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1; const nx = -dy / len, ny = dx / len, t = (sw || 1) / 2;
        const pts = [
            { x: x1 + nx * t, y: y1 + ny * t },
            { x: x2 + nx * t, y: y2 + ny * t },
            { x: x2 - nx * t, y: y2 - ny * t },
            { x: x1 - nx * t, y: y1 - ny * t }
        ];

        let segs = segsFromPoints(pts.map(p => `${p.x},${p.y}`).join(" "), true);
        const M = parseMatrix(tag.match(/\btransform="([^"]+)"/i)?.[1] || "");

        if (M)
            segs = applyMatrixToSegs(segs, M);

        push(segs, tag);
    }

    // fallback: если вообще ничего не нашли — берём первый path
    if (!candidates.length) {
        const m = rawSVG.match(/<path[^>]*\sd="([^"]+)"[^>]*>/i);
        if (m) {
            const segs0 = ensureClosed(parsePathD(m[1]));
            pushCandidate(candidates, segs0, "<path>", "panel");
        }
    }
    if (!candidates.length)
        return [];

    // --- Удаляем «фон/рамку», если есть из чего выбирать
    if (candidates.length > 1) {
        const kept = candidates.filter(c => !looksLikeBackground(c, rootBox));
        if (kept.length) candidates = kept;
    }

    // --- Фильтрация по площади (адаптивная)
    candidates.sort((a, b) => b.bboxArea - a.bboxArea);
    const maxA = candidates[0].bboxArea || 1;
    const dominatesView = (candidates[0].bboxArea / (rootBox.w * rootBox.h || 1)) > 0.45;
    const ratio = (candidates.length <= 3 || dominatesView) ? 0.005 : PANEL_MIN_AREA_RATIO_DEFAULT;

    let filtered = candidates.filter(c => (c.bboxArea / maxA) >= ratio);

    // --- Dedup и ограничение количества
    const uniq = [];
    for (const c of filtered) {
        // геометрический отпечаток
        c.sig ||= segsSignature(c.segs);

        const same = uniq.some(u => {
            const areaRatio = Math.min(u.bboxArea, c.bboxArea) / Math.max(u.bboxArea, c.bboxArea);
            const iou = bboxIoU(u.bbox, c.bbox);

            // считаем дубликатом только если bbox почти совпал И геометрия совпала
            return (areaRatio > 0.999 && iou > 0.995) || (u.sig === c.sig);
        });

        if (!same)
            uniq.push(c);

        if (uniq.length >= PANEL_MAX_COUNT)
            break;
    }
    filtered = uniq;

    // --- Финально
    return filtered.map((c, idx) => ({
        id: String(idx + 1),
        // показываем ровно то, что пришло из SVG; если пусто — нейтральный fallback
        label: c.label || `panel_${idx + 1}`,
        segs: c.segs,
        anchors: collectAnchors(c.segs)
    }));
}