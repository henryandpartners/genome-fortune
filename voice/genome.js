/**
 * Genome-layer reading per engine — the bio-reinterpretation voice.
 *
 * Phase 1 stub: returns a deterministic, engine-flavored placeholder line.
 * Phase 5 will replace these with full procedural prose seeded from the
 * engine result + the user's Genome Lab pattern bias.
 *
 * @param {string} engineKey  e.g. 'bazi', 'iching', 'aztec', ...
 * @param {object} engineResult  the result object returned by that engine's analyze()
 * @returns {string} prose to render in the Scene's "Genome Layer" pane
 */
function genomeReading(engineKey, engineResult) {
    const flavor = {
        bazi:           'Your Bazi pillars register as four transcription factor bindings — primary expression locus identified.',
        iching:         'The hexagram resolves to a six-bit regulatory motif — read top-to-bottom as a chromatin state.',
        aztec:          'The Tonalpohualli day-sign maps to a circadian phase tag — your cellular clock is timestamped.',
        vedic:          'The lunar mansion encodes a 27-state methylation pattern — moon-phase modulates the spectrum.',
        western:        'The sun sign is a fixed-element promoter; the moon phase modulates expression intensity.',
        thai:           'The day-deity binds a planetary enhancer element — color, animal, and color-band channel are co-expressed.',
        chineseZodiac:  'The animal sign locks in a year-cycle epigenetic preset — element + yin/yang gate transcription.',
        numerology:     'The life-path number selects a codon-bias table — destiny + soul-urge form a regulatory dyad.',
        palm:           'Detected line strengths register as four developmental signal traces — palm topography reads phenotype.'
    };
    const line = flavor[engineKey] || 'Genome layer not yet calibrated for this engine.';
    // Append a deterministic detail derived from the result so identical inputs map to identical output.
    const hint = engineResult && typeof engineResult.reading === 'string'
        ? ` (signal: ${engineResult.reading.slice(0, 24).replace(/\s+/g, ' ').trim()}…)`
        : '';
    return line + hint;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { genomeReading };
}
