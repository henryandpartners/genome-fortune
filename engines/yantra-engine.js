/**
 * YANTRA ENGINE — Sacred Geometry Generator
 * Generates protective yantras based on genomic expression profiles.
 * Each yantra encodes the subject's bio-destiny as geometric mandalas.
 */

const YANTRA_ENGINE = (() => {
    // ── Color Palettes by Category ──
    const CATEGORY_PALETTES = {
        pigment:    { bg: ['#1a0a2e', '#0d0221'], accent: ['#ff6b9d', '#c44569', '#f8a5c2'], glow: '#ff6b9d' },
        regulatory: { bg: ['#0d1b2a', '#0a1628'], accent: ['#00d4ff', '#00a8cc', '#66e3ff'], glow: '#00d4ff' },
        immune:     { bg: ['#0a1a0a', '#051a05'], accent: ['#00ff88', '#00cc6a', '#66ffb3'], glow: '#00ff88' },
        neural:     { bg: ['#1a0a2a', '#150830'], accent: ['#bd00ff', '#9900cc', '#d966ff'], glow: '#bd00ff' },
        longevity:  { bg: ['#1a1a0a', '#1a1505'], accent: ['#ffd700', '#ccaa00', '#ffe866'], glow: '#ffd700' },
        structural: { bg: ['#0a0a0a', '#0f0f1a'], accent: ['#e0e0e0', '#b0b0b0', '#ffffff'], glow: '#e0e0e0' },
        metabolic:  { bg: ['#1a0a0a', '#2a0a0a'], accent: ['#ff4444', '#cc2222', '#ff8888'], glow: '#ff4444' },
        stress:     { bg: ['#0a0a1a', '#050520'], accent: ['#ff8800', '#cc6600', '#ffaa44'], glow: '#ff8800' },
    };

    // ── Sacred Geometry Patterns ──
    function drawYantra(ctx, W, H, result, sequence) {
        const cat = (result.categoryDominance && result.categoryDominance.category) ? result.categoryDominance.category : 'regulatory';
        const palette = CATEGORY_PALETTES[cat] || CATEGORY_PALETTES.regulatory;
        const overall = result.overallExpression || 50;

        // Background
        const bgGrad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W*0.8);
        bgGrad.addColorStop(0, palette.bg[0]);
        bgGrad.addColorStop(1, palette.bg[1]);
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // Seed-based pseudo-random for reproducibility
        const seed = hashSequence(sequence);
        const rng = createRNG(seed);
        const cx = W/2, cy = H/2;

        // ── Layer 1: Outer protective rings (Kosha) ──
        const maxRadius = H * 0.42;
        const rings = 5 + Math.floor(overall / 15); // 5-11 rings
        for (let r = 0; r < rings; r++) {
            const radius = maxRadius * (0.7 + (r / rings) * 0.3);
            const alpha = 0.15 - (r * 0.015);
            ctx.strokeStyle = hexToRgba(palette.accent[0], Math.max(0.03, alpha));
            ctx.lineWidth = 1 + r * 0.3;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.stroke();
        }

        // ── Layer 2: Lotus petals (8-16 based on expression) ──
        const petalCount = 8 + Math.floor(overall / 12); // 8-16 petals
        const petalOuter = maxRadius * 0.65;
        const petalInner = maxRadius * 0.48;

        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * Math.PI * 2 - Math.PI/2;
            const nextAngle = ((i + 0.85) / petalCount) * Math.PI * 2 - Math.PI/2;
            const midAngle = (angle + nextAngle) / 2;

            const x1 = cx + Math.cos(angle) * petalOuter;
            const y1 = cy + Math.sin(angle) * petalOuter;
            const xc = cx + Math.cos(midAngle) * petalInner;
            const yc = cy + Math.sin(midAngle) * petalInner;
            const x2 = cx + Math.cos(nextAngle) * petalOuter;
            const y2 = cy + Math.sin(nextAngle) * petalOuter;

            const petalAlpha = 0.4 + rng() * 0.3;
            const petalColor = palette.accent[i % palette.accent.length];

            ctx.fillStyle = hexToRgba(petalColor, petalAlpha);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.quadraticCurveTo(cx + Math.cos(midAngle) * (petalOuter * 0.85), cy + Math.sin(midAngle) * (petalOuter * 0.85), xc, yc);
            ctx.quadraticCurveTo(cx + Math.cos(midAngle) * (petalOuter * 0.85), cy + Math.sin(midAngle) * (petalOuter * 0.85), x2, y2);
            ctx.fill();

            // Petal outline
            ctx.strokeStyle = hexToRgba(palette.glow, 0.5);
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        // ── Layer 3: Star / Shatkona (hexagram or octagram) ──
        const starPoints = overall > 60 ? 8 : 6;
        const starOuter = maxRadius * 0.45;
        const starInner = starOuter * 0.4;

        for (let s = 0; s < 2; s++) {
            const rotation = (s * Math.PI / starPoints);
            ctx.strokeStyle = hexToRgba(palette.accent[s % palette.accent.length], 0.7);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            for (let i = 0; i <= starPoints; i++) {
                const angle = (i / starPoints) * Math.PI * 2 + rotation - Math.PI/2;
                const r = i % 2 === 0 ? starOuter : starInner;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }

        // ── Layer 4: Concentric geometric mandala rings ──
        for (let ring = 0; ring < 5; ring++) {
            const r = starInner * (0.85 - ring * 0.15);
            const divisions = 24 + ring * 8;
            ctx.strokeStyle = hexToRgba(palette.accent[ring % palette.accent.length], 0.3);
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();

            // Tick marks on ring
            for (let t = 0; t < divisions; t++) {
                const angle = (t / divisions) * Math.PI * 2;
                const tickLen = ring === 0 ? 12 : ring === 1 ? 8 : 5;
                const ir = r - tickLen, or_ = r + 2;
                ctx.strokeStyle = hexToRgba(palette.glow, 0.25);
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(cx + Math.cos(angle) * ir, cy + Math.sin(angle) * ir);
                ctx.lineTo(cx + Math.cos(angle) * or_, cy + Math.sin(angle) * or_);
                ctx.stroke();
            }
        }

        // ── Layer 5: Bija mantras (sacred seed syllables along inner circle) ──
        const bijaMantras = ['ॐ', 'ह्रीं', 'श्रीं', 'क्लीं', 'ऐं', 'हूं', 'फट्'];
        const bijaRadius = starInner * 0.55;
        ctx.font = `${starInner * 0.22}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let b = 0; b < 12; b++) {
            const angle = (b / 12) * Math.PI * 2 - Math.PI/2;
            const bx = cx + Math.cos(angle) * bijaRadius;
            const by = cy + Math.sin(angle) * bijaRadius;
            ctx.fillStyle = hexToRgba(palette.glow, 0.6);
            ctx.fillText(bijaMantras[b % bijaMantras.length], bx, by);
        }

        // ── Layer 6: DNA sequence encoded as spiral dots ──
        if (sequence && sequence.length > 0) {
            const seq = sequence.replace(/\s/g, '').toUpperCase().replace(/[^ATGC]/g, '');
            const dots = Math.min(seq.length, 360);
            const dotRadius = starInner * 0.35;
            const baseColors = { A: '#00ff88', T: '#ff4444', G: '#ffd700', C: '#00d4ff' };
            for (let d = 0; d < dots; d++) {
                const angle = (d / dots) * Math.PI * 2 - Math.PI/2;
                const r = dotRadius * (0.7 + (d / dots) * 0.3);
                const dx = cx + Math.cos(angle) * r;
                const dy = cy + Math.sin(angle) * r;
                ctx.fillStyle = baseColors[seq[d] || 'A'] || palette.accent[0];
                ctx.globalAlpha = 0.5 + (d / dots) * 0.4;
                ctx.beginPath();
                ctx.arc(dx, dy, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }

        // ── Layer 7: Central Bindu (dot) ──
        const binduGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, starInner * 0.12);
        binduGlow.addColorStop(0, 'rgba(255,255,255,0.9)');
        binduGlow.addColorStop(0.3, hexToRgba(palette.glow, 0.6));
        binduGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = binduGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, starInner * 0.12, 0, Math.PI * 2);
        ctx.fill();

        // ── Layer 8: Orbital dots (planets) ──
        const orbitRadii = [starInner * 0.18, starInner * 0.24, starInner * 0.30];
        const orbitSpeeds = [3.7, 2.3, 1.1];
        const orbitCounts = [6, 8, 12];
        for (let o = 0; o < orbitRadii.length; o++) {
            const or = orbitRadii[o];
            for (let p = 0; p < orbitCounts[o]; p++) {
                const angle = (p / orbitCounts[o]) * Math.PI * 2 + (seed % 100) * 0.01 * orbitSpeeds[o];
                const ox = cx + Math.cos(angle) * or;
                const oy = cy + Math.sin(angle) * or;
                ctx.fillStyle = palette.accent[o % palette.accent.length];
                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                ctx.arc(ox, oy, 1.8, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;

        // ── Layer 9: Corner protective marks (digbandha) ──
        const cornerMargin = W * 0.06;
        const cornerSize = W * 0.08;
        drawCornerSeal(ctx, cornerMargin, cornerMargin, cornerSize, palette, seed);
        drawCornerSeal(ctx, W - cornerMargin, cornerMargin, cornerSize, palette, seed + 1);
        drawCornerSeal(ctx, cornerMargin, H - cornerMargin, cornerSize, palette, seed + 2);
        drawCornerSeal(ctx, W - cornerMargin, H - cornerMargin, cornerSize, palette, seed + 3);

        // ── Layer 10: Title and metadata ──
        ctx.fillStyle = hexToRgba(palette.glow, 0.6);
        ctx.font = 'bold 22px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GENOME YANTRA', cx, H * 0.06);

        ctx.font = '13px "Inter", sans-serif';
        ctx.fillStyle = hexToRgba(palette.glow, 0.4);
        const catName = (result.categoryDominance && result.categoryDominance.category) ? result.categoryDominance.category.toUpperCase() : 'REGULATORY';
        ctx.fillText(`${catName} DOMINANT · EXPRESSION ${overall.toFixed(0)}%`, cx, H * 0.09);

        // Sequence hash at bottom
        ctx.font = '10px "Space Mono", monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillText(`SEQ:${seed.toString(16).substring(0, 8).toUpperCase()}`, cx, H * 0.96);
    }

    function drawCornerSeal(ctx, x, y, size, palette, seed) {
        const rng = createRNG(seed);
        ctx.save();
        ctx.translate(x, y);

        // Outer circle
        ctx.strokeStyle = hexToRgba(palette.glow, 0.4);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.stroke();

        // Inner triangle
        ctx.strokeStyle = hexToRgba(palette.accent[0], 0.5);
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2 + Math.PI/6;
            const px = Math.cos(angle) * size * 0.3;
            const py = Math.sin(angle) * size * 0.3;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Dot in center
        ctx.fillStyle = hexToRgba(palette.glow, 0.6);
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function generateYantra(canvas, result, sequence) {
        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        drawYantra(ctx, W, H, result, sequence);
    }

    function downloadYantra(canvas, filename) {
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || 'genome-yantra.png';
            a.click();
            URL.revokeObjectURL(url);
        }, 'image/png');
    }

    // ── Utilities ──
    function hashSequence(seq) {
        let hash = 0;
        const cleaned = seq.toUpperCase().replace(/[^ATGC]/g, '');
        for (let i = 0; i < cleaned.length; i++) {
            const char = cleaned.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
        }
        return Math.abs(hash);
    }

    function createRNG(seed) {
        let s = seed || 42;
        return () => {
            s = (s * 16807 + 0) % 2147483647;
            return (s - 1) / 2147483646;
        };
    }

    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }

    return {
        generateYantra,
        downloadYantra,
        hashSequence,
    };
})();
