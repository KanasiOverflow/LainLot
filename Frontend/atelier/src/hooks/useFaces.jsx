import { useMemo } from "react";
import { polylinesFromSegs, segmentsFromPolylines, splitByIntersections, buildFacesFromSegments } from "../utils/faces.js";

/**
 * @param {Array<{id:string,segs:any[]}>} panels
 * @param {Record<string, any[]>} userCurvesByPanel - опционально: массивы дополнительных «отрезков»/полилиний для каждой панели
 */
export function useFaces(panels, userCurvesByPanel = {}) {
    return useMemo(() => {
        const facesByPanel = {};
        const segmentsByPanel = {};

        for (const p of panels || []) {
            // 1) превращаем сегменты SVG в дискретные полилинии (массив точечных пар)
            const polylines = polylinesFromSegs(p.segs);
            // 2) объединяем с пользовательскими линиями, если есть
            const extra = userCurvesByPanel[p.id] || [];
            const segs = segmentsFromPolylines([...polylines, ...extra]);
            segmentsByPanel[p.id] = segs;

            // 3) режем пересечениями
            const split = splitByIntersections(segs);
            // 4) собираем DCEL-ом замкнутые грани
            const faces = buildFacesFromSegments(split);
            facesByPanel[p.id] = faces;
        }

        return { facesByPanel, segmentsByPanel };
    }, [panels, userCurvesByPanel]);
}