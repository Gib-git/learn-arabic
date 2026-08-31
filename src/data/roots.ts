import { VOCAB, type VocabWord } from './vocab';

// Core meanings ("the picture behind the root") for the most important roots.
// Roots without an entry still appear in the explorer, grouped from vocabulary.
export const ROOT_MEANINGS: Record<string, string> = {
  'ر ح م': 'womb; tenderness → mercy, compassion',
  'ك ت ب': 'writing → book, scripture, decree',
  'ق و ل': 'saying, speech',
  'ك و ن': 'being, existing',
  'أ م ن': 'safety, security → faith (security of the heart)',
  'ع ل م': 'knowing → knowledge, the worlds (that which makes God known), signposts',
  'ك ف ر': 'covering, concealing → ingratitude, disbelief (covering the truth)',
  'خ ل ق': 'shaping, measuring out → creation',
  'ع م ل': 'doing, working → deeds',
  'س ل م': 'wholeness, peace, safety → islām (entering peace by submission)',
  'ع ب د': 'serving → worship, servant',
  'ر ب ب': 'nurturing, mastering → lord, sustainer',
  'ه د ي': 'guiding → guidance, gift',
  'ذ ك ر': 'remembering, mentioning → remembrance, reminder',
  'غ ف ر': 'covering protectively → forgiveness',
  'ن ز ل': 'coming down → sending down revelation',
  'و ق ي': 'shielding, guarding → taqwā (God-consciousness)',
  'ص ل و': 'connection → ritual prayer',
  'ز ك و': 'growth, purity → purifying charity',
  'ج ن ن': 'covering, hiding → garden (hidden ground), jinn (hidden beings), madness',
  'م ل ك': 'possessing, ruling → king, dominion, angel (heavenly agent)',
  'ق ر أ': 'reciting, reading → Quran (the Recitation)',
  'ح م د': 'praising with gratitude',
  'د ي ن': 'debt, obligation → judgment, religion (what is owed)',
  'ح ي ي': 'living → life, giving life',
  'م و ت': 'dying → death',
  'ن و ر': 'light, fire (same glow, two faces: nūr and nār)',
  'س م ع': 'hearing',
  'ب ص ر': 'seeing, insight',
  'ح ك م': 'restraining, judging → wisdom, judgment, all-wise',
  'ق د ر': 'measuring, having power → decree, ability',
  'ع ز ز': 'might, being unassailable',
  'ظ ل م': 'darkness → wrongdoing (placing things in the dark, out of place)',
  'ص ل ح': 'being sound, fitting → righteousness, reform',
  'ص ب ر': 'binding, holding fast → patience, endurance',
  'ش ك ر': 'gratitude, thankfulness',
  'ت و ب': 'turning back → repentance (and God’s turning toward the penitent)',
  'ش ر ك': 'sharing, partnering → idolatry (giving God partners)',
  'ك ب ر': 'bigness → greatness, arrogance, takbīr',
  'خ س ر': 'losing → loss, ruin',
  'ف و ز': 'escaping to safety → triumph, success',
  'ر س ل': 'sending → messenger, message',
  'ن ب أ': 'news, tidings → prophet (bearer of news)',
  'أ خ ذ': 'taking, seizing',
  'ج ع ل': 'making, placing, appointing',
  'ر أ ي': 'seeing, viewing → opinion, vision',
  'س ج د': 'prostrating → mosque (place of prostration)',
  'ق و م': 'standing, rising → people (those who stand together), resurrection, steadfastness',
  'ح س ب': 'counting → reckoning, account',
  'ح س ن': 'beauty, goodness → good deeds, excellence (iḥsān)',
  'س و أ': 'ugliness, badness → evil deeds',
  'و ح ي': 'quick subtle communication → revelation',
  'ت ل و': 'following → recitation (words following words)',
  'ع ر ف': 'knowing, recognizing → what is known and right (maʿrūf)',
  'ن ظ ر': 'looking, considering',
  'خ و ف': 'fear',
  'خ ش ي': 'reverent awe',
  'ر ز ق': 'providing → sustenance, provision',
  'ف ض ل': 'surplus → bounty, grace, preference',
  'أ ج ر': 'wage → reward',
  'س ب ل': 'stretching out → way, path',
  'ح ق ق': 'being real, due → truth, right',
  'خ ي ر': 'choiceness → good, better',
  'ش ر ر': 'sparking → evil, mischief',
  'ع ذ ب': 'sweetness / torment (opposite meanings from one root!)',
  'ي و م': 'day',
  'أ ر ض': 'earth, land',
  'س م و': 'height, loftiness → sky, heaven, name (that which elevates)',
  'ن ف س': 'breath → soul, self',
  'ق ل ب': 'turning over → heart (the ever-turning organ)',
  'و ج ه': 'facing → face, direction',
  'أ ه ل': 'belonging → family, people of',
  'ف ع ل': 'doing (the grammarians’ template root)',
};

export interface RootGroup {
  root: string;
  meaning?: string;
  words: VocabWord[];
  totalFreq: number;
}

export function buildRootGroups(): RootGroup[] {
  const byRoot = new Map<string, VocabWord[]>();
  for (const w of VOCAB) {
    if (!w.root) continue;
    const list = byRoot.get(w.root) ?? [];
    list.push(w);
    byRoot.set(w.root, list);
  }
  const groups: RootGroup[] = [];
  for (const [root, words] of byRoot) {
    groups.push({
      root,
      meaning: ROOT_MEANINGS[root],
      words: words.sort((a, b) => b.freq - a.freq),
      totalFreq: words.reduce((n, w) => n + w.freq, 0),
    });
  }
  return groups.sort((a, b) => b.totalFreq - a.totalFreq);
}
