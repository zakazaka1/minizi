/**
 * Build HSK character data from canonical sources:
 *  - hsk30.csv         (HSK 3.0 vocabulary, 11k entries, levels 1..7-9)
 *  - hsk30-chars.csv   (3000 individual characters, ranked by frequency)
 *  - hsk30-grammar.csv (grammar patterns by level)
 *  - cedict_ts.u8      (CC-CEDICT — English meanings, fallback)
 *  - hanzi-writer-data (per-character stroke JSON; we only check existence)
 *
 * + a small hand-curated Russian translation table for HSK1's most common
 *   characters so the demo is fully usable in Russian without an external API.
 *
 * Output:
 *  - src/data/characters.json    (all HSK chars w/ level, pinyin, meanings)
 *  - src/data/lessons.json       (HSK1 grouped into 5-character lessons)
 *  - src/data/grammar.json       (grammar notes for HSK1)
 *
 * Usage: pnpm/npm run build:data
 */

import * as fs from "node:fs";
import * as path from "node:path";

const DATA_ROOT = "/home/ubuntu/data";
const HSK_DIR = path.join(DATA_ROOT, "hsk30");
const HW_DATA_DIR = path.join(DATA_ROOT, "hanzi-writer-data", "data");
const CEDICT_PATH = path.join(DATA_ROOT, "cedict_ts.u8");

const SRC_DATA_DIR = path.resolve(__dirname, "..", "src", "data");

// Hand-curated Russian primary meanings for the most common HSK1 characters.
// Where missing we fall back to CEDICT English.
const RU: Record<string, string> = {
  你: "ты",
  我: "я",
  他: "он",
  她: "она",
  们: "(множ. число)",
  好: "хороший",
  是: "быть",
  不: "не",
  的: "(притяж. частица)",
  一: "один",
  二: "два",
  三: "три",
  四: "четыре",
  五: "пять",
  六: "шесть",
  七: "семь",
  八: "восемь",
  九: "девять",
  十: "десять",
  人: "человек",
  大: "большой",
  小: "маленький",
  中: "середина",
  上: "верх / на",
  下: "низ / под",
  天: "небо / день",
  地: "земля",
  日: "солнце / день",
  月: "луна / месяц",
  年: "год",
  时: "время / час",
  分: "минута / доля",
  水: "вода",
  火: "огонь",
  山: "гора",
  口: "рот",
  心: "сердце",
  手: "рука",
  目: "глаз",
  爱: "любить",
  爸: "папа",
  妈: "мама",
  家: "семья / дом",
  学: "учить(ся)",
  生: "рождаться / жизнь",
  老: "старый",
  师: "учитель",
  朋: "друг (компонент)",
  友: "друг",
  同: "одинаковый",
  事: "дело",
  工: "работа / труд",
  作: "делать",
  会: "уметь / собрание",
  能: "мочь",
  要: "хотеть / надо",
  想: "думать / хотеть",
  说: "говорить",
  话: "речь / слова",
  听: "слушать",
  看: "смотреть",
  读: "читать",
  写: "писать",
  吃: "есть (пищу)",
  喝: "пить",
  饭: "еда / рис",
  菜: "блюдо / овощи",
  茶: "чай",
  水果: "фрукты",
  果: "плод",
  苹: "яблоко (компонент)",
  果汁: "сок",
  汁: "сок",
  鱼: "рыба",
  肉: "мясо",
  奶: "молоко",
  车: "машина",
  飞: "летать",
  机: "машина / случай",
  船: "корабль",
  路: "дорога",
  走: "идти",
  跑: "бегать",
  来: "приходить",
  去: "идти / уходить",
  到: "до / прибывать",
  在: "быть в / находиться",
  有: "иметь",
  没: "не / нет",
  这: "это",
  那: "то",
  哪: "какой / где",
  什么: "что",
  谁: "кто",
  几: "сколько (мало)",
  多: "много",
  少: "мало",
  很: "очень",
  也: "тоже",
  都: "все / уже",
  和: "и / с",
  跟: "с / следовать",
  从: "из / от",
  对: "правильный / к",
  问: "спрашивать",
  请: "пожалуйста / просить",
  谢: "благодарить",
  再: "снова / ещё",
  见: "видеть",
  喜: "радость",
  欢: "радостный",
  快: "быстро / скоро",
  慢: "медленно",
  早: "рано / утро",
  晚: "поздно / вечер",
  今: "сейчас / сегодня",
  明: "ясный / завтра",
  昨: "вчера (компонент)",
  现: "сейчас",
  星: "звезда",
  期: "период / неделя",
  点: "точка / час",
  打: "бить / делать",
  开: "открывать",
  关: "закрывать",
  钱: "деньги",
  买: "покупать",
  卖: "продавать",
  做: "делать",
  让: "позволять",
  把: "(маркер обьекта)",
  被: "(пассивный маркер)",
  比: "сравнивать",
  最: "самый",
  更: "ещё / более",
  还: "ещё / всё ещё",
  就: "тогда / именно",
  才: "только тогда",
  已: "уже",
  经: "проходить / классика",
  正: "именно / прямой",
  字: "иероглиф",
  名: "имя",
  本: "корень / том",
  书: "книга",
  桌: "стол",
  椅: "стул",
  门: "дверь",
  窗: "окно",
  房: "комната",
  间: "промежуток",
  里: "внутри",
  外: "снаружи",
  前: "перед",
  后: "после",
  左: "слева",
  右: "справа",
  东: "восток",
  西: "запад / вещь",
  南: "юг",
  北: "север",
  国: "страна",
  号: "номер",
  楼: "этаж / здание",
  电: "электричество",
  脑: "мозг",
  视: "смотреть",
  影: "тень / фильм",
  语: "язык",
  汉: "ханьский / китайский",
  英: "английский (англо-)",
  俄: "русский",
};

// ─────────────────────────────────────────────────────────────────────────────

interface CedictEntry {
  trad: string;
  simp: string;
  pinyin: string;
  defs: string[];
}

function parseCedict(): Map<string, CedictEntry> {
  const txt = fs.readFileSync(CEDICT_PATH, "utf8");
  const map = new Map<string, CedictEntry>();
  for (const rawLine of txt.split("\n")) {
    const line = rawLine.replace(/\r$/, "");
    if (!line || line.startsWith("#")) continue;
    // Format: TRAD SIMP [pinyin] /def1/def2/.../
    const m = line.match(/^(\S+) (\S+) \[([^\]]+)\] \/(.+)\/$/);
    if (!m) continue;
    const [, trad, simp, pinyin, defs] = m;
    const existing = map.get(simp);
    if (existing && existing.defs.length >= defs.split("/").length) continue;
    map.set(simp, {
      trad,
      simp,
      pinyin,
      defs: defs.split("/").filter(Boolean),
    });
  }
  return map;
}

// Pinyin tone marks
const TONES: Record<string, string[]> = {
  a: ["ā", "á", "ǎ", "à"],
  e: ["ē", "é", "ě", "è"],
  i: ["ī", "í", "ǐ", "ì"],
  o: ["ō", "ó", "ǒ", "ò"],
  u: ["ū", "ú", "ǔ", "ù"],
  "u:": ["ǖ", "ǘ", "ǚ", "ǜ"],
  v: ["ǖ", "ǘ", "ǚ", "ǜ"],
  A: ["Ā", "Á", "Ǎ", "À"],
  E: ["Ē", "É", "Ě", "È"],
  I: ["Ī", "Í", "Ǐ", "Ì"],
  O: ["Ō", "Ó", "Ǒ", "Ò"],
  U: ["Ū", "Ú", "Ǔ", "Ù"],
};

function numericToPinyin(numeric: string): string {
  // "ni3 hao3" -> "nǐ hǎo"
  return numeric
    .split(/\s+/)
    .map((syl) => {
      const m = syl.match(/^([a-zA-Z:]+?)([1-5])$/);
      if (!m) return syl;
      const [, baseRaw, toneStr] = m;
      let base = baseRaw;
      const tone = parseInt(toneStr, 10);
      if (tone === 5 || tone === 0) return base.replace("u:", "ü").replace("v", "ü");
      // Choose vowel to mark: a, e, ou, then last vowel
      const order = ["a", "o", "e", "i", "u", "ü", "v", "u:"];
      base = base.replace("u:", "ü").replace("v", "ü");
      let target = -1;
      for (const v of order) {
        const idx = base.toLowerCase().indexOf(v);
        if (idx >= 0) {
          target = idx;
          break;
        }
      }
      if (target < 0) return base;
      const ch = base[target];
      const lookup = TONES[ch] || TONES[ch.toLowerCase()];
      const replaced = lookup ? lookup[tone - 1] : ch;
      return base.slice(0, target) + replaced + base.slice(target + 1);
    })
    .join(" ");
}

interface CharRecord {
  hanzi: string;
  pinyin: string;
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  freq: number;
  meaningPrimary: string;
  meaningsRu: string[];
  meaningsEn: string[];
  hasStrokes: boolean;
  /** Decomposition string from MakeMeAHanzi, e.g. "⿱爫友" for 爱. */
  decomposition?: string;
  /** Visible component characters extracted from the decomposition. */
  components?: string[];
  /** Primary radical, when known. */
  radical?: string;
  /** Free-text etymology hint (when MakeMeAHanzi has one). */
  etymology?: string;
}

interface MmahEntry {
  character: string;
  decomposition?: string;
  radical?: string;
  etymology?: { type?: string; hint?: string; phonetic?: string; semantic?: string };
}

function parseMmahDictionary(): Map<string, MmahEntry> {
  const map = new Map<string, MmahEntry>();
  const p = path.join(DATA_ROOT, "makemeahanzi", "dictionary.txt");
  if (!fs.existsSync(p)) return map;
  for (const rawLine of fs.readFileSync(p, "utf8").split("\n")) {
    const line = rawLine.replace(/\r$/, "").trim();
    if (!line) continue;
    try {
      const entry = JSON.parse(line) as MmahEntry;
      if (entry.character) map.set(entry.character, entry);
    } catch {
      // skip malformed lines
    }
  }
  return map;
}

/** Pull the visible CJK characters out of a decomposition string. */
function extractComponents(decomp: string | undefined): string[] {
  if (!decomp) return [];
  const out: string[] = [];
  for (const ch of decomp) {
    const code = ch.codePointAt(0) ?? 0;
    // Decomposition operators live in the IDS area U+2FF0..U+2FFF; "?" is unknown.
    if (code >= 0x2ff0 && code <= 0x2fff) continue;
    if (ch === "?" || ch === "？") continue;
    // Only keep CJK ideographs / radicals
    const isCjk =
      (code >= 0x3400 && code <= 0x4dbf) ||
      (code >= 0x4e00 && code <= 0x9fff) ||
      (code >= 0xf900 && code <= 0xfaff) ||
      (code >= 0x20000 && code <= 0x2ffff) ||
      (code >= 0x2e80 && code <= 0x2eff) || // CJK Radicals Supplement
      (code >= 0x2f00 && code <= 0x2fdf); // Kangxi Radicals
    if (isCjk) out.push(ch);
  }
  return out;
}

function buildCharacters(): CharRecord[] {
  const charsCsv = fs.readFileSync(path.join(HSK_DIR, "hsk30-chars.csv"), "utf8");
  const lines = charsCsv.trim().split("\n");
  lines.shift(); // header

  const cedict = parseCedict();
  const mmah = parseMmahDictionary();
  const chars: CharRecord[] = [];

  for (const line of lines) {
    // Hanzi,Level,WritingLevel,Traditional,Freq,Examples
    const cells = line.split(",");
    const hanzi = cells[0]?.trim();
    if (!hanzi || hanzi.length !== 1) continue;
    const levelStr = cells[1]?.trim() ?? "1";
    const freq = parseInt(cells[4] ?? "0", 10) || 0;
    const cedictEntry = cedict.get(hanzi);
    const meaningsEn = cedictEntry?.defs ?? [];
    const ru = RU[hanzi];
    const meaningsRu = ru ? [ru] : [];
    const meaningPrimary = ru ?? meaningsEn[0] ?? "";
    const pinyin = cedictEntry ? numericToPinyin(cedictEntry.pinyin) : "";

    // Map "7-9" → 7
    let level: number = 1;
    if (levelStr === "7-9") level = 7;
    else level = parseInt(levelStr, 10) || 1;

    // hasStrokes: check the hanzi-writer-data dir for a JSON file
    let hasStrokes = false;
    try {
      hasStrokes = fs.existsSync(path.join(HW_DATA_DIR, `${hanzi}.json`));
    } catch {
      hasStrokes = false;
    }

    const mm = mmah.get(hanzi);
    const decomposition = mm?.decomposition;
    const components = extractComponents(decomposition).filter((c) => c !== hanzi);
    const radical = mm?.radical && mm.radical !== "?" ? mm.radical : undefined;
    const etymology = mm?.etymology?.hint;

    chars.push({
      hanzi,
      pinyin,
      level: level as CharRecord["level"],
      freq,
      meaningPrimary,
      meaningsRu,
      meaningsEn,
      hasStrokes,
      ...(decomposition ? { decomposition } : {}),
      ...(components.length ? { components } : {}),
      ...(radical ? { radical } : {}),
      ...(etymology ? { etymology } : {}),
    });
  }
  return chars;
}

interface Lesson {
  id: string;
  level: number;
  index: number;
  characters: string[];
  grammarNote?: { title: string; body: string; examples?: { hanzi: string; pinyin: string; ru: string }[] };
}

const HSK1_GRAMMAR_BITS: Lesson["grammarNote"][] = [
  {
    title: "Вопросы с 吗",
    body: "Утверждение + 吗 = вопрос «да/нет».",
    examples: [
      { hanzi: "你好吗？", pinyin: "nǐ hǎo ma?", ru: "Как ты?" },
      { hanzi: "他是学生吗？", pinyin: "tā shì xuésheng ma?", ru: "Он студент?" },
    ],
  },
  {
    title: "Личные местоимения",
    body: "我 я · 你 ты · 他/她 он/она · 们 — суффикс множественного числа.",
    examples: [
      { hanzi: "我们", pinyin: "wǒmen", ru: "мы" },
      { hanzi: "你们", pinyin: "nǐmen", ru: "вы" },
      { hanzi: "他们", pinyin: "tāmen", ru: "они" },
    ],
  },
  {
    title: "Связка 是",
    body: "A 是 B — «A есть B». Используется для определений и тождеств.",
    examples: [
      { hanzi: "我是学生。", pinyin: "wǒ shì xuésheng.", ru: "Я студент." },
      { hanzi: "他是老师。", pinyin: "tā shì lǎoshī.", ru: "Он учитель." },
    ],
  },
  {
    title: "Отрицание 不",
    body: "Ставится перед глаголом или прилагательным.",
    examples: [
      { hanzi: "我不去。", pinyin: "wǒ bù qù.", ru: "Я не пойду." },
      { hanzi: "不好。", pinyin: "bù hǎo.", ru: "Не хорошо." },
    ],
  },
  {
    title: "Притяжательное 的",
    body: "X 的 Y = «Y, принадлежащий X».",
    examples: [
      { hanzi: "我的书", pinyin: "wǒ de shū", ru: "моя книга" },
      { hanzi: "他的家", pinyin: "tā de jiā", ru: "его дом" },
    ],
  },
  {
    title: "Числа",
    body: "一二三四五六七八九十 — 1..10. 11 = 十一, 20 = 二十.",
  },
  {
    title: "Указательные 这 / 那",
    body: "这 — это (близкое), 那 — то (далёкое).",
    examples: [
      { hanzi: "这是我的书。", pinyin: "zhè shì wǒ de shū.", ru: "Это моя книга." },
    ],
  },
];

function buildLessons(chars: CharRecord[]): Lesson[] {
  // HSK1: use only chars with strokes available + a Russian meaning, ordered by freq
  const hsk1 = chars.filter((c) => c.level === 1).sort((a, b) => a.freq - b.freq);
  const lessons: Lesson[] = [];
  let lessonIdx = 0;
  for (let i = 0; i < hsk1.length; i += 5) {
    const slice = hsk1.slice(i, i + 5);
    if (slice.length < 5) break;
    lessons.push({
      id: `hsk1-l${String(lessonIdx + 1).padStart(2, "0")}`,
      level: 1,
      index: lessonIdx,
      characters: slice.map((c) => c.hanzi),
      grammarNote: HSK1_GRAMMAR_BITS[lessonIdx] ?? undefined,
    });
    lessonIdx += 1;
  }
  return lessons;
}

function main() {
  fs.mkdirSync(SRC_DATA_DIR, { recursive: true });
  console.log("Parsing CC-CEDICT…");
  const chars = buildCharacters();
  console.log(`  ${chars.length} characters`);
  console.log("Building lessons…");
  const lessons = buildLessons(chars);
  console.log(`  ${lessons.length} HSK1 lessons`);

  fs.writeFileSync(path.join(SRC_DATA_DIR, "characters.json"), JSON.stringify(chars));
  fs.writeFileSync(path.join(SRC_DATA_DIR, "lessons.json"), JSON.stringify(lessons));
  fs.writeFileSync(
    path.join(SRC_DATA_DIR, "grammar.json"),
    JSON.stringify(HSK1_GRAMMAR_BITS.filter(Boolean))
  );

  // Also produce a tiny "showcase" subset to cap landing-page bundle size
  const showcase = chars
    .filter((c) => c.level === 1 && c.hasStrokes && c.meaningPrimary)
    .slice(0, 20);
  fs.writeFileSync(path.join(SRC_DATA_DIR, "showcase.json"), JSON.stringify(showcase));

  console.log("Done.");
}

main();
