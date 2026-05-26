/**
 * Cultural-voice reading per engine.
 *
 * Phase 1 stub: returns the engine's existing `reading` field unchanged.
 * Phase 5 will replace these with authentic-tradition prose for each engine.
 *
 * @param {string} engineKey  e.g. 'bazi', 'iching', 'aztec', ...
 * @param {object} engineResult  the result object returned by that engine's analyze()
 * @returns {string} prose to render in the Scene's "Cultural" pane
 */
function culturalReading(engineKey, engineResult) {
    if (engineResult && typeof engineResult.reading === 'string' && engineResult.reading.length > 0) {
        return engineResult.reading;
    }
    return `No cultural reading available for ${engineKey} yet.`;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { culturalReading };
}
