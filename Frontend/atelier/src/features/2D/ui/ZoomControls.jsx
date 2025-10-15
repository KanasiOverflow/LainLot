export default function ZoomControls({ onIn, onOut, onReset, zoom = 1, onSet }) {
    const btn = {
        width: 42, height: 42, borderRadius: 9999,
        background: "#fff", border: "1px solid #e5e7eb",
        boxShadow: "0 4px 12px rgba(0,0,0,.08)", fontSize: 22, lineHeight: "42px"
    };
    return (
        <div
            style={{
                position: "absolute", left: "50%", bottom: 88, transform: "translateX(-50%)",
                display: "flex", gap: 12, zIndex: 5, alignItems: "center", background: "rgba(255,255,255,.7)",
                backdropFilter: "blur(4px)", padding: 8, borderRadius: 9999, border: "1px solid #e5e7eb"
            }}
            aria-label="Управление масштабом"
        >
            <button
                type="button"
                style={btn}
                onClick={onOut}
                title="Уменьшить">
                −</button>
            <button
                type="button"
                style={btn}
                onClick={onIn}
                title="Увеличить"
                disabled={(zoom ?? 1) >= 1}
            >+</button>
            <input
                type="range"
                min={50}
                max={100}
                step={1}
                value={Math.round((zoom ?? 1) * 100)}
                onChange={(e) => onSet?.(Number(e.target.value) / 100)}
                style={{ width: 160 }}
                title="Масштаб"
                aria-label="Масштаб"
            />
            <input
                type="number"
                min={50}
                max={100}
                step={1}
                value={Math.round((zoom ?? 1) * 100)}
                onChange={(e) => {
                    const v = Math.max(50, Math.min(100, Number(e.target.value) || 100));
                    onSet?.(v / 100);
                }}
                style={{ width: 64, height: 42, borderRadius: 10, border: "1px solid #e5e7eb", textAlign: "center" }}
            />
            <button type="button" style={{ ...btn, width: 64, fontSize: 14 }} onClick={onReset} title="Сбросить масштаб">Reset</button>
        </div>
    );
}