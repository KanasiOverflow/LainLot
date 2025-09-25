// src/components/2D/CostumeEditor/utils/editor.js
/** Режимы редактора. */
export const EDITOR_MODES = {
    addLine: "add-line",
    deleteLine: "delete-line",
    fill: "fill",
    eraseFill: "erase-fill",
    preview: "preview",
};

/** Курсор по режиму (для канвы). */
export function cursorForMode(mode) {
    switch (mode) {
        case EDITOR_MODES.addLine: return "crosshair";
        case EDITOR_MODES.deleteLine: return "not-allowed";
        case EDITOR_MODES.fill: return "pointer";
        case EDITOR_MODES.eraseFill: return "pointer";
        case EDITOR_MODES.preview: default: return "default";
    }
}

/** Короткий статус + хоткеи (для будущего StatusBar). */
export function statusForMode(mode) {
    const base = {
        [EDITOR_MODES.addLine]: "Добавить линию — A",
        [EDITOR_MODES.deleteLine]: "Удалить линию — D",
        [EDITOR_MODES.fill]: "Заливка — F",
        [EDITOR_MODES.eraseFill]: "Стереть заливку — X",
        [EDITOR_MODES.preview]: "Просмотр — Esc",
    }[mode] || "Режим — Esc";
    const hotkeys = "Esc • A/D • F/X • Ctrl/Cmd+Z/Y";
    return `${base} | ${hotkeys}`;
}