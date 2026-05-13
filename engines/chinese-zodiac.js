/**
 * CHINESE ZODIAC ENGINE
 * Calculates animal sign, element, yin/yang from birth year.
 */

class ChineseZodiac {
    constructor() {
        this.animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
                        'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];

        this.elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

        this.traits = {
            Rat:      'Quick-witted, resourceful, versatile, kind',
            Ox:       'Diligent, dependable, strong, determined',
            Tiger:    'Brave, confident, competitive, charismatic',
            Rabbit:   'Quiet, elegant, kind, responsible',
            Dragon:   'Confident, intelligent, enthusiastic, ambitious',
            Snake:    'Enigmatic, intelligent, wise, intuitive',
            Horse:    'Animated, active, energetic, free-spirited',
            Goat:     'Calm, gentle, sympathetic, creative',
            Monkey:   'Sharp, smart, curious, mischievous',
            Rooster:  'Observant, hardworking, courageous, confident',
            Dog:      'Loyal, honest, amiable, kind, cautious',
            Pig:      'Compassionate, generous, diligent, warm'
        };

        this.luckyNumbers = {
            Rat:      [2, 3], Ox:      [1, 4], Tiger:   [1, 3, 4],
            Rabbit:   [3, 4, 9], Dragon: [1, 6, 7], Snake:    [2, 8, 9],
            Horse:    [2, 3, 7], Goat:    [3, 4, 6], Monkey:   [4, 9],
            Rooster:  [5, 7, 8], Dog:     [3, 4, 9], Pig:      [2, 5, 8]
        };

        this.yinYang = ['Yang', 'Yin']; // Even years = Yin, Odd = Yang (for the 60-year cycle position)

        this.readings = {
            Rat: 'Born under the sign of the Rat, your destiny is shaped by wit and adaptability. You thrive in changing environments and find opportunity where others see chaos. Your social intelligence opens doors that remain closed to brute force.',
            Ox: 'The Ox bestows upon you the power of endurance. Your path is one of steady accumulation — wealth, wisdom, and trust are built brick by brick. Those who doubt your slow pace are proven wrong by your unshakeable finish.',
            Tiger: 'You carry the Tiger\'s fierce energy. Your destiny involves bold action and leadership. You are meant to challenge authority, break conventions, and forge new paths. Your courage inspires others to follow.',
            Rabbit: 'The Rabbit grants you grace and diplomatic power. Your destiny unfolds through careful cultivation of relationships and environments. You succeed not by force but by creating beauty and harmony around you.',
            Dragon: 'You are blessed with the Dragon\'s supreme energy. Power, luck, and ambition flow through your destiny. You are meant for great achievements and natural authority. Your challenge is to wield power with wisdom.',
            Snake: 'The Snake bestows deep wisdom and intuition. Your destiny involves hidden knowledge and strategic thinking. You see patterns others miss and strike at the perfect moment. Your mystery is your magnetism.',
            Horse: 'You carry the Horse\'s unstoppable energy. Freedom and movement define your path. You are meant to travel, explore, and break boundaries. Your restless spirit finds its purpose in the journey itself.',
            Goat: 'The Goat gifts you with creative sensitivity. Your destiny is intertwined with art, beauty, and compassion. You perceive subtleties that others overlook and create comfort for those around you.',
            Monkey: 'You are energized by the Monkey\'s brilliance. Innovation and cleverness define your path. You solve problems with creative tricks and intellectual agility. Your challenge is to focus your scattered genius.',
            Rooster: 'The Rooster grants you precision and courage. Your destiny involves speaking truth and setting standards. You are the observer who notices every detail and the voice that calls others to excellence.',
            Dog: 'You carry the Dog\'s loyalty and justice. Your destiny is tied to protecting others and upholding fairness. You are trusted because your integrity is unshakeable. Your reward comes through faithful service.',
            Pig: 'The Pig bestows abundance and generosity. Your destiny involves enjoying life\'s pleasures while sharing freely with others. Your good nature attracts luck, and your sincerity opens hearts.'
        };
    }

    /**
     * Calculate element from year
     * Element cycle: each element lasts 2 consecutive years
     * Years ending in 0,1 = Metal; 2,3 = Water; 4,5 = Wood; 6,7 = Fire; 8,9 = Earth
     */
    _getElement(year) {
        const lastDigit = year % 10;
        if (lastDigit === 0 || lastDigit === 1) return 'Metal';
        if (lastDigit === 2 || lastDigit === 3) return 'Water';
        if (lastDigit === 4 || lastDigit === 5) return 'Wood';
        if (lastDigit === 6 || lastDigit === 7) return 'Fire';
        return 'Earth';
    }

    /**
     * Determine Yin or Yang
     * Even years = Yin, Odd years = Yang
     */
    _getYinYang(year) {
        return year % 2 === 0 ? 'Yin' : 'Yang';
    }

    analyze(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();

        // Animal: 1984 = Rat (reference year, Jia-Zi)
        // (year - 4) % 12 gives 0 for 1984, 1 for 1985, etc.
        const animalIndex = (year - 4) % 12;
        const animal = this.animals[animalIndex < 0 ? animalIndex + 12 : animalIndex];
        const element = this._getElement(year);
        const yinYang = this._getYinYang(year);
        const luckyNumbers = this.luckyNumbers[animal];
        const traits = this.traits[animal];
        const reading = this.readings[animal];

        return {
            animal,
            element,
            yinYang,
            luckyNumbers,
            traits,
            reading
        };
    }
}

if (typeof module !== 'undefined' && module.exports) { module.exports = ChineseZodiac; }
