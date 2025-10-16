import React from "react";
import styles from "../styles/CostumeEditor.module.css";
import { getVariantsForSlot, getBasePreview, baseHasSlot, isForcedSlot } from "../../../core/variables/variants.js";
import { EMPTY_PREVIEW, SVG_BASE } from "../../../core/variables/svgPath.js"

export default function VariantsGrid({ slot, face, value, onChange }) {
    const [items, setItems] = React.useState([]);
    const abs = (p) => (p ? (p.startsWith("/") ? p : `/${p}`) : null);
    // product-aware fallbacks
    // product + face aware fallbacks (всегда *_preview.svg)
    const fallbackPreview = (product, pure, face) =>
        `${product}/${face}/${pure}_preview.svg`;
    const parseSlot = (s) => {
        const parts = String(s || "").split(".");
        return parts.length >= 2 ? { product: parts[0], pure: parts.slice(1).join(".") } : { product: null, pure: s };
    };

    React.useEffect(() => {
        let alive = true;
        (async () => {

            const { product, pure } = parseSlot(slot);
            const prod = product || "hoodie"; // один раз вычислили дефолт продукта
            const raw = await getVariantsForSlot(slot);
            const withPreviews = await Promise.all(raw.map(async (v) => {
                let preview = v?.preview || null;
                let name = v?.name;
                if (v?.id === "base") {
                    // Сначала — «правильная» превью из манифеста для текущей стороны:
                    preview = (await getBasePreview(slot, face)) || preview;
                }
                // Если всё ещё нет — стандартный фоллбэк.
                if (!preview) {
                    if (v?.id === "base") {
                        const hasBase = await baseHasSlot(face, slot);     // ← поддерживает неймспейс
                        const forced = isForcedSlot(face, slot);           // ← из него берётся pure внутри
                        if (hasBase) {
                            // уже есть prod и pure — используем их
                            preview = `${SVG_BASE}/${fallbackPreview(prod, pure, face)}`;
                        }
                        else if (forced) {
                            // базового слота нет, но слот должен отображаться → “Отсутствует”
                            preview = EMPTY_PREVIEW;
                            name = "Отсутствует";
                        }
                        else {
                            preview = null;
                        }
                    }
                    else {
                        const map = (v?.files && v.files[face]) || {};
                        const cand = map.right || map.file || map.left || Object.values(map)[0] || null;
                        preview = cand || null;
                    }
                }
                return { ...v, name: name || v?.name, preview: abs(preview) };
            }));

            if (alive) setItems(withPreviews);

        })();
        return () => { alive = false; };
    }, [face, slot]);

    // Если синхронизация проставила value с другой стороны,
    // а на текущей стороне у этого варианта нет файлов — он не попадёт в items.
    const unavailableSelected =
        !!value && value !== "base" && !new Set(items.map(it => it.id)).has(value);

    return (
        <div className={styles.pickerGrid}>
            {unavailableSelected && (
                <div
                    className={styles.noteUnavailable}
                    title="Этот вариант выбран на другой стороне, но здесь файлов нет"
                    style={{
                        gridColumn: "1 / -1",
                        fontSize: "12px",
                        lineHeight: 1.3,
                        padding: "6px 8px",
                        border: "1px dashed #999",
                        borderRadius: "8px",
                        opacity: 0.8,
                        marginBottom: "6px"
                    }}
                >
                    Недоступно на этой стороне — выбран вариант на другой стороне.
                    Выберите «Базовая», чтобы отключить здесь, или другой доступный вариант.
                </div>
            )}
            {items.map(it => (
                <button
                    key={it.id}
                    type="button"
                    className={`${styles.pickerBtn} ${value === it.id ? styles.pickerBtnActive : ""}`}
                    onClick={() => onChange(it.id)}
                    title={it.name || it.id}
                >
                    {it.preview ? (
                        <img
                            className={styles.pickerImg}
                            alt={it.name || it.id}
                            src={it.preview}
                            onError={(e) => { e.currentTarget.style.opacity = 0; }}
                        />
                    ) : (
                        <div className={styles.pickerImg} style={{ opacity: 0 }} />
                    )}
                    <span className={styles.pickerCaption}>{it.name || it.id}</span>
                </button>
            ))}
        </div>
    );
}