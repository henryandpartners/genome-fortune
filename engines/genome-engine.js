/**
 * GENOME FORTUNE — Genomic Data Engine
 * Handles genomic data input/output, gene regulation simulation,
 * and expression-to-fortune mapping.
 */

const GENOME_ENGINE = (() => {
    // ── Gene Library ──
    const GENES = [
        // Pigment genes
        { id: 'TYR', name: 'Tyrosinase', symbol: 'TYR', category: 'pigment', sequence: 'ATGGCTGTCTCCCACTTCTGGCTTCATCTG', baseline: 60, expr: 60, fortune: 'Your pigment pathways glow — dark secrets will surface as beauty.' },
        { id: 'MC1R', name: 'Melanocortin Receptor', symbol: 'MC1R', category: 'pigment', sequence: 'ATGGACTACAAAGACGATGACGACAAGCTGATC', baseline: 45, expr: 45, fortune: 'The balance of light and dark in your fate shifts — embrace the change.' },
        { id: 'OCA2', name: 'OCA2 Melanin Protein', symbol: 'OCA2', category: 'pigment', sequence: 'ATGCGAGCGGGCGGCGGCGGCGGCGGCGGC', baseline: 50, expr: 50, fortune: 'Pigment intensity holds — your depth runs deeper than surface shows.' },
        { id: 'ASIP', name: 'Agouti Signaling Protein', symbol: 'ASIP', category: 'pigment', sequence: 'ATGGATGTGCGCACGCTGCGCCTCCTGCTGGCC', baseline: 35, expr: 35, fortune: 'The agouti signal switches — your patterns of attraction are being rewritten.' },
        { id: 'KITLG', name: 'KIT Ligand', symbol: 'KITLG', category: 'pigment', sequence: 'ATGAAGAAGACACAAACTTGGATTCTCACTTGC', baseline: 40, expr: 40, fortune: 'Migration signals activate — ancestral journeys echo in your cells.' },

        // Structural genes
        { id: 'FIB', name: 'Fibroin Heavy Chain', symbol: 'FIB', category: 'structural', sequence: 'ATGGCTACTGGTTCTGGTACTGGCTCTGGTGCTGGT', baseline: 80, expr: 80, fortune: 'Your inner silk strengthens — resilience becomes your greatest asset.' },
        { id: 'SER', name: 'Sericin', symbol: 'SER', category: 'structural', sequence: 'ATGGCAAATGCAAATGCTGCAAATGCTGCTGCT', baseline: 55, expr: 55, fortune: 'The glue that binds your bonds will be tested — but will hold.' },
        { id: 'COL1A1', name: 'Collagen Type I Alpha 1', symbol: 'COL1A1', category: 'structural', sequence: 'ATGTTCAGCTTTGTGGACCTCCGGCTCCTGCTC', baseline: 75, expr: 75, fortune: 'Your structural integrity is ancient — collagen whispers of deep time endurance.' },
        { id: 'ELN', name: 'Elastin', symbol: 'ELN', category: 'structural', sequence: 'ATGGCCGGTCTGACCGCCGCGGCCGCGGGTGCC', baseline: 65, expr: 65, fortune: 'Elastic resilience bends but never breaks — your flexibility is your fortress.' },
        { id: 'KRT14', name: 'Keratin 14', symbol: 'KRT14', category: 'structural', sequence: 'ATGACTACCTCCATCCGCCGCCGCTCCAGCTCC', baseline: 70, expr: 70, fortune: 'Keratin shields rise — the boundary between you and the world strengthens.' },

        // Regulatory genes
        { id: 'MITF', name: 'Microphthalmia TF', symbol: 'MITF', category: 'regulatory', sequence: 'ATGCCCGGGCAGCAGCGGCAGGCGAGCAGC', baseline: 40, expr: 40, fortune: 'The master regulator activates — you are about to command your destiny.' },
        { id: 'PAX6', name: 'Paired Box 6', symbol: 'PAX6', category: 'regulatory', sequence: 'ATGGCAGAGCGGCGGCTGAGCCGCCGCCGC', baseline: 35, expr: 35, fortune: 'Sensory patterns form — you will see what others cannot.' },
        { id: 'SOX2', name: 'SRY-Box 2', symbol: 'SOX2', category: 'regulatory', sequence: 'ATGTACAACATGATGGAGACGGAGCTGAAGC', baseline: 30, expr: 30, fortune: 'Stemness awakens — you carry the potential to become anything.' },
        { id: 'OCT4', name: 'Octamer-Binding TF 4', symbol: 'OCT4', category: 'regulatory', sequence: 'ATGGCGGGACACCTGGCTTCGGATTTCGCCTT', baseline: 25, expr: 25, fortune: 'Pluripotency stirs — the blank slate of your future awaits inscription.' },
        { id: 'P53', name: 'Tumor Protein P53', symbol: 'P53', category: 'regulatory', sequence: 'ATGGAGGAGCCGCAGTCAGATCCTAGCGTCGA', baseline: 55, expr: 55, fortune: 'The guardian watches — you are protected by ancient cellular wisdom.' },

        // Immune genes
        { id: 'TLR4', name: 'Toll-Like Receptor 4', symbol: 'TLR4', category: 'immune', sequence: 'ATGATGTCTGCCTCGCGCCTGGCTGTGCTGCTG', baseline: 45, expr: 45, fortune: 'Pattern recognition sharpens — you detect threats before they manifest.' },
        { id: 'IL6', name: 'Interleukin 6', symbol: 'IL6', category: 'immune', sequence: 'ATGAACTCCTTCTCCACAAGCGCCTTCGGTCC', baseline: 30, expr: 30, fortune: 'Inflammatory signals calibrate — your internal fire knows when to burn and when to rest.' },
        { id: 'HLA_B', name: 'HLA Class I B', symbol: 'HLA_B', category: 'immune', sequence: 'ATGCTGGTCATGGCGCCCCGCACCCTCCTCCTG', baseline: 60, expr: 60, fortune: 'Self-recognition attunes — your immune identity broadcasts clearly to the universe.' },
        { id: 'IFNG', name: 'Interferon Gamma', symbol: 'IFNG', category: 'immune', sequence: 'ATGAAATATACAAGTTATATCTTGGCTTTTCAG', baseline: 25, expr: 25, fortune: 'Antiviral vigilance heightens — your cellular borders are patrolled by light.' },

        // Neural genes
        { id: 'BDNF', name: 'Brain-Derived Neurotrophic Factor', symbol: 'BDNF', category: 'neural', sequence: 'ATGACCATCCTTTTCCTTACTATGGTTATTTC', baseline: 50, expr: 50, fortune: 'Neural gardens bloom — new synaptic pathways form in the soil of experience.' },
        { id: 'DRD4', name: 'Dopamine Receptor D4', symbol: 'DRD4', category: 'neural', sequence: 'ATGGGCAACCGCAGCACGGTCTCTGACCTCCG', baseline: 40, expr: 40, fortune: 'Reward pathways recalibrate — your dopamine compass points toward novel horizons.' },
        { id: 'COMT', name: 'Catechol-O-Methyltransferase', symbol: 'COMT', category: 'neural', sequence: 'ATGCTGGAGATCGCCATGCTGCGCCTGCTGCTG', baseline: 55, expr: 55, fortune: 'Neurotransmitter clearance balances — your mental clarity sharpens like winter air.' },
        { id: 'SLC6A4', name: 'Serotonin Transporter', symbol: 'SLC6A4', category: 'neural', sequence: 'ATGGAGACGACGCCCTCCGAGGAGGTGGAGCCG', baseline: 45, expr: 45, fortune: 'Serotonin reuptake modulates — contentment flows at the molecular pace of peace.' },

        // Longevity / stress genes
        { id: 'SIRT1', name: 'Sirtuin 1', symbol: 'SIRT1', category: 'longevity', sequence: 'ATGGCGGACGAGGCGGCCCTCGCCCTTCAGCCG', baseline: 50, expr: 50, fortune: 'The sirtuin clock slows — your cellular age bends to the will of your discipline.' },
        { id: 'FOXO3', name: 'Forkhead Box O3', symbol: 'FOXO3', category: 'longevity', sequence: 'ATGGCAGAGGCGCCGGCGTCGCCGCTGTCGCCG', baseline: 45, expr: 45, fortune: 'Longevity pathways open — the forkhead gene blesses you with extended seasons.' },
        { id: 'MTOR', name: 'Mechanistic Target of Rapamycin', symbol: 'MTOR', category: 'longevity', sequence: 'ATGCTGGGAACCGGCCTGGCCTGGCGCTGCGCG', baseline: 60, expr: 60, fortune: 'Metabolic master switch calibrates — growth and rest find their sacred rhythm.' },
        { id: 'HSP70', name: 'Heat Shock Protein 70', symbol: 'HSP70', category: 'stress', sequence: 'ATGGCCGCGATGAAGGAGGTGATCGAAGAG', baseline: 20, expr: 20, fortune: 'Thermal stress reveals your strength — you are forged in heat.' },
        { id: 'HSP90', name: 'Heat Shock Protein 90', symbol: 'HSP90', category: 'stress', sequence: 'ATGCCTGAGGAAGTGCACCATGGGGAGGAGGAG', baseline: 25, expr: 25, fortune: 'Chaperone networks mobilize — misfolded fate is refolded into proper destiny.' },

        // Metabolic genes
        { id: 'PPARG', name: 'Peroxisome Proliferator-Activated Receptor Gamma', symbol: 'PPARG', category: 'metabolic', sequence: 'ATGGGTGAAACTCTGGGAGATTCTCCTATTGAC', baseline: 50, expr: 50, fortune: 'Lipid wisdom awakens — your metabolic flame burns clean and efficient.' },
        { id: 'ADRB2', name: 'Beta-2 Adrenergic Receptor', symbol: 'ADRB2', category: 'metabolic', sequence: 'ATGGGGCAACCCGGGAACGGGAGCGCCCTTCT', baseline: 45, expr: 45, fortune: 'Adrenergic signals peak — your fight-or-flight is refined into dance-or-deliver.' },

        // Reporter / enzymatic genes
        { id: 'GFP', name: 'Green Fluorescent Protein', symbol: 'GFP', category: 'reporter', sequence: 'ATGAGTAAAGGAGAAGAACTTTTCACTGGA', baseline: 0, expr: 0, fortune: 'Hidden luminescence waits — under the right conditions, you will glow.' },
        { id: 'LACZ', name: 'Beta-Galactosidase', symbol: 'LACZ', category: 'enzymatic', sequence: 'ATGACCATGATTACGAATTCACTGGCCGTCGTTT', baseline: 0, expr: 0, fortune: 'The blue enzyme stirs — transformation awaits its substrate.' },
        { id: 'LUC', name: 'Luciferase', symbol: 'LUC', category: 'enzymatic', sequence: 'ATGGAAGACGCCAAAAACATAAAGAAAGGCCCG', baseline: 5, expr: 5, fortune: 'Bioluminescence kindles — your inner light is measured in photons of purpose.' },
    ];

    // ── Regulatory Elements ──
    const REGULATORY_ELEMENTS = [
        { id: 'CMV', name: 'CMV Promoter', type: 'promoter', sequence: 'GTTACATAACTTACGGT', effect: 90, targets: ['TYR','MC1R','FIB','SER','MITF','PAX6','GFP','LACZ','HSP70','OCA2','SOX2','OCT4','KRT14','COL1A1','ELN','BDNF','TLR4','IL6','SIRT1','FOXO3','PPARG','LUC','IFNG','ADRB2','P53'] },
        { id: 'TATA', name: 'TATA Box', type: 'promoter', sequence: 'TATAAA', effect: 50, targets: ['TYR','MC1R','FIB','SER','OCA2','KRT14','ELN','BDNF','DRD4','SLC6A4','COMT','PPARG'] },
        { id: 'MITF_ENH', name: 'MITF Enhancer', type: 'enhancer', sequence: 'CATGTG', effect: 40, targets: ['TYR','MC1R','OCA2','ASIP','KITLG'] },
        { id: 'LACI', name: 'LacI Operator', type: 'silencer', sequence: 'AATTGTGAGCGGATAACAATT', effect: -80, targets: ['LACZ','GFP','LUC'] },
        { id: 'HSE', name: 'Heat Shock Element', type: 'enhancer', sequence: 'CTTTGAT', effect: 60, targets: ['HSP70','HSP90','SIRT1','FOXO3','P53'] },
        { id: 'TETO', name: 'Tet-On Operator', type: 'silencer', sequence: 'TCCCTATCAGTGATAGAG', effect: -50, targets: ['GFP','LACZ','LUC'] },
        { id: 'WNT', name: 'WNT Response', type: 'enhancer', sequence: 'CTTTGATG', effect: 35, targets: ['MITF','PAX6','SOX2','OCT4'] },
        { id: 'NFKB', name: 'NF-kB Response', type: 'enhancer', sequence: 'GGGACTTTCC', effect: 45, targets: ['IL6','TLR4','IFNG','HLA_B','P53'] },
        { id: 'CREB', name: 'CREB Response Element', type: 'enhancer', sequence: 'TGACGTCA', effect: 40, targets: ['BDNF','COMT','SLC6A4','DRD4','PPARG'] },
        { id: 'ERR', name: 'Estrogen-Related Response', type: 'enhancer', sequence: 'AGGTCANNNGGGTCA', effect: 35, targets: ['COL1A1','ELN','SIRT1','FOXO3','MTOR'] },
    ];

    // ── Gene Network Effects ──
    const NETWORK = [
        // Pigment cascade
        { from: 'MITF', to: 'TYR', type: 'activates', strength: 0.85 },
        { from: 'MITF', to: 'OCA2', type: 'activates', strength: 0.70 },
        { from: 'MITF', to: 'MC1R', type: 'activates', strength: 0.60 },
        { from: 'MITF', to: 'ASIP', type: 'represses', strength: 0.40 },
        { from: 'MC1R', to: 'TYR', type: 'activates', strength: 0.50 },
        { from: 'KITLG', to: 'MITF', type: 'activates', strength: 0.55 },
        // Developmental
        { from: 'PAX6', to: 'MITF', type: 'activates', strength: 0.40 },
        { from: 'SOX2', to: 'OCT4', type: 'activates', strength: 0.80 },
        { from: 'SOX2', to: 'PAX6', type: 'activates', strength: 0.45 },
        { from: 'OCT4', to: 'SOX2', type: 'activates', strength: 0.75 },
        { from: 'P53', to: 'OCT4', type: 'represses', strength: 0.50 },
        // Structural
        { from: 'KRT14', to: 'COL1A1', type: 'activates', strength: 0.35 },
        { from: 'COL1A1', to: 'ELN', type: 'activates', strength: 0.30 },
        { from: 'HSP70', to: 'FIB', type: 'represses', strength: 0.30 },
        { from: 'HSP70', to: 'SER', type: 'represses', strength: 0.25 },
        { from: 'HSP90', to: 'COL1A1', type: 'activates', strength: 0.40 },
        // Immune
        { from: 'TLR4', to: 'IL6', type: 'activates', strength: 0.65 },
        { from: 'TLR4', to: 'IFNG', type: 'activates', strength: 0.55 },
        { from: 'IL6', to: 'HLA_B', type: 'activates', strength: 0.40 },
        { from: 'IFNG', to: 'HLA_B', type: 'activates', strength: 0.50 },
        { from: 'P53', to: 'TLR4', type: 'activates', strength: 0.35 },
        // Neural
        { from: 'BDNF', to: 'DRD4', type: 'activates', strength: 0.40 },
        { from: 'BDNF', to: 'SLC6A4', type: 'activates', strength: 0.35 },
        { from: 'DRD4', to: 'COMT', type: 'activates', strength: 0.30 },
        { from: 'COMT', to: 'SLC6A4', type: 'represses', strength: 0.25 },
        // Longevity / metabolic
        { from: 'SIRT1', to: 'FOXO3', type: 'activates', strength: 0.70 },
        { from: 'SIRT1', to: 'P53', type: 'represses', strength: 0.40 },
        { from: 'FOXO3', to: 'MTOR', type: 'represses', strength: 0.45 },
        { from: 'MTOR', to: 'PPARG', type: 'represses', strength: 0.35 },
        { from: 'PPARG', to: 'ADRB2', type: 'activates', strength: 0.30 },
        { from: 'ADRB2', to: 'HSP70', type: 'activates', strength: 0.25 },
        // Cross-system
        { from: 'HSP70', to: 'TLR4', type: 'activates', strength: 0.30 },
        { from: 'SIRT1', to: 'BDNF', type: 'activates', strength: 0.50 },
        { from: 'IL6', to: 'HSP70', type: 'activates', strength: 0.35 },
        { from: 'P53', to: 'SIRT1', type: 'activates', strength: 0.25 },
        // Reporter
        { from: 'LACZ', to: 'GFP', type: 'represses', strength: 0.15 },
        { from: 'LUC', to: 'GFP', type: 'activates', strength: 0.10 },
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

        // Category-dominant hue for yantra
        const catDominance = computeCategoryDominance(profiles);

        return { profiles, overallExpression: overall, phenotypeDescription: phenotypeDesc, patternBias, fortune, categoryDominance: catDominance };
    }

    function computeFortuneFromExpression(profiles, overall) {
        const activeGenes = profiles.filter(p => p.current > 30);
        const regulated = profiles.filter(p => p.regulation !== 'neutral');

        if (activeGenes.length === 0) {
            return 'Your genome rests in quiet equilibrium — the calm before transcription. Patience is your oracle. The void precedes all creation; your silence is sacred.';
        }

        let fortune = '';

        // Category analysis
        const pigmentActive = profiles.filter(p => p.category === 'pigment' && p.current > 40).length;
        const regulatoryActive = profiles.filter(p => p.category === 'regulatory' && p.current > 30).length;
        const stressActive = profiles.filter(p => p.category === 'stress' && p.current > 30).length;
        const immuneActive = profiles.filter(p => p.category === 'immune' && p.current > 35).length;
        const neuralActive = profiles.filter(p => p.category === 'neural' && p.current > 40).length;
        const longevityActive = profiles.filter(p => p.category === 'longevity' && p.current > 45).length;
        const structuralActive = profiles.filter(p => p.category === 'structural' && p.current > 50).length;

        if (pigmentActive > 2) fortune += 'Your pigment pathways blaze — transformation of appearance draws attention from unexpected quarters. ';
        else if (pigmentActive > 0) fortune += 'Pigment genes stir softly — subtle shifts in how the world perceives you are underway. ';

        if (regulatoryActive > 1) fortune += 'The master regulators stir — you are entering a phase of command over your own biology. ';
        else if (regulatoryActive > 0) fortune += 'A single regulator awakens — one choice cascades into destiny. ';

        if (immuneActive > 2) fortune += 'Immune vigilance peaks — your internal defenses recognize friend from foe with unerring precision. ';
        else if (immuneActive > 0) fortune += 'Immune memory consolidates — past battles inform future protection. ';

        if (neuralActive > 2) fortune += 'Neural gardens bloom — synaptic fireworks herald a season of clarity and creativity. ';
        else if (neuralActive > 0) fortune += 'A neural spark ignites — a single insight changes everything. ';

        if (longevityActive > 1) fortune += 'Longevity pathways converge — the sirtuin-forkhead axis blesses your timeline with grace. ';
        else if (longevityActive > 0) fortune += 'One longevity gene hums — your cells remember how to repair. ';

        if (stressActive > 0) fortune += 'Heat shock proteins awaken — the fire you face will forge, not break, you. ';
        if (structuralActive > 2) fortune += 'Structural integrity fortifies — your foundation, literal and metaphorical, is unshakeable. ';

        if (overall > 70) fortune += 'Your genomic expression surges — a rare convergence of activated pathways heralds a season of creation. ';
        else if (overall > 40) fortune += 'Your genome hums at moderate frequency — steady expression yields steady fortune. ';
        else fortune += 'Your genome rests in a low-expression state — the quiet phase before the next transcription wave. ';

        // Add top 3 gene-specific fortunes
        const up = profiles.filter(p => p.regulation === 'up').sort((a, b) => b.foldChange - a.foldChange);
        const topUp = up.slice(0, 3);
        for (const g of topUp) {
            fortune += g.fortune + ' ';
        }

        return fortune.trim();
    }

    function computeCategoryDominance(profiles) {
        const cats = {};
        for (const p of profiles) {
            if (!cats[p.category]) cats[p.category] = 0;
            cats[p.category] += p.current;
        }
        let topCat = 'regulatory';
        let topVal = 0;
        for (const [cat, val] of Object.entries(cats)) {
            if (val > topVal) { topVal = val; topCat = cat; }
        }
        return { category: topCat, score: topVal / profiles.filter(p => p.category === topCat).length, allCategories: cats };
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
