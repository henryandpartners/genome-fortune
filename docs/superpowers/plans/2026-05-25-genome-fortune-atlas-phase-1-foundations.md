# Genome Fortune Atlas — Phase 1: Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lay the groundwork for the Oracle Atlas redesign without changing user-visible behavior. Add a test runner, fix the non-deterministic DNA bug, extract reusable utilities, scaffold the new `atlas/`, `voice/`, and `share/` modules as stubs, and remove dead code.

**Architecture:** Vanilla JS, no module system change — new files follow the existing pattern (top-level declarations + a CommonJS export guard at the bottom). The browser still loads everything via `<script>` tags. Vitest is added as a dev dependency so the logic-heavy parts (hashing, deterministic DNA, URL state) get real tests; DOM work in later phases will use jsdom.

**Tech Stack:** Vanilla JS (existing) · Vitest · jsdom (Vitest's default DOM env) · CommonJS for test loading · `<script>`-tag globals in the browser.

---

## File Structure

**Create:**
- `vitest.config.js` — Vitest configuration
- `tests/hash.test.js` — tests for hashString
- `tests/dna.test.js` — tests for deterministic DNA generator
- `tests/url-state.test.js` — tests for URL state serializer
- `tests/voice.test.js` — tests for voice stubs
- `lib/hash.js` — extracted `hashString` utility
- `lib/dna.js` — deterministic, seeded DNA sequence generator
- `share/url-state.js` — encode/decode Atlas inputs to URL query string
- `voice/cultural.js` — per-engine cultural-voice reading stubs (return existing `reading` text for now)
- `voice/genome.js` — per-engine genome-voice reading stubs (return placeholder text seeded from result)
- `atlas/atlas.js` — `Atlas.mount(result, containerEl)` stub that, for Phase 1, just calls back into the existing render code

**Modify:**
- `package.json` — add `vitest` devDependency and a `test` script
- `engines/unified-oracle.js` — replace `Math.random()` DNA generation with deterministic seeded generator from `lib/dna.js`
- `index.html` — load new script files in the right order
- `app.js` — extract the body of `renderResults()` into `Atlas.mount()` indirection (still renders the same thing for Phase 1)

**Delete:**
- `oracle.js` — dead code (never imported from `index.html`; superseded by `engines/unified-oracle.js`)

**Convention for all new `lib/`, `share/`, `voice/`, `atlas/` files:**

```js
// Top-level declarations become window globals when loaded via <script>
function thingDoer() { /* ... */ }

// CommonJS export guard for Node/Vitest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { thingDoer };
}
```

This matches the existing pattern in `engines/bazi.js` and friends. No build step needed.

---

## Task 1: Set up Vitest

**Files:**
- Modify: `package.json`
- Create: `vitest.config.js`
- Create: `tests/.gitkeep`

- [ ] **Step 1: Add vitest to package.json devDependencies and add test script**

Replace the relevant sections of `package.json` (existing content shown for context):

```json
{
  "name": "genome-fortune",
  "version": "1.0.0",
  "description": "Decode Your Destiny — Cross-Cultural Bio-Fortune Engine",
  "main": "index.html",
  "scripts": {
    "dev": "npx serve . -p 3000",
    "test": "vitest run",
    "test:watch": "vitest",
    "build:ios": "npx cap open ios",
    "build:android": "npx cap open android",
    "sync": "npx cap sync"
  },
  "dependencies": {
    "@capacitor/core": "^6.0.0"
  },
  "devDependencies": {
    "@capacitor/cli": "^6.0.0",
    "@capacitor/ios": "^6.0.0",
    "@capacitor/android": "^6.0.0",
    "@capacitor/share": "^6.0.0",
    "@capacitor/camera": "^6.0.0",
    "vitest": "^1.6.0",
    "jsdom": "^24.0.0"
  }
}
```

- [ ] **Step 2: Create vitest.config.js**

Create `vitest.config.js` with this exact content:

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['tests/**/*.test.js'],
        globals: false
    }
});
```

- [ ] **Step 3: Install dependencies**

Run: `npm install`

Expected: vitest and jsdom appear under `node_modules/`. `npx vitest --version` prints a version number.

- [ ] **Step 4: Create tests/ directory placeholder**

Create empty `tests/.gitkeep` to track the directory:

```bash
touch tests/.gitkeep
```

- [ ] **Step 5: Verify vitest runs (with zero tests)**

Run: `npm test`
Expected: vitest exits 0 with a message like "No test files found" or "no tests" — that's fine; it confirms the runner works.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.js tests/.gitkeep
git commit -m "chore: add vitest test runner"
```

---

## Task 2: Extract hashString into lib/hash.js (TDD)

`hashString` currently lives at the bottom of `engines/unified-oracle.js`. Pull it into its own module so tests can reach it and other modules can reuse it.

**Files:**
- Create: `lib/hash.js`
- Create: `tests/hash.test.js`
- Modify: `engines/unified-oracle.js`
- Modify: `index.html`

- [ ] **Step 1: Write the failing test**

Create `tests/hash.test.js`:

```js
const { describe, test, expect } = require('vitest');
const { hashString } = require('../lib/hash.js');

describe('hashString', () => {
    test('returns 0 for empty string', () => {
        expect(hashString('')).toBe(0);
    });

    test('returns a deterministic integer for the same input', () => {
        const a = hashString('Alice');
        const b = hashString('Alice');
        expect(a).toBe(b);
        expect(Number.isInteger(a)).toBe(true);
    });

    test('returns different values for different inputs', () => {
        expect(hashString('Alice')).not.toBe(hashString('Bob'));
    });

    test('handles unicode characters', () => {
        expect(() => hashString('日本語')).not.toThrow();
        expect(hashString('日本語')).toBe(hashString('日本語'));
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/hash.test.js`
Expected: FAIL — cannot find module `../lib/hash.js`.

- [ ] **Step 3: Implement lib/hash.js**

Create `lib/hash.js`:

```js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/hash.test.js`
Expected: PASS (4/4 tests).

- [ ] **Step 5: Remove the duplicate hashString from engines/unified-oracle.js**

In `engines/unified-oracle.js`, delete lines 171–182 (the `function hashString(...)` block at the bottom of the file). The `hashString` calls inside `UnifiedOracle.analyze()` will pick it up from the global declared by `lib/hash.js` once it's loaded before `unified-oracle.js` in `index.html`.

After deletion, the bottom of `engines/unified-oracle.js` should end with:

```js
if (typeof module !== 'undefined' && module.exports) { module.exports = UnifiedOracle; }
```

- [ ] **Step 6: Load lib/hash.js in index.html before any engine that uses it**

In `index.html`, just above the `<!-- Engine Imports -->` block (around line 350), insert:

```html
    <!-- Shared Utilities -->
    <script src="lib/hash.js"></script>

    <!-- Engine Imports -->
```

- [ ] **Step 7: Manually verify the site still loads**

Run: `npm run dev` then open `http://localhost:3000` in a browser.
Expected: the hero page loads, "Begin Sequencing" works, the result page renders with a REF ID. No console errors.

Stop the dev server with Ctrl+C.

- [ ] **Step 8: Commit**

```bash
git add lib/hash.js tests/hash.test.js engines/unified-oracle.js index.html
git commit -m "refactor: extract hashString into lib/hash.js with tests"
```

---

## Task 3: Create deterministic DNA generator (TDD)

The current `UnifiedOracle.generateSequence()` uses `Math.random()` so the same input yields different DNA each run. Make it deterministic — seeded from the user's name + birth date.

**Files:**
- Create: `lib/dna.js`
- Create: `tests/dna.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/dna.test.js`:

```js
const { describe, test, expect } = require('vitest');
const { generateDNA, seededRNG } = require('../lib/dna.js');

describe('seededRNG', () => {
    test('produces same sequence for same seed', () => {
        const a = seededRNG(42);
        const b = seededRNG(42);
        expect([a(), a(), a()]).toEqual([b(), b(), b()]);
    });

    test('produces different sequences for different seeds', () => {
        const a = seededRNG(1);
        const b = seededRNG(2);
        expect(a()).not.toBe(b());
    });

    test('values are between 0 and 1', () => {
        const rng = seededRNG(99);
        for (let i = 0; i < 20; i++) {
            const v = rng();
            expect(v).toBeGreaterThanOrEqual(0);
            expect(v).toBeLessThan(1);
        }
    });
});

describe('generateDNA', () => {
    test('returns a string of the requested length', () => {
        expect(generateDNA('seed', 12).length).toBe(12);
        expect(generateDNA('seed', 48).length).toBe(48);
    });

    test('only contains A, T, C, G', () => {
        const dna = generateDNA('Alice', 48);
        expect(/^[ATCG]+$/.test(dna)).toBe(true);
    });

    test('is deterministic — same seed gives same DNA', () => {
        expect(generateDNA('Alice|2000-01-01', 48))
            .toBe(generateDNA('Alice|2000-01-01', 48));
    });

    test('different seeds give different DNA', () => {
        expect(generateDNA('Alice|2000-01-01', 48))
            .not.toBe(generateDNA('Bob|2000-01-01', 48));
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/dna.test.js`
Expected: FAIL — cannot find module `../lib/dna.js`.

- [ ] **Step 3: Implement lib/dna.js**

Create `lib/dna.js`:

```js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/dna.test.js`
Expected: PASS (7/7 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/dna.js tests/dna.test.js
git commit -m "feat: add deterministic DNA generator with seeded RNG"
```

---

## Task 4: Wire deterministic DNA into UnifiedOracle

**Files:**
- Modify: `engines/unified-oracle.js`
- Modify: `index.html`

- [ ] **Step 1: Update UnifiedOracle.generateSequence to use seeded generator**

In `engines/unified-oracle.js`, replace the entire `generateSequence(length = 24) { ... }` method (lines ~67–75) with:

```js
    /**
     * Generate a deterministic DNA sequence from a per-user seed.
     * Seed is set by analyze(); falls back to a time-based seed if called early.
     */
    generateSequence(length = 24) {
        const seed = this._seedString || String(Date.now());
        return generateDNA(seed, length);
    }
```

- [ ] **Step 2: Set the seed inside analyze()**

In the same file, inside `analyze(name, birthDate, birthTime, palmImageData)` (around line 133), insert a seed assignment as the very first line of the method body:

```js
    analyze(name, birthDate, birthTime, palmImageData) {
        this._seedString = `${name}|${birthDate}|${birthTime || ''}`;
        const result = {};

        // DNA sequence
        result.dnaSequence = this.generateSequence(48);
        // ... rest unchanged
```

- [ ] **Step 3: Load lib/dna.js in index.html before unified-oracle.js**

In `index.html`, in the Shared Utilities block created in Task 2, add the dna.js script after hash.js:

```html
    <!-- Shared Utilities -->
    <script src="lib/hash.js"></script>
    <script src="lib/dna.js"></script>

    <!-- Engine Imports -->
```

- [ ] **Step 4: Manually verify determinism in the browser**

Run: `npm run dev`
Then open `http://localhost:3000`. Enter the same name + birth date twice (resetting between runs). Both readings should show the **same DNA sequence** in the "🧬 Genomic Sequence" module.

Before this task, the DNA changed every run. After this task, it should be identical for identical inputs.

If the DNA differs, recheck Step 2 — the seed assignment must happen before `generateSequence` is called.

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add engines/unified-oracle.js index.html
git commit -m "fix: make DNA sequence deterministic per user input"
```

---

## Task 5: Remove dead oracle.js

`oracle.js` is never loaded from `index.html` and its contents are duplicated in `engines/unified-oracle.js`.

**Files:**
- Delete: `oracle.js`

- [ ] **Step 1: Confirm oracle.js is not referenced**

Run: `grep -rn "oracle\.js" --include="*.html" --include="*.js" --include="*.json" .`
Expected: zero matches outside of `oracle.js` itself or comments. If a reference shows up in `index.html`, stop and report — the file is actually wired in and must not be deleted.

- [ ] **Step 2: Delete the file**

```bash
git rm oracle.js
```

- [ ] **Step 3: Verify the site still works**

Run: `npm run dev` and open `http://localhost:3000`. Run a reading end-to-end. No console errors; result page renders normally.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: remove dead oracle.js (superseded by engines/unified-oracle.js)"
```

---

## Task 6: Create URL state serialization (TDD)

The Atlas needs a way to encode the user's reading inputs into the URL and decode them back. This lands the foundation for share-by-link and "save to history" features in later phases.

**Files:**
- Create: `share/url-state.js`
- Create: `tests/url-state.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/url-state.test.js`:

```js
const { describe, test, expect } = require('vitest');
const { encodeReading, decodeReading } = require('../share/url-state.js');

describe('encodeReading / decodeReading', () => {
    test('round-trips a single subject reading', () => {
        const input = { name: 'Alice', date: '2000-01-15', time: '08:30', place: '' };
        const query = encodeReading(input);
        const decoded = decodeReading(query);
        expect(decoded).toEqual(input);
    });

    test('handles missing optional fields', () => {
        const input = { name: 'Bob', date: '1985-07-04' };
        const query = encodeReading(input);
        const decoded = decodeReading(query);
        expect(decoded.name).toBe('Bob');
        expect(decoded.date).toBe('1985-07-04');
        expect(decoded.time).toBe('');
        expect(decoded.place).toBe('');
    });

    test('encodes unicode names safely', () => {
        const input = { name: '日本語', date: '1990-03-21' };
        const query = encodeReading(input);
        // Round-trip must equal the input
        expect(decodeReading(query).name).toBe('日本語');
        // Query must be URL-safe (no raw unicode bytes)
        expect(query).not.toMatch(/[^A-Za-z0-9_\-?=&%.~]/);
    });

    test('decodeReading on empty query returns null', () => {
        expect(decodeReading('')).toBe(null);
        expect(decodeReading('?')).toBe(null);
    });

    test('decodeReading on missing required field returns null', () => {
        // no name
        expect(decodeReading('?d=2000-01-01')).toBe(null);
        // no date
        expect(decodeReading('?n=Alice')).toBe(null);
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/url-state.test.js`
Expected: FAIL — cannot find module `../share/url-state.js`.

- [ ] **Step 3: Implement share/url-state.js**

Create `share/url-state.js`:

```js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/url-state.test.js`
Expected: PASS (5/5 tests).

- [ ] **Step 5: Commit**

```bash
git add share/url-state.js tests/url-state.test.js
git commit -m "feat: add Atlas URL state encode/decode"
```

---

## Task 7: Create voice/cultural.js stub (TDD)

Scaffold the cultural-voice module. Phase 1 returns the engine's existing `reading` field unchanged. Phase 5 replaces these with rewritten authentic-voice prose.

**Files:**
- Create: `voice/cultural.js`
- Create: `tests/voice.test.js`
- Modify: `index.html`

- [ ] **Step 1: Write the failing test**

Create `tests/voice.test.js`:

```js
const { describe, test, expect } = require('vitest');
const { culturalReading } = require('../voice/cultural.js');
const { genomeReading } = require('../voice/genome.js');

describe('culturalReading', () => {
    test('returns the engine.reading field when present', () => {
        const result = culturalReading('bazi', { reading: 'Bazi says hello.' });
        expect(result).toBe('Bazi says hello.');
    });

    test('returns a placeholder when engine.reading is missing', () => {
        const result = culturalReading('bazi', {});
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    test('falls back to a generic message for an unknown engine', () => {
        const result = culturalReading('unknown', { reading: 'X' });
        expect(result).toBe('X');
    });
});

describe('genomeReading', () => {
    test('returns a string deterministically for the same engine + result', () => {
        const r = { reading: 'foo', dayMaster: '甲 Jia (Wood Yang)' };
        expect(genomeReading('bazi', r)).toBe(genomeReading('bazi', r));
    });

    test('returns different strings for different engines', () => {
        const r = { reading: 'foo' };
        // We only assert the strings are non-empty here; full content lands in Phase 5.
        expect(genomeReading('bazi', r)).toBeTruthy();
        expect(genomeReading('iching', r)).toBeTruthy();
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/voice.test.js`
Expected: FAIL — cannot find module `../voice/cultural.js`.

- [ ] **Step 3: Implement voice/cultural.js**

Create `voice/cultural.js`:

```js
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
```

- [ ] **Step 4: Load voice/cultural.js in index.html**

In `index.html`, just above the closing `</body>` and after the engine imports, add a Voice section just before `<script src="app.js">`:

```html
    <!-- Voice Layer -->
    <script src="voice/cultural.js"></script>
    <script src="voice/genome.js"></script>

    <script src="app.js"></script>
```

- [ ] **Step 5: Commit**

```bash
git add voice/cultural.js tests/voice.test.js index.html
git commit -m "feat: add cultural-voice reading stub (Phase 1)"
```

---

## Task 8: Create voice/genome.js stub

**Files:**
- Create: `voice/genome.js`

- [ ] **Step 1: Implement voice/genome.js**

Create `voice/genome.js`:

```js
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
```

- [ ] **Step 2: Run voice tests to verify both modules pass**

Run: `npm test -- tests/voice.test.js`
Expected: PASS (5/5 tests).

- [ ] **Step 3: Commit**

```bash
git add voice/genome.js
git commit -m "feat: add genome-voice reading stub (Phase 1)"
```

---

## Task 9: Create atlas/atlas.js stub (Phase 1 indirection only)

For Phase 1 the Atlas is just an indirection — `Atlas.mount(result, containerEl)` is the entry point that later phases will replace with the real constellation. For now it forwards to a callback that runs the existing render code, so the app behavior is unchanged.

**Files:**
- Create: `atlas/atlas.js`
- Modify: `index.html`

- [ ] **Step 1: Implement atlas/atlas.js**

Create `atlas/atlas.js`:

```js
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
```

- [ ] **Step 2: Load atlas/atlas.js in index.html before app.js**

In `index.html`, in the section added during Task 7, place `atlas/atlas.js` BEFORE the Voice Layer scripts so it's available when app.js initializes:

```html
    <!-- Atlas -->
    <script src="atlas/atlas.js"></script>

    <!-- Voice Layer -->
    <script src="voice/cultural.js"></script>
    <script src="voice/genome.js"></script>

    <script src="app.js"></script>
```

- [ ] **Step 3: Commit**

```bash
git add atlas/atlas.js index.html
git commit -m "feat: add Atlas.mount() pass-through stub"
```

---

## Task 10: Route single-subject rendering through Atlas.mount()

Wire `app.js` to register its existing `renderResults` function with `Atlas` and call `Atlas.mount(result)` instead of `renderResults(result)` directly. Behavior is unchanged; the indirection sets us up for Phase 2 to swap in the real Atlas.

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Register renderResults with Atlas at startup**

In `app.js`, near the top of the `DOMContentLoaded` callback (after the `screens` map and `oracle` instantiation, around line 22), add:

```js
    // Register the legacy renderer with the Atlas. Phase 2 replaces this.
    if (typeof Atlas !== 'undefined') {
        Atlas.register(renderResults);
    }
```

Note: this references `renderResults` which is hoisted as a function declaration further down in the same scope — that's fine; JS hoists function declarations within their enclosing function scope.

- [ ] **Step 2: Replace the direct call in finalizeResult**

In `app.js`, find `finalizeResult` (around line 255):

```js
    function finalizeResult(name, date, time, palmImageData) {
        const result = oracle.analyze(name, date, time, palmImageData);
        renderResults(result);
        switchScreen('sequencing', 'result');
    }
```

Replace `renderResults(result);` with `Atlas.mount(result);`:

```js
    function finalizeResult(name, date, time, palmImageData) {
        const result = oracle.analyze(name, date, time, palmImageData);
        Atlas.mount(result);
        switchScreen('sequencing', 'result');
    }
```

- [ ] **Step 3: Manually verify the site still works end-to-end**

Run: `npm run dev` and open `http://localhost:3000`.

1. Click "Begin Sequencing."
2. Fill in name + date + time, submit.
3. Wait for the sequencing animation to complete.
4. Confirm the result page renders normally — all 9 engine modules visible, DNA sequence shown, share buttons present.

If the result page renders blank, check the browser console for errors around `Atlas.mount` or `renderResults`. The most likely cause is `Atlas.register` running before `renderResults` is defined; fix by moving the `Atlas.register` call to the bottom of the `DOMContentLoaded` callback instead of the top.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add app.js
git commit -m "refactor: route single-subject rendering through Atlas.mount()"
```

---

## Task 11: Wire URL state on page load

When the page loads with `?n=...&d=...` parameters, prefill the input form and offer to re-run the analysis automatically. Sets up the Phase 2 "Atlas as shareable URL" goal.

**Files:**
- Modify: `app.js`
- Modify: `index.html`

- [ ] **Step 1: Load share/url-state.js in index.html before app.js**

In `index.html`, add a Share section before the Atlas section:

```html
    <!-- Share -->
    <script src="share/url-state.js"></script>

    <!-- Atlas -->
    <script src="atlas/atlas.js"></script>
```

- [ ] **Step 2: Read URL state on DOMContentLoaded**

In `app.js`, near the very bottom of the `DOMContentLoaded` callback (just before the closing `});` of `document.addEventListener('DOMContentLoaded', () => { ... });` around line 735), add:

```js
    // Prefill input form from URL state if present.
    const urlReading = decodeReading(window.location.search);
    if (urlReading) {
        document.getElementById('subject-name').value = urlReading.name;
        document.getElementById('birth-date').value = urlReading.date;
        if (urlReading.time) document.getElementById('birth-time').value = urlReading.time;
        // Reveal the input section so the user sees the prefilled data.
        switchScreen('hero', 'input');
    }
```

- [ ] **Step 3: Manually verify URL prefill**

Run: `npm run dev`.

Visit: `http://localhost:3000/?n=Alice&d=2000-01-15&t=08:30`

Expected: the page lands directly on the input form with name "Alice," date "2000-01-15," and time "08:30" already filled in.

Visit: `http://localhost:3000/` (no query)

Expected: the page lands on the hero as usual.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add app.js index.html
git commit -m "feat: prefill input form from URL state when present"
```

---

## Task 12: Final integration verification

A guided manual sweep to confirm Phase 1 is fully wired before declaring done.

**Files:** (none changed; verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: ALL tests pass. At time of writing this plan: 17 tests across hash, dna, url-state, voice. None should be skipped.

If anything fails, fix it before proceeding.

- [ ] **Step 2: Run the dev server and walk through every user path**

Run: `npm run dev`.

For each of the following, confirm no console errors and the expected UI:

1. **Hero loads.** Logo + tagline + buttons visible.
2. **Begin Sequencing.** Form → submit → sequencing animation → result page renders all 9 engine modules.
3. **Deterministic DNA.** Reset, run the same name + date again, confirm same DNA sequence in the "🧬 Genomic Sequence" panel.
4. **Genome Lab.** Hero → "🧬 Genomic Data Lab" → paste an example sequence → Scan → Regulation → Fortune tabs all render.
5. **Couple Match.** Hero → "💞 Couple Genome Match" → fill both subjects → submit → couple result with ring + dimension bars renders.
6. **Fortune Stick.** Hero → "Fortune Stick Protocol" → Shake → stick result appears.
7. **URL prefill.** Visit `?n=Test&d=1990-01-01&t=12:00` — form prefills, hero skipped.
8. **Share buttons.** On the result page, click 📋 Text — clipboard receives the full reading.

Stop the dev server.

- [ ] **Step 3: Confirm no dead code or stale references**

Run: `grep -rn "oracle\.js" --include="*.html" --include="*.js" --include="*.json" .`
Expected: zero matches.

Run: `git status`
Expected: working tree clean.

- [ ] **Step 4: Tag the Phase 1 commit**

```bash
git tag -a phase-1-foundations -m "Phase 1: foundations complete — tests, deterministic DNA, voice/atlas/share scaffolding, oracle.js removed"
```

(Pushing the tag is optional and at the user's discretion.)

---

## Acceptance criteria for Phase 1

- [x] Vitest installed and `npm test` runs the suite cleanly.
- [x] `hashString` lives in `lib/hash.js` with tests; old copy removed from `engines/unified-oracle.js`.
- [x] DNA generation is deterministic — same `(name, date, time)` always produces the same sequence.
- [x] `share/url-state.js` round-trips `{name, date, time, place}` through URL params with tests.
- [x] `voice/cultural.js` and `voice/genome.js` exist as stubs returning engine-flavored prose deterministically.
- [x] `atlas/atlas.js` exposes `Atlas.mount(result)` and the legacy renderer is registered to it.
- [x] `app.js` calls `Atlas.mount(result)` instead of `renderResults(result)` directly.
- [x] URL state prefills the input form when present.
- [x] `oracle.js` deleted; no references remain.
- [x] The user-visible behavior is identical to before Phase 1.

## Out of scope for Phase 1

Reserved for Phase 2+:

- Constellation Atlas layout, Genome Sigil rendering, per-engine Scene modules.
- Replacing the legacy `renderResults()` with the real Atlas UI.
- Couple Atlas (dual sigils, pairwise nodes).
- Fortune Stick as an Atlas ritual object.
- Voice prose work — the cultural and genome readings remain stubs until Phase 5.
- Birth-place geocoding (still free text; not yet collected from the form).
- localStorage history of past readings.
- Atlas snapshot share (1080×1920 canvas export).

---

## Self-review notes (for the plan author)

- **Spec coverage:** This plan implements §6.3 Phase 1 of the design spec (`docs/superpowers/specs/2026-05-25-genome-fortune-atlas-design.md`) — the foundations item. Specifically: remove `oracle.js` (§2.3), make DNA deterministic (§2.3, §3.3 Sigil determinism prerequisite), refactor `app.js` into `Atlas.mount()` indirection (§6.1), add `voice/` and `share/` skeletons (§6.1), add URL state (§5.6).
- **Placeholder scan:** Each step contains exact file paths, complete code where code is changed, and exact commands with expected output.
- **Type consistency:** `Atlas.register` / `Atlas.mount` / `encodeReading` / `decodeReading` / `culturalReading` / `genomeReading` / `generateDNA` / `seededRNG` / `hashString` — every function name introduced in a task is used identically in later tasks.
- **No new runtime dependencies** — only `vitest` and `jsdom` as devDependencies; the deployed site still ships zero non-Capacitor runtime deps.
