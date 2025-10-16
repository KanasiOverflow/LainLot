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

// База содержит ли слот (поддерживает неймспейсный слот "hoodie.cuff")
export async function baseHasSlot(face, slot) {
    const m = await loadSvgManifest();
    const list = m?.base?.[face] || [];
    const parts = String(slot || "").split(".");
    const product = parts.length > 1 ? parts[0] : null;
    const pure = parts.length > 1 ? parts.slice(1).join(".") : parts[0];
    return list.some(e => e?.slot === pure && (!product || e?.product === product));
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

// Варианты для слота (поддерживает неймспейс "hoodie.cuff" | "pants.cuff")
export async function getVariantsForSlot(slot) {
    const m = await loadSvgManifest();

    const baseV = m.baseVariantBySlot?.[slot]
        ? [m.baseVariantBySlot[slot]]
        : [{ id: "base", name: "Базовая", preview: null, files: { front: {}, back: {} } }];

    const parts = String(slot || "").split(".");
    const product = parts.length > 1 ? parts[0] : null;

    // берём список по "чистому" имени
    const s = (String(slot || "").split(".").pop() || "").toLowerCase();
    const canon = (SLOT_ALIASES[s] || s);
    let list = m?.variants?.[canon] || m?.variants?.[`${canon}s`] || m?.variants?.[s] || [];

    if (product) list = list.filter(v => (v?.product || null) === product);

    // фильтр по активной стороне (если сохранена в localStorage)
    let face = null;
    try { face = (localStorage.getItem("ce.activeFace") || "").toLowerCase(); } catch { }
    if (face === "front" || face === "back") {
        list = list.filter(v => {
            const map = v?.files?.[face] || {};
            return !!(map.file || map.left || map.right || map.inner);
        });
    }

    // uniq по id
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

// База (глубокая копия + дефолт product = "hoodie", если не указан)
export async function getBaseSources(face) {
    const m = await loadSvgManifest();
    const f = (face === 'back') ? 'back' : 'front';
    const src = m.base?.[f] || [];
    return src.map(e => ({
        file: e.file,
        slot: e.slot ?? null,
        side: e.side ?? null,
        which: e.which ?? null,
        offset: e.offset ?? { x: 0, y: 0 },
        scale: e.scale ?? { x: 1, y: 1 },
        product: e.product ?? "hoodie",
    }));
}

// Превью базы: сначала ищем ключ с неймспейсом, затем — по чистому имени
export async function getBasePreview(slot, face) {
    const m = await loadSvgManifest();
    const f = (face === 'back') ? 'back' : 'front';
    const nsKey = String(slot || "");
    const pure = nsKey.split(".").pop();
    return m?.base?.previews?.[f]?.[nsKey] || m?.base?.previews?.[f]?.[pure] || null;
}

// Слот доступен на стороне?
export async function hasSlotForFace(slot, face) {
    const m = await loadSvgManifest();
    const arr = (m?.base && m.base[face]) || [];
    const ns = String(slot || "");
    const pure = ns.split(".").pop();
    const product = ns.includes(".") ? ns.split(".")[0] : null;

    const hasBase = arr.some(x => x.slot === pure && (!product || x.product === product));
    const hasBackPreview = !!(m?.base?.previews?.[face]?.[ns] || m?.base?.previews?.[face]?.[pure]);
    const hasAnyVariantFiles =
        (m?.variants?.[pure] || []).some(v => {
            if (product && (v?.product || "hoodie") !== product) return false;
            const side = v?.files?.[face] || {};
            return !!(side.file || side.left || side.right || side.inner);
        });
    return hasBase || hasBackPreview || hasAnyVariantFiles;
}

// 🔹 Какие слоты показывать в меню на этой стороне.
// ВОЗВРАЩАЕМ **НЕЙМСПЕЙСНЫЕ** ключи: "hoodie.cuff", "pants.cuff", ...
export async function getVisibleSlotsForFace(face) {
    const m = await loadSvgManifest();
    const f = face === 'back' ? 'back' : 'front';

    // Базовый минимум, который показываем всегда
    const MIN_SECTIONS = {
        hoodie: ["body", "sleeve", "cuff", "belt", "hood", "pocket", "neck"],
        pants: ["leg", "belt", "cuff"]
    };

    const result = new Set();

    // 1) Минимальные секции
    for (const [product, slots] of Object.entries(MIN_SECTIONS)) {
        for (const pure of slots) result.add(`${product}.${pure}`);
    }

    // 2) База (если в manifest.base задан product/slоt)
    for (const e of (m?.base?.[f] || [])) {
        if (e?.slot) result.add(`${e.product || "hoodie"}.${e.slot}`);
    }

    // 3) Превью базы (ключ может быть с/без префикса → нормализуем)
    Object.keys(m?.base?.previews?.[f] || {}).forEach((k) => {
        const pure = String(k || "").split(".").pop();
        const product = k.includes(".") ? k.split(".")[0] : "hoodie";
        if (pure) result.add(`${product}.${pure}`);
    });

    // 4) Варианты, у которых есть файлы на этой стороне
    for (const [slot, list] of Object.entries(m?.variants || {})) {
        for (const v of (list || [])) {
            const map = v?.files?.[f] || {};
            if (map.file || map.left || map.right || map.inner) {
                result.add(`${v?.product || "hoodie"}.${slot}`);
            }
        }
    }

    // 5) Форс-слоты только для худи (hood/pocket по сторонам)
    for (const s of FORCED_SLOTS[f]) result.add(`hoodie.${s}`);

    return Array.from(result);
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