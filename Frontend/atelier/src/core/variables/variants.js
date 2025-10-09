import { MANIFEST_URL } from "./svgPath";

// Runtime-обёртка над manifest.json
let _manifestCache = null;

export async function loadSvgManifest() {
    if (_manifestCache) return _manifestCache;
    const res = await fetch(MANIFEST_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`Manifest not found at ${MANIFEST_URL} (status ${res.status})`);
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (!ct.includes("json")) {
        const head = await res.text();
        console.error("Manifest is not JSON. First bytes:", head.slice(0, 80));
        throw new Error("Manifest is not JSON");
    }
    _manifestCache = await res.json();
    return _manifestCache;
}

// алиасы имён слотов (на случай разных названий в манифесте)
const SLOT_ALIASES = {
    cuff: "cuff",
    sleeve: "sleeve",
    neck: "neck",
    belt: "belt",
    body: "body"
};

function resolveVariantList(manifest, slot) {
    const s = (slot || "").toLowerCase();
    const canon = SLOT_ALIASES[s] || s;
    const dict = manifest?.variants || {};
    // пробуем несколько ключей
    return (
        dict[canon] ||
        dict[`${canon}s`] ||
        dict[s] ||
        []
    );
}

// Список вариантов для слота (база всегда первая)
export async function getVariantsForSlot(slot) {
    const m = await loadSvgManifest();
    const baseV = m.baseVariantBySlot?.[slot]
        ? [m.baseVariantBySlot[slot]]
        : [{ id: "base", name: "Базовая", preview: null, files: { front: {}, back: {} } }];
    let list = resolveVariantList(m, slot);

    // Фильтр по активной стороне (front/back) — берём только те варианты,
    // у которых реально есть файлы для текущей стороны.
    let face = null;
    try { face = (localStorage.getItem("ce.activeFace") || "").toLowerCase(); } catch { }
    if (face === "front" || face === "back") {
        list = list.filter(v => {
            if (!v || !v.files) return false;
            const map = v.files[face] || {};
            // Есть хотя бы один файл (left/right/any)
            return Object.keys(map).length > 0;
        });
    }

    // убрать дубли по id, если внезапно пришли из нескольких мест
    const seen = new Set();
    const uniq = [];
    for (const v of list) {
        if (v && v.id && !seen.has(v.id)) {
            seen.add(v.id);
            uniq.push(v);
        }
    }
    return [...baseV, ...uniq];
}

// Базовые источники (все файлы из Front/Back, без подпапок)
export async function getBaseSources(face /* 'front'|'back' */) {
    const m = await loadSvgManifest();
    return (m.base?.[face] || []).slice(); // [{file, slot, side?, which?}]
}