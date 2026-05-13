/**
 * Thai Horasat (โหราศาสตร์) — Thai Astrology Engine
 * Based on birth day of week (Sunday=1 through Saturday=7)
 * Includes Thai zodiac animals, day colors, planetary associations, and Nakshatra equivalent.
 */

class ThaiHorasat {
  // Days of week with Thai associations
  static DAYS = {
    0: { // Sunday (อาทิตย์)
      name: 'Wan Athit', thai: 'วันอาทิตย์',
      planet: 'Sun (Phra Athit)', thaiPlanet: 'พระอาทิตย์',
      thaiAnimal: 'Garuda (ครุฑ)',
      dayColor: 'Red', thaiColor: 'สีแดง',
      thaiNumber: 1,
      nakshatra: 'Krittika', thaiNakshatra: 'กฤติกา'
    },
    1: { // Monday (จันทร์)
      name: 'Wan Chan', thai: 'วันจันทร์',
      planet: 'Moon (Phra Chan)', thaiPlanet: 'พระจันทร์',
      thaiAnimal: 'Tiger (เสือ)',
      dayColor: 'Yellow', thaiColor: 'สีเหลือง',
      thaiNumber: 2,
      nakshatra: 'Rohini', thaiNakshatra: 'โรหิณี'
    },
    2: { // Tuesday (อังคาร)
      name: 'Wan Angkhan', thai: 'วันอังคาร',
      planet: 'Mars (Phra Angkhan)', thaiPlanet: 'พระอังคาร',
      thaiAnimal: 'Lion (ราชสีห์)',
      dayColor: 'Pink', thaiColor: 'สีชมพู',
      thaiNumber: 3,
      nakshatra: 'Mrigashira', thaiNakshatra: 'มฤคศิระ'
    },
    3: { // Wednesday (พุธ)
      name: 'Wan Phut', thai: 'วันพุธ',
      planet: 'Mercury (Phra Phut)', thaiPlanet: 'พระพุธ',
      thaiAnimal: 'Elephant with Tusk (ช้างมีงา)',
      dayColor: 'Green', thaiColor: 'สีเขียว',
      thaiNumber: 4,
      nakshatra: 'Ardra', thaiNakshatra: 'อาทรา'
    },
    4: { // Wednesday Night (ราหู) — special in Thai astrology
      name: 'Wan Phut Klang Khuen', thai: 'วันพุธกลางคืน',
      planet: 'Rahu (พระราหู)', thaiPlanet: 'พระราหู',
      thaiAnimal: 'Elephant without Tusk (ช้างไม่มีงา)',
      dayColor: 'Grey/Green-grey', thaiColor: 'สีเทา',
      thaiNumber: 5,
      nakshatra: 'Punarvasu', thaiNakshatra: 'punarvasu'
    },
    5: { // Thursday (พฤหัส)
      name: 'Wan Phareuhat', thai: 'วันพฤหัสบดี',
      planet: 'Jupiter (Phra Phareuhat)', thaiPlanet: 'พระพฤหัสบดี',
      thaiAnimal: 'Rat (หนู)',
      dayColor: 'Orange', thaiColor: 'สีส้ม',
      thaiNumber: 6,
      nakshatra: 'Pushya', thaiNakshatra: 'บุษยะ'
    },
    6: { // Friday (ศุกร์)
      name: 'Wan Suk', thai: 'วันศุกร์',
      planet: 'Venus (Phra Suk)', thaiPlanet: 'พระศุกร์',
      thaiAnimal: 'Buffalo (ควาย)',
      dayColor: 'Blue', thaiColor: 'สีฟ้า',
      thaiNumber: 7,
      nakshatra: 'Ashlesha', thaiNakshatra: 'อาศเลษา'
    },
    7: { // Saturday (เสาร์)
      name: 'Wan Sao', thai: 'วันเสาร์',
      planet: 'Saturn (Phra Sao)', thaiPlanet: 'พระเสาร์',
      thaiAnimal: 'Naga (พญานาค)',
      dayColor: 'Purple', thaiColor: 'สีม่วง',
      thaiNumber: 8,
      nakshatra: 'Magha', thaiNakshatra: 'มัฆา'
    }
  };

  // Additional Nakshatras for hour-based calculation
  static NAKSHATRAS = [
    { name: 'Ashwini', thai: 'อัศวินิ', deity: 'Ashwini Kumaras', quality: 'Swiftness' },
    { name: 'Bharani', thai: 'ภรณี', deity: 'Yama', quality: 'Restraint' },
    { name: 'Krittika', thai: 'กฤติกา', deity: 'Agni', quality: 'Transformation' },
    { name: 'Rohini', thai: 'โรหิณี', deity: 'Brahma', quality: 'Growth' },
    { name: 'Mrigashira', thai: 'มฤคศิระ', deity: 'Soma', quality: 'Searching' },
    { name: 'Ardra', thai: 'อาทรา', deity: 'Rudra', quality: 'Destruction/Renewal' },
    { name: 'Punarvasu', thai: 'ปุณณวสุ', deity: 'Aditi', quality: 'Renewal' },
    { name: 'Pushya', thai: 'บุษยะ', deity: 'Brihaspati', quality: 'Nourishment' },
    { name: 'Ashlesha', thai: 'อาศเลษา', deity: 'Nagas', quality: 'Mystery' },
    { name: 'Magha', thai: 'มัฆา', deity: 'Pitris', quality: 'Ancestry' },
    { name: 'Purva Phalguni', thai: 'ปุรพผลคุนี', deity: 'Bhaga', quality: 'Enjoyment' },
    { name: 'Uttara Phalguni', thai: 'อุตรผลคุนี', deity: 'Aryaman', quality: 'Patronage' },
    { name: 'Hasta', thai: 'หัตถะ', deity: 'Savitr', quality: 'Skill' },
    { name: 'Chitra', thai: 'จิตรา', deity: 'Vishvakarma', quality: 'Brilliance' },
    { name: 'Swati', thai: 'สวาติ', deity: 'Vayu', quality: 'Independence' },
    { name: 'Vishakha', thai: 'วิสาขา', deity: 'Indra-Agni', quality: 'Determination' },
    { name: 'Anuradha', thai: 'อนุราธ', deity: 'Mitra', quality: 'Devotion' },
    { name: 'Jyeshtha', thai: 'เชษฐา', deity: 'Indra', quality: 'Authority' },
    { name: 'Mula', thai: 'มูละ', deity: 'Nirriti', quality: 'Roots' },
    { name: 'Purva Ashadha', thai: 'ปุรพอาสาฒ', deity: 'Apas', quality: 'Invincibility' },
    { name: 'Uttara Ashadha', thai: 'อุตรอาสาฒ', deity: 'Vishvadevas', quality: 'Universal' },
    { name: 'Shravana', thai: 'ศรวณะ', deity: 'Vishnu', quality: 'Learning' },
    { name: 'Dhanishta', thai: 'ธนิษฐ', deity: 'Vasus', quality: 'Abundance' },
    { name: 'Shatabhisha', thai: 'ศตภิษ', deity: 'Varuna', quality: 'Healing' },
    { name: 'Purva Bhadrapada', thai: 'ปุรพภัทรบท', deity: 'Aja Ekapada', quality: 'Austerity' },
    { name: 'Uttara Bhadrapada', thai: 'อุตรภัทรบท', deity: 'Ahirbudhnya', quality: 'Depth' },
    { name: 'Revati', thai: 'เรวดี', deity: 'Pushan', quality: 'Nourishment' },
  ];

  /**
   * Get Thai day of week (0=Sun, 1=Mon, ..., 6=Sat)
   */
  static getDayOfWeek(dateStr) {
    const d = new Date(dateStr);
    return d.getDay(); // JS: 0=Sun, 1=Mon, ...
  }

  /**
   * Check if birth time is after 18:00 (Wednesday night = Rahu day)
   */
  static isWednesdayNight(dateStr, timeStr) {
    const day = this.getDayOfWeek(dateStr);
    if (day !== 3) return false; // Not Wednesday
    if (!timeStr) return false;
    const [h] = timeStr.split(':').map(Number);
    return h >= 18; // After 6 PM
  }

  /**
   * Derive Nakshatra from date using approximate lunar position
   * Uses epoch-based calculation
   */
  static getNakshatra(dateStr) {
    const date = new Date(dateStr);
    // Approximate moon position: known new moon reference + synodic cycle
    // Reference: Jan 6, 2000 was a new moon
    const refDate = new Date('2000-01-06');
    const daysSinceRef = (date - refDate) / (1000 * 60 * 60 * 24);
    const synodicMonth = 27.321661; // sidereal month
    const moonPos = ((daysSinceRef % synodicMonth) + synodicMonth) % synodicMonth;
    const nakshatraSpan = 360 / 27; // 13.333° per nakshatra
    const degrees = (moonPos / synodicMonth) * 360;
    const nakIdx = Math.floor(degrees / nakshatraSpan) % 27;
    return ThaiHorasat.NAKSHATRAS[nakIdx];
  }

  /**
   * Analyze: main entry point
   */
  analyze(birthDate, birthTime = '12:00') {
    const dow = ThaiHorasat.getDayOfWeek(birthDate);
    const isWedNight = ThaiHorasat.isWednesdayNight(birthDate, birthTime);
    const dayInfo = isWedNight ? ThaiHorasat.DAYS[4] : ThaiHorasat.DAYS[dow];
    const nakshatra = ThaiHorasat.getNakshatra(birthDate);

    // Thai zodiac animal is the day animal
    const thaiZodiac = dow; // 0=Sun...6=Sat
    const thaiAnimal = dayInfo.thaiAnimal;
    const dayColor = dayInfo.dayColor;
    const planet = dayInfo.planet;
    const nakshatraName = nakshatra.name;

    const reading = `Born on ${dayInfo.name} (${dayInfo.thai}), your Thai zodiac is governed by ${planet}. ` +
      `Your sacred animal is ${thaiAnimal}. Your auspicious color is ${dayColor} (${dayInfo.thaiColor}). ` +
      `Your lunar mansion (Nakshatra) is ${nakshatraName} (${nakshatra.thai}), ` +
      `deity: ${nakshatra.deity}, quality: ${nakshatra.quality}. ` +
      `In Thai Horasat, ${dayInfo.name} people are influenced by the energy of ${dayInfo.thaiPlanet}. ` +
      `The Nakshatra ${nakshatraName} brings ${nakshatra.quality.toLowerCase()} to your character.`;

    return {
      thaiZodiac: thaiZodiac,
      thaiAnimal: thaiAnimal,
      dayName: dayInfo.name,
      dayNameThai: dayInfo.thai,
      dayColor: dayColor,
      dayColorThai: dayInfo.thaiColor,
      planet: planet,
      planetThai: dayInfo.thaiPlanet,
      nakshatra: nakshatraName,
      nakshatraThai: nakshatra.thai,
      nakshatraDeity: nakshatra.deity,
      nakshatraQuality: nakshatra.quality,
      reading,
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThaiHorasat;
}
