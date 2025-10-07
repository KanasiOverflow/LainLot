import { MANIFEST_URL } from "./svgPath";

// Runtime-обёртка над manifest.json
let _manifestCache = null;

export async function loadSvgManifest() {
    if (_manifestCache) return _manifestCache;
    const res = await fetch(MANIFEST_URL, { cache: "no-store" });
    if (!res.ok) {
        throw new Error(`Manifest not found at ${MANIFEST_URL} (status ${res.status})`);
    }
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (!ct.includes("json")) {
        const head = await res.text();
        console.error("Manifest is not JSON. First bytes:", head.slice(0, 80));
        throw new Error("Manifest is not JSON");
    }
    _manifestCache = await res.json();
    return _manifestCache;
}

// Список вариантов для слота (база всегда первая)
export async function getVariantsForSlot(slot) {
    const m = await loadSvgManifest();
    const baseV = m.baseVariantBySlot?.[slot]
        ? [m.baseVariantBySlot[slot]]
        : [{ id: "base", name: "Базовая", preview: null, files: { front: {}, back: {} } }];

    // поддержим альтернативные имена ключей в манифесте
    const vmap = m.variants || {};
    const list =
        vmap[slot] ||
        vmap[`${slot}s`] ||        // cuff -> cuffs
        [];

    // на всякий случай отфильтруем дубли по id
    const seen = new Set();
    const out = [...baseV, ...list].filter(v => {
        if (!v || !v.id) return false;
        if (seen.has(v.id)) return false;
        seen.add(v.id);
        return true;
    });
    return out;
}

// Базовые источники (все файлы из Front/Back, без подпапок)
export async function getBaseSources(face /* 'front'|'back' */) {
    const m = await loadSvgManifest();
    return (m.base?.[face] || []).slice(); // [{file, slot, side?, which?}]
}