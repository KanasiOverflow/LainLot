// src/components/2D/CostumeEditor/hooks/useTopology.js
import { useMemo } from "react";
import { polylinesFromSegs, segmentsFromPolylines, splitByIntersections, buildFacesFromSegments } from "../utils/faces.js";
import { splitSegsIntoSubpaths, polylineFromSubpath } from "../utils/routing.js";

export function useTopology(panels, curvesByPanel = {}) {
    return useMemo(() => {
        const baseFacesByPanel = {};
        const ringsByPanel = {};
        const facesByPanel = {};
        const segmentsByPanel = {};

        for (const p of panels || []) {
            // Базовые грани (только геометрия панели)
            const baseLines = polylinesFromSegs(p.segs);
            const segsFlat = segmentsFromPolylines(baseLines);
            baseFacesByPanel[p.id] = buildFacesFromSegments(splitByIntersections(segsFlat));

            // Кольца (каждый закрытый подконтур — отдельная полилиния)
            const subs = splitSegsIntoSubpaths(p.segs);
            ringsByPanel[p.id] = subs.map(polylineFromSubpath).filter(r => r.length >= 3);

            // Грани с учётом пользовательских линий
            const userLines = (curvesByPanel[p.id] || []);
            const mergedSegs = segmentsFromPolylines([...baseLines, ...userLines]);
            segmentsByPanel[p.id] = mergedSegs;
            facesByPanel[p.id] = buildFacesFromSegments(splitByIntersections(mergedSegs));
        }

        return { baseFacesByPanel, ringsByPanel, facesByPanel, segmentsByPanel };
    }, [panels, curvesByPanel]);
}