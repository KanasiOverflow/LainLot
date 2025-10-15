import { useEffect, useMemo, useRef, useState } from "react";
import { PRESETS } from "../../core/variables/presets.js";
import { getBaseSources, loadSvgManifest } from "../../core/variables/variants.js";
import { loadPresetToPanels } from "../../core/svg/extractPanels.js";
import { computeRingsByPanel, pickOuterRing } from "../../core/svg/buildFaces.js";

export function useVariantsComposition({ presetIdx, details, savedByPresetRef, applySnapshot }) {
    const [manifest, setManifest] = useState(null);
    const [isLoadingPreset, setIsLoadingPreset] = useState(false);
    const [composedPanels, setComposedPanels] = useState(null);
    const [svgMountKey, setSvgMountKey] = useState(0);
    const [svgCache, setSvgCache] = useState({});
    const [panels, setPanels] = useState([]);
    const svgCacheRef = useRef({});
    const panelSlotMapRef = useRef(new Map());
    const currentPresetIdRef = useRef(PRESETS[0]?.id || "front");
    const changeKindRef = useRef(null);
    const lastChangedSlotRef = useRef(null);
    const restoringPresetRef = useRef(false);
    const detailsRef = useRef(details);

    // manifest
    useEffect(() => {
        (async () => {
            try {
                const m = await loadSvgManifest();
                setManifest(m);
            } catch (e) {
                console.error(e);
                // опционально: показать в UI подсказку
                // toast.error("Не найден manifest.json. Запусти npm run build:svg-manifest");
            }
        })();
    }, []);

    useEffect(() => {
        const prev = detailsRef.current;
        const cur = details;

        // собираем все изменения
        const changes = [];
        for (const face of ['front', 'back']) {
            const p = prev[face] || {}, c = cur[face] || {};
            for (const slot of Object.keys({ ...p, ...c })) {
                if (p[slot] !== c[slot]) {
                    changes.push({ presetId: face, slot });
                }
            }
        }

        if (changes.length) {
            changeKindRef.current = 'slot';
            // приоритет — для текущей активной стороны (чтобы чистились заливки/линии именно там)
            const curFace = currentPresetIdRef.current;
            const preferred = changes.find(ch => ch.presetId === curFace) || changes[0];
            lastChangedSlotRef.current = preferred;
        }

        detailsRef.current = cur;
    }, [details]);

    // build panels for current side
    useEffect(() => {
        if (!manifest) return;        // ⬅️ без манифеста ничего не делаем
        let alive = true;
        (async () => {
            const preset = PRESETS[presetIdx];
            if (!preset) return;
            setIsLoadingPreset(true);

            // ВАЖНО: делаем глубокую копию, чтобы подмены не трогали manifest.base[*]
            let baseSources = await getBaseSources(preset.id);
            baseSources = (Array.isArray(baseSources) ? baseSources : []).map(e => ({
                file: e.file,
                slot: e.slot ?? null,
                side: e.side ?? null,
                which: e.which ?? null
            }));

            // индекс базовых частей по (slot,side,which)
            const keyOf = (s) => [s.slot || "", s.side || "", s.which || ""].join("|");
            const baseIdx = new Map(baseSources.map(s => [keyOf(s), s]));

            // находим, какие слоты у нас вообще выбраны на этой стороне (details[preset.id])
            const chosen = details[preset.id] || {};
            const hoodActive = !!(chosen.hood && chosen.hood !== "base");

            // Если капюшон активен — полностью убираем из базы любые части слота 'neck'
            // (иначе базовая шея будет торчать под капюшоном)
            if (hoodActive) {
                baseSources = baseSources.filter(s => (s.slot || "").toLowerCase() !== "neck");
            }

            // начнём с копии базы
            const sources = baseSources.slice();

            // для каждого выбранного слота подставляем/добавляем файлы из варианта
            for (const [slot, variantId] of Object.entries(chosen)) {
                if (!variantId || variantId === "base") continue; // база: ничего не меняем
                const list = manifest?.variants?.[slot] || [];
                const v = list.find(x => x.id === variantId);
                if (!v) continue;

                const fmap = v.files?.[preset.id] || {}; // files для текущей стороны

                // Если на этой стороне у варианта нет ни одного файла — пропускаем,
                // чтобы не "очищать" базу и не ломать канву
                if (!fmap || Object.keys(fmap).length === 0) {
                    // console.warn(`[variants] empty files for ${slot}/${variantId} on ${preset.id}`);
                    continue;
                }
                // после выбора варианта слота v и нахождения подходящей ветки files для active side:
                const sLower = (slot || "").toLowerCase();
                const allowSides = (sLower === "cuff" || sLower === "sleeve");

                let entries = [];
                if (fmap.file) entries.push({ file: fmap.file, side: null, which: null });
                if (allowSides && fmap.left) entries.push({ file: fmap.left, side: "left", which: null });
                if (allowSides && fmap.right) entries.push({ file: fmap.right, side: "right", which: null });
                if (fmap.inner) entries.push({ file: fmap.inner, side: null, which: "inner" });

                // 3) не создаём новые под-части, которых нет в базе (кроме hood)
                const hasBaseFor = (side, which) => baseIdx.has([slot, side || "", which || ""].join("|"));
                if (sLower !== "hood") {
                    entries = entries.filter(e => hasBaseFor(e.side, e.which));
                }

                for (const e of entries) {
                    const k = [slot, e.side || "", e.which || ""].join("|");
                    const baseHit = baseIdx.get(k);
                    if (baseHit) {
                        // заменяем файл в уже существующем базовом источнике
                        baseHit.file = e.file;
                    } else {
                        // базы нет — добавляем новый кусок
                        sources.push({ file: e.file, slot, side: e.side || null, which: e.which || null });
                    }
                }
            }

            // === ВАЖНО: капюшон поверх всего ===
            // Положим все куски слота 'hood' в конец, чтобы они рисовались последними
            // (и визуально перекрывали остальные детали)
            if (sources.length) {
                const hoodParts = [];
                const rest = [];
                for (const src of sources) {
                    if ((src.slot || "").toLowerCase() === "hood") hoodParts.push(src);
                    else rest.push(src);
                }
                // если хотим ещё и шнурки/подкладку поверх остальных частей капюшона — можно тоньше сортировать
                // но базово достаточно просто положить hoodParts в конец
                sources.length = 0;
                sources.push(...rest, ...hoodParts);
            }

            const compiled = await loadPresetToPanels({ ...preset, sources });
            if (!alive) return;
            setComposedPanels(Array.isArray(compiled) ? compiled : []);
            setSvgCache(prev => ({ ...prev, [preset.id]: Array.isArray(compiled) ? compiled : [] }));
            setSvgMountKey(k => k + 1);

        })().catch(() => {
            if (alive)
                setComposedPanels([]);
        }).finally(() => {
            if (alive)
                setIsLoadingPreset(false);
        });
        return () => { alive = false; };
    }, [presetIdx, manifest, details]);

    useEffect(() => {
        if (!composedPanels) return;

        setPanels(composedPanels);
        const map = new Map();
        for (const p of composedPanels) map.set(p.id, p.meta?.slot || null);
        panelSlotMapRef.current = map;

        const presetId = currentPresetIdRef.current;
        const changed = lastChangedSlotRef.current;

        if (changeKindRef.current === 'preset') {
            const snap = savedByPresetRef.current[presetId];
            applySnapshot(snap, composedPanels);
        } else if (changed) {
            const { presetId: chPreset, slot: chSlot } = changed;
            if (chPreset === presetId && chSlot) {
                // внешняя сторона может очистить fills/curves для затронутого слота, пользуясь panelSlotMapRef
            }
        }
        changeKindRef.current = null;
        lastChangedSlotRef.current = null;

        if (restoringPresetRef.current) setTimeout(() => { restoringPresetRef.current = false; }, 0);
    }, [composedPanels, applySnapshot, savedByPresetRef]);

    // hood geometry for mask
    const hoodPanelIds = useMemo(() => {
        return new Set(
            panels
                .filter(p => String(p.meta?.slot || '').toLowerCase() === 'hood')
                .map(p => p.id)
        );
    }, [panels]);

    const ringsByPanel = useMemo(() => computeRingsByPanel(panels), [panels]);
    const outerRingByPanel = useMemo(() => pickOuterRing(panels, ringsByPanel), [panels, ringsByPanel]);

    const hoodRings = useMemo(() => {
        return panels
            .filter(p => hoodPanelIds.has(p.id))
            .map(p => outerRingByPanel[p.id])
            .filter(Boolean);
    }, [panels, outerRingByPanel, hoodPanelIds]);

    const hoodHoles = useMemo(() => {
        const holes = [];
        for (const p of panels) {
            if (!hoodPanelIds.has(p.id)) continue;
            const rings = ringsByPanel[p.id] || [];
            const outer = outerRingByPanel[p.id];
            for (const r of rings) {
                if (!outer || r !== outer) holes.push(r);
            }
        }
        return holes;
    }, [panels, ringsByPanel, outerRingByPanel, hoodPanelIds]);

    return {
        manifest, setManifest, isLoadingPreset, panels, setPanels,
        svgCacheRef, svgCache, setSvgCache, svgMountKey, hoodPanelIds,
        hoodRings, hoodHoles, panelSlotMapRef, currentPresetIdRef
    };
}