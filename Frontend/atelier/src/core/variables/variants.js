import { MANIFEST_URL } from "./svgPath";

// Runtime-обёртка над manifest.json
let _manifestCache = null;

const FORCED_SLOTS = {
    front: new Set(["hood", "pocket"]),
    back: new Set(["hood"]),
};

// алиасы имён слотов (на случай разных названий в манифесте)
const SLOT_ALIASES = {
    cuff: "cuff",
    sleeve: "sleeve",
    neck: "neck",
    belt: "belt",
    body: "body",
    hood: "hood",
    pocket: "pocket"
};

export function isForcedSlot(face, slot) {
    const f = face === "back" ? "back" : "front";
    return FORCED_SLOTS[f].has(slot);
}

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

export async function baseHasSlot(face, slot) {
    const m = await loadSvgManifest();
    const list = m?.base?.[face] || [];
    return list.some(e => e?.slot === slot);
}

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

// Вернуть путь превью базового слота для заданной стороны
export async function getBasePreview(slot, face /* 'front' | 'back' */) {
    const m = await loadSvgManifest();
    const f = (face === 'back') ? 'back' : 'front';
    return m?.base?.previews?.[f]?.[slot] || null;
}

export async function hasSlotForFace(slot, face) {
    const m = await loadSvgManifest();
    const arr = (m?.base && m.base[face]) || [];
    const hasBase = arr.some(x => x.slot === slot);
    const hasBackPreview = !!m?.base?.previews?.[face]?.[slot];
    const hasAnyVariantFiles =
        (m?.variants?.[slot] || []).some(v => {
            const side = v?.files?.[face] || {};
            return !!(side.file || side.left || side.right || side.inner);
        });
    return hasBase || hasBackPreview || hasAnyVariantFiles;
}

// 🔹 Универсально: какие детали вообще существуют на этой стороне (front/back)
export async function getVisibleSlotsForFace(face /* 'front' | 'back' */) {
    const m = await loadSvgManifest();
    const f = face === 'back' ? 'back' : 'front';
    const set = new Set();

    // базовые SVG для стороны
    for (const e of (m?.base?.[f] || [])) {
        if (e?.slot) set.add(e.slot);
    }
    // базовые превью для стороны
    Object.keys(m?.base?.previews?.[f] || {}).forEach(s => set.add(s));
    // варианты, у которых есть файлы на стороне
    for (const [slot, list] of Object.entries(m?.variants || {})) {
        const ok = (list || []).some(v => {
            const map = v?.files?.[f] || {};
            return !!(map.file || map.left || map.right || map.inner);
        });
        if (ok) set.add(slot);
    }

    // Всегда добавляем форс-слоты (капюшон обе стороны, карман — только перед)
    for (const s of FORCED_SLOTS[f])
        set.add(s);

    return Array.from(set);
}