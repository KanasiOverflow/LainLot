import { useState, useCallback, useEffect } from "react";

/**
 * История действий отдельно для "Перед" (presetIdx=0) и "Спинка" (presetIdx=1).
 * Пишем снимки СОСТОЯНИЯ ПОСЛЕ изменения (как в PS/AI).
 * Также ведём массив логов с лейблами действий.
 */
export function useHistory({
    fills,
    curvesByPanel,
    presetIdx,
    setFills,
    setCurvesByPanel,
    max = 50,
}) {
    const [histByPreset, setHistByPreset] = useState({}); // { front:{stack:[snap], idx:number}, back:{...} }
    const [logByPreset, setLogByPreset] = useState({}); // { front:{logs:[{label,at}], idx:number}, ... }

    const pid = presetIdx === 0 ? "front" : "back";

    // текущий снимок
    const snapNow = useCallback(() => ({
        fills: JSON.parse(JSON.stringify(fills)),
        curvesByPanel: JSON.parse(JSON.stringify(curvesByPanel)),
    }), [fills, curvesByPanel]);

    // Инициализация стека и логов при первом заходе на деталь
    useEffect(() => {
        setHistByPreset(prev => {
            const h = prev[pid];
            if (h && h.idx >= 0) return prev;
            const snap = snapNow();
            return { ...prev, [pid]: { stack: [snap], idx: 0 } };
        });
        setLogByPreset(prev => {
            const l = prev[pid];
            if (l && l.idx >= 0) return prev;
            return { ...prev, [pid]: { logs: [{ label: "Старт", at: Date.now() }], idx: 0 } };
        });
    }, [pid, snapNow]);

    const canUndo = !!(histByPreset[pid] && histByPreset[pid].idx > 0);
    const canRedo = !!(histByPreset[pid] && histByPreset[pid].idx < (histByPreset[pid].stack.length - 1));

    // общий коммит Состояния ПОСЛЕ изменения + лог действия
    const commitState = useCallback((nextSnap, label = "Шаг") => {
        setHistByPreset(prev => {
            const h = prev[pid] || { stack: [], idx: -1 };
            const pruned = h.stack.slice(0, h.idx + 1);
            pruned.push(nextSnap);
            // лимитируем
            while (pruned.length > max) pruned.shift();
            const newIdx = pruned.length - 1;
            return { ...prev, [pid]: { stack: pruned, idx: newIdx } };
        });
        setLogByPreset(prev => {
            const l = prev[pid] || { logs: [], idx: -1 };
            const pruned = l.logs.slice(0, Math.max(0, l.idx) + 1);
            pruned.push({ label, at: Date.now() });
            while (pruned.length > max + 1) pruned.shift(); // +1, т.к. есть "Старт"
            const newIdx = pruned.length - 1;
            return { ...prev, [pid]: { logs: pruned, idx: newIdx } };
        });
    }, [pid, max]);

    // Позволяет добавить запись в историю без изменения данных,
    // фиксируя текущее состояние (как PS/AI делает «после действия»).
    const pushHistory = useCallback((label = "Шаг") => {
        const snap = snapNow();
        commitState(snap, label);
    }, [snapNow, commitState]);

    // Отмена / Повтор
    const historyUndo = useCallback(() => {
        setHistByPreset(prev => {
            const h = prev[pid];
            if (!h || h.idx <= 0) return prev;
            const idx = h.idx - 1;
            const snap = h.stack[idx];
            setFills(snap.fills);
            setCurvesByPanel(snap.curvesByPanel);
            // двигаем индекс логов тоже
            setLogByPreset(pl => {
                const l = pl[pid];
                if (!l) return pl;
                return { ...pl, [pid]: { ...l, idx: Math.max(0, l.idx - 1) } };
            });
            return { ...prev, [pid]: { ...h, idx } };
        });
    }, [pid, setFills, setCurvesByPanel]);

    const historyRedo = useCallback(() => {
        setHistByPreset(prev => {
            const h = prev[pid];
            if (!h || h.idx >= h.stack.length - 1) return prev;
            const idx = h.idx + 1;
            const snap = h.stack[idx];
            setFills(snap.fills);
            setCurvesByPanel(snap.curvesByPanel);
            setLogByPreset(pl => {
                const l = pl[pid];
                if (!l) return pl;
                return { ...pl, [pid]: { ...l, idx: Math.min(l.logs.length - 1, l.idx + 1) } };
            });
            return { ...prev, [pid]: { ...h, idx } };
        });
    }, [pid, setFills, setCurvesByPanel]);

    // Обёртки: вычисляем nextState, коммитим, затем применяем
    const applyFillChange = useCallback((updater, label = "Заливка") => {
        const nextFills = typeof updater === "function" ? updater(fills) : updater;
        const nextSnap = { fills: JSON.parse(JSON.stringify(nextFills)), curvesByPanel: snapNow().curvesByPanel };
        commitState(nextSnap, label);
        setFills(nextFills);
    }, [fills, setFills, snapNow, commitState]);

    const applyCurvesChange = useCallback((updater, label = "Линии") => {
        const nextCurves = typeof updater === "function" ? updater(curvesByPanel) : updater;
        const nextSnap = { fills: snapNow().fills, curvesByPanel: JSON.parse(JSON.stringify(nextCurves)) };
        commitState(nextSnap, label);
        setCurvesByPanel(nextCurves);
    }, [curvesByPanel, setCurvesByPanel, snapNow, commitState]);

    // Публичные данные для UI-ленты
    const hist = histByPreset[pid] || { stack: [], idx: -1 };
    const log = logByPreset[pid] || { logs: [], idx: -1 };
    const historyItems = log.logs;    // [{label, at}]
    const historyIndex = log.idx;     // текущий шаг (соотносится со стеком)

    return {
        // управление
        historyUndo, historyRedo, canUndo, canRedo,
        // применение изменений с лейблами
        applyFillChange, applyCurvesChange,
        // лог без изменений (для вариантов)
        pushHistory,
        // данные для ленты
        historyItems, historyIndex,
    };
}
