import { useMemo } from "react";

/**
 * Простейшая сетка: шаг завязан на viewBox (10 делений по меньшей стороне)
 */
export function useGrid(viewBox, enabled = true) {
    return useMemo(() => {
        if (!enabled || !viewBox?.w || !viewBox?.h) {
            return { enabled: false, step: 1, cols: [], rows: [] };
        }
        const N = 10;
        const step = Math.min(viewBox.w, viewBox.h) / N;
        const cols = [];
        const rows = [];
        for (let x = 0; x <= viewBox.w + 1e-6; x += step) cols.push(x);
        for (let y = 0; y <= viewBox.h + 1e-6; y += step) rows.push(y);
        return { enabled: true, step, cols, rows };
    }, [viewBox?.w, viewBox?.h, enabled]);
}