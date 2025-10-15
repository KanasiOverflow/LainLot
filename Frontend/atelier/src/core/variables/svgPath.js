// Путь к SVG из public, без абсолютных доменов:
export const SVG_BASE = `/2d/svg/hoodie`;
export const MANIFEST_URL = `${SVG_BASE}/manifest.json`;
export const EMPTY_PREVIEW = `${SVG_BASE}/empty.svg`;

// рядом с loadPresetToPanels
export const resolveSvgSrcPath = (p) => {
    if (!p) return "";
    const clean = p.replace(/^\/+/, "");                 // убрали ведущие слэши
    // если уже начинается с "2d/" — значит путь от корня public, берём его как есть
    if (clean.startsWith("2d/")) return `/${clean}`;
    // иначе это относительный путь (типа "Front/xxx.svg") — достраиваем от SVG_BASE
    return `${SVG_BASE}/${clean}`;
};