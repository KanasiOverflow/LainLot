import React from "react";
import styles from "../styles/CostumeEditor.module.css";
import { getVariantsForSlot } from "../../../core/variables/variants.js";
import { SVG_BASE } from "../../../core/variables/svgPath.js"

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
            const withPreviews = raw.map((v, i) => {
                let preview = v?.preview || null;
                if (!preview) {
                    if (v?.id === "base") {
                        const dir = face === "front" ? "front" : "back";
                        const fname = FALLBACK[slot] || "body.svg";
                        preview = `${SVG_BASE}/${dir}/${fname}`;
                    } else {
                        const map = (v?.files && v.files[face]) || {};
                        const cand = map.right || map.file || map.left || Object.values(map)[0] || null;
                        preview = cand || null;
                    }
                }
                return { ...v, preview: abs(preview) };
            });
            if (alive) setItems(withPreviews);

        })();
        return () => { alive = false; };
    }, [face, slot]);

    return (
        <div className={styles.pickerGrid}>
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