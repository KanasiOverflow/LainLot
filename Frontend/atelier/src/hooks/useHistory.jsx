import { useState, useCallback, useEffect } from "react";

/**
 * История действий отдельно для "Перед" (presetIdx=0) и "Спинка" (presetIdx=1).
 * Передай актуальные стейты и сеттеры — хук сам создаст стек истории и вернёт undo/redo + обёртки set-ов.
 */
export function useHistory({
    fills,
    curvesByPanel,
    presetIdx,
    setFills,
    setCurvesByPanel,
    max = 50,
}) {
    const [histByPreset, setHistByPreset] = useState({}); // { front:{stack, idx}, back:{...} }

    const getActivePresetId = useCallback(
        () => (presetIdx === 0 ? "front" : "back"),
        [presetIdx]
    );

    const getHist = useCallback(
        (pid) => histByPreset[pid] || { stack: [], idx: -1 },
        [histByPreset]
    );

    const snapshot = useCallback(
        () => ({
            fills: JSON.parse(JSON.stringify(fills)),
            curvesByPanel: JSON.parse(JSON.stringify(curvesByPanel)),
        }),
        [fills, curvesByPanel]
    );

    // Инициализируем пустой снапшот при первом заходе на пресет
    useEffect(() => {
        const pid = getActivePresetId();
        setHistByPreset((prev) => {
            const h = prev[pid];
            if (h && h.idx >= 0) return prev;
            const snap = snapshot();
            return { ...prev, [pid]: { stack: [snap], idx: 0 } };
        });
    }, [presetIdx, getActivePresetId, snapshot]);

    const historyCommit = useCallback(() => {
        const pid = getActivePresetId();
        setHistByPreset((prev) => {
            const h = getHist(pid);
            const base = h.stack.slice(0, h.idx + 1);
            base.push(snapshot());
            if (base.length > max) base.shift();
            return { ...prev, [pid]: { stack: base, idx: base.length - 1 } };
        });
    }, [getActivePresetId, getHist, snapshot, max]);

    const historyUndo = useCallback(() => {
        const pid = getActivePresetId();
        setHistByPreset((prev) => {
            const h = getHist(pid);
            if (h.idx <= 0) return prev;
            const idx = h.idx - 1;
            const snap = h.stack[idx];
            setFills(snap.fills);
            setCurvesByPanel(snap.curvesByPanel);
            return { ...prev, [pid]: { ...h, idx } };
        });
    }, [getActivePresetId, getHist, setFills, setCurvesByPanel]);

    const historyRedo = useCallback(() => {
        const pid = getActivePresetId();
        setHistByPreset((prev) => {
            const h = getHist(pid);
            if (h.idx >= h.stack.length - 1) return prev;
            const idx = h.idx + 1;
            const snap = h.stack[idx];
            setFills(snap.fills);
            setCurvesByPanel(snap.curvesByPanel);
            return { ...prev, [pid]: { ...h, idx } };
        });
    }, [getActivePresetId, getHist, setFills, setCurvesByPanel]);

    // Обёртки: пишем шаг "до изменения", затем меняем стейт
    const applyFillChange = useCallback(
        (updater) => {
            historyCommit();
            if (typeof updater === "function") setFills((prev) => updater(prev));
            else setFills(updater);
        },
        [historyCommit, setFills]
    );

    const applyCurvesChange = useCallback(
        (updater) => {
            historyCommit();
            if (typeof updater === "function")
                setCurvesByPanel((prev) => updater(prev));
            else setCurvesByPanel(updater);
        },
        [historyCommit, setCurvesByPanel]
    );

    return {
        historyUndo,
        historyRedo,
        applyFillChange,
        applyCurvesChange,
    };
}