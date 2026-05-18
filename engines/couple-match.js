/**
 * COUPLE GENOME FORTUNE MATCHING
 * Analyzes compatibility between two subjects across all cultural cosmology systems.
 * Computes element resonance, numerology harmony, zodiac synergy, DNA complementarity.
 */

class CoupleMatch {
    constructor() {
        // Element compatibility matrix (score 0-1)
        this.elementMatrix = {
            'Fire':  { 'Fire': 0.6, 'Earth': 0.8, 'Air':   1.0, 'Water': 0.4 },
            'Earth': { 'Fire': 0.8, 'Earth': 0.5, 'Air':   0.4, 'Water': 0.7 },
            'Air':   { 'Fire': 1.0, 'Earth': 0.4, 'Air':   0.6, 'Water': 0.5 },
            'Water': { 'Fire': 0.4, 'Earth': 0.7, 'Air':   0.5, 'Water': 0.8 },
            // Bazi elements
            'Wood':  { 'Fire': 1.0, 'Earth': 0.5, 'Metal': 0.3, 'Water': 0.8, 'Wood': 0.6 },
            'Fire_bazi':  { 'Wood': 1.0, 'Earth': 0.8, 'Metal': 0.6, 'Water': 0.3, 'Fire_bazi': 0.5 },
            'Earth_bazi': { 'Fire_bazi': 0.8, 'Metal': 0.7, 'Water': 0.5, 'Wood': 0.5, 'Earth_bazi': 0.6 },
            'Metal': { 'Earth_bazi': 0.7, 'Water': 0.9, 'Wood': 0.3, 'Metal': 0.5, 'Fire_bazi': 0.6 },
            'Water_bazi': { 'Metal': 0.9, 'Wood': 0.8, 'Fire_bazi': 0.3, 'Earth_bazi': 0.5, 'Water_bazi': 0.6 },
        };

        // Zodiac compatibility (traditional pairings)
        this.trineGroups = [
            ['Aries', 'Leo', 'Sagittarius'],   // Fire trine
            ['Taurus', 'Virgo', 'Capricorn'],   // Earth trine
            ['Gemini', 'Libra', 'Aquarius'],    // Air trine
            ['Cancer', 'Scorpio', 'Pisces']     // Water trine
        ];

        this.oppositePairs = [
            ['Aries', 'Libra'], ['Taurus', 'Scorpio'], ['Gemini', 'Sagittarius'],
            ['Cancer', 'Capricorn'], ['Leo', 'Aquarius'], ['Virgo', 'Pisces']
        ];

        // Chinese zodiac compatibility
        this.chineseCompatibility = {
            'Rat':    { compatible: ['Dragon', 'Monkey', 'Ox'], clash: ['Horse', 'Rooster'] },
            'Ox':     { compatible: ['Rat', 'Snake', 'Rooster'], clash: ['Goat', 'Horse'] },
            'Tiger':  { compatible: ['Horse', 'Dog', 'Pig'], clash: ['Monkey', 'Snake'] },
            'Rabbit': { compatible: ['Goat', 'Pig', 'Dog'], clash: ['Rooster', 'Rat'] },
            'Dragon': { compatible: ['Rat', 'Monkey', 'Rooster'], clash: ['Dog', 'Rabbit'] },
            'Snake':  { compatible: ['Ox', 'Rooster', 'Monkey'], clash: ['Pig', 'Tiger'] },
            'Horse':  { compatible: ['Tiger', 'Goat', 'Dog'], clash: ['Rat', 'Ox'] },
            'Goat':   { compatible: ['Rabbit', 'Horse', 'Pig'], clash: ['Ox', 'Rat'] },
            'Monkey': { compatible: ['Rat', 'Dragon', 'Snake'], clash: ['Tiger', 'Pig'] },
            'Rooster':{ compatible: ['Ox', 'Dragon', 'Snake'], clash: ['Rabbit', 'Dog'] },
            'Dog':    { compatible: ['Tiger', 'Rabbit', 'Horse'], clash: ['Dragon', 'Rooster'] },
            'Pig':    { compatible: ['Tiger', 'Rabbit', 'Goat'], clash: ['Snake', 'Monkey'] },
        };

        // Thai day compatibility (Sunday=0 through Saturday=6)
        this.thaiDayCompatibility = {
            'Sunday':    { friend: ['Wednesday', 'Friday'], enemy: ['Monday'] },
            'Monday':    { friend: ['Wednesday', 'Friday'], enemy: ['Sunday'] },
            'Tuesday':   { friend: ['Thursday', 'Saturday'], enemy: ['Wednesday'] },
            'Wednesday': { friend: ['Sunday', 'Monday'], enemy: ['Tuesday'] },
            'Thursday':  { friend: ['Tuesday', 'Saturday'], enemy: ['Friday'] },
            'Friday':    { friend: ['Tuesday', 'Saturday'], enemy: ['Thursday'] },
            'Saturday':  { friend: ['Tuesday', 'Thursday'], enemy: ['Friday'] },
        };

        // Nakshatra compatibility groups
        this.nakshatraGroups = {
            'Deva':    ['Ashwini', 'Punarvasu', 'Pushya', 'Hasta', 'Anuradha', 'Shravana'],
            'Manushya':['Bharani', 'Ardra', 'Purva Phalguni', 'Vishakha', 'Jyeshtha', 'Purva Ashadha', 'Uttara Bhadrapada'],
            'Rakshasa':['Krittika', 'Magha', 'Chitra', 'Swati', 'Mula', 'Purva Bhadrapada', 'Revati'],
        };

        // Compatibility readings by score range
        this.readings = {
            excellent: [
                "Your genetic codes intertwine like a perfect double helix — complementary bases locking into an unbreakable bond. The cosmos has written your names in the same constellation.",
                "A rare symbiotic resonance. Your epigenetic markers amplify each other, creating a combined destiny greater than the sum of its parts. The oracle speaks of union.",
                "Your DNA sequences mirror each other across millennia. Ancient cosmology confirms what your cells already know: you are cosmic complements."
            ],
            strong: [
                "Strong resonance detected. Your charts align in key dimensions — shared elements harmonize, numbers complement. A bond forged in stellar fire and earthly patience.",
                "The oracle sees a powerful connection. Your life paths intersect at meaningful angles, creating a lattice of mutual growth and shared destiny.",
                "Your cosmological signatures vibrate at compatible frequencies. The I Ching reads this as hexagram 31 — Influence, Wooing. Mutual attraction is written in your charts."
            ],
            moderate: [
                "Moderate compatibility with sparks of brilliance. Your differences create creative tension — fire meets water to produce steam that moves mountains.",
                "The alignment shows promise with areas for growth. Your elements don't perfectly match, but friction generates warmth. Work is the catalyst.",
                "Your charts reveal a relationship of learning and expansion. Not effortless, but rewarding. The cosmos rewards effort with depth."
            ],
            challenging: [
                "Challenging but not impossible. Your elemental natures clash, but opposition can create the most transformative bonds. Growth requires friction.",
                "The oracle reads turbulence. Your paths cross at sharp angles — this is a relationship that demands conscious evolution from both parties.",
                "Your DNA sequences show divergence rather than convergence. But remember: mutation drives evolution. This bond tests and transforms."
            ],
        };

        // Relationship dynamics
        this.dynamics = [
            { type: 'Cosmic Mirror', desc: 'You reflect each other\'s deepest traits — strengths and shadows alike. A mirror relationship.' },
            { type: 'Elemental Catalyst', desc: 'One energizes, the other grounds. Together you create the conditions for transformation.' },
            { type: 'Karmic Thread', desc: 'Your numerological paths suggest a pre-existing connection. This feels like remembering, not meeting.' },
            { type: 'Stellar Dance', desc: 'Your zodiac positions create a dynamic orbit — sometimes close, sometimes distant, always connected.' },
            { type: 'Ancestral Echo', desc: 'Your Chinese zodiac and Bazi pillars suggest a bond rooted in generational patterns.' },
            { type: 'Sacred Geometry', desc: 'Your combined charts form a meaningful pattern — the Aztec and Vedic systems confirm structural harmony.' },
        ];
    }

    _getElementScore(el1, el2) {
        if (!el1 || !el2) return 0.5;
        const e1 = el1.split('(')[0].trim().replace('Bio-', '').split(' ')[0];
        const e2 = el2.split('(')[0].trim().replace('Bio-', '').split(' ')[0];

        if (this.elementMatrix[e1]?.[e2] !== undefined) return this.elementMatrix[e1][e2];
        if (this.elementMatrix[e2]?.[e1] !== undefined) return this.elementMatrix[e2][e1];

        // Normalize to known elements
        const normalize = e => {
            const map = { 'Carbon': 'Earth', 'Plasma': 'Fire', 'Matter': 'Earth', 'Ether': 'Air', 'Fluid': 'Water' };
            return map[e] || e;
        };
        const n1 = normalize(e1), n2 = normalize(e2);
        return this.elementMatrix[n1]?.[n2] ?? 0.5;
    }

    _getZodiacScore(sign1, sign2) {
        if (!sign1 || !sign2) return 0.5;
        // Same sign
        if (sign1 === sign2) return 0.7;
        // Trine (same element)
        for (const group of this.trineGroups) {
            if (group.includes(sign1) && group.includes(sign2)) return 0.9;
        }
        // Sextile (adjacent elements)
        const fireIdx = this.trineGroups[0].indexOf(sign1);
        const airIdx = this.trineGroups[2].indexOf(sign1);
        const earthIdx = this.trineGroups[1].indexOf(sign1);
        const waterIdx = this.trineGroups[3].indexOf(sign1);

        const allIdx = [fireIdx, airIdx, earthIdx, waterIdx].filter(i => i >= 0);
        if (allIdx.length > 0) {
            for (const group of this.trineGroups) {
                if (group.includes(sign2)) {
                    const groupIdx = this.trineGroups.indexOf(group);
                    const diff = Math.abs(this.trineGroups.findIndex(g => g.includes(sign1)) - groupIdx);
                    if (diff === 1 || diff === 3) return 0.75; // adjacent elements
                }
            }
        }
        // Opposite
        for (const [s1, s2] of this.oppositePairs) {
            if ((s1 === sign1 && s2 === sign2) || (s1 === sign2 && s2 === sign1)) return 0.6;
        }
        // Square (same modality, different element)
        return 0.4;
    }

    _getNumerologyScore(lp1, lp2) {
        if (!lp1 || !lp2) return 0.5;
        const a = lp1, b = lp2;
        // Same number = strong mirror
        if (a === b) return 0.85;
        // Complementary pairs
        const complements = { 1: [5, 3], 2: [6, 8], 3: [1, 6], 4: [7, 8], 5: [1, 9], 6: [2, 3, 9], 7: [4, 9], 8: [2, 4], 9: [5, 6, 7] };
        if (complements[a]?.includes(b) || complements[b]?.includes(a)) return 0.8;
        // Master numbers have special affinity
        if ([11, 22, 33].includes(a) || [11, 22, 33].includes(b)) {
            if (Math.abs(a - b) <= 2) return 0.75;
        }
        // General distance-based
        const dist = Math.abs(a - b);
        return Math.max(0.3, 1.0 - dist * 0.1);
    }

    _getChineseZodiacScore(animal1, animal2) {
        if (!animal1 || !animal2) return 0.5;
        if (animal1 === animal2) return 0.6;
        const info = this.chineseCompatibility[animal1];
        if (!info) return 0.5;
        if (info.compatible.includes(animal2)) return 0.9;
        if (info.clash.includes(animal2)) return 0.25;
        return 0.55;
    }

    _getThaiDayScore(day1, day2) {
        if (!day1 || !day2) return 0.5;
        if (day1 === day2) return 0.6;
        const info = this.thaiDayCompatibility[day1];
        if (!info) return 0.5;
        if (info.friend.includes(day2)) return 0.85;
        if (info.enemy.includes(day2)) return 0.3;
        return 0.5;
    }

    _getVedicScore(nak1, nak2) {
        if (!nak1 || !nak2) return 0.5;
        if (nak1 === nak2) return 0.7;
        // Same group = compatible
        for (const [group, stars] of Object.entries(this.nakshatraGroups)) {
            if (stars.includes(nak1) && stars.includes(nak2)) return 0.75;
        }
        return 0.5;
    }

    _getDNAComplementarity(seq1, seq2) {
        if (!seq1 || !seq2) return 0.5;
        const complement = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };
        const len = Math.min(seq1.length, seq2.length);
        let matches = 0;
        for (let i = 0; i < len; i++) {
            if (complement[seq1[i]] === seq2[i]) matches++;
        }
        return matches / len;
    }

    _getMoonPhaseCompatibility(phase1, phase2) {
        if (!phase1 || !phase2) return 0.5;
        if (phase1 === phase2) return 0.7;
        const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Balsamic'];
        const idx1 = phases.indexOf(phase1);
        const idx2 = phases.indexOf(phase2);
        if (idx1 < 0 || idx2 < 0) return 0.5;
        const dist = Math.abs(idx1 - idx2);
        // Opposite phases = complementary (New + Full)
        if (dist === 4) return 0.85;
        // Adjacent = harmonious
        if (dist <= 2 || dist >= 6) return 0.7;
        return 0.5;
    }

    /**
     * Generate couple DNA (merged sequence)
     */
    _generateCoupleDNA(seq1, seq2) {
        const len = Math.min(seq1?.length || 24, seq2?.length || 24, 48);
        let dna = '';
        for (let i = 0; i < len; i++) {
            const b1 = seq1?.[i] || 'A';
            const b2 = seq2?.[i] || 'T';
            // Merge: if complementary, use first; otherwise alternate
            if (b1 === b2) dna += b1;
            else dna += (i % 2 === 0 ? b1 : b2);
        }
        return dna;
    }

    /**
     * Main matching function
     * @param {Object} result1 - Oracle analysis result for person 1
     * @param {Object} result2 - Oracle analysis result for person 2
     * @param {string} name1 - Name of person 1
     * @param {string} name2 - Name of person 2
     */
    match(result1, result2, name1, name2) {
        const scores = {};

        // Element compatibility (Western)
        scores.element = this._getElementScore(result1.western?.element, result2.western?.element);

        // Zodiac compatibility
        scores.zodiac = this._getZodiacScore(result1.western?.sunSign, result2.western?.sunSign);

        // Moon phase compatibility
        scores.moonPhase = this._getMoonPhaseCompatibility(result1.western?.moonPhase, result2.western?.moonPhase);

        // Numerology compatibility
        scores.numerology = this._getNumerologyScore(result1.numerology?.pythagoreanLifePath, result2.numerology?.pythagoreanLifePath);

        // Chinese Zodiac compatibility
        scores.chineseZodiac = this._getChineseZodiacScore(result1.chineseZodiac?.animal, result2.chineseZodiac?.animal);

        // Thai Horasat compatibility
        scores.thaiHorasat = this._getThaiDayScore(result1.thaiHorasat?.thaiDay, result2.thaiHorasat?.thaiDay);

        // Vedic Nakshatra compatibility
        scores.vedic = this._getVedicScore(result1.vedic?.nakshatra, result2.vedic?.nakshatra);

        // DNA complementarity
        scores.dna = this._getDNAComplementarity(result1.dnaSequence, result2.dnaSequence);

        // Bazi Day Master compatibility
        scores.bazi = result1.bazi?.dayMaster && result2.bazi?.dayMaster
            ? (result1.bazi.dayMaster === result2.bazi.dayMaster ? 0.8 : 0.55)
            : 0.5;

        // Weighted overall score
        const weights = {
            element: 0.10, zodiac: 0.12, moonPhase: 0.08, numerology: 0.12,
            chineseZodiac: 0.10, thaiHorasat: 0.08, vedic: 0.08, dna: 0.15, bazi: 0.17
        };

        let overall = 0;
        let totalWeight = 0;
        for (const [key, weight] of Object.entries(weights)) {
            if (scores[key] !== undefined) {
                overall += scores[key] * weight;
                totalWeight += weight;
            }
        }
        overall = totalWeight > 0 ? overall / totalWeight : 0.5;

        // Determine compatibility tier
        let tier, tierColor;
        if (overall >= 0.80) { tier = 'Celestial Union'; tierColor = '#00ff88'; }
        else if (overall >= 0.65) { tier = 'Strong Resonance'; tierColor = '#00f3ff'; }
        else if (overall >= 0.50) { tier = 'Harmonic Tension'; tierColor = '#bd00ff'; }
        else if (overall >= 0.35) { tier = 'Karmic Challenge'; tierColor = '#ff6b35'; }
        else { tier = 'Cosmic Friction'; tierColor = '#ff3366'; }

        // Generate couple DNA
        const coupleDNA = this._generateCoupleDNA(result1.dnaSequence, result2.dnaSequence);

        // Select readings
        const readingPool = overall >= 0.80 ? this.readings.excellent
            : overall >= 0.65 ? this.readings.strong
            : overall >= 0.50 ? this.readings.moderate
            : this.readings.challenging;
        const readingIdx = (hashString(name1 + name2)) % readingPool.length;
        const reading = readingPool[readingIdx];

        // Select dynamic
        const dynIdx = (hashString(name1 + name2) * 7) % this.dynamics.length;
        const dynamic = this.dynamics[dynIdx];

        // Generate compatibility ID
        const compatId = `COUPLE-${Math.round(overall * 100)}-${coupleDNA.substring(0, 4)}`;

        // Per-dimension analysis
        const dimensions = [
            { name: 'Element Resonance', score: scores.element, icon: '🔥' },
            { name: 'Zodiac Synergy', score: scores.zodiac, icon: '⭐' },
            { name: 'Moon Phase Harmony', score: scores.moonPhase, icon: '🌙' },
            { name: 'Numerology Alignment', score: scores.numerology, icon: '🔢' },
            { name: 'Chinese Zodiac', score: scores.chineseZodiac, icon: '🐉' },
            { name: 'Thai Horasat', score: scores.thaiHorasat, icon: '🇹🇭' },
            { name: 'Vedic Nakshatra', score: scores.vedic, icon: '🕉️' },
            { name: 'Bazi Day Master', score: scores.bazi, icon: '🏯' },
            { name: 'DNA Complementarity', score: scores.dna, icon: '🧬' },
        ];

        return {
            compatId,
            overall,
            tier,
            tierColor,
            coupleDNA,
            reading,
            dynamic,
            dimensions,
            name1,
            name2,
        };
    }
}

if (typeof module !== 'undefined' && module.exports) { module.exports = CoupleMatch; }
