document.addEventListener('DOMContentLoaded', () => {
    const screens = {
        hero: document.getElementById('hero-section'),
        input: document.getElementById('input-section'),
        coupleInput: document.getElementById('couple-input-section'),
        sequencing: document.getElementById('sequencing-section'),
        result: document.getElementById('result-section'),
        coupleResult: document.getElementById('couple-result-section'),
        fortuneStick: document.getElementById('fortune-stick-section')
    };

    // Unified Oracle instance
    const oracle = new UnifiedOracle();

    // Couple Match engine
    const coupleMatch = new CoupleMatch();

    // Store individual results for couple matching
    let cachedResults = { result1: null, result2: null, name1: '', name2: '' };

    // Navigation
    document.getElementById('start-btn').addEventListener('click', () => {
        switchScreen('hero', 'input');
    });

    document.getElementById('couple-btn').addEventListener('click', () => {
        switchScreen('hero', 'coupleInput');
    });

    document.getElementById('couple-back-btn').addEventListener('click', () => {
        switchScreen('coupleInput', 'hero');
    });

    const stickBtn = document.getElementById('stick-mode-btn');
    if (stickBtn) {
        stickBtn.addEventListener('click', () => {
            switchScreen('hero', 'fortuneStick');
        });
    }

    const backStickBtn = document.getElementById('back-to-input-btn');
    if (backStickBtn) {
        backStickBtn.addEventListener('click', () => {
            switchScreen('fortuneStick', 'hero');
        });
    }

    document.getElementById('reset-btn').addEventListener('click', () => {
        document.getElementById('bio-form').reset();
        document.getElementById('file-label').textContent = "Upload Bio-Image data...";
        const stickContainer = document.getElementById('stick-result-container');
        if (stickContainer) stickContainer.classList.add('hidden');
        document.querySelectorAll('.culture-module').forEach(el => el.classList.remove('hidden'));
        switchScreen('result', 'hero');
    });

    document.getElementById('couple-reset-btn').addEventListener('click', () => {
        document.getElementById('couple-form').reset();
        cachedResults = { result1: null, result2: null, name1: '', name2: '' };
        switchScreen('coupleResult', 'hero');
    });

    // Fortune Stick Game Logic
    let isShaking = false;
    const shakeBtn = document.getElementById('shake-btn');
    const cylinder = document.querySelector('.cylinder');

    if (shakeBtn) {
        shakeBtn.addEventListener('click', () => {
            if (isShaking) return;
            isShaking = true;
            shakeBtn.disabled = true;
            shakeBtn.textContent = "Focusing Energy...";

            if (cylinder) cylinder.classList.add('shake-anim');

            setTimeout(() => {
                if (cylinder) cylinder.classList.remove('shake-anim');
                const stickNumber = oracle.castFortuneStick();
                const riddle = oracle.generateStickRiddle(stickNumber);
                showStickResult(stickNumber, riddle);
                isShaking = false;
                shakeBtn.disabled = false;
                shakeBtn.textContent = "Initiate Shake";
            }, 2000);
        });
    }

    function showStickResult(number, riddle) {
        switchScreen('fortuneStick', 'result');
        document.querySelectorAll('.culture-module, .fortune-module:not(.stick-module):not(.full-width):not(.riddle-module)').forEach(el => el.classList.add('hidden'));
        const stickModule = document.getElementById('stick-result-container');
        if (stickModule) {
            stickModule.classList.remove('hidden');
            document.getElementById('stick-number').textContent = number;
            document.getElementById('stick-riddle').textContent = riddle;
        }
        document.getElementById('genome-id').textContent = `STICK-PROTOCOL-${number}`;
    }

    // File Input Helper
    const fileInput = document.getElementById('palm-image');
    const fileLabel = document.getElementById('file-label');
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            fileLabel.textContent = `Data Loaded: ${e.target.files[0].name}`;
        }
    });

    // Single Subject Form
    document.getElementById('bio-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('subject-name').value;
        const date = document.getElementById('birth-date').value;
        const time = document.getElementById('birth-time').value;
        const palmFile = fileInput.files[0];
        if (name && date) runAnalysis(name, date, time, palmFile);
    });

    // Couple Form
    document.getElementById('couple-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name1 = document.getElementById('couple-name1').value.trim();
        const date1 = document.getElementById('couple-date1').value;
        const time1 = document.getElementById('couple-time1').value;
        const name2 = document.getElementById('couple-name2').value.trim();
        const date2 = document.getElementById('couple-date2').value;
        const time2 = document.getElementById('couple-time2').value;
        if (name1 && date1 && name2 && date2) runCoupleAnalysis(name1, date1, time1, name2, date2, time2);
    });

    function switchScreen(fromId, toId) {
        if (screens[fromId]) {
            screens[fromId].classList.add('hidden');
            screens[fromId].classList.remove('fade-in');
        }
        if (screens[toId]) {
            screens[toId].classList.remove('hidden');
            screens[toId].classList.add('fade-in');
        }
        if (toId === 'result' || toId === 'coupleResult') {
            const rc = document.querySelector('.result-card');
            if (rc) rc.scrollTop = 0;
        }
    }

    function runAnalysis(name, date, time, palmFile) {
        switchScreen('input', 'sequencing');
        startDNAAnimation();
        const logs = [
            "Extracting Bio-Data...", "Sequencing Epigenome...", "Computing Bazi Four Pillars...",
            "Consulting I Ching Oracle...", "Reading Thai Horasat Chart...", "Calculating Vedic Nakshatra...",
            "Decoding Aztec Tonalpohualli...", "Mapping Western Zodiac...", "Running Numerology Matrix...",
            palmFile ? "Scanning Palm Topography..." : "Palm scan skipped.", "Synthesizing Cross-Cultural Prophecy..."
        ];
        const logContainer = document.getElementById('status-log');
        logContainer.innerHTML = '';
        let step = 0;
        const interval = setInterval(() => {
            if (step < logs.length) {
                const div = document.createElement('div');
                div.className = 'log-entry';
                div.textContent = logs[step];
                logContainer.appendChild(div);
                step++;
            } else {
                clearInterval(interval);
                stopDNAAnimation();
                showResult(name, date, time, palmFile);
            }
        }, 800);
    }

    function showResult(name, date, time, palmFile) {
        let palmImageData = null;
        if (palmFile) {
            const img = new Image();
            img.onload = () => {
                const c = document.createElement('canvas');
                c.width = img.width; c.height = img.height;
                const ctx = c.getContext('2d');
                ctx.drawImage(img, 0, 0);
                palmImageData = ctx.getImageData(0, 0, c.width, c.height);
                finalizeResult(name, date, time, palmImageData);
            };
            img.onerror = () => finalizeResult(name, date, time, null);
            img.src = URL.createObjectURL(palmFile);
        } else {
            finalizeResult(name, date, time, null);
        }
    }

    function finalizeResult(name, date, time, palmImageData) {
        const result = oracle.analyze(name, date, time, palmImageData);
        renderResults(result);
        switchScreen('sequencing', 'result');
    }

    // ===== Couple Analysis =====
    function runCoupleAnalysis(name1, date1, time1, name2, date2, time2) {
        switchScreen('coupleInput', 'sequencing');
        startDNAAnimation();

        const logs = [
            `Sequencing ${name1}...`, `Sequencing ${name2}...`,
            "Computing Bazi Four Pillars (Alpha)...", "Computing Bazi Four Pillars (Omega)...",
            "Consulting I Ching Oracle...", "Reading Thai Horasat Charts...",
            "Calculating Vedic Nakshatras...", "Mapping Western Zodiacs...",
            "Running Numerology Matrix...", "Cross-referencing DNA Sequences...",
            "Computing Element Resonance...", "Analyzing Zodiac Synergy...",
            "Evaluating Numerology Alignment...", "Synthesizing Bio-Destiny Match..."
        ];

        const logContainer = document.getElementById('status-log');
        logContainer.innerHTML = '';
        let step = 0;
        const interval = setInterval(() => {
            if (step < logs.length) {
                const div = document.createElement('div');
                div.className = 'log-entry';
                div.textContent = logs[step];
                logContainer.appendChild(div);
                step++;
            } else {
                clearInterval(interval);
                stopDNAAnimation();
                showCoupleResult(name1, date1, time1, name2, date2, time2);
            }
        }, 700);
    }

    function showCoupleResult(name1, date1, time1, name2, date2, time2) {
        // Run individual analyses
        const result1 = oracle.analyze(name1, date1, time1, null);
        const result2 = oracle.analyze(name2, date2, time2, null);

        // Run couple matching
        const match = coupleMatch.match(result1, result2, name1, name2);
        renderCoupleResults(match);
        switchScreen('sequencing', 'coupleResult');
    }

    function renderCoupleResults(match) {
        document.getElementById('couple-genome-id').textContent = `REF: ${match.compatId}`;
        document.getElementById('couple-name-display1').textContent = match.name1;
        document.getElementById('couple-name-display2').textContent = match.name2;

        // Compatibility ring
        const percent = Math.round(match.overall * 100);
        document.getElementById('compat-percent').textContent = `${percent}%`;

        const circumference = 314;
        const offset = circumference * (1 - match.overall);
        const ring = document.getElementById('compat-ring');
        ring.style.strokeDashoffset = offset;
        ring.style.stroke = match.tierColor;

        // Tier
        const tierEl = document.getElementById('compat-tier');
        tierEl.textContent = match.tier;
        tierEl.style.color = match.tierColor;

        // Reading
        document.getElementById('compat-reading').textContent = match.reading;

        // Couple DNA
        document.getElementById('couple-dna-sequence').textContent = match.coupleDNA;

        // Dynamic
        document.getElementById('dynamic-title').textContent = `💞 ${match.dynamic.type}`;
        document.getElementById('dynamic-desc').textContent = match.dynamic.desc;

        // Dimension bars
        const grid = document.getElementById('dimension-grid');
        grid.innerHTML = '';
        match.dimensions.forEach((dim, i) => {
            const pct = Math.round(dim.score * 100);
            const bar = document.createElement('div');
            bar.className = 'dimension-bar';
            bar.innerHTML = `
                <span class="dimension-icon">${dim.icon}</span>
                <span class="dimension-name">${dim.name}</span>
                <div class="dimension-track">
                    <div class="dimension-fill" style="width: 0%;" data-target="${pct}"></div>
                </div>
                <span class="dimension-score">${pct}%</span>
            `;
            grid.appendChild(bar);
        });

        // Animate dimension fills
        setTimeout(() => {
            grid.querySelectorAll('.dimension-fill').forEach(el => {
                el.style.width = el.dataset.target + '%';
            });
        }, 200);
    }

    // Couple share
    document.getElementById('couple-share-text-btn')?.addEventListener('click', () => shareCoupleAsText());

    function shareCoupleAsText() {
        const name1 = document.getElementById('couple-name-display1').textContent;
        const name2 = document.getElementById('couple-name-display2').textContent;
        const percent = document.getElementById('compat-percent').textContent;
        const tier = document.getElementById('compat-tier').textContent;
        const dna = document.getElementById('couple-dna-sequence').textContent;
        const reading = document.getElementById('compat-reading').textContent;
        const dynamic = document.getElementById('dynamic-title').textContent;

        const dims = [];
        document.querySelectorAll('.dimension-bar').forEach(bar => {
            const icon = bar.querySelector('.dimension-icon')?.textContent || '';
            const name = bar.querySelector('.dimension-name')?.textContent || '';
            const score = bar.querySelector('.dimension-score')?.textContent || '';
            dims.push(`${icon} ${name}: ${score}`);
        });

        const text = `💞 GENOME FORTUNE — Couple Match\n\nAlpha: ${name1}\nOmega: ${name2}\n\n🧬 Compatibility: ${percent}\nTier: ${tier}\n${dynamic}\n\nCouple DNA: ${dna}\n\n${reading}\n\n--- Dimension Analysis ---\n${dims.join('\n')}\n\n#GenomeFortune`;

        if (navigator.share && navigator.canShare) {
            navigator.share({ title: 'Genome Fortune Couple Match', text }).catch(() => fallbackCopyCouple(text));
        } else {
            fallbackCopyCouple(text);
        }
    }

    function fallbackCopyCouple(text) {
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('couple-share-text-btn');
            if (btn) {
                const orig = btn.textContent;
                btn.textContent = '✅ Copied!';
                setTimeout(() => btn.textContent = orig, 2000);
            }
        });
    }

    // ===== Single Subject Results Rendering =====
    function renderResults(result) {
        document.getElementById('genome-id').textContent = `REF: ${result.id}`;
        document.getElementById('dna-sequence').textContent = result.dnaSequence || '—';
        document.getElementById('main-fortune').textContent = result.fortune || '—';
        document.getElementById('riddle-result').textContent = result.riddle || '—';

        const stickContainer = document.getElementById('stick-result-container');
        if (stickContainer) stickContainer.classList.add('hidden');
        document.querySelectorAll('.culture-module').forEach(el => el.classList.remove('hidden'));

        if (result.bazi) {
            const b = result.bazi;
            document.getElementById('bazi-result').textContent =
                `Year: ${b.yearPillar}\nMonth: ${b.monthPillar}\nDay: ${b.dayPillar}\nHour: ${b.hourPillar}\nDay Master: ${b.dayMaster}\n\n${b.reading}`;
        }
        if (result.iching) {
            const ic = result.iching;
            document.getElementById('iching-result').textContent =
                `Hexagram ${ic.hexagramNumber}: ${ic.name} (${ic.chineseName})\nUpper: ${ic.upperTrigram} | Lower: ${ic.lowerTrigram}\n\nJudgment: ${ic.judgment}\n\n${ic.reading}`;
        }
        if (result.chineseZodiac) {
            const cz = result.chineseZodiac;
            document.getElementById('chinese-zodiac-result').textContent =
                `${cz.animal} — ${cz.element}\n${cz.yinYang}\nLucky: ${cz.luckyNumbers.join(', ')}\n\n${cz.reading}`;
        }
        if (result.thaiHorasat) {
            const th = result.thaiHorasat;
            document.getElementById('thai-horasat-result').textContent =
                `Day: ${th.thaiDay}\nAnimal: ${th.thaiAnimal}\nColor: ${th.dayColor}\nPlanet: ${th.planet}\n\n${th.reading}`;
        }
        if (result.vedic) {
            const v = result.vedic;
            document.getElementById('vedic-result').textContent =
                `Moon Sign: ${v.moonSign}\nNakshatra: ${v.nakshatra} (Pada ${v.nakshatraPada})\nRuling Planet: ${v.rulingPlanet}\nDeity: ${v.deity}\n\n${v.reading}`;
        }
        if (result.western) {
            const w = result.western;
            document.getElementById('western-result').textContent =
                `${w.sunSign}\nElement: ${w.element} | ${w.modality}\nRuling: ${w.rulingPlanet}\nMoon: ${w.moonPhaseName}\n\n${w.reading}`;
        }
        if (result.aztec) {
            const a = result.aztec;
            document.getElementById('aztec-result').textContent =
                `${a.coefficient} ${a.daySign}\n(${a.daySignNahuatl})\nTrecena Lord: ${a.trecena}\nNight Lord: ${a.lordOfNight}\n\n${a.reading}`;
        }
        if (result.numerology) {
            const n = result.numerology;
            document.getElementById('numerology-result').textContent =
                `Pythagorean Life Path: ${n.pythagoreanLifePath}\nChaldean Name Number: ${n.chaldeanNameNumber}\nDestiny Number: ${n.destinyNumber}\nSoul Urge: ${n.soulUrgeNumber}\n\n${n.readings.combined || '—'}`;
        }
        if (result.palm) {
            const p = result.palm;
            let palmText = '';
            if (p.handShapeType) {
                palmText += `Hand Type: ${p.handShapeType} (${p.handShape})\n`;
                palmText += `Line Strength — Life: ${p.lineStrength.lifeLine}% | Heart: ${p.lineStrength.heartLine}% | Head: ${p.lineStrength.headLine}% | Fate: ${p.lineStrength.fateLine}%\n\n`;
            }
            palmText += p.readings.combined || p.reading || 'Upload a palm image for topography analysis.';
            document.getElementById('palm-result').textContent = palmText;
        }
    }

    // ===== SHARE FUNCTIONS (Single) =====
    document.getElementById('share-image-btn')?.addEventListener('click', () => shareAsImage());
    document.getElementById('share-text-btn')?.addEventListener('click', () => shareAsText());
    document.getElementById('share-twitter-btn')?.addEventListener('click', () => shareOnTwitter());

    function shareAsImage() {
        const canvas = document.getElementById('share-canvas');
        const ctx = canvas.getContext('2d');
        const W = 1080, H = 1920;
        canvas.width = W; canvas.height = H;

        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#0a0a0f');
        grad.addColorStop(1, '#0d0020');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 15; i++) {
            ctx.beginPath(); ctx.moveTo(0, Math.random() * H); ctx.lineTo(W, Math.random() * H); ctx.stroke();
        }

        ctx.fillStyle = '#00f3ff';
        ctx.font = 'bold 48px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GENOME FORTUNE', W / 2, 100);
        ctx.fillStyle = '#f0f0f0';
        ctx.font = '28px "Inter", sans-serif';
        ctx.fillText('Bio-Destiny Sequence Report', W / 2, 155);

        ctx.strokeStyle = '#bd00ff';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(100, 185); ctx.lineTo(W - 100, 185); ctx.stroke();

        const subjectName = document.getElementById('subject-name').value || 'Subject';
        const birthDate = document.getElementById('birth-date').value || '';
        ctx.font = '24px "Inter", sans-serif';
        ctx.fillStyle = '#aaa'; ctx.textAlign = 'left';
        ctx.fillText(`Subject: ${subjectName}`, 80, 230);
        ctx.fillText(`Date: ${birthDate}`, 80, 265);
        ctx.font = '18px "Space Mono", monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.textAlign = 'right';
        ctx.fillText(document.getElementById('genome-id').textContent, W - 80, 230);

        let y = 330;
        const lineHeight = 26;
        const sectionGap = 20;
        ctx.textAlign = 'left';

        const sections = [
            { title: 'DNA SEQUENCE', value: document.getElementById('dna-sequence').textContent, color: '#00f3ff' },
            { title: 'THE PROPHECY', value: document.getElementById('main-fortune').textContent, color: '#fff' },
            { title: 'BAZI — FOUR PILLARS', value: document.getElementById('bazi-result').textContent, color: '#bd00ff' },
            { title: 'I CHING HEXAGRAM', value: document.getElementById('iching-result').textContent, color: '#bd00ff' },
            { title: 'CHINESE ZODIAC', value: document.getElementById('chinese-zodiac-result').textContent, color: '#bd00ff' },
            { title: 'THAI HORASAT', value: document.getElementById('thai-horasat-result').textContent, color: '#bd00ff' },
            { title: 'VEDIC JYOTISH', value: document.getElementById('vedic-result').textContent, color: '#bd00ff' },
            { title: 'WESTERN ZODIAC', value: document.getElementById('western-result').textContent, color: '#bd00ff' },
            { title: 'AZTEC TONALPOHUALLI', value: document.getElementById('aztec-result').textContent, color: '#bd00ff' },
        ];

        sections.forEach(s => {
            if (y > H - 100) return;
            ctx.fillStyle = s.color;
            ctx.font = 'bold 20px "Space Mono", monospace';
            ctx.fillText(s.title, 80, y); y += lineHeight;
            ctx.fillStyle = '#ccc';
            ctx.font = '18px "Inter", sans-serif';
            const lines = wrapText(ctx, s.value, W - 160);
            lines.slice(0, 4).forEach(line => { if (y > H - 100) return; ctx.fillText(line, 80, y); y += lineHeight - 4; });
            if (lines.length > 4) { ctx.fillStyle = '#666'; ctx.fillText('...', 80, y); y += lineHeight - 4; }
            y += sectionGap;
        });

        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.font = '16px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('genome-fortune.app', W / 2, H - 60);

        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `genome-fortune-${subjectName.replace(/\s+/g, '-')}.png`; a.click();
            URL.revokeObjectURL(url);
        }, 'image/png');
    }

    function shareAsText() {
        const subjectName = document.getElementById('subject-name').value || 'Subject';
        const genomeId = document.getElementById('genome-id').textContent;
        const sections = [
            `GENOME FORTUNE — ${genomeId}`, `Subject: ${subjectName}`, `Date: ${document.getElementById('birth-date').value}`, '',
            `🧬 ${document.getElementById('dna-sequence').textContent}`, '',
            `🔮 ${document.getElementById('main-fortune').textContent}`, '',
            `🏯 Bazi: ${document.getElementById('bazi-result').textContent}`, '',
            `☰ I Ching: ${document.getElementById('iching-result').textContent}`, '',
            `🐉 Chinese Zodiac: ${document.getElementById('chinese-zodiac-result').textContent}`, '',
            `🇹🇭 Thai Horasat: ${document.getElementById('thai-horasat-result').textContent}`, '',
            `🕉️ Vedic: ${document.getElementById('vedic-result').textContent}`, '',
            `⭐ Western: ${document.getElementById('western-result').textContent}`, '',
            `🌎 Aztec: ${document.getElementById('aztec-result').textContent}`, '',
            `🧩 ${document.getElementById('riddle-result').textContent}`,
        ];
        const text = sections.join('\n');
        if (navigator.share && navigator.canShare) {
            navigator.share({ title: 'Genome Fortune', text }).catch(() => fallbackCopy(text));
        } else {
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('share-text-btn');
            if (btn) { const orig = btn.textContent; btn.textContent = '✅ Copied!'; setTimeout(() => btn.textContent = orig, 2000); }
        });
    }

    function shareOnTwitter() {
        const subjectName = document.getElementById('subject-name').value || 'Subject';
        const fortune = document.getElementById('main-fortune').textContent;
        const text = `🔮 My Genome Fortune reads: "${fortune.substring(0, 120)}${fortune.length > 120 ? '...' : ''}" — ${subjectName} #GenomeFortune`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    }

    function wrapText(ctx, text, maxWidth) {
        const words = (text || '').split(/\s+/);
        const lines = []; let currentLine = '';
        words.forEach(word => {
            const testLine = currentLine ? currentLine + ' ' + word : word;
            if (ctx.measureText(testLine).width > maxWidth && currentLine) { lines.push(currentLine); currentLine = word; }
            else { currentLine = testLine; }
        });
        if (currentLine) lines.push(currentLine);
        return lines;
    }

    // ===== Canvas DNA Animation =====
    let animationId;
    const canvas = document.getElementById('dna-canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() { canvas.width = 300; canvas.height = 300; }
    resizeCanvas();

    function startDNAAnimation() {
        let t = 0;
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Two intertwined helices
            for (let strand = 0; strand < 2; strand++) {
                const offset = strand * Math.PI;
                const color = strand === 0 ? 'rgba(0, 243, 255, 0.6)' : 'rgba(189, 0, 255, 0.6)';
                ctx.fillStyle = color;
                for (let i = 0; i < 20; i++) {
                    const y = (i * 15) + 10;
                    const x = 150 + Math.sin(i * 0.5 + t + offset) * 40;
                    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
                }
            }
            // Rungs
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            for (let i = 0; i < 20; i += 2) {
                const y = (i * 15) + 10;
                const x1 = 150 + Math.sin(i * 0.5 + t) * 40;
                const x2 = 150 + Math.sin(i * 0.5 + t + Math.PI) * 40;
                ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
            }
            t += 0.05;
            animationId = requestAnimationFrame(animate);
        }
        animate();
    }

    function stopDNAAnimation() { cancelAnimationFrame(animationId); }
});
