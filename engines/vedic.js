/**
 * Vedic (Jyotish) Astrology Engine
 * Calculates Moon sign (Rashi) and Nakshatra from birth date.
 * Uses approximate sidereal positions with Lahiri ayanamsa (~24°).
 */

class Vedic {
  // 12 Rashis (Moon Signs)
  static RASHIS = [
    { name: 'Aries', sanskrit: 'Mesha', symbol: '♈', element: 'Fire', quality: 'Movable', lord: 'Mars' },
    { name: 'Taurus', sanskrit: 'Vrishabha', symbol: '♉', element: 'Earth', quality: 'Fixed', lord: 'Venus' },
    { name: 'Gemini', sanskrit: 'Mithuna', symbol: '♊', element: 'Air', quality: 'Dual', lord: 'Mercury' },
    { name: 'Cancer', sanskrit: 'Karka', symbol: '♋', element: 'Water', quality: 'Movable', lord: 'Moon' },
    { name: 'Leo', sanskrit: 'Simha', symbol: '♌', element: 'Fire', quality: 'Fixed', lord: 'Sun' },
    { name: 'Virgo', sanskrit: 'Kanya', symbol: '♍', element: 'Earth', quality: 'Dual', lord: 'Mercury' },
    { name: 'Libra', sanskrit: 'Tula', symbol: '♎', element: 'Air', quality: 'Movable', lord: 'Venus' },
    { name: 'Scorpio', sanskrit: 'Vrishchika', symbol: '♏', element: 'Water', quality: 'Fixed', lord: 'Mars' },
    { name: 'Sagittarius', sanskrit: 'Dhanu', symbol: '♐', element: 'Fire', quality: 'Dual', lord: 'Jupiter' },
    { name: 'Capricorn', sanskrit: 'Makara', symbol: '♑', element: 'Earth', quality: 'Movable', lord: 'Saturn' },
    { name: 'Aquarius', sanskrit: 'Kumbha', symbol: '♒', element: 'Air', quality: 'Fixed', lord: 'Saturn' },
    { name: 'Pisces', sanskrit: 'Meena', symbol: '♓', element: 'Water', quality: 'Dual', lord: 'Jupiter' },
  ];

  // 27 Nakshatras (Lunar Mansions)
  static NAKSHATRAS = [
    { name: 'Ashwini', deity: 'Ashwini Kumaras (Twin Healers)', rulingPlanet: 'Ketu', pada: ['Aries','Aries','Aries','Aries'] },
    { name: 'Bharani', deity: 'Yama (Lord of Death)', rulingPlanet: 'Venus', pada: ['Aries','Aries','Aries','Aries'] },
    { name: 'Krittika', deity: 'Agni (Fire God)', rulingPlanet: 'Sun', pada: ['Aries','Taurus','Taurus','Taurus'] },
    { name: 'Rohini', deity: 'Brahma (Creator)', rulingPlanet: 'Moon', pada: ['Taurus','Taurus','Taurus','Taurus'] },
    { name: 'Mrigashira', deity: 'Soma (Moon God)', rulingPlanet: 'Mars', pada: ['Taurus','Taurus','Gemini','Gemini'] },
    { name: 'Ardra', deity: 'Rudra (Storm God)', rulingPlanet: 'Rahu', pada: ['Gemini','Gemini','Gemini','Gemini'] },
    { name: 'Punarvasu', deity: 'Aditi (Mother of Gods)', rulingPlanet: 'Jupiter', pada: ['Gemini','Gemini','Cancer','Cancer'] },
    { name: 'Pushya', deity: 'Brihaspati (Guru of Gods)', rulingPlanet: 'Saturn', pada: ['Cancer','Cancer','Cancer','Cancer'] },
    { name: 'Ashlesha', deity: 'Nagas (Serpent Deities)', rulingPlanet: 'Mercury', pada: ['Cancer','Cancer','Cancer','Leo'] },
    { name: 'Magha', deity: 'Pitris (Ancestors)', rulingPlanet: 'Ketu', pada: ['Leo','Leo','Leo','Leo'] },
    { name: 'Purva Phalguni', deity: 'Bhaga (God of Enjoyment)', rulingPlanet: 'Venus', pada: ['Leo','Leo','Leo','Virgo'] },
    { name: 'Uttara Phalguni', deity: 'Aryaman (Noble Friend)', rulingPlanet: 'Sun', pada: ['Virgo','Virgo','Virgo','Virgo'] },
    { name: 'Hasta', deity: 'Savitr (Sun God)', rulingPlanet: 'Moon', pada: ['Virgo','Virgo','Libra','Libra'] },
    { name: 'Chitra', deity: 'Vishvakarma (Divine Architect)', rulingPlanet: 'Mars', pada: ['Libra','Libra','Libra','Libra'] },
    { name: 'Swati', deity: 'Vayu (Wind God)', rulingPlanet: 'Rahu', pada: ['Libra','Libra','Libra','Scorpio'] },
    { name: 'Vishakha', deity: 'Indra-Agni (Fire & Thunder)', rulingPlanet: 'Jupiter', pada: ['Scorpio','Scorpio','Scorpio','Scorpio'] },
    { name: 'Anuradha', deity: 'Mitra (Friendship)', rulingPlanet: 'Saturn', pada: ['Scorpio','Scorpio','Scorpio','Sagittarius'] },
    { name: 'Jyeshtha', deity: 'Indra (King of Gods)', rulingPlanet: 'Mercury', pada: ['Sagittarius','Sagittarius','Sagittarius','Sagittarius'] },
    { name: 'Mula', deity: 'Nirriti (Goddess of Destruction)', rulingPlanet: 'Ketu', pada: ['Sagittarius','Sagittarius','Sagittarius','Capricorn'] },
    { name: 'Purva Ashadha', deity: 'Apas (Waters)', rulingPlanet: 'Venus', pada: ['Capricorn','Capricorn','Capricorn','Capricorn'] },
    { name: 'Uttara Ashadha', deity: 'Vishvadevas (Universal Gods)', rulingPlanet: 'Sun', pada: ['Capricorn','Capricorn','Capricorn','Aquarius'] },
    { name: 'Shravana', deity: 'Vishnu (Preserver)', rulingPlanet: 'Moon', pada: ['Aquarius','Aquarius','Aquarius','Aquarius'] },
    { name: 'Dhanishta', deity: 'Vasus (Abundance Gods)', rulingPlanet: 'Mars', pada: ['Aquarius','Aquarius','Aquarius','Pisces'] },
    { name: 'Shatabhisha', deity: 'Varuna (Cosmic Waters)', rulingPlanet: 'Rahu', pada: ['Pisces','Pisces','Pisces','Pisces'] },
    { name: 'Purva Bhadrapada', deity: 'Aja Ekapada (One-Footed)', rulingPlanet: 'Jupiter', pada: ['Pisces','Pisces','Pisces','Aries'] },
    { name: 'Uttara Bhadrapada', deity: 'Ahirbudhnya (Serpent of Deep)', rulingPlanet: 'Saturn', pada: ['Pisces','Pisces','Pisces','Pisces'] },
    { name: 'Revati', deity: 'Pushan (Nourisher)', rulingPlanet: 'Mercury', pada: ['Pisces','Pisces','Pisces','Aries'] },
  ];

  /**
   * Approximate sidereal moon longitude from date.
   * Uses reference point: Jan 1, 2000 ~ moon at 85° tropical
   * Then subtract Lahiri ayanamsa for sidereal
   */
  static getSiderealMoonLongitude(dateStr) {
    const date = new Date(dateStr);
    // Reference: Jan 1, 2000, moon tropical longitude ≈ 85°
    const refDate = new Date('2000-01-01');
    const daysSinceRef = (date - refDate) / (1000 * 60 * 60 * 24);

    // Moon moves ~13.176° per day (360° / 27.321661 days)
    const moonMotionPerDay = 13.176358;
    const tropicalMoon = (85 + daysSinceRef * moonMotionPerDay) % 360;

    // Lahiri ayanamsa: increases ~50.3 arcseconds per year from ~22.8° in 2000
    const yearsSince2000 = daysSinceRef / 365.25;
    const ayanamsa = 22.8 + (yearsSince2000 * 50.3 / 3600); // in degrees

    const siderealMoon = ((tropicalMoon - ayanamsa) + 360) % 360;
    return siderealMoon;
  }

  /**
   * Get Rashi (Moon Sign) from sidereal longitude
   */
  static getRashi(siderealLongitude) {
    const idx = Math.floor(siderealLongitude / 30) % 12;
    return Vedic.RASHIS[idx];
  }

  /**
   * Get Nakshatra from sidereal longitude
   * Each nakshatra spans 360/27 = 13.333°
   */
  static getNakshatra(siderealLongitude) {
    const nakshatraSpan = 360 / 27;
    const idx = Math.floor(siderealLongitude / nakshatraSpan) % 27;
    return Vedic.NAKSHATRAS[idx];
  }

  /**
   * Get Pada (quarter) within nakshatra
   */
  static getPada(siderealLongitude) {
    const nakshatraSpan = 360 / 27;
    const nakPosition = siderealLongitude % nakshatraSpan;
    const pada = Math.floor(nakPosition / (nakshatraSpan / 4)) + 1;
    return Math.min(pada, 4); // ensure 1-4
  }

  /**
   * Analyze: main entry point
   */
  analyze(birthDate, birthTime = '12:00') {
    const siderealMoon = Vedic.getSiderealMoonLongitude(birthDate);
    const moonSign = Vedic.getRashi(siderealMoon);
    const nakshatra = Vedic.getNakshatra(siderealMoon);
    const pada = Vedic.getPada(siderealMoon);

    const reading = `Your Vedic Moon Sign is ${moonSign.name} (${moonSign.sanskrit} ${moonSign.symbol}), ` +
      `an ${moonSign.element.toLowerCase()}, ${moonSign.quality.toLowerCase()} sign ruled by ${moonSign.lord}. ` +
      `Your Nakshatra is ${nakshatra.name}, deity: ${nakshatra.deity}, ` +
      `ruled by ${nakshatra.rulingPlanet}. Pada ${pada}. ` +
      `The Moon at ${siderealMoon.toFixed(1)}° sidereal reveals your emotional nature ` +
      `as ${moonSign.quality.toLowerCase()}: ${moonSign.element.toLowerCase()} energy ` +
      `filtered through the divine gaze of ${nakshatra.deity}.`;

    return {
      moonSign: moonSign.name,
      moonSignSanskrit: moonSign.sanskrit,
      moonSignSymbol: moonSign.symbol,
      element: moonSign.element,
      quality: moonSign.quality,
      rulingPlanet: nakshatra.rulingPlanet,
      deity: nakshatra.deity,
      nakshatra: nakshatra.name,
      nakshatraPada: pada,
      siderealMoonLongitude: siderealMoon.toFixed(2),
      reading,
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Vedic;
}
