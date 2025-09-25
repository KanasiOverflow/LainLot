import React from "react";
import styles from "./CostumeEditor.module.css";

/**
 * Панель редактора под имеющийся CSS.
 */
export default function Sidebar({
    // общее
    presets = [],
    presetIdx = 0,
    onChangePreset = () => { },

    // режимы
    mode,
    onChangeMode = () => { },

    // история и сетка
    canUndo = false,
    canRedo = false,
    onUndo = () => { },
    onRedo = () => { },
    gridEnabled = true,
    onToggleGrid = () => { },

    // заливки
    fillColor = "#3B82F6",
    onChangeFillColor = () => { },
    onFillClick = () => { },
    onEraseFillClick = () => { },
    colors = ["#3B82F6", "#F97316", "#22C55E", "#EF4444", "#A855F7", "#0EA5E9", "#F59E0B", "#111827"],

    // линии
    lineWavy = false,
    onToggleWavy = () => { },
    insetPx = 8,
    onChangeInsetPx = () => { },
}) {
    return (
        <aside className={styles.sidebar}>
            <div className="panel">
                {/* Заголовок */}
                <div className={styles.sectionTitle} style={{ marginBottom: 10, fontWeight: 600 }}>
                    Редактор
                </div>

                {/* Undo/Redo/Grid */}
                <div className="two" style={{ gap: 8, marginBottom: 12 }}>
                    <button className="btn" onClick={onUndo} disabled={!canUndo} title="Отменить (Ctrl/Cmd+Z)">↶ Отменить</button>
                    <button className="btn" onClick={onRedo} disabled={!canRedo} title="Повторить (Ctrl+Y / Cmd+Shift+Z)">↷ Повторить</button>
                    <button className={`btn ${gridEnabled ? "segActive" : ""}`} onClick={onToggleGrid} title="Сетка">□ Сетка</button>
                </div>

                {/* Деталь (переключение пресета «Перед/Спинка») */}
                <div className={styles.section} style={{ marginBottom: 12 }}>
                    <div className={styles.sectionTitle}>Деталь</div>
                    <div className="segmented">
                        {presets.map((p, i) => {
                            const active = i === presetIdx;
                            return (
                                <button
                                    key={p.id || i}
                                    className={`segBtn ${active ? "segActive" : ""}`}
                                    onClick={() => onChangePreset(i)}
                                >
                                    {p.title || p.id || `#${i + 1}`}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Режим */}
                <div className={styles.section} style={{ marginBottom: 12 }}>
                    <div className={styles.sectionTitle}>Режим</div>
                    <div className="segmented">
                        <button
                            className={`segBtn ${mode === "preview" ? "segActive" : ""}`}
                            onClick={() => onChangeMode("preview")}
                            title="Esc"
                        >
                            Просмотр
                        </button>
                        <button
                            className={`segBtn ${mode === "fill" ? "segActive" : ""}`}
                            onClick={() => onChangeMode("fill")}
                            title="F"
                        >
                            Заливка
                        </button>
                        <button
                            className={`segBtn ${mode === "add-line" || mode === "delete-line" ? "segActive" : ""}`}
                            onClick={() => onChangeMode("add-line")}
                            title="A / D"
                        >
                            Линии
                        </button>
                    </div>
                </div>

                {/* Заливка */}
                <div className={styles.section} style={{ display: mode === "fill" ? "block" : "none" }}>
                    <div className={styles.sectionTitle}>Цвет заливки</div>
                    <div className="palette" style={{ marginBottom: 8 }}>
                        {colors.map((c) => (
                            <button
                                key={c}
                                className={`color ${c.toLowerCase() === fillColor.toLowerCase() ? "segActive" : ""}`}
                                style={{ background: c }}
                                onClick={() => onChangeFillColor(c)}
                                title={c}
                            />
                        ))}
                    </div>
                    <div className="two" style={{ gap: 8 }}>
                        <button className="btn" onClick={onFillClick}>🟦 Залить</button>
                        <button className="btn" onClick={onEraseFillClick}>✕ Стереть</button>
                    </div>
                </div>

                {/* Линии */}
                <div className={styles.section} style={{ display: mode === "add-line" || mode === "delete-line" ? "block" : "none" }}>
                    <div className={styles.sectionTitle}>Линия</div>

                    <div className="two" style={{ gap: 8, marginBottom: 8 }}>
                        <span className="btn" title="A — добавить; D — удалить">+ Добавить</span>
                        <span className="btn">🗑 Удалить</span>
                    </div>

                    <div className="segmented" style={{ marginBottom: 10 }}>
                        <button className={`segBtn ${!lineWavy ? "segActive" : ""}`} onClick={() => onToggleWavy(false)}>Прямая</button>
                        <button className={`segBtn ${lineWavy ? "segActive" : ""}`} onClick={() => onToggleWavy(true)}>Волнистая</button>
                    </div>

                    <label style={{ display: "grid", gap: 6 }}>
                        <span style={{ fontSize: 12, opacity: 0.8 }}>Отступ от края</span>
                        <div className="two" style={{ alignItems: "center", gap: 8 }}>
                            <input
                                type="range"
                                min={0}
                                max={20}
                                value={insetPx}
                                onChange={(e) => onChangeInsetPx(Number(e.target.value))}
                                style={{ width: "100%" }}
                            />
                            <span style={{ fontSize: 12 }}>{insetPx}px</span>
                        </div>
                    </label>

                    <p style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                        Используется, когда прямая выходит за деталь: линия ведётся по контуру с этим отступом внутрь.
                    </p>
                </div>
            </div>
        </aside>
    );
}
