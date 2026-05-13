/**
 * I Ching (易经) — Hexagram Engine
 * Derives hexagram from birth date using numerological reduction.
 * Includes all 64 hexagrams with names, judgment, and image.
 */

class IChing {
  // 8 Trigrams (八卦) — ordered by number (1-8)
  static TRIGRAMS = {
    1: { name: 'Qian', chinese: '乾', element: 'Heaven', nature: 'Creative', lines: [1,1,1] },
    2: { name: 'Dui',  chinese: '兑', element: 'Lake',   nature: 'Joyous',  lines: [0,1,1] },
    3: { name: 'Li',   chinese: '离', element: 'Fire',   nature: 'Clinging',lines: [1,0,1] },
    4: { name: 'Zhen', chinese: '震', element: 'Thunder',nature: 'Arousing',lines: [0,0,1] },
    5: { name: 'Xun',  chinese: '巽', element: 'Wind',   nature: 'Gentle',  lines: [1,1,0] },
    6: { name: 'Kan',  chinese: '坎', element: 'Water',  nature: 'Abysmal', lines: [0,1,0] },
    7: { name: 'Gen',  chinese: '艮', element: 'Mountain',nature:'Keeping Still',lines:[1,0,0]},
    8: { name: 'Kun',  chinese: '坤', element: 'Earth',  nature: 'Receptive',lines: [0,0,0] },
  };

  // All 64 Hexagrams: [hexNum] = { chinese, english, judgment, image }
  static HEXAGRAMS = {
    1:  { cn: '乾', en: 'The Creative',       judgment: 'Supreme success. Perseverance furthers.', image: 'Heaven above, Heaven below: pure creative energy. The superior person strengthens themselves continuously.' },
    2:  { cn: '坤', en: 'The Receptive',       judgment: 'Supreme success through devotion. The mare brings good fortune.', image: 'Earth above, Earth below: devotion and yielding. The superior person carries all things with generosity.' },
    3:  { cn: '屯', en: 'Difficulty at the Beginning', judgment: 'Supreme success through perseverance. Nothing should be undertaken without appointing helpers.', image: 'Clouds and thunder: difficulty. The superior person brings order out of confusion.' },
    4:  { cn: '蒙', en: 'Youthful Folly',      judgment: 'Success. It is not I who seeks the young fool; the young fool seeks me.', image: 'A spring wells up at the foot of the mountain: the image of youth. The superior person fosters character by thoroughness.' },
    5:  { cn: '需', en: 'Waiting',             judgment: 'Sincerity brings brilliant success. Perseverance brings good fortune. It furthers one to cross the great water.', image: 'Clouds rise up to Heaven: waiting. The superior person eats and drinks and is of good cheer.' },
    6:  { cn: '讼', en: 'Conflict',            judgment: 'You are sincere but being obstructed. A cautious halt halfway brings good fortune.', image: 'Heaven and water go their separate ways: conflict. The superior person carefully considers the beginning.' },
    7:  { cn: '师', en: 'The Army',            judgment: 'The army needs perseverance and a strong leader. Good fortune without blame.', image: 'Water in the earth: the army. The superior person increases their masses by generosity.' },
    8:  { cn: '比', en: 'Holding Together',    judgment: 'Good fortune. Inquire of the oracle once again whether you possess sublimity, constancy, and perseverance.', image: 'Water on the earth: holding together. The ancient kings established states and maintained relationships.' },
    9:  { cn: '小畜', en: 'The Taming Power of the Small', judgment: 'Success. Dense clouds, no rain from our western region.', image: 'Wind drives across Heaven: the taming power of the small. The superior person refines their outward aspect.' },
    10: { cn: '履', en: 'Treading',            judgment: 'Treading upon the tail of the tiger. It does not bite. Success.', image: 'Heaven above, the lake below: treading. The superior person discriminates between high and low.' },
    11: { cn: '泰', en: 'Peace',               judgment: 'The small departs, the great approaches. Good fortune. Success.', image: 'Heaven and earth unite: peace. The ruler divides and completes the course of Heaven and earth.' },
    12: { cn: '否', en: 'Standstill',          judgment: 'Evil people do not further the perseverance of the superior person. The great departs, the small approaches.', image: 'Heaven and earth do not unite: standstill. The superior person falls back upon inner worth.' },
    13: { cn: '同人', en: 'Fellowship',         judgment: 'Success. It furthers one to cross the great water. The perseverance of the superior person furthers.', image: 'Heaven together with fire: fellowship. The superior person organizes the clans.' },
    14: { cn: '大有', en: 'Great Possession',   judgment: 'Supreme success.', image: 'Fire in Heaven above: great possession. The superior person curbs evil and furthers good.' },
    15: { cn: '谦', en: 'Modesty',             judgment: 'Success. The superior person carries things through.', image: 'Within the earth, a mountain: modesty. The superior person reduces that which is too much.' },
    16: { cn: '豫', en: 'Enthusiasm',          judgment: 'It furthers one to appoint helpers and to set armies marching.', image: 'Thunder comes resounding out of the earth: enthusiasm. The ancient kings made music and honored virtue.' },
    17: { cn: '随', en: 'Following',           judgment: 'Supreme success. Perseverance furthers. No blame.', image: 'Thunder in the middle of the lake: following. The superior person at nightfall goes indoors for rest.' },
    18: { cn: '蛊', en: 'Work on the Decayed', judgment: 'Supreme success. It furthers one to cross the great water. Before the starting point, three days. After, three days.', image: 'The wind blows low on the mountain: decay. The superior person stirs up the people.' },
    19: { cn: '临', en: 'Approach',            judgment: 'Supreme success. Perseverance furthers. In the eighth month there is misfortune.', image: 'The earth above the lake: approach. The superior person is inexhaustible in teaching.' },
    20: { cn: '观', en: 'Contemplation',       judgment: 'The ablution has been made, but not yet the offering. Look with sincerity.', image: 'The wind blows over the earth: contemplation. The ancient kings visited the regions and contemplated the people.' },
    21: { cn: '噬嗑', en: 'Biting Through',     judgment: 'Success. It is favorable to administer justice.', image: 'Thunder and lightning: biting through. The ancient kings made laws clear by administering penalties.' },
    22: { cn: '贲', en: 'Grace',               judgment: 'Success. In small matters it is favorable to undertake something.', image: 'Fire at the foot of the mountain: grace. The superior person clarifies current affairs but dares not decide controversies.' },
    23: { cn: '剥', en: 'Splitting Apart',     judgment: 'It does not further one to go anywhere.', image: 'The mountain rests on the earth: splitting apart. Those above ensure their position by generosity.' },
    24: { cn: '复', en: 'Return',              judgment: 'Success. Going out and coming in without error. Friends come without blame. On the seventh day comes return.', image: 'Thunder within the earth: return. The ancient kings closed the passes at the solstice.' },
    25: { cn: '无妄', en: 'Innocence',          judgment: 'Supreme success. Perseverance furthers. If someone is not as they should be, misfortune follows.', image: 'Under Heaven thunder rolls: innocence. The ancient kings aligned with the seasons.' },
    26: { cn: '大畜', en: 'The Taming Power of the Great', judgment: 'Perseverance furthers. Not eating at home brings good fortune. It furthers one to cross the great water.', image: 'Heaven within the mountain: the great taming. The superior person learns from past words and deeds.' },
    27: { cn: '颐', en: 'Nourishment',         judgment: 'Perseverance brings good fortune. Pay heed to the providing of nourishment and to what a person seeks to nourish.', image: 'At the foot of the mountain, thunder: nourishment. The superior person is careful of words and temperate in eating.' },
    28: { cn: '大过', en: 'Preponderance of the Great', judgment: 'The ridgepole sags to the breaking point. It furthers one to have somewhere to go. Success.', image: 'The lake rises above the trees: preponderance. The superior person stands alone and does not fear.' },
    29: { cn: '坎', en: 'The Abysmal (Water)', judgment: 'If you are sincere, you have success in your heart. Whatever you do succeeds.', image: 'Water flows on and on: the abysmal. The superior person walks in lasting virtue.' },
    30: { cn: '离', en: 'The Clinging (Fire)', judgment: 'Perseverance furthers. It brings success. Care of the cow brings good fortune.', image: 'Flames cling to each other: the clinging. The superior person illuminates the four quarters.' },
    31: { cn: '咸', en: 'Influence',           judgment: 'Success. Perseverance furthers. Taking a maiden to wife brings good fortune.', image: 'A lake on the mountain: influence. The superior person encourages people to approach.' },
    32: { cn: '恒', en: 'Duration',            judgment: 'Success. No blame. Perseverance furthers. It furthers one to have somewhere to go.', image: 'Thunder and wind: duration. The superior person stands firm and does not change direction.' },
    33: { cn: '遁', en: 'Retreat',             judgment: 'Success. In what is small, perseverance furthers.', image: 'Mountain under Heaven: retreat. The superior person keeps the inferior at a distance.' },
    34: { cn: '大壮', en: 'The Power of the Great', judgment: 'Perseverance furthers.', image: 'Thunder in Heaven above: the power of the great. The superior person does not tread upon paths that do not accord with right.' },
    35: { cn: '晋', en: 'Progress',            judgment: 'The powerful prince is honored with horses in large numbers. In a single day he is granted audience three times.', image: 'The sun rises over the earth: progress. The superior person brightens their bright virtue.' },
    36: { cn: '明夷', en: 'Darkening of the Light', judgment: 'In adversity it furthers one to be persevering.', image: 'The light has sunk into the earth: darkening. The superior person lives with the great mass and veils their light.' },
    37: { cn: '家人', en: 'The Family',         judgment: 'The perseverance of the woman furthers.', image: 'Wind comes forth from fire: the family. The superior person has substance in their words and duration in their conduct.' },
    38: { cn: '睽', en: 'Opposition',          judgment: 'In small matters, good fortune.', image: 'Above, fire; below, the lake: opposition. The superior person retains individuality amid community.' },
    39: { cn: '蹇', en: 'Obstruction',         judgment: 'The southwest furthers. The northeast does not further. It furthers one to see the great person. Perseverance brings good fortune.', image: 'Water on the mountain: obstruction. The superior person turns their attention inward.' },
    40: { cn: '解', en: 'Deliverance',         judgment: 'The southwest furthers. If there is no longer anything to go, return brings good fortune. If there is still something to go, haste brings good fortune.', image: 'Thunder and rain: deliverance. The superior person pardons mistakes and forgives misdeeds.' },
    41: { cn: '损', en: 'Decrease',            judgment: 'Combined with sincerity, decrease brings about supreme good fortune. Two small bowls may be used for the sacrifice.', image: 'At the foot of the mountain, the lake: decrease. The superior person controls their anger and restrains their instincts.' },
    42: { cn: '益', en: 'Increase',            judgment: 'It furthers one to undertake something. It furthers one to cross the great water.', image: 'Wind and thunder: increase. The superior person sees good and imitates it; has faults and reforms.' },
    43: { cn: '夬', en: 'Breakthrough',        judgment: 'One must resolutely make the matter known at the royal court. It must be announced truthfully. Danger.', image: 'The lake has risen up to Heaven: breakthrough. The superior person dispenses riches downward.' },
    44: { cn: '姤', en: 'Coming to Meet',      judgment: 'The maiden is powerful. One should not marry such a maiden.', image: 'Under Heaven, wind: coming to meet. The prince issues commands and proclaims them to the four quarters.' },
    45: { cn: '萃', en: 'Gathering Together',  judgment: 'Success. The king approaches his temple. It furthers one to see the great person. Perseverance brings good fortune.', image: 'Over the earth, the lake: gathering. The superior person renews their weapons to meet the unforeseen.' },
    46: { cn: '升', en: 'Pushing Upward',      judgment: 'Supreme success. One must see the great person. Fear not. Departure toward the south brings good fortune.', image: 'Within the earth, wood grows: pushing upward. The superior person builds up character step by step.' },
    47: { cn: '困', en: 'Oppression',          judgment: 'Success. Perseverance. The great person brings about good fortune. No blame. When one has something to say, it is not believed.', image: 'The lake has no water: oppression. The superior person stakes their life on following their will.' },
    48: { cn: '井', en: 'The Well',            judgment: 'The town may be changed, but the well cannot be changed. It neither decreases nor increases. People come and go and draw from the well.', image: 'Water over wood: the well. The superior person encourages the people at their work.' },
    49: { cn: '革', en: 'Revolution',          judgment: 'On your own day you are believed. Supreme success. Perseverance furthers. Remorse disappears.', image: 'Fire in the lake: revolution. The superior person sets the calendar in order and makes the seasons clear.' },
    50: { cn: '鼎', en: 'The Cauldron',        judgment: 'Supreme good fortune. Success.', image: 'Fire over wood: the cauldron. The superior person consolidates their fate by being in the correct position.' },
    51: { cn: '震', en: 'The Arousing (Thunder)', judgment: 'Success. Thunder brings shock and alarm. The shock terrifies for a hundred miles, but the one who holds the sacrificial spoon is not affected.', image: 'Thunder repeated: the arousing. The superior person in fear and trembling sets their life in order.' },
    52: { cn: '艮', en: 'Keeping Still',       judgment: 'Keeping his back still so that he no longer feels his body. He goes into his courtyard and does not see his people. No blame.', image: 'Mountains standing close: keeping still. The superior person does not permit thoughts beyond their position.' },
    53: { cn: '渐', en: 'Development',         judgment: 'The maiden is given in marriage. Good fortune. Perseverance furthers.', image: 'On the mountain, a tree: development. The superior person abides in dignity and virtue.' },
    54: { cn: '归妹', en: 'The Marrying Maiden', judgment: 'Undertakings bring misfortune. Nothing that would further.', image: 'Thunder over the lake: the marrying maiden. The superior person understands the transitory and the lasting.' },
    55: { cn: '丰', en: 'Abundance',           judgment: 'Success. The king attains abundance. Be not sad; be like the sun at midday.', image: 'Thunder and lightning come: abundance. The superior person decides lawsuits and carries out punishments.' },
    56: { cn: '旅', en: 'The Wanderer',        judgment: 'Success through smallness. Perseverance of the wanderer brings good fortune.', image: 'Fire on the mountain: the wanderer. The superior person is clear-minded and cautious with penalties.' },
    57: { cn: '巽', en: 'The Gentle (Wind)',   judgment: 'Success through what is small. It furthers one to have somewhere to go. It furthers one to see the great person.', image: 'Winds following one upon the other: the gentle. The superior person spreads commands abroad and carries out undertakings.' },
    58: { cn: '兑', en: 'The Joyous (Lake)',   judgment: 'Success. Perseverance is favorable.', image: 'Lakes resting one on the other: the joyous. The superior person joins with friends for discussion and practice.' },
    59: { cn: '涣', en: 'Dispersion',          judgment: 'Success. The king approaches his temple. It furthers one to cross the great water. Perseverance furthers.', image: 'Wind drives over water: dispersion. The ancient kings sacrificed to the Lord and built temples.' },
    60: { cn: '节', en: 'Limitation',          judgment: 'Success. Galling limitation must not be persevered in.', image: 'Water over the lake: limitation. The superior person creates number and measure.' },
    61: { cn: '中孚', en: 'Inner Truth',        judgment: 'Pigs and fishes. Good fortune. It furthers one to cross the great water. Perseverance furthers.', image: 'Wind over the lake: inner truth. The superior person discusses criminal cases and delays executions.' },
    62: { cn: '小过', en: 'Preponderance of the Small', judgment: 'Success. Perseverance furthers. Small things may be done; great things should not be done.', image: 'Thunder on the mountain: preponderance of the small. The superior person exceeds in恭敬 and sorrow.' },
    63: { cn: '既济', en: 'After Completion',   judgment: 'Success in small matters. Perseverance furthers. Good fortune in the beginning, disorder at the end.', image: 'Water over fire: after completion. The superior person thinks of misfortune and arms themselves against it.' },
    64: { cn: '未济', en: 'Before Completion',  judgment: 'Success. But if the little fox, after nearly completing the crossing, gets its tail in the water, there is nothing that would further.', image: 'Fire over water: before completion. The superior person is careful in distinguishing things.' },
  };

  /**
   * Map a number (1-8) to a trigram. 0 maps to 8 (Kun).
   */
  static getTrigram(num) {
    const n = ((num - 1) % 8) + 1; // normalize to 1-8
    return IChing.TRIGRAMS[n];
  }

  /**
   * Derive hexagram from birth date
   * Upper trigram = (year + month + day) % 8, with 0 → 8
   * Lower trigram = (year + month + day + hour) % 8, with 0 → 8
   */
  static deriveHexagram(year, month, day, hour = 12) {
    let upperNum = (year + month + day) % 8;
    if (upperNum === 0) upperNum = 8;

    let lowerNum = (year + month + day + hour) % 8;
    if (lowerNum === 0) lowerNum = 8;

    // Hexagram number = (upper - 1) * 8 + lower
    const hexNum = (upperNum - 1) * 8 + lowerNum;

    return { hexNum, upperNum, lowerNum };
  }

  /**
   * Analyze: main entry point
   */
  analyze(birthDate, birthTime = '12:00') {
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour] = birthTime.split(':').map(Number);

    const { hexNum, upperNum, lowerNum } = IChing.deriveHexagram(year, month, day, hour);
    const upperTrigram = IChing.getTrigram(upperNum);
    const lowerTrigram = IChing.getTrigram(lowerNum);
    const hexagram = IChing.HEXAGRAMS[hexNum];

    const reading = `Hexagram ${hexNum} "${hexagram.en}" (${hexagram.cn}) reveals your destiny pattern. ` +
      `Upper trigram ${upperTrigram.chinese} ${upperTrigram.name} (${upperTrigram.element}) above ` +
      `lower trigram ${lowerTrigram.chinese} ${lowerTrigram.name} (${lowerTrigram.element}). ` +
      `Judgment: ${hexagram.judgment} ` +
      `Image: ${hexagram.image}`;

    return {
      hexagramNumber: hexNum,
      name: hexagram.en,
      chineseName: hexagram.cn,
      upperTrigram: upperTrigram,
      lowerTrigram: lowerTrigram,
      judgment: hexagram.judgment,
      image: hexagram.image,
      reading,
      lines: [...upperTrigram.lines, ...lowerTrigram.lines],
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = IChing;
}
