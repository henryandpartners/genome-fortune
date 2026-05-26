/**
 * Oracle Atlas — entry point.
 *
 * Phase 1: this is a thin pass-through. `Atlas.mount(result)` invokes a
 * registered renderer (in Phase 1, the legacy renderResults() in app.js).
 * Phase 2 replaces this implementation with the constellation + sigil scene
 * without changing the call site.
 */
const Atlas = (function () {
    let _renderer = null;

    function register(rendererFn) {
        _renderer = rendererFn;
    }

    function mount(result) {
        if (typeof _renderer !== 'function') {
            console.warn('Atlas.mount called before a renderer was registered.');
            return;
        }
        _renderer(result);
    }

    return { register, mount };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Atlas;
}
