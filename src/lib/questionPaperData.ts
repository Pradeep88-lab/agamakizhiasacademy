export interface QuestionPaperItem {
  id: string;
  title: string;
  category: string;
  year: string;
  totalMarks: number;
  questionsCount: number;
  duration: string;
  paperPdfUrl: string;
  paperFileName: string;
  _paperPdf_indexedDbKey?: string;
  answerPdfUrl: string;
  answerFileName: string;
  _answerPdf_indexedDbKey?: string;
  description?: string;
  createdAt?: string;
}

export const initialQuestionPapers: QuestionPaperItem[] = [
  {
    id: 'qp-1',
    title: 'TNPSC Group I Prelims - GS Official Model Paper 2024',
    category: 'TNPSC Group I',
    year: '2024',
    totalMarks: 200,
    questionsCount: 200,
    duration: '3 Hours',
    paperPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    paperFileName: 'TNPSC_Group1_GS_Paper_2024.pdf',
    answerPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    answerFileName: 'TNPSC_Group1_GS_AnswerKey_2024.pdf',
    description: 'General Studies official model paper covering History, Polity, Geography, Aptitude, and Tamil Society.'
  },
  {
    id: 'qp-2',
    title: 'UPSC Civil Services Prelims GS Paper 1 - Solved Paper',
    category: 'UPSC CSE',
    year: '2023',
    totalMarks: 200,
    questionsCount: 100,
    duration: '2 Hours',
    paperPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    paperFileName: 'UPSC_GS1_2023_QuestionPaper.pdf',
    answerPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    answerFileName: 'UPSC_GS1_2023_Official_Keys.pdf',
    description: 'Complete solved paper with authentic keys and sectional breakdowns.'
  },
  {
    id: 'qp-3',
    title: 'SSC CGL Tier 1 - General Awareness & Reasoning 2023',
    category: 'SSC',
    year: '2023',
    totalMarks: 200,
    questionsCount: 100,
    duration: '1 Hour',
    paperPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    paperFileName: 'SSC_CGL_2023_Tier1_Paper.pdf',
    answerPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    answerFileName: 'SSC_CGL_2023_Tier1_AnswerKey.pdf',
    description: 'Tier 1 examination question paper with official answer keys.'
  },
  {
    id: 'qp-4',
    title: 'Railway RRB Non-Technical Popular Categories (NTPC) Stage 1',
    category: 'Railway',
    year: '2022',
    totalMarks: 100,
    questionsCount: 100,
    duration: '90 Mins',
    paperPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    paperFileName: 'RRB_NTPC_CBT1_Paper_2022.pdf',
    answerPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    answerFileName: 'RRB_NTPC_CBT1_Key_2022.pdf',
    description: 'Official CBT-1 examination paper and answer key.'
  },
  {
    id: 'qp-5',
    title: 'TNPSC Group II / IIA Combined Civil Services Model Paper',
    category: 'TNPSC Group II / IIA',
    year: '2024',
    totalMarks: 300,
    questionsCount: 200,
    duration: '3 Hours',
    paperPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    paperFileName: 'TNPSC_Group2_Model_Question_Paper.pdf',
    answerPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    answerFileName: 'TNPSC_Group2_Official_Key.pdf',
    description: 'Preliminary General Studies and Language examination paper.'
  },
  {
    id: 'qp-6',
    title: 'TNPSC Group IV & VAO Previous Year Solved Paper',
    category: 'TNPSC Group IV',
    year: '2024',
    totalMarks: 300,
    questionsCount: 200,
    duration: '3 Hours',
    paperPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    paperFileName: 'TNPSC_Group4_VAO_Solved_Paper.pdf',
    answerPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    answerFileName: 'TNPSC_Group4_VAO_Key.pdf',
    description: 'Official SSLC standard exam paper covering General Tamil & General Studies.'
  },
  {
    id: 'qp-7',
    title: 'TNPSC CTS (Combined Technical Services) Paper 1 & 2',
    category: 'TNPSC CTS',
    year: '2024',
    totalMarks: 300,
    questionsCount: 200,
    duration: '3 Hours',
    paperPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    paperFileName: 'TNPSC_CTS_Technical_Paper_2024.pdf',
    answerPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    answerFileName: 'TNPSC_CTS_Answer_Key.pdf',
    description: 'Degree / Diploma standard official model question paper with solutions.'
  },
  {
    id: 'qp-8',
    title: 'TRT (Teachers Recruitment Board) Graduate Teachers Paper',
    category: 'TRT',
    year: '2023',
    totalMarks: 150,
    questionsCount: 150,
    duration: '3 Hours',
    paperPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    paperFileName: 'TRB_TRT_Teachers_Paper_2023.pdf',
    answerPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    answerFileName: 'TRB_TRT_Teachers_Key.pdf',
    description: 'Official teachers recruitment subject test with pedagogy & GK.'
  },
  {
    id: 'qp-9',
    title: 'TNTET Teacher Eligibility Test Paper I & II Model Paper',
    category: 'TET',
    year: '2023',
    totalMarks: 150,
    questionsCount: 150,
    duration: '3 Hours',
    paperPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    paperFileName: 'TNTET_Paper1_2_Model_2023.pdf',
    answerPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    answerFileName: 'TNTET_Model_Key.pdf',
    description: 'Child pedagogy, Language, Mathematics & Environmental Studies.'
  }
];
