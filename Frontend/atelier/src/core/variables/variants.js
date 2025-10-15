import { MANIFEST_URL } from "./svgPath";

// Runtime-обёртка над manifest.json
let _manifestCache = null;

const FORCED_SLOTS = {
    front: new Set(["hood", "pocket"]),
    back: new Set(["hood"]),
};

// какие слоты синхронизируем между передом/спинкой
const shouldSyncSlot = (slot) => slot && slot.toLowerCase() !== "pocket";

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

// Базовые источники (все файлы из front/back, без подпапок)
export async function getBaseSources(face /* 'front'|'back' */) {
    const m = await loadSvgManifest();           // ← берём манифест
    const f = (face === 'back') ? 'back' : 'front';
    const src = m.base?.[f] || [];
    // ВАЖНО: возвращаем ГЛУБОКУЮ копию объектов, чтобы не мутировать m.base[*]
    return src.map(e => ({
        file: e.file,
        slot: e.slot ?? null,
        side: e.side ?? null,
        which: e.which ?? null
    }));
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
    // базовые превью для стороныа
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

export function reduceSetSlotVariant(
    prev,                                  // текущее details {front:{}, back:{}}
    { face, slot, variantId, prevNeckByFace }
) {
    const other = face === "front" ? "back" : "front";
    const curFace = { ...(prev[face] || {}) };
    const curOther = { ...(prev[other] || {}) };
    const nextPrevNeck = { ...(prevNeckByFace || {}) };

    const hoodIsTurningOn = slot === "hood" && variantId && variantId !== "base";
    const hoodIsTurningOff = slot === "hood" && (variantId === "base" || variantId == null);
    const neckIsChanging = slot === "neck";

    // Если меняют шею, а капюшон включён — отключаем капюшон
    if (neckIsChanging) {
        const hoodActive = curFace.hood && curFace.hood !== "base";
        if (hoodActive) delete curFace.hood;
    }

    // Включение капюшона: запомним текущее значение шеи и временно уберём её
    if (hoodIsTurningOn) {
        nextPrevNeck[face] = curFace.neck ?? "base";
        delete curFace.neck;
    }

    // Выключение капюшона: восстановим сохранённую шею
    if (hoodIsTurningOff) {
        const prevNeck = nextPrevNeck[face];
        if (prevNeck) {
            if (prevNeck === "base") delete curFace.neck;
            else curFace.neck = prevNeck;
        }
        nextPrevNeck[face] = null;
    }

    // Применяем текущее изменение слота
    if (variantId === "base" || variantId == null) {
        delete curFace[slot];
        if (shouldSyncSlot(slot)) delete curOther[slot];
    } else {
        curFace[slot] = variantId;
        if (shouldSyncSlot(slot)) curOther[slot] = variantId;
    }

    // Если меняли шею — перезаписываем «память шеи»
    if (neckIsChanging) {
        nextPrevNeck[face] = curFace.neck ?? "base";
    }

    const nextDetails = { ...prev, [face]: curFace, [other]: curOther };
    return { nextDetails, nextPrevNeck };
}