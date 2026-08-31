// Bundled copies of the short surahs used in lessons, so early lessons work
// even without the Quran API. The Reader page uses the live API instead.
export interface BundledVerse {
  n: number;
  ar: string;
  translit: string;
  en: string;
}

export interface BundledSurah {
  chapter: number;
  name: string;
  arabicName: string;
  meaning: string;
  verses: BundledVerse[];
}

export const BUNDLED_SURAHS: BundledSurah[] = [
  {
    chapter: 1, name: 'Al-Fatiha', arabicName: 'الفاتحة', meaning: 'The Opening',
    verses: [
      { n: 1, ar: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translit: 'bismi llāhi r-raḥmāni r-raḥīm', en: 'In the Name of Allah — the Most Gracious, Most Merciful.' },
      { n: 2, ar: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', translit: 'al-ḥamdu li-llāhi rabbi l-ʿālamīn', en: 'All praise is for Allah — Lord of all worlds.' },
      { n: 3, ar: 'الرَّحْمَٰنِ الرَّحِيمِ', translit: 'ar-raḥmāni r-raḥīm', en: 'The Most Gracious, Most Merciful.' },
      { n: 4, ar: 'مَالِكِ يَوْمِ الدِّينِ', translit: 'māliki yawmi d-dīn', en: 'Master of the Day of Judgment.' },
      { n: 5, ar: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', translit: 'iyyāka naʿbudu wa-iyyāka nastaʿīn', en: 'You alone we worship and You alone we ask for help.' },
      { n: 6, ar: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', translit: 'ihdinā ṣ-ṣirāṭa l-mustaqīm', en: 'Guide us along the Straight Path.' },
      { n: 7, ar: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', translit: 'ṣirāṭa lladhīna anʿamta ʿalayhim ghayri l-maghḍūbi ʿalayhim wa-lā ḍ-ḍāllīn', en: 'The path of those You have blessed — not those You are displeased with, or those who are astray.' },
    ],
  },
  {
    chapter: 112, name: 'Al-Ikhlas', arabicName: 'الإخلاص', meaning: 'Purity of Faith',
    verses: [
      { n: 1, ar: 'قُلْ هُوَ اللَّهُ أَحَدٌ', translit: 'qul huwa llāhu aḥad', en: 'Say: He is Allah — One.' },
      { n: 2, ar: 'اللَّهُ الصَّمَدُ', translit: 'allāhu ṣ-ṣamad', en: 'Allah — the Sustainer needed by all.' },
      { n: 3, ar: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', translit: 'lam yalid wa-lam yūlad', en: 'He has never had offspring, nor was He born.' },
      { n: 4, ar: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', translit: 'wa-lam yakun lahu kufuwan aḥad', en: 'And there is none comparable to Him.' },
    ],
  },
  {
    chapter: 103, name: 'Al-Asr', arabicName: 'العصر', meaning: 'The Passing Time',
    verses: [
      { n: 1, ar: 'وَالْعَصْرِ', translit: 'wa-l-ʿaṣr', en: 'By the passing time!' },
      { n: 2, ar: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ', translit: 'inna l-insāna la-fī khusr', en: 'Surely humanity is in grave loss —' },
      { n: 3, ar: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ', translit: 'illā lladhīna āmanū wa-ʿamilū ṣ-ṣāliḥāti wa-tawāṣaw bi-l-ḥaqqi wa-tawāṣaw bi-ṣ-ṣabr', en: 'except those who believe, do good, and urge each other to truth and urge each other to patience.' },
    ],
  },
  {
    chapter: 108, name: 'Al-Kawthar', arabicName: 'الكوثر', meaning: 'The Abundance',
    verses: [
      { n: 1, ar: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', translit: 'innā aʿṭaynāka l-kawthar', en: 'Indeed, We have granted you abundance.' },
      { n: 2, ar: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', translit: 'fa-ṣalli li-rabbika wa-nḥar', en: 'So pray and sacrifice to your Lord alone.' },
      { n: 3, ar: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', translit: 'inna shāniʾaka huwa l-abtar', en: 'Only the one who hates you is truly cut off.' },
    ],
  },
  {
    chapter: 113, name: 'Al-Falaq', arabicName: 'الفلق', meaning: 'The Daybreak',
    verses: [
      { n: 1, ar: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', translit: 'qul aʿūdhu bi-rabbi l-falaq', en: 'Say: I seek refuge in the Lord of the daybreak' },
      { n: 2, ar: 'مِن شَرِّ مَا خَلَقَ', translit: 'min sharri mā khalaq', en: 'from the evil of what He has created,' },
      { n: 3, ar: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', translit: 'wa-min sharri ghāsiqin idhā waqab', en: 'and from the evil of the night when it grows dark,' },
      { n: 4, ar: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', translit: 'wa-min sharri n-naffāthāti fī l-ʿuqad', en: 'and from the evil of those who blow on knots,' },
      { n: 5, ar: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', translit: 'wa-min sharri ḥāsidin idhā ḥasad', en: 'and from the evil of an envier when they envy.' },
    ],
  },
  {
    chapter: 114, name: 'An-Nas', arabicName: 'الناس', meaning: 'Mankind',
    verses: [
      { n: 1, ar: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', translit: 'qul aʿūdhu bi-rabbi n-nās', en: 'Say: I seek refuge in the Lord of mankind,' },
      { n: 2, ar: 'مَلِكِ النَّاسِ', translit: 'maliki n-nās', en: 'the Master of mankind,' },
      { n: 3, ar: 'إِلَٰهِ النَّاسِ', translit: 'ilāhi n-nās', en: 'the God of mankind,' },
      { n: 4, ar: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', translit: 'min sharri l-waswāsi l-khannās', en: 'from the evil of the lurking whisperer,' },
      { n: 5, ar: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', translit: 'alladhī yuwaswisu fī ṣudūri n-nās', en: 'who whispers into the hearts of humanity,' },
      { n: 6, ar: 'مِنَ الْجِنَّةِ وَالنَّاسِ', translit: 'mina l-jinnati wa-n-nās', en: 'from among jinn and mankind.' },
    ],
  },
];
