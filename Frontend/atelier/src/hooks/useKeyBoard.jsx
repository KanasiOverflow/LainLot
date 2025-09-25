// src/components/2D/CostumeEditor/hooks/useKeyboard.js
import { useEffect } from "react";

/**
 * Подписка на клавиатуру.
 * @param {{
 *   onEsc?: ()=>void,
 *   onAddLine?: ()=>void,
 *   onDeleteLine?: ()=>void,
 *   onFill?: ()=>void,
 *   onEraseFill?: ()=>void,
 *   onUndo?: ()=>void,
 *   onRedo?: ()=>void
 * }} handlers
 */
export function useKeyboard(handlers = {}) {
    useEffect(() => {
        function onKey(e) {
            const key = e.key.toLowerCase();
            const ctrl = e.ctrlKey || e.metaKey;

            // Undo / Redo
            if (ctrl && key === "z" && !e.shiftKey) { e.preventDefault(); handlers.onUndo?.(); return; }
            if ((ctrl && key === "y") || (ctrl && e.shiftKey && key === "z")) { e.preventDefault(); handlers.onRedo?.(); return; }

            // режимы / действия
            if (key === "escape") { handlers.onEsc?.(); return; }
            if (key === "a") { handlers.onAddLine?.(); return; }
            if (key === "d") { handlers.onDeleteLine?.(); return; }
            if (key === "f") { handlers.onFill?.(); return; }
            if (key === "x") { handlers.onEraseFill?.(); return; }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [
        handlers.onUndo,
        handlers.onRedo,
        handlers.onEsc,
        handlers.onAddLine,
        handlers.onDeleteLine,
        handlers.onFill,
        handlers.onEraseFill
    ]);
}