/**
 * AZTEC TONALPOHUALLI ENGINE
 * Calculates the 260-day sacred calendar position from a birth date.
 * Uses correlation: August 13, 1970 = 1 Crocodile (1 Imix)
 */

class AztecTonalpohualli {
    constructor() {
        // Reference date: August 13, 1970 = day 0 = 1 Crocodile
        this.referenceDate = new Date(1970, 7, 13); // month is 0-indexed

        // 20 Day Signs
        this.daySigns = [
            { name: 'Crocodile', nahuatl: 'Cipactli', meaning: 'Beginning, origin, primal force' },
            { name: 'Wind', nahuatl: 'Ehecatl', meaning: 'Breath, spirit, communication' },
            { name: 'House', nahuatl: 'Calli', meaning: 'Shelter, family, inner world' },
            { name: 'Lizard', nahuatl: 'Cuetzpalin', meaning: 'Abundance, fertility, sowing' },
            { name: 'Snake', nahuatl: 'Coatl', meaning: 'Wisdom, vitality, life force' },
            { name: 'Death', nahuatl: 'Miquiztli', meaning: 'Transformation, rebirth, renewal' },
            { name: 'Deer', nahuatl: 'Mazatl', meaning: 'Grace, swiftness, intuition' },
            { name: 'Rabbit', nahuatl: 'Tochtli', meaning: 'Fertility, moon, excess' },
            { name: 'Water', nahuatl: 'Atl', meaning: 'Purification, emotion, flow' },
            { name: 'Dog', nahuatl: 'Itzcuintli', meaning: 'Loyalty, guidance, companionship' },
            { name: 'Monkey', nahuatl: 'Ozomatli', meaning: 'Play, art, creativity' },
            { name: 'Grass', nahuatl: 'Malinalli', meaning: 'Tenacity, rejuvenation, twist' },
            { name: 'Reed', nahuatl: 'Acatl', meaning: 'Authority, justice, rigidity' },
            { name: 'Jaguar', nahuatl: 'Ocelotl', meaning: 'Power, courage, unseen force' },
            { name: 'Eagle', nahuatl: 'Cuauhtli', meaning: 'Freedom, vision, transcendence' },
            { name: 'Vulture', nahuatl: 'Cozcacuauhtli', meaning: 'Wisdom of age, purification' },
            { name: 'Earthquake', nahuatl: 'Ollin', meaning: 'Movement, evolution, change' },
            { name: 'Knife', nahuatl: 'Tecpatl', meaning: 'Sacrifice, ordeal, clarity' },
            { name: 'Storm', nahuatl: 'Quiahuitl', meaning: 'Tempest, energy, disruption' },
            { name: 'Flower', nahuatl: 'Xochitl', meaning: 'Beauty, art, pleasure' }
        ];

        // 13 coefficients (Trecena)
        this.coefficients = [1,2,3,4,5,6,7,8,9,10,11,12,13];

        // Lords of the Night (9 deities)
        this.lordsOfNight = [
            'Xiuhtecuhtli (Fire God)',
            'Itztli (Obsidian Blade)',
            'Piltzintecuhtli (Prince Lord)',
            'Cinteotl (Maize God)',
            'Mictlantecuhtli (Death Lord)',
            'Chalchiuhtlicue (Water Goddess)',
            'Tlazolteotl (Goddess of Filth)',
            'Tepeyollotl (Heart of the Mountain)',
            'Tlaloc (Rain God)'
        ];

        // Trecena Lords (rulers of each 13-day period)
        this.trecenaLords = [
            'Ometeotl (Dual God)',
            'Quetzalcoatl (Feathered Serpent)',
            'Tepeyollotl (Heart of Mountain)',
            'Huehuecoyotl (Old Coyote)',
            'Chalchiuhtlicue (Jade Skirt)',
            'Tonatiuh (Sun)',
            'Tlazolteotl (Goddess of Filth)',
            'Tepeyollotl (Heart of Mountain)',
            'Tlaloc (Rain God)',
            'Xiuhtecuhtli (Fire God)',
            'Mictlantecuhtli (Death Lord)',
            'Cinteotl (Maize God)',
            'Tlazolteotl (Goddess of Filth)',
            'Xipe Totec (Flayed Lord)',
            'Itzpapalotl (Obsidian Butterfly)',
            'Xiuhtecuhtli (Fire God)',
            'Xochipilli (Flower Prince)',
            'Coatlicue (Serpent Skirt)',
            'Tezcatlipoca (Smoking Mirror)',
            'Tlazolteotl (Goddess of Filth)'
        ];

        // Readings per day sign
        this.readings = [
            'You carry the primal energy of creation. Natural leader with fierce determination. Your path begins with raw power that must be channeled wisely.',
            'You are the breath of change. Communication and intellect are your gifts. You move unseen but your influence touches all.',
            'You embody the sacred shelter. Home and family anchor your spirit. You create safe spaces for transformation.',
            'You carry the seed of abundance. Fertility and growth follow your steps. Plant wisely — your seeds become forests.',
            'You hold the wisdom of the serpent. Vitality and cunning are your allies. Transform your skin when the season demands.',
            'You are the agent of transformation. Death is not your enemy but your midwife. You guide others through thresholds.',
            'You move with the grace of the forest deer. Intuition guides your swift steps. Trust the signals others miss.',
            'You carry lunar fertility. Abundance comes easily but beware of excess. The moon that fills also wanes.',
            'You are the purifying waters. Emotional depth is your strength. You cleanse and renew what you touch.',
            'You are the faithful guide. Loyalty defines your spirit. You lead others through the darkness to safety.',
            'You embody creative play. Art and joy are your medicine. Through laughter and craft, you heal the world.',
            'You carry the twisted grass of renewal. Tenacity is your virtue. You bend but never break, always growing back.',
            'You hold the reed of authority. Justice and structure flow through you. Your word carries the weight of law.',
            'You are the jaguar of power. Courage and unseen force define you. You hunt in darkness with perfect vision.',
            'You soar as the eagle. Freedom and transcendent vision are yours. You see what lies beyond the horizon.',
            'You carry the wisdom of the ancient vulture. Age and experience are your treasures. You purify what others discard.',
            'You are the movement of earthquake. Change is your element. You shake foundations to reveal new ground.',
            'You are the sacrificial knife. Clarity through ordeal is your gift. You cut through illusion to truth.',
            'You are the storm itself. Energy and disruption precede you. From chaos, you bring necessary rain.',
            'You are the flower of beauty. Art and pleasure radiate from your presence. You remind the world of its splendor.'
        ];
    }

    /**
     * Calculate days elapsed from reference date
     */
    _daysFromReference(dateStr) {
        const date = new Date(dateStr);
        const refTime = this.referenceDate.getTime();
        const targetTime = date.getTime();
        const diffMs = targetTime - refTime;
        return Math.floor(diffMs / (1000 * 60 * 60 * 24));
    }

    /**
     * Analyze birth date for Aztec Tonalpohualli position
     */
    analyze(dateStr) {
        const days = this._daysFromReference(dateStr);

        // Handle negative days (dates before reference)
        const normalizedDays = ((days % 260) + 260) % 260;

        // Coefficient: cycles 1-13
        const coefficient = (normalizedDays % 13) + 1;

        // Day sign: cycles 0-19
        const signIndex = normalizedDays % 20;
        const daySign = this.daySigns[signIndex];

        // Trecena lord (based on which 13-day period)
        const trecenaIndex = Math.floor(normalizedDays / 13) % 20;
        const trecena = this.trecenaLords[trecenaIndex];

        // Lord of the Night: cycles 0-8
        const nightIndex = ((normalizedDays % 9) + 9) % 9;
        const lordOfNight = this.lordsOfNight[nightIndex];

        const reading = this.readings[signIndex];

        return {
            coefficient,
            daySign: daySign.name,
            daySignNahuatl: daySign.nahuatl,
            meaning: daySign.meaning,
            trecena,
            lordOfNight,
            reading
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AztecTonalpohualli;
}
