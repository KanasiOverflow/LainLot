import React from "react";
import styles from "./CostumeEditor.module.css";

/** Строка статуса под канвой: использует стили панели. */
export default function StatusBar({ text = "", right = null }) {
    return (
        <div className="panel" style={{ marginTop: 12, padding: 10, display: "flex", justifyContent: "space-between" }}>
            <div>{text}</div>
            <div>{right}</div>
        </div>
    );
}
