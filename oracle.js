/**
 * GEMOME FORTUNE ORACLE LOGIC
 * Merges biological metaphors with fortune telling.
 */

const KNOWLEDGE_BASE = {
    epigenetic_markers: [
        "Methylation at Promoter Region 8 (Karma)",
        "Histone Modification on Chromosome 12 (Love)",
        "Non-coding RNA Signal (Career)",
        "Telomere Length Anomaly (Longevity)"
    ],
    archetypes: {
        fire: ["The Mitochondria", "The Catalyst"],
        water: ["The Cytoplasm", "The Flow"],
        earth: ["The Bone Structure", "The Foundation"],
        air: ["The Neural Network", "The Visionary"]
    },
    palm_readings: [
        "Life Line indicates significant epigenetic resilience.",
        "Heart Line shows a high capacity for symbiotic bonding.",
        "Fate Line merges with the neural pathway, suggesting self-made design.",
        "Sun Line topography reveals latent bio-luminescence (fame).",
        "Mercury Mount elevation suggests advanced communication receptors.",
        "Venus Mount density implies strong reproductive/creative energy."
    ],
    fortunes: [
        "Your epigenetic markers suggest a dormant talent will be activated by environmental stress within the next cycle.",
        "A rare retrograde mutation in your star chart indicates a return of a past connection.",
        "Your neural pathways are realigning. Expect a significant shift in perspective.",
        "Cellular resonance with the lunar phase is high. Trust your intuition over logic today.",
        "Avoid toxins, both chemical and emotional. Your membrane permeability is currently compromised.",
        "The double helix of your destiny is untwisting. Chaos precedes distinct order.",
        "A symbiotic relationship is on the horizon. Prepared your receptors.",
        "Your bio-luminescence is peaking. You will attract attention without effort."
    ],
    riddles: [
        "I am the code that writes itself, yet I never change my ink. What am I?\n(Answer: Your Ancestral Memory)",
        "I have no voice, yet I tell you everything about your past. What am I?\n(Answer: Your DNA)",
        "I am the shadow that walks before you, shaped by the light of stars. What am I?\n(Answer: Your Destiny)",
        "I am written in your blood, but read in the stars. What am I?\n(Answer: Your Cosmic Signature)",
        "I spiral up and down, a ladder to the future built from the past. What am I?\n(Answer: The Helix)"
    ]
};

class Oracle {
    constructor() {
        this.zodiacSigns = [
            "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini",
            "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"
        ];
    }

    generateSequence(length) {
        const bases = ['A', 'T', 'C', 'G'];
        let seq = "";
        for (let i = 0; i < length; i++) {
            seq += bases[Math.floor(Math.random() * 4)];
        }
        return seq;
    }

    getZodiac(dateStr) {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.getMonth() + 1;

        // Simple Zodiac logic
        if ((month == 1 && day <= 19) || (month == 12 && day >= 22)) return "Capricorn";
        if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Aquarius";
        if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "Pisces";
        if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Aries";
        if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Taurus";
        if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gemini";
        if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cancer";
        if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leo";
        if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgo";
        if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra";
        if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Scorpio";
        if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagittarius";
        return "Unknown";
    }

    calculateNumerology(dateStr) {
        // Simple sum of digits
        const digits = dateStr.replace(/-/g, '').split('').map(Number);
        let sum = digits.reduce((a, b) => a + b, 0);

        while (sum > 9 && sum !== 11 && sum !== 22) {
            sum = String(sum).split('').map(Number).reduce((a, b) => a + b, 0);
        }
        return sum;
    }

    analyze(name, birthDate, birthTime, palmInput) {
        const zodiac = this.getZodiac(birthDate);
        const number = this.calculateNumerology(birthDate);
        const sequence = this.generateSequence(12);

        // Deterministic randomness based on name length + number + time
        // If time is provided, use it to shift the random seed
        let timeShift = 0;
        if (birthTime) {
            const [hours, minutes] = birthTime.split(':').map(Number);
            timeShift = hours + minutes;
        }

        const seed = name.length + number + timeShift;
        const fortuneIndex = seed % KNOWLEDGE_BASE.fortunes.length;
        const markerIndex = seed % KNOWLEDGE_BASE.epigenetic_markers.length;
        const palmIndex = (seed * 2) % KNOWLEDGE_BASE.palm_readings.length;
        const riddleIndex = (seed * 3) % KNOWLEDGE_BASE.riddles.length;

        // Determine element based on Zodiac for flavor
        let element = "Carbon"; // Default
        if (['Aries', 'Leo', 'Sagittarius'].includes(zodiac)) element = "Bio-Plasma (Fire)";
        if (['Taurus', 'Virgo', 'Capricorn'].includes(zodiac)) element = "Bio-Matter (Earth)";
        if (['Gemini', 'Libra', 'Aquarius'].includes(zodiac)) element = "Bio-Ether (Air)";
        if (['Cancer', 'Scorpio', 'Pisces'].includes(zodiac)) element = "Bio-Fluid (Water)";

        return {
            id: `GEN-${number}0${fortuneIndex}-${sequence.substring(0, 3)}`,
            numerology: `Life Path ${number}`,
            astrology: `${zodiac} // ${element}`,
            marker: KNOWLEDGE_BASE.epigenetic_markers[markerIndex],
            fortune: KNOWLEDGE_BASE.fortunes[fortuneIndex],
            palm: KNOWLEDGE_BASE.palm_readings[palmIndex],
            riddle: KNOWLEDGE_BASE.riddles[riddleIndex]
        };
    }

    castFortuneStick() {
        return Math.floor(Math.random() * 100) + 1;
    }

    generateStickRiddle(number) {
        // Procedural Text Generation
        // Using "buckets" of phrases to construct meaningful paragraphs without hardcoding 100 texts.

        const metaphors = [
            "The ancient pine stands firm in the snow, its roots deep in the frozen earth. Like the dormant gene awaiting transcription, potential energy lies hidden within the cold silence.",
            "A lone crane flies towards the sun, casting a shadow upon the rippling water. The reflection is distorted, just as our perception of the phenotype differs from the genotype.",
            "The mountain stream breaks around the stone, finding a new path without resistance. Evolution is not a battle, but a constant adaptation to the geometry of existence.",
            "Fire clears the forest floor, allowing new seeds to germinate in the ash. Destruction is merely the precursor to a new sequence of proteins folding into life.",
            "The moon pulls the tides, unseen yet undeniable. So too does the epigenetic marker influence the expression of the soul, guided by forces beyond the visible spectrum."
        ];

        const actions = [
            "You must cultivate patience. The enzyme requires specific conditions to catalyze the reaction; forcing the process will only denature the spirit.",
            "It is time to shed the old skin. The mutation you fear is actually a necessary adaptation for the environment you are entering. Embrace the variance.",
            "Seek harmony in your connections. Just as the base pairs align A to T and C to G, your fortune depends on finding the correct complement to your energy.",
            "Look inward for the answer. The code is already written in your nucleus; you only need to silence the noise of the cytoplasm to hear the instruction.",
            "Prepare for a sudden shift. A transposon is jumping in your destiny, rewriting the sequence of events. Be ready to transcribe a new chapter."
        ];

        const destinies = [
            "Great fortune awaits. The expression of your highest traits is imminent.",
            "A time of waiting. The cell cycle is in arrest, but growth continues in the dark.",
            "Caution is advised. A recessive trait threatens to manifest if balance is not maintained.",
            "Success through perseverance. The long strand of DNA is not built in a day, but base by base.",
            "Unexpected joy. A beneficial mutation will bring a surprise advantage."
        ];

        // Seeding based on number to ensure re-readability for the same stick
        const mIndex = number % metaphors.length;
        const aIndex = (number * 2) % actions.length;
        const dIndex = (number * 3) % destinies.length;

        return `${metaphors[mIndex]}\n\n${actions[aIndex]}\n\nDestiny: ${destinies[dIndex]}`;
    }
}
