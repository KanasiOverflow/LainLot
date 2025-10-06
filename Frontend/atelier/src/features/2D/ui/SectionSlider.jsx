import { useId } from "react";
import clsx from "clsx";
// используем тот же модуль стилей, чтобы слайдер выглядел как остальные элементы панели
import styles from "./CostumeEditor.module.css";

/**
 * Универсальный ряд со слайдером для правой панели.
 * onChange ожидает число (а не строку).
 */
export default function SectionSlider({
    label,
    value,
    min,
    max,
    step = 1,
    onChange,
    disabled = false,
    suffix = "",
    className,
}) {
    const id = useId();

    return (
        <div className={clsx(styles.subRow, className)} style={{ marginTop: 6 }}>
            <label className={styles.slimLabel} htmlFor={id}>
                {label}
            </label>
            <input
                id={id}
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(+e.target.value)}
                disabled={disabled}
                className={styles.rangeCompact}
            />
            <span className={styles.value}>
                {value}
                {suffix}
            </span>
        </div>
    );
}