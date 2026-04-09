/**
 * AHSAS Source Library
 * Curated primary & secondary sources for Chinese History curriculum.
 * Each source includes MLA citation, PIECES tags, and analysis prompts.
 */

const AHSAS_SOURCES = [
  // ================================================================
  // UNIT 1 — Chinese Geography
  // ================================================================
  {
    id: 'geo-shanhaijing',
    unit: 'geography',
    title: 'Classic of Mountains and Seas (Shan Hai Jing)',
    type: 'primary',
    format: 'text',
    creator: 'Anonymous, compiled over centuries',
    date: '~4th century BCE – 1st century CE',
    snippet: 'A compendium of mythic geography describing mountains, rivers, flora, fauna, and peoples of the known and imagined world — revealing how ancient Chinese understood their physical environment.',
    url: 'https://afe.easia.columbia.edu/ps/cup/classic_of_odes_king_wen.pdf',
    pieces: ['environmental', 'cultural'],
    mlaCitation: 'Classic of Mountains and Seas (Shan Hai Jing). Translated by Anne Birrell, Penguin Classics, 1999.',
    perspective: 'Chinese indigenous — mythological-cosmological worldview',
    analysisPrompts: [
      'What does this text reveal about ancient Chinese geographic knowledge?',
      'How does mythology blend with real geography in this source?'
    ]
  },
  {
    id: 'geo-silk-road-map',
    unit: 'geography',
    title: 'Map of Silk Road Trade Routes',
    type: 'secondary',
    format: 'map',
    creator: 'Various cartographers',
    date: 'Modern reconstruction',
    snippet: 'Trade networks connecting Chang\'an to Rome via Central Asian oases, mountain passes, and desert corridors. The routes shaped cultural exchange for over a millennium.',
    url: 'https://afe.easia.columbia.edu/special/silk_road.htm',
    pieces: ['economic', 'environmental'],
    mlaCitation: '"The Silk Road." Asia for Educators, Columbia University, 2024.',
    perspective: 'Western academic reconstruction — modern cartographic lens',
    analysisPrompts: [
      'How did geographic obstacles (deserts, mountains) shape the Silk Road routes?',
      'Why were oasis towns critical to long-distance trade?'
    ]
  },
  {
    id: 'geo-yellow-river',
    unit: 'geography',
    title: 'Yellow River Flood Records',
    type: 'primary',
    format: 'text',
    creator: 'Imperial Chinese historians',
    date: 'Various dynasties',
    snippet: 'The Yellow River has changed course 26 times and flooded over 1,500 times in recorded history. A 1887 flood killed an estimated 900,000–2,000,000 people, earning the river its epithet "China\'s Sorrow."',
    url: 'https://afe.easia.columbia.edu/china/geog/maps.htm',
    pieces: ['environmental', 'social'],
    mlaCitation: '"China\'s Geography with Maps." Asia for Educators, Columbia University, 2024.',
    perspective: 'Chinese imperial — statecraft-oriented record-keeping',
    analysisPrompts: [
      'How did the Yellow River\'s unpredictability shape Chinese statecraft?',
      'What is the relationship between flood control and political legitimacy in Chinese history?'
    ]
  },

  // ================================================================
  // UNIT 2 — Belief Systems
  // ================================================================
  {
    id: 'bs-analects',
    unit: 'belief-systems',
    title: 'The Analects of Confucius (Selections)',
    type: 'primary',
    format: 'text',
    creator: 'Confucius (Kong Qiu) / disciples',
    date: '~500 BCE',
    snippet: '"The Master said: \'To govern is to be correct. If you lead the people by being correct yourself, who will dare to be incorrect?\' (12.17) \'Is it not a pleasure to learn and to practice what one has learned?\' (1.1)"',
    url: 'https://afe.easia.columbia.edu/ps/cup/confucius_analects.pdf',
    pieces: ['cultural', 'political'],
    mlaCitation: 'Confucius. The Analects. Translated by D.C. Lau, Penguin Classics, 1979.',
    perspective: 'Chinese philosophical — foundational Confucian voice',
    analysisPrompts: [
      'What Confucian value does this passage illustrate?',
      'How might a Legalist respond to this idea of governance?',
      'Why does Confucius link learning to pleasure?'
    ]
  },
  {
    id: 'bs-daodejing',
    unit: 'belief-systems',
    title: 'Dao De Jing (Selections)',
    type: 'primary',
    format: 'text',
    creator: 'Attributed to Laozi',
    date: '~4th century BCE',
    snippet: '"The Dao that can be told is not the eternal Dao. The name that can be named is not the eternal name." "The sage acts by doing nothing, teaches by saying nothing."',
    url: 'https://afe.easia.columbia.edu/ps/cup/laozi_daodejing.pdf',
    pieces: ['cultural', 'social'],
    mlaCitation: 'Laozi. Tao Te Ching. Translated by D.C. Lau, Penguin Classics, 1963.',
    perspective: 'Chinese philosophical — Daoist counter-tradition',
    analysisPrompts: [
      'How does Daoist philosophy challenge Confucian ideas about governance?',
      'What does "wu wei" (non-action) mean in practice?'
    ]
  },
  {
    id: 'bs-hanfeizi',
    unit: 'belief-systems',
    title: 'Han Feizi: The Way of the Ruler',
    type: 'primary',
    format: 'text',
    creator: 'Han Feizi',
    date: '~233 BCE',
    snippet: '"The intelligent ruler makes the law select men and makes no arbitrary promotions himself. He makes the law measure merits and makes no arbitrary judgments himself."',
    url: 'https://afe.easia.columbia.edu/ps/cup/hanfei_five_vermin.pdf',
    pieces: ['political', 'cultural'],
    mlaCitation: 'Han Feizi. Han Feizi: Basic Writings. Translated by Burton Watson, Columbia University Press, 2003.',
    perspective: 'Chinese philosophical — Legalist state-building perspective',
    analysisPrompts: [
      'How does Legalism differ from Confucianism in its view of human nature?',
      'Why might a ruler prefer Legalist to Confucian ideas?'
    ]
  },
  {
    id: 'bs-xunzi',
    unit: 'belief-systems',
    title: 'Xunzi: Human Nature Is Evil',
    type: 'primary',
    format: 'text',
    creator: 'Xunzi (Xun Kuang)',
    date: '~3rd century BCE',
    snippet: '"Man\'s nature is evil; goodness is the result of conscious activity. The nature of man is such that he is born with a fondness for profit."',
    url: 'https://afe.easia.columbia.edu/ps/cup/xunzi_human_nature.pdf',
    pieces: ['cultural', 'social'],
    mlaCitation: 'Xunzi. Xunzi: Basic Writings. Translated by Burton Watson, Columbia University Press, 2003.',
    perspective: 'Chinese philosophical — Confucian heterodox on human nature',
    analysisPrompts: [
      'How does Xunzi\'s view compare to Mencius on human nature?',
      'What implications does this have for the role of education and ritual?'
    ]
  },
  {
    id: 'bs-artofwar',
    unit: 'belief-systems',
    title: 'Sun Tzu: The Art of War (Selections)',
    type: 'primary',
    format: 'text',
    creator: 'Sun Tzu (Sunzi)',
    date: '~5th century BCE',
    snippet: '"The supreme art of war is to subdue the enemy without fighting." "All warfare is based on deception."',
    url: 'https://afe.easia.columbia.edu/ps/cup/sunzi_art_of_war.pdf',
    pieces: ['political', 'innovation'],
    mlaCitation: 'Sun Tzu. The Art of War. Translated by Samuel B. Griffith, Oxford University Press, 1963.',
    perspective: 'Chinese strategic — military-political treatise',
    analysisPrompts: [
      'How does Sun Tzu\'s approach reflect Chinese strategic thinking?',
      'Compare Sun Tzu\'s philosophy to Legalist ideas about statecraft.'
    ]
  },

  // ================================================================
  // UNIT 3 — Tang Dynasty & Silk Roads
  // ================================================================
  {
    id: 'tang-xuanzang',
    unit: 'tang-silk-roads',
    title: 'Great Tang Records on the Western Regions',
    type: 'primary',
    format: 'text',
    creator: 'Xuanzang',
    date: '646 CE',
    snippet: 'The Buddhist monk Xuanzang traveled 10,000 miles to India and back, documenting the peoples, governments, and religions of Central and South Asia. His account is the most detailed record of 7th-century Silk Road societies.',
    url: 'https://idp.bl.uk/discover/learning/buddhism-on-the-silk-roads/articles/buddhism-on-the-ground/buddhist-texts-the-diamond-sutra/',
    pieces: ['cultural', 'economic'],
    mlaCitation: 'Xuanzang. Great Tang Records on the Western Regions. Translated by Li Rongxi, Numata Center for Buddhist Translation, 1996.',
    perspective: 'Chinese Buddhist — pilgrim observing South/Central Asia',
    analysisPrompts: [
      'What does Xuanzang\'s journey reveal about Tang-era cultural exchange?',
      'How does this source demonstrate the interconnectedness of the Silk Road?'
    ]
  },
  {
    id: 'tang-taizong',
    unit: 'tang-silk-roads',
    title: 'Emperor Taizong on Governance',
    type: 'primary',
    format: 'text',
    creator: 'Emperor Taizong (Li Shimin)',
    date: '~630 CE',
    snippet: '"A ruler who exploits the people for his own pleasures is like one who cuts his own thighs to feed his belly. When the belly is full, the body perishes."',
    url: 'https://afe.easia.columbia.edu/ps/china/taizong_effective.pdf',
    pieces: ['political', 'cultural'],
    mlaCitation: '"Emperor Taizong on Effective Government." Asia for Educators, Columbia University, 2024.',
    perspective: 'Chinese imperial — ruler self-reflection on governance',
    analysisPrompts: [
      'How does Taizong\'s philosophy reflect Confucian principles?',
      'What makes this a Confucian (rather than Legalist) view of rulership?'
    ]
  },
  {
    id: 'tang-diamond-sutra',
    unit: 'tang-silk-roads',
    title: 'Diamond Sutra (868 CE print)',
    type: 'primary',
    format: 'image',
    creator: 'Wang Jie (commissioner)',
    date: '868 CE',
    snippet: 'The world\'s oldest dated printed book, found in the Dunhuang caves. It demonstrates Tang mastery of woodblock printing — a technology that would transform global knowledge production.',
    url: 'https://idp.bl.uk/discover/learning/buddhism-on-the-silk-roads/articles/buddhism-on-the-ground/buddhist-texts-the-diamond-sutra/',
    pieces: ['innovation', 'cultural'],
    mlaCitation: '"The Diamond Sutra." British Library, International Dunhuang Project. Accessed 2026.',
    perspective: 'Chinese Buddhist — devotional-technological artifact',
    analysisPrompts: [
      'Why is the Diamond Sutra significant for the history of technology?',
      'What does its Buddhist content tell us about Tang religion?'
    ]
  },
  {
    id: 'tang-dunhuang',
    unit: 'tang-silk-roads',
    title: 'Dunhuang Cave Murals',
    type: 'primary',
    format: 'image',
    creator: 'Various Buddhist artists',
    date: '4th–14th century CE',
    snippet: 'Over 2,000 painted sculptures and 45,000 square meters of murals depict Buddhist narratives, daily life, music, dance, and trade along the Silk Road. They are a visual encyclopedia of medieval Central Asian culture.',
    url: 'https://www.getty.edu/research/exhibitions_events/exhibitions/cave_temples_dunhuang/gallery.html',
    pieces: ['cultural', 'social'],
    mlaCitation: '"Mogao Caves." UNESCO World Heritage List. Accessed 2026.',
    perspective: 'Multi-cultural — Central Asian artistic syncretism',
    analysisPrompts: [
      'What do the Dunhuang murals reveal about cultural exchange on the Silk Road?',
      'How do artistic styles blend Chinese, Indian, and Central Asian influences?'
    ]
  },
  {
    id: 'tang-poetry-libai',
    unit: 'tang-silk-roads',
    title: 'Li Bai: "Quiet Night Thought"',
    type: 'primary',
    format: 'text',
    creator: 'Li Bai',
    date: '~730 CE',
    snippet: '"Before my bed, bright moonlight — I wonder, is it frost upon the ground? I lift my head to gaze at the moon, then bow my head, remembering home."',
    url: 'https://afe.easia.columbia.edu/ps/cup/libo_fighting.pdf',
    pieces: ['cultural'],
    mlaCitation: 'Li Bai. "Quiet Night Thought." Selected Poems of Li Po, translated by David Hinton, New Directions, 1996.',
    perspective: 'Chinese literati — elite poetic tradition',
    analysisPrompts: [
      'What does this poem reveal about Tang literati culture?',
      'How does Tang poetry reflect Daoist themes of nature and simplicity?'
    ]
  },

  // ================================================================
  // UNIT 4 — Ming Dynasty & Sea Voyages
  // ================================================================
  {
    id: 'ming-zhenghe',
    unit: 'ming-voyages',
    title: 'Zheng He\'s Navigation Map (Mao Kun Map)',
    type: 'primary',
    format: 'map',
    creator: 'Zheng He\'s navigators',
    date: '~1430 CE',
    snippet: 'A strip map of the routes taken by Zheng He\'s treasure fleet across Southeast Asia, the Indian Ocean, and East Africa. The map documents ports, currents, star positions, and compass bearings.',
    url: 'https://afe.easia.columbia.edu/special/china_1000ce_mingvoyages.htm',
    pieces: ['innovation', 'economic'],
    mlaCitation: '"Zheng He." Encyclopædia Britannica, 2026.',
    perspective: 'Chinese maritime — imperial naval perspective',
    analysisPrompts: [
      'What does this map reveal about Ming maritime capability?',
      'Why did China ultimately abandon these voyages?'
    ]
  },
  {
    id: 'ming-ricci',
    unit: 'ming-voyages',
    title: 'Matteo Ricci\'s Journal',
    type: 'primary',
    format: 'text',
    creator: 'Matteo Ricci, S.J.',
    date: '1583–1610',
    snippet: '"The Chinese language has no alphabet but uses symbols for each word... The empire is so vast that the governors of provinces are like kings in Europe."',
    url: 'https://afe.easia.columbia.edu/ps/cup/empress_xu_inner_quarters.pdf',
    pieces: ['cultural', 'political'],
    mlaCitation: 'Ricci, Matteo. China in the Sixteenth Century: The Journals of Matteo Ricci, 1583–1610. Translated by Louis J. Gallagher, Random House, 1953.',
    perspective: 'Western missionary — European observing Ming China',
    analysisPrompts: [
      'What does Ricci\'s account reveal about European perceptions of China?',
      'How does Ricci compare Chinese and European civilizations?'
    ]
  },
  {
    id: 'ming-wang-yangming',
    unit: 'ming-voyages',
    title: 'Wang Yangming: Inquiry on the Great Learning',
    type: 'primary',
    format: 'text',
    creator: 'Wang Yangming',
    date: '~1527',
    snippet: '"Knowledge and action are one and the same." Wang Yangming challenged orthodox Neo-Confucianism by arguing that moral knowledge is innate and that true understanding requires action, not just study.',
    url: 'https://afe.easia.columbia.edu/ps/cup/wang_yangming_knowing_acting.pdf',
    pieces: ['cultural', 'social'],
    mlaCitation: '"Wang Yangming." Asia for Educators, Columbia University, 2024.',
    perspective: 'Chinese philosophical — Neo-Confucian reform voice',
    analysisPrompts: [
      'How does Wang Yangming\'s philosophy challenge Zhu Xi\'s orthodoxy?',
      'What are the political implications of "innate knowledge"?'
    ]
  },
  {
    id: 'ming-forbidden-city',
    unit: 'ming-voyages',
    title: 'The Forbidden City (architectural plan)',
    type: 'primary',
    format: 'image',
    creator: 'Kuai Xiang (lead architect)',
    date: '1406–1420',
    snippet: 'The imperial palace complex in Beijing: 980 buildings across 180 acres, organized along a central axis reflecting Confucian cosmology — the emperor at the center, facing south, mediating between heaven and earth.',
    url: 'https://afe.easia.columbia.edu/ps/cup/empress_xu_inner_quarters.pdf',
    pieces: ['political', 'cultural'],
    mlaCitation: '"Forbidden City." UNESCO World Heritage List. Accessed 2026.',
    perspective: 'Chinese imperial — architectural political symbolism',
    analysisPrompts: [
      'How does the Forbidden City\'s layout reflect political ideology?',
      'What does its scale reveal about Ming state power?'
    ]
  },

  // ================================================================
  // UNIT 5 — Yuan & Qing Comparative Dynasty
  // ================================================================
  {
    id: 'yq-marco-polo',
    unit: 'yuan-qing-comparative',
    title: 'The Travels of Marco Polo (Selections)',
    type: 'primary',
    format: 'text',
    creator: 'Marco Polo / Rustichello da Pisa',
    date: '~1300',
    snippet: '"I have not told half of what I saw." Polo describes Kublai Khan\'s court, paper money, the Grand Canal, coal use, and the sheer scale of Chinese cities — astonishing to European readers.',
    url: 'https://afe.easia.columbia.edu/ps/china/attractions_song_capital.pdf',
    pieces: ['economic', 'cultural'],
    mlaCitation: 'Polo, Marco. The Travels of Marco Polo. Translated by Ronald Latham, Penguin Classics, 1958.',
    perspective: 'Western traveler — European observing Yuan China',
    analysisPrompts: [
      'What does Polo describe that did not exist in Europe at this time?',
      'How reliable is Marco Polo as a historical source?'
    ]
  },
  {
    id: 'yq-macartney',
    unit: 'yuan-qing-comparative',
    title: 'Qianlong\'s Letter to King George III',
    type: 'primary',
    format: 'text',
    creator: 'Emperor Qianlong',
    date: '1793',
    snippet: '"Our Celestial Empire possesses all things in prolific abundance. There is therefore no need to import the manufactures of outside barbarians." The emperor rebuffs British trade demands.',
    url: 'https://afe.easia.columbia.edu/ps/china/qianlong_edicts.pdf',
    pieces: ['political', 'economic'],
    mlaCitation: '"Emperor Qianlong, Letter to George III, 1793." Asia for Educators, Columbia University, 2024.',
    perspective: 'Chinese imperial — Qing court addressing Western powers',
    analysisPrompts: [
      'What does Qianlong\'s language reveal about the Qing worldview?',
      'How does the tributary system framework shape this diplomatic encounter?'
    ]
  },
  {
    id: 'yq-kangxi-edict',
    unit: 'yuan-qing-comparative',
    title: 'Kangxi Emperor\'s Sacred Edict',
    type: 'primary',
    format: 'text',
    creator: 'Emperor Kangxi',
    date: '1670',
    snippet: 'Sixteen maxims for moral governance: "Esteem highly filial piety... behave with generosity... attend to agriculture... esteem learning." The Edict reveals how the Manchu Qing sought legitimacy through Confucian values.',
    url: 'https://afe.easia.columbia.edu/ps/cup/qing_sacred_edict.pdf',
    pieces: ['political', 'cultural'],
    mlaCitation: '"The Sacred Edict of the Kangxi Emperor." Asia for Educators, Columbia University, 2024.',
    perspective: 'Manchu imperial — conquest dynasty asserting Confucian legitimacy',
    analysisPrompts: [
      'How does the Sacred Edict demonstrate Qing sinicization strategy?',
      'Compare this to Yuan approaches to governing a Han Chinese majority.'
    ]
  },
  {
    id: 'yq-banner-system',
    unit: 'yuan-qing-comparative',
    title: 'The Manchu Banner System',
    type: 'secondary',
    format: 'text',
    creator: 'Elliott, Mark C.',
    date: '2001',
    snippet: 'The Eight Banners were the Qing military-administrative system: Manchu, Mongol, and Han Chinese units organized under colored flags. They maintained Manchu identity while integrating conquered populations — a dual governance model.',
    url: 'https://afe.easia.columbia.edu/ps/cup/qing_sacred_edict.pdf',
    pieces: ['political', 'social'],
    mlaCitation: 'Elliott, Mark C. The Manchu Way: The Eight Banners and Ethnic Identity in Late Imperial China. Stanford UP, 2001.',
    perspective: 'Western academic — modern historical analysis of Qing institutions',
    analysisPrompts: [
      'How did the Banner system maintain Manchu ethnic identity?',
      'Compare the Yuan four-class system to the Qing Banner system as governance strategies.'
    ]
  },

  // ================================================================
  // UNIT 6 — Fall of the Qing
  // ================================================================
  {
    id: 'fq-lin-zexu',
    unit: 'fall-of-qing',
    title: 'Lin Zexu\'s Letter to Queen Victoria',
    type: 'primary',
    format: 'text',
    creator: 'Lin Zexu',
    date: '1839',
    snippet: '"We have heard that in your own country opium is prohibited with the utmost strictness and severity. This is a strong proof that you know full well how hurtful it is... why then do you allow it to be sold to other countries?"',
    url: 'https://afe.easia.columbia.edu/special/china_1750_opium.htm',
    pieces: ['political', 'economic'],
    mlaCitation: '"Lin Zexu, Letter to Queen Victoria, 1839." Asia for Educators, Columbia University, 2024.',
    perspective: 'Chinese official — Qing moral-diplomatic protest against imperialism',
    analysisPrompts: [
      'What moral argument does Lin Zexu use to challenge Britain?',
      'Why does Lin Zexu appeal to universal moral principles rather than Chinese sovereignty alone?'
    ]
  },
  {
    id: 'fq-treaty-nanjing',
    unit: 'fall-of-qing',
    title: 'Treaty of Nanjing (1842)',
    type: 'primary',
    format: 'text',
    creator: 'British and Qing negotiators',
    date: '1842',
    snippet: 'China\'s first "unequal treaty": ceded Hong Kong, opened five treaty ports, paid 21 million silver dollars in indemnity, and granted most-favored-nation status — establishing the framework for a century of foreign privilege.',
    url: 'https://afe.easia.columbia.edu/ps/china/nanjing.pdf',
    pieces: ['political', 'economic'],
    mlaCitation: '"Excerpts from the Treaty of Nanjing, August 1842." Asia for Educators, Columbia University, 2024.',
    perspective: 'Bilateral diplomatic — imposed by British on Qing',
    analysisPrompts: [
      'Which provisions of the treaty most directly undermined Qing sovereignty?',
      'How does the concept of "unequal treaties" frame Chinese historical memory?'
    ]
  },
  {
    id: 'fq-feng-guifen',
    unit: 'fall-of-qing',
    title: 'Feng Guifen: On the Adoption of Western Learning',
    type: 'primary',
    format: 'text',
    creator: 'Feng Guifen',
    date: '1861',
    snippet: '"Chinese learning for the essential principles; Western learning for practical application." Feng argued China should adopt Western military technology and science while preserving Confucian values — the intellectual foundation of Self-Strengthening.',
    url: 'https://afe.easia.columbia.edu/ps/china/feng_guifen_western_learning.pdf',
    pieces: ['innovation', 'political'],
    mlaCitation: '"Feng Guifen on the Adoption of Western Learning." Asia for Educators, Columbia University, 2024.',
    perspective: 'Chinese reformist — Self-Strengthening intellectual',
    analysisPrompts: [
      'Why does Feng distinguish between "essence" and "application"?',
      'What are the limitations of the Self-Strengthening approach?'
    ]
  },
  {
    id: 'fq-boxer-visual',
    unit: 'fall-of-qing',
    title: 'Visualizing the Boxer Uprising',
    type: 'secondary',
    format: 'image',
    creator: 'MIT Visualizing Cultures',
    date: '2011',
    snippet: 'A collection of Western and Chinese visual materials documenting the 1900 Boxer Rebellion — photographs, illustrations, and propaganda posters showing both sides of the conflict and the complex clash of cultures.',
    url: 'https://visualizingcultures.mit.edu/boxer_uprising/index.html',
    pieces: ['social', 'cultural'],
    mlaCitation: '"Visualizing the Boxer Uprising." MIT Visualizing Cultures, Massachusetts Institute of Technology, 2011.',
    perspective: 'Western academic — comparative visual analysis (MIT)',
    analysisPrompts: [
      'How do Western and Chinese visual sources portray the Boxers differently?',
      'What does this tell us about perspective and bias in visual sources?'
    ]
  },
  {
    id: 'fq-opium-visual',
    unit: 'fall-of-qing',
    title: 'Opium Wars Visual Narratives',
    type: 'secondary',
    format: 'image',
    creator: 'MIT Visualizing Cultures',
    date: '2010',
    snippet: 'Visual documentation of the Opium Wars through British and Chinese lenses: naval engagements, diplomatic encounters, and the burning of the Summer Palace — revealing radically different narratives of the same events.',
    url: 'https://visualizingcultures.mit.edu/opium_wars_01/index.html',
    pieces: ['political', 'cultural'],
    mlaCitation: '"Rise & Fall of the Canton Trade System." MIT Visualizing Cultures, Massachusetts Institute of Technology, 2010.',
    perspective: 'Western academic — comparative visual analysis (MIT)',
    analysisPrompts: [
      'How do British and Chinese visual sources differ in depicting the Opium Wars?',
      'What does the destruction of the Summer Palace symbolize?'
    ]
  },
  {
    id: 'fq-taiping-program',
    unit: 'fall-of-qing',
    title: 'The Taiping Economic Program',
    type: 'primary',
    format: 'text',
    creator: 'Hong Xiuquan / Taiping leadership',
    date: '~1853',
    snippet: '"All land under Heaven shall be farmed by all people under Heaven... Every person will be fed and clothed." The Taiping Heavenly Kingdom proposed radical land redistribution and gender equality — decades before Marxism reached China.',
    url: 'https://afe.easia.columbia.edu/ps/cup/taiping_economic_pgm.pdf',
    pieces: ['economic', 'social'],
    mlaCitation: '"The Taiping Economic Program." Asia for Educators, Columbia University, 2024.',
    perspective: 'Chinese revolutionary — Taiping Heavenly Kingdom ideology',
    analysisPrompts: [
      'How does the Taiping program compare to later Communist land reform?',
      'What does this reveal about social grievances in late Qing China?'
    ]
  },

  // ================================================================
  // UNIT 7 — Warlord Era
  // ================================================================
  {
    id: 'we-chen-duxiu',
    unit: 'warlord-era',
    title: 'Chen Duxiu: "Call to Youth"',
    type: 'primary',
    format: 'text',
    creator: 'Chen Duxiu',
    date: '1915',
    snippet: '"Be independent, not servile. Be progressive, not conservative. Be scientific, not superstitious. Be practical, not formalist." Chen\'s manifesto in New Youth magazine demanded China abandon Confucian tradition in favour of science and democracy.',
    url: 'https://afe.easia.columbia.edu/ps/china/chen_duxiu_final_awakening.pdf',
    pieces: ['cultural', 'political'],
    mlaCitation: '"Chen Duxiu, Call to Youth, 1915." Asia for Educators, Columbia University, 2024.',
    perspective: 'Chinese intellectual — New Culture iconoclast',
    analysisPrompts: [
      'Why does Chen Duxiu equate Confucianism with national weakness?',
      'How does this connect to the May Fourth Movement?'
    ]
  },
  {
    id: 'we-sun-yatsen',
    unit: 'warlord-era',
    title: 'Sun Yat-sen: Three Principles of the People',
    type: 'primary',
    format: 'text',
    creator: 'Sun Yat-sen',
    date: '1924',
    snippet: '"Nationalism, Democracy, People\'s Livelihood." Sun argued China needed to reclaim sovereignty from imperialism (nationalism), establish representative government (democracy), and equalize land ownership (livelihood).',
    url: 'https://afe.easia.columbia.edu/ps/cup/sun_yatsen_democracy.pdf',
    pieces: ['political', 'social'],
    mlaCitation: '"Sun Yat-sen, Three Principles of the People." Asia for Educators, Columbia University, 2024.',
    perspective: 'Chinese revolutionary — nationalist modernizer',
    analysisPrompts: [
      'How do the Three Principles blend Western and Chinese ideas?',
      'Why did both the GMD and CCP claim Sun Yat-sen\'s legacy?'
    ]
  },
  {
    id: 'we-may-fourth',
    unit: 'warlord-era',
    title: 'May Fourth Movement Manifesto',
    type: 'primary',
    format: 'text',
    creator: 'Student protesters',
    date: '1919',
    snippet: '"China\'s territory may be conquered, but it cannot be given away. The Chinese people may be massacred, but they will not surrender." Students demanded rejection of the Versailles Treaty terms giving Shandong to Japan.',
    url: 'https://afe.easia.columbia.edu/special/china_1750_mayfourth.htm',
    pieces: ['political', 'cultural'],
    mlaCitation: '"May Fourth Movement." Encyclopedia of Modern China, Charles Scribner\'s Sons, 2009.',
    perspective: 'Chinese student activism — anti-imperialist protest',
    analysisPrompts: [
      'Why was the Versailles Treaty the catalyst for the May Fourth Movement?',
      'How did May Fourth transform Chinese intellectual life?'
    ]
  },
  {
    id: 'we-new-culture',
    unit: 'warlord-era',
    title: 'Lu Xun: "A Madman\'s Diary"',
    type: 'primary',
    format: 'text',
    creator: 'Lu Xun',
    date: '1918',
    snippet: '"I opened a history book... on every page were written the words \'virtue\' and \'morality\' but between the lines I could read only two words: \'eat people.\'" Lu Xun\'s allegory attacked Confucian hierarchy as a system of oppression.',
    url: 'https://afe.easia.columbia.edu/special/china_1900_literature.htm',
    pieces: ['cultural', 'social'],
    mlaCitation: 'Lu Xun. "A Madman\'s Diary." The Real Story of Ah-Q and Other Tales of China, translated by Julia Lovell, Penguin Classics, 2009.',
    perspective: 'Chinese literary — social critique through fiction',
    analysisPrompts: [
      'What is Lu Xun\'s metaphor of "cannibalism" really about?',
      'How does this story reflect May Fourth intellectual critique?'
    ]
  },

  // ================================================================
  // UNIT 8 — Chinese Civil War & the ROC
  // ================================================================
  {
    id: 'cw-mao-hunan',
    unit: 'civil-war-roc',
    title: 'Mao Zedong: "Report on an Investigation of the Peasant Movement in Hunan"',
    type: 'primary',
    format: 'text',
    creator: 'Mao Zedong',
    date: '1927',
    snippet: '"A revolution is not a dinner party. It cannot be so refined, so leisurely and gentle, so temperate, kind, courteous, restrained, and magnanimous." Mao argued the peasantry — not the urban proletariat — would drive China\'s revolution.',
    url: 'https://www.marxists.org/reference/archive/mao/selected-works/volume-1/mswv1_2.htm',
    pieces: ['political', 'social'],
    mlaCitation: 'Mao, Zedong. "Report on an Investigation of the Peasant Movement in Hunan." Selected Works, vol. 1, Foreign Languages Press, 1965.',
    perspective: 'Chinese revolutionary — Maoist peasant-centered Marxism',
    analysisPrompts: [
      'How does Mao redefine Marxism for the Chinese context?',
      'Why does Mao see peasant violence as historically necessary?'
    ]
  },
  {
    id: 'cw-chiang-newlife',
    unit: 'civil-war-roc',
    title: 'Chiang Kai-shek: New Life Movement',
    type: 'primary',
    format: 'text',
    creator: 'Chiang Kai-shek',
    date: '1934',
    snippet: '"We must revive and exemplify the four ancient virtues: propriety, justice, integrity, and conscience." Chiang\'s campaign blended Confucian morality with militaristic discipline to modernize China on authoritarian-nationalist lines.',
    url: 'https://afe.easia.columbia.edu/ps/cup/chiang_kaishek_new_life.pdf',
    pieces: ['political', 'cultural'],
    mlaCitation: '"Chiang Kai-shek, New Life Movement." Asia for Educators, Columbia University, 2024.',
    perspective: 'Chinese nationalist — authoritarian Confucian modernism',
    analysisPrompts: [
      'How does the New Life Movement compare to May Fourth iconoclasm?',
      'Why did Chiang combine Confucianism with modern nationalism?'
    ]
  },
  {
    id: 'cw-long-march-map',
    unit: 'civil-war-roc',
    title: 'Map of the Long March (1934–1935)',
    type: 'secondary',
    format: 'map',
    creator: 'Various historians',
    date: 'Modern reconstruction',
    snippet: 'The 6,000-mile retreat from Jiangxi to Yan\'an across 18 mountain ranges, 24 rivers, and 12 provinces. Of ~100,000 who set out, fewer than 8,000 arrived. The March became the founding myth of the CCP.',
    url: 'https://afe.easia.columbia.edu/special/china_1900_mao_march.htm',
    pieces: ['political', 'environmental'],
    mlaCitation: '"Long March." Encyclopædia Britannica, 2026.',
    perspective: 'Western academic reconstruction — modern historical cartography',
    analysisPrompts: [
      'How did geography shape the route and hardships of the Long March?',
      'Why did the CCP mythologize the Long March?'
    ]
  },

  // ================================================================
  // UNIT 9 — The Mao Years
  // ================================================================
  {
    id: 'my-little-red-book',
    unit: 'mao-years',
    title: 'Quotations from Chairman Mao (Little Red Book)',
    type: 'primary',
    format: 'text',
    creator: 'Mao Zedong / Lin Biao (compiler)',
    date: '1964',
    snippet: '"Political power grows out of the barrel of a gun." "The people, and the people alone, are the motive force in the making of world history." Over 900 million copies printed — the most published book of the 20th century.',
    url: 'https://www.marxists.org/reference/archive/mao/works/red-book/',
    pieces: ['political', 'cultural'],
    mlaCitation: 'Mao, Zedong. Quotations from Chairman Mao Tse-tung. Foreign Languages Press, 1966.',
    perspective: 'Chinese state — Maoist propaganda and ideology',
    analysisPrompts: [
      'Why was the Little Red Book such a powerful tool of political control?',
      'How does Mao\'s language create a cult of personality?'
    ]
  },
  {
    id: 'my-peng-dehuai',
    unit: 'mao-years',
    title: 'Peng Dehuai\'s Letter to Mao (1959)',
    type: 'primary',
    format: 'text',
    creator: 'Peng Dehuai',
    date: '1959',
    snippet: '"Putting politics in command is no substitute for economic principles." Defense Minister Peng criticized the Great Leap Forward\'s devastating failures at the Lushan Conference — and was purged for his honesty.',
    url: 'https://afe.easia.columbia.edu/special/china_1900_mao_early.htm',
    pieces: ['political', 'economic'],
    mlaCitation: '"Peng Dehuai, Letter to Mao Zedong, 1959." Translated in Roderick MacFarquhar, The Origins of the Cultural Revolution, vol. 2, Columbia UP, 1983.',
    perspective: 'Chinese dissent — internal CCP criticism of Mao',
    analysisPrompts: [
      'Why was it dangerous to criticize Mao during the Great Leap Forward?',
      'What does Peng\'s fate reveal about political power in the PRC?'
    ]
  },
  {
    id: 'my-mao-serve-people',
    unit: 'mao-years',
    title: 'Mao Zedong: "Serve the People"',
    type: 'primary',
    format: 'text',
    creator: 'Mao Zedong',
    date: '1944',
    snippet: '"Our Communist Party and the armies under its leadership are servants of the people." A speech that became one of the "Three Constantly Read Articles" — required reading during the Cultural Revolution.',
    url: 'https://afe.easia.columbia.edu/special/china_1900_mao_speeches.htm#serve',
    pieces: ['political', 'social'],
    mlaCitation: '"Mao Zedong, Serve the People." Asia for Educators, Columbia University, 2024.',
    perspective: 'Chinese state — Maoist populist rhetoric',
    analysisPrompts: [
      'How does Mao define the relationship between the Party and the people?',
      'Compare this rhetoric to actual CCP governance during the Cultural Revolution.'
    ]
  },
  {
    id: 'my-hundred-flowers',
    unit: 'mao-years',
    title: 'Hundred Flowers Campaign Documents',
    type: 'primary',
    format: 'text',
    creator: 'Mao Zedong / various intellectuals',
    date: '1956–1957',
    snippet: '"Let a hundred flowers bloom, let a hundred schools of thought contend." Mao invited criticism — then persecuted ~550,000 intellectuals who spoke up. Was it a genuine opening or a deliberate trap?',
    url: 'https://afe.easia.columbia.edu/ps/cup/hundred_flowers.pdf',
    pieces: ['political', 'cultural'],
    mlaCitation: '"Hundred Flowers Campaign." Asia for Educators, Columbia University, 2024.',
    perspective: 'Chinese state/intellectual — regime-controlled debate',
    analysisPrompts: [
      'Was the Hundred Flowers Campaign a genuine invitation for debate or a trap?',
      'What does this episode reveal about the limits of political expression under Mao?'
    ]
  },
  {
    id: 'my-sixteen-points',
    unit: 'mao-years',
    title: 'The Sixteen Points: Decision on the Cultural Revolution',
    type: 'primary',
    format: 'text',
    creator: 'CCP Central Committee',
    date: '1966',
    snippet: '"The current Great Proletarian Cultural Revolution is a great revolution that touches people to their very souls." The official document launching the Cultural Revolution, authorizing Red Guard activities.',
    url: 'https://afe.easia.columbia.edu/ps/cup/sixteen_points.pdf',
    pieces: ['political', 'social'],
    mlaCitation: '"Decision of the Central Committee of the CCP Concerning the Great Proletarian Cultural Revolution (Sixteen Points)." Asia for Educators, Columbia University, 2024.',
    perspective: 'Chinese state — CCP Central Committee directive',
    analysisPrompts: [
      'What language in the Sixteen Points enables political violence?',
      'How does this document justify bypassing normal state institutions?'
    ]
  },
  {
    id: 'my-cr-posters',
    unit: 'mao-years',
    title: 'Cultural Revolution Propaganda Posters',
    type: 'primary',
    format: 'image',
    creator: 'Various state artists',
    date: '1966–1976',
    snippet: 'Vibrant propaganda posters depicting heroic workers, Red Guards, and Chairman Mao as a radiant sun. The visual language of revolution: bold colors, heroic poses, socialist realist style blended with Chinese folk aesthetics.',
    url: 'https://chineseposters.net/',
    pieces: ['cultural', 'political'],
    mlaCitation: '"Chinese Propaganda Posters." chineseposters.net, International Institute of Social History. Accessed 2026.',
    perspective: 'Chinese state — visual propaganda and mass mobilization',
    analysisPrompts: [
      'How do the visual elements of propaganda posters promote Mao\'s cult of personality?',
      'What techniques do the artists use to convey political messages?'
    ]
  },

  // ================================================================
  // NON-WESTERN & DIVERSE PERSPECTIVES
  // ================================================================
  {
    id: 'nw-sima-qian',
    unit: 'geography',
    title: 'Sima Qian: Records of the Grand Historian (Shiji)',
    type: 'primary',
    format: 'text',
    creator: 'Sima Qian',
    date: '~94 BCE',
    snippet: 'The foundational work of Chinese historiography. Sima Qian documented the geography, peoples, and dynasties of China from the mythical Yellow Emperor to Emperor Wu of Han — establishing the model for all subsequent Chinese dynastic histories.',
    url: 'https://afe.easia.columbia.edu/ps/cup/sima_qian_letter.pdf',
    pieces: ['cultural', 'political'],
    mlaCitation: 'Sima, Qian. Records of the Grand Historian. Translated by Burton Watson, Columbia University Press, 1993.',
    perspective: 'Chinese historiographic — foundational Han dynasty historian, court astrologer perspective',
    analysisPrompts: [
      'How does Sima Qian balance loyalty to the emperor with honest historical writing?',
      'What does his methodology reveal about Chinese approaches to history versus Western traditions?'
    ]
  },
  {
    id: 'nw-ban-zhao',
    unit: 'belief-systems',
    title: 'Ban Zhao: Lessons for Women (Nü Jie)',
    type: 'primary',
    format: 'text',
    creator: 'Ban Zhao',
    date: '~106 CE',
    snippet: '"Let a woman retire late and rise early. Let her not refuse to perform domestic duties whether easy or difficult." Ban Zhao, China\'s most famous female scholar, wrote this guide on women\'s conduct — both reinforcing and subtly subverting gender norms.',
    url: 'https://afe.easia.columbia.edu/ps/cup/banzhao_admonitions.pdf',
    pieces: ['social', 'cultural'],
    mlaCitation: 'Ban Zhao. "Lessons for Women." Translated in Nancy Lee Swann, Pan Chao: Foremost Woman Scholar of China, University of Michigan Press, 2001.',
    perspective: 'Chinese female intellectual — rare Han dynasty woman\'s voice in a patriarchal scholarly tradition',
    analysisPrompts: [
      'How does Ban Zhao navigate between advocating for women\'s education and accepting social hierarchy?',
      'What does this source reveal about women\'s roles that male-authored sources might miss?'
    ]
  },
  {
    id: 'nw-korean-veritable',
    unit: 'yuan-qing-comparative',
    title: 'Joseon Veritable Records (Joseon Wangjo Sillok): Views of the Qing',
    type: 'primary',
    format: 'text',
    creator: 'Korean court historians',
    date: '1392–1897',
    snippet: 'Korean court records reveal how the Joseon dynasty viewed the Manchu conquest of China. Many Korean officials considered themselves the true inheritors of Confucian civilization after the Ming fell to "barbarian" Manchus.',
    url: 'https://sillok.history.go.kr/main/main.do',
    pieces: ['political', 'cultural'],
    mlaCitation: '"Joseon Wangjo Sillok." National Institute of Korean History. Accessed 2026.',
    perspective: 'Korean tributary state — Joseon viewing China as cultural center while asserting Korean civilizational continuity',
    analysisPrompts: [
      'How did Korean scholars view the Manchu conquest differently from Chinese subjects?',
      'What does the concept of "Little China" (Sojunghwa) reveal about Korean-Chinese cultural relations?'
    ]
  },
  {
    id: 'nw-ibn-battuta',
    unit: 'tang-silk-roads',
    title: 'Ibn Battuta: Travels in Yuan China',
    type: 'primary',
    format: 'text',
    creator: 'Ibn Battuta',
    date: '~1345 CE',
    snippet: '"China is the safest and most agreeable country in the world for a traveler. A man may go by himself on a nine months\' journey carrying a fortune and have nothing to fear." The Moroccan traveler offers an Islamic-world perspective on Yuan China.',
    url: 'https://afe.easia.columbia.edu/tps/topics/trade/',
    pieces: ['economic', 'cultural'],
    mlaCitation: 'Ibn Battuta. The Travels of Ibn Battuta. Translated by H.A.R. Gibb, Cambridge University Press, 1994.',
    perspective: 'Islamic traveler — North African Muslim observing Yuan China through a comparative Islamic lens',
    analysisPrompts: [
      'How does Ibn Battuta\'s account of China differ from Marco Polo\'s? What might explain the differences?',
      'What aspects of Chinese society does Ibn Battuta find admirable or surprising from an Islamic perspective?'
    ]
  },
  {
    id: 'nw-zheng-he-inscription',
    unit: 'ming-voyages',
    title: 'Zheng He\'s Changle Inscription (Tianfei Stele)',
    type: 'primary',
    format: 'text',
    creator: 'Zheng He',
    date: '1431',
    snippet: '"We have traversed more than 100,000 li of immense water spaces and have beheld in the ocean huge waves like mountains rising in the sky." Zheng He\'s own inscription at a temple in Fujian, recording seven voyages across the Indian Ocean.',
    url: 'https://afe.easia.columbia.edu/special/china_1000ce_mingvoyages.htm',
    pieces: ['innovation', 'political'],
    mlaCitation: '"Zheng He\'s Changle Inscription." Translated in Edward Dreyer, Zheng He: China and the Oceans in the Early Ming, Pearson Longman, 2007.',
    perspective: 'Chinese Muslim naval commander — Hui minority perspective from within the Ming imperial system',
    analysisPrompts: [
      'What does this inscription reveal about Zheng He\'s self-understanding as both a Muslim and a Ming official?',
      'How does hearing from Zheng He directly change our understanding of the voyages compared to secondary accounts?'
    ]
  },
  {
    id: 'nw-vietnamese-resistance',
    unit: 'ming-voyages',
    title: 'Nguyễn Trãi: Great Proclamation on the Pacification of the Wu',
    type: 'primary',
    format: 'text',
    creator: 'Nguyễn Trãi',
    date: '1428',
    snippet: '"Our people long ago established Vietnam as an independent nation... We have our own mountains and rivers, our own customs and traditions." Vietnam\'s declaration of independence after defeating Ming China\'s 20-year occupation.',
    url: 'https://afe.easia.columbia.edu/tps/topics/nation/',
    pieces: ['political', 'cultural'],
    mlaCitation: 'Nguyễn Trãi. "Bình Ngô đại cáo." Translated by Alexander Woodside in Vietnam and the Chinese Model, Harvard University Press, 1988.',
    perspective: 'Vietnamese anti-colonial — asserting national identity against Chinese imperial domination',
    analysisPrompts: [
      'How does this document challenge the idea of a unified "Sinosphere" welcome throughout East Asia?',
      'Compare this Vietnamese perspective to how Ming sources describe the occupation of Vietnam.'
    ]
  },
  {
    id: 'nw-japanese-opium',
    unit: 'fall-of-qing',
    title: 'Sakuma Shōzan: Reflections on the Opium War',
    type: 'primary',
    format: 'text',
    creator: 'Sakuma Shōzan',
    date: '~1842',
    snippet: '"China\'s defeats should serve as a mirror for Japan. We must study Western military science while preserving our Eastern spirit." Japanese intellectuals watched China\'s humiliation and drew urgent lessons about modernization.',
    url: 'https://afe.easia.columbia.edu/at/sakuma/sakuma01.html',
    pieces: ['political', 'innovation'],
    mlaCitation: '"Sakuma Shōzan on the Opium War." Asia for Educators, Columbia University, 2024.',
    perspective: 'Japanese intellectual — observing Chinese failure to prepare Japan\'s own modernization strategy',
    analysisPrompts: [
      'How did Japan\'s response to the Opium Wars differ from China\'s Self-Strengthening Movement?',
      'What does it mean when one Asian power watches another\'s defeat by Western imperialism?'
    ]
  },
  {
    id: 'nw-liang-qichao',
    unit: 'warlord-era',
    title: 'Liang Qichao: On the New Citizen',
    type: 'primary',
    format: 'text',
    creator: 'Liang Qichao',
    date: '1902',
    snippet: '"If we wish to make our nation strong, we cannot not seek to empower our people... The character of a nation is determined by the character of its citizens." Liang argued China needed to transform subjects into citizens.',
    url: 'https://afe.easia.columbia.edu/ps/liang_qichao_renewing_people.pdf',
    pieces: ['political', 'social'],
    mlaCitation: 'Liang, Qichao. "On the New Citizen." Asia for Educators, Columbia University, 2024.',
    perspective: 'Chinese reformist — constitutional monarchist seeking a middle path between tradition and revolution',
    analysisPrompts: [
      'How does Liang Qichao\'s vision differ from both Sun Yat-sen\'s revolution and the Qing status quo?',
      'What does the concept of "citizen" mean in a society that only knew "subjects"?'
    ]
  },
  {
    id: 'nw-qiu-jin',
    unit: 'fall-of-qing',
    title: 'Qiu Jin: Address to Two Hundred Million Fellow Countrywomen',
    type: 'primary',
    format: 'text',
    creator: 'Qiu Jin',
    date: '1904',
    snippet: '"Alas, the China of today—loss after loss! You also bear responsibility for China. How could you say it has nothing to do with you?" Qiu Jin, feminist revolutionary, linked women\'s liberation to national salvation.',
    url: 'https://afe.easia.columbia.edu/special/china_1900_women.htm',
    pieces: ['social', 'political'],
    mlaCitation: '"Qiu Jin, Address to Two Hundred Million Fellow Countrywomen." Asia for Educators, Columbia University, 2024.',
    perspective: 'Chinese feminist revolutionary — women\'s liberation tied to anti-Qing nationalism',
    analysisPrompts: [
      'How does Qiu Jin connect women\'s oppression to China\'s national weakness?',
      'Compare Qiu Jin\'s feminism to Ban Zhao\'s "Lessons for Women" — what changed in 1,800 years?'
    ]
  },
  {
    id: 'nw-ding-ling',
    unit: 'mao-years',
    title: 'Ding Ling: "Thoughts on March 8" (International Women\'s Day)',
    type: 'primary',
    format: 'text',
    creator: 'Ding Ling',
    date: '1942',
    snippet: '"Women in Yan\'an are still being subjected to the same old prejudices... When will we stop this malicious gossip?" A feminist writer in the Communist base area dared to criticize gender inequality within the revolutionary movement itself.',
    url: 'https://afe.easia.columbia.edu/special/china_1900_women.htm',
    pieces: ['social', 'cultural'],
    mlaCitation: 'Ding Ling. "Thoughts on March 8." Translated in Tani Barlow, I Myself Am a Woman, Beacon Press, 1989.',
    perspective: 'Chinese feminist within the CCP — internal critique of revolutionary gender politics',
    analysisPrompts: [
      'Why was it dangerous for Ding Ling to criticize gender inequality within the CCP?',
      'What does this source reveal about the gap between revolutionary rhetoric and reality?'
    ]
  },
  {
    id: 'nw-tibetan-perspective',
    unit: 'yuan-qing-comparative',
    title: 'Dpal \'byor bzang po: Tibetan Account of Mongol-Tibet Relations',
    type: 'primary',
    format: 'text',
    creator: 'Tibetan Buddhist historians',
    date: '14th–15th century',
    snippet: 'Tibetan sources describe the "priest-patron" (yon-mchod) relationship with Mongol khans — where Tibet received military protection in exchange for spiritual guidance. This challenges Chinese claims of unbroken sovereignty over Tibet.',
    url: 'https://afe.easia.columbia.edu/tps/topics/tibet/',
    pieces: ['political', 'cultural'],
    mlaCitation: '"Tibetan Historiography of Mongol Relations." Translated in Elliot Sperling, The Tibet-China Conflict, East-West Center, 2004.',
    perspective: 'Tibetan Buddhist — framing Mongol-Tibet relations as spiritual partnership, not subjugation',
    analysisPrompts: [
      'How does the Tibetan "priest-patron" framing differ from the Chinese "sovereignty" narrative?',
      'Why do two cultures remember the same relationship so differently?'
    ]
  },
  {
    id: 'nw-manchu-altantogos',
    unit: 'yuan-qing-comparative',
    title: 'Manchu Origin Narrative: The Aisin Gioro Clan History',
    type: 'primary',
    format: 'text',
    creator: 'Qing imperial historians',
    date: '~1635',
    snippet: 'The Manchu origin story tells of a heavenly maiden who ate a magical fruit by a sacred lake — conceiving the ancestor of the Aisin Gioro clan. This mythology established the Manchus as divinely chosen rulers, distinct from both Mongol and Han traditions.',
    url: 'https://afe.easia.columbia.edu/ps/cup/qing_sacred_edict.pdf',
    pieces: ['cultural', 'political'],
    mlaCitation: 'Crossley, Pamela Kyle. A Translucent Mirror: History and Identity in Qing Imperial Ideology. University of California Press, 1999.',
    perspective: 'Manchu ruling elite — asserting distinct Manchu identity and divine right separate from Han Chinese civilization',
    analysisPrompts: [
      'How does the Manchu origin story serve political purposes for the Qing dynasty?',
      'Why was it important for the Manchus to maintain a separate identity while ruling a mostly Han population?'
    ]
  },
  {
    id: 'nw-zheng-guanying',
    unit: 'fall-of-qing',
    title: 'Zheng Guanying: Words of Warning to a Prosperous Age (Shengshi Weiyan)',
    type: 'primary',
    format: 'text',
    creator: 'Zheng Guanying',
    date: '1893',
    snippet: '"Commercial war is fiercer than military war. If we cannot compete in commerce, we will lose our sovereignty as surely as if we lost a battle." A Chinese merchant-reformer argued that economic modernization — not just military reform — was essential for survival.',
    url: 'https://afe.easia.columbia.edu/special/china_1750_reform.htm',
    pieces: ['economic', 'innovation'],
    mlaCitation: 'Zheng, Guanying. Shengshi Weiyan. Excerpts translated in Ssu-yu Teng and John King Fairbank, China\'s Response to the West, Harvard UP, 1979.',
    perspective: 'Chinese merchant-intellectual — commercial class view of modernization, challenging scholar-official monopoly on reform',
    analysisPrompts: [
      'How does Zheng Guanying\'s "commercial war" concept differ from the military-focused Self-Strengthening Movement?',
      'What does it mean when a merchant — not a scholar — proposes national policy?'
    ]
  },
  {
    id: 'nw-xiang-jingyu',
    unit: 'warlord-era',
    title: 'Xiang Jingyu: Women\'s Liberation and Social Transformation',
    type: 'primary',
    format: 'text',
    creator: 'Xiang Jingyu',
    date: '1923',
    snippet: '"Women\'s liberation cannot be separated from class liberation. Women workers and peasants suffer double oppression — as women and as the exploited class." Xiang Jingyu, first head of the CCP Women\'s Bureau, linked feminism to Marxist revolution.',
    url: 'https://afe.easia.columbia.edu/special/china_1900_women.htm',
    pieces: ['social', 'political'],
    mlaCitation: '"Xiang Jingyu on Women\'s Liberation." Translated in Elisabeth Croll, Feminism and Socialism in China, Routledge, 1978.',
    perspective: 'Chinese Marxist feminist — early CCP woman leader linking gender and class analysis',
    analysisPrompts: [
      'How does Xiang Jingyu\'s Marxist feminism differ from Qiu Jin\'s nationalist feminism?',
      'Why might Communist ideology appeal to women seeking liberation in early 20th-century China?'
    ]
  },
  {
    id: 'nw-korean-war-chinese',
    unit: 'mao-years',
    title: 'Chinese People\'s Volunteer Army: Korean War Letters Home',
    type: 'primary',
    format: 'text',
    creator: 'Chinese soldiers',
    date: '1950–1953',
    snippet: '"We are fighting to protect our homeland. The Americans are at our doorstep." Letters from Chinese soldiers in Korea reveal the human cost of the war and how the CCP framed it as defensive — "Resist America, Aid Korea."',
    url: 'https://afe.easia.columbia.edu/special/china_1950_korean.htm',
    pieces: ['political', 'social'],
    mlaCitation: '"Chinese Soldiers\' Letters from Korea." Translated in Xiaobing Li, A History of the Modern Chinese Army, UP of Kentucky, 2007.',
    perspective: 'Chinese common soldier — ground-level experience of Mao-era military mobilization',
    analysisPrompts: [
      'How does the soldiers\' perspective differ from official CCP narratives about the Korean War?',
      'What does "Resist America, Aid Korea" reveal about how the PRC understood its role in the Cold War?'
    ]
  },
  {
    id: 'nw-japanese-21-demands',
    unit: 'warlord-era',
    title: 'Japan\'s Twenty-One Demands (1915)',
    type: 'primary',
    format: 'text',
    creator: 'Japanese Foreign Ministry',
    date: '1915',
    snippet: '"The Chinese Government shall employ influential Japanese advisors... Japan shall have the right to build railways in central China." Japan presented secret demands that would have reduced China to a virtual protectorate — sparking Chinese nationalist outrage.',
    url: 'https://afe.easia.columbia.edu/special/china_1750_21demands.htm',
    pieces: ['political', 'economic'],
    mlaCitation: '"Japan\'s Twenty-One Demands." Asia for Educators, Columbia University, 2024.',
    perspective: 'Japanese imperial — expansionist demands reflecting Japan\'s ambition to dominate East Asia',
    analysisPrompts: [
      'How do the Twenty-One Demands reveal the power dynamics between Asian nations, not just East-West conflict?',
      'Why is intra-Asian imperialism often overlooked in narratives of Chinese history?'
    ]
  },
  {
    id: 'nw-peasant-songs',
    unit: 'civil-war-roc',
    title: 'Peasant Folk Songs of the Land Reform Movement',
    type: 'primary',
    format: 'text',
    creator: 'Anonymous rural communities',
    date: '1946–1950',
    snippet: '"The sun has risen, the sky is bright / Chairman Mao leads us to turn over." Folk songs from the land reform era capture the voices of illiterate peasants — the vast majority of China\'s population — whose stories rarely enter written history.',
    url: 'https://afe.easia.columbia.edu/special/china_1950_land_reform.htm',
    pieces: ['social', 'cultural'],
    mlaCitation: '"Land Reform Folk Songs." Translated in Jack Belden, China Shakes the World, Monthly Review Press, 1970.',
    perspective: 'Chinese rural subaltern — illiterate peasant voices preserved through oral tradition, representing the 85% of China rarely heard in elite sources',
    analysisPrompts: [
      'How do peasant folk songs provide evidence that written sources cannot?',
      'What are the limitations of using folk songs as historical evidence?'
    ]
  },
  {
    id: 'nw-sent-down-youth',
    unit: 'mao-years',
    title: 'Sent-Down Youth Memoirs: Voices from the Cultural Revolution',
    type: 'primary',
    format: 'text',
    creator: 'Various memoir authors',
    date: '1966–1976 (published later)',
    snippet: '"We were told we were going to learn from the peasants. But the peasants didn\'t want us, and we didn\'t know how to farm." Memoirs from the 17 million urban youth sent to the countryside during the Cultural Revolution.',
    url: 'https://afe.easia.columbia.edu/special/china_1950_cultural.htm',
    pieces: ['social', 'cultural'],
    mlaCitation: 'Various. "Sent-Down Youth Memoirs." Excerpted in Feng Jicai, Ten Years of Madness, China Books, 1996.',
    perspective: 'Chinese urban youth — victims and participants in the Cultural Revolution, challenging both heroic and purely victim narratives',
    analysisPrompts: [
      'How do personal memoirs of the Cultural Revolution complicate the official narrative?',
      'Why did many former Red Guards only share their stories decades later?'
    ]
  }
];

// Make available globally and as module
if (typeof window !== 'undefined') window.AHSAS_SOURCES = AHSAS_SOURCES;
if (typeof module !== 'undefined') module.exports = AHSAS_SOURCES;
