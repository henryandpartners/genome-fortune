/**
 * WESTERN ASTROLOGY ENGINE
 * Calculates sun sign, moon phase, element, modality, ruling planet.
 */

class WesternAstrology {
    constructor() {
        this.sunSigns = [
            { name: 'Capricorn', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19, element: 'Earth', modality: 'Cardinal', ruler: 'Saturn' },
            { name: 'Aquarius', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18, element: 'Air', modality: 'Fixed', ruler: 'Uranus' },
            { name: 'Pisces', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20, element: 'Water', modality: 'Mutable', ruler: 'Neptune' },
            { name: 'Aries', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19, element: 'Fire', modality: 'Cardinal', ruler: 'Mars' },
            { name: 'Taurus', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20, element: 'Earth', modality: 'Fixed', ruler: 'Venus' },
            { name: 'Gemini', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20, element: 'Air', modality: 'Mutable', ruler: 'Mercury' },
            { name: 'Cancer', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22, element: 'Water', modality: 'Cardinal', ruler: 'Moon' },
            { name: 'Leo', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22, element: 'Fire', modality: 'Fixed', ruler: 'Sun' },
            { name: 'Virgo', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22, element: 'Earth', modality: 'Mutable', ruler: 'Mercury' },
            { name: 'Libra', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22, element: 'Air', modality: 'Cardinal', ruler: 'Venus' },
            { name: 'Scorpio', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21, element: 'Water', modality: 'Fixed', ruler: 'Pluto' },
            { name: 'Sagittarius', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21, element: 'Fire', modality: 'Mutable', ruler: 'Jupiter' }
        ];

        this.moonPhases = [
            { name: 'New Moon', description: 'New beginnings, intention setting, blank slate' },
            { name: 'Waxing Crescent', description: 'Growth, attraction, building momentum' },
            { name: 'First Quarter', description: 'Action, decisions, overcoming obstacles' },
            { name: 'Waxing Gibbous', description: 'Refinement, adjustment, nearing completion' },
            { name: 'Full Moon', description: 'Culmination, illumination, peak energy' },
            { name: 'Waning Gibbous', description: 'Gratitude, sharing, dissemination' },
            { name: 'Last Quarter', description: 'Release, forgiveness, letting go' },
            { name: 'Balsamic', description: 'Surrender, rest, preparation for rebirth' }
        ];

        this.signReadings = [
            'Ambition and discipline shape your destiny. You climb mountains others fear to approach. Saturn\'s patience rewards your perseverance with lasting power.',
            'Innovation and rebellion define your path. You see the future before others. Uranus electrifies your vision — you are the bridge to tomorrow.',
            'Dreams and intuition are your compass. Neptune wraps you in mystery and compassion. You feel the unseen and heal through empathy.',
            'Courage and initiative ignite your life. Mars fuels your pioneering spirit. You lead by charging ahead where others hesitate.',
            'Stability and sensuality ground your nature. Venus blesses you with appreciation for beauty and comfort. You build lasting wealth through patience.',
            'Communication and curiosity drive your journey. Mercury gifts you with wit and versatility. You connect ideas and people like no other.',
            'Emotion and nurturing define your essence. The Moon governs your intuitive depth. You create home wherever you go, protecting those you love.',
            'Creativity and leadership shine in your path. The Sun radiates through your presence. You command attention and inspire through sheer vitality.',
            'Service and precision mark your contribution. Mercury sharpens your analytical mind. You perfect what others overlook and heal through attention to detail.',
            'Balance and harmony guide your choices. Venus teaches you the art of partnership. You see all sides and mediate with grace.',
            'Depth and transformation are your domain. Pluto and Mars give you penetrating insight. You regenerate from ashes, emerging stronger each time.',
            'Freedom and philosophy expand your horizon. Jupiter blesses you with optimism and wanderlust. You seek truth in distant lands and big ideas.'
        ];
    }

    _getSunSign(date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();

        for (const sign of this.sunSigns) {
            if (sign.startMonth === 12) {
                // Capricorn straddles year boundary
                if ((month === 12 && day >= sign.startDay) || (month === 1 && day <= sign.endDay)) {
                    return sign;
                }
            } else if (month === sign.startMonth && day >= sign.startDay) {
                return sign;
            } else if (month === sign.endMonth && day <= sign.endDay) {
                return sign;
            }
        }
        return this.sunSigns[0]; // fallback
    }

    /**
     * Calculate approximate moon phase using synodic month
     * Known new moon reference: January 6, 2000
     * Synodic month: 29.53058867 days
     */
    _getMoonPhase(date) {
        const knownNewMoon = new Date(2000, 0, 6);
        const synodicMonth = 29.53058867;
        const diffTime = date.getTime() - knownNewMoon.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        const phase = ((diffDays % synodicMonth) + synodicMonth) % synodicMonth;
        const phaseIndex = Math.floor((phase / synodicMonth) * 8) % 8;
        return this.moonPhases[phaseIndex];
    }

    analyze(dateStr) {
        const date = new Date(dateStr);
        const sign = this._getSunSign(date);
        const moonPhase = this._getMoonPhase(date);
        const signIndex = this.sunSigns.indexOf(sign);

        return {
            sunSign: sign.name,
            element: sign.element,
            modality: sign.modality,
            rulingPlanet: sign.ruler,
            moonPhase: moonPhase.name,
            moonPhaseName: moonPhase.name,
            moonDescription: moonPhase.description,
            reading: this.signReadings[signIndex]
        };
    }
}

if (typeof module !== 'undefined' && module.exports) { module.exports = WesternAstrology; }
