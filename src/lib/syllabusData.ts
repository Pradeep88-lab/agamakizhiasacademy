export interface ExamSyllabusItem {
  id: string;
  examName: string;
  category: string;
  pdfUrl: string;
  fileName: string;
  fileSize?: string;
  _pdfUrl_indexedDbKey?: string;
  description: string;
  topics: string[];
  lastUpdated?: string;
}

export const initialSyllabi: Record<string, ExamSyllabusItem> = {
  'tnpsc-g1': {
    id: 'tnpsc-g1',
    examName: 'TNPSC Group I',
    category: 'TNPSC Group I',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'TNPSC_Group_I_Official_Syllabus_2024.pdf',
    fileSize: '1.8 MB',
    description: 'The comprehensive syllabus covers all major topics required for the TNPSC Group I examination, updated according to the latest 2024 notifications.',
    topics: [
      'General Science (Physics, Chemistry, Botany, Zoology)',
      'Current Events (National & International, Sports, Awards)',
      'Geography of India & Tamil Nadu',
      'History and Culture of India',
      'Indian Polity & Constitution of India',
      'Indian Economy & Social Indicators',
      'Indian National Movement',
      'History, Culture, Heritage and Socio-Political Movements in TN',
      'Development Administration in Tamil Nadu',
      'Aptitude and Mental Ability (SSLC Standard)'
    ],
    lastUpdated: '2024-09-20'
  },
  'tnpsc-g2': {
    id: 'tnpsc-g2',
    examName: 'TNPSC Group II / IIA',
    category: 'TNPSC Group II / IIA',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'TNPSC_Group_II_IIA_Official_Syllabus.pdf',
    fileSize: '1.5 MB',
    description: 'Detailed syllabus for Preliminary and Main Written Examination for Combined Civil Services Examination-II (Group II and Group IIA Services).',
    topics: [
      'General Studies (Degree Standard)',
      'General Tamil / General English (SSLC Standard)',
      'Aptitude & Mental Ability',
      'Tamil Society & Tamil Literature',
      'Constitution & Governance of India'
    ],
    lastUpdated: '2024-09-18'
  },
  'tnpsc-g4': {
    id: 'tnpsc-g4',
    examName: 'TNPSC Group IV',
    category: 'TNPSC Group IV',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'TNPSC_Group_IV_VAO_Official_Syllabus.pdf',
    fileSize: '1.2 MB',
    description: 'Standard syllabus for Village Administrative Officer (VAO), Junior Assistant, Typist, and Bill Collector posts.',
    topics: [
      'General Science (SSLC Standard)',
      'Current Affairs & Geography',
      'History of India & Tamil Nadu',
      'Indian Polity & Economy',
      'Indian National Movement',
      'Aptitude & Mental Ability',
      'General Tamil (இலக்கணம், இலக்கியம், தமிழ் அறிஞர்களும் தமிழ்த் தொண்டும்)'
    ],
    lastUpdated: '2024-09-15'
  },
  'tnpsc-cts': {
    id: 'tnpsc-cts',
    examName: 'TNPSC CTS',
    category: 'TNPSC CTS',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'TNPSC_Combined_Technical_Services_Syllabus.pdf',
    fileSize: '2.1 MB',
    description: 'Combined Technical Services Examination (Degree / Diploma Standard) with Paper-I Subject Paper and Paper-II General Studies.',
    topics: [
      'Subject Paper (Engineering / Agriculture / Forensic / Specialized)',
      'General Studies (Degree Standard)',
      'Aptitude and Mental Ability (SSLC Standard)',
      'Tamil Eligibility Test (SSLC Standard)'
    ],
    lastUpdated: '2024-09-01'
  },
  'ssc': {
    id: 'ssc',
    examName: 'SSC',
    category: 'SSC',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'SSC_CGL_CHSL_Combined_Syllabus.pdf',
    fileSize: '1.6 MB',
    description: 'Tier-1 & Tier-2 Scheme of Examination covering Quantitative Aptitude, English Comprehension, Reasoning, and General Awareness.',
    topics: [
      'General Intelligence and Reasoning',
      'General Awareness & Static GK',
      'Quantitative Aptitude & Advanced Mathematics',
      'English Comprehension & Grammar',
      'Computer Knowledge & Typing Skills'
    ],
    lastUpdated: '2024-09-10'
  },
  'railway': {
    id: 'railway',
    examName: 'Railway',
    category: 'Railway',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'RRB_NTPC_ALP_Official_Syllabus.pdf',
    fileSize: '1.4 MB',
    description: 'Computer Based Test (CBT-1 & CBT-2) syllabus for Non-Technical Popular Categories and Assistant Loco Pilot.',
    topics: [
      'Mathematics (Number System, Decimals, Fractions, LCM, HCF, Ratio)',
      'General Intelligence and Reasoning',
      'General Awareness (Current Events, Science, History, Governance)',
      'Basic Science and Engineering (For Technical Posts)'
    ],
    lastUpdated: '2024-09-12'
  },
  'trt': {
    id: 'trt',
    examName: 'TRT',
    category: 'TRT',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'TRB_Teachers_Recruitment_Syllabus.pdf',
    fileSize: '1.9 MB',
    description: 'Tamil Nadu Teachers Recruitment Board (TRB) PG Assistants and Graduate Teachers Syllabus.',
    topics: [
      'Main Subject Specialization (Post Graduate Standard)',
      'Educational Methodology & Teaching Pedagogy',
      'General Knowledge & Current Affairs'
    ],
    lastUpdated: '2024-09-08'
  },
  'tet': {
    id: 'tet',
    examName: 'TET',
    category: 'TET',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'TNTET_Paper_I_II_Syllabus.pdf',
    fileSize: '1.3 MB',
    description: 'Teacher Eligibility Test Syllabus for Paper I (Classes I to V) and Paper II (Classes VI to VIII).',
    topics: [
      'Child Development and Pedagogy',
      'Language I (Tamil)',
      'Language II (English)',
      'Mathematics',
      'Environmental Studies / Science / Social Science'
    ],
    lastUpdated: '2024-09-05'
  }
};
