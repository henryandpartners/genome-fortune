/**
 * GENOME FORTUNE — Genomic Data Engine
 * Handles genomic data input/output, gene regulation simulation,
 * and expression-to-fortune mapping.
 */

const GENOME_ENGINE = (() => {
    // ── Gene Library ──
    const GENES = [
        { id: 'TYR', name: 'Tyrosinase', symbol: 'TYR', category: 'pigment', sequence: 'ATGGCTGTCTCCCACTTCTGGCTTCATCTG', baseline: 60, expr: 60, fortune: 'Your pigment pathways glow — dark secrets will surface as beauty.' },
        { id: 'MC1R', name: 'Melanocortin Receptor', symbol: 'MC1R', category: 'pigment', sequence: 'ATGGACTACAAAGACGATGACGACAAGCTGATC', baseline: 45, expr: 45, fortune: 'The balance of light and dark in your fate shifts — embrace the change.' },
        { id: 'FIB', name: 'Fibroin Heavy Chain', symbol: 'FIB', category: 'structural', sequence: 'ATGGCTACTGGTTCTGGTACTGGCTCTGGTGCTGGT', baseline: 80, expr: 80, fortune: 'Your inner silk strengthens — resilience becomes your greatest asset.' },
        { id: 'SER', name: 'Sericin', symbol: 'SER', category: 'structural', sequence: 'ATGGCAAATGCAAATGCTGCAAATGCTGCTGCT', baseline: 55, expr: 55, fortune: 'The glue that binds your bonds will be tested — but will hold.' },
        { id: 'MITF', name: 'Microphthalmia TF', symbol: 'MITF', category: 'regulatory', sequence: 'ATGCCCGGGCAGCAGCGGCAGGCGAGCAGC', baseline: 40, expr: 40, fortune: 'The master regulator activates — you are about to command your destiny.' },
        { id: 'PAX6', name: 'Paired Box 6', symbol: 'PAX6', category: 'regulatory', sequence: 'ATGGCAGAGCGGCGGCTGAGCCGCCGCCGC', baseline: 35, expr: 35, fortune: 'Sensory patterns form — you will see what others cannot.' },
        { id: 'GFP', name: 'Green Fluorescent Protein', symbol: 'GFP', category: 'reporter', sequence: 'ATGAGTAAAGGAGAAGAACTTTTCACTGGA', baseline: 0, expr: 0, fortune: 'Hidden luminescence waits — under the right conditions, you will glow.' },
        { id: 'HSP70', name: 'Heat Shock Protein 70', symbol: 'HSP70', category: 'stress', sequence: 'ATGGCCGCGATGAAGGAGGTGATCGAAGAG', baseline: 20, expr: 20, fortune: 'Thermal stress reveals your strength — you are forged in heat.' },
        { id: 'LACZ', name: 'Beta-Galactosidase', symbol: 'LACZ', category: 'enzymatic', sequence: 'ATGACCATGATTACGAATTCACTGGCCGTCGTTT', baseline: 0, expr: 0, fortune: 'The blue enzyme stirs — transformation awaits its substrate.' },
        { id: 'OCA2', name: 'OCA2 Melanin Protein', symbol: 'OCA2', category: 'pigment', sequence: 'ATGCGAGCGGGCGGCGGCGGCGGCGGCGGC', baseline: 50, expr: 50, fortune: 'Pigment intensity holds — your depth runs deeper than surface shows.' },
    ];

    // ── Regulatory Elements ──
    const REGULATORY_ELEMENTS = [
        { id: 'CMV', name: 'CMV Promoter', type: 'promoter', sequence: 'GTTACATAACTTACGGT', effect: 90, targets: ['TYR','MC1R','FIB','SER','MITF','PAX6','GFP','LACZ','HSP70','OCA2'] },
        { id: 'TATA', name: 'TATA Box', type: 'promoter', sequence: 'TATAAA', effect: 50, targets: ['TYR','MC1R','FIB','SER','OCA2'] },
        { id: 'MITF_ENH', name: 'MITF Enhancer', type: 'enhancer', sequence: 'CATGTG', effect: 40, targets: ['TYR','MC1R','OCA2'] },
        { id: 'LACI', name: 'LacI Operator', type: 'silencer', sequence: 'AATTGTGAGCGGATAACAATT', effect: -80, targets: ['LACZ','GFP'] },
        { id: 'HSE', name: 'Heat Shock Element', type: 'enhancer', sequence: 'CTTTGAT', effect: 60, targets: ['HSP70'] },
        { id: 'TETO', name: 'Tet-On Operator', type: 'silencer', sequence: 'TCCCTATCAGTGATAGAG', effect: -50, targets: ['GFP','LACZ'] },
        { id: 'WNT', name: 'WNT Response', type: 'enhancer', sequence: 'CTTTGATG', effect: 35, targets: ['MITF','PAX6'] },
    ];

    // ── Gene Network Effects ──
    const NETWORK = [
        { from: 'MITF', to: 'TYR', type: 'activates', strength: 0.85 },
        { from: 'MITF', to: 'OCA2', type: 'activates', strength: 0.70 },
        { from: 'MITF', to: 'MC1R', type: 'activates', strength: 0.60 },
        { from: 'MC1R', to: 'TYR', type: 'activates', strength: 0.50 },
        { from: 'PAX6', to: 'MITF', type: 'activates', strength: 0.40 },
        { from: 'HSP70', to: 'FIB', type: 'represses', strength: 0.30 },
        { from: 'HSP70', to: 'SER', type: 'represses', strength: 0.25 },
        { from: 'LACZ', to: 'GFP', type: 'represses', strength: 0.15 },
    ];

    // ── Core Functions ──

    function scanSequence(sequence) {
        const seq = sequence.toUpperCase().replace(/[^ATGC]/g, '');
        const matches = [];
        const elements = [];

        for (const gene of GENES) {
            const motif = gene.sequence;
            let pos = seq.indexOf(motif);
            while (pos !== -1) {
                matches.push({ geneId: gene.id, geneName: gene.name, position: pos, matchType: 'exact', similarity: 1.0 });
                pos = seq.indexOf(motif, pos + 1);
            }
            // Partial match (70%+ similarity over motif length)
            if (!matches.some(m => m.geneId === gene.id) && seq.length >= motif.length) {
                let best = 0, bp = -1;
                for (let i = 0; i <= seq.length - motif.length; i++) {
                    let sim = 0;
                    for (let j = 0; j < motif.length; j++) if (seq[i + j] === motif[j]) sim++;
                    sim /= motif.length;
                    if (sim > best) { best = sim; bp = i; }
                }
                if (best >= 0.7) {
                    matches.push({ geneId: gene.id, geneName: gene.name, position: bp, matchType: best >= 0.9 ? 'near-exact' : 'partial', similarity: best });
                }
            }
        }

        for (const el of REGULATORY_ELEMENTS) {
            let pos = seq.indexOf(el.sequence);
            while (pos !== -1) {
                elements.push({ elementId: el.id, elementName: el.name, elementType: el.type, position: pos, effect: el.effect });
                pos = seq.indexOf(el.sequence, pos + 1);
            }
        }

        return { genes: matches.sort((a, b) => a.position - b.position), elements: elements.sort((a, b) => a.position - b.position) };
    }

    function computeRegulation(elementMatches) {
        // Clone genes with current expression
        const profiles = GENES.map(g => ({ ...g, current: g.baseline, foldChange: 1.0, regulation: 'neutral', activeRegulators: [] }));
        const map = new Map(profiles.map(p => [p.id, p]));

        // Apply regulatory element effects
        for (const m of elementMatches) {
            const el = REGULATORY_ELEMENTS.find(e => e.id === m.elementId);
            if (el) {
                for (const tid of el.targets) {
                    const p = map.get(tid);
                    if (p) {
                        p.activeRegulators.push(m.elementName);
                        p.current = Math.max(0, Math.min(100, p.current + m.effect * 0.3));
                    }
                }
            }
        }

        // Network propagation (2 iterations)
        for (let iter = 0; iter < 2; iter++) {
            for (const eff of NETWORK) {
                const from = map.get(eff.from);
                const to = map.get(eff.to);
                if (from && to) {
                    const signal = (from.current / 100) * eff.strength * (eff.type === 'activates' ? 1 : -1) * 100;
                    to.current = Math.max(0, Math.min(100, to.current + signal * 0.5));
                }
            }
        }

        // Calculate fold change and regulation type
        for (const p of profiles) {
            p.foldChange = p.baseline > 0 ? p.current / p.baseline : (p.current > 0 ? 10 : 0);
            if (p.current === 0) p.regulation = 'silenced';
            else if (p.foldChange > 1.5) p.regulation = 'up';
            else if (p.foldChange < 0.67) p.regulation = 'down';
            else p.regulation = 'neutral';
        }

        const overall = profiles.reduce((s, p) => s + p.current, 0) / profiles.length;

        // Generate phenotype description
        const upGenes = profiles.filter(p => p.regulation === 'up').map(p => p.symbol);
        const downGenes = profiles.filter(p => p.regulation === 'down').map(p => p.symbol);
        const silencedGenes = profiles.filter(p => p.regulation === 'silenced').map(p => p.symbol);
        let phenotypeDesc = '';
        if (upGenes.length) phenotypeDesc += `Up-regulated: ${upGenes.join(', ')}. `;
        if (downGenes.length) phenotypeDesc += `Down-regulated: ${downGenes.join(', ')}. `;
        if (silencedGenes.length) phenotypeDesc += `Silenced: ${silencedGenes.join(', ')}. `;
        if (!phenotypeDesc) phenotypeDesc = 'Baseline expression — no significant regulation changes detected.';

        // Pattern bias (which patterns the expression favors)
        const patternBias = {
            favoredPatterns: overall > 60 ? ['cellular_automata', 'diffusion', 'mosaic'] : overall > 40 ? ['voronoi', 'wave_interference', 'perlin_noise'] : ['stripe', 'grid', 'codon_tile'],
            complexity: overall > 70 ? 'complex' : overall > 40 ? 'moderate' : 'simple',
            density: overall / 100,
            dominantHue: overall > 60 ? '#a855f7' : overall > 40 ? '#eab308' : '#6b7280',
        };

        // Fortune mapping
        const fortune = computeFortuneFromExpression(profiles, overall);

        return { profiles, overallExpression: overall, phenotypeDescription: phenotypeDesc, patternBias, fortune };
    }

    function computeFortuneFromExpression(profiles, overall) {
        const activeGenes = profiles.filter(p => p.current > 30);
        const regulated = profiles.filter(p => p.regulation !== 'neutral');

        if (activeGenes.length === 0) {
            return 'Your genome rests in quiet equilibrium — the calm before transcription. Patience is your oracle.';
        }

        let fortune = '';
        const pigmentActive = profiles.filter(p => p.category === 'pigment' && p.current > 40).length;
        const regulatoryActive = profiles.filter(p => p.category === 'regulatory' && p.current > 30).length;
        const stressActive = profiles.filter(p => p.category === 'stress' && p.current > 30).length;

        if (pigmentActive > 2) fortune += 'Your pigment pathways blaze — transformation of appearance draws attention from unexpected quarters. ';
        if (regulatoryActive > 1) fortune += 'The master regulators stir — you are entering a phase of command over your own biology. ';
        if (stressActive > 0) fortune += 'Heat shock proteins awaken — the fire you face will forge, not break, you. ';
        if (overall > 70) fortune += 'Your genomic expression surges — a rare convergence of activated pathways heralds a season of creation. ';
        else if (overall > 40) fortune += 'Your genome hums at moderate frequency — steady expression yields steady fortune. ';
        else fortune += 'Your genome rests in a low-expression state — the quiet phase before the next transcription wave. ';

        // Add gene-specific fortune
        const up = profiles.filter(p => p.regulation === 'up');
        if (up.length > 0) {
            const g = up[0];
            fortune += g.fortune;
        }

        return fortune;
    }

    function getGenes() { return [...GENES]; }
    function getRegulatoryElements() { return [...REGULATORY_ELEMENTS]; }

    return {
        scanSequence,
        computeRegulation,
        getGenes,
        getRegulatoryElements,
    };
})();
