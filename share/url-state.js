/**
 * Atlas URL state.
 * Encodes a reading's inputs to a query string and decodes them back.
 *
 * Schema (kept short for shareable links):
 *   n  -> name        (required)
 *   d  -> birthDate   (required, YYYY-MM-DD)
 *   t  -> birthTime   (optional, HH:MM)
 *   p  -> birthPlace  (optional, free text)
 */

function encodeReading(input) {
    const params = new URLSearchParams();
    if (input.name) params.set('n', input.name);
    if (input.date) params.set('d', input.date);
    if (input.time) params.set('t', input.time);
    if (input.place) params.set('p', input.place);
    return '?' + params.toString();
}

function decodeReading(query) {
    if (!query || query === '?') return null;
    const params = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
    const name = params.get('n');
    const date = params.get('d');
    if (!name || !date) return null;
    return {
        name,
        date,
        time: params.get('t') || '',
        place: params.get('p') || ''
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { encodeReading, decodeReading };
}
