import React from "react";
import styles from "../styles/CostumeEditor.module.css";
import { getVariantsForSlot, getBasePreview, baseHasSlot, isForcedSlot } from "../../../core/variables/variants.js";
import { EMPTY_PREVIEW, SVG_BASE } from "../../../core/variables/svgPath.js"

export default function VariantsGrid({ slot, face, value, onChange }) {
    const [items, setItems] = React.useState([]);
    const abs = (p) => (p ? (p.startsWith("/") ? p : `/${p}`) : null);
    const FALLBACK = {
        cuff: "cuff_right.svg",
        sleeve: "sleeve_right.svg",
        neck: "neck.svg",
        belt: "belt.svg",
        body: "body.svg"
    };

    React.useEffect(() => {
        let alive = true;
        (async () => {

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
                        const hasBase = await baseHasSlot(face, slot);
                        const forced = isForcedSlot(face, slot);
                        if (hasBase) {
                            const dir = face === "front" ? "front" : "back";
                            const fname = FALLBACK[slot] || "body.svg";
                            preview = `${SVG_BASE}/${dir}/${fname}`;
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

    // внутри VariantsGrid.jsx, рядом с unavailableSelected
    const isGhostBase = unavailableSelected;

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