export type PlanType = 'subject' | 'revision' | 'test' | 'notification';
export type PlanStatus = 'Upcoming' | 'Ongoing' | 'Completed';

export interface CalendarPlanItem {
  id: string | number;
  title: string;
  titleTa?: string;
  type: PlanType;
  category: string;
  subject?: string;
  date: string; // YYYY-MM-DD in 2026
  endDate?: string;
  duration?: string;
  status: PlanStatus;
  description: string;
  descriptionTa?: string;
  syllabusTopics?: string[];
  pdfUrl?: string;
  fileName?: string;
  testId?: string | number;
}

export const initial2026CalendarPlan: CalendarPlanItem[] = [
  // --- JANUARY 2026 ---
  {
    id: 'cal-2026-01',
    title: 'TNPSC Group I Preliminary Exam 2026 Official Notification',
    titleTa: 'டிஎன்பிஎஸ்சி குரூப் I முதல்நிலைத் தேர்வு 2026 அதிகாரப்பூர்வ அறிவிப்பு',
    type: 'notification',
    category: 'TNPSC Group I',
    subject: 'Civil Services',
    date: '2026-01-10',
    status: 'Upcoming',
    description: 'Official notification release for TNPSC Group 1 Services (Deputy Collector, DSP, AC Commercial Taxes).',
    descriptionTa: 'துணை ஆட்சியர், டிஎஸ்பி உள்ளிட்ட குரூப் 1 பதவிகளுக்கான அதிகாரப்பூர்வ தேர்வு அறிவிப்பு வெளியீடு.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'TNPSC_Group1_Notification_2026.pdf'
  },
  {
    id: 'cal-2026-02',
    title: 'Subject Plan: Indian Polity - Constitutional Framework & Fundamental Rights',
    titleTa: 'பாடத்திட்டம்: இந்திய அரசியல் அமைப்பு - அடிப்படை உரிமைகள் மற்றும் கடமைகள்',
    type: 'subject',
    category: 'TNPSC Group I',
    subject: 'Indian Polity',
    date: '2026-01-14',
    endDate: '2026-01-20',
    duration: '7 Days',
    status: 'Upcoming',
    description: 'Unit 5 Coverage: Historical background, Preamble, Salient features of Constitution, Fundamental Rights (Articles 12-35), DPSP and Fundamental Duties.',
    descriptionTa: 'பிரிவு 5: அரசியலமைப்பின் பின்னணி, முகப்புரை, அடிப்படை உரிமைகள் (விதிகள் 12-35), மற்றும் வழிகாட்டு நெறிமுறைகள்.',
    syllabusTopics: [
      'Preamble & Salient features of Constitution',
      'Fundamental Rights (Articles 12 to 35)',
      'Directive Principles of State Policy (DPSP)',
      'Fundamental Duties & Citizenship Amendment Act'
    ]
  },
  {
    id: 'cal-2026-03',
    title: 'Test Plan: TNPSC Indian Polity Sectional Test 01',
    titleTa: 'தேர்வு திட்டம்: இந்திய அரசியல் அமைப்பு பகுதித் தேர்வு 01',
    type: 'test',
    category: 'TNPSC Group I',
    subject: 'Indian Polity',
    date: '2026-01-22',
    duration: '90 Mins',
    status: 'Upcoming',
    description: '100 Questions covering Indian Constitution basics, preamble, fundamental rights and duties with negative marking and Tamil/English bilingual interface.',
    descriptionTa: 'இந்திய அரசியலமைப்பு அடிப்படை தலைப்புகளில் 100 கேள்விகள் அடங்கிய மாதிரித் தேர்வு.',
    syllabusTopics: [
      'Articles 1-51A',
      'Constituent Assembly Debates',
      'Landmark Supreme Court Judgments on Part III'
    ],
    testId: 'tnpsc-g1'
  },
  {
    id: 'cal-2026-04',
    title: 'Revision Plan: Phase 1 Rapid Recall - Constitutional Articles & Amendments',
    titleTa: 'மீள்பார்வை திட்டம்: முக்கிய விதிகள் மற்றும் திருத்தச் சட்டங்கள் விரைவு மீள்பார்வை',
    type: 'revision',
    category: 'General Studies',
    subject: 'Indian Polity',
    date: '2026-01-28',
    endDate: '2026-01-31',
    duration: '4 Days',
    status: 'Upcoming',
    description: 'Phase 1 structured revision: Mind-maps, landmark amendments (42nd, 44th, 73rd, 86th, 103rd, 106th), and previous 10 years TNPSC & UPSC PYQ drill.',
    descriptionTa: 'முக்கிய அரசியல் சட்ட திருத்தங்கள் மற்றும் கடந்த 10 ஆண்டு வினாத்தாள்கள் மீள்பார்வை.',
    syllabusTopics: [
      'All 106 Constitutional Amendments review',
      'PYQ Analysis (2014-2025)',
      'Article mapping flashcards'
    ]
  },

  // --- FEBRUARY 2026 ---
  {
    id: 'cal-2026-05',
    title: 'SSC CGL 2026 Tier 1 Annual Notification Released',
    titleTa: 'எஸ்.எஸ்.சி சி.ஜி.எல் 2026 நிலை 1 அதிகாரப்பூர்வ அறிவிப்பு',
    type: 'notification',
    category: 'SSC CGL',
    subject: 'Central Govt',
    date: '2026-02-05',
    status: 'Upcoming',
    description: 'Staff Selection Commission opens registrations for Combined Graduate Level Examination 2026 (Tier 1 CBT).',
    descriptionTa: 'மத்திய அரசுப் பணிகளுக்கான எஸ்.எஸ்.சி சி.ஜி.எல் 2026 தேர்வுக்கான விண்ணப்பப் பதிவு தொடக்கம்.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'SSC_CGL_2026_Official_Notice.pdf'
  },
  {
    id: 'cal-2026-06',
    title: 'Subject Plan: History & Culture of India and Tamil Society (Unit 4 & 8)',
    titleTa: 'பாடத்திட்டம்: இந்திய வரலாறு மற்றும் தமிழ்நாடு சமூகம், பண்பாடு (பிரிவு 4 & 8)',
    type: 'subject',
    category: 'TNPSC Group I',
    subject: 'History & Tamil Society',
    date: '2026-02-08',
    endDate: '2026-02-16',
    duration: '8 Days',
    status: 'Upcoming',
    description: 'Indus Valley Civilization, Vedic Period, Guptas, Delhi Sultanate, Mughals, and Marathas; Sangam Age literature, Keezhadi archaeological excavations.',
    descriptionTa: 'சிந்து சமவெளி, சங்க காலம், கீழடி அகழாய்வு, மவுரியர்கள், முகலாயர்கள் மற்றும் மராத்தியர் வரலாறு.',
    syllabusTopics: [
      'Indus Valley Civilization to Sangam Age',
      'Keezhadi, Sivagalai & Adichanallur findings',
      'Thirukkural social philosophy and secular character',
      'Evolution of 19th and 20th Century Socio-Political movements in TN'
    ]
  },
  {
    id: 'cal-2026-07',
    title: 'Test Plan: SSC CGL Tier 1 All-India Mock Test 01',
    titleTa: 'தேர்வு திட்டம்: எஸ்.எஸ்.சி சி.ஜி.எல் அகில இந்திய மாதிரித் தேர்வு 01',
    type: 'test',
    category: 'SSC CGL',
    subject: 'Full Syllabus',
    date: '2026-02-18',
    duration: '60 Mins',
    status: 'Upcoming',
    description: 'Full CBT simulation test: 25 questions each on General Intelligence & Reasoning, General Awareness, Quantitative Aptitude, and English Comprehension.',
    descriptionTa: '100 கேள்விகள், 200 மதிப்பெண்கள் கொண்ட கணினி வழி மாதிரி தேர்வு.',
    syllabusTopics: ['Reasoning', 'Quantitative Aptitude', 'General Awareness', 'English Comprehension'],
    testId: 'ssc'
  },
  {
    id: 'cal-2026-08',
    title: 'Revision Plan: Unit 8 Tamil Society & Thirukkural Special Revision Sprint',
    titleTa: 'மீள்பார்வை திட்டம்: பிரிவு 8 தமிழ் சமுதாய வரலாறு மற்றும் திருக்குறள் சிறப்பு திருப்புதல்',
    type: 'revision',
    category: 'TNPSC Group I',
    subject: 'Tamil Culture & Heritage',
    date: '2026-02-24',
    endDate: '2026-02-28',
    duration: '5 Days',
    status: 'Upcoming',
    description: 'High-scoring revision of Thirukkural essays, Justice Party, Self-Respect Movement, Dravidian Movement, and contributions of Periyar, Anna, and Kamarajar.',
    descriptionTa: 'நீதிக்கட்சி, சுயமரியாதை இயக்கம், பெரியார், அண்ணா மற்றும் காமராஜர் பங்களிப்புகள் திருப்புதல்.',
    syllabusTopics: [
      'Thirukkural 6 core themes for Prelims & Mains',
      'Role of Women in Tamil Nadu Freedom Struggle (Velu Nachiyar, Kuyili, Moovalur Ramamirtham)',
      'Justice Party achievements and education reforms'
    ]
  },

  // --- MARCH 2026 ---
  {
    id: 'cal-2026-09',
    title: 'Railway RRB NTPC Stage 1 CBT 2026 Exam Schedule Notification',
    titleTa: 'ரயில்வே ஆர்.ஆர்.பி என்.டி.பி.சி 2026 தேர்வு அட்டவணை அறிவிப்பு',
    type: 'notification',
    category: 'Railway RRB',
    subject: 'Central Govt',
    date: '2026-03-02',
    status: 'Upcoming',
    description: 'Railway Recruitment Boards announce tentative exam dates for Non-Technical Popular Categories graduate & undergraduate posts.',
    descriptionTa: 'ரயில்வே தேர்வு வாரியம் என்.டி.பி.சி தேர்வு தேதிகளை அறிவிக்கிறது.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'RRB_NTPC_2026_Schedule.pdf'
  },
  {
    id: 'cal-2026-10',
    title: 'Subject Plan: Unit 10 Aptitude, Mental Ability & Logical Reasoning',
    titleTa: 'பாடத்திட்டம்: திறனறிவும் மனக்கணக்கு நுண்ணறிவும் (பிரிவு 10)',
    type: 'subject',
    category: 'TNPSC Group I',
    subject: 'Aptitude & Mental Ability',
    date: '2026-03-06',
    endDate: '2026-03-14',
    duration: '9 Days',
    status: 'Upcoming',
    description: 'Simplification, Percentage, Highest Common Factor (HCF), Lowest Common Multiple (LCM), Ratio and Proportion, Simple & Compound Interest, Time and Work.',
    descriptionTa: 'சுருக்குதல், சதவீதம், மீ.பொ.வ, மீ.சி.ம, விகிதம், தனிவட்டி, கூட்டுவட்டி மற்றும் காலம்-வேலை.',
    syllabusTopics: [
      'LCM & HCF real-life application problems',
      'Compound Interest vs Simple Interest difference formulas',
      'Area, Volume & Mensuration 2D/3D',
      'Puzzles, Dice, Visual Reasoning, Number Series'
    ]
  },
  {
    id: 'cal-2026-11',
    title: 'Test Plan: State-Level TNPSC Group I Prelims Grand Mock Test 01',
    titleTa: 'தேர்வு திட்டம்: மாநில அளவிலான டிஎன்பிஎஸ்சி குரூப் 1 மெகா மாதிரித் தேர்வு 01',
    type: 'test',
    category: 'TNPSC Group I',
    subject: 'Full GS Paper',
    date: '2026-03-16',
    duration: '3 Hours',
    status: 'Upcoming',
    description: 'Complete 200 Questions / 300 Marks simulation following latest OMR exam format with state-wide ranking and comprehensive analysis.',
    descriptionTa: '200 வினாக்கள், 300 மதிப்பெண்கள் கொண்ட மாநில அளவிலான மாதிரி தேர்வு.',
    syllabusTopics: ['Complete GS Syllabus (Units 1-10)'],
    testId: 'tnpsc-g1'
  },
  {
    id: 'cal-2026-12',
    title: 'Revision Plan: Quantitative Aptitude Shortcuts & Vedic Math Speed Formulae',
    titleTa: 'மீள்பார்வை திட்டம்: கணித சூத்திரங்கள் மற்றும் விரைவு தீர்வு முறைகள்',
    type: 'revision',
    category: 'All Exams',
    subject: 'Aptitude & Mental Ability',
    date: '2026-03-24',
    endDate: '2026-03-27',
    duration: '4 Days',
    status: 'Upcoming',
    description: 'Speed math formula review, calculation shortcuts, geometry theorems, and timer-based practice to solve 25 questions in under 22 minutes.',
    descriptionTa: 'குறைந்த நேரத்தில் 25 கணித கேள்விகளுக்கு விடையளிக்கும் சிறப்பு பயிற்சி.',
    syllabusTopics: ['Shortcut tricks', 'Mensuration formulas summary', 'Unit digit & remainder theorems']
  },

  // --- APRIL 2026 ---
  {
    id: 'cal-2026-13',
    title: 'TNPSC Group IV Combined Civil Services 2026 Official Notification',
    titleTa: 'டிஎன்பிஎஸ்சி குரூப் IV 2026 தேர்வு அதிகாரப்பூர்வ அறிவிப்பு',
    type: 'notification',
    category: 'TNPSC Group IV',
    subject: 'Civil Services',
    date: '2026-04-05',
    status: 'Upcoming',
    description: 'Notification for VAO, Junior Assistant, Typist, and Steno-Typist posts across Tamil Nadu government departments.',
    descriptionTa: 'கிராம நிர்வாக அலுவலர் (VAO), இளநிலை உதவியாளர் உள்ளிட்ட குரூப் 4 பணிகளுக்கான தேர்வு அறிவிப்பு.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'TNPSC_Group4_2026_Notification.pdf'
  },
  {
    id: 'cal-2026-14',
    title: 'Subject Plan: Unit 9 Development Administration in Tamil Nadu',
    titleTa: 'பாடத்திட்டம்: தமிழகத்தில் வளர்ச்சி நிர்வாகம் (பிரிவு 9)',
    type: 'subject',
    category: 'TNPSC Group I',
    subject: 'Development Administration',
    date: '2026-04-09',
    endDate: '2026-04-16',
    duration: '8 Days',
    status: 'Upcoming',
    description: 'Human Development Indicators in TN, Social Justice and Social Harmony, Economic Trends, Geography of TN and impact on economic growth, e-Governance.',
    descriptionTa: 'மனித மேம்பாட்டு குறியீடுகள், சமூக நீதி, தமிழக பொருளாதார போக்குகள் மற்றும் மின்னாளுமை.',
    syllabusTopics: [
      'Human Development Index (HDI) of Tamil Nadu vs National average',
      'Education and Health delivery systems in TN',
      'Flagship welfare schemes (Kalaignar Magalir Urimai Thogai, Pudhumai Penn, Illam Thedi Kalvi)',
      'e-Governance initiatives and TNeGA portals'
    ]
  },
  {
    id: 'cal-2026-15',
    title: 'Test Plan: Railway RRB NTPC Stage 1 CBT Speed Test 01',
    titleTa: 'தேர்வு திட்டம்: ரயில்வே என்.டி.பி.சி நிலை 1 மாதிரித் தேர்வு 01',
    type: 'test',
    category: 'Railway RRB',
    subject: 'General Awareness & Math',
    date: '2026-04-22',
    duration: '90 Mins',
    status: 'Upcoming',
    description: '100 Questions CBT format: 40 General Awareness, 30 Mathematics, 30 General Intelligence and Reasoning.',
    descriptionTa: '100 கேள்விகள் கொண்ட ரயில்வே மாதிரித் தேர்வு.',
    syllabusTopics: ['General Science', 'Indian Railways History & GK', 'Arithmetic', 'Reasoning'],
    testId: 'railway'
  },
  {
    id: 'cal-2026-16',
    title: 'Revision Plan: Phase 2 Revision - Socio-Economic Schemes & Current Policies',
    titleTa: 'மீள்பார்வை திட்டம்: தமிழக அரசின் நலத்திட்டங்கள் மற்றும் கொள்கைகள்',
    type: 'revision',
    category: 'TNPSC Group I',
    subject: 'Tamil Nadu Administration',
    date: '2026-04-27',
    endDate: '2026-04-30',
    duration: '4 Days',
    status: 'Upcoming',
    description: 'Comprehensive tabular review of budget allocations, beneficiaries, and milestones of all Tamil Nadu welfare schemes.',
    descriptionTa: 'அனைத்து அரசு நலத்திட்டங்களின் முக்கிய தகவல்கள் அட்டவணை மீள்பார்வை.',
    syllabusTopics: ['Budget 2026-27 Highlights', 'Industrial Parks (SIPCOT, TIDCO)', 'Renewable Energy Initiatives']
  },

  // --- MAY 2026 ---
  {
    id: 'cal-2026-17',
    title: 'UPSC Civil Services Prelims 2026 Examination',
    titleTa: 'மத்திய அரசு குடிமைப் பணி (யு.பி.எஸ்.சி) முதல்நிலைத் தேர்வு 2026',
    type: 'notification',
    category: 'UPSC CSE',
    subject: 'Civil Services',
    date: '2026-05-24',
    status: 'Upcoming',
    description: 'Union Public Service Commission Civil Services Preliminary Examination 2026 (GS Paper I & Paper II CSAT).',
    descriptionTa: 'யு.பி.எஸ்.சி ஐ.ஏ.எஸ் / ஐ.பி.எஸ் முதல்நிலைத் தேர்வு நடைபெறும் நாள்.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'UPSC_CSE_2026_Schedule.pdf'
  },
  {
    id: 'cal-2026-18',
    title: 'Subject Plan: Indian National Movement & Tamil Nadu Freedom Struggle (Unit 7)',
    titleTa: 'பாடத்திட்டம்: இந்திய தேசிய இயக்கம் மற்றும் விடுதலைப் போராட்டத்தில் தமிழகத்தின் பங்கு',
    type: 'subject',
    category: 'TNPSC Group I',
    subject: 'Modern History',
    date: '2026-05-04',
    endDate: '2026-05-12',
    duration: '9 Days',
    status: 'Upcoming',
    description: 'Early uprising against British rule (Poligar Wars, Vellore Mutiny 1806), Indian National Congress, Moderates, Extremists, Gandhian Era, INA, and Partition.',
    descriptionTa: 'பாளையக்காரர் போர், வேலூர் புரட்சி 1806, காந்திய யுகம் மற்றும் விடுதலைப் போராட்டம்.',
    syllabusTopics: [
      'Veerapandiya Kattabomman, Maruthu Brothers, Pulithevan',
      'V.O. Chidambaram Pillai & Swadeshi Steam Navigation',
      'Subramania Bharati & Vanchinathan',
      'Salt Satyagraha at Vedaranyam by C. Rajagopalachari'
    ]
  },
  {
    id: 'cal-2026-19',
    title: 'Test Plan: UPSC CSE Prelims Model Test GS Paper 1 & CSAT',
    titleTa: 'தேர்வு திட்டம்: யு.பி.எஸ்.சி பொது அறிவு மற்றும் சிசாட் முழு மாதிரித் தேர்வு',
    type: 'test',
    category: 'UPSC CSE',
    subject: 'General Studies',
    date: '2026-05-16',
    duration: '4 Hours (2 Sessions)',
    status: 'Upcoming',
    description: 'Paper 1 (100 Questions) + Paper 2 CSAT (80 Questions) with high-standard analytical and statement-based questions.',
    descriptionTa: 'யு.பி.எஸ்.சி பாணியிலான கூற்று மற்றும் காரண வினாக்கள் அடங்கிய மாதிரித் தேர்வு.',
    syllabusTopics: ['Polity', 'Economy', 'Ecology', 'History', 'CSAT Comprehension & Logical Reasoning']
  },
  {
    id: 'cal-2026-20',
    title: 'Revision Plan: Pre-Prelims Intensive Revision: Modern Indian History & National Movement',
    titleTa: 'மீள்பார்வை திட்டம்: நவீன இந்திய வரலாறு மற்றும் தேசிய இயக்கம் முழு திருப்புதல்',
    type: 'revision',
    category: 'All Exams',
    subject: 'Modern History',
    date: '2026-05-18',
    endDate: '2026-05-22',
    duration: '5 Days',
    status: 'Upcoming',
    description: 'Chronology charts from 1857 to 1947, Governor-Generals & Viceroys, Congress Sessions and Presidents, Books and Newspapers during freedom struggle.',
    descriptionTa: '1857 முதல் 1947 வரையிலான காலவரிசை, ஆளுநர்கள் மற்றும் காங்கிரஸ் மாநாடுகள் திருப்புதல்.',
    syllabusTopics: ['Chronology Timeline', 'Tribal & Peasant Movements', 'Constitutional Development under British']
  },

  // --- JUNE 2026 ---
  {
    id: 'cal-2026-21',
    title: 'TNPSC Group II / IIA Combined Civil Services 2026 Notification',
    titleTa: 'டிஎன்பிஎஸ்சி குரூப் II / IIA 2026 தேர்வு அதிகாரப்பூர்வ அறிவிப்பு',
    type: 'notification',
    category: 'TNPSC Group II/IIA',
    subject: 'Civil Services',
    date: '2026-06-08',
    status: 'Upcoming',
    description: 'Recruitment notification for Municipal Commissioner, Sub-Registrar, Revenue Inspector, and Assistant Section Officer (ASO) posts.',
    descriptionTa: 'நகராட்சி ஆணையர், சார்-பதிவாளர், வருவாய் ஆய்வாளர் உள்ளிட்ட பதவிகளுக்கான தேர்வு அறிவிப்பு.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'TNPSC_Group2_2026_Notification.pdf'
  },
  {
    id: 'cal-2026-22',
    title: 'Subject Plan: Unit 6 Indian Economy, Fiscal Policy & Tamil Nadu Budget 2026',
    titleTa: 'பாடத்திட்டம்: இந்தியப் பொருளாதாரம், நிதிக் கொள்கை மற்றும் தமிழக பட்ஜெட்',
    type: 'subject',
    category: 'TNPSC Group I',
    subject: 'Indian Economy',
    date: '2026-06-11',
    endDate: '2026-06-19',
    duration: '9 Days',
    status: 'Upcoming',
    description: 'Features of Indian economy, National Income calculation, Five-Year Plans, NITI Aayog, Reserve Bank of India & Monetary Policy, GST and Finance Commission.',
    descriptionTa: 'இந்தியப் பொருளாதாரம், தேசிய வருமானம், நிதி ஆயோக், ரிசர்வ் வங்கி மற்றும் ஜிஎஸ்டி.',
    syllabusTopics: [
      'GDP, GNP, NNP and Per Capita Income',
      'Monetary Policy tools: Repo, Reverse Repo, CRR, SLR',
      'Direct and Indirect Taxes, GST Council resolutions',
      'Finance Commission recommendations on Tax Devolution'
    ]
  },
  {
    id: 'cal-2026-23',
    title: 'Test Plan: TNPSC Group IV Full-Length Mock Exam 2026',
    titleTa: 'தேர்வு திட்டம்: டிஎன்பிஎஸ்சி குரூப் 4 முழு மாதிரித் தேர்வு',
    type: 'test',
    category: 'TNPSC Group IV',
    subject: 'General Tamil + GS + Aptitude',
    date: '2026-06-21',
    duration: '3 Hours',
    status: 'Upcoming',
    description: '100 Questions Pothu Tamil / General Studies (75) + Aptitude (25) = 200 Questions, 300 Marks.',
    descriptionTa: 'பொதுத்தமிழ் 100 வினாக்கள் + பொது அறிவு 75 வினாக்கள் + கணிதம் 25 வினாக்கள் அடங்கிய மாதிரி தேர்வு.',
    syllabusTopics: ['General Tamil (Part A, B, C)', 'General Studies', 'Aptitude & Mental Ability'],
    testId: 'tnpsc-g4'
  },
  {
    id: 'cal-2026-24',
    title: 'Revision Plan: Economy Core Concepts, Banking & Inflation Revision Sprint',
    titleTa: 'மீள்பார்வை திட்டம்: பொருளாதார முக்கிய கோட்பாடுகள் மற்றும் வங்கியியல் திருப்புதல்',
    type: 'revision',
    category: 'TNPSC Group I',
    subject: 'Indian Economy',
    date: '2026-06-25',
    endDate: '2026-06-29',
    duration: '5 Days',
    status: 'Upcoming',
    description: 'Concept revision on CPI, WPI, Repo rate fluctuations, Banking regulation, NPA management, and poverty eradication programs.',
    descriptionTa: 'பணவீக்கம், ரெப்போ விகிதம், வங்கியியல் மற்றும் வறுமை ஒழிப்பு திட்டங்கள் விரைவு மீள்பார்வை.',
    syllabusTopics: ['Inflation indexes', 'Banking terms & Basel III norms', 'Agriculture & Food security schemes']
  },

  // --- JULY 2026 ---
  {
    id: 'cal-2026-25',
    title: 'TRT Post Graduate Assistants / TET Recruitment 2026 Notification',
    titleTa: 'ஆசிரியர் தேர்வு வாரியம் (TRT / TET) 2026 அதிகாரப்பூர்வ அறிவிப்பு',
    type: 'notification',
    category: 'TRT / TET',
    subject: 'Education',
    date: '2026-07-06',
    status: 'Upcoming',
    description: 'Teachers Recruitment Board notification for PG Assistants, BT Teachers, and Teacher Eligibility Test 2026.',
    descriptionTa: 'முதுகலை ஆசிரியர் மற்றும் ஆசிரியர் தகுதித் தேர்வுக்கான அதிகாரப்பூர்வ அறிவிப்பு.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'TRT_TET_2026_Notification.pdf'
  },
  {
    id: 'cal-2026-26',
    title: 'Subject Plan: Unit 3 Geography of India & Tamil Nadu, Monsoon & Resources',
    titleTa: 'பாடத்திட்டம்: இந்தியா மற்றும் தமிழ்நாடு புவியியல், பருவமழை மற்றும் வளங்கள் (பிரிவு 3)',
    type: 'subject',
    category: 'TNPSC Group I',
    subject: 'Geography',
    date: '2026-07-10',
    endDate: '2026-07-18',
    duration: '9 Days',
    status: 'Upcoming',
    description: 'Location, Physical features, Monsoon, Rainfall, Weather and Climate, Water Resources, Rivers in India and TN, Soil, Minerals, Natural vegetation, Wildlife.',
    descriptionTa: 'அமைவிடம், இயற்கை அமைப்புகள், பருவமழை, நதிகள், கனிம வளங்கள், காடுகள் மற்றும் வனவிலங்கு சரணாலயங்கள்.',
    syllabusTopics: [
      'Himalayan and Peninsular River Systems',
      'South-West & North-East Monsoon mechanics and El-Nino effect',
      'Biosphere reserves, National Parks and Ramsar Wetland sites in TN',
      'Disaster Management: Cyclones, Floods, Droughts & Tsunami mitigation'
    ]
  },
  {
    id: 'cal-2026-27',
    title: 'Test Plan: SSC CGL Tier 1 All-India Mock Test 02',
    titleTa: 'தேர்வு திட்டம்: எஸ்.எஸ்.சி சி.ஜி.எல் அகில இந்திய மாதிரித் தேர்வு 02',
    type: 'test',
    category: 'SSC CGL',
    subject: 'Full Syllabus',
    date: '2026-07-23',
    duration: '60 Mins',
    status: 'Upcoming',
    description: 'Toughness-calibrated All-India CBT mock test with sectional percentiles, accuracy metrics, and AI recommendations.',
    descriptionTa: 'தேசிய தரவரிசையுடன் கூடிய மாதிரித் தேர்வு.',
    syllabusTopics: ['Reasoning', 'Quant', 'General Awareness', 'English Comprehension'],
    testId: 'ssc'
  },
  {
    id: 'cal-2026-28',
    title: 'Revision Plan: Map-Based Geography & National Parks / Ramsar Sites Revision',
    titleTa: 'மீள்பார்வை திட்டம்: வரைபட புவியியல், தேசிய பூங்காக்கள் மற்றும் ராம்சார் தளங்கள்',
    type: 'revision',
    category: 'All Exams',
    subject: 'Geography',
    date: '2026-07-28',
    endDate: '2026-07-31',
    duration: '4 Days',
    status: 'Upcoming',
    description: 'High-yield map marking session: Tiger Reserves, Elephant Corridors, Ports, Nuclear Power Plants, Mountain Passes, and UNESCO World Heritage Sites.',
    descriptionTa: 'புலிகள் காப்பகம், துறைமுகங்கள், மலைப்பாதைகள் மற்றும் உலக பாரம்பரிய தளங்கள் வரைபட திருப்புதல்.',
    syllabusTopics: ['Map pointers', 'Ramsar sites of TN (16 sites)', 'Tiger Reserves in TN']
  },

  // --- AUGUST 2026 ---
  {
    id: 'cal-2026-29',
    title: 'TNPSC Group I Prelims Examination 2026 (Exam Day)',
    titleTa: 'டிஎன்பிஎஸ்சி குரூப் I முதல்நிலைத் தேர்வு 2026 (தேர்வு நாள்)',
    type: 'notification',
    category: 'TNPSC Group I',
    subject: 'Civil Services',
    date: '2026-08-16',
    status: 'Upcoming',
    description: 'TNPSC conducts Group 1 Services Preliminary Written Examination across all district centers in Tamil Nadu.',
    descriptionTa: 'தமிழகம் முழுவதும் அனைத்து மாவட்ட மையங்களிலும் குரூப் 1 முதல்நிலைத் தேர்வு நடைபெறும் நாள்.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'TNPSC_Group1_HallTicket_Instructions.pdf'
  },
  {
    id: 'cal-2026-30',
    title: 'Revision Plan: Final Lap Master Revision: Current Affairs (Last 12 Months)',
    titleTa: 'மீள்பார்வை திட்டம்: இறுதி கட்ட நடப்பு நிகழ்வுகள் சிறப்பு திருப்புதல் (கடந்த 12 மாதங்கள்)',
    type: 'revision',
    category: 'TNPSC Group I',
    subject: 'Current Affairs',
    date: '2026-08-05',
    endDate: '2026-08-10',
    duration: '6 Days',
    status: 'Upcoming',
    description: 'Consolidated review of National & International summits, Awards, Sports, Science & Tech innovations, TN Govt appointments, and Supreme Court verdicts.',
    descriptionTa: 'விருதுகள், விளையாட்டு, மாநாடுகள், தமிழக அரசு முக்கிய திட்டங்கள் மற்றும் நியமனங்கள் முழு மீள்பார்வை.',
    syllabusTopics: ['Last 12 months CA highlights', 'Sports & Bharat Ratna/Padma Awards', 'Science & Space missions (ISRO/NASA)']
  },
  {
    id: 'cal-2026-31',
    title: 'Test Plan: TNPSC Group I Pre-Exam Mega Mock Test (State Ranking)',
    titleTa: 'தேர்வு திட்டம்: குரூப் 1 தேர்வுக்கான இறுதி மெகா மாதிரித் தேர்வு (மாநில தரவரிசை)',
    type: 'test',
    category: 'TNPSC Group I',
    subject: 'General Studies Complete',
    date: '2026-08-12',
    duration: '3 Hours',
    status: 'Upcoming',
    description: 'Exact exam simulation test with actual difficulty level, negative marking calculation, and personalized weak area diagnosis.',
    descriptionTa: 'உண்மையான தேர்வு பாணியிலான இறுதி மெகா மாதிரி தேர்வு.',
    syllabusTopics: ['Units 1 to 10 Complete Syllabus'],
    testId: 'tnpsc-g1'
  },
  {
    id: 'cal-2026-32',
    title: 'Subject Plan: Group 1 Mains Answer Writing & Tamil Eligibility Orientation',
    titleTa: 'பாடத்திட்டம்: குரூப் 1 முதன்மைத் தேர்வு விடை எழுதும் பயிற்சி மற்றும் கட்டாயத் தமிழ்',
    type: 'subject',
    category: 'TNPSC Group I',
    subject: 'Mains Descriptive',
    date: '2026-08-25',
    endDate: '2026-08-31',
    duration: '7 Days',
    status: 'Upcoming',
    description: 'Structure of Mains answer presentation: Introduction, sub-headings, diagrams, case studies, and conclusion; Paper 1 Tamil Eligibility syllabus overview.',
    descriptionTa: 'முதன்மைத் தேர்வு விடைத்தாள் வடிவமைப்பு, வரைபடங்கள், மற்றும் கட்டாய தமிழ் தகுதித் தேர்வு வழிகாட்டுதல்.',
    syllabusTopics: ['Mains 15-mark & 10-mark templates', 'Tamil to English & English to Tamil translation', 'Precise writing & Thirukkural essay techniques']
  },

  // --- SEPTEMBER 2026 ---
  {
    id: 'cal-2026-33',
    title: 'Railway RRB Assistant Loco Pilot (ALP) CBT 1 Examination',
    titleTa: 'ரயில்வே உதவி லோகோ பைலட் (ALP) நிலை 1 கணினித் தேர்வு',
    type: 'notification',
    category: 'Railway RRB',
    subject: 'Central Govt',
    date: '2026-09-12',
    status: 'Upcoming',
    description: 'Computer Based Test for ALP & Technician posts scheduled by Railway Recruitment Boards.',
    descriptionTa: 'ரயில்வே உதவி லோகோ பைலட் பணியிடங்களுக்கான கணினி வழித் தேர்வு.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'RRB_ALP_2026_AdmitCard.pdf'
  },
  {
    id: 'cal-2026-34',
    title: 'Subject Plan: Social Issues in India and Tamil Nadu (Mains Paper 2)',
    titleTa: 'பாடத்திட்டம்: இந்தியா மற்றும் தமிழ்நாட்டில் சமூகப் பிரச்சனைகள் (முதன்மைத் தேர்வு தாள் 2)',
    type: 'subject',
    category: 'TNPSC Group I',
    subject: 'Social Issues',
    date: '2026-09-15',
    endDate: '2026-09-24',
    duration: '10 Days',
    status: 'Upcoming',
    description: 'Population explosion, Unemployment, Child labor, Women empowerment, Domestic violence, Poverty alleviation, Social security, Communal harmony.',
    descriptionTa: 'மக்கள் தொகை பெருக்கம், வேலையின்மை, பெண்கள் மேம்பாடு, வறுமை மற்றும் சமூக பாதுகாப்பு.',
    syllabusTopics: [
      'Poverty and Unemployment metrics and government schemes',
      'Women Empowerment: Legal protections (PNDT, POCSO, Domestic Violence Act)',
      'Child labor elimination and Right to Education Act',
      'Elderly care and Transgender welfare policies in Tamil Nadu'
    ]
  },
  {
    id: 'cal-2026-35',
    title: 'Test Plan: TNPSC Group II/IIA Prelims Full Mock Test 01',
    titleTa: 'தேர்வு திட்டம்: டிஎன்பிஎஸ்சி குரூப் II/IIA முதல்நிலை மாதிரித் தேர்வு 01',
    type: 'test',
    category: 'TNPSC Group II/IIA',
    subject: 'General Tamil + General Studies',
    date: '2026-09-22',
    duration: '3 Hours',
    status: 'Upcoming',
    description: '200 Questions / 300 Marks mock test based on revised TNPSC Group 2/2A prelims syllabus and pattern.',
    descriptionTa: 'குரூப் 2/2A புதிய தேர்வு முறைப்படியான 200 வினாக்கள் மாதிரி தேர்வு.',
    syllabusTopics: ['General Tamil (100 Qs)', 'General Studies (75 Qs)', 'Aptitude (25 Qs)'],
    testId: 'tnpsc-g2'
  },
  {
    id: 'cal-2026-36',
    title: 'Revision Plan: Science & Technology in Everyday Life & Indian Space Missions',
    titleTa: 'மீள்பார்வை திட்டம்: அன்றாட வாழ்வில் அறிவியல் மற்றும் இந்திய விண்வெளி திட்டங்கள்',
    type: 'revision',
    category: 'TNPSC Group I',
    subject: 'General Science',
    date: '2026-09-28',
    endDate: '2026-09-30',
    duration: '3 Days',
    status: 'Upcoming',
    description: 'ISRO Gaganyaan mission updates, Chandrayaan findings, AI & Biotechnology in health, and renewable energy storage advancements.',
    descriptionTa: 'இஸ்ரோ ககன்யான் திட்டங்கள், செயற்கை நுண்ணறிவு மற்றும் உயிரி தொழில்நுட்பம் திருப்புதல்.',
    syllabusTopics: ['Gaganyaan, Aditya L1, Shukrayaan', 'CRISPR, mRNA vaccines', 'Nanotechnology and Quantum computing']
  },

  // --- OCTOBER 2026 ---
  {
    id: 'cal-2026-37',
    title: 'TNPSC Combined Technical Services (CTS) Exam 2026 Notification',
    titleTa: 'டிஎன்பிஎஸ்சி ஒருங்கிணைந்த தொழில்நுட்பப் பணிகள் (CTS) தேர்வு 2026',
    type: 'notification',
    category: 'TNPSC CTS',
    subject: 'Technical & Engineering',
    date: '2026-10-10',
    status: 'Upcoming',
    description: 'Notification for Assistant Engineers, Motor Vehicle Inspectors, and Technical Officers in TN Government.',
    descriptionTa: 'உதவி பொறியாளர் மற்றும் தொழில்நுட்ப அலுவலர் பணிகளுக்கான அதிகாரப்பூர்வ தேர்வு அறிவிப்பு.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'TNPSC_CTS_2026_Notification.pdf'
  },
  {
    id: 'cal-2026-38',
    title: 'Subject Plan: Environmental Ecology, Biodiversity & Climate Change Agreements',
    titleTa: 'பாடத்திட்டம்: சுற்றுச்சூழல், பல்லுயிர் பெருக்கம் மற்றும் பருவநிலை மாற்ற மாநாடுகள்',
    type: 'subject',
    category: 'General Studies',
    subject: 'Environment & Ecology',
    date: '2026-10-14',
    endDate: '2026-10-22',
    duration: '9 Days',
    status: 'Upcoming',
    description: 'Ecology concepts, trophic levels, bio-magnification, global warming, UNFCCC COP summits, Paris Agreement targets, and Green Tamil Nadu Mission.',
    descriptionTa: 'சுற்றுச்சூழல் அமைப்புகள், உலக வெப்பமயமாதல், பாரிஸ் ஒப்பந்தம் மற்றும் பசுமை தமிழ்நாடு இயக்கம்.',
    syllabusTopics: [
      'Carbon sequestration and Net Zero 2070 roadmap',
      'Pollution Control Acts and National Green Tribunal (NGT)',
      'Endangered flora and fauna in Western Ghats and Eastern Ghats',
      'Tamil Nadu Climate Change Mission & Wetland Mission'
    ]
  },
  {
    id: 'cal-2026-39',
    title: 'Test Plan: Railway RRB NTPC Stage 1 CBT Full Mock Test 02',
    titleTa: 'தேர்வு திட்டம்: ரயில்வே என்.டி.பி.சி நிலை 1 முழு மாதிரித் தேர்வு 02',
    type: 'test',
    category: 'Railway RRB',
    subject: 'Complete Syllabus',
    date: '2026-10-24',
    duration: '90 Mins',
    status: 'Upcoming',
    description: '100 Questions test with instant score card, sectional breakdown, time management insights, and solutions PDF.',
    descriptionTa: '100 கேள்விகள், உடனடி மதிப்பெண் மற்றும் தீர்வு குறிப்புகள் கொண்ட மாதிரி தேர்வு.',
    syllabusTopics: ['Maths', 'General Intelligence', 'General Awareness'],
    testId: 'railway'
  },
  {
    id: 'cal-2026-40',
    title: 'Revision Plan: Environment Treaties, Wildlife Acts & Protocols Revision',
    titleTa: 'மீள்பார்வை திட்டம்: வனவிலங்கு பாதுகாப்புச் சட்டங்கள் மற்றும் சர்வதேச உடன்படிக்கைகள்',
    type: 'revision',
    category: 'General Studies',
    subject: 'Environment & Ecology',
    date: '2026-10-28',
    endDate: '2026-10-31',
    duration: '4 Days',
    status: 'Upcoming',
    description: 'Wildlife Protection Act 1972 (amended), Forest Conservation Act, Montreal Protocol, Ramsar Convention, CITES, and Project Tiger & Elephant achievements.',
    descriptionTa: 'வனவிலங்கு பாதுகாப்புச் சட்டம், மாண்ட்ரீல் ஒப்பந்தம், மற்றும் புலிகள் திட்ட சாதனைகள் திருப்புதல்.',
    syllabusTopics: ['Environmental laws list', 'International environmental conventions', 'Tamil Nadu sanctuaries']
  },

  // --- NOVEMBER 2026 ---
  {
    id: 'cal-2026-41',
    title: 'TNPSC Group II/IIA Mains Examination 2026',
    titleTa: 'டிஎன்பிஎஸ்சி குரூப் II/IIA முதன்மைத் தேர்வு 2026',
    type: 'notification',
    category: 'TNPSC Group II/IIA',
    subject: 'Civil Services',
    date: '2026-11-21',
    status: 'Upcoming',
    description: 'TNPSC conducts Group 2/2A Descriptive Mains Examination (Paper 1 Tamil Eligibility & Paper 2 General Studies).',
    descriptionTa: 'குரூப் 2/2A விரிவான விடையளிக்கும் முதன்மைத் தேர்வு நடைபெறும் நாள்.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'TNPSC_Group2_Mains_Instructions.pdf'
  },
  {
    id: 'cal-2026-42',
    title: 'Subject Plan: International Organizations, Bilateral Summits & Geopolitics 2026',
    titleTa: 'பாடத்திட்டம்: சர்வதேச அமைப்புகள், உச்சி மாநாடுகள் மற்றும் உலக அரசியல்',
    type: 'subject',
    category: 'General Studies',
    subject: 'International Relations',
    date: '2026-11-06',
    endDate: '2026-11-13',
    duration: '8 Days',
    status: 'Upcoming',
    description: 'UN and its specialized agencies, IMF, World Bank, WTO, BRICS, SCO, G20 outcomes, Quad, ASEAN, and India’s neighborhood first policy.',
    descriptionTa: 'ஐக்கிய நாடுகள் சபை, உலக வங்கி, பிரிக்ஸ், ஜி20, குவாட் மற்றும் இந்தியாவின் அயலகக் கொள்கை.',
    syllabusTopics: [
      'G20 & BRICS 2026 Declarations',
      'India-Middle East-Europe Economic Corridor (IMEC)',
      'Indian Ocean Region security & SAGAR initiative',
      'Bilateral MoUs and defense agreements signed in 2026'
    ]
  },
  {
    id: 'cal-2026-43',
    title: 'Test Plan: TNPSC Group II Mains Descriptive Full Model Paper',
    titleTa: 'தேர்வு திட்டம்: குரூப் 2 முதன்மைத் தேர்வு விரிவான மாதிரித் தேர்வு',
    type: 'test',
    category: 'TNPSC Group II/IIA',
    subject: 'Mains Paper 2 GS',
    date: '2026-11-15',
    duration: '3 Hours',
    status: 'Upcoming',
    description: 'Descriptive question paper with answer evaluation criteria, model answers, and expert faculty marks rubric.',
    descriptionTa: 'முதன்மைத் தேர்வுக்கான விரிவான விடையளிக்கும் மாதிரி தேர்வு மற்றும் மாதிரி விடைகள்.',
    syllabusTopics: ['Social Issues', 'Role of Science and Tech', 'Constitution & Governance', 'Tamil Nadu Development Administration'],
    testId: 'tnpsc-g2'
  },
  {
    id: 'cal-2026-44',
    title: 'Revision Plan: Mains Essay Writing & Precis / Translation Skills Workshop',
    titleTa: 'மீள்பார்வை திட்டம்: கட்டுரை வரைதல், சுருக்கி வரைதல் மற்றும் மொழிபெயர்ப்பு சிறப்பு பயிற்சி',
    type: 'revision',
    category: 'TNPSC Group II/IIA',
    subject: 'Mains Descriptive',
    date: '2026-11-17',
    endDate: '2026-11-20',
    duration: '4 Days',
    status: 'Upcoming',
    description: 'Special hands-on revision for Paper 1 Tamil Eligibility: Tamil to English translation, English to Tamil translation, Precis writing, and Hint development.',
    descriptionTa: 'கட்டாய தமிழ் தகுதித் தாள்: மொழிபெயர்ப்பு, சுருக்கி வரைதல் மற்றும் குறிப்பிலிருந்து விவரித்தல் பயிற்சி.',
    syllabusTopics: ['Translation formulas', 'Grammar tips', 'Scoring 40% qualification marks with ease']
  },

  // --- DECEMBER 2026 ---
  {
    id: 'cal-2026-45',
    title: 'Annual Planner 2027 Tentative Release by TNPSC & SSC',
    titleTa: 'டிஎன்பிஎஸ்சி மற்றும் எஸ்.எஸ்.சி 2027 ஆண்டுத் தேர்வு காலண்டர் வெளியீடு',
    type: 'notification',
    category: 'Civil Services',
    subject: 'Annual Planner',
    date: '2026-12-15',
    status: 'Upcoming',
    description: 'Tentative calendar release detailing recruitment drives, examination dates, and vacancy estimates for 2027.',
    descriptionTa: '2027-ஆம் ஆண்டிற்கான உத்தேச தேர்வு அட்டவணை மற்றும் காலிப்பணியிட விவரங்கள் வெளியீடு.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Annual_Planner_2027_Tentative.pdf'
  },
  {
    id: 'cal-2026-46',
    title: 'Test Plan: Year-End Grand Diagnostic Mock Test 2026 (All Subjects)',
    titleTa: 'தேர்வு திட்டம்: 2026 ஆண்டின் நிறைவு மெகா மாதிரித் தேர்வு (அனைத்து பாடங்கள்)',
    type: 'test',
    category: 'All Exams',
    subject: 'All 10 GS Units',
    date: '2026-12-20',
    duration: '3 Hours',
    status: 'Upcoming',
    description: 'Comprehensive 200 Questions test covering all topics studied throughout 2026 with year-end ranking and performance certificates.',
    descriptionTa: '2026 ஆண்டு முழுவதும் பயின்ற அனைத்து பாடங்களையும் உள்ளடக்கிய 200 வினாக்கள் கொண்ட பிரம்மாண்ட மாதிரி தேர்வு.',
    syllabusTopics: ['Complete GS Syllabus', 'Current Affairs 2026 Compilation', 'Aptitude & Mental Ability'],
    testId: 'tnpsc-g1'
  },
  {
    id: 'cal-2026-47',
    title: 'Revision Plan: Complete 2026 Year-In-Review & Annual Current Affairs Compendium',
    titleTa: 'மீள்பார்வை திட்டம்: 2026 ஆண்டின் முழு நடப்பு நிகழ்வுகள் மற்றும் ஆண்டு தொகுப்பு',
    type: 'revision',
    category: 'General Studies',
    subject: 'Current Affairs',
    date: '2026-12-26',
    endDate: '2026-12-30',
    duration: '5 Days',
    status: 'Upcoming',
    description: 'Master revision of all major national/international occurrences, awards, government policies, economic milestones, and new legislation enacted in 2026.',
    descriptionTa: '2026 ஆம் ஆண்டின் அனைத்து முக்கிய நிகழ்வுகள், விருதுகள், மற்றும் புதிய சட்டங்கள் முழுமையான திருப்புதல்.',
    syllabusTopics: [
      'Top 1000 Current Affairs questions of 2026',
      'Annual Science & Tech roundup',
      'Sports champions & tournaments 2026',
      'Yearly awards list & personality profiles'
    ]
  }
];
