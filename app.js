document.addEventListener('DOMContentLoaded', () => {
    const screens = {
        hero: document.getElementById('hero-section'),
        input: document.getElementById('input-section'),
        sequencing: document.getElementById('sequencing-section'),
        result: document.getElementById('result-section'),
        fortuneStick: document.getElementById('fortune-stick-section')
    };

    const oracle = new Oracle();

    // Navigation
    document.getElementById('start-btn').addEventListener('click', () => {
        switchScreen('hero', 'input');
    });

    // New Sticky Mode Button
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
        // Clear form
        document.getElementById('bio-form').reset();
        document.getElementById('file-label').textContent = "Upload Bio-Image data...";

        // Hide stick result if it was shown
        document.getElementById('stick-result-container').classList.add('hidden');

        switchScreen('result', 'hero');
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

            // Find cylinder and animate
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
        // We reuse the Result Screen but hide the other modules
        // Or we could have a dedicated result. For simplicity, let's show it in the Result Screen 
        // effectively treating it as a "Quick Fortune"

        switchScreen('fortuneStick', 'result');

        // Hide normal modules
        const normalModules = document.querySelectorAll('.fortune-module:not(.stick-module)');
        normalModules.forEach(el => el.classList.add('hidden'));

        // Show stick module
        const stickModule = document.getElementById('stick-result-container');
        stickModule.classList.remove('hidden');

        document.getElementById('stick-number').textContent = number;
        document.getElementById('stick-riddle').textContent = riddle;
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

    // Form Submission
    document.getElementById('bio-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('subject-name').value;
        const date = document.getElementById('birth-date').value;
        const time = document.getElementById('birth-time').value;
        const palmFile = fileInput.files[0];

        if (name && date) {
            runAnalysis(name, date, time, palmFile);
        }
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
    }

    function runAnalysis(name, date, time, palmFile) {
        switchScreen('input', 'sequencing');
        startDNAAnimation();

        const logs = [
            "Extracting Bio-Data...",
            "Sequencing Epigenome...",
            "Aligning with Celestial Coordinates...",
            "Scanning Palm Topography...",
            "Synthesizing Prophecy..."
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
        }, 1200);
    }

    function showResult(name, date, time, palmFile) {
        const result = oracle.analyze(name, date, time, palmFile);

        // Show normal modules, hide stick module
        const normalModules = document.querySelectorAll('.fortune-module:not(.stick-module)');
        normalModules.forEach(el => el.classList.remove('hidden'));
        document.getElementById('stick-result-container').classList.add('hidden');

        document.getElementById('genome-id').textContent = `REF: ${result.id}`;
        document.getElementById('numerology-result').textContent = `${result.numerology} detected. Base frequency resonating.`;
        document.getElementById('astrology-result').textContent = `System alignment: ${result.astrology}. \nMarker: ${result.marker}.`;
        document.getElementById('palm-result').textContent = result.palm;
        document.getElementById('main-fortune').textContent = result.fortune;
        document.getElementById('riddle-result').textContent = result.riddle;

        switchScreen('sequencing', 'result');
    }

    // Canvas Animation
    let animationId;
    const canvas = document.getElementById('dna-canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = 300;
        canvas.height = 300;
    }
    resizeCanvas();

    function startDNAAnimation() {
        let t = 0;

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(0, 243, 255, 0.5)';

            // Double Helix Simulation
            for (let i = 0; i < 20; i++) {
                const y = (i * 15) + 10;

                // Strand 1
                const x1 = 150 + Math.sin(i * 0.5 + t) * 40;
                ctx.beginPath();
                ctx.arc(x1, y, 4, 0, Math.PI * 2);
                ctx.fill();

                // Strand 2
                const x2 = 150 + Math.sin(i * 0.5 + t + Math.PI) * 40;
                ctx.beginPath();
                ctx.arc(x2, y, 4, 0, Math.PI * 2);
                ctx.fill();

                // Connector
                if (i % 2 === 0) {
                    ctx.strokeStyle = 'rgba(189, 0, 255, 0.2)';
                    ctx.beginPath();
                    ctx.moveTo(x1, y);
                    ctx.lineTo(x2, y);
                    ctx.stroke();
                }
            }

            t += 0.05;
            animationId = requestAnimationFrame(animate);
        }
        animate();
    }

    function stopDNAAnimation() {
        cancelAnimationFrame(animationId);
    }
});
