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
// + leg
const SLOT_ALIASES = {
    cuff: "cuff",
    sleeve: "sleeve",
    neck: "neck",
    belt: "belt",
    body: "body",
    hood: "hood",
    pocket: "pocket",
    leg: "leg",        // <— добавь
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
        which: e.which ?? null,
        offset: e.offset ?? { x: 0, y: 0 },
        scale: e.scale ?? { x: 1, y: 1 },
        // 🔧 КЛЮЧЕВОЕ: если product не указан в манифесте — считаем, что это hoodie
        product: e.product ?? "hoodie",
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
// ВОЗВРАЩАЕМ "чистые" имена слотов (без префикса продукта) — для обратной совместимости канвы.
export async function getVisibleSlotsForFace(face /* 'front' | 'back' */) {
    const m = await loadSvgManifest();
    const f = face === 'back' ? 'back' : 'front';
    const set = new Set();

    // базовые SVG для стороны
    for (const e of (m?.base?.[f] || [])) {
        if (e?.slot) set.add(String(e.slot));
    }
    // базовые превью (могут быть ключи с/без префикса) — берём чистое имя
    Object.keys(m?.base?.previews?.[f] || {}).forEach(s => {
        const pure = String(s || "").split(".").pop();
        if (pure) set.add(pure);
    });
    // варианты, у которых есть файлы на стороне — добавим по чистому имени
    for (const [slot, list] of Object.entries(m?.variants || {})) {
        const ok = (list || []).some(v => {
            const side = v?.files?.[f] || {};
            return !!(side.file || side.left || side.right || side.inner);
        });
        if (ok) set.add(slot);
    }

    // форс-слоты — по чистому имени
    for (const s of FORCED_SLOTS[f]) set.add(s);

    return Array.from(set);
}

export function reduceSetSlotVariant(
    prev,                                  // текущее details {front:{}, back:{}}
    { face, slot, variantId, prevNeckByFace }
) {

    // распарсим product/pure из слота: "hoodie.cuff" -> {product:"hoodie", pure:"cuff"}
    const parts = String(slot || "").split(".");
    const product = parts.length > 1 ? parts[0] : null;
    const pure = parts.length > 1 ? parts.slice(1).join(".") : parts[0];

    const other = face === "front" ? "back" : "front";
    const curFace = { ...(prev[face] || {}) };
    const curOther = { ...(prev[other] || {}) };
    const nextPrevNeck = { ...(prevNeckByFace || {}) };

    const hoodIsTurningOn = product === "hoodie" && pure === "hood" && variantId && variantId !== "base";
    const hoodIsTurningOff = product === "hoodie" && pure === "hood" && (variantId === "base" || variantId == null);
    const neckIsChanging = product === "hoodie" && pure === "neck";

    // 🔧 корректное имя ключа для шеи
    const neckKey = "hoodie.neck";

    // Если меняют шею, а капюшон включён — отключаем капюшон
    if (neckIsChanging) {
        const hoodKey = "hoodie.hood";
        const hoodActive = curFace[hoodKey] && curFace[hoodKey] !== "base";
        if (hoodActive) delete curFace[hoodKey];
    }

    // Включение капюшона: запомним текущее значение шеи и временно уберём её
    if (hoodIsTurningOn) {
        nextPrevNeck[face] = curFace[neckKey] ?? "base";
        delete curFace[neckKey];
    }

    // Выключение капюшона: восстановим сохранённую шею
    if (hoodIsTurningOff) {
        const prevNeck = nextPrevNeck[face];
        if (prevNeck != null) {
            if (prevNeck === "base") delete curFace[neckKey];
            else curFace[neckKey] = prevNeck;
        }
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
        nextPrevNeck[face] = curFace[neckKey] ?? "base";
    }

    const nextDetails = { ...prev, [face]: curFace, [other]: curOther };
    return { nextDetails, nextPrevNeck };
}