/**
 * Simple deterministic string hash (djb2-ish variant from the old codebase).
 * Returns a 32-bit signed integer.
 */
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return hash;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { hashString };
}
