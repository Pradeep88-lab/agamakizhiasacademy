import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Plus,
  Trash2,
  Save,
  X,
  HelpCircle,
  Bell,
  Search,
  CheckCircle2,
  Loader2,
  LogOut,
  Upload,
  Video,
  Award,
  Play,
  FileDown,
  Eye,
  Edit3,
  BarChart3,
  User,
  ExternalLink,
  FileCheck,
  Calendar,
  Sparkles,
  BookOpen,
  Clock,
  Layers,
  CheckSquare,
  Check,
  ChevronRight,
  RotateCcw,
  RefreshCw,
  Library,
  Download
} from 'lucide-react';
import { db } from '../../lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { safeLocalStorageSet, storeBlob, getBlob, openPdfPreview, downloadPdfFile } from '../../lib/storage';
import { formatVideoEmbed } from '../../lib/videoUtils';
import { ExamSyllabusItem, initialSyllabi } from '../../lib/syllabusData';
import { initialFullMockQuizzes } from '../../lib/quizData';
import { downloadAdminResultsMasterPdf, downloadSingleResultPdf, download2026CalendarPlanPdf } from '../../lib/pdfReportGenerator';
import { initial2026CalendarPlan, CalendarPlanItem, PlanType } from '../../lib/calendarPlan2026Data';
import logoImage from '../../assets/images/regenerated_image_1790577966199.jpg';
import AdminStorePanel from './AdminStorePanel';

export type AdminTab = 'chapters' | 'syllabus' | 'questions' | 'results' | 'notifications' | 'store';

// Helper to convert any video URL to embed format
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const info = formatVideoEmbed(url);
  return info.embedUrl;
}

const scienceTamilDictionary: Record<string, string> = {
  // Scientific Laws & Concepts
  'Conservation of Linear Momentum': 'நேர்க்கோட்டு உந்த மாறாக் கோட்பாடு',
  "Bernoulli's Principle": 'பெர்னௌலி தத்துவம்',
  "Pascal's Law": 'பாஸ்கல் விதி',
  'Law of Universal Gravitation': 'அகில ஈர்ப்பு விதி',
  'Lumen': 'லூமன் (Lumen)',
  'Candela': 'கேண்டெலா (Candela)',
  'Lux': 'லக்ஸ் (Lux)',
  'Watt': 'வாட் (Watt)',
  'Inertia of Direction': 'திசைக்கான நிலைமம்',
  'Inertia of Rest': 'ஓய்விற்கான நிலைமம்',
  'Inertia of Motion': 'இயக்கத்திற்கான நிலைமம்',
  'Gravitational pull': 'புவியீர்ப்பு விசை',
  'Velocity': 'திசைவேகம்',
  'Acceleration': 'முடுக்கம்',
  'Work': 'வேலை',
  'Linear Momentum': 'நேர்க்கோட்டு உந்தம்',
  '[M L T⁻¹]': '[M L T⁻¹] (உந்தம்)',
  '[M L T⁻²]': '[M L T⁻²] (விசை)',
  '[M L² T⁻²]': '[M L² T⁻²] (ஆற்றல்)',
  '[M L⁻¹ T⁻²]': '[M L⁻¹ T⁻²] (அழுத்தம்)',

  // AU Question & Options
  'What is the average distance represented by one Astronomical Unit (AU), commonly used to measure distances within our solar system?': 'சூரியக் குடும்பத்திற்குள் உள்ள தொலைவுகளை அளவிடப் பயன்படும் ஒரு வானியல் அலகு (AU) குறிக்கும் சராசரி தொலைவு என்ன?',
  '1.496 × 10¹¹ m (149.6 Million km)': '1.496 × 10¹¹ மீ (149.6 மில்லியன் கி.மீ)',
  '9.46 × 10¹⁵ m (Light Year)': '9.46 × 10¹⁵ மீ (ஒளி ஆண்டு)',
  '3.08 × 10¹⁶ m (Parsec)': '3.08 × 10¹⁶ மீ (விண்ணியல் ஆரம்)',
  '3 × 10⁸ m/s (Speed of Light)': '3 × 10⁸ மீ/வி (ஒளியின் வேகம்)',
  '1 Astronomical Unit (AU) is the mean distance between the Earth and the Sun, equal to 1.496 × 10¹¹ meters.': '1 வானியல் அலகு (AU) என்பது பூமிக்கும் சூரியனுக்கும் இடைப்பட்ட சராசரி தொலைவு ஆகும். இதன் மதிப்பு 1.496 × 10¹¹ மீட்டர்கள் (சுமார் 149.6 மில்லியன் கி.மீ).',

  // Rocket Propulsion
  'Rocket propulsion is an application of which fundamental physical law?': 'ராக்கெட் ஏவுதல் எந்த அடிப்படை இயற்பியல் விதியின் பயன்பாடாகும்?',
  'Rocket propulsion functions strictly on which fundamental physical principle?': 'ராக்கெட் ஏவுதல் எந்த அடிப்படை இயற்பியல் விதியின் அடிப்படையில் செயல்படுகிறது?',
  'Rocket propulsion is an application of Newton\'s third law and the conservation of linear momentum.': 'ராக்கெட் ஏவுதல் என்பது நியூட்டனின் மூன்றாம் விதி மற்றும் நேர்க்கோட்டு உந்த மாறாக் கோட்பாட்டின் அடிப்படையில் செயல்படுகிறது.',
  'Rocket propulsion functions on Newton\'s third law and the conservation of linear momentum.': 'ராக்கெட் ஏவுதல் என்பது நியூட்டனின் மூன்றாம் விதி மற்றும் நேர்க்கோட்டு உந்த மாறாக் கோட்பாட்டின் அடிப்படையில் செயல்படுகிறது.',

  // Luminous Intensity
  'Which of the following is the base SI unit of Luminous Intensity?': 'ஒளிச்செறிவின் (Luminous Intensity) அடிப்படை SI அலகு எது?',
  'Which of the following is the SI unit of Luminous Intensity?': 'ஒளிச்செறிவின் அடிப்படை SI அலகு எது?',
  'Candela (cd) is the base SI unit for measuring luminous intensity in a given direction.': 'ஒரு குறிப்பிட்ட திசையில் ஒளிச்செறிவை அளவிடுவதற்கான அடிப்படை SI அலகு கேண்டெலா (cd) ஆகும்.',
  'Candela (cd) is the base SI unit for measuring luminous intensity.': 'ஒளிச்செறிவை அளவிடுவதற்கான அடிப்படை SI அலகு கேண்டெலா (cd) ஆகும்.',

  // Bus Inertia
  'When a moving bus suddenly applies brakes, the passengers jerk forward due to which phenomenon?': 'இயங்கிக் கொண்டிருக்கும் பேருந்து திடீரென நிறுத்தப்படும் போது, பயணிகள் முன்னோக்கி சாயக் காரணம் என்ன?',
  'The lower body comes to rest with the vehicle, but the upper body continues moving due to Inertia of Motion.': 'பேருந்து நின்றாலும் உடலின் மேற்பகுதி தொடர்ந்து இயக்கத்திலேயே இருக்க முயல்வதால் இயக்கத்திற்கான நிலைமம் காரணமாக பயணிகள் முன்னோக்கி சாய்கின்றனர்.',

  // Force Dimension
  'What is the dimensional formula for Force?': 'விசையின் (Force) பரிமாண வாய்ப்பாடு என்ன?',
  'Force = Mass × Acceleration = [M] × [L T⁻²] = [M L T⁻²].': 'விசை = நிறை × முடுக்கம் = [M] × [L T⁻²] = [M L T⁻²].'
};

export const EXAM_CATEGORIES = [
  'TNPSC Group I',
  'TNPSC Group II / IIA',
  'TNPSC Group IV',
  'TNPSC CTS',
  'SSC',
  'Railway',
  'TRT',
  'TET'
];

const subjectOptions = [
  { id: 'maths', name: 'Maths' },
  { id: 'reasoning', name: 'Reasoning' },
  { id: 'physics', name: 'Physics' },
  { id: 'chemistry', name: 'Chemistry' },
  { id: 'biology', name: 'Biology' },
  { id: 'history', name: 'History' },
  { id: 'polity', name: 'Polity' },
  { id: 'geography', name: 'Geography' },
  { id: 'environment', name: 'Environment' },
  { id: 'tamil', name: 'Tamil' },
  { id: 'english', name: 'English' },
  { id: 'current-affairs', name: 'Current Affairs' },
];

export interface ChapterModuleForm {
  examCategory?: string;
  subjectId: string;
  chapterNumber: number;
  titleEn: string;
  titleTa: string;
  duration: string;
  summaryEn: string;
  summaryTa: string;
  keyPoints: Array<{ title: string; desc: string; titleTa?: string; descTa?: string }>;
  videoUrl: string;
  videoTitle: string;
  faculty: string;
  quiz: Array<{
    question: string;
    questionTa?: string;
    options: string[];
    optionsTa?: string[];
    correct: number;
    explanation: string;
    explanationTa?: string;
  }>;
  pdfUrl: string;
  pdfFileName: string;
  pdfTitle: string;
  pdfSize?: string;
  _pdfUrl_indexedDbKey?: string;
  pdfs?: Array<{
    pdfUrl: string;
    pdfFileName: string;
    pdfTitle: string;
    pdfSize?: string;
    _pdfUrl_indexedDbKey?: string;
  }>;
}

export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<AdminTab>('chapters');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [chapterQuizLang, setChapterQuizLang] = useState<'english' | 'tamil'>('english');

  // Data states
  const [chapterModules, setChapterModules] = useState<Record<string, any>>({});
  const [notifications, setNotifications] = useState<any[]>(() => {
    try {
      const local = localStorage.getItem('agamakizh_calendar_plan_2026');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { }
    return initial2026CalendarPlan;
  });
  const [studentResults, setStudentResults] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [previewQuiz, setPreviewQuiz] = useState<any | null>(null);
  const [previewLang, setPreviewLang] = useState<'both' | 'en' | 'ta'>('both');

  // 0. Chapter Learning Modules Form State (PDF chapter, video, practice test, study notes & key concepts)
  const [chapterForm, setChapterForm] = useState<ChapterModuleForm>(() => {
    try {
      const savedModules = JSON.parse(localStorage.getItem('agamakizh_chapter_modules') || '{}');
      if (savedModules['TNPSC Group I_physics_ch_1']) {
        return savedModules['TNPSC Group I_physics_ch_1'];
      }
      if (savedModules['physics_ch_1']) {
        return { examCategory: 'TNPSC Group I', ...savedModules['physics_ch_1'] };
      }
    } catch (e) {
      console.error(e);
    }
    return {
      examCategory: 'TNPSC Group I',
      subjectId: 'physics',
      chapterNumber: 1,
      titleEn: 'Nature of Universe & Measurement of Quantities',
      titleTa: 'பிரபஞ்சத்தின் இயல்பு மற்றும் இயற்பியல் அளவுகளின் அளவீடு',
      duration: '45 mins',
      // 1. Study Notes & Key Concepts
      summaryEn: 'Nature of Universe - Measurement of physical quantities - General scientific laws in motion - force, pressure, and energy',
      summaryTa: 'SI அலகுகள், திசையிலிகள் மற்றும் திசையன்கள், நியூட்டனின் மூன்று இயக்க விதிகள், நிலைமம், உந்தம் மற்றும் உராய்வு பற்றிய முக்கிய குறிப்புகள்.',
      keyPoints: [
        {
          title: '1. Nature of Universe',
          desc: 'Basic Definitions & Measurement Units, Origin Theories & Galaxies, The Solar System, Other Celestial Objects, Quick Facts & Revisions for Exam Day.',
          titleTa: '1. பிரபஞ்சத்தின் இயல்பு மற்றும் அண்டவியல்',
          descTa: 'அடிப்படை வரையறைகள் & அளவீட்டு அலகுகள், அண்டத்தின் தோற்றம், விண்மீன் திரள்கள், சூரிய குடும்பம் மற்றும் கோள்களின் பண்புகள்.'
        },
        {
          title: '2. Measurement of physical quantities',
          desc: 'SI Base units (m, kg, s, A, K, mol, cd), Derived Units, and Dimensional Formulas for competitive examinations.',
          titleTa: '2. இயற்பியல் அளவுகளின் அளவீடு & SI அலகுகள்',
          descTa: 'அடிப்படை SI அலகுகள் (மீட்டர், கிலோகிராம், வினாடி, ஆம்பியர், கெல்வின், மோல், கேண்டெலா), வழி அலகுகள் மற்றும் பரிமாண வாய்ப்பாடுகள்.'
        },
        {
          title: '3. General scientific laws in motion',
          desc: 'Newton\'s three laws of motion, inertia of rest and motion, momentum, centripetal/centrifugal forces, and friction in machines.',
          titleTa: '3. இயக்கவியல் பொது அறிவியல் விதிகள்',
          descTa: 'நியூட்டனின் மூன்று இயக்க விதிகள், நிலைமத்தின் வகைகள் (ஓய்வு, இயக்கம், திசை), உந்தம் மற்றும் மையநோக்கு/மையவிலக்கு விசைகள்.'
        },
        {
          title: '4. force, pressure, and energy',
          desc: 'Gravitation laws, fluid pressure principles (Pascal & Archimedes), work-energy theorem, and conservation of kinetic and potential energy.',
          titleTa: '4. விசை, அழுத்தம் மற்றும் ஆற்றல் கோட்பாடுகள்',
          descTa: 'புவியீர்ப்பு விதி, பாஸ்கல் மற்றும் ஆர்க்கிமிடிஸ் பாய்ம அழுத்த விதிகள், வேலை-ஆற்றல் தேற்றம் மற்றும் ஆற்றல் மாறாக் கோட்பாடு.'
        }
      ],
      // 2. Video Class
      videoUrl: 'https://www.youtube.com/watch?v=zEaBIuPyL0w',
      videoTitle: 'MISSION 100 | Group -1 Prelims | Day - 2 | PHYSICS - 1 | Nature of Universe | Mr. Vijaya kumar',
      faculty: 'Dr. S. K. Raman',
      // 3. Practice Test (MCQs - English & Tamil Medium)
      quiz: [
        {
          question: 'What is the average distance represented by one Astronomical Unit (AU), commonly used to measure distances within our solar system?',
          questionTa: 'சூரியக் குடும்பத்திற்குள் உள்ள தொலைவுகளை அளவிடப் பயன்படும் ஒரு வானியல் அலகு (AU) குறிக்கும் சராசரி தொலைவு என்ன?',
          options: ['1.496 × 10¹¹ m (149.6 Million km)', '9.46 × 10¹⁵ m (Light Year)', '3.08 × 10¹⁶ m (Parsec)', '3 × 10⁸ m/s (Speed of Light)'],
          optionsTa: ['1.496 × 10¹¹ மீ (149.6 மில்லியன் கி.மீ)', '9.46 × 10¹⁵ மீ (ஒளி ஆண்டு)', '3.08 × 10¹⁶ மீ (விண்ணியல் ஆரம்)', '3 × 10⁸ மீ/வி (ஒளியின் வேகம்)'],
          correct: 0,
          explanation: '1 Astronomical Unit (AU) is the mean distance between the Earth and the Sun, equal to 1.496 × 10¹¹ meters.',
          explanationTa: '1 வானியல் அலகு (AU) என்பது பூமிக்கும் சூரியனுக்கும் இடைப்பட்ட சராசரி தொலைவு ஆகும். இதன் மதிப்பு 1.496 × 10¹¹ மீட்டர்கள் (சுமார் 149.6 மில்லியன் கி.மீ).'
        },
        {
          question: 'Rocket propulsion is an application of which fundamental physical law?',
          questionTa: 'ராக்கெட் ஏவுதல் எந்த அடிப்படை இயற்பியல் விதியின் பயன்பாடாகும்?',
          options: ['Conservation of Linear Momentum', 'Bernoulli\'s Principle', 'Pascal\'s Law', 'Law of Universal Gravitation'],
          optionsTa: ['நேர்க்கோட்டு உந்த மாறாக் கோட்பாடு', 'பெர்னௌலி தத்துவம்', 'பாஸ்கல் விதி', 'அகில ஈர்ப்பு விதி'],
          correct: 0,
          explanation: 'Rocket propulsion functions on Newton\'s third law and the conservation of linear momentum.',
          explanationTa: 'ராக்கெட் ஏவுதல் என்பது நியூட்டனின் மூன்றாம் விதி மற்றும் நேர்க்கோட்டு உந்த மாறாக் கோட்பாட்டின் அடிப்படையில் செயல்படுகிறது.'
        },
        {
          question: 'Which of the following is the base SI unit of Luminous Intensity?',
          questionTa: 'ஒளிச்செறிவின் (Luminous Intensity) அடிப்படை SI அலகு எது?',
          options: ['Lumen', 'Candela', 'Lux', 'Watt'],
          optionsTa: ['லூமன் (Lumen)', 'கேண்டெலா (Candela)', 'லக்ஸ் (Lux)', 'வாட் (Watt)'],
          correct: 1,
          explanation: 'Candela (cd) is the base SI unit for measuring luminous intensity.',
          explanationTa: 'ஒளிச்செறிவை அளவிடுவதற்கான அடிப்படை SI அலகு கேண்டெலா (cd) ஆகும்.'
        },
        {
          question: 'When a moving bus suddenly applies brakes, the passengers jerk forward due to which phenomenon?',
          questionTa: 'இயங்கிக் கொண்டிருக்கும் பேருந்து திடீரென நிறுத்தப்படும் போது, பயணிகள் முன்னோக்கி சாயக் காரணம் என்ன?',
          options: ['Inertia of Direction', 'Inertia of Rest', 'Inertia of Motion', 'Gravitational pull'],
          optionsTa: ['திசைக்கான நிலைமம்', 'ஓய்விற்கான நிலைமம்', 'இயக்கத்திற்கான நிலைமம்', 'புவியீர்ப்பு விசை'],
          correct: 2,
          explanation: 'The lower body comes to rest with the vehicle, but the upper body continues moving due to Inertia of Motion.',
          explanationTa: 'பேருந்து நின்றாலும் உடலின் மேற்பகுதி தொடர்ந்து இயக்கத்திலேயே இருக்க முயல்வதால் இயக்கத்திற்கான நிலைமம் காரணமாக பயணிகள் முன்னோக்கி சாய்கின்றனர்.'
        },
        {
          question: 'What is the dimensional formula for Force?',
          questionTa: 'விசையின் (Force) பரிமாண வாய்ப்பாடு என்ன?',
          options: ['[M L T⁻¹]', '[M L T⁻²]', '[M L² T⁻²]', '[M L⁻¹ T⁻²]'],
          optionsTa: ['[M L T⁻¹] (உந்தம்)', '[M L T⁻²] (விசை)', '[M L² T⁻²] (ஆற்றல்)', '[M L⁻¹ T⁻²] (அழுத்தம்)'],
          correct: 1,
          explanation: 'Force = Mass × Acceleration = [M] × [L T⁻²] = [M L T⁻²].',
          explanationTa: 'விசை = நிறை × முடுக்கம் = [M] × [L T⁻²] = [M L T⁻²].'
        }
      ],
      // 4. PDF Chapter Upload
      pdfUrl: '',
      pdfFileName: '',
      pdfTitle: 'Physics_Chapter1_Comprehensive_Notes.pdf'
    };
  });

  // Syllabus Management State
  const [syllabi, setSyllabi] = useState<Record<string, ExamSyllabusItem>>(() => {
    const local = localStorage.getItem('agamakizh_exam_syllabi');
    if (local) {
      try {
        return { ...initialSyllabi, ...JSON.parse(local) };
      } catch { }
    }
    return initialSyllabi;
  });

  const [selectedSyllabusExamId, setSelectedSyllabusExamId] = useState<string>('tnpsc-g1');
  const [syllabusForm, setSyllabusForm] = useState<ExamSyllabusItem>(() => initialSyllabi['tnpsc-g1']);
  const [newSyllabusTopic, setNewSyllabusTopic] = useState('');

  // 3. Question Tests Form (Interactive Question Test Builder)
  const [quizForm, setQuizForm] = useState({
    title: '',
    category: 'TNPSC Group I',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'High',
    duration: '60 min',
    questionsCount: 1,
    questions: [
      {
        textEn: '',
        textTa: '',
        optionsEn: ['', '', '', ''],
        optionsTa: ['', '', '', ''],
        correctOption: 0,
        explanationEn: '',
        explanationTa: ''
      }
    ]
  });

  // 4. Student Results / Marks Form
  const [resultForm, setResultForm] = useState({
    studentName: '',
    rollNo: '',
    examName: 'TNPSC Group I - Prelims Mock 1',
    category: 'TNPSC Group I',
    marksScored: 142,
    totalMarks: 200,
    rank: '1',
    status: 'Passed',
    date: new Date().toISOString().split('T')[0]
  });

  // 5. 2026 Calendar & Comprehensive Study Plan Form
  const [notifForm, setNotifForm] = useState({
    title: '',
    titleTa: '',
    type: 'subject' as PlanType,
    category: 'TNPSC Group I',
    subject: 'Indian Polity',
    date: '2026-01-15',
    duration: '7 Days',
    status: 'Upcoming',
    description: '',
    syllabusTopics: '',
    pdfUrl: '',
    fileName: ''
  });
  const [calendarAdminFilter, setCalendarAdminFilter] = useState<string>('all');
  const [editingNotifId, setEditingNotifId] = useState<string | null>(null);
  const [calendarSearchTerm, setCalendarSearchTerm] = useState('');

  // Initial Seed Data
  const getInitialResults = () => [];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 0. Load Chapter Modules
      const localChapters = JSON.parse(localStorage.getItem('agamakizh_chapter_modules') || '{}');
      setChapterModules(localChapters);

      // Automatically sync active chapter form if saved in storage
      const currentKey = `${chapterForm.subjectId}_ch_${chapterForm.chapterNumber}`;
      if (localChapters[currentKey]) {
        setChapterForm(localChapters[currentKey]);
      }

      if (activeTab === 'questions') {
        const local = JSON.parse(localStorage.getItem('agamakizh_admin_quizzes') || 'null');
        try {
          const snap = await getDocs(collection(db, 'quizzes'));
          const remote = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          const list = (remote.length > 0 ? remote : (local || []))
            .filter((q: any) => q.id !== 1 && q.id !== 2 && q.id !== 3 && q.id !== 4 && q.id !== 5 && !['TNPSC Group I - Full Length Mock', 'SSC CGL Tier 1 - Mock Test 01', 'Railway RRB NTPC - Mock Test', 'Indian Polity - Fundamentals', 'Physics - Mechanics & Motion'].includes(q.title));
          setQuizzes(list);
        } catch {
          const list = (local || [])
            .filter((q: any) => q.id !== 1 && q.id !== 2 && q.id !== 3 && q.id !== 4 && q.id !== 5 && !['TNPSC Group I - Full Length Mock', 'SSC CGL Tier 1 - Mock Test 01', 'Railway RRB NTPC - Mock Test', 'Indian Polity - Fundamentals', 'Physics - Mechanics & Motion'].includes(q.title));
          setQuizzes(list);
        }
      } else if (activeTab === 'results') {
        const local = JSON.parse(localStorage.getItem('agamakizh_admin_results') || 'null');
        try {
          const snap = await getDocs(collection(db, 'studentResults'));
          const remote = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          const list = (remote.length > 0 ? remote : (local || []))
            .filter((r: any) => !['TNPSC Group I - Prelims Mock 1', 'SSC CGL - Quant Sectional', 'Railway RRB NTPC - Mock 4', 'TNPSC Group IV - Full Length', 'SSC CHSL - English Tier 1'].includes(r.exam || r.examName));
          setStudentResults(list);
          safeLocalStorageSet('agamakizh_admin_results', list);
        } catch {
          const list = (local || [])
            .filter((r: any) => !['TNPSC Group I - Prelims Mock 1', 'SSC CGL - Quant Sectional', 'Railway RRB NTPC - Mock 4', 'TNPSC Group IV - Full Length', 'SSC CHSL - English Tier 1'].includes(r.exam || r.examName));
          setStudentResults(list);
          safeLocalStorageSet('agamakizh_admin_results', list);
        }
      } else if (activeTab === 'notifications') {
        const local = JSON.parse(localStorage.getItem('agamakizh_calendar_plan_2026') || 'null');
        try {
          const q = query(collection(db, 'calendarPlans'), orderBy('date', 'asc'));
          const snap = await getDocs(q);
          const remote = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          const list = remote.length > 0 ? remote : (local && local.length > 0 ? local : initial2026CalendarPlan);
          setNotifications(list);
          safeLocalStorageSet('agamakizh_calendar_plan_2026', list);
        } catch {
          const list = local && local.length > 0 ? local : initial2026CalendarPlan;
          setNotifications(list);
          safeLocalStorageSet('agamakizh_calendar_plan_2026', list);
        }
      }

      // 7. Load Exam Syllabi
      const localSyllabi = localStorage.getItem('agamakizh_exam_syllabi');
      if (localSyllabi) {
        try {
          const parsed = JSON.parse(localSyllabi);
          setSyllabi(prev => ({ ...prev, ...parsed }));
          if (parsed[selectedSyllabusExamId]) {
            setSyllabusForm(parsed[selectedSyllabusExamId]);
          }
        } catch { }
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Manual Full Refresh of Admin, Chapter Data and Syllabi
  const handleManualRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchData();
      const local = JSON.parse(localStorage.getItem('agamakizh_chapter_modules') || '{}');
      const currentKey = `${chapterForm.subjectId}_ch_${chapterForm.chapterNumber}`;
      if (local[currentKey]) {
        let loaded = local[currentKey];
        if (!loaded.pdfUrl && loaded._pdfUrl_indexedDbKey) {
          const blobData = await getBlob(loaded._pdfUrl_indexedDbKey);
          if (blobData) {
            loaded = { ...loaded, pdfUrl: blobData };
          }
        }
        setChapterForm(loaded);
      }

      const localSyllabi = localStorage.getItem('agamakizh_exam_syllabi');
      if (localSyllabi) {
        try {
          const parsed = JSON.parse(localSyllabi);
          setSyllabi(prev => ({ ...prev, ...parsed }));
          if (parsed[selectedSyllabusExamId]) {
            setSyllabusForm(parsed[selectedSyllabusExamId]);
          }
        } catch { }
      }
      setSuccessMessage('Admin Console, Syllabi & Study PDFs Refreshed!');
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Syllabus Handlers
  const handleSelectSyllabusExam = (examId: string) => {
    setSelectedSyllabusExamId(examId);
    const existing = syllabi[examId] || initialSyllabi[examId];
    if (existing) {
      setSyllabusForm(existing);
    }
  };

  const handleSyllabusPdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Please select a valid PDF file.');
      return;
    }

    const sizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      const blobKey = `syllabus_pdf_${selectedSyllabusExamId}_${Date.now()}`;
      await storeBlob(blobKey, dataUrl);

      setSyllabusForm(prev => ({
        ...prev,
        pdfUrl: dataUrl,
        fileName: file.name,
        fileSize: sizeFormatted,
        _pdfUrl_indexedDbKey: blobKey
      }));
      setSuccessMessage(`Attached Syllabus ${file.name} (${sizeFormatted})! Click "Save & Publish" to update.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSyllabusPdf = () => {
    setSyllabusForm(prev => ({
      ...prev,
      pdfUrl: '',
      fileName: '',
      fileSize: undefined,
      _pdfUrl_indexedDbKey: undefined
    }));
    setSuccessMessage('Attached Syllabus PDF removed.');
    setTimeout(() => setSuccessMessage(''), 2500);
  };

  const handleAddSyllabusTopic = () => {
    if (!newSyllabusTopic.trim()) return;
    setSyllabusForm(prev => ({
      ...prev,
      topics: [...prev.topics, newSyllabusTopic.trim()]
    }));
    setNewSyllabusTopic('');
  };

  const handleRemoveSyllabusTopic = (index: number) => {
    setSyllabusForm(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index)
    }));
  };

  const handleSaveSyllabus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const updatedForm = {
      ...syllabusForm,
      lastUpdated: new Date().toISOString()
    };
    try {
      try {
        await setDoc(doc(db, 'examSyllabi', selectedSyllabusExamId), updatedForm);
      } catch (err) {
        console.warn('Firestore syllabus write fallback:', err);
      }

      const updated = {
        ...syllabi,
        [selectedSyllabusExamId]: updatedForm
      };
      setSyllabi(updated);
      safeLocalStorageSet('agamakizh_exam_syllabi', updated);

      // Broadcast to student portal
      window.dispatchEvent(new CustomEvent('agamakizh_syllabus_updated', {
        detail: { examId: selectedSyllabusExamId, syllabus: updatedForm }
      }));
      try {
        const bc = new BroadcastChannel('agamakizh_channel');
        bc.postMessage({ type: 'SYLLABUS_UPDATED', examId: selectedSyllabusExamId, syllabus: updatedForm });
      } catch { }

      setSuccessMessage(`Official Syllabus for ${updatedForm.examName} Published to Student Portal!`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(''), 3500);
    }
  };

  // Handle PDF Upload for Chapter Module with IndexedDB persistence
  const handleChapterPdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Please select a valid PDF file.');
      return;
    }

    const sizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      const blobKey = `chapter_pdf_${chapterForm.subjectId}_ch_${chapterForm.chapterNumber}_${Date.now()}`;
      await storeBlob(blobKey, dataUrl);

      const newPdf = {
        pdfUrl: dataUrl,
        pdfFileName: file.name,
        pdfTitle: file.name,
        pdfSize: sizeFormatted,
        _pdfUrl_indexedDbKey: blobKey
      };

      setChapterForm(prev => ({
        ...prev,
        pdfs: [...(prev.pdfs || []), newPdf]
      }));
      setSuccessMessage(`Attached ${file.name} (${sizeFormatted})! Click "Save & Publish" to update.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    };
    reader.readAsDataURL(file);
  };

  // Remove attached chapter PDF
  const handleRemoveChapterPdf = (index: number) => {
    setChapterForm(prev => {
      const newPdfs = [...(prev.pdfs || [])];
      newPdfs.splice(index, 1);
      return { ...prev, pdfs: newPdfs };
    });
    setSuccessMessage('Attached PDF removed. Click "Save & Publish" to update.');
    setTimeout(() => setSuccessMessage(''), 2500);
  };

  // Switch subject, chapter or exam category and load existing configuration
  const handleSelectSubjectOrChapter = (newSubjectId: string, newChapterNum: number, cat?: string) => {
    const currentCat = cat || chapterForm.examCategory || 'TNPSC Group I';
    const specificKey = `${currentCat}_${newSubjectId}_ch_${newChapterNum}`;
    const genericKey = `${newSubjectId}_ch_${newChapterNum}`;
    const local = JSON.parse(localStorage.getItem('agamakizh_chapter_modules') || '{}');
    const existing = chapterModules[specificKey] || chapterModules[genericKey] || local[specificKey] || local[genericKey];

    if (existing) {
      setChapterForm({ ...existing, examCategory: currentCat });
    } else {
      const subName = subjectOptions.find(s => s.id === newSubjectId)?.name || 'Subject';
      setChapterForm(prev => ({
        ...prev,
        examCategory: currentCat,
        subjectId: newSubjectId,
        chapterNumber: newChapterNum,
        titleEn: `${currentCat} - ${subName} Chapter ${newChapterNum}: Core Foundations & Practice`,
        titleTa: `${currentCat} - ${subName} அத்தியாயம் ${newChapterNum}: அடிப்படைக் கோட்பாடுகள்`,
        duration: '45 mins',
        summaryEn: `Detailed comprehensive notes, exam tips, and analysis for ${currentCat} - ${subName} Chapter ${newChapterNum}.`,
        summaryTa: `${currentCat} - ${subName} அத்தியாயம் ${newChapterNum} குறித்த விரிவான குறிப்புகள்.`,
        keyPoints: [
          { title: `1. Core Principles of Chapter ${newChapterNum}`, desc: `Essential definitions, principles, and applications for ${subName}.` },
          { title: `2. High-Yield Exam Trends`, desc: `Expected questions and high-weightage topics.` }
        ],
        videoUrl: 'https://www.youtube.com/watch?v=kY73_5Vq-uU',
        videoTitle: `${subName} Chapter ${newChapterNum} Lecture`,
        faculty: 'Academy Senior Faculty',
        quiz: [
          {
            question: `Which core concept is primary in ${subName} Chapter ${newChapterNum}?`,
            questionTa: `${subName} அத்தியாயம் ${newChapterNum}-ன் முதன்மை அடிப்படைக் கோட்பாடு எது?`,
            options: ['Basic Foundation', 'Advanced Analytical Application', 'Both A and B', 'None of the above'],
            optionsTa: ['அடிப்படை கோட்பாடுகள்', 'மேம்பட்ட பயன்பாடுகள்', 'A மற்றும் B இரண்டும்', 'மேற்கண்ட எதுவும் இல்லை'],
            correct: 2,
            explanation: `Both foundational concepts and practical problem solving are essential in ${subName} Chapter ${newChapterNum}.`,
            explanationTa: `அடிப்படை கோட்பாடுகள் மற்றும் பயன்பாடுகள் இரண்டும் தேர்வுக்கு அவசியமானவை.`
          }
        ],
        pdfUrl: '',
        pdfFileName: '',
        pdfTitle: `${subName}_Chapter${newChapterNum}_Notes.pdf`
      }));
    }
  };

  const handleSelectExamCategory = (newCat: string) => {
    handleSelectSubjectOrChapter(chapterForm.subjectId, chapterForm.chapterNumber, newCat);
  };

  // Save Chapter Learning Module
  const handleSaveChapterModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const specificKey = `${chapterForm.examCategory || 'TNPSC Group I'}_${chapterForm.subjectId}_ch_${chapterForm.chapterNumber}`;
    const key = `${chapterForm.subjectId}_ch_${chapterForm.chapterNumber}`;

    const videoInfo = formatVideoEmbed(chapterForm.videoUrl);
    
    // Strip large base64 strings from PDFs before saving to avoid quota limits
    const cleanedPdfs = (chapterForm.pdfs || []).map(pdf => ({
      ...pdf,
      pdfUrl: pdf.pdfUrl.startsWith('data:') ? 'local-indexeddb-blob' : pdf.pdfUrl
    }));
    
    const cleanedChapterForm = {
      ...chapterForm,
      videoUrl: videoInfo.embedUrl || chapterForm.videoUrl,
      pdfUrl: chapterForm.pdfUrl.startsWith('data:') ? 'local-indexeddb-blob' : chapterForm.pdfUrl,
      pdfs: cleanedPdfs,
      updatedAt: new Date().toISOString()
    };

    try {
      try {
        await setDoc(doc(db, 'chapterModules', specificKey), cleanedChapterForm);
        await setDoc(doc(db, 'chapterModules', key), cleanedChapterForm);
      } catch (err) {
        console.warn('Firestore write failed, saving locally:', err);
      }

      const updated = {
        ...chapterModules,
        [specificKey]: cleanedChapterForm,
        [key]: cleanedChapterForm
      };

      setChapterModules(updated);
      safeLocalStorageSet('agamakizh_chapter_modules', updated);

      // Broadcast and dispatch storage events so student portal reloads instantly
      window.dispatchEvent(new CustomEvent('agamakizh_chapter_updated', {
        detail: { key, chapterForm: cleanedChapterForm }
      }));
      try {
        const bc = new BroadcastChannel('agamakizh_channel');
        bc.postMessage({ type: 'CHAPTER_UPDATED', key, chapterForm: cleanedChapterForm });
      } catch { }

      setSuccessMessage(`Chapter ${chapterForm.chapterNumber} PDF & Module Saved & Published to Student Portal!`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(''), 3500);
    }
  };

  // Notification PDF Upload
  const handlePdfFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'notif') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Please select a valid PDF file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setNotifForm(prev => ({ ...prev, pdfUrl: dataUrl, fileName: file.name }));
    };
    reader.readAsDataURL(file);
  };

  // 4. Add Student Result / Marks
  const handleAddResult = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const percentage = Math.round((Number(resultForm.marksScored) / Number(resultForm.totalMarks)) * 100);
    const newEntry = {
      ...resultForm,
      id: `res-${Date.now()}`,
      percentage
    };

    try {
      try {
        const docRef = await addDoc(collection(db, 'studentResults'), newEntry);
        newEntry.id = docRef.id;
      } catch (err) {
        console.warn('Firestore write failed, saving locally:', err);
      }

      const updated = [newEntry, ...studentResults];
      setStudentResults(updated);
      safeLocalStorageSet('agamakizh_admin_results', updated);

      setResultForm(prev => ({
        ...prev,
        studentName: '',
        rollNo: '',
        marksScored: 150,
        rank: ''
      }));
      setSuccessMessage('Student Result & Marks Published!');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // 5. Add or Edit 2026 Academic Calendar / Study Plan Milestone
  const handleAddNotif = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifForm.title.trim()) {
      alert('Please enter a milestone title.');
      return;
    }
    setIsSaving(true);
    const topics = typeof notifForm.syllabusTopics === 'string'
      ? notifForm.syllabusTopics.split(',').map(s => s.trim()).filter(Boolean)
      : (Array.isArray(notifForm.syllabusTopics) ? notifForm.syllabusTopics : []);

    try {
      if (editingNotifId) {
        const updatedEntry: any = {
          ...notifForm,
          id: editingNotifId,
          syllabusTopics: topics,
          updatedAt: new Date().toISOString()
        };

        try {
          await setDoc(doc(db, 'calendarPlans', String(editingNotifId)), updatedEntry, { merge: true });
        } catch (err) {
          console.warn('Firestore write failed, saving locally:', err);
        }

        const updated = notifications.map(n => n.id === editingNotifId ? { ...n, ...updatedEntry } : n);
        setNotifications(updated);
        safeLocalStorageSet('agamakizh_calendar_plan_2026', updated);

        try {
          const bc = new BroadcastChannel('agamakizh_channel');
          bc.postMessage({ type: 'CALENDAR_PLAN_UPDATED', plans: updated });
        } catch { }

        window.dispatchEvent(new CustomEvent('agamakizh_calendar_plan_updated', {
          detail: { plans: updated }
        }));

        setEditingNotifId(null);
        setNotifForm({
          title: '',
          titleTa: '',
          type: 'subject',
          category: 'TNPSC Group I',
          subject: 'Indian Polity',
          date: '2026-01-15',
          duration: '7 Days',
          status: 'Upcoming',
          description: '',
          syllabusTopics: '',
          pdfUrl: '',
          fileName: ''
        });
        setSuccessMessage('2026 Plan Milestone Updated & Synced to Student Portal!');
      } else {
        const newEntry: any = {
          ...notifForm,
          id: `cal-2026-${Date.now()}`,
          syllabusTopics: topics
        };

        try {
          const docRef = await addDoc(collection(db, 'calendarPlans'), newEntry);
          newEntry.id = docRef.id;
        } catch (err) {
          console.warn('Firestore write failed, saving locally:', err);
        }

        const updated = [newEntry, ...notifications];
        setNotifications(updated);
        safeLocalStorageSet('agamakizh_calendar_plan_2026', updated);

        try {
          const bc = new BroadcastChannel('agamakizh_channel');
          bc.postMessage({ type: 'CALENDAR_PLAN_UPDATED', plans: updated });
        } catch { }

        window.dispatchEvent(new CustomEvent('agamakizh_calendar_plan_updated', {
          detail: { plans: updated }
        }));

        setNotifForm({
          title: '',
          titleTa: '',
          type: 'subject',
          category: 'TNPSC Group I',
          subject: 'Indian Polity',
          date: '2026-01-15',
          duration: '7 Days',
          status: 'Upcoming',
          description: '',
          syllabusTopics: '',
          pdfUrl: '',
          fileName: ''
        });
        setSuccessMessage('2026 Academic Plan Milestone Published & Synced to Student Portal!');
      }
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleEditNotif = (notif: any) => {
    setEditingNotifId(notif.id);
    setNotifForm({
      title: notif.title || '',
      titleTa: notif.titleTa || '',
      type: (notif.type as PlanType) || 'subject',
      category: notif.category || 'TNPSC Group I',
      subject: notif.subject || 'Indian Polity',
      date: notif.date || '2026-01-15',
      duration: notif.duration || '7 Days',
      status: notif.status || 'Upcoming',
      description: notif.description || '',
      syllabusTopics: Array.isArray(notif.syllabusTopics) ? notif.syllabusTopics.join(', ') : (notif.syllabusTopics || ''),
      pdfUrl: notif.pdfUrl || '',
      fileName: notif.fileName || ''
    });

    setSuccessMessage(`Editing: "${notif.title}". Make changes and click "Update 2026 Milestone".`);
    setTimeout(() => setSuccessMessage(''), 3500);

    setTimeout(() => {
      document.getElementById('calendar-plan-builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleCancelEditNotif = () => {
    setEditingNotifId(null);
    setNotifForm({
      title: '',
      titleTa: '',
      type: 'subject',
      category: 'TNPSC Group I',
      subject: 'Indian Polity',
      date: '2026-01-15',
      duration: '7 Days',
      status: 'Upcoming',
      description: '',
      syllabusTopics: '',
      pdfUrl: '',
      fileName: ''
    });
  };

  const handleResetCalendarPlans = async () => {
    if (!window.confirm('Reset & sync all 47 official 2026 Academic Milestones (Subject, Revision, Test, & Exam Notices)?')) return;
    setIsSaving(true);
    try {
      setNotifications(initial2026CalendarPlan);
      safeLocalStorageSet('agamakizh_calendar_plan_2026', initial2026CalendarPlan);

      try {
        const bc = new BroadcastChannel('agamakizh_channel');
        bc.postMessage({ type: 'CALENDAR_PLAN_UPDATED', plans: initial2026CalendarPlan });
      } catch { }

      window.dispatchEvent(new CustomEvent('agamakizh_calendar_plan_updated', {
        detail: { plans: initial2026CalendarPlan }
      }));

      setSuccessMessage('Successfully synced all 47 official 2026 Academic Milestones!');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleClearAllPlans = async () => {
    if (!window.confirm('Are you sure you want to delete ALL 2026 Calendar & Study Plans? This action cannot be undone.')) return;
    setIsSaving(true);
    try {
      try {
        const snap = await getDocs(collection(db, 'calendarPlans'));
        const deletePromises = snap.docs.map(d => deleteDoc(doc(db, 'calendarPlans', d.id)));
        await Promise.all(deletePromises);
      } catch (err) {
        console.warn('Firestore clear all plans fallback:', err);
      }

      setNotifications([]);
      safeLocalStorageSet('agamakizh_calendar_plan_2026', []);

      try {
        const bc = new BroadcastChannel('agamakizh_channel');
        bc.postMessage({ type: 'CALENDAR_PLAN_UPDATED', plans: [] });
      } catch { }

      window.dispatchEvent(new CustomEvent('agamakizh_calendar_plan_updated', {
        detail: { plans: [] }
      }));

      setSuccessMessage('All 2026 Calendar Plans deleted.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // 3. Edit Question Test
  const handleEditQuiz = (quiz: any) => {
    setEditingQuizId(quiz.id);

    // Extract raw questions
    const rawQuestions = Array.isArray(quiz.questionsList)
      ? quiz.questionsList
      : (Array.isArray(quiz.questions) ? quiz.questions : (Array.isArray(quiz.quiz) ? quiz.quiz : []));

    const mappedQuestions = rawQuestions.length > 0
      ? rawQuestions.map((q: any, qIdx: number) => {
        const optEn = Array.isArray(q.optionsEn) && q.optionsEn.length > 0
          ? q.optionsEn
          : (Array.isArray(q.options) && q.options.length > 0 ? q.options : ['', '', '', '']);
        const optTa = Array.isArray(q.optionsTa) && q.optionsTa.length > 0
          ? q.optionsTa
          : (Array.isArray(q.options) ? q.options.map(() => '') : ['', '', '', '']);

        const correct = typeof q.correctOption === 'number'
          ? q.correctOption
          : (typeof q.correctAnswer === 'number'
            ? q.correctAnswer
            : (typeof q.correct === 'number' ? q.correct : 0));

        return {
          textEn: q.textEn || q.question || `Question ${qIdx + 1}`,
          textTa: q.textTa || q.questionTa || '',
          optionsEn: [optEn[0] || '', optEn[1] || '', optEn[2] || '', optEn[3] || ''],
          optionsTa: [optTa[0] || '', optTa[1] || '', optTa[2] || '', optTa[3] || ''],
          correctOption: Math.max(0, Math.min(3, correct)),
          explanationEn: q.explanationEn || q.explanation || '',
          explanationTa: q.explanationTa || ''
        };
      })
      : [
        {
          textEn: '',
          textTa: '',
          optionsEn: ['', '', '', ''],
          optionsTa: ['', '', '', ''],
          correctOption: 0,
          explanationEn: '',
          explanationTa: ''
        }
      ];

    setQuizForm({
      title: quiz.title || '',
      category: quiz.category || 'TNPSC Group I',
      difficulty: (quiz.difficulty as 'Easy' | 'Medium' | 'High') || 'Medium',
      duration: quiz.duration ? String(quiz.duration).replace(' min', '') : '60',
      questionsCount: mappedQuestions.length,
      questions: mappedQuestions
    });

    setSuccessMessage(`Editing: "${quiz.title}". Make changes and click "Update & Save Changes".`);
    setTimeout(() => setSuccessMessage(''), 3500);

    setTimeout(() => {
      document.getElementById('question-test-builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleCancelEdit = () => {
    setEditingQuizId(null);
    setQuizForm({
      title: '',
      category: 'TNPSC Group I',
      difficulty: 'Medium',
      duration: '60 min',
      questionsCount: 1,
      questions: [{
        textEn: '',
        textTa: '',
        optionsEn: ['', '', '', ''],
        optionsTa: ['', '', '', ''],
        correctOption: 0,
        explanationEn: '',
        explanationTa: ''
      }]
    });
  };

  // 3. Add / Publish or Update Question Test
  const handleAddQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizForm.title.trim()) {
      alert('Please enter a Question Test Title.');
      return;
    }
    setIsSaving(true);

    const durationNum = parseInt(quizForm.duration) || 60;
    const questionsList = quizForm.questions.map((q, idx) => ({
      id: idx + 1,
      textEn: q.textEn || `Question ${idx + 1}`,
      textTa: q.textTa || q.textEn || `வினா ${idx + 1}`,
      optionsEn: q.optionsEn.map((opt, oIdx) => opt || `Option ${String.fromCharCode(65 + oIdx)}`),
      optionsTa: q.optionsTa.some(t => t.trim()) ? q.optionsTa.map((opt, oIdx) => opt || q.optionsEn[oIdx] || `விடை ${oIdx + 1}`) : q.optionsEn,
      correctAnswer: q.correctOption,
      explanationEn: q.explanationEn || 'Correct option verified by academy faculty.',
      explanationTa: q.explanationTa || 'பாட ஆசிரியரால் சரிபார்க்கப்பட்ட சரியான விடை.'
    }));

    if (editingQuizId) {
      // Update existing test
      const updatedEntry = {
        id: editingQuizId,
        title: quizForm.title,
        category: quizForm.category,
        difficulty: quizForm.difficulty,
        duration: quizForm.duration.includes('min') ? quizForm.duration : `${quizForm.duration} min`,
        durationSeconds: durationNum * 60,
        questions: questionsList.length,
        questionsCount: questionsList.length,
        questionsList,
        updatedAt: new Date().toISOString()
      };

      try {
        try {
          await setDoc(doc(db, 'quizzes', editingQuizId), updatedEntry, { merge: true });
        } catch (err) {
          console.warn('Firestore write failed, saving locally:', err);
        }

        const updated = quizzes.map(q => q.id === editingQuizId ? { ...q, ...updatedEntry } : q);
        setQuizzes(updated);
        safeLocalStorageSet('agamakizh_admin_quizzes', updated);

        // Realtime broadcast to student portal
        window.dispatchEvent(new CustomEvent('agamakizh_quizzes_updated', {
          detail: { quizzes: updated }
        }));
        try {
          const bc = new BroadcastChannel('agamakizh_channel');
          bc.postMessage({ type: 'QUIZZES_UPDATED', quizzes: updated });
        } catch { }

        setEditingQuizId(null);
        setQuizForm({
          title: '',
          category: 'TNPSC Group I',
          difficulty: 'Medium',
          duration: '60 min',
          questionsCount: 1,
          questions: [{
            textEn: '',
            textTa: '',
            optionsEn: ['', '', '', ''],
            optionsTa: ['', '', '', ''],
            correctOption: 0,
            explanationEn: '',
            explanationTa: ''
          }]
        });
        setSuccessMessage('Question Test Updated & Saved Successfully! (மாற்றங்கள் சேமிக்கப்பட்டன)');
      } finally {
        setIsSaving(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
      return;
    }

    const newEntry = {
      id: `quiz-${Date.now()}`,
      title: quizForm.title,
      category: quizForm.category,
      difficulty: quizForm.difficulty,
      duration: quizForm.duration.includes('min') ? quizForm.duration : `${quizForm.duration} min`,
      durationSeconds: durationNum * 60,
      questions: questionsList.length,
      questionsCount: questionsList.length,
      questionsList,
      createdAt: new Date().toISOString()
    };

    try {
      try {
        const docRef = await addDoc(collection(db, 'quizzes'), newEntry);
        newEntry.id = docRef.id;
      } catch (err) {
        console.warn('Firestore write failed, saving locally:', err);
      }

      const updated = [newEntry, ...quizzes];
      setQuizzes(updated);
      safeLocalStorageSet('agamakizh_admin_quizzes', updated);

      // Realtime broadcast to student portal
      window.dispatchEvent(new CustomEvent('agamakizh_quizzes_updated', {
        detail: { quizzes: updated }
      }));
      try {
        const bc = new BroadcastChannel('agamakizh_channel');
        bc.postMessage({ type: 'QUIZZES_UPDATED', quizzes: updated });
      } catch { }

      setQuizForm({
        title: '',
        category: 'TNPSC Group I',
        difficulty: 'Medium',
        duration: '60 min',
        questionsCount: 1,
        questions: [{
          textEn: '',
          textTa: '',
          optionsEn: ['', '', '', ''],
          optionsTa: ['', '', '', ''],
          correctOption: 0,
          explanationEn: '',
          explanationTa: ''
        }]
      });
      setSuccessMessage('Question Test Published to Student Portal!');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Delete Item
  const handleDelete = async (collName: string, id: string, tab: AdminTab) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      try {
        await deleteDoc(doc(db, collName, id));
      } catch (err) {
        console.warn('Firestore delete failed, removing locally:', err);
      }

      if (tab === 'results') {
        const filtered = studentResults.filter(item => item.id !== id);
        setStudentResults(filtered);
        safeLocalStorageSet('agamakizh_admin_results', filtered);
        window.dispatchEvent(new CustomEvent('agamakizh_results_updated', {
          detail: { studentResults: filtered }
        }));
        try {
          const bc = new BroadcastChannel('agamakizh_channel');
          bc.postMessage({ type: 'RESULTS_UPDATED', studentResults: filtered });
        } catch { }
      } else if (tab === 'notifications') {
        const filtered = notifications.filter(item => item.id !== id);
        setNotifications(filtered);
        safeLocalStorageSet('agamakizh_calendar_plan_2026', filtered);
        try {
          const bc = new BroadcastChannel('agamakizh_channel');
          bc.postMessage({ type: 'CALENDAR_PLAN_UPDATED', plans: filtered });
        } catch { }
      } else if (tab === 'questions') {
        if (editingQuizId === id) {
          handleCancelEdit();
        }
        const filtered = quizzes.filter(item => item.id !== id);
        setQuizzes(filtered);
        safeLocalStorageSet('agamakizh_admin_quizzes', filtered);
        window.dispatchEvent(new CustomEvent('agamakizh_quizzes_updated', {
          detail: { quizzes: filtered }
        }));
        try {
          const bc = new BroadcastChannel('agamakizh_channel');
          bc.postMessage({ type: 'QUIZZES_UPDATED', quizzes: filtered });
        } catch { }
      }
      setSuccessMessage('Record removed successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Clear all question tests
  const handleClearAllQuizzes = async () => {
    if (!window.confirm('Are you sure you want to delete ALL question tests? This action cannot be undone.')) return;
    setIsSaving(true);
    try {
      try {
        const snap = await getDocs(collection(db, 'quizzes'));
        const deletePromises = snap.docs.map(d => deleteDoc(doc(db, 'quizzes', d.id)));
        await Promise.all(deletePromises);
      } catch (err) {
        console.warn('Firestore clear all quizzes fallback:', err);
      }

      setQuizzes([]);
      safeLocalStorageSet('agamakizh_admin_quizzes', []);

      window.dispatchEvent(new CustomEvent('agamakizh_quizzes_updated', {
        detail: { quizzes: [] }
      }));
      try {
        const bc = new BroadcastChannel('agamakizh_channel');
        bc.postMessage({ type: 'QUIZZES_UPDATED', quizzes: [] });
      } catch { }

      setSuccessMessage('All Question Tests have been deleted successfully.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Clear all student results
  const handleClearAllResults = async () => {
    if (!window.confirm('Are you sure you want to delete ALL student results & marks? This action cannot be undone.')) return;
    setIsSaving(true);
    try {
      try {
        const snap = await getDocs(collection(db, 'studentResults'));
        const deletePromises = snap.docs.map(d => deleteDoc(doc(db, 'studentResults', d.id)));
        await Promise.all(deletePromises);
      } catch (err) {
        console.warn('Firestore clear all results fallback:', err);
      }

      setStudentResults([]);
      safeLocalStorageSet('agamakizh_admin_results', []);

      window.dispatchEvent(new CustomEvent('agamakizh_results_updated', {
        detail: { studentResults: [] }
      }));
      try {
        const bc = new BroadcastChannel('agamakizh_channel');
        bc.postMessage({ type: 'RESULTS_UPDATED', studentResults: [] });
      } catch { }

      setSuccessMessage('All student results have been deleted successfully.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Open PDF Preview
  const handleOpenPdf = (url: string, fileName?: string, indexedDbKey?: string) => {
    if (!url && !indexedDbKey) return;
    openPdfPreview(url, indexedDbKey, fileName || 'PDF Preview');
  };

  // Filter lists based on search
  const filteredQuizzes = quizzes.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResults = studentResults.filter(item =>
    item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.examName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-md">
              <img src={logoImage} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-black text-white text-base tracking-tight leading-none">Agamakizh</h1>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1 block">Admin Console</span>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-4 mb-3">
            Course Management
          </div>
          <nav className="space-y-1">
            <AdminSidebarLink
              icon={<BookOpen className="h-4 w-4 text-emerald-400" />}
              label="Chapter Learning Builder"
              active={activeTab === 'chapters'}
              badge="Core"
              onClick={() => { setActiveTab('chapters'); setSearchTerm(''); }}
            />
            <AdminSidebarLink
              icon={<Library className="h-4 w-4 text-emerald-400" />}
              label="Official Syllabus PDF"
              active={activeTab === 'syllabus'}
              badge="Official"
              onClick={() => { setActiveTab('syllabus'); setSearchTerm(''); }}
            />

            <AdminSidebarLink
              icon={<HelpCircle className="h-4 w-4 text-emerald-400" />}
              label="Question Tests"
              active={activeTab === 'questions'}
              badge={`${quizzes.length}`}
              onClick={() => { setActiveTab('questions'); setSearchTerm(''); }}
            />
            <AdminSidebarLink
              icon={<Award className="h-4 w-4 text-amber-400" />}
              label="Results & Student Marks"
              active={activeTab === 'results'}
              badge={`${studentResults.length}`}
              onClick={() => { setActiveTab('results'); setSearchTerm(''); }}
            />
            <AdminSidebarLink
              icon={<Calendar className="h-4 w-4 text-purple-400" />}
              label="Calendar & Plans 2026"
              active={activeTab === 'notifications'}
              badge={`${notifications.length}`}
              onClick={() => { setActiveTab('notifications'); setSearchTerm(''); }}
            />
            <AdminSidebarLink
              icon={<BookOpen className="h-4 w-4 text-orange-400" />}
              label="Store Books Manager"
              active={activeTab === 'store'}
              badge="New"
              onClick={() => { setActiveTab('store'); setSearchTerm(''); }}
            />
          </nav>
        </div>

        <div className="px-4 py-3 border-t border-slate-800">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-2">Academy Channels</p>
          <div className="grid grid-cols-4 gap-1.5">
            <a
              href="https://www.youtube.com/@agamakizhiasacademy"
              target="_blank"
              rel="noopener noreferrer"
              className="h-7 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="YouTube (@agamakizhiasacademy)"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/agamakizh_ias_academy"
              target="_blank"
              rel="noopener noreferrer"
              className="h-7 rounded-lg bg-slate-800 hover:bg-pink-600 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Instagram (@agamakizh_ias_academy)"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="https://whatsapp.com/channel/0029VaAgamakizh"
              target="_blank"
              rel="noopener noreferrer"
              className="h-7 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="WhatsApp Channel"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </a>
            <a
              href="https://t.me/AgamakizhIAS"
              target="_blank"
              rel="noopener noreferrer"
              className="h-7 rounded-lg bg-slate-800 hover:bg-sky-500 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Telegram (@AgamakizhIAS)"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.197 1.006.128.832.942z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => window.location.pathname = '/'}
            className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-xs font-semibold w-full px-4 py-2.5 rounded-xl hover:bg-slate-800 cursor-pointer"
          >
            <ExternalLink className="h-4 w-4" />
            View Student Portal
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('agamakizh_admin_session');
              onLogout();
            }}
            className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors text-xs font-semibold w-full px-4 py-2.5 rounded-xl hover:bg-red-500/10 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-xs">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              {activeTab === 'chapters' && <><BookOpen className="h-5 w-5 text-emerald-600" /> Chapter Learning Builder (PDF, Video, Test & Notes)</>}
              {activeTab === 'syllabus' && <><Library className="h-5 w-5 text-emerald-600" /> Manage Official Exam Syllabus PDF</>}
              {activeTab === 'questions' && <><HelpCircle className="h-5 w-5 text-emerald-600" /> Question Tests & Assessment Builder</>}
              {activeTab === 'results' && <><Award className="h-5 w-5 text-amber-500" /> Student Results & Marks Management</>}
              {activeTab === 'notifications' && <><Calendar className="h-5 w-5 text-purple-600" /> Calendar & Plans 2026 Management</>}
              {activeTab === 'store' && <><BookOpen className="h-5 w-5 text-orange-500" /> Store Books Management</>}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-200 shadow-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {successMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleManualRefresh}
              title="Refresh Admin Data"
              className="flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <RotateCcw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
              <span>Refresh Admin</span>
            </button>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* TAB 0: CHAPTER LEARNING BUILDER */}
            {activeTab === 'chapters' && (
              <div className="space-y-8">
                {/* Chapter Target Selection Banner */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        Interactive Chapter Builder
                      </span>
                      <h3 className="text-xl font-black text-slate-900 mt-1">Select Subject & Chapter to Configure</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Customize Study Notes, Key Concepts, Video Class, Practice Test MCQs, and PDF Chapter Notes.</p>
                    </div>

                    <div className="flex items-center flex-wrap gap-2.5">
                      <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl">
                        <span className="text-xs font-bold text-slate-500">Active Module:</span>
                        <span className="px-2 py-0.5 bg-slate-900 text-white font-mono text-xs font-bold rounded-lg">
                          {chapterForm.examCategory || 'TNPSC Group I'} • {chapterForm.subjectId}_ch_{chapterForm.chapterNumber}
                        </span>
                      </div>

                      {chapterModules[`${chapterForm.examCategory || 'TNPSC Group I'}_${chapterForm.subjectId}_ch_${chapterForm.chapterNumber}`] || chapterModules[`${chapterForm.subjectId}_ch_${chapterForm.chapterNumber}`] ? (
                        <span className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> Live & Saved
                        </span>
                      ) : (
                        <span className="px-2.5 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-xl">
                          Default Preset
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          const local = JSON.parse(localStorage.getItem('agamakizh_chapter_modules') || '{}');
                          const specKey = `${chapterForm.examCategory || 'TNPSC Group I'}_${chapterForm.subjectId}_ch_${chapterForm.chapterNumber}`;
                          const genKey = `${chapterForm.subjectId}_ch_${chapterForm.chapterNumber}`;
                          const data = local[specKey] || local[genKey];
                          if (data) {
                            setChapterForm({ ...data, examCategory: chapterForm.examCategory || 'TNPSC Group I' });
                            setSuccessMessage(`Reloaded saved Chapter ${chapterForm.chapterNumber} data!`);
                            setTimeout(() => setSuccessMessage(''), 2500);
                          } else {
                            alert(`No custom saved module for ${specKey} yet. Currently displaying default preset.`);
                          }
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        title="Reload saved data for this chapter"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Reload Chapter</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Exam Category Selector Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Select Exam Category:</span>
                    {EXAM_CATEGORIES.map(cat => {
                      const isSel = (chapterForm.examCategory || 'TNPSC Group I') === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleSelectExamCategory(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 border cursor-pointer ${
                            isSel
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">1. Select Exam</label>
                      <select
                        value={chapterForm.examCategory || 'TNPSC Group I'}
                        onChange={e => handleSelectExamCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      >
                        {EXAM_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">2. Select Subject</label>
                      <select
                        value={chapterForm.subjectId}
                        onChange={e => handleSelectSubjectOrChapter(e.target.value, chapterForm.chapterNumber, chapterForm.examCategory)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      >
                        {subjectOptions.filter(sub => {
                            const cat = (chapterForm.examCategory || '').toLowerCase();
                            if ((cat === 'ssc' || cat === 'railway') && sub.id === 'tamil') return false;
                            return true;
                          }).map(sub => (
                          <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">3. Select Chapter Number</label>
                      <select
                        value={chapterForm.chapterNumber}
                        onChange={e => handleSelectSubjectOrChapter(chapterForm.subjectId, Number(e.target.value), chapterForm.examCategory)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>Chapter {i + 1} {i === 0 ? '(Default Next Page)' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Chapter Title (English)</label>
                      <input
                        value={chapterForm.titleEn}
                        onChange={e => setChapterForm({ ...chapterForm, titleEn: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-semibold focus:outline-none"
                        placeholder="e.g. Units & Measurements"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Chapter Title (Tamil)</label>
                      <input
                        value={chapterForm.titleTa}
                        onChange={e => setChapterForm({ ...chapterForm, titleTa: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-semibold focus:outline-none"
                        placeholder="அத்தியாயம் 1 தலைப்பு"
                      />
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveChapterModule} className="space-y-8">
                  {/* SECTION 1: STUDY NOTES & KEY CONCEPTS */}
                  <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900">1. Study Notes & Key Concepts</h4>
                          <p className="text-xs text-slate-400">Detailed executive summary and concept points displayed to aspirants.</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Chapter Executive Summary (English)</label>
                        <textarea
                          rows={3}
                          value={chapterForm.summaryEn}
                          onChange={e => setChapterForm({ ...chapterForm, summaryEn: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none"
                          placeholder="Comprehensive chapter overview in English..."
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Executive Summary (தமிழ்)</label>
                        <textarea
                          rows={3}
                          value={chapterForm.summaryTa}
                          onChange={e => setChapterForm({ ...chapterForm, summaryTa: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none"
                          placeholder="அத்தியாயத்தின் முக்கிய விளக்க உரை..."
                        />
                      </div>
                    </div>

                    {/* Key Concepts List */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Key Concept Cards ({chapterForm.keyPoints.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => setChapterForm({
                            ...chapterForm,
                            keyPoints: [...chapterForm.keyPoints, { title: `${chapterForm.keyPoints.length + 1}. New Topic`, desc: '' }]
                          })}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add Concept Card
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {chapterForm.keyPoints.map((point, pIdx) => (
                          <div key={pIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative">
                            <div className="flex items-center justify-between">
                              <input
                                value={point.title}
                                onChange={e => {
                                  const updated = [...chapterForm.keyPoints];
                                  updated[pIdx].title = e.target.value;
                                  setChapterForm({ ...chapterForm, keyPoints: updated });
                                }}
                                className="font-bold text-xs text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1 w-full mr-2 focus:outline-none"
                                placeholder="Concept Title (e.g. 1. SI Units)"
                              />
                              {chapterForm.keyPoints.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setChapterForm({
                                    ...chapterForm,
                                    keyPoints: chapterForm.keyPoints.filter((_, i) => i !== pIdx)
                                  })}
                                  className="text-slate-400 hover:text-red-500 cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                            <textarea
                              rows={2}
                              value={point.desc}
                              onChange={e => {
                                const updated = [...chapterForm.keyPoints];
                                updated[pIdx].desc = e.target.value;
                                setChapterForm({ ...chapterForm, keyPoints: updated });
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-600 focus:outline-none"
                              placeholder="Explanation, formulas, or constitutional articles..."
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* SECTION 2: VIDEO CLASS UPLOAD/LINK */}
                  <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                          <Video className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900">2. Video Lecture Class</h4>
                          <p className="text-xs text-slate-400">Add YouTube Video URL for this chapter.</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">YouTube Video URL</label>
                        <input
                          type="text"
                          value={chapterForm.videoUrl}
                          onChange={(e) => setChapterForm({ ...chapterForm, videoUrl: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          placeholder="e.g., https://www.youtube.com/watch?v=..."
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Video Title / Display Label</label>
                        <input
                          type="text"
                          value={chapterForm.videoTitle}
                          onChange={(e) => setChapterForm({ ...chapterForm, videoTitle: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          placeholder="e.g., Chapter 1: Introduction to Mechanics"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: PRACTICE TEST (MCQs) - BILINGUAL */}
                  <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                          <HelpCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900">3. Practice Test Assessment (MCQs)</h4>
                          <p className="text-xs text-slate-400">Multiple choice questions in English Medium & தமிழ் வழி for aspirants.</p>
                        </div>
                      </div>

                      <div className="flex items-center flex-wrap gap-2.5">
                        {/* Global Section Medium Switcher */}
                        <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl">
                          <button
                            type="button"
                            onClick={() => setChapterQuizLang('english')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${chapterQuizLang === 'english'
                              ? 'bg-blue-600 text-white shadow-xs font-black'
                              : 'text-slate-600 hover:text-slate-900'
                              }`}
                          >
                            🇬🇧 English Inputs
                          </button>
                          <button
                            type="button"
                            onClick={() => setChapterQuizLang('tamil')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${chapterQuizLang === 'tamil'
                              ? 'bg-blue-600 text-white shadow-xs font-black'
                              : 'text-slate-600 hover:text-slate-900'
                              }`}
                          >
                            🇮🇳 தமிழ் Inputs
                          </button>
                        </div>

                        {/* Auto-populate Tamil button */}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = chapterForm.quiz.map(q => {
                              const qTa = q.questionTa || scienceTamilDictionary[q.question] || q.question;
                              const optsTa = q.optionsTa && q.optionsTa.length === 4
                                ? q.optionsTa
                                : (q.options || []).map(opt => scienceTamilDictionary[opt] || opt);
                              const expTa = q.explanationTa || scienceTamilDictionary[q.explanation || ''] || q.explanation;
                              return {
                                ...q,
                                questionTa: qTa,
                                optionsTa: optsTa,
                                explanationTa: expTa
                              };
                            });
                            setChapterForm(prev => ({ ...prev, quiz: updated }));
                            setSuccessMessage('Auto-filled authentic Tamil translations for all questions!');
                            setTimeout(() => setSuccessMessage(''), 3000);
                          }}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          title="Auto-generate Tamil translations using standard TNPSC vocabulary"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Auto-Fill தமிழ்</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setChapterForm({
                            ...chapterForm,
                            quiz: [
                              ...chapterForm.quiz,
                              {
                                question: '',
                                questionTa: '',
                                options: ['', '', '', ''],
                                optionsTa: ['', '', '', ''],
                                correct: 0,
                                explanation: '',
                                explanationTa: ''
                              }
                            ]
                          })}
                          className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Question</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {chapterForm.quiz.map((q, qIdx) => (
                        <div key={qIdx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200/60 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-700">Question #{qIdx + 1}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${q.questionTa ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                {q.questionTa ? '✓ Bilingual Ready' : 'English Only'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Per-Question Language Toggle */}
                              <div className="flex items-center p-0.5 bg-white border border-slate-200 rounded-lg text-[11px]">
                                <button
                                  type="button"
                                  onClick={() => setChapterQuizLang('english')}
                                  className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-colors ${chapterQuizLang === 'english' ? 'bg-blue-600 text-white' : 'text-slate-600'
                                    }`}
                                >
                                  English
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setChapterQuizLang('tamil')}
                                  className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-colors ${chapterQuizLang === 'tamil' ? 'bg-blue-600 text-white' : 'text-slate-600'
                                    }`}
                                >
                                  தமிழ்
                                </button>
                              </div>

                              {chapterForm.quiz.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setChapterForm({
                                    ...chapterForm,
                                    quiz: chapterForm.quiz.filter((_, i) => i !== qIdx)
                                  })}
                                  className="text-slate-400 hover:text-red-500 cursor-pointer p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Question Text Input */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                              <span>
                                {chapterQuizLang === 'english'
                                  ? `Question Text (English) #${qIdx + 1}`
                                  : `வினா உரை (தமிழ் வழி) #${qIdx + 1}`}
                              </span>
                              <span className="text-slate-400 font-normal lowercase">
                                {chapterQuizLang === 'english' ? 'English Medium' : 'தமிழ் வழித் தேர்வர்களுக்கு'}
                              </span>
                            </label>
                            {chapterQuizLang === 'english' ? (
                              <textarea
                                value={q.question}
                                onChange={e => {
                                  const updated = [...chapterForm.quiz];
                                  updated[qIdx].question = e.target.value;
                                  setChapterForm({ ...chapterForm, quiz: updated });
                                }}
                                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder={`Enter Question ${qIdx + 1} in English...`}
                              />
                            ) : (
                              <textarea
                                value={q.questionTa || ''}
                                onChange={e => {
                                  const updated = [...chapterForm.quiz];
                                  updated[qIdx].questionTa = e.target.value;
                                  setChapterForm({ ...chapterForm, quiz: updated });
                                }}
                                className="w-full bg-white border border-blue-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder={`வினா ${qIdx + 1}-ஐ தமிழில் உள்ளிடவும் (எ.கா. சூரியக் குடும்பத்திற்குள்...)...`}
                              />
                            )}
                          </div>

                          {/* Options Grid */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                              {chapterQuizLang === 'english' ? 'Options A-D (Select Radio for Correct Answer)' : 'விடைகள் A-D (சரியான விடைக்கு Radio பட்டனைத் தேர்ந்தெடுக்கவும்)'}
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {(chapterQuizLang === 'english' ? q.options : (q.optionsTa || ['', '', '', ''])).map((opt, oIdx) => (
                                <div key={oIdx} className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-2.5">
                                  <input
                                    type="radio"
                                    name={`chapter_q_${qIdx}`}
                                    checked={q.correct === oIdx}
                                    onChange={() => {
                                      const updated = [...chapterForm.quiz];
                                      updated[qIdx].correct = oIdx;
                                      setChapterForm({ ...chapterForm, quiz: updated });
                                    }}
                                    className="text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                  />
                                  <span className="text-[10px] font-bold text-slate-400 w-4">{String.fromCharCode(65 + oIdx)}.</span>
                                  <input
                                    value={opt}
                                    onChange={e => {
                                      const updated = [...chapterForm.quiz];
                                      if (chapterQuizLang === 'english') {
                                        updated[qIdx].options[oIdx] = e.target.value;
                                      } else {
                                        const curOptsTa = updated[qIdx].optionsTa ? [...updated[qIdx].optionsTa!] : ['', '', '', ''];
                                        curOptsTa[oIdx] = e.target.value;
                                        updated[qIdx].optionsTa = curOptsTa;
                                      }
                                      setChapterForm({ ...chapterForm, quiz: updated });
                                    }}
                                    className="w-full text-xs focus:outline-none bg-transparent font-medium"
                                    placeholder={chapterQuizLang === 'english' ? `Option ${String.fromCharCode(65 + oIdx)} (English)` : `விடை ${String.fromCharCode(65 + oIdx)} (தமிழ்)`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Explanation Input */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                              {chapterQuizLang === 'english' ? 'Explanation of Correct Answer (English)' : 'சரியான விடைக்கான விளக்கம் (தமிழ்)'}
                            </label>
                            {chapterQuizLang === 'english' ? (
                              <input
                                value={q.explanation}
                                onChange={e => {
                                  const updated = [...chapterForm.quiz];
                                  updated[qIdx].explanation = e.target.value;
                                  setChapterForm({ ...chapterForm, quiz: updated });
                                }}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder="Explanation of correct answer in English (displayed after student answers)..."
                              />
                            ) : (
                              <input
                                value={q.explanationTa || ''}
                                onChange={e => {
                                  const updated = [...chapterForm.quiz];
                                  updated[qIdx].explanationTa = e.target.value;
                                  setChapterForm({ ...chapterForm, quiz: updated });
                                }}
                                className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder="சரியான விடைக்கான தமிழ் விளக்கம்..."
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 4: PDF CHAPTER UPLOAD */}
                  <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900">4. Chapter PDF Notes & Materials</h4>
                          <p className="text-xs text-slate-400">Upload or link official PDF revision notes for this chapter.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* PDF File Picker */}
                      <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/60 rounded-2xl p-5 text-center transition-all cursor-pointer relative group">
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={handleChapterPdfUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                          <Upload className="h-6 w-6 text-indigo-500 group-hover:scale-110 transition-transform" />
                          <p className="text-xs font-bold text-slate-700">Click to upload Chapter PDF</p>
                          <p className="text-[10px] text-slate-400">PDF files up to 30MB supported. You can upload multiple PDFs.</p>
                        </div>
                      </div>

                      {/* List of PDFs */}
                      <div className="space-y-3">
                        {/* Render legacy PDF if present and pdfs array is empty */}
                        {chapterForm.pdfFileName && (!chapterForm.pdfs || chapterForm.pdfs.length === 0) && (
                          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold text-emerald-800">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                                <FileCheck className="h-5 w-5 text-emerald-700" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 truncate">{chapterForm.pdfFileName}</p>
                                <p className="text-[11px] text-emerald-700 font-normal">
                                  Attached • {chapterForm.pdfSize || 'Official Chapter Material'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => openPdfPreview(chapterForm.pdfUrl, chapterForm._pdfUrl_indexedDbKey, chapterForm.pdfTitle || chapterForm.pdfFileName)}
                                className="px-3.5 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                                title="Preview attached PDF in a new tab"
                              >
                                <Eye className="h-3.5 w-3.5 text-emerald-600" />
                                <span>Preview</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setChapterForm({
                                    ...chapterForm,
                                    pdfUrl: '',
                                    pdfFileName: '',
                                    pdfTitle: '',
                                    pdfSize: undefined,
                                    _pdfUrl_indexedDbKey: undefined
                                  });
                                }}
                                className="px-3.5 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Render pdfs array */}
                        {(chapterForm.pdfs || []).map((pdf, idx) => (
                          <div key={idx} className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold text-emerald-800">
                            <div className="flex flex-col gap-2 min-w-0 w-full">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                                  <FileCheck className="h-5 w-5 text-emerald-700" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-slate-900 truncate">{pdf.pdfFileName || 'PDF Document'}</p>
                                  <p className="text-[11px] text-emerald-700 font-normal">
                                    Attached • {pdf.pdfSize || 'Official Chapter Material'}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="mt-2">
                                <label className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Document Title / Display Label</label>
                                <input
                                  value={pdf.pdfTitle}
                                  onChange={e => {
                                    const updatedPdfs = [...(chapterForm.pdfs || [])];
                                    updatedPdfs[idx].pdfTitle = e.target.value;
                                    setChapterForm({ ...chapterForm, pdfs: updatedPdfs });
                                  }}
                                  className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 mt-1 text-xs focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center mt-2 sm:mt-0">
                              <button
                                type="button"
                                onClick={() => openPdfPreview(pdf.pdfUrl, pdf._pdfUrl_indexedDbKey, pdf.pdfTitle || pdf.pdfFileName)}
                                className="px-3.5 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                                title="Preview attached PDF in a new tab"
                              >
                                <Eye className="h-3.5 w-3.5 text-emerald-600" />
                                <span>Preview</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRemoveChapterPdf(idx)}
                                className="px-3.5 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      <span className="text-xs font-bold text-slate-700">
                        Configuring: <strong className="text-slate-900">{subjectOptions.find(s => s.id === chapterForm.subjectId)?.name} • Chapter {chapterForm.chapterNumber}</strong>
                      </span>
                    </div>

                    <button
                      disabled={isSaving}
                      className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-70"
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save & Publish Chapter Module
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: OFFICIAL SYLLABUS PDF MANAGEMENT */}
            {activeTab === 'syllabus' && (
              <div className="space-y-8">
                {/* Exam Selection Pills */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        Curriculum Management
                      </span>
                      <h3 className="text-xl font-black text-slate-900 mt-1">Select Exam Syllabus to Configure</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Upload official notification syllabus PDF and outline key syllabus units for student view.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">Configuring:</span>
                      <span className="px-3 py-1 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs">
                        {syllabusForm.examName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {Object.values(initialSyllabi).map(exam => {
                      const isActive = selectedSyllabusExamId === exam.id;
                      const hasCustom = Boolean(syllabi[exam.id]?.pdfUrl || syllabi[exam.id]?._pdfUrl_indexedDbKey);
                      return (
                        <button
                          key={exam.id}
                          type="button"
                          onClick={() => handleSelectSyllabusExam(exam.id)}
                          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0 border ${isActive
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                        >
                          <span>{exam.examName}</span>
                          {hasCustom && (
                            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-emerald-500'}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Form & PDF Uploader */}
                  <div className="lg:col-span-6 bg-white p-7 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                          <Library className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900">{syllabusForm.examName} Syllabus PDF</h4>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{syllabusForm.category}</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                        Official PDF
                      </span>
                    </div>

                    <form onSubmit={handleSaveSyllabus} className="space-y-4">
                      {/* PDF Uploader */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Upload Official Syllabus PDF</label>
                        <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50/60 rounded-2xl p-5 text-center transition-all cursor-pointer relative group">
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleSyllabusPdfUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                            <Upload className="h-6 w-6 text-emerald-600 group-hover:scale-110 transition-transform" />
                            <p className="text-xs font-bold text-slate-700">Click to upload Syllabus PDF from computer</p>
                            <p className="text-[10px] text-slate-400">Official TNPSC / UPSC syllabus notification PDF up to 30MB</p>
                          </div>
                        </div>

                        {/* Attached PDF Banner */}
                        {syllabusForm.fileName && (
                          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold text-emerald-800">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                                <FileCheck className="h-5 w-5 text-emerald-700" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 truncate">{syllabusForm.fileName}</p>
                                <p className="text-[11px] text-emerald-700 font-normal">
                                  Official Attached Syllabus • {syllabusForm.fileSize || 'Standard Material'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => openPdfPreview(syllabusForm.pdfUrl, syllabusForm._pdfUrl_indexedDbKey, syllabusForm.fileName)}
                                className="px-3.5 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                                title="Preview Syllabus PDF"
                              >
                                <Eye className="h-3.5 w-3.5 text-emerald-600" />
                                <span>Preview</span>
                              </button>

                              <button
                                type="button"
                                onClick={handleRemoveSyllabusPdf}
                                className="px-3.5 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                                title="Remove Syllabus PDF"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Display Label */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Document Display Label / Filename</label>
                        <input
                          value={syllabusForm.fileName}
                          onChange={e => setSyllabusForm({ ...syllabusForm, fileName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none"
                          placeholder="e.g. TNPSC_Group_I_Official_Syllabus.pdf"
                        />
                      </div>

                      {/* Cloud Link */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Or PDF Cloud / Drive Link</label>
                        <input
                          value={syllabusForm.pdfUrl.startsWith('data:') ? '' : syllabusForm.pdfUrl}
                          onChange={e => setSyllabusForm({ ...syllabusForm, pdfUrl: e.target.value })}
                          disabled={syllabusForm.pdfUrl.startsWith('data:')}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
                          placeholder={syllabusForm.pdfUrl.startsWith('data:') ? 'Local file uploaded above' : 'https://...pdf'}
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Syllabus Overview Description</label>
                        <textarea
                          rows={3}
                          value={syllabusForm.description}
                          onChange={e => setSyllabusForm({ ...syllabusForm, description: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                          placeholder="Summary of syllabus scope, notification year, and paper pattern..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-70"
                      >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save & Publish Official Syllabus
                      </button>
                    </form>
                  </div>

                  {/* Topics & Student View Preview */}
                  <div className="lg:col-span-6 space-y-6">
                    {/* Topics Editor */}
                    <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          Key Syllabus Units & Topics ({syllabusForm.topics.length})
                        </h4>
                        <span className="text-[10px] text-slate-400 font-semibold">Displayed in Student Portal</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          value={newSyllabusTopic}
                          onChange={e => setNewSyllabusTopic(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSyllabusTopic(); } }}
                          placeholder="e.g. Unit 9: Development Administration in Tamil Nadu"
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddSyllabusTopic}
                          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
                        >
                          Add Topic
                        </button>
                      </div>

                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {syllabusForm.topics.map((topic, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 group hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-2 truncate pr-2">
                              <ChevronRight className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">{topic}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSyllabusTopic(idx)}
                              className="text-slate-400 hover:text-red-500 opacity-60 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                              title="Delete topic"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Live Student Portal Preview Card */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-7 rounded-3xl text-white shadow-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                          Student Portal Live Preview
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{syllabusForm.examName}</span>
                      </div>

                      <div>
                        <h4 className="text-lg font-black text-white flex items-center gap-2">
                          <Library className="h-5 w-5 text-emerald-400" />
                          Official Syllabus
                        </h4>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                          {syllabusForm.description}
                        </p>
                      </div>

                      <ul className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                        {syllabusForm.topics.slice(0, 4).map((topic, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                            <ChevronRight className="h-3 w-3 text-emerald-400 shrink-0" />
                            <span className="truncate">{topic}</span>
                          </li>
                        ))}
                        {syllabusForm.topics.length > 4 && (
                          <li className="text-[11px] text-emerald-400 font-bold pl-5">
                            + {syllabusForm.topics.length - 4} more syllabus units
                          </li>
                        )}
                      </ul>

                      <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-3">
                        <div className="truncate text-xs text-slate-400">
                          {syllabusForm.fileName}
                        </div>
                        <button
                          type="button"
                          onClick={() => openPdfPreview(syllabusForm.pdfUrl, syllabusForm._pdfUrl_indexedDbKey, syllabusForm.fileName)}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Preview PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}



            {/* TAB 4: STUDENT RESULTS & MARKS */}
            {activeTab === 'results' && (
              <div className="space-y-8">
                {/* Stats Summary Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Published</p>
                      <p className="text-2xl font-black text-slate-900">{studentResults.length}</p>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Highest Score</p>
                      <p className="text-2xl font-black text-slate-900">
                        {studentResults.length > 0 ? Math.max(...studentResults.map(r => Number(r.marksScored) || 0)) : 0}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pass Rate</p>
                      <p className="text-2xl font-black text-slate-900">96.4%</p>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Aspirants</p>
                      <p className="text-2xl font-black text-slate-900">1,240+</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Form */}
                  <div className="lg:col-span-4 bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Plus className="h-4 w-4 text-amber-500" />
                        Record Student Marks & Result
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 px-2 py-1 rounded">
                        Marks Entry
                      </span>
                    </div>

                    <form onSubmit={handleAddResult} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Student Name</label>
                        <input
                          required
                          value={resultForm.studentName}
                          onChange={e => setResultForm({ ...resultForm, studentName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                          placeholder="e.g. Ananya Swaminathan"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Roll / Registration No</label>
                        <input
                          required
                          value={resultForm.rollNo}
                          onChange={e => setResultForm({ ...resultForm, rollNo: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                          placeholder="e.g. AGM-2024-042"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Exam Category</label>
                        <select
                          value={resultForm.category}
                          onChange={e => setResultForm({ ...resultForm, category: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none"
                        >
                          {EXAM_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Exam / Test Name</label>
                        <input
                          required
                          value={resultForm.examName}
                          onChange={e => setResultForm({ ...resultForm, examName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                          placeholder="e.g. TNPSC Group I - Prelims Mock 1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Marks Scored</label>
                          <input
                            required
                            type="number"
                            value={resultForm.marksScored}
                            onChange={e => setResultForm({ ...resultForm, marksScored: Number(e.target.value) })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none font-bold text-slate-900"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Marks</label>
                          <input
                            required
                            type="number"
                            value={resultForm.totalMarks}
                            onChange={e => setResultForm({ ...resultForm, totalMarks: Number(e.target.value) })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none text-slate-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rank (Optional)</label>
                          <input
                            value={resultForm.rank}
                            onChange={e => setResultForm({ ...resultForm, rank: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none"
                            placeholder="e.g. 1 or Top 5"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Result Status</label>
                          <select
                            value={resultForm.status}
                            onChange={e => setResultForm({ ...resultForm, status: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none"
                          >
                            <option>Passed</option>
                            <option>Outstanding</option>
                            <option>Distinction</option>
                            <option>First Class</option>
                            <option>Needs Improvement</option>
                          </select>
                        </div>
                      </div>

                      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-800">Auto Calculated Score:</span>
                        <span className="text-sm font-black text-amber-700">
                          {Math.round((Number(resultForm.marksScored) / (Number(resultForm.totalMarks) || 1)) * 100)}%
                        </span>
                      </div>

                      <button
                        disabled={isSaving}
                        className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-70"
                      >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Publish Student Result
                      </button>
                    </form>
                  </div>

                  {/* List / Table */}
                  <div className="lg:col-span-8 bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">Published Student Marks & Rankings</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{filteredResults.length} student scores recorded</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {studentResults.length > 0 && (
                          <button
                            type="button"
                            onClick={handleClearAllResults}
                            className="px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all flex items-center gap-1 cursor-pointer shrink-0"
                            title="Delete All Results"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete All</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => downloadAdminResultsMasterPdf(filteredResults)}
                          className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                          title="Download Master Marks Register (PDF)"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download PDF</span>
                        </button>
                        <div className="relative w-52">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search student or roll no..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto flex-1">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                            <th className="px-4 py-3 rounded-l-xl">Student Details</th>
                            <th className="px-4 py-3">Exam Name</th>
                            <th className="px-4 py-3">Marks Scored</th>
                            <th className="px-4 py-3">Rank / Status</th>
                            <th className="px-4 py-3 text-right rounded-r-xl">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredResults.map(res => (
                            <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center shrink-0">
                                    {res.studentName?.charAt(0) || 'S'}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-900 leading-snug">{res.studentName}</p>
                                    <p className="text-[10px] font-mono text-slate-400 font-bold">{res.rollNo}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3.5">
                                <p className="text-xs font-semibold text-slate-700">{res.examName}</p>
                                <p className="text-[10px] text-slate-400">{res.date}</p>
                              </td>
                              <td className="px-4 py-3.5">
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-slate-900 tabular-nums">
                                    {res.marksScored} / {res.totalMarks}
                                  </span>
                                  <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                                    <div
                                      className="h-full bg-amber-500 rounded-full"
                                      style={{ width: `${Math.min(100, Math.round((Number(res.marksScored) / (Number(res.totalMarks) || 1)) * 100))}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-1.5">
                                  {res.rank && (
                                    <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                      #{res.rank}
                                    </span>
                                  )}
                                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${res.status === 'Outstanding' || res.status === 'Distinction'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {res.status}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    type="button"
                                    onClick={() => downloadSingleResultPdf(res, { name: res.studentName, rollNo: res.rollNo })}
                                    title="Download Student Marksheet (PDF)"
                                    className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Download className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete('studentResults', res.id, 'results')}
                                    title="Delete Result"
                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {filteredResults.length === 0 && (
                            <tr>
                              <td colSpan={5} className="text-center py-16 text-slate-400">
                                <Award className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                <p className="text-xs font-bold uppercase tracking-wider">No results recorded</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: QUESTION TESTS & ASSESSMENT BUILDER */}
            {activeTab === 'questions' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form */}
                <div id="question-test-builder" className="lg:col-span-7 bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        {editingQuizId ? (
                          <>
                            <Edit3 className="h-4 w-4 text-amber-600" />
                            <span>Edit Question Test / வினாத்தாள் மாற்றுக</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 text-emerald-600" />
                            <span>Add Question Test</span>
                          </>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {editingQuizId
                          ? `Editing "${quizForm.title || 'Untitled Test'}" - update questions, options & keys`
                          : 'Build interactive mock test with bilingual questions, options & answer keys'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {editingQuizId && (
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                          Cancel Edit
                        </button>
                      )}
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${editingQuizId
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                        {editingQuizId ? 'Editing Mode' : 'Bilingual (ENG & தமிழ்)'}
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleAddQuiz} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Question Test Title</label>
                        <input
                          required
                          value={quizForm.title}
                          onChange={e => setQuizForm({ ...quizForm, title: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                          placeholder="e.g. TNPSC Group I - Full Length General Studies Mock Test 2024"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</label>
                          <select
                            value={quizForm.category}
                            onChange={e => setQuizForm({ ...quizForm, category: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-3 text-sm focus:outline-none"
                          >
                            {EXAM_CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                            <option>General Studies</option>
                            <option>Indian Polity</option>
                            <option>History & Culture</option>
                            <option>Geography</option>
                            <option>General Science</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Difficulty</label>
                          <select
                            value={quizForm.difficulty}
                            onChange={e => setQuizForm({ ...quizForm, difficulty: e.target.value as 'Easy' | 'Medium' | 'High' })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-3 text-sm focus:outline-none"
                          >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Duration</label>
                          <input
                            value={quizForm.duration}
                            onChange={e => setQuizForm({ ...quizForm, duration: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-3 text-sm focus:outline-none"
                            placeholder="60 min"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Questions ({quizForm.questions.length})
                          </h4>
                          <p className="text-[11px] text-slate-400">Click the radio button next to the option to designate the correct answer</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setQuizForm({
                            ...quizForm,
                            questions: [
                              ...quizForm.questions,
                              {
                                textEn: '',
                                textTa: '',
                                optionsEn: ['', '', '', ''],
                                optionsTa: ['', '', '', ''],
                                correctOption: 0,
                                explanationEn: '',
                                explanationTa: ''
                              }
                            ]
                          })}
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add Question
                        </button>
                      </div>

                      {quizForm.questions.map((q, qIdx) => (
                        <div key={qIdx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                              Question #{qIdx + 1}
                            </span>
                            {quizForm.questions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setQuizForm({
                                  ...quizForm,
                                  questions: quizForm.questions.filter((_, i) => i !== qIdx)
                                })}
                                className="text-slate-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Remove this question"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Question (English)</label>
                              <textarea
                                placeholder="Enter Question in English..."
                                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[75px]"
                                value={q.textEn}
                                onChange={e => {
                                  const newQs = [...quizForm.questions];
                                  newQs[qIdx].textEn = e.target.value;
                                  setQuizForm({ ...quizForm, questions: newQs });
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">வினா (தமிழ்)</label>
                              <textarea
                                placeholder="வினாவை தமிழில் உள்ளிடவும்..."
                                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[75px]"
                                value={q.textTa}
                                onChange={e => {
                                  const newQs = [...quizForm.questions];
                                  newQs[qIdx].textTa = e.target.value;
                                  setQuizForm({ ...quizForm, questions: newQs });
                                }}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                4 Options (Select radio button for Correct Answer Key)
                              </p>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                Selected Key: Option {String.fromCharCode(65 + q.correctOption)}
                              </span>
                            </div>

                            <div className="space-y-2">
                              {q.optionsEn.map((opt, oIdx) => (
                                <div key={oIdx} className={`p-2.5 rounded-xl border transition-all ${q.correctOption === oIdx ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-400' : 'bg-white border-slate-200'}`}>
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <input
                                      type="radio"
                                      id={`q_${qIdx}_opt_${oIdx}`}
                                      name={`correct_${qIdx}`}
                                      checked={q.correctOption === oIdx}
                                      onChange={() => {
                                        const newQs = [...quizForm.questions];
                                        newQs[qIdx].correctOption = oIdx;
                                        setQuizForm({ ...quizForm, questions: newQs });
                                      }}
                                      className="text-emerald-600 focus:ring-emerald-500 cursor-pointer h-4 w-4"
                                    />
                                    <label htmlFor={`q_${qIdx}_opt_${oIdx}`} className="text-xs font-bold text-slate-700 cursor-pointer">
                                      Option {String.fromCharCode(65 + oIdx)} {q.correctOption === oIdx && <span className="text-[10px] text-emerald-600 font-bold ml-1.5">(Correct Answer)</span>}
                                    </label>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                                    <input
                                      placeholder={`Option ${String.fromCharCode(65 + oIdx)} (English)`}
                                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                                      value={opt}
                                      onChange={e => {
                                        const newQs = [...quizForm.questions];
                                        newQs[qIdx].optionsEn[oIdx] = e.target.value;
                                        setQuizForm({ ...quizForm, questions: newQs });
                                      }}
                                    />
                                    <input
                                      placeholder={`விடை ${String.fromCharCode(65 + oIdx)} (தமிழ்)`}
                                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                                      value={q.optionsTa[oIdx] || ''}
                                      onChange={e => {
                                        const newQs = [...quizForm.questions];
                                        newQs[qIdx].optionsTa[oIdx] = e.target.value;
                                        setQuizForm({ ...quizForm, questions: newQs });
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Faculty Answer Key Explanation */}
                          <div className="pt-2 border-t border-slate-200/60">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                              Faculty Answer Key Explanation & Solution
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <input
                                placeholder="Solution explanation in English (shown after submit)..."
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                                value={q.explanationEn || ''}
                                onChange={e => {
                                  const newQs = [...quizForm.questions];
                                  newQs[qIdx].explanationEn = e.target.value;
                                  setQuizForm({ ...quizForm, questions: newQs });
                                }}
                              />
                              <input
                                placeholder="விளக்கம் (தமிழ்)..."
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                                value={q.explanationTa || ''}
                                onChange={e => {
                                  const newQs = [...quizForm.questions];
                                  newQs[qIdx].explanationTa = e.target.value;
                                  setQuizForm({ ...quizForm, questions: newQs });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      {editingQuizId && (
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={isSaving}
                        className={`flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-70 ${editingQuizId
                            ? 'bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-700 hover:to-emerald-700 text-white shadow-emerald-500/20'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                          }`}
                      >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingQuizId ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                        {editingQuizId ? 'Update & Save Changes (மாற்றங்களைச் சேமி)' : 'Publish Question Test'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right Column: Published Question Tests */}
                <div className="lg:col-span-5 bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Published Question Tests</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{quizzes.length} live interactive tests</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {quizzes.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearAllQuizzes}
                          className="px-2.5 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all flex items-center gap-1 cursor-pointer shrink-0"
                          title="Delete All Tests"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete All</span>
                        </button>
                      )}
                      <div className="relative">
                        <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search tests..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-full sm:w-36"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 max-h-[640px] pr-1">
                    {filteredQuizzes.map(quiz => {
                      const isEditingThis = editingQuizId === quiz.id;
                      return (
                        <div
                          key={quiz.id}
                          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition-all group ${isEditingThis
                              ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/60 shadow-xs'
                              : 'bg-slate-50 hover:bg-emerald-50/30 border-slate-200/80'
                            }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 shadow-2xs ${isEditingThis
                                ? 'bg-amber-100 text-amber-700 border-amber-200'
                                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              }`}>
                              <HelpCircle className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900 truncate" title={quiz.title}>{quiz.title}</h4>
                                {isEditingThis && (
                                  <span className="text-[9px] font-extrabold uppercase tracking-wider bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded shrink-0">
                                    Editing
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 uppercase">
                                  {quiz.category}
                                </span>
                                <span className="text-[10px] text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded font-bold">
                                  {quiz.questionsCount || quiz.questions?.length || quiz.questions || (quiz.questionsList?.length || 0)} Qs
                                </span>
                                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${quiz.difficulty === 'High' ? 'bg-red-50 text-red-600' :
                                    quiz.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' :
                                      'bg-amber-50 text-amber-600'
                                  }`}>
                                  {quiz.difficulty || 'Medium'}
                                </span>
                                {quiz.duration && (
                                  <span className="text-[10px] text-slate-400">
                                    {quiz.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Preview Button */}
                            <button
                              type="button"
                              onClick={() => setPreviewQuiz(quiz)}
                              title="Preview Test Questions & Answer Key"
                              className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 bg-white border border-slate-200 hover:border-emerald-200 rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                            >
                              <Eye className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="hidden sm:inline">Preview</span>
                            </button>

                            {/* Edit / Change Button */}
                            <button
                              type="button"
                              onClick={() => handleEditQuiz(quiz)}
                              title="Edit / Change Test Content"
                              className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-2xs border ${isEditingThis
                                  ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20'
                                  : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50 bg-white border-slate-200 hover:border-blue-200'
                                }`}
                            >
                              <Edit3 className={`h-3.5 w-3.5 ${isEditingThis ? 'text-white' : 'text-blue-600'}`} />
                              <span className="hidden sm:inline">{isEditingThis ? 'Editing' : 'Edit'}</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDelete('quizzes', quiz.id, 'questions')}
                              title="Delete Question Test"
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-200 shrink-0 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {filteredQuizzes.length === 0 && (
                      <div className="text-center py-16 text-slate-400">
                        <HelpCircle className="h-10 w-10 mx-auto mb-2 opacity-20" />
                        <p className="text-xs font-bold uppercase tracking-wider">No tests found</p>
                        <p className="text-[11px] text-slate-400 mt-1">Create and publish interactive question tests using the form on the left.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: 2026 CALENDAR & STUDY PLANNER */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                {/* 2026 Metric Summary & Action Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Milestones</p>
                      <p className="text-xl font-black text-slate-900">{notifications.length}</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Subject Units</p>
                      <p className="text-xl font-black text-slate-900">
                        {notifications.filter(n => n.type === 'subject').length}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                      <RotateCcw className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Revision Cycles</p>
                      <p className="text-xl font-black text-slate-900">
                        {notifications.filter(n => n.type === 'revision').length}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <CheckSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mock Tests</p>
                      <p className="text-xl font-black text-slate-900">
                        {notifications.filter(n => n.type === 'test').length}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3 col-span-2 sm:col-span-1">
                    <div className="w-10 h-10 bg-fuchsia-50 text-fuchsia-600 rounded-xl flex items-center justify-center shrink-0">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Exam Notices</p>
                      <p className="text-xl font-black text-slate-900">
                        {notifications.filter(n => n.type === 'notification').length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Top Action Bar */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <span>2026 Academic Calendar & Comprehensive Study Plan Control</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Publish official monthly milestones, subject timelines, revision schedules, and exam notifications synced in realtime.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => download2026CalendarPlanPdf(notifications, 'Agamakizh Official 2026 Academic Plan')}
                      className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer active:scale-95"
                      title="Download full 2026 study planner in A4 PDF format"
                    >
                      <FileDown className="h-3.5 w-3.5" />
                      <span>Download 2026 Plan (PDF)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetCalendarPlans}
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs active:scale-95"
                      title="Sync and restore all 47 official Agamakizh 2026 milestones"
                    >
                      <RefreshCw className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Sync 47 Official Plans</span>
                    </button>

                    {notifications.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllPlans}
                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        title="Delete all calendar milestones"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Clear All</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Form */}
                  <div id="calendar-plan-builder" className="lg:col-span-5 bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          {editingNotifId ? (
                            <>
                              <Edit3 className="h-4 w-4 text-amber-600" />
                              <span>Edit 2026 Plan Milestone</span>
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 text-purple-600" />
                              <span>Add 2026 Plan Milestone</span>
                            </>
                          )}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {editingNotifId ? 'Modify milestone details and save changes' : 'Add Subject, Revision, Test, or Notification to 2026 Planner'}
                        </p>
                      </div>

                      {editingNotifId && (
                        <button
                          type="button"
                          onClick={handleCancelEditNotif}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                          Cancel
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleAddNotif} className="space-y-4">
                      {/* Milestone Type */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Plan Milestone Type</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { type: 'subject', label: '📚 Subject Plan', color: 'border-emerald-300 text-emerald-700 bg-emerald-50/50' },
                            { type: 'revision', label: '🔄 Revision Plan', color: 'border-amber-300 text-amber-700 bg-amber-50/50' },
                            { type: 'test', label: '📝 Test Plan', color: 'border-blue-300 text-blue-700 bg-blue-50/50' },
                            { type: 'notification', label: '📢 Exam Notice', color: 'border-purple-300 text-purple-700 bg-purple-50/50' }
                          ].map(t => (
                            <button
                              type="button"
                              key={t.type}
                              onClick={() => setNotifForm({ ...notifForm, type: t.type as PlanType })}
                              className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${notifForm.type === t.type ? `ring-2 ring-purple-600 ${t.color}` : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Title */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Milestone Title (English)</label>
                        <input
                          required
                          value={notifForm.title}
                          onChange={e => setNotifForm({ ...notifForm, title: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                          placeholder="e.g. Unit 5: Indian Polity - Constitutional Framework"
                        />
                      </div>

                      {/* Title Tamil */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Title in Tamil (Optional)</label>
                        <input
                          value={notifForm.titleTa}
                          onChange={e => setNotifForm({ ...notifForm, titleTa: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                          placeholder="e.g. இந்திய அரசியல் அமைப்பு - அடிப்படை உரிமைகள்"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Exam</label>
                          <select
                            value={notifForm.category}
                            onChange={e => setNotifForm({ ...notifForm, category: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none"
                          >
                            {EXAM_CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                            <option>General Studies</option>
                            <option>All Exams</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Subject / Unit</label>
                          <input
                            value={notifForm.subject}
                            onChange={e => setNotifForm({ ...notifForm, subject: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                            placeholder="e.g. Indian Polity"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Scheduled Date (2026)</label>
                          <input
                            required
                            type="date"
                            value={notifForm.date}
                            onChange={e => setNotifForm({ ...notifForm, date: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Duration / Target</label>
                          <input
                            value={notifForm.duration}
                            onChange={e => setNotifForm({ ...notifForm, duration: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                            placeholder="e.g. 7 Days, 3 Hours"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</label>
                        <select
                          value={notifForm.status}
                          onChange={e => setNotifForm({ ...notifForm, status: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none"
                        >
                          <option>Upcoming</option>
                          <option>Ongoing</option>
                          <option>Completed</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description & Study Targets</label>
                        <textarea
                          rows={2}
                          value={notifForm.description}
                          onChange={e => setNotifForm({ ...notifForm, description: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none"
                          placeholder="Key syllabus objectives, chapters to study, or test structure..."
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Syllabus Topics (Comma separated)</label>
                        <input
                          value={notifForm.syllabusTopics}
                          onChange={e => setNotifForm({ ...notifForm, syllabusTopics: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none"
                          placeholder="e.g. Preamble, Fundamental Rights, DPSP, Supreme Court"
                        />
                      </div>

                      {/* PDF Attachment */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Attach PDF Notice / Schedule (Optional)</label>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={e => handlePdfFileUpload(e, 'notif')}
                          className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                        />
                      </div>

                      <button
                        disabled={isSaving}
                        className={`w-full py-3.5 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-70 ${editingNotifId
                            ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                            : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
                          }`}
                      >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingNotifId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {editingNotifId ? 'Update & Save 2026 Milestone' : 'Add & Publish 2026 Plan Milestone'}
                      </button>
                    </form>
                  </div>

                  {/* List */}
                  <div className="lg:col-span-7 bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">2026 Published Academic Plan</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {notifications.length} milestones & exam schedules in active system
                        </p>
                      </div>

                      {/* Search & Filter */}
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search 2026 plans..."
                            value={calendarSearchTerm}
                            onChange={e => setCalendarSearchTerm(e.target.value)}
                            className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 w-full sm:w-36"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Filter Pills with Counts */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-4">
                      {[
                        { id: 'all', label: 'All', count: notifications.length },
                        { id: 'subject', label: 'Subject', count: notifications.filter(n => n.type === 'subject').length },
                        { id: 'revision', label: 'Revision', count: notifications.filter(n => n.type === 'revision').length },
                        { id: 'test', label: 'Test', count: notifications.filter(n => n.type === 'test').length },
                        { id: 'notification', label: 'Notice', count: notifications.filter(n => n.type === 'notification').length }
                      ].map(fItem => (
                        <button
                          key={fItem.id}
                          type="button"
                          onClick={() => setCalendarAdminFilter(fItem.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${calendarAdminFilter === fItem.id
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                          <span>{fItem.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${calendarAdminFilter === fItem.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                            {fItem.count}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 max-h-[580px] pr-1">
                      {notifications
                        .filter(notif => {
                          if (calendarAdminFilter !== 'all' && notif.type !== calendarAdminFilter) return false;
                          if (calendarSearchTerm.trim()) {
                            const q = calendarSearchTerm.toLowerCase();
                            return (
                              (notif.title && notif.title.toLowerCase().includes(q)) ||
                              (notif.titleTa && notif.titleTa.toLowerCase().includes(q)) ||
                              (notif.category && notif.category.toLowerCase().includes(q)) ||
                              (notif.subject && notif.subject.toLowerCase().includes(q)) ||
                              (notif.description && notif.description.toLowerCase().includes(q))
                            );
                          }
                          return true;
                        })
                        .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
                        .map(notif => {
                          const isEditingThis = editingNotifId === notif.id;
                          return (
                            <div
                              key={notif.id}
                              className={`p-4 rounded-2xl border flex items-start justify-between gap-4 transition-all group ${isEditingThis
                                  ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/60 shadow-xs'
                                  : 'bg-slate-50 hover:bg-purple-50/40 border-slate-200/80'
                                }`}
                            >
                              <div className="flex items-start gap-3.5 min-w-0">
                                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border shadow-xs ${notif.type === 'subject'
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    : notif.type === 'revision'
                                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                                      : notif.type === 'test'
                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                        : 'bg-purple-50 border-purple-200 text-purple-700'
                                  }`}>
                                  <span className="text-xs font-black">{notif.date ? new Date(notif.date).getDate() : '26'}</span>
                                  <span className="text-[9px] font-bold uppercase">{notif.date ? new Date(notif.date).toLocaleString('en-US', { month: 'short' }) : '2026'}</span>
                                </div>

                                <div className="min-w-0 space-y-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${notif.type === 'subject'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : notif.type === 'revision'
                                          ? 'bg-amber-100 text-amber-800'
                                          : notif.type === 'test'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-purple-100 text-purple-800'
                                      }`}>
                                      {notif.type ? notif.type.toUpperCase() : 'NOTIFICATION'}
                                    </span>
                                    <span className="text-[9px] font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                                      {notif.category}
                                    </span>
                                    {notif.duration && (
                                      <span className="text-[9px] font-medium text-slate-400">
                                        • {notif.duration}
                                      </span>
                                    )}
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${notif.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                                        notif.status === 'Ongoing' ? 'bg-blue-50 text-blue-700' :
                                          'bg-slate-100 text-slate-600'
                                      }`}>
                                      {notif.status || 'Upcoming'}
                                    </span>
                                  </div>

                                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-1" title={notif.title}>
                                    {notif.title}
                                  </h4>
                                  {notif.titleTa && (
                                    <p className="text-xs text-slate-500 font-tamil line-clamp-1">{notif.titleTa}</p>
                                  )}
                                  {notif.description && (
                                    <p className="text-[11px] text-slate-500 line-clamp-1">{notif.description}</p>
                                  )}
                                  {Array.isArray(notif.syllabusTopics) && notif.syllabusTopics.length > 0 && (
                                    <div className="flex items-center gap-1 flex-wrap pt-0.5">
                                      {notif.syllabusTopics.slice(0, 3).map((topic: string, tIdx: number) => (
                                        <span key={tIdx} className="text-[9px] bg-slate-200/70 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                                          {topic}
                                        </span>
                                      ))}
                                      {notif.syllabusTopics.length > 3 && (
                                        <span className="text-[9px] text-slate-400">+{notif.syllabusTopics.length - 3} more</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {notif.pdfUrl && (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenPdf(notif.pdfUrl, notif.fileName || `${notif.title}.pdf`)}
                                    className="p-2 text-slate-500 hover:text-purple-600 hover:bg-white rounded-xl transition-all cursor-pointer shadow-2xs border border-transparent hover:border-slate-200"
                                    title="View Attached PDF Notice"
                                  >
                                    <FileText className="h-4 w-4" />
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleEditNotif(notif)}
                                  title="Edit Milestone Details"
                                  className={`p-2 rounded-xl transition-all cursor-pointer shadow-2xs border ${isEditingThis
                                      ? 'bg-amber-500 text-white border-amber-600'
                                      : 'text-slate-500 hover:text-amber-600 hover:bg-white border-transparent hover:border-slate-200'
                                    }`}
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDelete('notifications', notif.id, 'notifications')}
                                  title="Delete Plan Milestone"
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 shrink-0 cursor-pointer shadow-2xs"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}

                      {notifications.length === 0 && (
                        <div className="text-center py-16 text-slate-400">
                          <Calendar className="h-10 w-10 mx-auto mb-2 opacity-20" />
                          <p className="text-xs font-bold uppercase tracking-wider">No 2026 plan milestones posted</p>
                          <button
                            type="button"
                            onClick={handleResetCalendarPlans}
                            className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 shadow-sm"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span>Restore 47 Official Milestones</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
        
        {/* TAB 7: STORE BOOKS MANAGEMENT */}
        {activeTab === 'store' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AdminStorePanel />
          </div>
        )}
      </main>

      {/* Question Test Interactive Preview Modal */}
      <AnimatePresence>
        {previewQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden my-auto"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between gap-4 border-b border-slate-700/50 shrink-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-extrabold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded uppercase">
                      Question Test Preview
                    </span>
                    <span className="text-[10px] font-bold bg-white/10 text-white/90 px-2 py-0.5 rounded uppercase">
                      {previewQuiz.category}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${previewQuiz.difficulty === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                        previewQuiz.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                      {previewQuiz.difficulty || 'Medium'}
                    </span>
                    <span className="text-[10px] text-slate-300 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {previewQuiz.duration || '60 min'}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white truncate" title={previewQuiz.title}>
                    {previewQuiz.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const toEdit = previewQuiz;
                      setPreviewQuiz(null);
                      handleEditQuiz(toEdit);
                    }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit Test</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewQuiz(null)}
                    className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                    title="Close Preview"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Language Toolbar in Modal */}
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-600 uppercase text-[10px] tracking-wider">Preview Language:</span>
                  <div className="inline-flex rounded-lg p-0.5 bg-slate-200/80">
                    <button
                      type="button"
                      onClick={() => setPreviewLang('both')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${previewLang === 'both' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      Bilingual (ENG + தமிழ்)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewLang('en')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${previewLang === 'en' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      English Only
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewLang('ta')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${previewLang === 'ta' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      தமிழ் Only
                    </button>
                  </div>
                </div>

                <div className="text-slate-500 font-medium text-xs">
                  Total Questions: <span className="font-bold text-slate-800">
                    {previewQuiz.questionsList?.length || previewQuiz.questions?.length || previewQuiz.questionsCount || 0}
                  </span>
                </div>
              </div>

              {/* Questions List */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                {(() => {
                  const rawList = previewQuiz.questionsList || previewQuiz.questions || previewQuiz.quiz || [];
                  const qList = Array.isArray(rawList) ? rawList : [];
                  if (qList.length === 0) {
                    return (
                      <div className="text-center py-12 text-slate-400">
                        <HelpCircle className="h-10 w-10 mx-auto mb-2 opacity-30" />
                        <p className="font-bold text-sm">No questions available to preview.</p>
                      </div>
                    );
                  }

                  return qList.map((q: any, idx: number) => {
                    const textEn = q.textEn || q.question || '';
                    const textTa = q.textTa || q.questionTa || '';
                    const optionsEn: string[] = Array.isArray(q.optionsEn) ? q.optionsEn : (Array.isArray(q.options) ? q.options : []);
                    const optionsTa: string[] = Array.isArray(q.optionsTa) ? q.optionsTa : [];
                    const correctIdx = typeof q.correctOption === 'number'
                      ? q.correctOption
                      : (typeof q.correctAnswer === 'number'
                        ? q.correctAnswer
                        : (typeof q.correct === 'number' ? q.correct : 0));
                    const explEn = q.explanationEn || q.explanation || '';
                    const explTa = q.explanationTa || '';

                    return (
                      <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 hover:border-emerald-200 transition-all">
                        {/* Question Header */}
                        <div className="flex items-start gap-3">
                          <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0 space-y-1">
                            {(previewLang === 'both' || previewLang === 'en') && textEn && (
                              <p className="text-sm font-bold text-slate-900 leading-snug">{textEn}</p>
                            )}
                            {(previewLang === 'both' || previewLang === 'ta') && textTa && (
                              <p className={`text-sm leading-snug ${previewLang === 'both' ? 'text-slate-600 font-medium pt-0.5' : 'text-slate-900 font-bold'}`}>
                                {textTa}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-0 sm:pl-10">
                          {optionsEn.map((optEn, oIdx) => {
                            const isCorrect = correctIdx === oIdx;
                            const optTa = optionsTa[oIdx] || '';
                            return (
                              <div
                                key={oIdx}
                                className={`p-3 rounded-xl border text-xs transition-all ${isCorrect
                                    ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/30'
                                    : 'bg-white border-slate-200 text-slate-700'
                                  }`}
                              >
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className={`font-bold text-xs ${isCorrect ? 'text-emerald-800' : 'text-slate-700'}`}>
                                    Option {String.fromCharCode(65 + oIdx)}
                                  </span>
                                  {isCorrect && (
                                    <span className="text-[10px] font-extrabold uppercase tracking-wide bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                                      <Check className="h-3 w-3" /> Correct Key
                                    </span>
                                  )}
                                </div>
                                {(previewLang === 'both' || previewLang === 'en') && optEn && (
                                  <p className={`font-semibold ${isCorrect ? 'text-emerald-950 font-bold' : 'text-slate-800'}`}>{optEn}</p>
                                )}
                                {(previewLang === 'both' || previewLang === 'ta') && optTa && (
                                  <p className={`mt-0.5 ${previewLang === 'both' ? 'text-slate-500 text-[11px]' : 'font-semibold text-slate-800'}`}>{optTa}</p>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {(explEn || explTa) && (
                          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-1 sm:ml-10">
                            <div className="flex items-center gap-1.5 font-bold text-blue-900 uppercase text-[10px] tracking-wider">
                              <Sparkles className="h-3 w-3 text-blue-600" />
                              <span>Faculty Solution & Explanation (விளக்கம்):</span>
                            </div>
                            {(previewLang === 'both' || previewLang === 'en') && explEn && (
                              <p className="text-blue-950 leading-relaxed font-medium">{explEn}</p>
                            )}
                            {(previewLang === 'both' || previewLang === 'ta') && explTa && (
                              <p className="text-blue-800/90 leading-relaxed font-normal">{explTa}</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
                <span className="text-xs text-slate-500">
                  Ready for live test takers on the Student Portal.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const toEdit = previewQuiz;
                      setPreviewQuiz(null);
                      handleEditQuiz(toEdit);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit This Test
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewQuiz(null)}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


    </div>
  );
}

function AdminSidebarLink({
  icon,
  label,
  active,
  badge,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${active
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
        : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
        }`}
    >
      <div className="flex items-center gap-3 truncate">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      {badge !== undefined && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${active ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
          }`}>
          {badge}
        </span>
      )}
    </button>
  );
}
