# Genome Fortune — Oracle Atlas Redesign

**Date:** 2026-05-25
**Status:** Approved by user; pending implementation plan
**Scope:** Substantial overhaul of presentation layer; engine math kept intact

## 1. Intent & framing

Genome Fortune is treated as an **art / aesthetic project**. The fusion of bio-cyberpunk lab framing with classical cultural divination systems is the point. Calculation accuracy is secondary to visual identity, mood, and narrative.

Three decisions anchor the redesign:

- **Bifurcate per engine.** The cyberpunk shell stays. Each cultural engine (Bazi, I Ching, Aztec, Vedic, Western, Thai, Chinese Zodiac, Numerology, Palm) gets its own visual identity — ink scroll, parchment, carved stone, mandala, etc. The friction between the shell and each tradition is the project's voice.
- **Dual-layer reading voice.** Every engine surfaces *two* readings side-by-side: a clean cultural-voice reading in the tradition's authentic register, and a parallel genome-layer reinterpretation in cyberpunk lab voice. The dialectic is the art.
- **Oracle Atlas structure.** The current "dump all 9 engines onto one page" result is replaced by a navigable constellation of engine nodes around a center sigil. Per-engine deep scenes; sigil + synthesized prophecy + fortune stick always visible at center.

## 2. Audit of the current state

### 2.1 Working

- Engine math runs correctly across 12 engine files; Bazi uses real Julian-day arithmetic, I Ching has all 64 hexagrams with judgments, Aztec uses a correct Tonalpohualli reference date.
- The DNA helix + scrolling log on the sequencing screen is the strongest atmospheric moment in the app.
- Couple mode's compatibility ring + animated dimension bars is the one screen that isn't a text dump and is well-designed.
- The Genome Lab's 4-tab pipeline (Input → Scan → Regulation → Fortune) is a coherent, genuinely interesting feature.
- The Fortune Stick's procedural three-part generator (metaphor + action + destiny) produces good variety from a small bank.

### 2.2 Broken — by page

**Hero.** Four buttons compete with no primary action; Stick and Genome Lab surface before any reading exists.

**Single input.** Birth time required but ignored by ~half the engines. No place / no timezone. Palm upload has no preview.

**Single result (biggest problem).** All 9 engines render as identical-looking text blocks with `\n` line breaks on one page. No visual rendering of any tradition (no hexagram lines, no Bazi pillar grid, no day glyph, no natal wheel, no annotated palm). Prophecy + Riddle + 9 engines + Genome ID + Share + Donate all stacked on one screen.

**Couple result.** Says how much (score, dimension bars) but never *why* — no per-dimension explanation; no path to drill into each engine's pairwise reading.

**Fortune Stick screen.** Reached from hero before any context exists; result then dumps onto the main result page with everything else hidden — confusing state machine.

**Genome Lab.** Sits as a side-app; readings never feed back into the cultural engines. The biological visualization clashes with everything else stylistically.

### 2.3 Cross-cutting code issues

- `oracle.js` is dead code (never imported in `index.html`); `unified-oracle.js` superseded it. Title comment misspelled "GEMOME FORTUNE."
- Displayed DNA sequence uses `Math.random()` per `analyze()` call — same input ≠ same DNA. Inconsistent with everything else being deterministic.
- Chinese Zodiac uses Gregorian year (wrong for Jan / early-Feb births).
- Bazi month uses Gregorian month, not solar terms (~±1 day off near boundaries).
- Couple-match element matrix has `'Fire_bazi'`-style keys that no engine ever produces — dead code path.
- `oracle.js` / `unified-oracle.js` duplicate the same fortunes / riddles arrays.
- Twitter share is still labeled "Tweet" with bird emoji.

For an art project, the math approximations are acceptable as-is — they support the aesthetic. The dead code, duplicate data, and non-deterministic DNA are fixed in Phase 1.

## 3. Target architecture: The Oracle Atlas

### 3.1 Atlas concept

A single full-viewport scene the user lands on after analysis completes. Dark cosmographic field with a **Genome Sigil** anchored at center and the cultural engines arranged around it as constellation nodes — each node a small bespoke glyph hinting at its tradition.

The Atlas is the user's saved reading. URL encodes the inputs (`?n=…&d=…&t=…&p=…`) so it's shareable, screenshottable, and returnable-to.

### 3.2 Layout

```
┌────────────────────────────────────────────────────┐
│  ☰ GENOME FORTUNE · REF: GEN-704-ATG               │
│                                                    │
│         · Bazi      · I Ching                      │
│                                                    │
│   · Aztec     [GENOME SIGIL]      · Vedic          │
│                  + Prophecy                        │
│                  + Riddle                          │
│         · Western    · Thai                        │
│                                                    │
│  ·Chinese   ·Numerology    ·Palm    🥢Stick        │
│                                                    │
│  [share] [reset]                  [enter Lab →]    │
└────────────────────────────────────────────────────┘
```

- **Center:** Genome Sigil + synthesized prophecy + final riddle.
- **Constellation:** 9 engine nodes, each styled in miniature in its tradition's visual language.
- **Perimeter:** Fortune Stick as a ritual object; Lab entry.
- **Top bar:** ref ID, menu (re-input, switch to couple mode, previous readings).

Mobile: constellation collapses to a vertical scroll of nodes; sigil pinned at top.

### 3.3 Genome Sigil (new asset)

Each user gets a deterministic, unique mark generated from their analysis:

- Spine glyph from the deterministic DNA sequence (12-base pattern → 12 strokes)
- Color from dominant Bazi element + Western element
- Surrounding aura from Genome Lab pattern bias when the user has scanned a sequence
- Their REF ID orbits as text

The Sigil is the brand mark of their reading and the primary shareable image. Replaces the current plaintext `REF:` header.

### 3.4 Interaction model

- Tap a node → engine Scene slides in over the Atlas; back returns to Atlas with the node marked as visited.
- Atlas state persists across scene visits — same sigil, same orbit.
- Center prophecy: tap to expand into the full integrated reading.
- Stick: long-press to "shake"; result unfurls as a parchment that floats to a corner of the Atlas and persists with the reading.

## 4. Engine Scene template

Every engine, when opened, uses the same skeleton — but the skeleton's materials differ per engine.

### 4.1 Scene skeleton

```
┌──────────────────────────────────────────────────┐
│  ← Atlas                            BAZI · 八字  │
│                                                  │
│  ┌─────────────────────┐  ┌──────────────────┐   │
│  │   BESPOKE VISUAL    │  │  CULTURAL READ   │   │
│  │   (engine signature │  │  (authentic       │   │
│  │   glyph / chart /   │  │   tradition voice)│   │
│  │   diagram)          │  └──────────────────┘   │
│  │                     │  ┌──────────────────┐   │
│  │                     │  │  ⌬ GENOME LAYER  │   │
│  │                     │  │  (bio-reinterpret │   │
│  │                     │  │   in lab voice)  │   │
│  └─────────────────────┘  └──────────────────┘   │
│                                                  │
│  ◀ prev engine                next engine ▶      │
└──────────────────────────────────────────────────┘
```

- **Bespoke visual** (~55% on desktop): the engine's signature graphic. Not a card; a real diagram/glyph/chart.
- **Cultural reading** (top-right): authentic-voice text. Clean typography, ornament native to the tradition, no neon.
- **Genome layer** (bottom-right): cyberpunk-lab reinterpretation. Mono font, cyan/magenta.

Mobile: visual on top, two readings stacked below.

Navigation: ◀ / ▶ jumps between engines without returning to Atlas.

### 4.2 Per-engine visual identities

| Engine | Material / aesthetic | Signature graphic |
|---|---|---|
| Bazi 八字 | Ink-on-rice-paper; brush serif; ochre + ink-black | Four vertical stone stelae, stem/branch characters carved on each; Day Master glows |
| I Ching 易经 | Yarrow-stalk parchment; cream + sumi-black | Six real lines (solid yang / broken yin); upper/lower trigram labels; tap a line for position-meaning |
| Aztec Tonalpohualli | Carved obsidian / codex page; earth-red, jade, gold-leaf | Day glyph as codex card; coefficient as dots, day-sign illustrated; trecena + night-lord as cartouches |
| Vedic Jyotish | Mandala / sandstone temple; saffron, indigo, gold | 27-nakshatra wheel with user's nakshatra illuminated; rashi as smaller inner ring |
| Western Zodiac | Renaissance star-chart engraving; cream parchment, fine line, gold-leaf accents | Mini natal-chart wheel; sun position + moon phase icon |
| Thai Horasat | Temple mural; saffron + gold; lotus motifs | Day-deity card illustrated; day color as background; sacred animal framing |
| Chinese Zodiac | Folk-art papercut; red, black, gold | Bold papercut illustration of the animal; element + yin/yang stamps |
| Numerology | Diagrammatic / Pythagorean; black, white, one accent | 3×3 Pythagorean grid with life-path/destiny/soul-urge highlighted |
| Palm | Anatomical print; sepia ink on parchment | User's uploaded palm with detected lines annotated as overlay (or generic palm diagram when no upload) |

The Atlas shell stays cyberpunk. Each scene is a portal into a different cultural visual world.

### 4.3 Dual-layer voice

Two prose passes per engine, both deterministic from engine results:

- **Cultural reading** (`engineResult.readingCultural`) — rewrites the current `reading` field in the tradition's authentic register. No bio-metaphor.
- **Genome layer** (`engineResult.readingGenome`) — parallel pass mapping the same data into bio terms, generated from a small template language seeded by the engine result.

Existing `reading` field stays for backwards compatibility but the Atlas uses the two new ones.

## 5. Flow, input, and integrations

### 5.1 Entry & input

- **Hero**: one primary CTA ("Begin Reading"); secondary link to Couple Match. Stick and Genome Lab no longer surface here — they appear inside the Atlas.
- **Input form**: Name + birth date required; birth time optional (defaults to 12:00); birth place optional (free text in MVP, geocoded later); palm scan moved to "add from inside the Atlas."

### 5.2 Sequencing screen

Keep the helix + log. Change:

- Engines run concurrently (staggered via `setTimeout(0)`); log line appears when each engine actually completes.
- Helix strand colors shift through dominant elements as engines report.
- Total duration ~3–5s, not fixed 9s.
- Transition to Atlas: helix dissolves into the Genome Sigil at center; single continuous motion.

### 5.3 Couple mode (dual Atlas)

Two sigils side-by-side at center, joined by an animated DNA braid. Constellation nodes show **pairwise** readings:

- Tap a node → Scene shows the relationship reading for that engine (e.g., Bazi: two Day Masters and their element interaction; I Ching: synthesized "relationship hexagram"; Chinese Zodiac: friend/clash pairing with explanation).
- Center: compatibility tier, score ring (kept — works well), relationship dynamic phrase.
- "View Alpha's chart" / "View Omega's chart" drop into the individual Atlas for either person.
- **New flow**: "Share my chart for matching" link — fill in your data, get a link, send it; other person fills theirs; both land on the dual Atlas.

### 5.4 Fortune Stick as ritual object

No dedicated screen. A small bamboo-stick glyph sits in the Atlas perimeter. Long-press to "shake"; the glyph rattles, the Atlas dims, a parchment unfurls with the stick number + three-part text. Floats to a corner of the Atlas and persists. Re-castable (overwrites). One stick per reading at a time — intentional weight.

### 5.5 Genome Lab as signature node

The Lab keeps its 4-tab pipeline. It integrates into the Atlas:

- Reachable from the Atlas (bottom-right "Enter Lab") and as a node styled as a lit sequencer/microscope.
- Lab feeds back into the Atlas: scan results inform the Sigil's aura, and the Genome Layer prose for each engine references the user's actually-scanned genes when available ("Your hexagram 24 corresponds to an MITF promoter activation event — your scan showed MITF up-regulated by +2.3×").
- A "Lab only" link on the hero preserves the Lab as a standalone path for casual visitors.

### 5.6 Persistence & sharing

- **URL state**: Atlas URL encodes inputs; same URL always renders the same Atlas.
- **localStorage**: last 5 readings, accessible from a "Previous readings" menu.
- **Share** options: Sigil only (small square), Atlas snapshot (1080×1920), deep link (copy URL). Replace Twitter button with generic Share (Web Share API) + Copy link.

### 5.7 What goes away

- Standalone `#fortune-stick-section` screen and its show/hide hack.
- Hero buttons for Genome Lab & Fortune Stick.
- Donate block as a primary CTA on results (moves into top-bar menu).
- Required birth-time gate.

### 5.8 What stays

- All 12 engine files (math unchanged).
- DNA helix animation.
- Compatibility ring + dimension bars.
- Genome Lab's tab pipeline.
- Procedural three-part stick generator.

## 6. Engineering plan

### 6.1 Target file structure

```
genome-fortune/
├── index.html              ← simplified shell, no per-engine markup
├── style.css               ← shell-only styles (atlas, hero, input, sequencing)
├── app.js                  ← shrunk: routing + form handling
├── engines/                ← UNCHANGED (math kept as-is)
├── atlas/                  ← NEW
│   ├── atlas.js            ← constellation layout, routing
│   ├── sigil.js            ← Genome Sigil generator
│   ├── stick.js            ← Fortune Stick ritual object
│   └── atlas.css
├── scenes/                 ← NEW — one module per engine
│   ├── common.js + .css    ← shared scene primitives
│   ├── bazi.js + .css      ← ink scroll, four pillars
│   ├── iching.js + .css    ← hexagram lines, parchment
│   ├── aztec.js + .css     ← codex card
│   ├── vedic.js + .css     ← mandala wheel
│   ├── western.js + .css   ← natal-chart engraving
│   ├── thai.js + .css      ← temple mural
│   ├── chinese-zodiac.js + .css ← papercut
│   ├── numerology.js + .css ← Pythagorean grid
│   ├── palm.js + .css      ← annotated palm
│   └── lab.js + .css       ← Genome Lab as scene
├── voice/                  ← NEW — prose layer
│   ├── cultural.js         ← cultural-voice readings per engine
│   └── genome.js           ← bio-reinterpretation per engine
└── share/                  ← NEW
    ├── url-state.js        ← serialize/deserialize Atlas to URL
    ├── snapshot.js         ← canvas Atlas/Sigil image export
    └── history.js          ← localStorage of recent readings
```

**Deleted:** `oracle.js`.

**Modified:** `index.html` (strip per-engine result modules, stick section, lab section markup), `style.css` (keep shell only), `app.js` (becomes thin router; `renderResults()` replaced by `Atlas.mount(result)`).

### 6.2 Dependencies

**Zero new dependencies.** All visuals achievable with vanilla JS + canvas + SVG. Birth-place autocomplete deferred to a later iteration; MVP treats place as free-text the engines ignore.

### 6.3 Rollout phases

Each phase produces a working, demo-able app.

**Phase 1 — Foundations (1–2 days).** Remove `oracle.js`. Make DNA sequence deterministic (seed from `hashString(name+date)`). Refactor `app.js` into routes + `Atlas.mount()` stub that renders old result modules inside an Atlas-shaped container. Add `voice/` skeletons returning existing readings. Add URL-state serialization.

**Phase 2 — Atlas shell + Sigil + 2 engine scenes (3–4 days).** Build constellation Atlas, Sigil generator, and Bazi + I Ching scenes with bespoke visuals. Wire prev/next navigation. Other seven engines still render text inside scene template.

**Phase 3 — Remaining engine scenes (4–5 days).** Aztec, Vedic, Western, Thai, Chinese Zodiac, Numerology, Palm — one scene module each with signature SVG/canvas graphic and dual-pane reading.

**Phase 4 — Stick, Lab, Couple mode (2–3 days).** Stick as Atlas ritual object. Lab refactored as a scene with its 4-tab pipeline intact. Lab feedback wired into Sigil aura + Genome-layer prose. Couple Atlas: dual sigils, braided helix, pairwise nodes for engines that support pairwise.

**Phase 5 — Voice work, polish, share (2–3 days).** Cultural-voice and genome-voice prose for each engine. Atlas snapshot share (canvas export). "Share my chart for matching" link flow. Replace Twitter button with generic Share. Mobile audit & responsive tuning. Final transition polish.

**Total: 12–17 days of focused work for one person.**

### 6.4 Risks

1. **Voice work is the silent budget killer.** 9 engines × 2 voices is real authorial work. Plan to iterate after Phase 3.
2. **Per-engine SVG identity drift.** Designing 9 cultural visuals back-to-back risks convergence. Mitigation: lock Bazi + I Ching references before doing the rest.
3. **Mobile constellation.** Harder than the dump-page was. Vertical-fallback design needs real testing by Phase 2.
4. **Birth-place geocoding.** Deferred to MVP-plus. MVP treats place as free text.
5. **Stick rarity.** Making it slower to access (long-press in Atlas) is intentional. Worth confirming the trade.

### 6.5 Minimum viable demo

If only 3 days are available: Phase 1 + Phase 2. Two engines fully bespoke; the rest fall back to text inside the new scene template. The new direction is recognizable.

## 7. Out of scope

- Birth-place geocoding via external API (MVP keeps it as free text).
- Account system / cloud-stored readings (localStorage only).
- Daily horoscope or recurring-reading features.
- Real ephemeris for Vedic / Western (kept as approximations).
- Replacing the engine math (kept as-is — accuracy is not the goal for an art project).
- Solar-terms correction for Bazi month pillar (acceptable approximation).
- Chinese New Year correction for Chinese Zodiac year (acceptable approximation).
- Adding new cultural engines beyond the existing 9.

## 8. Success criteria

- Each cultural engine has a distinct visual identity that reads as belonging to its tradition.
- Each engine surfaces both a cultural-voice and a genome-voice reading.
- The Atlas is a single signature image worth screenshotting and sharing.
- The same input always produces the same Atlas (deterministic Sigil, deterministic DNA, deterministic readings).
- The Genome Lab connects back into the cultural readings — scanning a sequence visibly changes the genome-voice prose and the Sigil aura.
- Fortune Stick functions as a ritual within the Atlas, not a separate screen.
- Couple mode shows pairwise per-engine readings, not just an aggregate score.
- Zero new runtime dependencies.
- Mobile is usable (vertical-fallback Atlas).
