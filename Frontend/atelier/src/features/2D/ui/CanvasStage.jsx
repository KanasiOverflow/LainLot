import { facePath, segsToD } from "../../../core/svg/faceUtils.js";
import PanelView from "./PanelView.jsx";
import styles from "../styles/CostumeEditor.module.css";

export default function CanvasStage({
    mode, scale, facesByPanel, outerRingByPanel,
    activePanel, onPanelActivate, fills, onFilledEnter, onFaceEnter,
    onFilledLeave, onFaceLeave, onFilledClick, onFaceClick, onCurveLeave,
    mergedAnchorsOf, curvesByPanel, setInsertPreview, getCursorWorld, closestPointOnCurve,
    tooCloseToExistingAnchors, setInsertPreviewRAF, applyCurvesChange, insertPreview, extraAnchorsByPanel,
    setHoverAnchorIdx, eraseManualAnchor, hoverFace, hoverAnchorIdx, addBuffer,
    onAnchorClickAddMode, hoverCurveKey, selectedCurveKey, clickedCurveKey, onCurveEnter,
    setToast, onCurveClickDelete, onCurveClick, svgRef, viewBox,
    gridDef, svgMountKey, panels, prevPanels, isSwapping,
    hoodPanelIds, hoodRings, hoodHoles, onCanvasClick, didEverSwapRef,
    presetIdx, PRESETS
}) {

    // универсально: берём оффсет, если он пришёл из манифеста
    const translateOf = (panel) => {
        const off = panel?.meta?.offset || panel?.offset || null;
        if (!off) return null;
        const x = +off.x || 0, y = +off.y || 0;
        return (x || y) ? `translate(${x}, ${y})` : null;
    };

    const scaleOf = (panel) => {
        const s = panel?.meta?.scale || panel?.scale || null;
        if (!s) return null;
        const sx = +s.x || 1, sy = +s.y || 1;
        return (sx !== 1 || sy !== 1) ? `scale(${sx}, ${sy})` : null;
    };

    const transformOf = (panel) => {
        const t = [translateOf(panel), scaleOf(panel)].filter(Boolean).join(" ");
        return t || undefined;
    };

    // Безопасная сборка d: не рендерим, если сегменты «битые»
    const toPathD = (segs) => {
        try {
            const d = segsToD(segs);
            return (d && !/NaN/.test(d)) ? d : null;
        } catch {
            return null;
        }
    };

    return (
        <div className={styles.canvasStack}>
            {/* нижний слой — пред. сцена, только контуры */}
            {prevPanels && (
                <svg
                    className={`${styles.canvas} ${styles.stage} ${styles.swapOut}`}
                    viewBox={viewBox}
                    preserveAspectRatio="xMidYMin meet"
                    style={{ pointerEvents: "none" }}
                    aria-hidden="true"
                >
                    <g>
                        {prevPanels.map((p, i) => {
                            const d = (Array.isArray(p?.segs) && p.segs.length) ? toPathD(p.segs) : null;
                            if (!d) return null;
                            return (
                                <path
                                    key={`prev-${i}-${p.id}`}
                                    d={d}
                                    fill="none"
                                    stroke="#c9ced6"
                                    strokeWidth={1.2}
                                    vectorEffect="non-scaling-stroke"
                                />
                            );
                        })}
                    </g>
                </svg>
            )}

            {/* верхний слой — текущая интерактивная сцена */}
            <svg
                key={svgMountKey}
                ref={svgRef}
                className={`${styles.canvas} ${styles.stage} ${isSwapping ? styles.swapIn : (!didEverSwapRef.current ? styles.svgEnter : "")}`}
                viewBox={viewBox}
                preserveAspectRatio="xMidYMin meet"
                onClick={onCanvasClick}
                role="tabpanel"
                id={presetIdx === 0 ? "panel-front" : "panel-back"}
                aria-labelledby={presetIdx === 0 ? "tab-front" : "tab-back"}
            >
                <title>Деталь: {PRESETS[presetIdx]?.title || "—"}</title>
                {/* GRID */}
                <defs>
                    <pattern id={`grid-${svgMountKey}`} width={gridDef.step} height={gridDef.step} patternUnits="userSpaceOnUse">
                        <path
                            d={`M ${gridDef.step} 0 L 0 0 0 ${gridDef.step}`}
                            fill="none"
                            stroke="#000"
                            strokeOpacity=".06"
                            strokeWidth={0.6 * (scale.k || 1)}
                            vectorEffect="non-scaling-stroke"
                            shapeRendering="crispEdges"
                        />
                    </pattern>

                    {/* Маска, которая спрячeт всё под капюшоном */}
                    <mask id={`under-hood-mask-${svgMountKey}`} maskUnits="userSpaceOnUse">
                        {/* всё показываем по умолчанию */}
                        <rect
                            x={gridDef.b.x}
                            y={gridDef.b.y}
                            width={gridDef.b.w}
                            height={gridDef.b.h}
                            fill="#fff"
                        />
                        {/* а область капюшона вычёркиваем (чёрным) */}
                        {hoodRings.map((poly, i) => (
                            <path key={i} d={facePath(poly)} fill="#000" />
                        ))}
                        {/* внутренние отверстия капюшона возвращаем (белым) */}
                        {hoodHoles.map((poly, i) => (
                            <path key={`hole-${i}`} d={facePath(poly)} fill="#fff" />
                        ))}
                    </mask>
                </defs>
                <rect
                    x={gridDef.b.x}
                    y={gridDef.b.y}
                    width={gridDef.b.w}
                    height={gridDef.b.h}
                    fill={`url(#grid-${svgMountKey})`} pointerEvents="none"
                />

                {/* 1) Все детали, КРОМЕ капюшона — под маской */}
                <g mask={`url(#under-hood-mask-${svgMountKey})`}>
                    {panels.filter(p => !hoodPanelIds.has(p.id)).map((p, i) => (
                        <g key={`wrap-${i}-${p.id}`} transform={transformOf(p) || undefined}>
                            <PanelView
                                key={`${p.id}-${i}`}
                                panel={p}
                                mode={mode}
                                scale={scale}
                                facesByPanel={facesByPanel}
                                outerRingByPanel={outerRingByPanel}
                                activePanel={activePanel}
                                onPanelActivate={onPanelActivate}
                                fills={fills}
                                onFilledEnter={onFilledEnter}
                                onFaceEnter={onFaceEnter}
                                onFilledLeave={onFilledLeave}
                                onFaceLeave={onFaceLeave}
                                onFilledClick={onFilledClick}
                                onFaceClick={onFaceClick}
                                onCurveLeave={onCurveLeave}
                                mergedAnchorsOf={mergedAnchorsOf}
                                curvesByPanel={curvesByPanel}
                                setInsertPreview={setInsertPreview}
                                getCursorWorld={getCursorWorld}
                                closestPointOnCurve={closestPointOnCurve}
                                tooCloseToExistingAnchors={tooCloseToExistingAnchors}
                                setInsertPreviewRAF={setInsertPreviewRAF}
                                applyCurvesChange={applyCurvesChange}
                                insertPreview={insertPreview}
                                extraAnchorsByPanel={extraAnchorsByPanel}
                                setHoverAnchorIdx={setHoverAnchorIdx}
                                eraseManualAnchor={eraseManualAnchor}
                                hoverFace={hoverFace}
                                hoverAnchorIdx={hoverAnchorIdx}
                                addBuffer={addBuffer}
                                onAnchorClickAddMode={onAnchorClickAddMode}
                                hoverCurveKey={hoverCurveKey}
                                selectedCurveKey={selectedCurveKey}
                                clickedCurveKey={clickedCurveKey}
                                onCurveEnter={onCurveEnter}
                                setToast={setToast}
                                onCurveClickDelete={onCurveClickDelete}
                                onCurveClick={onCurveClick}
                            />
                        </g>
                    ))}
                </g>

                {/* 2) Капюшон — поверх, без «белых ластиков» */}
                {panels.filter(p => hoodPanelIds.has(p.id)).map((p, i) => (
                    <g key={`wrap-hood-${i}-${p.id}`} transform={transformOf(p) || undefined}>
                        <PanelView
                            key={`${p.id}-${i}`}
                            panel={p}
                            mode={mode}
                            scale={scale}
                            facesByPanel={facesByPanel}
                            outerRingByPanel={outerRingByPanel}
                            activePanel={activePanel}
                            onPanelActivate={onPanelActivate}
                            fills={fills}
                            onFilledEnter={onFilledEnter}
                            onFaceEnter={onFaceEnter}
                            onFilledLeave={onFilledLeave}
                            onFaceLeave={onFaceLeave}
                            onFilledClick={onFilledClick}
                            onFaceClick={onFaceClick}
                            onCurveLeave={onCurveLeave}
                            mergedAnchorsOf={mergedAnchorsOf}
                            curvesByPanel={curvesByPanel}
                            setInsertPreview={setInsertPreview}
                            getCursorWorld={getCursorWorld}
                            closestPointOnCurve={closestPointOnCurve}
                            tooCloseToExistingAnchors={tooCloseToExistingAnchors}
                            setInsertPreviewRAF={setInsertPreviewRAF}
                            applyCurvesChange={applyCurvesChange}
                            insertPreview={insertPreview}
                            extraAnchorsByPanel={extraAnchorsByPanel}
                            setHoverAnchorIdx={setHoverAnchorIdx}
                            eraseManualAnchor={eraseManualAnchor}
                            hoverFace={hoverFace}
                            hoverAnchorIdx={hoverAnchorIdx}
                            addBuffer={addBuffer}
                            onAnchorClickAddMode={onAnchorClickAddMode}
                            hoverCurveKey={hoverCurveKey}
                            selectedCurveKey={selectedCurveKey}
                            clickedCurveKey={clickedCurveKey}
                            onCurveEnter={onCurveEnter}
                            setToast={setToast}
                            onCurveClickDelete={onCurveClickDelete}
                            onCurveClick={onCurveClick}
                        />
                    </g>
                ))}

            </svg>
        </div>
    );
}