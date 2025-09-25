/* ================== настройки ================== */
export const PANEL_MAX_COUNT = 12;
export const PANEL_MIN_AREA_RATIO_DEFAULT = 0.08;

// --- PRESETS: базовая папка с заранее подготовленными SVG
export const SVG_BASE = "/2d/svg";
export const PRESETS = [
    { id: "front", title: "Перед", file: "front_new.svg" },
    { id: "back", title: "Спинка", file: "back_new.svg" },
    // при желании можно добавить: hood, sleeve и т.п.
];

export const KEYWORDS = {
    front: /(^|[^a-z])(front|перед)([^a-z]|$)/i,
    back: /(^|[^a-z])(back|спинка)([^a-z]|$)/i,
    hood: /(^|[^a-z])(hood|капюш)([^a-z]|$)/i,
    sleeve: /(^|[^a-z])(sleeve|рукав)([^a-z]|$)/i,
    pocket: /(^|[^a-z])(pocket|карман)([^a-z]|$)/i,
};