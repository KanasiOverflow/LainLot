import fs from "fs/promises";
import path from "path";

// ДОБАВЬ рядом с импортами
const IMG_EXT_RE = /\.(svg|png|jpe?g)$/i;

const ROOT = process.cwd();
// найдём реальную папку (hoodie/Hoodie), но URL всегда запишем в lower-case
async function firstExisting(...candidates) {
    for (const p of candidates) {
        try { await fs.access(p); return p; } catch { }
    }
    return candidates[0];
}
const HOODIE = await firstExisting(
    path.join(ROOT, "public/2d/svg/hoodie"),
    path.join(ROOT, "public/2d/svg/Hoodie"),
);

const FRONT_DIR = await firstExisting(
    path.join(HOODIE, "front"),
    path.join(HOODIE, "Front"),
);

const BACK_DIR = await firstExisting(
    path.join(HOODIE, "back"),
    path.join(HOODIE, "Back"),
);

const VAR_DIR = await firstExisting(
    path.join(HOODIE, "variants"),
    path.join(HOODIE, "Variants"),
);

const SLOT_ORDER = ["body", "belt", "sleeve", "cuff", "neck"]; // для сортировки вывода

function toUnix(p) { return p.split(path.sep).join("/"); }
function urlOf(absPath) {
    // берём часть пути после /public и приводим к нижнему регистру
    return toUnix(absPath).split("/public").pop().replace(/^\/+/, "").toLowerCase();
}

function detectBaseFileMeta(filename) {
    const f = filename.toLowerCase();
    const meta = { slot: null, side: null, which: null };
    if (f.includes("cuff")) meta.slot = "cuff";
    else if (f.includes("sleeve")) meta.slot = "sleeve";
    else if (f.includes("belt")) meta.slot = "belt";
    else if (f.includes("neck")) meta.slot = "neck";
    else if (f.includes("body")) meta.slot = "body";
    if (f.includes("left")) meta.side = "left";
    if (f.includes("right")) meta.side = "right";
    if (f.includes("internal")) meta.which = "inner";
    if (!meta.slot) return null;
    return meta;
}

async function readFlatSvgs(dir) {
    const all = await fs.readdir(dir, { withFileTypes: true });
    return all.filter(d => d.isFile() && d.name.endsWith(".svg"));
}

async function buildBase() {
    const base = { front: [], back: [], previews: { front: {}, back: {} } };

    for (const [faceDir, faceKey] of [[FRONT_DIR, "front"], [BACK_DIR, "back"]]) {
        const entries = await fs.readdir(faceDir, { withFileTypes: true });

        for (const d of entries) {
            if (!d.isFile()) continue;
            const lower = d.name.toLowerCase();
            const abs = path.join(faceDir, d.name);

            // 4.1 базовые превью: *_preview.(svg|png|jpg)
            if (/_preview\.(svg|png|jpe?g)$/.test(lower)) {
                const name = lower.replace(/_preview\.(svg|png|jpe?g)$/, "");
                // определяем слот (belt/body/sleeve/cuff/neck)
                const slot = SLOT_ORDER.find(s => name === s) || SLOT_ORDER.find(s => name.includes(s));
                if (slot && !base.previews[faceKey][slot]) {
                    base.previews[faceKey][slot] = urlOf(abs);
                }
                continue;
            }

            // 4.2 базовые детали одежды: только .svg
            if (lower.endsWith(".svg")) {
                const meta = detectBaseFileMeta(d.name);
                if (!meta) continue;
                base[faceKey].push({ file: urlOf(abs), ...meta });
            }
        }
    }
    return base;
}

// Разбор имени варианта: поддерживает
// - префиксы front_/back_ (или определяем face из структуры каталогов)
// - cuff/sleeve с _left/_right и необязательным суффиксом числа (cuff_left2.svg)
// - neck_internal.svg -> which = "inner"
// - *_preview.svg — отдельная превьюшка варианта
function parseVariantName(file, slot, faceHint = null) {
    const name = path.basename(file).toLowerCase().replace(IMG_EXT_RE, "");
    const isPreview = name.endsWith("_preview");
    if (isPreview) {
        return { preview: true, id: name.replace(/_preview$/, "") };
    }

    let face = null, side = null, which = null, id = null;

    if (name.startsWith("front_")) face = "front";
    if (name.startsWith("back_")) face = "back";
    if (!face) face = faceHint; // если префикса нет — берём из каталога

    const rest = name.replace(/^(front_|back_)/, "");

    if (slot === "cuff" || slot === "sleeve") {
        // match: "<base>_(left|right)<suffix?>"
        const m = rest.match(/^(.*?)(?:_(left|right))(.*)$/);
        side = m?.[2] || (rest.endsWith("_left") ? "left" : rest.endsWith("_right") ? "right" : null);
        // id: base + возможный числовой суффикс после стороны (cuff_left2 -> cuff2)
        id = m ? (m[1] + (m[3] || "")) : rest.replace(/_(left|right)$/, "");
    } else if (slot === "neck") {
        which = rest.endsWith("_internal") ? "inner" : null;
        id = rest.replace(/_internal$/, "");
    } else {
        id = rest;
    }

    return { face, side, which, id, preview: false };
}


// Собирает варианты из трёх возможных мест:
// 1) /hoodie/variants/<slot>/...
// 2) /hoodie/front/variants/<slot>/...
// 3) /hoodie/back/variants/<slot>/...
// Все URL нормализуются в lower-case через urlOf().
async function buildVariants() {
    const bySlot = Object.fromEntries(SLOT_ORDER.map(s => [s, []]));

    const variantRoots = [
        VAR_DIR,                              // /hoodie/variants
        path.join(FRONT_DIR, "variants"),     // /hoodie/front/variants
        path.join(BACK_DIR, "variants"),     // /hoodie/back/variants
    ];

    for (const slot of SLOT_ORDER) {
        const files = [];

        for (const root of variantRoots) {
            try {
                const dir = path.join(root, slot);
                const list = (await fs.readdir(dir, { withFileTypes: true }))
                    .filter(d => d.isFile() && IMG_EXT_RE.test(d.name.toLowerCase()))
                    .map(d => ({
                        name: d.name,
                        abs: path.join(dir, d.name),
                        faceHint:
                            root.includes(`${path.sep}front${path.sep}`) || root.endsWith(`${path.sep}front`)
                                ? "front"
                                : (root.includes(`${path.sep}back${path.sep}`) || root.endsWith(`${path.sep}back`)
                                    ? "back"
                                    : null),
                    }));
                files.push(...list);
            } catch { /* каталога может не быть — это нормально */ }
        }

        // группируем по id варианта
        const groups = new Map();
        for (const f of files) {
            const meta = parseVariantName(f.name, slot, f.faceHint);
            const id = meta.id;
            if (!id) continue;

            if (!groups.has(id)) {
                groups.set(id, {
                    id,
                    name: id,
                    preview: null,
                    files: { front: {}, back: {} },
                });
            }
            const g = groups.get(id);

            if (meta.preview) {
                g.preview = urlOf(f.abs);
            } else if (meta.face === "front") {
                if (slot === "cuff" || slot === "sleeve") {
                    if (meta.side) g.files.front[meta.side] = urlOf(f.abs);
                } else if (slot === "neck" && meta.which === "inner") {
                    g.files.front.inner = urlOf(f.abs);
                } else {
                    g.files.front.file = urlOf(f.abs);
                }
            } else if (meta.face === "back") {
                if (slot === "cuff" || slot === "sleeve") {
                    if (meta.side) g.files.back[meta.side] = urlOf(f.abs);
                } else {
                    g.files.back.file = urlOf(f.abs);
                }
            }
        }

        bySlot[slot] = [...groups.values()].sort((a, b) => a.id.localeCompare(b.id));
    }

    return bySlot;
}

(async () => {
    const base = await buildBase();
    const variants = await buildVariants();

    // базовые «виртуальные» варианты — всегда первые
    const baseVariantBySlot = {};
    for (const slot of SLOT_ORDER) {
        baseVariantBySlot[slot] = {
            id: "base",
            name: "Базовая",
            preview: base.previews.front[slot] || base.previews.back[slot] || null,
            files: { front: {}, back: {} } // пусто — будем брать реальные базы
        };
    }

    const manifest = {
        version: 1,
        base,             // front/back sources (каждый — массив {file, slot, side?, which?})
        variants,         // варианты из папок
        baseVariantBySlot // виртуальные «base»
    };

    const out = path.join(HOODIE, "manifest.json");
    await fs.writeFile(out, JSON.stringify(manifest, null, 2), "utf8");
    console.log("✅ manifest written:", toUnix(out));
})().catch(e => { console.error(e); process.exit(1); });