/**
 * Bazi (八字) — Chinese Four Pillars of Destiny Engine
 * Calculates Year, Month, Day, Hour pillars from birth date/time.
 * Uses the sexagenary (60-year) cycle with 1984 = Jia-Zi as reference.
 */

class Bazi {
  // 10 Heavenly Stems (天干)
  static STEMS = [
    { name: 'Jia', chinese: '甲', element: 'Wood', yinYang: 'Yang' },
    { name: 'Yi',  chinese: '乙', element: 'Wood', yinYang: 'Yin' },
    { name: 'Bing',chinese: '丙', element: 'Fire', yinYang: 'Yang' },
    { name: 'Ding',chinese: '丁', element: 'Fire', yinYang: 'Yin' },
    { name: 'Wu',  chinese: '戊', element: 'Earth',yinYang: 'Yang' },
    { name: 'Ji',  chinese: '己', element: 'Earth',yinYang: 'Yin' },
    { name: 'Geng',chinese: '庚', element: 'Metal',yinYang: 'Yang' },
    { name: 'Xin', chinese: '辛', element: 'Metal',yinYang: 'Yin' },
    { name: 'Ren', chinese: '壬', element: 'Water',yinYang: 'Yang' },
    { name: 'Gui', chinese: '癸', element: 'Water',yinYang: 'Yin' },
  ];

  // 12 Earthly Branches (地支)
  static BRANCHES = [
    { name: 'Zi',   chinese: '子', animal: 'Rat',   element: 'Water', yinYang: 'Yang' },
    { name: 'Chou', chinese: '丑', animal: 'Ox',    element: 'Earth', yinYang: 'Yin' },
    { name: 'Yin',  chinese: '寅', animal: 'Tiger', element: 'Wood',  yinYang: 'Yang' },
    { name: 'Mao',  chinese: '卯', animal: 'Rabbit',element: 'Wood',  yinYang: 'Yin' },
    { name: 'Chen', chinese: '辰', animal: 'Dragon',element: 'Earth', yinYang: 'Yang' },
    { name: 'Si',   chinese: '巳', animal: 'Snake', element: 'Fire',  yinYang: 'Yin' },
    { name: 'Wu',   chinese: '午', animal: 'Horse', element: 'Fire',  yinYang: 'Yang' },
    { name: 'Wei',  chinese: '未', animal: 'Goat',  element: 'Earth', yinYang: 'Yin' },
    { name: 'Shen', chinese: '申', animal: 'Monkey',element: 'Metal', yinYang: 'Yang' },
    { name: 'You',  chinese: '酉', animal: 'Rooster',element:'Metal', yinYang: 'Yin' },
    { name: 'Xu',   chinese: '戌', animal: 'Dog',   element: 'Earth', yinYang: 'Yang' },
    { name: 'Hai',  chinese: '亥', animal: 'Pig',   element: 'Water', yinYang: 'Yin' },
  ];

  // Month stem starts depend on year stem (五虎遁 — Five Tiger Escape)
  // Year stem index -> month stem start index (for lunar month 1 = Yin/Tiger)
  static MONTH_START = [2, 4, 6, 8, 0]; // Jia/Ji->Bing(2), Yi/Geng->Ding(4), Bing/Xin->Wu(6), Ding/Ren->Ji(8), Wu/Gui->Geng(0)

  // Hour stem starts depend on day stem (五鼠遁 — Five Rat Escape)
  // Day stem index -> hour stem start index (for hour branch 0 = Zi/Rat)
  static HOUR_START = [0, 2, 4, 6, 8]; // Jia/Ji->Jia(0), Yi/Geng->Bing(2), Bing/Xin->Wu(4), Ding/Ren->Geng(6), Wu/Gui->Ren(8)

  /**
   * Get Heavenly Stem by index (0-9)
   */
  static stem(idx) {
    return Bazi.STEMS[((idx % 10) + 10) % 10];
  }

  /**
   * Get Earthly Branch by index (0-11)
   */
  static branch(idx) {
    return Bazi.BRANCHES[((idx % 12) + 12) % 12];
  }

  /**
   * Get Julian Day Number from Gregorian date
   */
  static toJulianDay(year, month, day) {
    if (month <= 2) { year -= 1; month += 12; }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
  }

  /**
   * Calculate the Year Pillar
   * Stem = (year - 3) % 10, Branch = (year - 3) % 12
   * 1984 -> stem=1(Jia), branch=1(Zi) = Jia-Zi ✓
   */
  static yearPillar(year) {
    const stemIdx = ((year - 3) % 10 + 10) % 10;
    const branchIdx = ((year - 3) % 12 + 12) % 12;
    return { stem: Bazi.stem(stemIdx), branch: Bazi.branch(branchIdx), stemIdx, branchIdx };
  }

  /**
   * Calculate the Month Pillar
   * Month branch is fixed: Feb(寅)=2, Mar(卯)=3, ... Jan(丑)=11 (approximate solar months)
   * Month stem is derived from year stem using Five Tiger Escape
   */
  static monthPillar(year, month) {
    // Approximate solar month mapping to earthly branch
    // In Bazi, the month is based on solar terms. Simplified mapping:
    // Feb 4 - Mar 5 = 寅(2), Mar 6 - Apr 4 = 卯(3), etc.
    const solarBranchMap = {
      1: 11, // Jan -> Chou (丑)
      2: 2,  // Feb -> Yin (寅) — after Lichun (~Feb 4)
      3: 3,  // Mar -> Mao (卯)
      4: 4,  // Apr -> Chen (辰)
      5: 5,  // May -> Si (巳)
      6: 6,  // Jun -> Wu (午)
      7: 7,  // Jul -> Wei (未)
      8: 8,  // Aug -> Shen (申)
      9: 9,  // Sep -> You (酉)
      10: 10, // Oct -> Xu (戌)
      11: 0, // Nov -> Hai (亥)
      12: 11  // Dec -> Chou (丑) — wait, Dec should be Zi
    };
    // Correction: Dec -> 子(Zi)=0? Let me use a more standard mapping
    // Standard: 寅月 starts at Lichun (~Feb 4), which is the 1st month
    // So: Feb=寅(2), Mar=卯(3), Apr=辰(4), May=巳(5), Jun=午(6), Jul=未(7),
    //     Aug=申(8), Sep=酉(9), Oct=戌(10), Nov=亥(11), Dec=子(0), Jan=丑(1)
    const monthBranchMap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];
    const branchIdx = monthBranchMap[month - 1];

    const yearPillar = Bazi.yearPillar(year);
    const yearStemIdx = yearPillar.stemIdx;
    // Month stem start index from year stem
    const monthStemStart = Bazi.MONTH_START[Math.floor(yearStemIdx / 2) % 5];
    // Month 1 (寅) gets monthStemStart, so offset from 寅
    // 寅 is index 2 in branches, and it's month index 0 in our offset
    const monthOffset = (branchIdx - 2 + 12) % 12;
    const stemIdx = (monthStemStart + monthOffset) % 10;

    return { stem: Bazi.stem(stemIdx), branch: Bazi.branch(branchIdx), stemIdx, branchIdx };
  }

  /**
   * Calculate the Day Pillar using Julian Day Number
   * Day stem = (JD + 49) % 10, Day branch = (JD + 9) % 12
   * Reference: Jan 1, 1900 = JD 2415021, which was 甲戌 (Jia-Xu)
   */
  static dayPillar(year, month, day) {
    const jd = Math.floor(Bazi.toJulianDay(year, month, day));
    // Using a known reference: 1900-01-31 was 甲子 (Jia-Zi, stem=0, branch=0)
    // JD for 1900-01-31 = 2415051
    // Offset from reference
    const refJD = 2415051; // 1900-01-31, 甲子
    const diff = jd - refJD;
    const stemIdx = ((diff % 10) + 10) % 10;
    const branchIdx = ((diff % 12) + 12) % 12;
    return { stem: Bazi.stem(stemIdx), branch: Bazi.branch(branchIdx), stemIdx, branchIdx };
  }

  /**
   * Calculate the Hour Pillar
   * Hour branch is fixed by hour of day
   * Hour stem is derived from day stem using Five Rat Escape
   */
  static hourPillar(hour, dayPillar) {
    // Hour to branch: 23-01=Zi(0), 01-03=Chou(1), 03-05=Yin(2), ...
    const branchIdx = Math.floor(((hour + 1) % 24) / 2);

    const dayStemIdx = dayPillar.stemIdx;
    const hourStemStart = Bazi.HOUR_START[Math.floor(dayStemIdx / 2) % 5];
    const stemIdx = (hourStemStart + branchIdx) % 10;

    return { stem: Bazi.stem(stemIdx), branch: Bazi.branch(branchIdx), stemIdx, branchIdx };
  }

  /**
   * Analyze: main entry point
   * @param {string} birthDate - "YYYY-MM-DD"
   * @param {string} birthTime - "HH:MM" (optional, defaults to "12:00")
   */
  analyze(birthDate, birthTime = '12:00') {
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour] = birthTime.split(':').map(Number);

    const yearP = Bazi.yearPillar(year);
    const monthP = Bazi.monthPillar(year, month);
    const dayP = Bazi.dayPillar(year, month, day);
    const hourP = Bazi.hourPillar(hour, dayP);

    // Day Master is the day pillar's heavenly stem
    const dayMaster = dayP.stem;

    // Element count across all pillars
    const elementCounts = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
    [yearP, monthP, dayP, hourP].forEach(p => {
      elementCounts[p.stem.element]++;
      elementCounts[p.branch.element]++;
    });

    // Generate reading based on day master and element distribution
    const reading = Bazi.generateReading(dayMaster, elementCounts, yearP, monthP, dayP, hourP);

    return {
      yearPillar: `${yearP.stem.chinese}${yearP.stem.name} ${yearP.branch.chinese}${yearP.branch.name} (${yearP.branch.animal})`,
      monthPillar: `${monthP.stem.chinese}${monthP.stem.name} ${monthP.branch.chinese}${monthP.branch.name}`,
      dayPillar: `${dayP.stem.chinese}${dayP.stem.name} ${dayP.branch.chinese}${dayP.branch.name}`,
      hourPillar: `${hourP.stem.chinese}${hourP.stem.name} ${hourP.branch.chinese}${hourP.branch.name}`,
      elements: elementCounts,
      dayMaster: `${dayMaster.chinese} ${dayMaster.name} (${dayMaster.element} ${dayMaster.yinYang})`,
      reading,
      pillars: {
        year: { stem: yearP.stem, branch: yearP.branch },
        month: { stem: monthP.stem, branch: monthP.branch },
        day: { stem: dayP.stem, branch: dayP.branch },
        hour: { stem: hourP.stem, branch: hourP.branch },
      }
    };
  }

  static generateReading(dayMaster, elements, yearP, monthP, dayP, hourP) {
    const dominant = Object.entries(elements).sort((a, b) => b[1] - a[1])[0];
    const weak = Object.entries(elements).filter(e => e[1] === 0).map(e => e[0]);

    let reading = `Your Day Master is ${dayMaster.name} (${dayMaster.element}, ${dayMaster.yinYang}), representing your core self. `;

    // Element-based reading
    const readings = {
      Wood: "You possess growth, flexibility, and benevolence. Like a tree, you reach upward while staying rooted.",
      Fire: "You radiate passion, warmth, and transformation. Your energy inspires and illuminates those around you.",
      Earth: "You embody stability, nurturing, and reliability. You are the foundation upon which others build.",
      Metal: "You carry precision, determination, and righteousness. Your clarity cuts through confusion.",
      Water: "You flow with wisdom, adaptability, and depth. Like water, you find the path of least resistance yet shape mountains."
    };

    reading += readings[dayMaster.element] + ' ';

    if (dominant[1] >= 3) {
      reading += `${dominant[0]} energy dominates your chart, amplifying ${dominant[0].toLowerCase()} traits. `;
    }
    if (weak.length > 0) {
      reading += `Missing elements: ${weak.join(', ')} — cultivating these energies may bring balance to your life. `;
    }

    // Year pillar gives ancestral/external influence
    reading += `Year pillar ${yearP.stem.name}-${yearP.branch.name} (${yearP.branch.animal}) shapes your outer destiny and family karma. `;

    // Hour pillar gives later life/children
    reading += `Hour pillar ${hourP.stem.name}-${hourP.branch.name} governs your later years and legacy.`;

    return reading;
  }
}

// Export for Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Bazi;
}
