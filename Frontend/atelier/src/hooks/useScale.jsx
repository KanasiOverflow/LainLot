import { useCallback, useEffect, useState } from "react";

/**
 * Вычисляет коэффициент масштабирования для hit-testing / толщин.
 * @param {React.RefObject<SVGSVGElement>} svgRef
 * @param {{w:number, h:number}} viewBox
 */
export function useScale(svgRef, viewBox) {
    const [k, setK] = useState(1);

    const recompute = useCallback(() => {
        const el = svgRef?.current;
        if (!el || !viewBox?.w || !viewBox?.h) return;
        const r = el.getBoundingClientRect?.() || { width: 1, height: 1 };
        const kx = r.width / viewBox.w;
        const ky = r.height / viewBox.h;
        setK(Math.max(0.0001, Math.min(kx, ky)));
    }, [svgRef, viewBox?.w, viewBox?.h]);

    useEffect(() => {
        recompute();
        const on = () => recompute();
        window.addEventListener("resize", on);
        return () => window.removeEventListener("resize", on);
    }, [recompute]);

    return { scale: { k }, recomputeScale: recompute };
}