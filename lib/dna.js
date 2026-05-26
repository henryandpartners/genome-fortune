/**
 * Mulberry32 — small, fast, deterministic PRNG.
 * Returns a function that yields values in [0, 1).
 */
function seededRNG(seed) {
    let state = seed >>> 0;
    return function () {
        state = (state + 0x6D2B79F5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Generate a deterministic DNA sequence from a seed string.
 * @param {string} seedStr  Anything stable per-user (e.g. `${name}|${date}`).
 * @param {number} length   Number of base pairs.
 * @returns {string} a sequence of A/T/C/G of `length` characters.
 */
function generateDNA(seedStr, length = 48) {
    // Convert seed string to a 32-bit integer (same hash family as lib/hash.js).
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) {
        seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
        seed |= 0;
    }
    const rng = seededRNG(seed);
    const bases = ['A', 'T', 'C', 'G'];
    let seq = '';
    for (let i = 0; i < length; i++) {
        seq += bases[Math.floor(rng() * 4)];
    }
    return seq;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateDNA, seededRNG };
}
