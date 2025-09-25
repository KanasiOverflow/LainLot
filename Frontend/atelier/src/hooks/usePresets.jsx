// src/components/2D/CostumeEditor/hooks/usePresets.js
import { useEffect, useMemo, useState } from "react";
import { SVG_BASE, PRESETS } from "../utils/config.js";
import { parseViewBox } from "../utils/svg.js";
import { extractPanels } from "../utils/extractPanels.js";

/**
 * Хук загрузки пресетов SVG.
 * @param {number} presetIdx - индекс в PRESETS
 */
export function usePresets(presetIdx) {
    const [rawSVG, setRawSVG] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [panels, setPanels] = useState([]);

    const preset = PRESETS[Math.max(0, Math.min(PRESETS.length - 1, presetIdx || 0))];

    useEffect(() => {
        let alive = true;
        async function run() {
            if (!preset) return;
            setIsLoading(true); setError(""); setRawSVG(""); setPanels([]);
            try {
                const url = `${SVG_BASE}/${preset.file}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const text = await res.text();
                if (!alive) return;
                setRawSVG(text);
                const panels = extractPanels(text);
                setPanels(panels);
            } catch (e) {
                if (alive) setError(String(e?.message || e));
            } finally {
                if (alive) setIsLoading(false);
            }
        }
        run();
        return () => { alive = false; };
    }, [preset?.file]);

    const viewBox = useMemo(() => (rawSVG ? parseViewBox(rawSVG) : { w: 1, h: 1 }), [rawSVG]);

    return { preset, panels, rawSVG, viewBox, isLoadingPreset: isLoading, presetError: error };
}