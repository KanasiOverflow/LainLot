import React, { useMemo, forwardRef } from "react";
import styles from "./CostumeEditor.module.css";

/** segs -> d */
function segsToD(segs = []) {
    const out = [];
    for (const s of segs) {
        if (s.kind === "M") out.push(`M ${s.x} ${s.y}`);
        else if (s.kind === "L") out.push(`L ${s.x} ${s.y}`);
        else if (s.kind === "C") out.push(`C ${s.x1} ${s.y1} ${s.x2} ${s.y2} ${s.x} ${s.y}`);
        else if (s.kind === "Z") out.push("Z");
    }
    return out.join(" ");
}

/** экран → координаты SVG */
function toSvgXY(svgEl, evt) {
    const pt = svgEl.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const ctm = svgEl.getScreenCTM();
    const inv = ctm && ctm.inverse();
    const res = inv ? pt.matrixTransform(inv) : pt;
    return { x: res.x, y: res.y };
}

const Canvas = forwardRef(function CanvasInner(props, _ignored) {
    const {
        svgRef,
        viewBox = { w: 1, h: 1 },
        cursor = "default",
        grid = { enabled: false, cols: [], rows: [] },

        panels = [],
        facesByPanel = {},
        fillsByPanel = {},            // <— НОВОЕ: рендерим заливки
        curvesByPanel = {},

        hoveredFaceKey = null,
        selectedPanelId = null,

        onFaceEnter = () => { },
        onFaceLeave = () => { },
        onFaceClick = () => { },       // (panelId, facePoly)
        onCurveClickDelete = () => { },// (panelId, curveId)
        onAnchorClick = () => { },     // (panelId, anchorIndex, {x,y})
        onCanvasClick = () => { },     // ({x,y})
    } = props;

    const panelPaths = useMemo(() => {
        const m = {};
        for (const p of panels) m[p.id] = segsToD(p.segs || []);
        return m;
    }, [panels]);

    return (
        <svg
            ref={svgRef}
            className={styles.canvas}
            viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
            style={{ cursor }}
            onClick={(e) => {
                // клик по пустому полотну
                if (e.target === e.currentTarget) {
                    const svg = e.currentTarget;
                    onCanvasClick(toSvgXY(svg, e));
                }
            }}
        >
            {/* GRID */}
            {grid?.enabled && (
                <g pointerEvents="none">
                    {grid.cols?.map((x, i) => (
                        <line key={`vx${i}`} x1={x} y1={0} x2={x} y2={viewBox.h} stroke="#e5e7eb" strokeWidth="0.5" />
                    ))}
                    {grid.rows?.map((y, i) => (
                        <line key={`hz${i}`} x1={0} y1={y} x2={viewBox.w} y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
                    ))}
                </g>
            )}

            {/* FILLS (под обводками) */}
            <g>
                {panels.map((p) =>
                    (facesByPanel[p.id] || []).map((poly, idx) => {
                        const key = `${p.id}:${idx}`;
                        const fill = fillsByPanel[p.id]?.[key];
                        if (!fill) return null;
                        const d = `M ${poly.map((pt) => `${pt.x} ${pt.y}`).join(" L ")} Z`;
                        return <path key={`fill:${key}`} d={d} fill={fill} stroke="none" />;
                    })
                )}
            </g>

            {/* OUTLINES */}
            <g>
                {panels.map((p) => (
                    <path
                        key={p.id}
                        d={panelPaths[p.id] || ""}
                        fill="none"
                        stroke={p.id === selectedPanelId ? "#3b82f6" : "#111827"}
                        strokeWidth={p.id === selectedPanelId ? 1.2 : 0.8}
                    />
                ))}
            </g>

            {/* FACES (hit-area поверх обводок) */}
            <g>
                {panels.map((p) =>
                    (facesByPanel[p.id] || []).map((poly, idx) => {
                        const d = `M ${poly.map((pt) => `${pt.x} ${pt.y}`).join(" L ")} Z`;
                        const key = `${p.id}:${idx}`;
                        const hovered = hoveredFaceKey === key;
                        return (
                            <path
                                key={`face:${key}`}
                                d={d}
                                fill={hovered ? "rgba(59,130,246,0.12)" : "rgba(0,0,0,0)"}
                                stroke="rgba(17,24,39,0.18)"
                                strokeWidth="0.6"
                                onMouseEnter={() => onFaceEnter(p.id, poly)}
                                onMouseLeave={() => onFaceLeave(p.id, poly)}
                                onClick={() => onFaceClick(p.id, poly)}
                            />
                        );
                    })
                )}
            </g>

            {/* USER CURVES */}
            <g>
                {panels.map((p) =>
                    (curvesByPanel[p.id] || []).map((c, i) => (
                        <path
                            key={`${p.id}:${c.id ?? i}`}
                            d={c.d || ""}
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="1.2"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCurveClickDelete?.(p.id, c.id ?? `c${i}`);
                            }}
                        />
                    ))
                )}
            </g>

            {/* ANCHORS (кликабельные) */}
            <g>
                {panels.map((p) =>
                    (p.anchors || []).map((a, i) => (
                        <circle
                            key={`${p.id}:a${i}`}
                            cx={a.x}
                            cy={a.y}
                            r={1.6}
                            className={styles.anchor}
                            onClick={(e) => {
                                e.stopPropagation();
                                onAnchorClick(p.id, i, a);
                            }}
                        />
                    ))
                )}
            </g>
        </svg>
    );
});

export default Canvas;
