import type { Unit } from './types';

// Lesson body markup:
//   **bold**            → bold
//   {{term:slug}}       → glossary term with tap-to-define popover
//   {{term:slug|Text}}  → same, with custom display text
//   {{ar:كتاب}}          → inline Arabic (large, right-to-left)
//   "- " at line start  → bullet list item
export const CURRICULUM: Unit[] = [
  {
    id: 'intro',
    title: 'Start Here',
    tagline: 'How this platform works and where you are headed',
    lessons: [
      {
        id: 'intro-1',
        title: 'Welcome: your path to the Quran',
        subtitle: 'What you will learn, and how the app teaches',
        sections: [
          { type: 'text', body:
`You are learning Arabic to read and understand the {{term:quran|Quran}} — the holy book of Islam, written in classical Arabic about 1,400 years ago. That goal shapes everything here: we learn the exact alphabet, words, and grammar the Quran uses, in order of usefulness.

Here is the encouraging math: the Quran contains about 77,000 words, but they are built from a surprisingly small set of building blocks. Roughly **300 words make up around 70% of the entire text**. Learn the alphabet, those high-frequency words, and a handful of grammar patterns, and whole verses start unlocking.

A note on terms: a chapter of the Quran is called a {{term:surah|surah}} (there are 114), and a verse is called an {{term:ayah|ayah}} (literally "a sign"). The Arabic you learn here is Classical Arabic — the ancestor of {{term:msa|MSA (Modern Standard Arabic)}}, so almost everything transfers if you later want modern Arabic too.`,
          },
          { type: 'text', body:
`**How the app teaches** — every feature here exists because research on language learning says it works:

- **Lessons** explain one idea at a time, in plain language, with the history behind it.
- **Flashcards** use an {{term:srs|SRS (Spaced Repetition System)}}: the app schedules each card for review right before you would forget it. Ten minutes a day beats a three-hour cram — this is the single best-proven technique in memory research.
- **Practice quizzes** force you to actively recall answers. Testing yourself strengthens memory far more than re-reading (psychologists call this the "testing effect").
- **The Reader** lets you read real Quran text early, with tap-for-meaning on every word — real input you can mostly understand is how vocabulary sticks.
- **Audio** everywhere, via {{term:tts|TTS (Text-To-Speech)}} and real recitations fetched from the Quran Foundation {{term:api|API}} — hearing and seeing together beats either alone.
- **Streaks and the heatmap** (Stats page) make your daily habit visible. Consistency, not intensity, is what gets you there.`,
          },
          { type: 'history', title: 'A 23-year revelation', body:
`Muslims believe the Quran was revealed to the Prophet Muhammad gradually between 610 and 632 CE, in the dialect of the Quraysh tribe of Mecca. It was memorized and recited aloud from the start — which is why Arabic's writing system, sounds, and even grammar were later documented so carefully: scholars wanted to preserve exactly how the Quran sounded. When you learn Arabic script and grammar, you are using tools invented specifically to protect this text.`,
          },
          { type: 'text', body:
`**Your routine**: aim for 10–20 minutes a day. Do your due flashcards first (the Dashboard shows the count), then continue the next lesson, then poke around the Reader for fun. That's it — the app handles the scheduling. Complete this lesson to begin.`,
          },
        ],
        exercises: [
          { prompt: 'Roughly how many distinct words cover ~70% of the Quran?', choices: ['About 300', 'About 5,000', 'About 20,000', 'About 77,000'], answer: 0, explain: 'Around 300 high-frequency words cover roughly 70% of the Quran’s running text — that is why we learn by frequency.' },
          { prompt: 'What does SRS (Spaced Repetition System) do?', choices: ['Schedules reviews just before you forget', 'Translates verses automatically', 'Records your pronunciation', 'Grades your handwriting'], answer: 0, explain: 'An SRS shows hard cards often and easy cards rarely, spacing reviews out over time.' },
          { prompt: 'A chapter of the Quran is called a…', choices: ['surah', 'ayah', 'harf', 'wazn'], answer: 0, explain: 'A surah is a chapter (114 total); an ayah is a single verse.' },
        ],
      },
    ],
  },

  {
    id: 'alphabet',
    title: 'Unit 1 — The Alphabet',
    tagline: '28 letters, learned in look-alike families',
    lessons: [
      {
        id: 'alpha-1',
        title: 'How Arabic writing works + your first letters',
        subtitle: 'alif, bā’, tā’, thā’',
        letterIds: ['alif', 'ba', 'ta', 'tha'],
        sections: [
          { type: 'text', body:
`Four things make Arabic writing different from English — once you know them, nothing else will surprise you:

- **Right to left.** Lines read from the right margin toward the left. Books open from what feels like "the back".
- **Letters connect.** Most letters join to their neighbors like cursive, so each letter has up to four looks: standing alone, at the start of a word, in the middle, and at the end. The skeleton stays the same — only the tails and connectors change.
- **It's an {{term:abjad|abjad}}**: the letters spell out consonants and long vowels; short vowels are small marks added above and below (Unit 2). The Quran is always printed with every mark, which makes it one of the friendliest Arabic texts for beginners.
- **No capital letters.** None. One less thing to learn.

We'll learn all 28 letters in seven small groups, sorted by **shape family** — many letters share a skeleton and differ only by dots, so learning them together is far easier.`,
          },
          { type: 'letters', letterIds: ['alif', 'ba', 'ta', 'tha'] },
          { type: 'text', body:
`Meet the first family. {{ar:ا}} (**alif**) is a simple vertical stroke — the long "aa" sound. The other three share one boat-shaped skeleton and differ only by dots: {{ar:ب}} (**bā’**, "b") has one dot **below**, {{ar:ت}} (**tā’**, "t") has two dots **above**, and {{ar:ث}} (**thā’**, "th" as in *think*) has three dots above.

Tap the speaker on each letter to hear it. Notice in the table how the boat shape shrinks to a little bump when the letter connects mid-word — the dots are what keep it recognizable.`,
          },
          { type: 'history', title: 'Where the alphabet came from', body:
`Arabic script descends from the Nabataean form of Aramaic — the Nabataeans were the traders who carved the city of Petra in modern Jordan. By around 400–500 CE their cursive handwriting had evolved into recognizably Arabic writing. Early on it had a problem: many letters shared identical skeletons with **no dots** ({{term:rasm|rasm}} means this bare skeleton). Readers were expected to know the text already! As Islam spread to non-Arabs, dots ({{term:ijam|iʿjām}}) were standardized around 700 CE — largely to keep Quran recitation exact. Those dots are why bā’, tā’, and thā’ look like triplets: they literally were the same written letter once.`,
          },
        ],
        exercises: [
          { prompt: 'Arabic is read…', choices: ['right to left', 'left to right', 'top to bottom', 'bottom to top'], answer: 0 },
          { prompt: 'Which letter has ONE dot BELOW its skeleton?', promptAr: 'ب', choices: ['bā’ (b)', 'tā’ (t)', 'thā’ (th)', 'alif (ā)'], answer: 0, explain: 'One dot below = bā’. Two above = tā’. Three above = thā’.' },
        ],
      },
      {
        id: 'alpha-2',
        title: 'The hook family',
        subtitle: 'jīm, ḥā’, khā’',
        letterIds: ['jim', 'hha', 'kha'],
        sections: [
          { type: 'letters', letterIds: ['jim', 'hha', 'kha'] },
          { type: 'text', body:
`One hook-shaped skeleton, three letters. {{ar:ج}} (**jīm**, "j") has a dot inside the hook. {{ar:ح}} (**ḥā’**) has no dot — it is a deep, breathy "h" made in the middle of your throat, like quietly fogging up a mirror. {{ar:خ}} (**khā’**, "kh") has a dot on top — the raspy sound in Scottish *loch*.

ḥā’ and khā’ don't exist in English, and that's fine. Play the audio, exaggerate, and let the flashcards do their work — your ear tunes in within days. A famous word with ḥā’: {{ar:الْحَمْدُ}} (*al-ḥamdu*, "the praise") — you'll read it in Al-Fatiha soon.`,
          },
          { type: 'history', body:
`Arabic has more throat sounds than almost any major language — ḥā’, khā’, and later ʿayn and ghayn. Linguists believe these sounds go back to the oldest layer of the Semitic language family, which Arabic preserved better than its cousins. Hebrew and Aramaic once had them too but merged several away; Arabic kept them all, which is one reason recitation of the Quran sounds so distinctive.`,
          },
        ],
      },
      {
        id: 'alpha-3',
        title: 'The non-connectors',
        subtitle: 'dāl, dhāl, rā’, zāy',
        letterIds: ['dal', 'dhal', 'ra', 'zay'],
        sections: [
          { type: 'letters', letterIds: ['dal', 'dhal', 'ra', 'zay'] },
          { type: 'text', body:
`Two mini-families, and a new rule. {{ar:د}} (**dāl**, "d") and {{ar:ذ}} (**dhāl**, "th" as in *this*) are little corners. {{ar:ر}} (**rā’**, rolled "r") and {{ar:ز}} (**zāy**, "z") are little curves that dip below the line. In each pair, the dot is the only difference.

The rule: these four (plus alif and wāw, later) are **non-connectors** — they never join to the letter *after* them. The word simply has a tiny gap and continues. So in {{ar:دِين}} (*dīn*, "religion"), the dāl stands aloof and the rest carries on. When you see a mid-word gap, a non-connector caused it.`,
          },
          { type: 'history', body:
`Why do some letters refuse to connect? Pure history: in Nabataean handwriting these particular letters happened to end with a stroke direction that never developed a joining tail. The gaps are fossils of scribal habits from 1,500 years ago — no logic to memorize, just six letters to know (you now have four of them).`,
          },
        ],
      },
      {
        id: 'alpha-4',
        title: 'Teeth and loops',
        subtitle: 'sīn, shīn, ṣād, ḍād',
        letterIds: ['sin', 'shin', 'sad', 'dad'],
        sections: [
          { type: 'letters', letterIds: ['sin', 'shin', 'sad', 'dad'] },
          { type: 'text', body:
`{{ar:س}} (**sīn**, "s") and {{ar:ش}} (**shīn**, "sh") are the "teeth" letters — three little spikes, with shīn wearing three dots. {{ar:ص}} (**ṣād**) and {{ar:ض}} (**ḍād**) are loop-shaped.

ṣād and ḍād introduce Arabic's **emphatic** consonants: say "s" or "d" while making the back of your mouth big and hollow, like you're about to yawn. The whole syllable comes out darker and deeper — compare *sīn* in {{ar:سَلَام}} (*salām*, "peace") with ṣād in {{ar:صِرَاط}} (*ṣirāṭ*, "path"). Emphatics change meaning, so your ear needs them — audio, always.`,
          },
          { type: 'history', body:
`Classical grammarians called Arabic {{ar:لغة الضاد}} — "the language of the ḍād" — because they believed no other language on Earth had that sound. The 8th-century scholar Sibawayh, who wrote the first great grammar of Arabic (to codify correct Quran reading), described exactly how the tongue presses against the side teeth to make it. Getting ḍād right is a badge of honor for reciters.`,
          },
        ],
      },
      {
        id: 'alpha-5',
        title: 'Flags and the deep throat',
        subtitle: 'ṭā’, ẓā’, ʿayn, ghayn',
        letterIds: ['taa', 'zaa', 'ayn', 'ghayn'],
        sections: [
          { type: 'letters', letterIds: ['taa', 'zaa', 'ayn', 'ghayn'] },
          { type: 'text', body:
`{{ar:ط}} (**ṭā’**) and {{ar:ظ}} (**ẓā’**) complete the emphatic set — heavy versions of "t" and of "th"-as-in-*this*. Flag-shaped, dot marks the ẓā’.

Then the most famous sound in Arabic: {{ar:ع}} (**ʿayn**). It's a voiced squeeze at the very bottom of the throat — no English equivalent at all. Trick: say "ah" and gently press your fingers on your throat while tightening it. In transliteration we write it as the small symbol ʿ — as in {{ar:عِلْم}} (*ʿilm*, "knowledge"). Its dotted twin {{ar:غ}} (**ghayn**, "gh") is a gargled "g", like the French "r".

Don't chase perfection now. Reciters spend years polishing ʿayn; recognition is your goal this week.`,
          },
          { type: 'history', body:
`ʿayn means "eye" — the letter's original Phoenician ancestor was literally a drawing of an eye. The same ancestor became the letter "O" in the Greek and Latin alphabets. So English "O" and Arabic ʿayn are distant cousins: one kept the shape and lost the throat sound, the other kept the sound and redrew the shape.`,
          },
        ],
      },
      {
        id: 'alpha-6',
        title: 'The everyday four',
        subtitle: 'fā’, qāf, kāf, lām',
        letterIds: ['fa', 'qaf', 'kaf', 'lam'],
        sections: [
          { type: 'letters', letterIds: ['fa', 'qaf', 'kaf', 'lam'] },
          { type: 'text', body:
`{{ar:ف}} (**fā’**, "f") and {{ar:ق}} (**qāf**) share a small-ring skeleton: one dot for fā’, two for qāf. qāf is a deep "k" pronounced at the very back of the throat — you hear it in {{ar:قُرْآن}} (*qurʾān*) itself.

{{ar:ك}} (**kāf**, ordinary "k") and {{ar:ل}} (**lām**, "l") are tall letters. lām is everywhere: it starts the word {{ar:لَا}} (*lā*, "no") and appears twice in {{ar:اللّٰه}} (*Allāh*). When lām meets alif, they cross into a special ligature: {{ar:لا}} — you'll see it constantly.`,
          },
          { type: 'history', body:
`Qāf vs kāf matters enormously in the Quran: {{ar:قَلْب}} (*qalb*) with qāf means "heart", while {{ar:كَلْب}} (*kalb*) with kāf means "dog". Early Muslim teachers used pairs like this to train converts' ears. It is also why the dotting reform of the 700s was treated as urgent religious work, not a stylistic choice.`,
          },
        ],
      },
      {
        id: 'alpha-7',
        title: 'The final five',
        subtitle: 'mīm, nūn, hā’, wāw, yā’ — alphabet complete!',
        letterIds: ['mim', 'nun', 'ha', 'waw', 'ya'],
        sections: [
          { type: 'letters', letterIds: ['mim', 'nun', 'ha', 'waw', 'ya'] },
          { type: 'text', body:
`The last five, all common: {{ar:م}} (**mīm**, "m") is a small circle with a tail. {{ar:ن}} (**nūn**, "n") looks like bā’s family but rounder, one dot above. {{ar:ه}} (**hā’**, a light "h") is a shape-shifter — its four forms look quite different, so give its table extra attention. {{ar:و}} (**wāw**, "w") is a non-connector — the sixth and last one. {{ar:ي}} (**yā’**, "y") ends words with a graceful swoop, two dots below.

wāw and yā’ moonlight as **long vowels** — "oo" and "ee" — which is the door into Unit 2. **That's all 28 letters.** From here on, everything you read is genuinely Arabic.`,
          },
          { type: 'history', body:
`The traditional letter order you'd find in an Arabic dictionary (alif, bā’, tā’, thā’…) groups look-alike letters — it was reorganized around 786 CE by al-Khalīl ibn Aḥmad, the same scholar who systematized Arabic dictionaries and poetic meter. The older order (abjad: a-b-j-d…) survives in numerology and matches the Hebrew and Greek alphabets — evidence of their shared ancestor.`,
          },
        ],
      },
    ],
  },

  {
    id: 'mechanics',
    title: 'Unit 2 — Reading Mechanics',
    tagline: 'The vowel marks that make every word readable',
    lessons: [
      {
        id: 'mech-1',
        title: 'The three short vowels',
        subtitle: 'fatha, kasra, damma',
        sections: [
          { type: 'text', body:
`Arabic writes its three short vowels as small marks called {{term:harakat|harakat}} ("movements") attached to the consonant they follow:

- {{term:fatha|fatha}} — a small slash **above**: {{ar:بَ}} = *ba* (as in "cat")
- {{term:kasra|kasra}} — a small slash **below**: {{ar:بِ}} = *bi* (as in "sit")
- {{term:damma|damma}} — a tiny curl **above**: {{ar:بُ}} = *bu* (as in "put")

That's the entire short-vowel system: three sounds. (English has more than a dozen vowel sounds — Arabic is refreshingly tidy.) Read each unit as consonant-plus-vowel: {{ar:كَتَبَ}} is *ka-ta-ba*, "he wrote".`,
          },
          { type: 'examples', title: 'Sound it out', items: [
            { ar: 'بَ بِ بُ', translit: 'ba · bi · bu', en: 'the same letter with each vowel' },
            { ar: 'كَتَبَ', translit: 'kataba', en: 'he wrote' },
            { ar: 'خَلَقَ', translit: 'khalaqa', en: 'he created' },
            { ar: 'عَمِلَ', translit: 'ʿamila', en: 'he did' },
          ] },
          { type: 'history', title: 'Dots of colored ink', body:
`For decades the Quran was written with no vowel marks at all. As Islam spread beyond native speakers, mistakes crept into recitation — tradition says a public misreading that changed a verse's meaning alarmed the governor of Basra, who commissioned Abū al-Aswad al-Duʾalī (d. 688 CE) to fix it. His system: **red ink dots** — above a letter for "a", below for "i", in front for "u". A century later, al-Khalīl ibn Aḥmad replaced the dots with the small letter-shaped marks used today (the fatha is a tiny alif lying down; the damma a tiny wāw). Every harakah you read is his design, essentially unchanged for 1,200 years.`,
          },
        ],
        exercises: [
          { prompt: 'What sound is this?', promptAr: 'بِ', choices: ['bi', 'ba', 'bu', 'b (no vowel)'], answer: 0, explain: 'The slash below the letter is a kasra = short “i”.' },
          { prompt: 'What sound is this?', promptAr: 'تُ', choices: ['tu', 'ti', 'ta', 'th'], answer: 0, explain: 'The curl above is a damma = short “u”.' },
          { prompt: 'Read this word:', promptAr: 'كَتَبَ', choices: ['kataba', 'kutiba', 'kitab', 'katib'], answer: 0, explain: 'kāf-fatha, tā’-fatha, bā’-fatha: ka-ta-ba.' },
          { prompt: 'The fatha mark gives which vowel sound?', choices: ['a', 'i', 'u', 'silence'], answer: 0 },
        ],
      },
      {
        id: 'mech-2',
        title: 'Stillness and doubling',
        subtitle: 'sukun and shadda',
        sections: [
          { type: 'text', body:
`Two more marks and you can read most words:

- {{term:sukun|sukun}} — a small circle: {{ar:بْ}}. It means "**no vowel** here"; the letter closes the syllable. {{ar:مِنْ}} = *min* ("from"), one crisp syllable.
- {{term:shadda|shadda}} — a mark like a tiny "w": {{ar:بّ}}. The letter is **doubled** — held twice as long. {{ar:رَبّ}} (*rabb*, "lord") truly ends "-bb". Hold the sound: rab-b.

Shadda changes meaning, not just style: doubling the middle letter of a verb often makes it intensive — {{ar:كَذَبَ}} *kadhaba* "he lied" vs {{ar:كَذَّبَ}} *kadhdhaba* "he kept denying" (a Quran regular). Your ear will catch held consonants quickly — Italians hold "nn" in *anno* the same way.`,
          },
          { type: 'examples', title: 'Hear the difference', items: [
            { ar: 'مِنْ', translit: 'min', en: 'from — sukun closes the syllable' },
            { ar: 'رَبِّ', translit: 'rabbi', en: 'my Lord — shadda doubles the b' },
            { ar: 'ثُمَّ', translit: 'thumma', en: 'then — hold the m' },
            { ar: 'إِنَّ', translit: 'inna', en: 'indeed — hold the n' },
          ] },
          { type: 'history', body:
`The shadda symbol is literally a miniature {{ar:ش}} missing its dots — the first letter of *shadda* ("strengthening") itself. The sukun circle is thought to be a tiny {{ar:ه}} or a zero — "nothing here". Arabic's vowel marks are one of history's cleverest bits of user-interface design: a complete pronunciation guide that can be layered onto a text without changing a single letter of the original — vital when the original is sacred.`,
          },
        ],
        exercises: [
          { prompt: 'What does a sukun (small circle) mean?', choices: ['No vowel follows the letter', 'Double the letter', 'Long “aa” sound', 'Stress this syllable'], answer: 0 },
          { prompt: 'Read this word:', promptAr: 'رَبّ', choices: ['rabb (held b)', 'rab', 'raab', 'riba'], answer: 0, explain: 'The shadda doubles the bā’: rabb.' },
          { prompt: 'Read this word:', promptAr: 'مِنْ', choices: ['min', 'mina', 'mīn', 'man'], answer: 0, explain: 'kasra then sukun: mi-n, one syllable.' },
        ],
      },
      {
        id: 'mech-3',
        title: 'Long vowels',
        subtitle: 'ā, ū, ī — stretching the sound',
        sections: [
          { type: 'text', body:
`Each short vowel has a long partner, held about twice as long — called {{term:madd|madd}} ("stretching"). The trick: Arabic reuses three letters you already know as vowel-stretchers:

- fatha + {{ar:ا}} (alif) = **ā** — {{ar:كِتَاب}} *kitāb* ("book")
- damma + {{ar:و}} (wāw) = **ū** — {{ar:نُور}} *nūr* ("light")
- kasra + {{ar:ي}} (yā’) = **ī** — {{ar:دِين}} *dīn* ("religion")

Length changes meaning, so it matters: same skeleton pattern, different words. When wāw or yā’ carries its own vowel mark it's a consonant (w/y); when it silently follows a matching short vowel, it's stretching. You'll internalize this from examples faster than from rules.`,
          },
          { type: 'examples', title: 'Short vs long', items: [
            { ar: 'كَتَبَ', translit: 'kataba', en: 'he wrote — all short' },
            { ar: 'كِتَاب', translit: 'kitāb', en: 'book — stretched “aa”' },
            { ar: 'قُلْ', translit: 'qul', en: 'say! — short u' },
            { ar: 'يَقُول', translit: 'yaqūl', en: 'he says — long ū' },
          ] },
          { type: 'history', body:
`In Quran recitation ({{term:tajwid|tajwīd}}), stretching is precisely regulated: an ordinary madd lasts two beats, but certain positions stretch to four or even six beats — those wavy {{ar:ٓ}} marks you may see in a printed Quran are stretch signals. Reciters count beats the way musicians count notes; the melody of recitation you hear in a mosque is built on exactly the letters you just learned.`,
          },
        ],
        exercises: [
          { prompt: 'Read this word:', promptAr: 'كِتَاب', choices: ['kitāb', 'kataba', 'kutub', 'kātib'], answer: 0, explain: 'ki (kasra) + tā stretched by alif + b: kitāb.' },
          { prompt: 'Which letter stretches a damma into “ū”?', choices: ['wāw (و)', 'alif (ا)', 'yā’ (ي)', 'hā’ (ه)'], answer: 0, explain: 'damma+wāw = ū, fatha+alif = ā, kasra+yā’ = ī.' },
          { prompt: 'Read this word:', promptAr: 'نُور', choices: ['nūr', 'nur', 'nawr', 'nīr'], answer: 0 },
        ],
      },
      {
        id: 'mech-4',
        title: 'Tanwin: the “n” of indefiniteness',
        subtitle: '-an, -in, -un word endings',
        sections: [
          { type: 'text', body:
`Sometimes a word ends with a **doubled** vowel mark: {{ar:ـً}} {{ar:ـٍ}} {{ar:ـٌ}}. This is {{term:tanwin|tanwin}}, and it's pronounced as the vowel **plus an “n” sound**: *-an*, *-in*, *-un* — even though no nūn letter is written.

Tanwin roughly means "a/an": {{ar:كِتَابٌ}} *kitābun* = "a book", while {{ar:الْكِتَابُ}} *al-kitābu* = "the book". A word never carries both tanwin and "the" — they are opposites.

Which of the three you use depends on the word's job in the sentence (subject, object, after a preposition) — that's the case system we meet properly in Unit 6. For now: **see doubled mark → say the vowel + n**.`,
          },
          { type: 'examples', title: 'Tanwin in real verses', items: [
            { ar: 'غَفُورٌ رَحِيمٌ', translit: 'ghafūrun raḥīm(un)', en: 'Most Forgiving, Most Merciful (Quran 2:173)' },
            { ar: 'عَلِيمٌ حَكِيمٌ', translit: 'ʿalīmun ḥakīm(un)', en: 'All-Knowing, All-Wise' },
            { ar: 'هُدًى لِّلْمُتَّقِينَ', translit: 'hudan li-l-muttaqīn', en: 'guidance for the mindful (Quran 2:2)' },
          ] },
          { type: 'history', body:
`At a pause — the end of a verse, or wherever a reciter stops for breath — tanwin usually falls silent: *raḥīmun* is read *raḥīm*. This pause rule (waqf) is why word endings in beautiful recitation sound softer than the written marks suggest. Grammarians documented these pause rules in loving detail because verse-final rhythm is part of the Quran's famous eloquence.`,
          },
        ],
        exercises: [
          { prompt: 'How is this word pronounced?', promptAr: 'كِتَابٌ', choices: ['kitābun', 'kitāb', 'kitāban', 'kitābin'], answer: 0, explain: 'Double damma = -un: kitābun, “a book”.' },
          { prompt: 'Tanwin adds which hidden sound?', choices: ['n', 'm', 'h', 'a glottal stop'], answer: 0 },
          { prompt: 'Can a word have BOTH al- (“the”) and tanwin?', choices: ['No — they are opposites', 'Yes, always', 'Only in poetry', 'Only on verbs'], answer: 0, explain: 'Tanwin marks indefinite (“a book”); al- marks definite (“the book”). Never both.' },
        ],
      },
      {
        id: 'mech-5',
        title: 'The special characters',
        subtitle: 'hamza, tā’ marbūṭa, alif maqṣūra',
        sections: [
          { type: 'text', body:
`Three characters that aren't in the alphabet of 28 but appear everywhere:

- {{term:hamza|hamza}} ({{ar:ء}}) — the **glottal stop**: the catch between the syllables of "uh-oh". English has the sound; Arabic writes it. It often sits ("is seated") on a carrier letter: {{ar:أ}} {{ar:إ}} {{ar:ؤ}} {{ar:ئ}}. {{ar:قُرْآن}} *qurʾān* has one mid-word.
- {{term:ta-marbuta|tā’ marbūṭa}} ({{ar:ة}}) — the "tied-up tā’", only at word ends, usually marking **feminine** nouns: {{ar:جَنَّة}} *jannah* ("garden"). Pronounced "-ah" at a pause but "-at" when the sentence flows on: *jannatu ʿadn*.
- {{term:alif-maqsura|alif maqṣūra}} ({{ar:ى}}) — a dotless yā’ at word ends, pronounced **ā**: {{ar:هُدَى}} *hudā* ("guidance").

**You can now read anything in a fully vowelled Quran** — slowly, but truly. Everything after this unit is about understanding what you read.`,
          },
          { type: 'examples', title: 'Spot the special characters', items: [
            { ar: 'قُرْآن', translit: 'qurʾān', en: 'Quran — hamza on a stretched alif (آ)' },
            { ar: 'رَحْمَة', translit: 'raḥmah', en: 'mercy — tā’ marbūṭa ending' },
            { ar: 'مُوسَىٰ', translit: 'mūsā', en: 'Moses — alif maqṣūra ending' },
            { ar: 'السَّمَاءِ', translit: 'as-samāʾ(i)', en: 'the sky — hamza standing alone at the end' },
          ] },
          { type: 'history', body:
`Hamza is the newest letter in Arabic. The Quraysh dialect of Mecca had largely dropped the glottal stop, but eastern tribes — whose poetry set the literary gold standard — pronounced it clearly, so the Quran's official text needed a way to write a sound the script had no letter for. Grammarians borrowed the head of the letter ʿayn as a mini-symbol and "seated" it on existing letters. That compromise, made in the 8th century, is exactly what you see on the page today.`,
          },
        ],
        exercises: [
          { prompt: 'The sound of hamza (ء) is like…', choices: ['the catch in “uh-oh”', 'h in “house”', 'a rolled r', 'silence'], answer: 0 },
          { prompt: 'A word ending in ة (tā’ marbūṭa) is usually…', choices: ['feminine', 'masculine', 'a verb', 'plural'], answer: 0 },
          { prompt: 'How is ى (alif maqṣūra) pronounced?', choices: ['ā', 'ī', 'y', 'un'], answer: 0, explain: 'It looks like yā’ without dots but sounds like long ā: hudā, mūsā.' },
        ],
      },
    ],
  },

  {
    id: 'words',
    title: 'Unit 3 — First Quranic Words',
    tagline: 'The most frequent words + the article "the"',
    lessons: [
      {
        id: 'words-1',
        title: '“The”: al- and the sun & moon letters',
        subtitle: 'Arabic’s only article',
        wordIds: ['shams', 'qamar', 'kitab', 'nas', 'salam', 'bayt'],
        sections: [
          { type: 'text', body:
`Arabic has exactly one article: {{term:al|al- (الـ)}}, meaning "the", glued to the front of its noun: {{ar:كِتَاب}} *kitāb* "a book" → {{ar:الْكِتَاب}} *al-kitāb* "the book". There is no word for "a/an" — that's what tanwin implied.

One pronunciation rule: with 14 letters — the {{term:sun-letters|sun letters}}, all made with the tip of the tongue (t, th, d, dh, r, z, s, sh, ṣ, ḍ, ṭ, ẓ, l, n) — the "l" of al- assimilates into the next letter, which doubles: {{ar:الشَّمْس}} is *ash-shams* ("the sun"), not "al-shams". With the other 14 — the {{term:moon-letters|moon letters}} — the "l" is pronounced normally: {{ar:الْقَمَر}} *al-qamar* ("the moon"). **The writing never changes** — only the sound. The shadda on the following letter is your printed hint.`,
          },
          { type: 'examples', title: 'Sun vs moon', items: [
            { ar: 'الشَّمْس', translit: 'ash-shams', en: 'the sun — l assimilates (sun letter)' },
            { ar: 'الْقَمَر', translit: 'al-qamar', en: 'the moon — l pronounced (moon letter)' },
            { ar: 'النَّاس', translit: 'an-nās', en: 'the people — sun letter n' },
            { ar: 'الْكِتَاب', translit: 'al-kitāb', en: 'the book — moon letter k' },
          ] },
          { type: 'vocab', wordIds: ['shams', 'qamar', 'kitab', 'nas', 'salam', 'bayt'] },
          { type: 'history', body:
`The very names "sun letters" and "moon letters" come from the two example words grammarians chose a millennium ago: *ash-shams* (where the l melts) and *al-qamar* (where it doesn't). The assimilation isn't laziness — it's ancient Semitic sound flow, frozen into the formal reading rules. Spanish speakers inherited hundreds of Arabic words with the article attached: *algodón* (al-quṭn, cotton), *azúcar* (as-sukkar, sugar — a sun letter, notice the missing l!).`,
          },
        ],
        exercises: [
          { prompt: 'How is الشَّمْس pronounced?', choices: ['ash-shams', 'al-shams', 'a-shams', 'il-shams'], answer: 0, explain: 'shīn is a sun letter: the l assimilates and the sh doubles.' },
          { prompt: 'How is الْقَمَر pronounced?', choices: ['al-qamar', 'aq-qamar', 'a-qamar', 'an-qamar'], answer: 0, explain: 'qāf is a moon letter: the l stays.' },
        ],
      },
      {
        id: 'words-2',
        title: 'The words of Al-Fatiha',
        subtitle: 'Learn the vocabulary of the Quran’s opening',
        wordIds: ['allah', 'rabb', 'rahman', 'rahim', 'hamd', 'malik', 'din', 'yawm', 'alamin', 'sirat'],
        sections: [
          { type: 'text', body:
`Time for real vocabulary — and we start with the words of {{ar:الفاتحة}} (**Al-Fatiha**, "The Opening"), the seven-verse surah that opens the Quran and is recited in every unit of the daily prayer. A practicing Muslim says these words at least seventeen times a day, making them the most-recited sentences on Earth.

Notice how much mileage single words give you: {{ar:رَبّ}} (*rabb*, "Lord") appears ~975 times in the Quran; {{ar:يَوْم}} (*yawm*, "day") ~405 times. Every card you learn here pays rent many times over.`,
          },
          { type: 'vocab', wordIds: ['allah', 'rabb', 'rahman', 'rahim', 'hamd', 'malik', 'din', 'yawm', 'alamin', 'sirat'] },
          { type: 'history', body:
`{{ar:الرَّحْمَٰن}} (*ar-Raḥmān*) and {{ar:الرَّحِيم}} (*ar-Raḥīm*) both come from the root r-ḥ-m, whose base meaning is the **womb** (raḥim) — divine mercy pictured as a mother's tenderness. Classical scholars distinguished them: Raḥmān is boundless mercy toward all creation; Raḥīm is particular, continuing mercy. English translations ("Most Gracious, Most Merciful") flatten a nuance the Arabic keeps — a first taste of why you're learning the original.`,
          },
        ],
      },
      {
        id: 'words-3',
        title: 'Heaven, earth, and the big nouns',
        subtitle: 'Ten more of the Quran’s favorite words',
        wordIds: ['ard', 'sama', 'jannah', 'nar', 'dunya', 'akhirah', 'nur', 'ilm', 'huda', 'rahmah'],
        sections: [
          { type: 'text', body:
`Ten more high-frequency nouns, and they come in natural pairs — the Quran loves contrast: {{ar:السَّمَاء}} *as-samāʾ* (sky/heaven) and {{ar:الْأَرْض}} *al-arḍ* (earth) appear together in hundreds of verses. {{ar:الدُّنْيَا}} *ad-dunyā* (this world — literally "the lower one") is always weighed against {{ar:الْآخِرَة}} *al-ākhirah* (the hereafter — "the last one"). {{ar:الْجَنَّة}} *al-jannah* (the Garden) faces {{ar:النَّار}} *an-nār* (the Fire).

Learning them as pairs is deliberate: your memory hooks each word to its opposite, and you'll recognize the rhetorical rhythm of hundreds of verses at once.`,
          },
          { type: 'vocab', wordIds: ['ard', 'sama', 'jannah', 'nar', 'dunya', 'akhirah', 'nur', 'ilm', 'huda', 'rahmah'] },
          { type: 'history', body:
`{{ar:جَنَّة}} *jannah* comes from the root j-n-n meaning "to cover, hide" — a garden so lush its ground is hidden by greenery. The same root gives *jinn* (hidden beings) and *majnūn* (mad — "possessed by the hidden"). One root, one core image, many words: this is the root system you'll meet head-on in the next unit, and it's the single biggest shortcut in Arabic.`,
          },
        ],
      },
    ],
  },

  {
    id: 'roots',
    title: 'Unit 4 — The Root System',
    tagline: 'The “aha” that unlocks Arabic vocabulary',
    lessons: [
      {
        id: 'roots-1',
        title: 'Three letters carry the meaning',
        subtitle: 'The trilateral root',
        wordIds: ['qurAn-w', 'ayah-w', 'ilah', 'abd', 'mulk', 'malak'],
        sections: [
          { type: 'text', body:
`Here is the idea that makes Arabic vocabulary learnable: almost every word grows from a {{term:root|root}} of (usually) three consonants that carries a core meaning. Vowels and add-on letters are poured around the root to make related words.

Take **k-t-b**, whose core idea is *writing*:
- {{ar:كَتَبَ}} *kataba* — he wrote
- {{ar:كِتَاب}} *kitāb* — book
- {{ar:كَاتِب}} *kātib* — writer
- {{ar:مَكْتَب}} *maktab* — desk, office (place of writing)
- {{ar:مَكْتَبَة}} *maktabah* — library

Five words, one root. When you meet an unknown Quranic word, finding its three-letter skeleton usually hands you the neighborhood of its meaning. Arabic dictionaries are even organized by root, not by spelling.`,
          },
          { type: 'vocab', wordIds: ['qurAn-w', 'ayah-w', 'ilah', 'abd', 'mulk', 'malak'] },
          { type: 'history', body:
`The root system is the signature of the whole Semitic language family — Hebrew and Aramaic work the same way (Hebrew *k-t-b* also means writing: *ktav*, script). The 8th-century lexicographer al-Khalīl ibn Aḥmad — the vowel-mark designer you've already met — built the first Arabic dictionary, *Kitāb al-ʿAyn*, around roots, and calculated combinatorially how many possible roots Arabic could have before listing which ones actually exist. A thousand years before modern linguistics, he was doing its math.`,
          },
        ],
        exercises: [
          { prompt: 'The root k-t-b relates to…', choices: ['writing', 'speaking', 'walking', 'light'], answer: 0 },
          { prompt: 'مَكْتَب (maktab, “office/desk”) literally means…', choices: ['place of writing', 'small book', 'one who writes', 'it was written'], answer: 0, explain: 'The ma- pattern often means “place of [root meaning]”.' },
          { prompt: 'Quran (قُرْآن) comes from the root q-r-ʾ meaning…', choices: ['to recite/read', 'to write', 'to hear', 'to travel'], answer: 0, explain: 'Qurʾān literally means “the Recitation”.' },
        ],
      },
      {
        id: 'roots-2',
        title: 'Patterns: the word factory',
        subtitle: 'wazn — pour a root into a mold',
        wordIds: ['mumin', 'kafir', 'muslim', 'salih', 'alim-adj', 'ghafur'],
        sections: [
          { type: 'text', body:
`If roots are ingredients, a {{term:wazn|wazn}} (pattern) is the mold you pour them into. Each pattern adds a predictable flavor of meaning. Grammarians name patterns using the demo root **f-ʿ-l** ("doing") as a placeholder. Three patterns worth knowing now:

- **fāʿil** — "one who does": {{ar:كَافِر}} *kāfir* (one who disbelieves), {{ar:صَالِح}} *ṣāliḥ* (one who is righteous)
- **faʿīl** — intense quality: {{ar:رَحِيم}} *raḥīm* (deeply merciful), {{ar:عَلِيم}} *ʿalīm* (all-knowing)
- **mu-...** — doer of a derived verb: {{ar:مُسْلِم}} *muslim* (one who submits), {{ar:مُؤْمِن}} *muʾmin* (one who believes)

Root × pattern = word. ~1,700 roots and a few dozen patterns generate essentially all of Quranic vocabulary. You don't memorize the system — you meet enough examples and it starts predicting words for you.`,
          },
          { type: 'vocab', wordIds: ['mumin', 'kafir', 'muslim', 'salih', 'alim-adj', 'ghafur'] },
          { type: 'history', body:
`Notice *muslim* and *salām* share the root s-l-m: wholeness, peace, safety. A *muslim* is literally "one who makes salām" — who enters wholeness by submitting to God. Likewise *īmān* (faith) and *amān* (safety) share ʾ-m-n: faith as security of the heart. The Quran constantly plays on shared roots this way; translations can't show it, but from now on you'll see it.`,
          },
        ],
        exercises: [
          { prompt: 'The pattern fāʿil (as in كَاتِب kātib) means…', choices: ['one who does the action', 'place of the action', 'the action itself', 'done twice'], answer: 0 },
          { prompt: 'مُسْلِم (muslim) and سَلَام (salām) share a root meaning…', choices: ['peace/wholeness', 'light', 'book', 'fire'], answer: 0 },
        ],
      },
    ],
  },

  {
    id: 'nouns',
    title: 'Unit 5 — Nouns & Pronouns',
    tagline: 'Gender, pronouns, and “my/your/his”',
    lessons: [
      {
        id: 'nouns-1',
        title: 'Every noun has a gender',
        subtitle: 'masculine, feminine, and the ة ending',
        wordIds: ['rajul', 'umm', 'ab', 'zawj', 'ummah', 'kalimah', 'qaryah', 'hayah'],
        sections: [
          { type: 'text', body:
`Arabic word types are simple: every word is a noun ({{term:ism|ism}}), a verb, or a particle. Nouns include what English calls adjectives — and every one of them has a {{term:mudhakkar|gender}}: masculine or feminine.

The good news: gender is usually visible. Words ending in {{ar:ة}} (tā’ marbūṭa) are almost always feminine: {{ar:رَحْمَة}} *raḥmah* (mercy), {{ar:كَلِمَة}} *kalimah* (word). Words without it are usually masculine: {{ar:كِتَاب}} *kitāb*. A few naturally feminine words break the rule ({{ar:أُمّ}} *umm*, mother; {{ar:شَمْس}} *shams*, sun) — learn those as you meet them.

Why care? **Agreement**: adjectives and verbs match their noun's gender. "A merciful lord" is *rabbun raḥīm*, but "a merciful word" would be *kalimatun raḥīmah* — the adjective grows its own ة. Spotting agreement is how you'll parse long Quranic sentences.`,
          },
          { type: 'vocab', wordIds: ['rajul', 'umm', 'ab', 'zawj', 'ummah', 'kalimah', 'qaryah', 'hayah'] },
          { type: 'history', body:
`Grammatical gender long predates Arabic — it runs through the whole Semitic family and beyond. The ة feminine marker descends from an ancient Semitic *-at* ending, which is why the "hidden t" reappears the moment the sentence keeps flowing: *raḥmah* alone, but *raḥmatu llāh* ("the mercy of God"). The letter's very shape tells the story: a hā’ wearing the two dots of tā’ — two letters fused for a sound that flickers between them.`,
          },
        ],
      },
      {
        id: 'nouns-2',
        title: 'Pronouns, standalone and attached',
        subtitle: 'huwa, anta… and the mighty suffixes',
        wordIds: ['huwa', 'hiya', 'anta', 'ana', 'nahnu', 'hum', 'antum'],
        sections: [
          { type: 'text', body:
`A {{term:damir|pronoun}} (I, you, he…) comes in two forms in Arabic. The standalone words are below in your vocab. But the real workhorses are the **attached suffixes** — tiny endings that mean "my", "your", "his", "our":

- {{ar:ـِي}} *-ī* — my: {{ar:رَبِّي}} *rabbī*, "my Lord"
- {{ar:ـكَ}} *-ka* — your: {{ar:رَبُّكَ}} *rabbuka*, "your Lord"
- {{ar:ـهُ}} *-hu* — his/its: {{ar:رَبُّهُ}} *rabbuhu*, "his Lord"
- {{ar:ـهَا}} *-hā* — her/its: {{ar:رَبُّهَا}}
- {{ar:ـنَا}} *-nā* — our: {{ar:رَبُّنَا}} *rabbunā*, "our Lord"
- {{ar:ـهُمْ}} *-hum* — their: {{ar:رَبُّهُمْ}}
- {{ar:ـكُمْ}} *-kum* — your (plural): {{ar:رَبُّكُمْ}}

The same suffixes attach to verbs as objects ({{ar:نَعْبُدُهُ}} "we worship **him**") and to prepositions ({{ar:لَهُ}} *lahu*, "to him"). Learn these seven endings and thousands of Quranic words become transparent compounds.`,
          },
          { type: 'vocab', wordIds: ['huwa', 'hiya', 'anta', 'ana', 'nahnu', 'hum', 'antum'] },
          { type: 'examples', title: 'Suffixes in famous verses', items: [
            { ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً', translit: 'rabbanā ātinā fī d-dunyā ḥasanah', en: '“Our Lord, give us good in this world” (2:201)' },
            { ar: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ', translit: 'lakum dīnukum wa-liya dīn', en: '“To you your religion, and to me mine” (109:6)' },
          ] },
          { type: 'history', body:
`Arabic actually distinguishes more "you"s than English ever did: masculine/feminine, singular/plural, and even a special form for exactly **two** people (the dual, *-kumā*). The Quran uses the dual with precision — when two people are addressed, the grammar itself says so. We'll flag duals when you meet them in the Reader; for now the seven suffixes above cover the overwhelming majority of verses.`,
          },
        ],
        exercises: [
          { prompt: 'What does رَبُّنَا (rabbunā) mean?', choices: ['our Lord', 'my Lord', 'your Lord', 'their Lord'], answer: 0, explain: '-nā = our. You will hear rabbanā at the start of many Quranic prayers.' },
          { prompt: 'The suffix ـهُ (-hu) means…', choices: ['his / him', 'her', 'my', 'your'], answer: 0 },
        ],
      },
    ],
  },

  {
    id: 'sentences',
    title: 'Unit 6 — Basic Sentences',
    tagline: 'Sentences with no verb, and “X of Y”',
    lessons: [
      {
        id: 'sent-1',
        title: 'The sentence with no verb',
        subtitle: 'jumla ismiyya — “God (is) forgiving”',
        wordIds: ['haqq', 'azim', 'aziz', 'hakim', 'qadir', 'sami', 'basir', 'kabir'],
        sections: [
          { type: 'text', body:
`Arabic's favorite sentence needs **no verb "to be"**. Put a definite noun next to an indefinite description and the "is" is understood — this is the {{term:jumla-ismiyya|jumla ismiyya}} (nominal sentence):

- {{ar:اللَّهُ غَفُورٌ}} *allāhu ghafūrun* — "God (is) Forgiving."
- {{ar:الْكِتَابُ حَقٌّ}} *al-kitābu ḥaqqun* — "The Book (is) truth."

Spot the pattern: **al-X + Y-tanwin** = "the X is Y". The definite one is the topic; the indefinite one is the news about it. Thousands of Quranic statements — especially descriptions of God — use exactly this shape, often doubled at verse ends: *wa-llāhu ʿalīmun ḥakīm* ("and God is All-Knowing, All-Wise").

Those word-end vowels (-u, -un) are {{term:irab|iʿrāb}} — case endings showing each word's job. The subject takes -u/-un. You'll absorb the rest gradually; recognition beats rules.`,
          },
          { type: 'vocab', wordIds: ['haqq', 'azim', 'aziz', 'hakim', 'qadir', 'sami', 'basir', 'kabir'] },
          { type: 'history', body:
`Why does Russian-style "God — forgiving" work in Arabic? Because the Semitic present-tense "to be" was always optional; the sentence's logic lives in definiteness, not a linking verb. Grammarians formalized this in the 8th century in Basra and Kufa — two rival schools whose debates about sentences like these filled volumes. Their terminology (mubtadaʾ "starting point" and khabar "the news") is still used in every Arabic classroom today.`,
          },
        ],
        exercises: [
          { prompt: 'What does اللَّهُ عَلِيمٌ mean?', choices: ['God is All-Knowing', 'God knows him', 'the knowledge of God', 'O Knowing God'], answer: 0, explain: 'Definite noun + indefinite description = “X is Y”, no verb needed.' },
          { prompt: 'A jumla ismiyya (nominal sentence) is missing which English word?', choices: ['“is/are”', '“the”', '“and”', '“not”'], answer: 0 },
        ],
      },
      {
        id: 'sent-2',
        title: 'iḍāfa: “X of Y”',
        subtitle: 'The possession chain that is everywhere',
        wordIds: ['ahl', 'ibn', 'nafs', 'qalb', 'wajh', 'yad', 'amr', 'shay'],
        sections: [
          { type: 'text', body:
`How do you say "the Lord of the worlds"? Arabic just puts the nouns side by side: {{ar:رَبِّ الْعَالَمِينَ}} *rabbi l-ʿālamīn*. This construction is the {{term:idafa|iḍāfa}}, and two rules govern it:

- The **first** noun never takes al- and never takes tanwin — it's automatically definite through its partner.
- The **second** noun usually has al- (or is a name) and ends in -i.

So: {{ar:يَوْمِ الدِّينِ}} *yawmi d-dīn* "the Day of Judgment", {{ar:أَهْلِ الْكِتَابِ}} *ahli l-kitāb* "the People of the Book", {{ar:بَيْتُ اللَّهِ}} *baytu llāh* "the House of God". Chains can extend: "the people of the town of the king…" — each link genitive.

The pronoun suffixes from Unit 5 are mini-iḍāfas: *rabb-ī* is literally "lord-of-me". You now hold the two structures — nominal sentence and iḍāfa — that make up the bulk of Quranic phrasing.`,
          },
          { type: 'vocab', wordIds: ['ahl', 'ibn', 'nafs', 'qalb', 'wajh', 'yad', 'amr', 'shay'] },
          { type: 'history', body:
`iḍāfa means "annexation" — grammarians pictured the first noun leaning on the second. English does something similar in reverse with "of", and older English did it with word order too ("the kingdom of heaven" vs "heaven's kingdom"). Semitic languages have used bare juxtaposition for five thousand years; the phrase *bayt Allāh*, "House of God", would have been word-for-word intelligible to a Babylonian.`,
          },
        ],
        exercises: [
          { prompt: 'What does أَهْلِ الْكِتَابِ (ahli l-kitāb) mean?', choices: ['the People of the Book', 'the book of the people', 'a bookish family', 'the people and the book'], answer: 0, explain: 'First noun + al-second-noun = “X of Y”: people of the Book.' },
          { prompt: 'In an iḍāfa, the FIRST noun…', choices: ['never takes al- or tanwin', 'always takes al-', 'must be a verb', 'is always plural'], answer: 0 },
        ],
      },
    ],
  },

  {
    id: 'verbs',
    title: 'Unit 7 — Verbs',
    tagline: 'Past, present, and the Quran’s favorite verbs',
    lessons: [
      {
        id: 'verbs-1',
        title: 'The past tense',
        subtitle: 'kataba, katabtu, katabū',
        wordIds: ['qala', 'kana', 'khalaqa', 'jaala', 'alima-v', 'amila-v'],
        sections: [
          { type: 'text', body:
`An Arabic verb ({{term:fil|fiʿl}}) in the past tense ({{term:madi|māḍī}}) is beautifully compact: the bare root with "a" vowels means "he did it", and **suffixes** tell you who acted — no separate "I/you/he" needed:

- {{ar:كَتَبَ}} *kataba* — he wrote
- {{ar:كَتَبَتْ}} *katabat* — she wrote
- {{ar:كَتَبْتُ}} *katabtu* — I wrote
- {{ar:كَتَبْتَ}} *katabta* — you wrote
- {{ar:كَتَبْنَا}} *katabnā* — we wrote
- {{ar:كَتَبُوا}} *katabū* — they wrote

Dictionaries list verbs in the "he did" form — so vocab cards say "he said", "he created". The star of this batch: {{ar:قَالَ}} *qāla* ("he said") — the single most frequent verb in the Quran (~1,700 occurrences), introducing nearly every dialogue. And {{ar:كَانَ}} *kāna* ("he was") supplies the past of "to be" that nominal sentences leave out.`,
          },
          { type: 'vocab', wordIds: ['qala', 'kana', 'khalaqa', 'jaala', 'alima-v', 'amila-v'] },
          { type: 'history', body:
`Notice *qāla* and *kāna* have a long ā where you'd expect a middle root letter — their middle letter is actually wāw (q-w-l, k-w-n), which melts into ā in the past tense. Grammarians call these "hollow verbs" and wrote entire treatises on them, because reciting the Quran correctly demands knowing when the wāw hides and when it reappears (*qul!* — "say!" — is the same root with the wāw gone entirely; it opens four different surahs).`,
          },
        ],
        exercises: [
          { prompt: 'كَتَبْنَا (katabnā) means…', choices: ['we wrote', 'I wrote', 'they wrote', 'she wrote'], answer: 0, explain: 'The suffix -nā = we (same -nā as “our” in rabbunā).' },
          { prompt: 'Which is the most frequent verb in the Quran?', choices: ['qāla — he said', 'kataba — he wrote', 'akala — he ate', 'dakhala — he entered'], answer: 0 },
        ],
      },
      {
        id: 'verbs-2',
        title: 'The present tense',
        subtitle: 'yaktubu, naktubu — prefixes take over',
        wordIds: ['amana', 'kafara-v', 'abada-v', 'dhakara-v', 'hada-v', 'arada'],
        sections: [
          { type: 'text', body:
`The present/future tense ({{term:mudari|muḍāriʿ}}) flips the mechanism: **prefixes** mark the doer:

- {{ar:يَكْتُبُ}} *ya-ktubu* — he writes
- {{ar:تَكْتُبُ}} *ta-ktubu* — she writes / you write
- {{ar:أَكْتُبُ}} *a-ktubu* — I write
- {{ar:نَكْتُبُ}} *na-ktubu* — we write

Remember **ya- / ta- / a- / na-** and you can identify the actor of nearly any present-tense verb. In Al-Fatiha you already know one: {{ar:نَعْبُدُ}} *naʿbudu* — "**we** worship" (root ʿ-b-d). Context supplies future meaning ("he will write") — Arabic doesn't need a separate tense for it, though the particles sa- or sawfa can make future explicit.`,
          },
          { type: 'vocab', wordIds: ['amana', 'kafara-v', 'abada-v', 'dhakara-v', 'hada-v', 'arada'] },
          { type: 'examples', title: 'Spot the prefix', items: [
            { ar: 'إِيَّاكَ نَعْبُدُ', translit: 'iyyāka naʿbudu', en: 'You alone WE worship (1:5) — na- prefix' },
            { ar: 'يَعْلَمُ مَا فِي السَّمَاوَاتِ', translit: 'yaʿlamu mā fī s-samāwāt', en: 'HE knows what is in the heavens — ya- prefix' },
          ] },
          { type: 'history', body:
`Why does one tense use suffixes and the other prefixes? The two conjugations are older than Arabic itself — proto-Semitic had both, and every daughter language kept them. The prefix set (ya-, ta-, na-) is so ancient it appears nearly unchanged in 3,000-year-old Akkadian tablets from Mesopotamia. When you say *naktubu*, you're using a piece of grammar older than the alphabet you're writing it in.`,
          },
        ],
        exercises: [
          { prompt: 'يَعْلَمُ (yaʿlamu) means…', choices: ['he knows', 'I know', 'we know', 'they knew'], answer: 0, explain: 'ya- prefix = he; root ʿ-l-m = knowing.' },
          { prompt: 'Which prefix means “we” in the present tense?', choices: ['na-', 'ya-', 'ta-', 'a-'], answer: 0 },
        ],
      },
      {
        id: 'verbs-3',
        title: 'The Quran’s working verbs',
        subtitle: 'Eight verbs you will meet on every page',
        wordIds: ['anzala', 'ata-give', 'raa', 'shaa', 'ittaqa', 'ghafara-v', 'daa-v', 'samia-v'],
        sections: [
          { type: 'text', body:
`This batch of verbs powers an enormous share of Quranic narrative. Two spotlights:

{{ar:أَنزَلَ}} *anzala* — "he **sent down**" — is THE revelation verb: the Quran describes itself as sent down ({{ar:أَنزَلْنَا}} *anzalnā*, "We sent down"). Note the pattern: the base root n-z-l means "to come down"; the added initial hamza makes it causative — "to make come down". One letter, new meaning: the pattern system at work on verbs.

{{ar:اتَّقَىٰ}} *ittaqā* — "he was mindful, guarded himself (against God's displeasure)" — gives the famous noun *taqwā* (God-consciousness) and the phrase {{ar:يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ}} — "O you who believe, be mindful of God" — which structures dozens of passages.`,
          },
          { type: 'vocab', wordIds: ['anzala', 'ata-give', 'raa', 'shaa', 'ittaqa', 'ghafara-v', 'daa-v', 'samia-v'] },
          { type: 'history', body:
`Arabic verbs come in ten common derived "forms", each a pattern applied to the root: form II doubles the middle letter (intensive), form IV adds a- (causative, like anzala), form VIII inserts -t- (reflexive, like ittaqā from w-q-y). Western textbooks number them I–X; classical grammar names them by template. You don't need the table yet — but every "irregular-looking" verb you meet is actually one of these ten molds, perfectly regular in its own way.`,
          },
        ],
      },
    ],
  },

  {
    id: 'particles',
    title: 'Unit 8 — Particles & Prepositions',
    tagline: 'The little words that are a third of the Quran',
    lessons: [
      {
        id: 'part-1',
        title: 'Prepositions',
        subtitle: 'min, fī, ʿalā and friends',
        wordIds: ['min', 'fi', 'ala-on', 'ila', 'an-about', 'maa-with', 'inda', 'bayna', 'bi', 'li', 'bad', 'qabl'],
        sections: [
          { type: 'text', body:
`A particle ({{term:harf|ḥarf}}) is any of the small connecting words — and they are staggeringly frequent: {{ar:مِن}} *min* ("from/of") alone appears over **3,200 times**. Learn this batch and you'll recognize a word on virtually every line of the Quran.

Two of them are single letters that glue onto the next word: {{ar:بِ}} *bi-* ("with/by/in" — as in {{ar:بِسْمِ اللَّهِ}} *bi-smi llāh*, "in the name of God") and {{ar:لِ}} *li-* ("for/to" — as in {{ar:الْحَمْدُ لِلَّهِ}} *al-ḥamdu li-llāh*, "praise belongs to God").

One grammar note to file away: the noun after a preposition ends in **-i** (that's the *rabbi* in *bi-smi llāhi rabbi l-ʿālamīn*). Prepositions are the easiest place to watch case endings behave.`,
          },
          { type: 'vocab', wordIds: ['min', 'fi', 'ala-on', 'ila', 'an-about', 'maa-with', 'inda', 'bayna', 'bi', 'li', 'bad', 'qabl'] },
          { type: 'history', body:
`Because particles are so frequent, medieval scholars wrote whole books on single words — Ibn Hishām's classic *Mughnī al-Labīb* devotes dozens of pages to the particle *mā* alone. Why the obsession? Legal and theological rulings can hinge on whether a *bi-* means "with" or "because of". Translators of the Quran still argue about prepositions today; soon you'll be able to eavesdrop on the argument in the original.`,
          },
        ],
      },
      {
        id: 'part-2',
        title: 'The power particles',
        subtitle: 'inna, lā, mā, illā — and the phrase “lā ilāha illā llāh”',
        wordIds: ['wa', 'ma-what', 'la-not', 'inna', 'illa', 'alladhina', 'man-who', 'thumma', 'qad', 'lam-not', 'aw', 'idha', 'in-if', 'kull'],
        sections: [
          { type: 'text', body:
`The heavy hitters:

- {{ar:إِنَّ}} *inna* — "indeed/truly" — launches emphatic statements; the noun after it takes -a: {{ar:إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ}} "Indeed God is Forgiving, Merciful."
- {{ar:لَا}} *lā* — "no/not", and with a following noun, absolute negation: "there is no X at all".
- {{ar:إِلَّا}} *illā* — "except".
- {{ar:مَا}} *mā* — a chameleon: "what" in questions, "not" with verbs, "that which" as a connector. Context decides; you'll get a feel fast.

Now combine: {{ar:لَا إِلَٰهَ إِلَّا اللَّهُ}} *lā ilāha illā llāh* — "there is **no** god **except** God" — the first half of the Islamic declaration of faith, built from exactly the particles above plus a noun you learned in Unit 4. You can now parse, word by word, the most consequential sentence in Islam.`,
          },
          { type: 'vocab', wordIds: ['wa', 'ma-what', 'la-not', 'inna', 'illa', 'alladhina', 'man-who', 'thumma', 'qad', 'lam-not', 'aw', 'idha', 'in-if', 'kull'] },
          { type: 'history', body:
`The negation-plus-exception structure (*lā … illā …*) is Arabic's way of making a claim airtight: deny everything, then carve out the one truth. Rhetoricians call it *qaṣr* (restriction) and the Quran uses it constantly — it's emphatic in a way English "only" never quite captures. The declaration *lā ilāha illā llāh* has been recited in this exact wording since the 7th century, making it among the most-spoken sentences in human history.`,
          },
        ],
        exercises: [
          { prompt: 'Translate: لَا إِلَٰهَ إِلَّا اللَّهُ', choices: ['There is no god except God', 'God is one god', 'There is no god', 'Except God, gods exist'], answer: 0, explain: 'lā (no) + ilāha (god) + illā (except) + Allāh.' },
          { prompt: 'إِنَّ (inna) does what to a sentence?', choices: ['Adds emphasis: “indeed/truly”', 'Makes it a question', 'Negates it', 'Makes it past tense'], answer: 0 },
        ],
      },
    ],
  },

  {
    id: 'reading',
    title: 'Unit 9 — Reading Real Quran',
    tagline: 'Everything comes together',
    lessons: [
      {
        id: 'read-1',
        title: 'Al-Fatiha, word by word',
        subtitle: 'Read the Opening with full understanding',
        wordIds: ['rasul', 'nabi', 'nafs', 'kalimah'],
        sections: [
          { type: 'text', body:
`Time to cash in. You know Al-Fatiha's vocabulary (Unit 3), the iḍāfa (Unit 6), the na- verb prefix (Unit 7), and the particles (Unit 8). Read each verse aloud, then check yourself against the breakdown. The text is in the {{term:uthmani|Uthmani script}} — the Quran's standard orthography — so you may spot archaic spellings like the dagger-alif in {{ar:الرَّحْمَٰن}} (a tiny vertical stroke standing in for a full alif).

Verse 1 is the {{term:basmala|basmala}}: *bi-smi llāhi r-raḥmāni r-raḥīm* — the preposition *bi-* + *ism* (name) in iḍāfa with *Allāh*, followed by two divine names. Verse 2: *al-ḥamdu li-llāhi* (nominal sentence: "the praise [is] for God") *rabbi l-ʿālamīn* (iḍāfa: "Lord of the worlds"). Verse 5: *iyyāka naʿbudu* — "You alone we worship" — the object thrown to the front for emphasis, then our na- prefix verb.

Open the **Reader** page after this lesson: tap any word of any surah for its meaning, and play the recitation while you follow along. From now on, reading real Quran IS your practice.`,
          },
          { type: 'examples', title: 'Al-Fatiha 1:1–7', items: [
            { ar: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translit: 'bismi llāhi r-raḥmāni r-raḥīm', en: 'In the Name of God — the Most Gracious, Most Merciful' },
            { ar: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', translit: 'al-ḥamdu li-llāhi rabbi l-ʿālamīn', en: 'All praise is for God — Lord of all worlds' },
            { ar: 'الرَّحْمَٰنِ الرَّحِيمِ', translit: 'ar-raḥmāni r-raḥīm', en: 'the Most Gracious, Most Merciful' },
            { ar: 'مَالِكِ يَوْمِ الدِّينِ', translit: 'māliki yawmi d-dīn', en: 'Master of the Day of Judgment' },
            { ar: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', translit: 'iyyāka naʿbudu wa-iyyāka nastaʿīn', en: 'You alone we worship; You alone we ask for help' },
            { ar: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', translit: 'ihdinā ṣ-ṣirāṭa l-mustaqīm', en: 'Guide us along the Straight Path' },
            { ar: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', translit: 'ṣirāṭa lladhīna anʿamta ʿalayhim…', en: 'the path of those You have blessed — not of those who earn anger, nor of the astray' },
          ] },
          { type: 'history', body:
`Al-Fatiha is nicknamed *Umm al-Kitāb* — "the Mother of the Book" — because Muslim tradition sees the whole Quran's themes folded into its seven verses. The standard written text of the entire Quran was fixed when Caliph Uthmān (ruled 644–656 CE) had master copies compiled and sent to the major cities; the {{term:uthmani|Uthmani}} spelling conventions in every printed Quran today descend from those copies. You are reading, letter for letter, what a student in 7th-century Medina read.`,
          },
        ],
        exercises: [
          { prompt: 'In "rabbi l-ʿālamīn", the structure is…', choices: ['iḍāfa: Lord OF the worlds', 'a nominal sentence', 'a past-tense verb', 'tanwin'], answer: 0 },
          { prompt: 'نَعْبُدُ (naʿbudu) means…', choices: ['we worship', 'he worships', 'they worshipped', 'worship!'], answer: 0, explain: 'na- prefix = we; root ʿ-b-d = worship/serve.' },
        ],
      },
      {
        id: 'read-2',
        title: 'Al-Ikhlas, Al-Kawthar, Al-Asr',
        subtitle: 'Three complete surahs you can truly read',
        wordIds: ['sabr', 'salah', 'amal', 'khayr'],
        sections: [
          { type: 'text', body:
`Three of the Quran's shortest surahs — and you have the grammar for all of them. In **Al-Ikhlas** (112, "Purity of Faith"): *qul* is the command "Say!" (the hollow verb q-w-l with its wāw hidden), then *huwa llāhu aḥad* — a nominal sentence: "He [is] God, One." *lam yalid wa-lam yūlad*: the particle *lam* + present verb = negated past — "He did not beget nor was He begotten."

**Al-Asr** (103) is a three-verse argument: an oath (*wa-l-ʿaṣr*, "by the passing time" — that wa- is the oath particle), a claim (*inna l-insāna la-fī khusr*, "humanity is in loss" — *inna* + nominal sentence), and the exception (*illā lladhīna āmanū…* — "except those who believe…"). The scholar ash-Shāfiʿī said if only this surah were revealed, it would suffice as guidance.`,
          },
          { type: 'examples', title: 'Al-Ikhlas 112:1–4', items: [
            { ar: 'قُلْ هُوَ اللَّهُ أَحَدٌ', translit: 'qul huwa llāhu aḥad', en: 'Say: He is God — One' },
            { ar: 'اللَّهُ الصَّمَدُ', translit: 'allāhu ṣ-ṣamad', en: 'God — the eternally Sufficient' },
            { ar: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', translit: 'lam yalid wa-lam yūlad', en: 'He does not beget, nor was He begotten' },
            { ar: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', translit: 'wa-lam yakun lahu kufuwan aḥad', en: 'and none is comparable to Him' },
          ] },
          { type: 'vocab', wordIds: ['sabr', 'salah', 'amal', 'khayr'] },
          { type: 'history', body:
`The Prophet Muhammad called Al-Ikhlas "equal to a third of the Quran" — its four verses distill the theology of divine oneness (*tawḥīd*). Al-Kawthar (108) is the shortest surah at three verses and ten words; classical rhetoricians marveled that it manages an announcement, two commands, and a prophecy in that span. Short surahs were the first ones Muslim children memorized in the 7th century — and they still are, which is why we read them first.`,
          },
        ],
      },
      {
        id: 'read-3',
        title: 'The refuge surahs — and your road ahead',
        subtitle: 'Al-Falaq and An-Nas, plus what to learn next',
        wordIds: ['shaytan', 'aduww', 'wali', 'sabil', 'ajr', 'fadl', 'adhab', 'mubin'],
        sections: [
          { type: 'text', body:
`The Quran's final two surahs are companion pieces, both opening {{ar:قُلْ أَعُوذُ بِرَبِّ...}} *qul aʿūdhu bi-rabbi…* — "Say: I seek refuge in the Lord of…". Together they're called *al-muʿawwidhatān*, "the two refuge-takers". Look at the grammar you now own in An-Nas: three stacked iḍāfas (*rabbi n-nās, maliki n-nās, ilāhi n-nās* — Lord / King / God **of mankind**), then *min sharri…* ("from the evil of…" — your preposition *min*), then *alladhī yuwaswisu* ("the one who whispers" — your connector + ya- verb).

**You've completed the core curriculum.** What now?
- Keep your reviews green daily — the deck is your long-term memory.
- Read one short surah in the Reader every day; add unknown words as you meet them.
- Re-run Practice quizzes weekly — interleaved review beats blocked review.
- Then go deeper: the full case system, the ten verb forms, and tajwīd — see the suggested next steps on the Dashboard.`,
          },
          { type: 'examples', title: 'An-Nas 114:1–6', items: [
            { ar: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', translit: 'qul aʿūdhu bi-rabbi n-nās', en: 'Say: I seek refuge in the Lord of mankind' },
            { ar: 'مَلِكِ النَّاسِ', translit: 'maliki n-nās', en: 'the King of mankind' },
            { ar: 'إِلَٰهِ النَّاسِ', translit: 'ilāhi n-nās', en: 'the God of mankind' },
            { ar: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', translit: 'min sharri l-waswāsi l-khannās', en: 'from the evil of the lurking whisperer' },
            { ar: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', translit: 'alladhī yuwaswisu fī ṣudūri n-nās', en: 'who whispers into the hearts of mankind' },
            { ar: 'مِنَ الْجِنَّةِ وَالنَّاسِ', translit: 'mina l-jinnati wa-n-nās', en: 'from among jinn and mankind' },
          ] },
          { type: 'vocab', wordIds: ['shaytan', 'aduww', 'wali', 'sabil', 'ajr', 'fadl', 'adhab', 'mubin'] },
          { type: 'history', body:
`Listen to An-Nas recited and you'll hear the onomatopoeia grammarians praised for centuries: *al-waswās al-khannās* — the whisperer who withdraws — hisses with repeated s-sounds, sonically acting out a whisper. The root w-s-w-s is itself an imitation of whispering (like English "murmur"). This is the layer of the Quran no translation can carry — sound and meaning fused — and it is now, letter by letter, open to you. Keep going.`,
          },
        ],
      },
    ],
  },
  {
    id: 'tajweed',
    title: 'Unit 10 — Tajweed',
    tagline: 'The rules of beautiful, precise recitation',
    lessons: [
      {
        id: 'tj-1',
        title: 'What tajweed is + the bouncing letters',
        subtitle: 'qalqalah — your first recitation rule',
        sections: [
          { type: 'text', body:
`{{term:tajwid|Tajwīd}} ("making excellent") is the set of rules for reciting the Quran exactly as it was transmitted: which sounds to stretch, hum, merge, or bounce. You already read correctly — tajweed is about reciting *beautifully and precisely*. Turn on **"tajweed colors"** in the Reader and every rule you learn in this unit lights up on the real text.

Your first rule is the easiest to hear: {{term:qalqalah|qalqalah}} ("shaking"). Five letters — {{ar:ق ط ب ج د}} (memorized as the nonsense word {{ar:قُطْبُ جَدٍّ}} *quṭbu jadd*) — get a little **echoing bounce** whenever they carry a {{term:sukun|sukun}} (no vowel). Instead of stopping dead, the sound rebounds: *aḥad* at the end of Al-Ikhlas is really *aḥad(ᵉ)* with a springy release of the d.

Listen for it in verses you know: {{ar:قُلْ هُوَ اللَّهُ أَحَدٌ}} — at a pause, that final dāl bounces. Play any recitation in the Reader and you will hear it everywhere now.`,
          },
          { type: 'examples', title: 'Hear the bounce', items: [
            { ar: 'أَحَدْ', translit: 'aḥad', en: 'One — final dāl bounces at the pause (112:1)' },
            { ar: 'الْفَلَقْ', translit: 'al-falaq', en: 'the daybreak — final qāf bounces (113:1)' },
            { ar: 'يَجْعَلْ', translit: 'yajʿal', en: 'he makes — the jīm mid-word has a subtle bounce' },
          ] },
          { type: 'history', body:
`Tajweed rules were not invented — they were *described*. The Prophet's companions recited the way he recited; scholars later wrote down what expert reciters were already doing so it could be taught to new Muslims far from Arabia. The first full written treatise came from Abū Muzāḥim al-Khāqānī in the 900s CE — a poem, so students could memorize the rules of memorizing. A person who memorizes the whole Quran is called a {{term:hafiz|ḥāfiẓ}}; millions are alive today, and every one of them learned these same rules.`,
          },
        ],
        exercises: [
          { prompt: 'Which letters take qalqalah (the bounce)?', choices: ['ق ط ب ج د', 'ا و ي', 'ن م', 'ء ه ع ح'], answer: 0, explain: 'Memorized as quṭbu jadd: qāf, ṭā’, bā’, jīm, dāl.' },
          { prompt: 'Qalqalah happens when one of those letters has…', choices: ['a sukun (no vowel)', 'a fatha', 'a shadda', 'tanwin'], answer: 0 },
        ],
      },
      {
        id: 'tj-2',
        title: 'The nūn rules',
        subtitle: 'iẓhār, idghām, iqlāb, ikhfāʾ — and the nasal hum',
        sections: [
          { type: 'text', body:
`The most famous chapter of tajweed: what happens to a **silent nūn** — a {{ar:نْ}} with sukun, or the "n" of {{term:tanwin|tanwin}} — depends entirely on the *next* letter. Four outcomes:

- {{term:izhar|iẓhār}} ("making clear") — before the six throat letters ({{ar:ء ه ع ح غ خ}}), just say the n plainly: {{ar:مِنْ عِلْمٍ}} *min ʿilm*.
- {{term:idgham|idghām}} ("merging") — before {{ar:ي ن م و ل ر}}, the n disappears into the next letter: {{ar:مِن رَّبِّهِمْ}} is recited *mir-rabbihim*. Before ي ن م و the merge keeps a nasal hum.
- {{term:iqlab|iqlāb}} ("flipping") — before {{ar:ب}}, the n becomes a soft m: {{ar:مِنۢ بَعْدِ}} → *mim-baʿdi*.
- {{term:ikhfa|ikhfāʾ}} ("hiding") — before the other fifteen letters, the n is half-pronounced with a hum, tongue hovering: {{ar:مِن شَرِّ}} → *mi(n)-sharri*.

The hum in several of these is called {{term:ghunnah|ghunnah}} — air through the nose for about two beats. You already make it on every doubled nūn and mīm: {{ar:إِنَّ}} *inna*, {{ar:ثُمَّ}} *thumma*. Don't memorize the letter lists yet — turn on tajweed colors, read Al-Falaq and An-Nas (full of *min sharri…*), and watch the rules appear.`,
          },
          { type: 'examples', title: 'All four rules in the refuge surahs', items: [
            { ar: 'مِنْ خَوْفٍ', translit: 'min khawf', en: 'iẓhār — n said clearly before a throat letter (106:4)' },
            { ar: 'مِن وَاقٍ', translit: 'miw-wāq', en: 'idghām — n merges into wāw with a hum (13:34)' },
            { ar: 'مِنۢ بَعْدِ', translit: 'mim-baʿdi', en: 'iqlāb — n flips to m before bā’' },
            { ar: 'مِن شَرِّ', translit: 'mi(n)-sharri', en: 'ikhfāʾ — n hidden with a hum (113:2)' },
          ] },
          { type: 'history', body:
`Why such fuss over one letter? Because nūn is the most common consonant ending in Arabic — tanwin alone puts it on thousands of word endings — and how a reciter handles it shapes the whole flow of recitation. The rules mirror what your mouth wants to do anyway: try saying "min baʿdi" fast and you'll feel the n drift toward m. Tajweed took these natural assimilations, chose the most beautiful version, and fixed it — the same verse flows identically from a reciter in Jakarta and one in Cairo.`,
          },
        ],
        exercises: [
          { prompt: 'What happens to silent nūn before bā’ (ب)?', choices: ['It becomes a soft m (iqlāb)', 'It is said clearly (iẓhār)', 'It disappears completely', 'It becomes a b'], answer: 0, explain: 'iqlāb: min baʿdi → mim-baʿdi, with a light hum.' },
          { prompt: 'The ghunnah is…', choices: ['a nasal hum held ~2 beats', 'a bounce on q ṭ b j d', 'a long vowel', 'a pause symbol'], answer: 0 },
          { prompt: 'مِن رَّبِّهِمْ (min rabbihim) is recited…', choices: ['mir-rabbihim (n merges)', 'min-rabbihim (n clear)', 'mim-rabbihim (n → m)', 'mi-rabbihim (n dropped, no merge)'], answer: 0, explain: 'Before rā’, idghām without ghunnah: the n melts into the r.' },
        ],
      },
      {
        id: 'tj-3',
        title: 'Stretching and stopping',
        subtitle: 'the madd family and waqf',
        sections: [
          { type: 'text', body:
`Two final rule families complete your toolkit:

**Stretching.** You know {{term:madd|madd}} — a long vowel held two beats. Tajweed adds: when a long vowel runs into a {{term:hamza|hamza}} or a doubled letter, it stretches further — four, five, even six beats. In tajweed colors these show as deepening shades of red/orange: {{ar:جَآءَ}} *jāāā'a* ("he came", madd + hamza), {{ar:وَلَا الضَّآلِّينَ}} *wa-lā ḍ-ḍāāāllīn* (the famous six-beat stretch ending Al-Fatiha — listen for how reciters linger there).

**Stopping** ({{term:waqf|waqf}}). Reciters breathe at verse ends and marked pauses, and stopping changes sounds: final short vowels and tanwin go silent (*raḥīmun* → *raḥīm*), and {{term:ta-marbuta|tā’ marbūṭa}} becomes "h" (*raḥmatan* → *raḥmah*). Small letters above the text mark the etiquette: {{ar:مـ}} = must stop, {{ar:لا}} = don't stop, {{ar:ج}} = your choice.

That's the core of tajweed. From here it's ear-training: read along in the Reader with tajweed colors on while the recitation plays, and the rules will move from your head into your voice.`,
          },
          { type: 'examples', title: 'Stretches you can count', items: [
            { ar: 'وَلَا الضَّالِّينَ', translit: 'wa-lā ḍ-ḍāllīn', en: 'six-beat madd — the longest stretch in Al-Fatiha (1:7)' },
            { ar: 'جَاءَ', translit: 'jāʾa', en: 'four-beat madd before hamza' },
            { ar: 'السَّمَاءِ', translit: 'as-samāʾ', en: 'stretch before a final hamza' },
          ] },
          { type: 'history', body:
`The beat ("ḥarakah") of tajweed timing is defined charmingly: the time it takes to open or close a finger, at your natural recitation pace. Slower recitation = longer beats, but the *ratios* stay fixed — a six-beat madd is always three times a two-beat one. This proportional system let recitation styles range from the slow, melodic *tartīl* to brisker teaching styles while staying recognizably identical — audio compression by ratio, invented a millennium before audio.`,
          },
        ],
        exercises: [
          { prompt: 'At a stop (waqf), the word رَحِيمٌ (raḥīmun) is read…', choices: ['raḥīm — the tanwin goes silent', 'raḥīmun — nothing changes', 'raḥīma', 'raḥīmah'], answer: 0 },
          { prompt: 'A madd followed by hamza or a doubled letter…', choices: ['stretches longer (4–6 beats)', 'is cut short', 'becomes a ghunnah', 'is silent'], answer: 0 },
        ],
      },
    ],
  },
];

export const allLessons = CURRICULUM.flatMap((u) => u.lessons);
export const lessonById = new Map(allLessons.map((l) => [l.id, l]));

export function lessonIndex(lessonId: string): number {
  return allLessons.findIndex((l) => l.id === lessonId);
}

export function nextLesson(completedIds: Set<string>) {
  return allLessons.find((l) => !completedIds.has(l.id)) ?? null;
}
