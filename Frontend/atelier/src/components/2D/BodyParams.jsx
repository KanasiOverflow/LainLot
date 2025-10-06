import { useId, useState } from "react";
import clsx from "clsx";
import styles from "./CostumeEditor.module.css";

const DEF = {
    hoodie: { chest: "", waist: "", hips: "", height: "", sleeve: "", back: "" },
    pants: { waist: "", hips: "", outseam: "", inseam: "", thigh: "", ankle: "" }
};

export default function BodyParams({ value, onChange }) {

    const [tab, setTab] = useState("hoodie");
    const form = value || DEF;
    const num = (v) => (v === "" ? "" : v.replace(",", ".").replace(/[^\d.]/g, ""));
    const set = (sect, key, v) => onChange?.({ ...form, [sect]: { ...form[sect], [key]: num(v) } });

    const Input = ({ sect, name, label }) => {
        const id = useId();
        return (
            <label htmlFor={id} className={styles.formLabel}>
                {label} <span className={styles.formUnit}>см</span>
                <input
                    id={id}
                    inputMode="decimal"
                    className={styles.input}
                    placeholder="—"
                    value={form[sect][name]}
                    onChange={(e) => set(sect, name, e.target.value)}
                />
            </label>
        );
    };

    return (
        <div className={styles.section}>
            <div className={styles.sectionTitle}>Параметры тела</div>

            <div className={clsx(styles.segmented, styles.tabs2, styles.mb8)}>
                <button
                    className={clsx(styles.segBtn, tab === "hoodie" && styles.segActive)}
                    onClick={() => setTab("hoodie")}
                >
                    Худи
                </button>
                <button
                    className={clsx(styles.segBtn, tab === "pants" && styles.segActive)}
                    onClick={() => setTab("pants")}
                >
                    Штаны
                </button>
            </div>

            {tab === "hoodie" ? (
                <div className={styles.grid2}>
                    <Input sect="hoodie" name="chest" label="Грудь" />
                    <Input sect="hoodie" name="waist" label="Талия" />
                    <Input sect="hoodie" name="hips" label="Бёдра" />
                    <Input sect="hoodie" name="height" label="Рост" />
                    <Input sect="hoodie" name="sleeve" label="Рукав (длина)" />
                    <Input sect="hoodie" name="back" label="Спинка (длина)" />
                </div>
            ) : (
                <div className={styles.grid2}>
                    <Input sect="pants" name="waist" label="Талия" />
                    <Input sect="pants" name="hips" label="Бёдра" />
                    <Input sect="pants" name="outseam" label="Длина по боку" />
                    <Input sect="pants" name="inseam" label="Длина по шагу" />
                    <Input sect="pants" name="thigh" label="Бедро (обхват)" />
                    <Input sect="pants" name="ankle" label="Низ брючины" />
                </div>
            )}
        </div>
    );
}