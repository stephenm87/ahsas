/**
 * AHSAS Curriculum Data
 * Shared data scaffold for Timeline, Comparative Analysis, and future tools.
 * 10 course units covering Chinese history from Geography to Modern Era.
 */

const AHSAS_CURRICULUM = {
  units: [
    {
      id: 'geography',
      number: 1,
      title: 'Chinese Geography',
      period: 'Foundation',
      dateRange: null,
      color: '#5fa8e8',
      icon: '🗺️',
      description: 'The geographic foundations that shaped Chinese civilization: rivers, mountains, deserts, and the relationship between terrain and cultural development.',
      keyEvents: [
        { date: null, title: 'Yellow River (Huang He) Civilization', pieces: ['environmental', 'social'], description: 'The cradle of Chinese civilization; fertile loess soil enabled early agriculture but devastating floods earned it the name "China\'s Sorrow."' },
        { date: null, title: 'Yangtze River Basin Development', pieces: ['environmental', 'economic'], description: 'Southern China\'s rice-growing heartland; the Yangtze became a key economic artery and cultural dividing line between north and south.' },
        { date: null, title: 'The Great Wall Frontier', pieces: ['political', 'environmental'], description: 'The steppe-sown divide: how geography created a persistent frontier between settled agricultural Chinese and nomadic pastoral peoples.' },
        { date: null, title: 'Silk Road Geography', pieces: ['economic', 'environmental'], description: 'Deserts (Taklamakan, Gobi), mountain passes (Jade Gate), and oasis towns that defined overland trade routes connecting China to Central Asia and beyond.' },
        { date: null, title: 'Maritime Geography', pieces: ['economic', 'environmental'], description: 'China\'s long coastline, monsoon winds, and key ports (Guangzhou, Quanzhou) that facilitated maritime trade networks.' }
      ],
      keyFigures: [],
      keyConcepts: ['Huang He vs. Yangtze', 'Loess Plateau', 'Steppe-sown divide', 'Mandate of Heaven (geographic legitimacy)', 'Tributary system geography', 'Monsoon agriculture']
    },
    {
      id: 'belief-systems',
      number: 2,
      title: 'Belief Systems',
      period: 'Classical',
      dateRange: '~600 BCE – 200 CE',
      color: '#a855f7',
      icon: '☯️',
      description: 'The philosophical and religious foundations of Chinese civilization: Confucianism, Daoism, Legalism, and the arrival of Buddhism.',
      keyEvents: [
        { date: -551, title: 'Birth of Confucius', pieces: ['cultural', 'political'], description: 'Kong Qiu (551–479 BCE) developed a philosophy centered on ren (benevolence), li (ritual propriety), and filial piety that became the bedrock of Chinese governance and social order.' },
        { date: -500, title: 'Laozi & Daoism', pieces: ['cultural', 'social'], description: 'The Dao De Jing introduced concepts of wu wei (non-action), harmony with nature, and the cosmic balance of yin and yang.' },
        { date: -400, title: 'Legalism Emerges', pieces: ['political', 'cultural'], description: 'Han Feizi and Shang Yang argued for strict laws, centralized power, and rewards/punishments as the basis of governance — adopted by the Qin dynasty.' },
        { date: -221, title: 'Qin Unification & Legalist State', pieces: ['political', 'cultural'], description: 'Qin Shi Huang unified China under Legalist principles: standardized weights, measures, writing, and ruthlessly suppressed dissent.' },
        { date: 67, title: 'Buddhism Arrives in China', pieces: ['cultural', 'social'], description: 'Buddhism entered China via the Silk Road during the Han dynasty, eventually blending with Chinese culture to form Chan (Zen) Buddhism.' },
        { date: -372, title: 'Mencius Develops Confucianism', pieces: ['cultural', 'political'], description: 'Mengzi (372–289 BCE) expanded Confucianism with the idea that human nature is inherently good and that rulers must govern through moral example.' }
      ],
      keyFigures: ['Confucius (Kong Qiu)', 'Laozi', 'Mencius (Mengzi)', 'Han Feizi', 'Shang Yang', 'Zhuangzi', 'Mozi'],
      keyConcepts: ['Ren (benevolence)', 'Li (ritual)', 'Filial piety', 'Mandate of Heaven', 'Wu wei', 'Yin-yang', 'Legalism vs. Confucianism', 'Five Relationships']
    },
    {
      id: 'tang-silk-roads',
      number: 3,
      title: 'Tang Dynasty & Silk Roads',
      period: '618–907 CE',
      dateRange: '618–907 CE',
      color: '#f59e0b',
      icon: '🐫',
      description: 'The Tang golden age: cosmopolitan empire, Silk Road trade networks, cultural exchange, and the height of Chinese classical civilization.',
      keyEvents: [
        { date: 618, title: 'Tang Dynasty Founded', pieces: ['political'], description: 'Li Yuan (Emperor Gaozu) overthrew the Sui dynasty and established the Tang, which would become one of China\'s most glorious periods.' },
        { date: 626, title: 'Emperor Taizong Takes Power', pieces: ['political', 'cultural'], description: 'Li Shimin became one of China\'s greatest emperors, expanding the empire, reforming government, and promoting cultural flourishing.' },
        { date: 690, title: 'Empress Wu Zetian Rules', pieces: ['political', 'social'], description: 'The only woman to officially rule as emperor of China, she expanded the merit-based civil service exams and patronized Buddhism.' },
        { date: 700, title: 'Silk Road at Peak Activity', pieces: ['economic', 'cultural'], description: 'Tang China was the eastern terminus of the Silk Road; Chang\'an (Xi\'an) became the world\'s largest and most cosmopolitan city with ~1 million residents.' },
        { date: 751, title: 'Battle of Talas', pieces: ['political', 'innovation'], description: 'Arab-Tang clash in Central Asia; Chinese papermakers captured, leading to the spread of papermaking technology westward.' },
        { date: 755, title: 'An Lushan Rebellion', pieces: ['political', 'social'], description: 'Devastating eight-year rebellion that killed ~36 million people (two-thirds of the empire\'s population), permanently weakening the Tang.' },
        { date: 868, title: 'Diamond Sutra Printed', pieces: ['innovation', 'cultural'], description: 'The world\'s oldest dated printed book, demonstrating Tang mastery of woodblock printing technology.' },
        { date: 907, title: 'Fall of the Tang Dynasty', pieces: ['political'], description: 'Internal rebellions, eunuch power, and regional warlords led to the dynasty\'s collapse, ushering in the Five Dynasties period.' }
      ],
      keyFigures: ['Emperor Taizong', 'Empress Wu Zetian', 'Li Bai (poet)', 'Du Fu (poet)', 'Xuanzang (monk)', 'An Lushan', 'Emperor Xuanzong'],
      keyConcepts: ['Silk Road trade', 'Cosmopolitan empire', 'Civil service exams', 'Chang\'an as world capital', 'Tang poetry', 'Woodblock printing', 'Buddhism patronage', 'Equal-field system']
    },
    {
      id: 'ming-voyages',
      number: 4,
      title: 'Ming Dynasty & Sea Voyages',
      period: '1368–1644 CE',
      dateRange: '1368–1644 CE',
      color: '#2d8a6e',
      icon: '⛵',
      description: 'The Ming restoration of Han Chinese rule, Zheng He\'s maritime expeditions, and the eventual turn inward.',
      keyEvents: [
        { date: 1368, title: 'Ming Dynasty Founded', pieces: ['political'], description: 'Zhu Yuanzhang, a peasant rebel, expelled the Mongol Yuan dynasty and established the Ming ("Brilliant") dynasty, restoring Han Chinese rule.' },
        { date: 1382, title: 'Hongwu Reforms', pieces: ['political', 'economic'], description: 'Emperor Hongwu rebuilt the agricultural economy, reformed land taxes, established the lijia system, and centralized imperial power.' },
        { date: 1405, title: 'Zheng He\'s First Voyage', pieces: ['economic', 'innovation'], description: 'Admiral Zheng He commanded a massive treasure fleet of 300+ ships and 27,000 crew, sailing to Southeast Asia, India, and East Africa.' },
        { date: 1421, title: 'Capital Moved to Beijing', pieces: ['political'], description: 'Emperor Yongle moved the capital from Nanjing to Beijing and built the Forbidden City, shifting power northward.' },
        { date: 1433, title: 'End of Maritime Voyages', pieces: ['political', 'economic'], description: 'After seven voyages, the Ming court halted maritime expeditions and imposed the haijin (sea ban), turning China inward.' },
        { date: 1449, title: 'Tumu Crisis', pieces: ['political'], description: 'The Zhengtong Emperor was captured by Mongol Oirats, exposing Ming military weakness and triggering defensive reorientation.' },
        { date: 1557, title: 'Portuguese at Macau', pieces: ['economic', 'cultural'], description: 'Portugal established a trading post at Macau, beginning direct European-Chinese maritime trade.' },
        { date: 1592, title: 'Wanli Emperor vs. Japan', pieces: ['political'], description: 'Ming China intervened in Korea against Toyotomi Hideyoshi\'s Japanese invasion, draining the treasury and weakening the dynasty.' },
        { date: 1644, title: 'Fall of the Ming', pieces: ['political', 'social'], description: 'Li Zicheng\'s rebellion captured Beijing; the last Ming emperor hanged himself. The Manchu Qing dynasty swept in from the north.' }
      ],
      keyFigures: ['Zhu Yuanzhang (Hongwu)', 'Emperor Yongle', 'Zheng He', 'Wang Yangming (philosopher)', 'Li Zicheng (rebel)'],
      keyConcepts: ['Treasure Fleet', 'Haijin (sea ban)', 'Forbidden City', 'Neo-Confucianism', 'Tributary system', 'Silver trade', 'Great Wall reconstruction', 'Inward turn debate']
    },
    {
      id: 'yuan-qing-comparative',
      number: 5,
      title: 'Yuan & Qing Comparative Dynasty',
      period: '1271–1912 CE',
      dateRange: '1271–1368 / 1644–1912 CE',
      color: '#c73e3a',
      icon: '⚖️',
      description: 'Comparing two conquest dynasties: how the Mongol Yuan and Manchu Qing each governed China as non-Han rulers, and why one lasted 97 years vs. 268.',
      keyEvents: [
        { date: 1271, title: 'Yuan Dynasty Established', pieces: ['political'], description: 'Kublai Khan declared the Yuan ("Origin") dynasty, making it the first non-Han dynasty to rule all of China.' },
        { date: 1275, title: 'Marco Polo Visits China', pieces: ['cultural', 'economic'], description: 'The Venetian traveler documented Yuan China\'s wealth, size, and sophistication, astonishing European readers.' },
        { date: 1279, title: 'Song Dynasty Falls to Mongols', pieces: ['political'], description: 'The final Southern Song resistance collapsed at the Battle of Yamen, completing Mongol conquest of China.' },
        { date: 1351, title: 'Red Turban Rebellion', pieces: ['political', 'social'], description: 'Han Chinese peasant revolts erupted against Yuan rule, driven by flooding, plague, and resentment of Mongol privilege.' },
        { date: 1644, title: 'Qing Dynasty Established', pieces: ['political'], description: 'The Manchu Qing entered Beijing, beginning the last imperial dynasty. They would rule for 268 years.' },
        { date: 1661, title: 'Kangxi Emperor Begins Reign', pieces: ['political', 'cultural'], description: 'Kangxi ruled for 61 years (longest in Chinese history), consolidating Qing power, patronizing Chinese culture, and expanding the empire.' },
        { date: 1735, title: 'Qianlong Emperor Begins Reign', pieces: ['political', 'economic'], description: 'Qianlong presided over the Qing\'s golden age and greatest territorial extent, but his later years saw corruption and decline.' },
        { date: 1793, title: 'Macartney Mission', pieces: ['political', 'economic'], description: 'Britain\'s embassy to Qianlong was rebuffed with the famous letter: "We possess all things... we have no use for your country\'s manufactures."' }
      ],
      keyFigures: ['Kublai Khan', 'Marco Polo', 'Kangxi Emperor', 'Qianlong Emperor', 'Nurhaci (Manchu founder)', 'Zhu Yuanzhang'],
      keyConcepts: ['Conquest dynasty governance', 'Sinicization vs. cultural preservation', 'Queue order', 'Banner system', 'Four-class system (Yuan)', 'Tributary system', 'Queue order enforcement', 'Manchu-Han dual administration']
    },
    {
      id: 'fall-of-qing',
      number: 6,
      title: 'Fall of the Qing',
      period: '1839–1912 CE',
      dateRange: '1839–1912 CE',
      color: '#ef4444',
      icon: '🔥',
      description: 'The Century of Humiliation: Opium Wars, unequal treaties, rebellions, and failed reforms that led to dynastic collapse.',
      keyEvents: [
        { date: 1839, title: 'First Opium War Begins', pieces: ['political', 'economic'], description: 'Commissioner Lin Zexu destroyed British opium stockpiles at Guangzhou, triggering war with Britain.' },
        { date: 1842, title: 'Treaty of Nanjing', pieces: ['political', 'economic'], description: 'China\'s first "unequal treaty": ceded Hong Kong, opened five treaty ports, paid indemnity, and granted most-favored-nation status.' },
        { date: 1850, title: 'Taiping Rebellion Begins', pieces: ['social', 'political'], description: 'Hong Xiuquan led a massive Christian-inspired rebellion that controlled much of southern China and killed 20–30 million people.' },
        { date: 1856, title: 'Second Opium War', pieces: ['political', 'economic'], description: 'Anglo-French forces burned the Summer Palace (Yuanmingyuan) and forced further concessions, including opium legalization.' },
        { date: 1861, title: 'Self-Strengthening Movement', pieces: ['innovation', 'political'], description: '"Chinese learning for essence, Western learning for application" — Qing officials attempted to adopt Western military technology while preserving Confucian values.' },
        { date: 1895, title: 'Sino-Japanese War Defeat', pieces: ['political'], description: 'Japan crushed the Qing military, taking Taiwan and revealing that Self-Strengthening had failed. Triggered reform urgency.' },
        { date: 1898, title: 'Hundred Days Reform', pieces: ['political', 'innovation'], description: 'Emperor Guangxu attempted radical modernization reforms, but Empress Dowager Cixi staged a coup and placed him under house arrest.' },
        { date: 1900, title: 'Boxer Rebellion', pieces: ['social', 'political'], description: 'The "Righteous Harmony Fists" attacked foreigners and Chinese Christians; an eight-nation alliance intervened, further humiliating the Qing.' },
        { date: 1905, title: 'Civil Service Exams Abolished', pieces: ['political', 'cultural'], description: 'After 1,300 years, the Confucian exam system was ended — removing a key pillar of the imperial order.' },
        { date: 1911, title: 'Wuchang Uprising', pieces: ['political'], description: 'Military mutiny in Wuchang triggered a chain reaction; provinces declared independence from Qing rule.' },
        { date: 1912, title: 'Abdication of Puyi', pieces: ['political'], description: 'The child emperor Puyi abdicated on February 12, ending 2,000+ years of imperial rule in China.' }
      ],
      keyFigures: ['Lin Zexu', 'Hong Xiuquan', 'Empress Dowager Cixi', 'Emperor Guangxu', 'Li Hongzhang', 'Zeng Guofan', 'Kang Youwei', 'Sun Yat-sen'],
      keyConcepts: ['Century of Humiliation', 'Unequal treaties', 'Treaty ports', 'Extraterritoriality', 'Self-Strengthening', 'Taiping ideology', 'Hundred Days Reform', 'New Army']
    },
    {
      id: 'warlord-era',
      number: 7,
      title: 'Warlord Era in China',
      period: '1916–1928 CE',
      dateRange: '1916–1928 CE',
      color: '#78716c',
      icon: '⚔️',
      description: 'China fragments after Yuan Shikai\'s death: regional warlords, intellectual ferment of the May Fourth Movement, and the birth of the CCP.',
      keyEvents: [
        { date: 1912, title: 'Republic of China Proclaimed', pieces: ['political'], description: 'Sun Yat-sen briefly served as provisional president before yielding to Yuan Shikai, who commanded military power.' },
        { date: 1915, title: 'Yuan Shikai Declares Himself Emperor', pieces: ['political'], description: 'Yuan\'s attempt to restore monarchy triggered rebellion and international condemnation; he died in 1916, leaving a power vacuum.' },
        { date: 1916, title: 'Warlord Era Begins', pieces: ['political', 'social'], description: 'China fragmented into competing military fiefdoms, each controlled by a regional strongman with private armies.' },
        { date: 1919, title: 'May Fourth Movement', pieces: ['cultural', 'political'], description: 'Students protested the Treaty of Versailles giving German concessions in Shandong to Japan, sparking a broader cultural and political awakening.' },
        { date: 1921, title: 'Chinese Communist Party Founded', pieces: ['political'], description: 'Mao Zedong and 12 other delegates established the CCP in Shanghai, initially with Comintern support.' },
        { date: 1923, title: 'First United Front', pieces: ['political'], description: 'The GMD (Nationalists) and CCP formed an alliance against warlords, with Soviet advisors reorganizing both parties.' },
        { date: 1925, title: 'Sun Yat-sen Dies', pieces: ['political'], description: 'The father of the Republic died, leaving a leadership vacuum. Chiang Kai-shek emerged as his successor in the GMD.' },
        { date: 1926, title: 'Northern Expedition Begins', pieces: ['political'], description: 'GMD-CCP forces under Chiang Kai-shek marched north to defeat warlords and reunify China.' },
        { date: 1927, title: 'Shanghai Massacre', pieces: ['political', 'social'], description: 'Chiang Kai-shek violently purged communists and labor unionists in Shanghai, shattering the First United Front.' },
        { date: 1928, title: 'Nominal Reunification', pieces: ['political'], description: 'The Northern Expedition captured Beijing; China was nominally reunified under the GMD, though warlords persisted.' }
      ],
      keyFigures: ['Yuan Shikai', 'Sun Yat-sen', 'Chiang Kai-shek', 'Chen Duxiu', 'Li Dazhao', 'Mao Zedong (early)', 'Feng Yuxiang', 'Zhang Zuolin'],
      keyConcepts: ['Three Principles of the People', 'May Fourth Movement', 'New Culture Movement', 'Warlordism', 'First United Front', 'Northern Expedition', 'White Terror', 'Vernacular Chinese movement']
    },
    {
      id: 'civil-war-roc',
      number: 8,
      title: 'Chinese Civil War & the ROC',
      period: '1927–1949 CE',
      dateRange: '1927–1949 CE',
      color: '#0ea5e9',
      icon: '🏴',
      description: 'The struggle between Nationalists and Communists, interrupted by Japanese invasion, culminating in Communist victory and the retreat to Taiwan.',
      keyEvents: [
        { date: 1927, title: 'Civil War Begins', pieces: ['political'], description: 'After the Shanghai Massacre, the CCP retreated to rural areas and began building peasant-based soviets.' },
        { date: 1931, title: 'Jiangxi Soviet Established', pieces: ['political', 'social'], description: 'Mao established a rural communist base in Jiangxi province, implementing land reform and guerrilla warfare tactics.' },
        { date: 1934, title: 'The Long March Begins', pieces: ['political'], description: '~100,000 CCP troops broke through GMD encirclement and marched 6,000+ miles to Yan\'an; only ~8,000 survived. Mao emerged as undisputed leader.' },
        { date: 1936, title: 'Xi\'an Incident', pieces: ['political'], description: 'Chiang Kai-shek was kidnapped by Zhang Xueliang and forced to agree to a Second United Front against Japan.' },
        { date: 1937, title: 'Second Sino-Japanese War', pieces: ['political'], description: 'Full-scale Japanese invasion of China; Nanjing Massacre (300,000+ killed), forcing GMD to retreat to Chongqing.' },
        { date: 1945, title: 'Japan Surrenders', pieces: ['political'], description: 'WWII ended but civil war resumed immediately as GMD and CCP raced to control Japanese-occupied territories.' },
        { date: 1946, title: 'Full Civil War Resumes', pieces: ['political', 'economic'], description: 'US mediation failed; the GMD held cities but suffered hyperinflation and corruption while the CCP mobilized rural support.' },
        { date: 1948, title: 'Three Great Campaigns', pieces: ['political'], description: 'The CCP won decisive battles at Liaoshen, Huaihai, and Pingjin, destroying the GMD\'s best armies.' },
        { date: 1949, title: 'People\'s Republic of China Founded', pieces: ['political'], description: 'On October 1, Mao proclaimed the PRC from Tiananmen. The GMD retreated to Taiwan with the Republic of China government.' }
      ],
      keyFigures: ['Mao Zedong', 'Chiang Kai-shek', 'Zhou Enlai', 'Zhu De', 'Zhang Xueliang', 'Song Meiling', 'George Marshall'],
      keyConcepts: ['People\'s War', 'Long March mythology', 'Yan\'an Way', 'Land reform', 'United Front tactics', 'Guerrilla warfare', 'Mass line', 'Hyperinflation']
    },
    {
      id: 'mao-years',
      number: 9,
      title: 'The Mao Years',
      period: '1949–1976 CE',
      dateRange: '1949–1976 CE',
      color: '#dc2626',
      icon: '⭐',
      description: 'Mao\'s China: land reform, the Great Leap Forward, the Cultural Revolution, and the human cost of revolutionary utopianism.',
      keyEvents: [
        { date: 1950, title: 'Land Reform Campaign', pieces: ['social', 'economic'], description: 'Mass redistribution of land from landlords to peasants; estimated 1–2 million landlords killed in class struggle meetings.' },
        { date: 1950, title: 'Korean War Intervention', pieces: ['political'], description: 'China entered the Korean War against UN forces, suffering ~180,000 casualties but establishing PRC as a military power.' },
        { date: 1953, title: 'First Five-Year Plan', pieces: ['economic', 'innovation'], description: 'Soviet-style industrialization focusing on heavy industry; significant urban growth but agricultural neglect.' },
        { date: 1956, title: 'Hundred Flowers Campaign', pieces: ['political', 'cultural'], description: '"Let a hundred flowers bloom" — Mao invited intellectual criticism, then launched the Anti-Rightist Campaign punishing ~550,000 critics.' },
        { date: 1958, title: 'Great Leap Forward', pieces: ['economic', 'social'], description: 'Mao\'s campaign to rapidly collectivize agriculture and industrialize through people\'s communes caused the Great Chinese Famine (1959–1961), killing 15–55 million people.' },
        { date: 1960, title: 'Sino-Soviet Split', pieces: ['political'], description: 'Ideological and geopolitical rivalry led to a complete break between China and the Soviet Union.' },
        { date: 1966, title: 'Cultural Revolution Begins', pieces: ['political', 'cultural', 'social'], description: 'Mao launched the Great Proletarian Cultural Revolution, mobilizing Red Guards to attack "bourgeois" elements. Schools closed, intellectuals persecuted, cultural heritage destroyed.' },
        { date: 1969, title: 'Sino-Soviet Border Clashes', pieces: ['political'], description: 'Armed confrontations on Zhenbao Island brought China and the USSR to the brink of nuclear war.' },
        { date: 1971, title: 'Lin Biao Incident', pieces: ['political'], description: 'Mao\'s chosen successor allegedly plotted a coup and died in a mysterious plane crash fleeing to the Soviet Union.' },
        { date: 1972, title: 'Nixon Visits China', pieces: ['political'], description: 'US President Nixon\'s visit to Beijing marked a dramatic Cold War realignment, opening US-China relations.' },
        { date: 1976, title: 'Death of Mao Zedong', pieces: ['political'], description: 'Mao died on September 9. The Gang of Four was arrested within a month, ending the Cultural Revolution era.' }
      ],
      keyFigures: ['Mao Zedong', 'Zhou Enlai', 'Deng Xiaoping', 'Liu Shaoqi', 'Lin Biao', 'Jiang Qing', 'Peng Dehuai'],
      keyConcepts: ['Continuous Revolution', 'Mass campaigns', 'People\'s communes', 'Great Leap Forward', 'Cultural Revolution', 'Red Guards', 'Self-criticism sessions', 'Mao cult of personality', 'Ping-pong diplomacy']
    },
    {
      id: 'research-project',
      number: 10,
      title: 'Research Project',
      period: 'Varies',
      dateRange: null,
      color: '#8b5cf6',
      icon: '📚',
      description: 'Student-directed research applying PIECES analysis, CER argumentation, and source evaluation skills to a self-selected topic in Asian history.',
      keyEvents: [],
      keyFigures: [],
      keyConcepts: ['Research question design', 'Primary vs. secondary sources', 'Historiography', 'Thesis construction', 'Evidence evaluation', 'PIECES integration', 'Academic citation']
    }
  ],

  // PIECES theme metadata
  piecesThemes: {
    political: { label: 'Political', icon: '🏛️', color: '#c73e3a' },
    innovation: { label: 'Innovation', icon: '🔬', color: '#0ea5e9' },
    environmental: { label: 'Environmental', icon: '🌍', color: '#22c55e' },
    cultural: { label: 'Cultural', icon: '🎭', color: '#a855f7' },
    economic: { label: 'Economic', icon: '💰', color: '#f59e0b' },
    social: { label: 'Social', icon: '👥', color: '#ec4899' }
  }
};

// Make available globally and as module
if (typeof window !== 'undefined') window.AHSAS_CURRICULUM = AHSAS_CURRICULUM;
if (typeof module !== 'undefined') module.exports = AHSAS_CURRICULUM;
