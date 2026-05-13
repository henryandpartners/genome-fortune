/**
 * MULTI-SYSTEM NUMEROLOGY ENGINE
 * Pythagorean, Chaldean, Destiny/Expression, Soul Urge
 */

class Numerology {
    constructor() {
        // Pythagorean: A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9
        this.pythagoreanMap = {
            a:1, b:2, c:3, d:4, e:5, f:6, g:7, h:8, i:9,
            j:1, k:2, l:3, m:4, n:5, o:6, p:7, q:8, r:9,
            s:1, t:2, u:3, v:4, w:5, x:6, y:7, z:8
        };

        // Chaldean: different assignments
        this.chaldeanMap = {
            a:1, b:2, c:3, d:4, e:5, f:8, g:3, h:5, i:1,
            j:1, k:2, l:3, m:4, n:5, o:7, p:8, q:1, r:2,
            s:3, t:4, u:6, v:6, w:6, x:5, y:1, z:7
        };

        this.vowels = new Set(['a', 'e', 'i', 'o', 'u']);

        this.lifePathReadings = {
            1: 'The Leader — Independent, pioneering, original. Your path is one of self-reliance and innovation. You are here to stand alone and lead by example.',
            2: 'The Diplomat — Cooperative, sensitive, balanced. Your path involves partnership and mediation. You bring harmony to discord and unite opposing forces.',
            3: 'The Creator — Expressive, artistic, joyful. Your path is one of self-expression and inspiration. You uplift others through creativity and communication.',
            4: 'The Builder — Disciplined, practical, stable. Your path involves creating lasting foundations. You are the architect of enduring structures.',
            5: 'The Adventurer — Free, dynamic, versatile. Your path is one of change and experience. Freedom is your compass and adaptability your gift.',
            6: 'The Nurturer — Responsible, loving, protective. Your path centers on home, family, and service. You heal and protect those in your orbit.',
            7: 'The Seeker — Analytical, spiritual, introspective. Your path is one of inner wisdom and truth-seeking. You penetrate beneath the surface of all things.',
            8: 'The Achiever — Ambitious, authoritative, material mastery. Your path involves power and abundance. You manifest the material through focused will.',
            9: 'The Humanitarian — Compassionate, wise, universal. Your path is one of service to humanity. You carry the wisdom of all numbers and give selflessly.',
            11: 'The Intuitive (Master) — Illuminating, visionary, spiritually aware. You channel higher consciousness and inspire through spiritual insight.',
            22: 'The Master Builder — Turning grand visions into reality. You combine spiritual insight with practical power to build monuments for humanity.',
            33: 'The Master Teacher — Selfless devotion to spiritual upliftment. You embody compassion and serve as a channel for universal healing energy.'
        };

        this.soulUrgeReadings = {
            1: 'Your heart desires independence and achievement.',
            2: 'Your heart craves harmony and deep partnership.',
            3: 'Your heart yearns for creative self-expression.',
            4: 'Your heart seeks stability and order.',
            5: 'Your heart hungers for freedom and adventure.',
            6: 'Your heart needs to nurture and create beauty.',
            7: 'Your heart seeks truth and spiritual understanding.',
            8: 'Your heart desires power and material accomplishment.',
            9: 'Your heart is devoted to universal love and service.'
        };
    }

    _reduceToSingle(num, allowMasters = true) {
        while (num > 9) {
            if (allowMasters && (num === 11 || num === 22 || num === 33)) return num;
            num = String(num).split('').map(Number).reduce((a, b) => a + b, 0);
        }
        return num;
    }

    _sumString(str, map) {
        let sum = 0;
        for (const char of str.toLowerCase()) {
            if (map[char]) sum += map[char];
        }
        return sum;
    }

    analyze(name, birthDate) {
        // Parse birth date
        const parts = birthDate.split('-'); // YYYY-MM-DD
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const day = parseInt(parts[2]);

        // 1. Pythagorean Life Path Number
        const monthReduced = this._reduceToSingle(month);
        const dayReduced = this._reduceToSingle(day);
        const yearSum = String(year).split('').map(Number).reduce((a, b) => a + b, 0);
        const yearReduced = this._reduceToSingle(yearSum);
        const lifePathRaw = monthReduced + dayReduced + yearReduced;
        const lifePath = this._reduceToSingle(lifePathRaw);

        // 2. Chaldean Name Number
        const chaldeanSum = this._sumString(name, this.chaldeanMap);
        const chaldeanNumber = this._reduceToSingle(chaldeanSum);

        // 3. Destiny/Expression Number (Pythagorean sum of full name)
        const pythagoreanSum = this._sumString(name, this.pythagoreanMap);
        const destinyNumber = this._reduceToSingle(pythagoreanSum);

        // 4. Soul Urge Number (sum of vowels only, Pythagorean)
        let vowelSum = 0;
        for (const char of name.toLowerCase()) {
            if (this.vowels.has(char) && this.pythagoreanMap[char]) {
                vowelSum += this.pythagoreanMap[char];
            }
        }
        const soulUrgeNumber = this._reduceToSingle(vowelSum);

        const combined = `${this.lifePathReadings[lifePath] || ''}\n\nSoul Urge: ${this.soulUrgeReadings[soulUrgeNumber] || ''}`;

        return {
            pythagoreanLifePath: lifePath,
            chaldeanNameNumber: chaldeanNumber,
            destinyNumber,
            soulUrgeNumber,
            readings: {
                lifePath: this.lifePathReadings[lifePath] || '',
                soulUrge: this.soulUrgeReadings[soulUrgeNumber] || '',
                combined
            }
        };
    }
}

if (typeof module !== 'undefined' && module.exports) { module.exports = Numerology; }
