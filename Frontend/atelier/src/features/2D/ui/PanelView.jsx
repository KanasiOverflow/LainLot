import { memo } from "react";
import clsx from "clsx";
import styles from "../styles/CostumeEditor.module.css";
import { facePath, faceKey, segsToD } from "../../../core/svg/faceUtils.js";

export default memo(function PanelView({
    panel,
    mode,
    scale,
    facesByPanel,
    outerRingByPanel,
    activePanel,
    onPanelActivate,
    fills,
    onFilledEnter,
    onFaceEnter,
    onFilledLeave,
    onFaceLeave,
    onFilledClick,
    onFaceClick,
    onCurveLeave,
    mergedAnchorsOf,
    curvesByPanel,
    setInsertPreview,
    getCursorWorld,
    closestPointOnCurve,
    tooCloseToExistingAnchors,
    setInsertPreviewRAF,
    applyCurvesChange,
    insertPreview,
    extraAnchorsByPanel,
    setHoverAnchorIdx,
    eraseManualAnchor,
    hoverFace,
    hoverAnchorIdx,
    addBuffer,
    onAnchorClickAddMode,
    hoverCurveKey,
    selectedCurveKey,
    clickedCurveKey,
    onCurveEnter,
    setToast,
    onCurveClickDelete
}) {

    const faces = facesByPanel[panel.id] || [];
    const ring = outerRingByPanel[panel.id];
    const isActive = activePanel?.id === panel.id;
    const clickableFaces = faces.length ? faces : (ring ? [ring] : []);
    const dimInactive = mode !== "preview" && !isActive;

    return (
        <g key={panel.id} className={dimInactive ? styles.panelDimmed : undefined}>
            {/* выбор детали (не мешаем заливке) */}
            {ring && mode !== "preview" && mode !== "paint" && mode !== "deleteFill" && (
                <path
                    d={facePath(ring)}
                    fill="transparent"
                    style={{ cursor: "pointer" }}
                    onClick={() => onPanelActivate(panel.id)}
                />
            )}

            {/* грани для покраски / очистки */}
            {clickableFaces.map(poly => {
                const fk = faceKey(poly);
                const fill = (fills.find(f => f.panelId === panel.id && f.faceKey === fk)?.color) || "none";
                const hasFill = fill !== "none";
                const isHover = !!hoverFace && hoverFace.panelId === panel.id && hoverFace.faceKey === fk;
                const canHit = mode === "paint" || mode === "deleteFill";

                return (
                    <g key={fk}>
                        <path
                            d={facePath(poly)}
                            fill={hasFill ? fill : (mode === "paint" && isHover ? "#9ca3af" : "transparent")}
                            fillOpacity={hasFill ? 0.9 : (mode === "paint" && isHover ? 0.35 : 0.001)}
                            stroke="none"
                            style={{ pointerEvents: canHit ? 'all' : 'none', cursor: canHit ? 'crosshair' : 'default' }}
                            onMouseEnter={() => (hasFill ? onFilledEnter(panel.id, fk) : onFaceEnter(panel.id, poly))}
                            onMouseLeave={() => (hasFill ? onFilledLeave(panel.id, fk) : onFaceLeave(panel.id, poly))}
                            onClick={() => (hasFill ? onFilledClick(panel.id, fk) : onFaceClick(panel.id, poly))}
                        />
                        {hasFill && mode === "deleteFill" && isHover && (
                            <path d={facePath(poly)} fill="#000" fillOpacity={0.18} style={{ pointerEvents: "none" }} />
                        )}
                    </g>
                );
            })}

            {/* внешний контур */}
            {ring && (
                <path
                    d={segsToD(panel.segs)}
                    fill="none"
                    stroke="#111"
                    strokeWidth={1.8 * (scale.k || 1)}
                    style={{ pointerEvents: "none" }}
                />
            )}

            {/* пользовательские линии */}
            {(curvesByPanel[panel.id] || []).map(c => {
                const merged = mergedAnchorsOf(panel);
                const a = merged[c.aIdx] ?? (c.ax != null ? { x: c.ax, y: c.ay } : null);
                const b = merged[c.bIdx] ?? (c.bx != null ? { x: c.bx, y: c.by } : null);
                if (!a || !b) return null;

                const d = c.type === "cubic"
                    ? `M ${a.x} ${a.y} C ${c.c1.x} ${c.c1.y} ${c.c2.x} ${c.c2.y} ${b.x} ${b.y}`
                    : c.d;

                const key = `${panel.id}:${c.id}`;
                const isHover = hoverCurveKey === key;
                const isSelected = selectedCurveKey === key;
                const isClicked = clickedCurveKey === key;

                const cls = clsx(
                    styles.userCurve,
                    mode === "preview" && styles.userCurvePreview,
                    mode === "delete" && isHover && styles.userCurveDeleteHover,
                    isSelected && styles.userCurveSelected,
                    isClicked && styles.userCurveClicked
                );

                return (
                    <path
                        key={c.id}
                        d={d}
                        className={cls}
                        onClickCapture={(e) => {
                            if (mode === "delete") {
                                e.stopPropagation();
                                onCurveClickDelete(panel.id, c.id);
                            }
                        }}
                        onMouseEnter={() => { if (isActive) onCurveEnter(panel.id, c.id); }}
                        onMouseLeave={() => {
                            if (mode === "insert") setInsertPreview(prev => (prev && prev.curveId === c.id ? null : prev));
                            onCurveLeave(panel.id, c.id);
                        }}
                        onMouseMove={(e) => {
                            if (mode !== 'insert' || !isActive) return;
                            const P = getCursorWorld(e);
                            if (!P) return;
                            const merged = mergedAnchorsOf(panel);
                            const a = merged[c.aIdx] ?? (c.ax != null ? { x: c.ax, y: c.ay } : null);
                            const b = merged[c.bIdx] ?? (c.bx != null ? { x: c.bx, y: c.by } : null);
                            if (!a || !b) return;

                            const near = closestPointOnCurve(panel, c, P); // ← твой хелпер
                            if (!near) return;

                            const allowed = !tooCloseToExistingAnchors(panel, c, { x: near.x, y: near.y }); // ← твой хелпер
                            setInsertPreviewRAF({ panelId: panel.id, curveId: c.id, x: near.x, y: near.y, allowed, t: near.t });
                        }}
                        onClick={(e) => {
                            if (mode !== 'insert' || !isActive) return;
                            e.stopPropagation();
                            const P = getCursorWorld(e);
                            if (!P) return;
                            const near = closestPointOnCurve(panel, c, P);
                            if (!near) return;

                            if (tooCloseToExistingAnchors(panel, c, { x: near.x, y: near.y })) {
                                setToast({ text: "Слишком близко к существующей вершине" });
                                return;
                            }

                            // Добавляем метку t в extraStops
                            applyCurvesChange(prev => {
                                const list = [...(prev[panel.id] || [])];
                                const i = list.findIndex(x => x.id === c.id);
                                if (i < 0) return prev;

                                const cur = list[i];
                                const stops = Array.isArray(cur.extraStops) ? cur.extraStops.slice() : [];
                                const t = Math.max(0, Math.min(1, near.t));
                                stops.push({ t });

                                // sort + dedupe
                                const EPS = 1e-3; // или 0.5 / scale.k, если хочешь адаптацию к зуму
                                const cleaned = stops
                                    .sort((a, b) => a.t - b.t)
                                    .filter((s, idx, arr) => idx === 0 || Math.abs(s.t - arr[idx - 1].t) > EPS);

                                list[i] = { ...cur, extraStops: cleaned };
                                return { ...prev, [panel.id]: list };
                            }, "Вставить вершину");

                            // визуальный отклик и сброс превью
                            setInsertPreview(null);
                        }}
                        style={{ cursor: (mode === 'preview' || !isActive) ? 'default' : (mode === 'insert' ? 'copy' : 'pointer') }}
                        pointerEvents={(mode === "preview" || !isActive || mode === "deleteVertex") ? "none" : "auto"}
                        strokeLinecap="round"
                    />
                );
            })}

            {/* превью точки вставки */}
            {isActive && mode === "insert" && insertPreview && insertPreview.panelId === panel.id && (
                <circle
                    cx={insertPreview.x}
                    cy={insertPreview.y}
                    r={4}
                    fill={insertPreview.allowed ? "#22c55e" : "#ef4444"}
                    stroke={insertPreview.allowed ? "#166534" : "#991b1b"}
                    strokeWidth={1.5}
                    style={{ pointerEvents: "none" }}
                />
            )}

            {/* базовые + доп. якоря */}
            {isActive && (mode === "add" || mode === "delete" || mode === "insert") && (() => {
                const base = panel.anchors || [];
                const extras = extraAnchorsByPanel[panel.id] || [];
                const merged = [...base, ...extras];
                return merged.map((pt, mi) => (
                    <circle
                        key={`m-${mi}`}
                        cx={pt.x}
                        cy={pt.y}
                        r={3.5}
                        className={clsx(
                            styles.anchor,
                            styles.anchorClickable,
                            mi === hoverAnchorIdx && styles.anchorHovered,
                            mi === addBuffer && styles.anchorSelectedA
                        )}
                        onClick={(e) => { e.stopPropagation(); onAnchorClickAddMode(mi); }}
                        onMouseEnter={() => setHoverAnchorIdx(mi)}
                        onMouseLeave={() => setHoverAnchorIdx(null)}
                    />
                ));
            })()}

            {/* ручные вершины — для удаления */}
            {isActive && mode === "deleteVertex" && (() => {
                const extras = (extraAnchorsByPanel[panel.id] || []).filter(ex => ex?.id?.includes("@m"));
                return extras.map(ex => (
                    <circle
                        key={ex.id}
                        cx={ex.x}
                        cy={ex.y}
                        r={4}
                        className={styles.anchorManualDelete}
                        onClick={(e) => { e.stopPropagation(); eraseManualAnchor(panel.id, ex); }}
                    />
                ));
            })()}
        </g>
    );
});