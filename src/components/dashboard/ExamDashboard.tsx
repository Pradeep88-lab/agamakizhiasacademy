import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logoImage from '../../assets/images/regenerated_image_1790577966199.jpg';
import tnpscLogo from '../../assets/tnpsc-logo.png';
import sscLogo from '../../assets/ssc-logo.jpg';
import railwayLogo from '../../assets/railway-logo.png';
import quizIcon from '../../assets/quiz-icon.jpg';
import testIcon from '../../assets/test-icon.jpg';
import {
  Menu,
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Settings,
  LogOut,
  ChevronRight,
  Search,
  Bell,
  Award,
  Clock,
  ArrowUpRight,
  FileText,
  FileDown,
  ArrowLeft,
  User,
  Phone,
  Library,
  Layers,
  Globe,
  Dna,
  Beaker,
  Zap,
  Calculator,
  Brain,
  BookMarked,
  Newspaper,
  Calendar as CalendarIcon,
  ChevronLeft,
  ExternalLink,
  ClipboardCheck,
  Timer,
  Trophy,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  TrendingUp,
  Target,
  History as HistoryIcon,
  PauseCircle,
  PlayCircle,
  Camera,
  Upload,
  ThumbsUp,
  RefreshCw,
  Eye,
  Download,
  CheckSquare,
  X,
  RotateCcw,
  Sparkles,
  Trash2,
  CalendarDays,
  Square,
  Info,
  Filter,
  Printer,
  ListFilter,
  Play,
  Flame,
  CheckCheck
} from 'lucide-react';

import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { openPdfPreview, downloadPdfFile, getBlob, safeLocalStorageSet } from '../../lib/storage';
import { initialSyllabi, ExamSyllabusItem } from '../../lib/syllabusData';
import { initialFullMockQuizzes, MockQuizItem, QuizQuestion, generateQuizQuestions } from '../../lib/quizData';
import { initialQuestionPapers, QuestionPaperItem } from '../../lib/questionPaperData';
import { initial2026CalendarPlan, CalendarPlanItem, PlanType, PlanStatus } from '../../lib/calendarPlan2026Data';
import SubjectChapterView from './SubjectChapterView';
import { downloadStudentMarksPdf, downloadSingleResultPdf, download2026CalendarPlanPdf } from '../../lib/pdfReportGenerator';

const exams = [
  { id: 'tnpsc-g1', name: 'TNPSC Group I', category: 'TNPSC Group I', badge: 'Civil Services', difficulty: 'High', students: '45k+' },
  { id: 'tnpsc-g2', name: 'TNPSC Group II / IIA', category: 'TNPSC Group II / IIA', badge: 'Group 2 / 2A', difficulty: 'Medium', students: '120k+' },
  { id: 'tnpsc-g4', name: 'TNPSC Group IV', category: 'TNPSC Group IV', badge: 'Group 4 & VAO', difficulty: 'Medium', students: '250k+' },
  { id: 'tnpsc-cts', name: 'TNPSC CTS', category: 'TNPSC CTS', badge: 'Technical Services', difficulty: 'High', students: '28k+' },
  { id: 'ssc', name: 'SSC', category: 'SSC', badge: 'CGL / CHSL / MTS', difficulty: 'Medium', students: '1.2M+' },
  { id: 'railway', name: 'Railway', category: 'Railway', badge: 'RRB NTPC & ALP', difficulty: 'Medium', students: '800k+' },
  { id: 'trt', name: 'TRT', category: 'TRT', badge: 'Teachers Recruitment', difficulty: 'Medium', students: '35k+' },
  { id: 'tet', name: 'TET', category: 'TET', badge: 'Teacher Eligibility', difficulty: 'Medium', students: '65k+' },
];

const testResults: any[] = [];

const quizzes: any[] = [];

const notifications = [
  { id: 1, title: 'TNPSC Group I Notification', date: '2024-10-15', status: 'Upcoming', category: 'TNPSC Group I' },
  { id: 2, title: 'TNPSC Group II / IIA Mains Schedule', date: '2024-11-20', status: 'Upcoming', category: 'TNPSC Group II / IIA' },
  { id: 3, title: 'TNPSC Group IV & VAO Notification', date: '2024-12-10', status: 'Upcoming', category: 'TNPSC Group IV' },
  { id: 4, title: 'TNPSC CTS Interview & Result Schedule', date: '2025-01-10', status: 'Upcoming', category: 'TNPSC CTS' },
  { id: 5, title: 'SSC CGL Tier 1 Examination', date: '2024-09-30', status: 'Ongoing', category: 'SSC' },
  { id: 6, title: 'Railway RRB ALP & NTPC Stage 1', date: '2024-10-05', status: 'Upcoming', category: 'Railway' },
  { id: 7, title: 'TRT Teachers Recruitment Notification', date: '2024-12-01', status: 'Upcoming', category: 'TRT' },
  { id: 8, title: 'TET Teacher Eligibility Test Paper I/II', date: '2024-09-25', status: 'Completed', category: 'TET' },
];

const subjects = [
  { id: 'maths', name: 'Maths', nameTa: 'கணிதம்', icon: <Calculator className="h-5 w-5" />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'reasoning', name: 'Reasoning', nameTa: 'காரணவியல்', icon: <Brain className="h-5 w-5" />, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'physics', name: 'Physics', nameTa: 'இயற்பியல்', icon: <Zap className="h-5 w-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'chemistry', name: 'Chemistry', nameTa: 'வேதியியல்', icon: <Beaker className="h-5 w-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'biology', name: 'Biology', nameTa: 'உயிரியல்', icon: <Dna className="h-5 w-5" />, color: 'text-pink-600', bg: 'bg-pink-50' },
  { id: 'history', name: 'History', nameTa: 'வரலாறு', icon: <Library className="h-5 w-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'polity', name: 'Polity', nameTa: 'குடிமையியல்', icon: <Layers className="h-5 w-5" />, color: 'text-sky-600', bg: 'bg-sky-50' },
  { id: 'geography', name: 'Geography', nameTa: 'புவியியல்', icon: <Globe className="h-5 w-5" />, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { id: 'environment', name: 'Environment', nameTa: 'சுற்றுச்சூழல்', icon: <Globe className="h-5 w-5" />, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'tamil', name: 'Tamil', nameTa: 'பொதுத்தமிழ்', icon: <BookMarked className="h-5 w-5" />, color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'english', name: 'English', nameTa: 'General English', icon: <BookMarked className="h-5 w-5" />, color: 'text-teal-600', bg: 'bg-teal-50' },
  { id: 'current-affairs', name: 'Current Affairs', nameTa: 'நடப்பு நிகழ்வுகள்', icon: <Newspaper className="h-5 w-5" />, color: 'text-rose-600', bg: 'bg-rose-50' },
];

export default function ExamDashboard({ onLogout }: { onLogout: () => void }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [language, setLanguage] = useState<'english' | 'tamil'>(() => {
    return (localStorage.getItem('agamakizh_study_medium') as 'english' | 'tamil') || 'english';
  });

  const toggleLanguage = (lang: 'english' | 'tamil') => {
    setLanguage(lang);
    localStorage.setItem('agamakizh_study_medium', lang);
  };
  const [activeTab, setActiveTab] = useState('all');
  const [selectedExam, setSelectedExam] = useState<typeof exams[0] | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<typeof subjects[0] | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [selectedResult, setSelectedResult] = useState<any | null>(null);
  const [selectedAnalysisQuestion, setSelectedAnalysisQuestion] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'calendar' | 'quiz' | 'marks' | 'settings'>('dashboard');
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('agamakizh_student_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name || 'Alex Johnson',
          mobile: parsed.mobile || '+91 9876543210',
          avatar: parsed.avatar || null
        };
      }
    } catch { }
    return {
      name: 'Alex Johnson',
      mobile: '+91 9876543210',
      avatar: null as string | null
    };
  });
  const [dynamicQuizzes, setDynamicQuizzes] = useState<any[]>(() => {
    try {
      const local = localStorage.getItem('agamakizh_admin_quizzes');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) {
          return parsed.filter((q: any) => q.id !== 1 && q.id !== 2 && q.id !== 3 && q.id !== 4 && q.id !== 5 && !['TNPSC Group I - Full Length Mock', 'SSC CGL Tier 1 - Mock Test 01', 'Railway RRB NTPC - Mock Test', 'Indian Polity - Fundamentals', 'Physics - Mechanics & Motion'].includes(q.title));
        }
      }
    } catch { }
    return [];
  });
  const [questionPapers, setQuestionPapers] = useState<QuestionPaperItem[]>(() => {
    try {
      const local = localStorage.getItem('agamakizh_admin_papers');
      if (local !== null) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch { }
    return initialQuestionPapers;
  });
  const [testResultSummary, setTestResultSummary] = useState<{
    testTitle: string;
    category: string;
    totalQuestions: number;
    attempted: number;
    correct: number;
    wrong: number;
    score: number;
    percentage: number;
    timeSpent: string;
    questions: QuizQuestion[];
    userAnswers: Record<number, number>;
  } | null>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewLang, setReviewLang] = useState<'english' | 'tamil'>('english');
  const [papersSearchTerm, setPapersSearchTerm] = useState('');

  // 2026 Academic Calendar & Comprehensive Study Plan State
  const [calendarPlans, setCalendarPlans] = useState<CalendarPlanItem[]>(() => {
    try {
      const local = localStorage.getItem('agamakizh_calendar_plan_2026');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { }
    return initial2026CalendarPlan;
  });

  const [calendarYear, setCalendarYear] = useState<number>(2026);
  // Default to null to show full roadmap or 0-11 for specific month (e.g. 8 for September)
  const [calendarSelectedMonth, setCalendarSelectedMonth] = useState<number | null>(null);
  const [calendarPlanType, setCalendarPlanType] = useState<PlanType | 'all'>('all');
  const [calendarExamFilter, setCalendarExamFilter] = useState<string>('all');
  const [calendarSearchQuery, setCalendarSearchQuery] = useState<string>('');
  const [calendarViewMode, setCalendarViewMode] = useState<'list' | 'grid'>('list');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(null);
  const [selectedPlanModal, setSelectedPlanModal] = useState<CalendarPlanItem | null>(null);
  const [completedPlanIds, setCompletedPlanIds] = useState<string[]>(() => {
    try {
      const local = localStorage.getItem('agamakizh_completed_calendar_items');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch { }
    return [];
  });

  const togglePlanCompletion = (id: string | number) => {
    const strId = String(id);
    const updated = completedPlanIds.includes(strId)
      ? completedPlanIds.filter(i => i !== strId)
      : [...completedPlanIds, strId];
    setCompletedPlanIds(updated);
    safeLocalStorageSet('agamakizh_completed_calendar_items', updated);
  };

  const [dynamicNotifs, setDynamicNotifs] = useState<any[]>(notifications);
  const [dynamicStudy, setDynamicStudy] = useState<any[]>(() => {
    try {
      const localStudy = localStorage.getItem('agamakizh_admin_study');
      if (localStudy) {
        const parsed = JSON.parse(localStudy);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { }
    return [
      { id: 'sm-default-1', title: 'TNPSC Group I - General Science Official Notes', category: 'TNPSC', fileName: 'TNPSC_General_Science_Notes.pdf', fileSize: '2.4 MB', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      { id: 'sm-default-2', title: 'History & Culture of India & Tamil Nadu', category: 'TNPSC', fileName: 'Unit-4-HISTORY-AND-CULTURE-OF-INDIA.pdf', fileSize: '3.1 MB', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      { id: 'sm-default-3', title: 'Indian Polity & Constitutional Framework', category: 'TNPSC', fileName: 'Indian_Polity_Revision.pdf', fileSize: '2.8 MB', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      { id: 'sm-default-4', title: 'Development Administration in Tamil Nadu', category: 'TNPSC', fileName: 'TN_Geography_Admin.pdf', fileSize: '1.9 MB', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ];
  });
  const [dynamicResults, setDynamicResults] = useState<any[]>(() => {
    try {
      const local = localStorage.getItem('agamakizh_admin_results');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((r: any) =>
            !['TNPSC Group I - Prelims Mock 1', 'SSC CGL - Quant Sectional', 'Railway RRB NTPC - Mock 4', 'TNPSC Group IV - Full Length', 'SSC CHSL - English Tier 1'].includes(r.exam || r.examName)
          );
          safeLocalStorageSet('agamakizh_admin_results', filtered);
          return filtered;
        }
      }
    } catch { }
    return [];
  });

  // Syllabi Management State
  const [syllabi, setSyllabi] = useState<Record<string, ExamSyllabusItem>>(() => {
    try {
      const local = localStorage.getItem('agamakizh_exam_syllabi');
      if (local) return { ...initialSyllabi, ...JSON.parse(local) };
    } catch { }
    return initialSyllabi;
  });

  const [studySyncFeedback, setStudySyncFeedback] = useState('');
  const [isStudySyncing, setIsStudySyncing] = useState(false);

  const handleSyncStudyAndSyllabus = async () => {
    setIsStudySyncing(true);
    try {
      const localStudy = localStorage.getItem('agamakizh_admin_study');
      if (localStudy) {
        const parsed = JSON.parse(localStudy);
        if (Array.isArray(parsed) && parsed.length > 0) setDynamicStudy(parsed);
      }
      const localSyllabi = localStorage.getItem('agamakizh_exam_syllabi');
      if (localSyllabi) {
        setSyllabi(prev => ({ ...prev, ...JSON.parse(localSyllabi) }));
      }
      setStudySyncFeedback('Synced with Admin!');
      setTimeout(() => setStudySyncFeedback(''), 2500);
    } finally {
      setIsStudySyncing(false);
    }
  };

  useEffect(() => {
    const handleStorageSync = () => {
      try {
        const localStudy = localStorage.getItem('agamakizh_admin_study');
        if (localStudy) {
          const parsed = JSON.parse(localStudy);
          if (Array.isArray(parsed) && parsed.length > 0) setDynamicStudy(parsed);
        }
        const localSyllabi = localStorage.getItem('agamakizh_exam_syllabi');
        if (localSyllabi) setSyllabi(prev => ({ ...prev, ...JSON.parse(localSyllabi) }));
      } catch (e) {
        console.warn('Storage sync error:', e);
      }
    };

    const handlePapersSync = () => {
      try {
        const local = localStorage.getItem('agamakizh_admin_papers');
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) setQuestionPapers(parsed);
        }
      } catch (e) {
        console.warn('Papers sync error:', e);
      }
    };

    const handleQuizzesSync = () => {
      try {
        const local = localStorage.getItem('agamakizh_admin_quizzes');
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) {
            setDynamicQuizzes(parsed.filter((q: any) => q.id !== 1 && q.id !== 2 && q.id !== 3 && q.id !== 4 && q.id !== 5 && !['TNPSC Group I - Full Length Mock', 'SSC CGL Tier 1 - Mock Test 01', 'Railway RRB NTPC - Mock Test', 'Indian Polity - Fundamentals', 'Physics - Mechanics & Motion'].includes(q.title)));
            return;
          }
        }
      } catch (e) {
        console.warn('Quizzes sync error:', e);
      }
      setDynamicQuizzes([]);
    };

    const handleResultsSync = (e: any) => {
      if (e.detail?.studentResults && Array.isArray(e.detail.studentResults)) {
        setDynamicResults(e.detail.studentResults);
      }
    };

    const handleCalendarSync = (e: any) => {
      if (e.detail?.plans && Array.isArray(e.detail.plans)) {
        setCalendarPlans(e.detail.plans);
      }
    };

    window.addEventListener('storage', handleStorageSync);
    window.addEventListener('agamakizh_study_updated', handleStorageSync);
    window.addEventListener('agamakizh_syllabus_updated', handleStorageSync);
    window.addEventListener('agamakizh_papers_updated', handlePapersSync);
    window.addEventListener('agamakizh_quizzes_updated', handleQuizzesSync);
    window.addEventListener('agamakizh_results_updated', handleResultsSync);
    window.addEventListener('agamakizh_calendar_plan_updated', handleCalendarSync);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('agamakizh_channel');
      bc.onmessage = (msg) => {
        if (msg.data?.type === 'STUDY_UPDATED' && msg.data.studyMaterials) {
          setDynamicStudy(msg.data.studyMaterials);
        } else if (msg.data?.type === 'SYLLABUS_UPDATED') {
          handleStorageSync();
        } else if (msg.data?.type === 'PAPERS_UPDATED' && msg.data.questionPapers) {
          setQuestionPapers(msg.data.questionPapers);
        } else if (msg.data?.type === 'QUIZZES_UPDATED' && Array.isArray(msg.data.quizzes)) {
          setDynamicQuizzes(msg.data.quizzes.filter((q: any) => q.id !== 1 && q.id !== 2 && q.id !== 3 && q.id !== 4 && q.id !== 5 && !['TNPSC Group I - Full Length Mock', 'SSC CGL Tier 1 - Mock Test 01', 'Railway RRB NTPC - Mock Test', 'Indian Polity - Fundamentals', 'Physics - Mechanics & Motion'].includes(q.title)));
        } else if (msg.data?.type === 'RESULTS_UPDATED' && Array.isArray(msg.data.studentResults)) {
          setDynamicResults(msg.data.studentResults);
        } else if (msg.data?.type === 'CALENDAR_PLAN_UPDATED' && Array.isArray(msg.data.plans)) {
          setCalendarPlans(msg.data.plans);
        }
      };
    } catch { }

    const fetchDynamicData = async () => {
      try {
        // Fetch Question Papers
        try {
          const pSnap = await getDocs(collection(db, 'questionPapers'));
          if (!pSnap.empty) {
            setQuestionPapers(pSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuestionPaperItem)));
          } else {
            const localPapers = localStorage.getItem('agamakizh_admin_papers');
            if (localPapers !== null) {
              const parsed = JSON.parse(localPapers);
              if (Array.isArray(parsed)) setQuestionPapers(parsed);
            }
          }
        } catch {
          const localPapers = localStorage.getItem('agamakizh_admin_papers');
          if (localPapers !== null) {
            const parsed = JSON.parse(localPapers);
            if (Array.isArray(parsed)) setQuestionPapers(parsed);
          }
        }

        const qSnap = await getDocs(collection(db, 'quizzes'));
        if (!qSnap.empty) {
          setDynamicQuizzes(qSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter((q: any) => q.id !== 1 && q.id !== 2 && q.id !== 3 && q.id !== 4 && q.id !== 5 && !['TNPSC Group I - Full Length Mock', 'SSC CGL Tier 1 - Mock Test 01', 'Railway RRB NTPC - Mock Test', 'Indian Polity - Fundamentals', 'Physics - Mechanics & Motion'].includes(q.title)));
        } else {
          const localQuizzes = localStorage.getItem('agamakizh_admin_quizzes');
          if (localQuizzes) {
            try {
              const parsed = JSON.parse(localQuizzes);
              if (Array.isArray(parsed)) {
                setDynamicQuizzes(parsed.filter((q: any) => q.id !== 1 && q.id !== 2 && q.id !== 3 && q.id !== 4 && q.id !== 5 && !['TNPSC Group I - Full Length Mock', 'SSC CGL Tier 1 - Mock Test 01', 'Railway RRB NTPC - Mock Test', 'Indian Polity - Fundamentals', 'Physics - Mechanics & Motion'].includes(q.title)));
              }
            } catch { }
          } else {
            setDynamicQuizzes([]);
          }
        }

        // Fetch 2026 Calendar Plans
        try {
          const cpSnap = await getDocs(query(collection(db, 'calendarPlans'), orderBy('date', 'asc')));
          if (!cpSnap.empty) {
            const remotePlans = cpSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CalendarPlanItem[];
            setCalendarPlans(remotePlans);
            safeLocalStorageSet('agamakizh_calendar_plan_2026', remotePlans);
          } else {
            const localPlans = localStorage.getItem('agamakizh_calendar_plan_2026');
            if (localPlans) {
              const parsed = JSON.parse(localPlans);
              if (Array.isArray(parsed) && parsed.length > 0) setCalendarPlans(parsed);
            }
          }
        } catch {
          const localPlans = localStorage.getItem('agamakizh_calendar_plan_2026');
          if (localPlans) {
            try {
              const parsed = JSON.parse(localPlans);
              if (Array.isArray(parsed) && parsed.length > 0) setCalendarPlans(parsed);
            } catch { }
          }
        }

        const nSnap = await getDocs(query(collection(db, 'notifications'), orderBy('date', 'desc')));
        if (!nSnap.empty) {
          setDynamicNotifs([...notifications, ...nSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))]);
        }

        const sSnap = await getDocs(collection(db, 'studyMaterials'));
        if (!sSnap.empty) {
          setDynamicStudy(sSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else {
          const localStudy = localStorage.getItem('agamakizh_admin_study');
          if (localStudy) setDynamicStudy(JSON.parse(localStudy));
        }

        // Fetch Student Results
        try {
          const rSnap = await getDocs(collection(db, 'studentResults'));
          if (!rSnap.empty) {
            const remoteResults = rSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
              .filter((r: any) => !['TNPSC Group I - Prelims Mock 1', 'SSC CGL - Quant Sectional', 'Railway RRB NTPC - Mock 4', 'TNPSC Group IV - Full Length', 'SSC CHSL - English Tier 1'].includes(r.exam || r.examName));
            setDynamicResults(remoteResults);
            safeLocalStorageSet('agamakizh_admin_results', remoteResults);
          } else {
            const localResults = localStorage.getItem('agamakizh_admin_results');
            if (localResults) {
              const parsed = JSON.parse(localResults);
              if (Array.isArray(parsed)) {
                const filtered = parsed.filter((r: any) => !['TNPSC Group I - Prelims Mock 1', 'SSC CGL - Quant Sectional', 'Railway RRB NTPC - Mock 4', 'TNPSC Group IV - Full Length', 'SSC CHSL - English Tier 1'].includes(r.exam || r.examName));
                setDynamicResults(filtered);
                safeLocalStorageSet('agamakizh_admin_results', filtered);
              }
            } else {
              setDynamicResults([]);
            }
          }
        } catch {
          const localResults = localStorage.getItem('agamakizh_admin_results');
          if (localResults) {
            const parsed = JSON.parse(localResults);
            if (Array.isArray(parsed)) {
              const filtered = parsed.filter((r: any) => !['TNPSC Group I - Prelims Mock 1', 'SSC CGL - Quant Sectional', 'Railway RRB NTPC - Mock 4', 'TNPSC Group IV - Full Length', 'SSC CHSL - English Tier 1'].includes(r.exam || r.examName));
              setDynamicResults(filtered);
              safeLocalStorageSet('agamakizh_admin_results', filtered);
            }
          } else {
            setDynamicResults([]);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchDynamicData();

    return () => {
      window.removeEventListener('storage', handleStorageSync);
      window.removeEventListener('agamakizh_study_updated', handleStorageSync);
      window.removeEventListener('agamakizh_syllabus_updated', handleStorageSync);
      window.removeEventListener('agamakizh_quizzes_updated', handleQuizzesSync);
      window.removeEventListener('agamakizh_results_updated', handleResultsSync);
      window.removeEventListener('agamakizh_calendar_plan_updated', handleCalendarSync);
      if (bc) bc.close();
    };
  }, []);

  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [activeMockTest, setActiveMockTest] = useState<any | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeDown] = useState(10800); // 180 minutes for 200 questions
  const [isPaused, setIsPaused] = useState(false);
  const [testMedium, setTestMedium] = useState<'english' | 'tamil' | 'bilingual'>('bilingual');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (activeMockTest) {
      setTestMedium(language === 'tamil' ? 'tamil' : 'bilingual');
    }
  }, [activeMockTest, language]);

  const handleDashboardClick = () => {
    setSelectedExam(null);
    setSelectedSubject(null);
    setSelectedChapter(null);
    setCurrentView('dashboard');
    setActiveMockTest(null);
  };

  const handleBackClick = () => {
    if (selectedChapter !== null) {
      setSelectedChapter(null);
    } else if (selectedSubject !== null) {
      setSelectedSubject(null);
    } else if (selectedExam !== null) {
      setSelectedExam(null);
    } else {
      handleDashboardClick();
    }
  };

  const handleCalendarClick = () => {
    setSelectedExam(null);
    setCurrentView('calendar');
    setActiveMockTest(null);
  };

  const handleQuizClick = () => {
    setSelectedExam(null);
    setCurrentView('quiz');
    setActiveMockTest(null);
  };

  const handleMarksClick = () => {
    setSelectedExam(null);
    setSelectedResult(null);
    setCurrentView('marks');
    setActiveMockTest(null);
  };

  const handleSettingsClick = () => {
    setSelectedExam(null);
    setCurrentView('settings');
    setActiveMockTest(null);
  };

  const startTest = (quiz: any) => {
    let qList: QuizQuestion[] = [];
    if (quiz.questionsList && Array.isArray(quiz.questionsList) && quiz.questionsList.length > 0) {
      qList = quiz.questionsList;
    } else if (Array.isArray(quiz.questions) && quiz.questions.length > 0) {
      qList = quiz.questions;
    } else {
      const count = typeof quiz.questions === 'number' ? quiz.questions : 20;
      qList = generateQuizQuestions(count, quiz.category || 'General');
    }
    const qCount = qList.length;
    setActiveMockTest({
      ...quiz,
      qCount,
      questionList: qList
    });
    setCurrentQuestion(1);
    setAnswers({});
    setIsPaused(false);
    setShowSubmitModal(false);
    setTestResultSummary(null);
    setReviewMode(false);
    setTimeDown(quiz.durationSeconds || (qCount === 200 ? 10800 : qCount === 120 ? 5400 : qCount === 100 ? 3600 : qCount * 60));
  };

  const handleFinalSubmitTest = () => {
    if (!activeMockTest) return;
    const questionsList: QuizQuestion[] = activeMockTest.questionList || [];
    let correct = 0;
    let wrong = 0;
    const answeredCount = Object.keys(answers).length;

    questionsList.forEach((q, idx) => {
      const qNum = idx + 1;
      const userChoice = answers[qNum];
      if (userChoice !== undefined) {
        if (userChoice === q.correctAnswer) {
          correct++;
        } else {
          wrong++;
        }
      }
    });

    const total = questionsList.length || activeMockTest.qCount || 20;
    const percentage = Math.round((correct / (total || 1)) * 100);
    const timeSpentSeconds = Math.max(1, (activeMockTest.durationSeconds || 1200) - timeLeft);
    const timeSpentFormatted = formatTime(timeSpentSeconds);

    const newResult = {
      id: `res-${Date.now()}`,
      studentName: userProfile.name || 'Alex Johnson',
      rollNo: 'AGM-2024-042',
      exam: activeMockTest.title,
      examName: activeMockTest.title,
      category: activeMockTest.category,
      score: correct,
      marksScored: correct,
      total: total,
      totalMarks: total,
      percentage,
      rank: percentage >= 80 ? '1' : percentage >= 60 ? '2' : '3',
      status: percentage >= 50 ? 'Passed' : 'Needs Practice',
      correct,
      wrong,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedResults = [newResult, ...dynamicResults];
    setDynamicResults(updatedResults);
    safeLocalStorageSet('agamakizh_admin_results', updatedResults);
    try {
      const bc = new BroadcastChannel('agamakizh_channel');
      bc.postMessage({ type: 'RESULTS_UPDATED', studentResults: updatedResults });
    } catch { }

    setTestResultSummary({
      testTitle: activeMockTest.title,
      category: activeMockTest.category,
      totalQuestions: total,
      attempted: answeredCount,
      correct,
      wrong,
      score: correct,
      percentage,
      timeSpent: timeSpentFormatted,
      questions: questionsList,
      userAnswers: { ...answers }
    });

    setShowSubmitModal(false);
    setActiveMockTest(null);
  };

  // Delete individual test result
  const handleDeleteResult = async (id: any) => {
    if (!window.confirm(language === 'english' ? 'Are you sure you want to delete this test result record?' : 'இந்த தேர்வு முடிவை நிச்சயமாக நீக்க விரும்புகிறீர்களா?')) return;
    const filtered = dynamicResults.filter(r => r.id !== id);
    setDynamicResults(filtered);
    safeLocalStorageSet('agamakizh_admin_results', filtered);
    try {
      await deleteDoc(doc(db, 'studentResults', String(id)));
    } catch (e) {
      console.warn('Firestore delete failed:', e);
    }
    window.dispatchEvent(new CustomEvent('agamakizh_results_updated', {
      detail: { studentResults: filtered }
    }));
    try {
      const bc = new BroadcastChannel('agamakizh_channel');
      bc.postMessage({ type: 'RESULTS_UPDATED', studentResults: filtered });
    } catch { }
  };

  // Clear all test results
  const handleClearAllResults = async () => {
    if (!window.confirm(language === 'english' ? 'Are you sure you want to delete ALL test results?' : 'அனைத்து தேர்வு முடிவுகளையும் நிச்சயமாக நீக்க விரும்புகிறீர்களா?')) return;
    setDynamicResults([]);
    safeLocalStorageSet('agamakizh_admin_results', []);
    window.dispatchEvent(new CustomEvent('agamakizh_results_updated', {
      detail: { studentResults: [] }
    }));
    try {
      const bc = new BroadcastChannel('agamakizh_channel');
      bc.postMessage({ type: 'RESULTS_UPDATED', studentResults: [] });
    } catch { }
  };

  useEffect(() => {
    let timer: any;
    if (activeMockTest && timeLeft > 0 && !isPaused) {
      timer = setInterval(() => {
        setTimeDown((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && activeMockTest) {
      handleFinalSubmitTest();
      alert('Time is up! Your test has been submitted.');
    }
    return () => clearInterval(timer);
  }, [activeMockTest, timeLeft, isPaused]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  if (activeMockTest) {
    const answeredCount = Object.keys(answers).length;
    const remainingCount = activeMockTest.questions - answeredCount;

    return (
      <div className="flex flex-col h-screen bg-white">
        {/* Test Header */}
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 bg-slate-900 text-white">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (confirm('Quit test? Your progress will not be saved.')) {
                  setActiveMockTest(null);
                  setCurrentView('quiz');
                }
              }}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
              title="Close Test"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="w-px h-6 bg-slate-700 mx-1" />
            <div>
              <h1 className="text-sm font-bold leading-tight">{activeMockTest.title}</h1>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{activeMockTest.category} · {activeMockTest.questions} Qs</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Bilingual / Language Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => setTestMedium('bilingual')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${testMedium === 'bilingual' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                title="Both Languages: English + தமிழ்"
              >
                BOTH
              </button>
              <button
                type="button"
                onClick={() => setTestMedium('english')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${testMedium === 'english' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                ENG
              </button>
              <button
                type="button"
                onClick={() => setTestMedium('tamil')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${testMedium === 'tamil' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                தமிழ்
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 min-w-[100px] justify-center">
                <Timer className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-mono font-bold tabular-nums">{formatTime(timeLeft)}</span>
              </div>

              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`p-2 rounded-lg transition-colors ${isPaused ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                title={isPaused ? "Resume Test" : "Pause Test"}
              >
                {isPaused ? <PlayCircle className="h-5 w-5" /> : <PauseCircle className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setShowSubmitModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-emerald-900/20"
              >
                Submit
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden relative">
          {/* Pause Overlay */}
          <AnimatePresence>
            {isPaused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/20">
                    <PauseCircle className="h-10 w-10" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Test Paused</h2>
                  <p className="text-slate-400 mb-8 max-w-xs mx-auto">Your timer is stopped. Take a moment to breathe and resume when you are ready.</p>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-blue-50 transition-colors shadow-xl"
                  >
                    Resume Test
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Question Area */}
          <main className="flex-1 overflow-y-auto p-12 bg-slate-50">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                    Q. {currentQuestion}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded border border-slate-200">
                    {activeMockTest.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Attempted</span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">{answeredCount} / {activeMockTest.qCount}</span>
                  </div>
                </div>
              </div>

              {/* Question Card */}
              {(() => {
                const qItem = (activeMockTest.questionList && activeMockTest.questionList[currentQuestion - 1]) || {
                  id: currentQuestion,
                  textEn: 'Which of the following schedules of the Indian Constitution contains the division of powers between the Union and the States?',
                  textTa: 'இந்திய அரசியலமைப்பின் பின்வரும் அட்டவணைகளில் எது யூனியன் மற்றும் மாநிலங்களுக்கு இடையிலான அதிகாரப் பகிர்வைக் கொண்டுள்ளது?',
                  optionsEn: ['Fifth Schedule', 'Sixth Schedule', 'Seventh Schedule', 'Eighth Schedule'],
                  optionsTa: ['ஐந்தாவது அட்டவணை', 'ஆறாவது அட்டவணை', 'ஏழாவது அட்டவணை', 'எட்டாவது அட்டவணை'],
                  correctAnswer: 2
                };

                const isFinalQuestion = currentQuestion === activeMockTest.qCount;

                return (
                  <>
                    <div className="bg-white p-7 sm:p-10 rounded-3xl border border-slate-200 shadow-sm mb-8">
                      {/* Language Switcher Bar on Card */}
                      <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-3">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Language / மொழி:</span>
                        </div>
                        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => setTestMedium('bilingual')}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${testMedium === 'bilingual' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                              }`}
                          >
                            Bilingual (English + தமிழ்)
                          </button>
                          <button
                            type="button"
                            onClick={() => setTestMedium('english')}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${testMedium === 'english' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                              }`}
                          >
                            English
                          </button>
                          <button
                            type="button"
                            onClick={() => setTestMedium('tamil')}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${testMedium === 'tamil' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                              }`}
                          >
                            தமிழ்
                          </button>
                        </div>
                      </div>

                      {/* Question Text */}
                      <div className="space-y-2.5 mb-8">
                        {(testMedium === 'english' || testMedium === 'bilingual') && (
                          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
                            {qItem.textEn}
                          </h2>
                        )}
                        {(testMedium === 'tamil' || (testMedium === 'bilingual' && qItem.textTa && qItem.textTa !== qItem.textEn)) && (
                          <h3 className={`font-semibold text-slate-800 leading-relaxed ${testMedium === 'bilingual' ? 'text-base sm:text-lg text-indigo-950/90 pt-1.5 border-t border-slate-100' : 'text-lg sm:text-xl text-slate-900'
                            }`}>
                            {qItem.textTa || qItem.textEn}
                          </h3>
                        )}
                      </div>

                      {/* Options */}
                      <div className="space-y-3.5">
                        {qItem.optionsEn.map((optEn: string, idx: number) => {
                          const optTa = qItem.optionsTa && qItem.optionsTa[idx] ? qItem.optionsTa[idx] : '';
                          const isSelected = answers[currentQuestion] === idx;
                          const letter = String.fromCharCode(65 + idx);

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setAnswers({ ...answers, [currentQuestion]: idx })}
                              className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center justify-between group cursor-pointer ${isSelected
                                ? 'border-blue-600 bg-blue-50/60 text-blue-900 shadow-sm'
                                : 'border-slate-100 hover:border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                              <div className="flex items-start gap-4 flex-1">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                                  }`}>
                                  {letter}
                                </div>
                                <div className="flex flex-col flex-1">
                                  {(testMedium === 'english' || testMedium === 'bilingual') && (
                                    <span className="text-sm font-medium text-slate-900 leading-snug">{optEn}</span>
                                  )}
                                  {(testMedium === 'tamil' || (testMedium === 'bilingual' && optTa && optTa !== optEn)) && (
                                    <span className={`${testMedium === 'bilingual' ? 'text-xs text-indigo-900/80 font-normal mt-0.5' : 'text-sm font-medium text-slate-900'}`}>
                                      {optTa}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {isSelected && (
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-md shadow-blue-500/30 shrink-0 ml-3">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-10">
                      <button
                        type="button"
                        disabled={currentQuestion === 1}
                        onClick={() => setCurrentQuestion(prev => prev - 1)}
                        className="px-6 sm:px-8 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 disabled:opacity-30 flex items-center gap-2.5 transition-colors bg-white border border-slate-200 rounded-2xl cursor-pointer"
                      >
                        <ChevronLeft className="h-4 w-4" /> Previous
                      </button>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <button
                          type="button"
                          onClick={() => setAnswers((prev) => {
                            const next = { ...prev };
                            delete next[currentQuestion];
                            return next;
                          })}
                          className="px-4 sm:px-6 py-3 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest cursor-pointer"
                        >
                          Clear Choice
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (isFinalQuestion) {
                              setShowSubmitModal(true);
                            } else {
                              setCurrentQuestion(prev => Math.min(activeMockTest.qCount, prev + 1));
                            }
                          }}
                          className={`px-8 sm:px-10 py-3 rounded-2xl text-sm font-bold transition-all shadow-xl flex items-center gap-3 cursor-pointer ${isFinalQuestion
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                            : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10'
                            }`}
                        >
                          {isFinalQuestion ? 'Submit Test (சமர்ப்பி)' : 'Next Question'}
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </main>

          {/* Submit Modal */}
          <AnimatePresence>
            {showSubmitModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl"
                >
                  <div className="p-10 text-center">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <ClipboardCheck className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Final Submission</h3>
                    <p className="text-slate-500 text-sm mb-8">Are you ready to submit your test? Here is your summary.</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Qs</p>
                        <p className="text-xl font-bold text-slate-900">{activeMockTest.qCount}</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Answered</p>
                        <p className="text-xl font-bold text-blue-700">{answeredCount}</p>
                      </div>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 mb-8 flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-amber-600" />
                      <p className="text-xs font-semibold text-amber-700 text-left">
                        {remainingCount} questions are still unattempted. You can go back to review them.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={handleFinalSubmitTest}
                        className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                      >
                        Submit Final Test
                      </button>
                      <button
                        onClick={() => setShowSubmitModal(false)}
                        className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all cursor-pointer"
                      >
                        Go Back to Review
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Question Grid Sidebar */}
          <aside className="w-80 border-l border-slate-100 bg-white flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Question Palette</h3>
              <p className="text-sm font-bold text-slate-900">Total {activeMockTest.qCount} Questions</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: activeMockTest.qCount }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQuestion(i + 1)}
                    className={`h-10 rounded-lg text-[10px] font-bold transition-all border ${currentQuestion === i + 1
                      ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200 scale-105 z-10'
                      : answers[i + 1] !== undefined
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                        : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 space-y-3 bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-blue-600" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Current</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Answered</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-slate-100" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Unvisited</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F3F4F6] relative overflow-hidden">
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileMenu(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
      {/* Sidebar */}
      <aside className={`w-72 sm:w-64 bg-[#2b274e] border-r border-[#2b274e] flex flex-col absolute lg:static inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out ${showMobileMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <button 
          onClick={() => setShowMobileMenu(false)}
          className="lg:hidden absolute right-4 top-6 text-white/50 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="p-6">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-slate-100">
              <img src={logoImage} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white leading-tight">
              Agamakizh <br />
              <span className="text-[10px] uppercase tracking-[0.2em] text-blue-300 block">IAS Academy</span>
            </span>
          </div>

          <nav className="space-y-1">
            <SidebarLink
              icon={<LayoutDashboard className="h-4 w-4" />}
              label={language === 'english' ? 'Dashboard' : 'டாஷ்போர்டு'}
              active={currentView === 'dashboard' && !selectedExam}
              onClick={handleDashboardClick}
            />
            <SidebarLink
              icon={<CalendarIcon className="h-4 w-4" />}
              label={language === 'english' ? '2026 Calendar & Plan' : '2026 காலண்டர் & திட்டம்'}
              active={currentView === 'calendar'}
              onClick={handleCalendarClick}
            />
            <SidebarLink
              icon={<ClipboardCheck className="h-4 w-4" />}
              label={language === 'english' ? 'Quiz Test' : 'வினாடி வினா'}
              active={currentView === 'quiz'}
              onClick={handleQuizClick}
            />
            <SidebarLink
              icon={<BarChart3 className="h-4 w-4" />}
              label={language === 'english' ? 'Test Marks' : 'தேர்வு மதிப்பெண்கள்'}
              active={currentView === 'marks'}
              onClick={handleMarksClick}
            />
            <SidebarLink
              icon={<Settings className="h-4 w-4" />}
              label={language === 'english' ? 'Settings' : 'அமைப்புகள்'}
              active={currentView === 'settings'}
              onClick={handleSettingsClick}
            />
          </nav>
        </div>

        {/* Social Communities */}
        <div className="mt-auto px-6 pt-4 pb-2 border-t border-white/10">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            {language === 'english' ? 'Academy Channels' : 'அகாடமி சேனல்கள்'}
          </p>
          <div className="grid grid-cols-4 gap-2">
            <a
              href="https://www.youtube.com/@SanthakumariSenthil-d6k"
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-all hover:scale-105"
              title="YouTube (@agamakizhiasacademy)"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/agamakizh_ias_academy"
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-600 flex items-center justify-center transition-all hover:scale-105"
              title="Instagram (@agamakizh_ias_academy)"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://whatsapp.com/channel/0029VaAgamakizh"
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-all hover:scale-105"
              title="WhatsApp Channel"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </a>
            <a
              href="https://t.me/AgamakizhIAS"
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-600 flex items-center justify-center transition-all hover:scale-105"
              title="Telegram (@AgamakizhIAS)"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.197 1.006.128.832.942z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="p-6 pt-3 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 text-slate-500 hover:text-red-600 transition-colors text-sm font-medium w-full cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="lg:hidden flex items-center gap-2">
              <button 
                onClick={() => setShowMobileMenu(true)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-100 shrink-0 shadow-sm">
                <img src={logoImage} alt="Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            {(selectedExam || selectedSubject || selectedChapter !== null || currentView !== 'dashboard') && (
              <button
                onClick={handleBackClick}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={language === 'english' ? "Type to search..." : "தேடுங்கள்..."}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* English / Tamil Medium Switcher */}
            <div className="flex items-center p-1 bg-slate-100 border border-slate-200/90 rounded-2xl shadow-2xs">
              <button
                type="button"
                onClick={() => toggleLanguage('english')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${language === 'english'
                  ? 'bg-blue-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                title="Switch to English Medium"
              >
                <span>🇬🇧</span>
                <span className="hidden sm:inline">English</span>
              </button>
              <button
                type="button"
                onClick={() => toggleLanguage('tamil')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${language === 'tamil'
                  ? 'bg-blue-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                title="தமிழ் வழிக்கு மாற்றுக"
              >
                <span>🇮🇳</span>
                <span className="hidden sm:inline">தமிழ்</span>
              </button>
            </div>

            <div className="relative flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 leading-none">{userProfile.name}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-1 uppercase tracking-wider">
                  {language === 'english' ? 'Aspirant' : 'தேர்வர்'}
                </p>
              </div>
              <button
                type="button"
                id="profile-menu-btn"
                onClick={() => setShowProfileMenu(prev => !prev)}
                onBlur={() => setTimeout(() => setShowProfileMenu(false), 150)}
                className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs overflow-hidden border border-slate-100 hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer focus:outline-none"
              >
                {userProfile.avatar ? (
                  <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  userProfile.name.split(' ').map(n => n[0]).join('')
                )}
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-11 z-50 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 overflow-hidden"
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{userProfile.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                        {language === 'english' ? 'Aspirant' : 'தேர்வர்'}
                      </p>
                    </div>

                    {/* Profits / Marks */}
                    <button
                      type="button"
                      onClick={() => { setShowProfileMenu(false); setCurrentView('marks'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      {language === 'english' ? 'My Profits' : 'என் மதிப்பெண்கள்'}
                    </button>

                    {/* Settings */}
                    <button
                      type="button"
                      onClick={() => { setShowProfileMenu(false); setCurrentView('settings'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      <Settings className="h-4 w-4 text-blue-500" />
                      {language === 'english' ? 'Settings' : 'அமைப்புகள்'}
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={() => { setShowProfileMenu(false); onLogout(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      {language === 'english' ? 'Logout' : 'வெளியேறு'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {currentView === 'dashboard' ? (
              !selectedExam ? (
                <>
                  {/* Branding Box */}
                  <div className="flex justify-center mb-12">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -5 }}
                      className="w-full max-w-sm h-64 bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(15,23,42,0.1)] border border-white flex flex-col items-center relative overflow-hidden group transition-all duration-500"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 via-white/40 to-white/40" />
                      <div className="mt-10 w-32 h-32 rounded-full bg-white shadow-2xl shadow-slate-200/50 p-1.5 z-10 transform group-hover:scale-110 transition-transform duration-700 ease-out ring-8 ring-blue-50/50">
                        <img src={logoImage} alt="Logo" className="w-full h-full object-cover rounded-full" />
                      </div>
                      <div className="mt-auto mb-10 z-10 text-center">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Agamakizh</h2>
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <span className="h-px w-3 bg-blue-600/20" />
                          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-[0.3em]">IAS Academy</span>
                          <span className="h-px w-3 bg-blue-600/20" />
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Welcome Section */}
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                      {language === 'english' ? 'Exam Portal Dashboard' : 'தேர்வு போர்டல் டாஷ்போர்டு'}
                    </h2>
                    <p className="text-slate-500 text-sm">
                      {language === 'english'
                        ? "Welcome back! Here's your personalized exam preparation overview."
                        : "மீண்டும் வருக! இது உங்கள் தனிப்பயனாக்கப்பட்ட தேர்வு தயாரிப்பு மேலோட்டம்."}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  {(() => {
                    const totalAttempts = dynamicResults.length;
                    const bestScore = totalAttempts > 0
                      ? Math.max(...dynamicResults.map((r: any) => r.percentage ?? Math.round(((r.score ?? r.marksScored ?? 0) / ((r.total ?? r.totalMarks) || 1)) * 100)))
                      : 0;
                    const subjectsCovered = [...new Set(dynamicResults.map((r: any) => r.subject).filter(Boolean))].length;
                    const mockTestsTaken = dynamicQuizzes.length;
                    return (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                        <StatCard label="Enrollments" value="3" icon={<BookOpen className="h-6 w-6 text-blue-500" />} />
                        <StatCard label="Hours" value="142.5" icon={<Clock className="h-6 w-6 text-indigo-500" />} />
                        <StatCard label="Quiz Attempts" value={String(totalAttempts)} icon={<img src={quizIcon} alt="Quiz" className="w-6 h-6 object-cover mix-blend-multiply opacity-70" />} />
                        <StatCard label="Rank" value="#1,402" icon={<Trophy className="h-6 w-6 text-orange-500" />} />
                        <StatCard label="Subjects" value={String(subjectsCovered || 0)} icon={<Target className="h-6 w-6 text-teal-500" />} />
                        <StatCard label="Tests" value={`${mockTestsTaken} Done`} icon={<img src={testIcon} alt="Test" className="w-8 h-8 object-cover rounded-full drop-shadow-sm" />} />
                      </div>
                    );
                  })()}

                  {/* Exam Categories */}
                  <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Available Exam Categories</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Select a category or specific exam to begin your preparation & syllabus roadmap.</p>
                      </div>
                      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto scrollbar-none max-w-full">
                        {[
                          { id: 'all', label: 'All Exams' },
                          { id: 'TNPSC Group I', label: 'TNPSC Group I' },
                          { id: 'TNPSC Group II / IIA', label: 'Group II / IIA' },
                          { id: 'TNPSC Group IV', label: 'Group IV' },
                          { id: 'TNPSC CTS', label: 'TNPSC CTS' },
                          { id: 'SSC', label: 'SSC' },
                          { id: 'Railway', label: 'Railway' },
                          { id: 'TRT', label: 'TRT' },
                          { id: 'TET', label: 'TET' },
                        ].map(pill => (
                          <button
                            key={pill.id}
                            type="button"
                            onClick={() => setActiveTab(pill.id)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${activeTab === pill.id
                                ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                              }`}
                          >
                            {pill.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      {exams
                        .filter(exam => activeTab === 'all' || exam.category === activeTab || exam.id === activeTab)
                        .map((exam) => (
                          <motion.div
                            key={exam.id}
                            whileHover={{ y: -4 }}
                            onClick={() => setSelectedExam(exam)}
                            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer hover:border-blue-300"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-2xs ${(exam.id.includes('tnpsc') || exam.id === 'trt' || exam.id === 'tet' || exam.id === 'ssc' || exam.id === 'railway') ? 'bg-white border border-slate-100 p-0.5' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                                {(exam.id.includes('tnpsc') || exam.id === 'trt' || exam.id === 'tet') ? (
                                  <img src={tnpscLogo} alt="TNPSC" className="w-full h-full object-contain drop-shadow-sm" />
                                ) : exam.id === 'ssc' ? (
                                  <img src={sscLogo} alt="SSC" className="w-full h-full object-contain drop-shadow-sm rounded" />
                                ) : exam.id === 'railway' ? (
                                  <img src={railwayLogo} alt="Railway" className="w-full h-full object-contain drop-shadow-sm" />
                                ) : (
                                  <Award className="h-5 w-5" />
                                )}
                              </div>
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                {exam.badge || exam.category}
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm mb-1 leading-tight group-hover:text-blue-600 transition-colors">{exam.name}</h4>
                            <p className="text-[11px] text-slate-500 font-medium mb-3">{exam.category}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                              <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Aspirants</span>
                                <span className="text-xs font-bold text-slate-700 tabular-nums">{exam.students}</span>
                              </div>
                              <div className="flex flex-col text-right">
                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Difficulty</span>
                                <span className={`text-xs font-bold ${exam.difficulty === 'High' ? 'text-red-600' : 'text-amber-600'}`}>{exam.difficulty}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                </>
              ) : selectedSubject ? (
                <SubjectChapterView
                  subject={selectedSubject}
                  examName={selectedExam.name}
                  language={language}
                  onLanguageChange={toggleLanguage}
                  initialChapter={selectedChapter}
                  onBack={() => {
                    if (selectedChapter !== null) {
                      setSelectedChapter(null);
                    } else {
                      setSelectedSubject(null);
                    }
                  }}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-10"
                >
                  {/* Exam Specific Header */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {selectedExam.category}
                        </span>
                      </div>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{selectedExam.name}</h2>
                      <p className="text-slate-500 text-sm mt-1">Access study materials, previous papers, and syllabus.</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          const activeSyllabus = (selectedExam ? syllabi[selectedExam.id] : null) || initialSyllabi['tnpsc-g1'];
                          openPdfPreview(activeSyllabus.pdfUrl, activeSyllabus._pdfUrl_indexedDbKey, activeSyllabus.fileName || `${selectedExam.name} Syllabus`);
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
                      >
                        <FileText className="h-4 w-4" />
                        View Syllabus
                      </button>
                      <button
                        onClick={() => {
                          const activeSyllabus = (selectedExam ? syllabi[selectedExam.id] : null) || initialSyllabi['tnpsc-g1'];
                          downloadPdfFile(activeSyllabus.pdfUrl, activeSyllabus._pdfUrl_indexedDbKey, activeSyllabus.fileName || `${selectedExam.name}_Official_Syllabus.pdf`);
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        <FileDown className="h-4 w-4" />
                        Download Syllabus
                      </button>
                    </div>
                  </div>

                  {/* Subjects Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        {language === 'tamil' ? 'பாடப்பிரிவுகள் (Study Subjects)' : 'Study Subjects'}
                      </h3>
                      <span className="text-xs text-slate-400 font-medium">
                        {language === 'tamil' ? 'அத்தியாயம் 1-ஐத் திறக்க பாடத்தைக் கிளிக் செய்யவும்' : 'Click any subject to open Chapter 1'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {subjects.filter((subject) => {
                        const cat = (selectedExam?.category || '').toLowerCase();
                        if ((cat === 'ssc' || cat === 'railway') && subject.id === 'tamil') return false;
                        return true;
                      }).map((subject) => (
                        <motion.div
                          key={subject.id}
                          whileHover={{ y: -4 }}
                          onClick={() => {
                            setSelectedSubject(subject);
                            setSelectedChapter(1);
                          }}
                          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-center group cursor-pointer hover:border-blue-400 flex flex-col justify-between"
                        >
                          <div>
                            <div className={`w-12 h-12 ${subject.bg} ${subject.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                              {subject.icon}
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors leading-tight">
                              {language === 'tamil' ? ((subject as any).nameTa || subject.name) : subject.name}
                            </h4>
                            {language === 'tamil' && (subject as any).nameTa && (
                              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{subject.name}</p>
                            )}
                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">
                              {language === 'tamil' ? '12 அத்தியாயங்கள்' : '12 Chapters'}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] font-bold text-blue-600 group-hover:underline">
                            <span>{language === 'tamil' ? 'அத்தியாயம் 1' : 'Chapter 1'}</span>
                            <ChevronRight className="h-3 w-3" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Resources Section */}
                  {(() => {
                    const examCat = (selectedExam.category || '').toLowerCase();
                    const examName = (selectedExam.name || '').toLowerCase();
                    const filteredStudyMaterials = dynamicStudy.filter(m => {
                      const matCat = (m.category || '').toLowerCase();
                      const matTitle = (m.title || '').toLowerCase();
                      return (
                        matCat === examCat ||
                        (examName.includes('tnpsc') && (matCat === 'tnpsc' || matCat === 'civil services')) ||
                        (examName.includes('ssc') && matCat === 'ssc') ||
                        (examName.includes('railway') && matCat === 'railway') ||
                        matCat === 'general studies' ||
                        matTitle.includes(examName)
                      );
                    });

                    const activeSyllabus = (selectedExam ? syllabi[selectedExam.id] : null) || initialSyllabi['tnpsc-g1'];

                    return (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Study Materials Card */}
                          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <FileDown className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-slate-900">Study Materials</h3>
                                    <p className="text-[11px] text-slate-400">Curated materials & revision PDFs</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {studySyncFeedback && (
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 animate-fadeIn">
                                      {studySyncFeedback}
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={handleSyncStudyAndSyllabus}
                                    disabled={isStudySyncing}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                    title="Sync with latest updates from Admin Console"
                                  >
                                    <RefreshCw className={`h-3.5 w-3.5 ${isStudySyncing ? 'animate-spin text-indigo-600' : ''}`} />
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-3">
                                {filteredStudyMaterials.length > 0 ? (
                                  filteredStudyMaterials.map((material) => (
                                    <div
                                      key={material.id}
                                      className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl transition-all border border-slate-200/60 group"
                                    >
                                      <div className="flex items-center gap-3 min-w-0 pr-2">
                                        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-slate-200 text-red-500 shrink-0 shadow-2xs">
                                          <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0">
                                          <span className="text-xs font-bold text-slate-800 block truncate group-hover:text-blue-600 transition-colors">
                                            {material.title}
                                          </span>
                                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                                            <span className="font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded uppercase">
                                              {material.category}
                                            </span>
                                            <span>•</span>
                                            <span>{material.fileSize || 'PDF Notes'}</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => openPdfPreview(material.pdfUrl, material._pdfUrl_indexedDbKey, material.title || material.fileName)}
                                          className="p-2 hover:bg-white text-slate-500 hover:text-blue-600 rounded-lg transition-colors border border-transparent hover:border-slate-200 cursor-pointer shadow-2xs"
                                          title="Preview PDF"
                                        >
                                          <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => downloadPdfFile(material.pdfUrl, material._pdfUrl_indexedDbKey, material.fileName || `${material.title}.pdf`)}
                                          className="p-2 hover:bg-white text-slate-500 hover:text-emerald-600 rounded-lg transition-colors border border-transparent hover:border-slate-200 cursor-pointer shadow-2xs"
                                          title="Download PDF"
                                        >
                                          <Download className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  [2023, 2022, 2021, 2020].map((year) => (
                                    <div
                                      key={year}
                                      onClick={() => openPdfPreview('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', undefined, `${selectedExam.name} - ${year} Paper`)}
                                      className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
                                    >
                                      <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200 text-red-500 shrink-0">
                                          <FileText className="h-4 w-4" />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-700 truncate">{selectedExam.name} - {year} Paper</span>
                                      </div>
                                      <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition-colors shrink-0" />
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Official Syllabus Card */}
                          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <Library className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-slate-900">Official Syllabus</h3>
                                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                                      {activeSyllabus.examName} Notification
                                    </span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => openPdfPreview(activeSyllabus.pdfUrl, activeSyllabus._pdfUrl_indexedDbKey, activeSyllabus.fileName)}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                  title="Preview Syllabus PDF"
                                >
                                  <Eye className="h-3.5 w-3.5 text-emerald-600" />
                                  <span>Preview</span>
                                </button>
                              </div>

                              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                                {activeSyllabus.description}
                              </p>

                              <ul className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                                {activeSyllabus.topics.map((item, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                                    <ChevronRight className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                    <span className="truncate">{item}</span>
                                  </li>
                                ))}
                              </ul>

                              {activeSyllabus.fileName && (
                                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                                  <div className="flex items-center gap-2 truncate">
                                    <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                                    <span className="truncate font-semibold">{activeSyllabus.fileName}</span>
                                  </div>
                                  <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-bold shrink-0">
                                    {activeSyllabus.fileSize || 'PDF'}
                                  </span>
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                downloadPdfFile(activeSyllabus.pdfUrl, activeSyllabus._pdfUrl_indexedDbKey, activeSyllabus.fileName || `${selectedExam.name}_Official_Syllabus.pdf`);
                              }}
                              className="w-full mt-4 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-slate-900/10"
                            >
                              <FileDown className="h-4 w-4 text-emerald-400" />
                              Download Full Syllabus (PDF)
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )
            ) : selectedResult ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedResult(null)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-bold"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {language === 'english' ? 'Back to Marks' : 'மதிப்பெண்களுக்குத் திரும்பு'}
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={() => downloadSingleResultPdf(selectedResult, { name: userProfile.name, rollNo: 'AGM-2024-042' })}
                      className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
                    >
                      <FileDown className="h-3.5 w-3.5" />
                      {language === 'english' ? 'Download Result (PDF)' : 'முடிவைப் பதிவிறக்குக (PDF)'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden">
                      <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedResult.exam}</h2>
                        <p className="text-slate-500 text-sm">{language === 'english' ? 'Performance Summary' : 'செயல்திறன் சுருக்கம்'}</p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'english' ? 'Total Marks' : 'மொத்த மதிப்பெண்கள்'}</p>
                            <p className="text-2xl font-bold text-slate-900 tabular-nums">{selectedResult.score}/{selectedResult.total}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{language === 'english' ? 'Correct' : 'சரி'}</p>
                            <p className="text-2xl font-bold text-emerald-600 tabular-nums">{selectedResult.correct}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{language === 'english' ? 'Wrong' : 'தவறு'}</p>
                            <p className="text-2xl font-bold text-rose-600 tabular-nums">{selectedResult.wrong}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{language === 'english' ? 'Accuracy' : 'துல்லியம்'}</p>
                            <p className="text-2xl font-bold text-blue-600 tabular-nums">{selectedResult.percentage}%</p>
                          </div>
                        </div>
                      </div>
                      <Trophy className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-slate-50 opacity-[0.03] -rotate-12" />
                    </div>

                    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900">{language === 'english' ? 'Question Analysis' : 'வினா ஆய்வு'}</h3>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase">{language === 'english' ? 'Correct' : 'சரி'}</span>
                          <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold uppercase">{language === 'english' ? 'Wrong' : 'தவறு'}</span>
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                          {Array.from({ length: 50 }).map((_, i) => {
                            const isCorrect = i < 38; // Mock
                            const isSelected = selectedAnalysisQuestion === i + 1;
                            return (
                              <div
                                key={i}
                                onClick={() => setSelectedAnalysisQuestion(i + 1)}
                                className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all cursor-pointer hover:scale-110 shadow-sm ${isSelected
                                  ? 'ring-2 ring-blue-500 ring-offset-2'
                                  : ''
                                  } ${isCorrect ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                                  }`}
                              >
                                {i + 1}
                              </div>
                            );
                          })}
                        </div>

                        <AnimatePresence mode="wait">
                          {selectedAnalysisQuestion !== null && (
                            <motion.div
                              key={selectedAnalysisQuestion}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-10 pt-10 border-t border-slate-100"
                            >
                              <div className="flex items-center justify-between mb-6">
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">Question {selectedAnalysisQuestion}</span>
                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${selectedAnalysisQuestion <= 38 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                  }`}>
                                  {selectedAnalysisQuestion <= 38 ? (language === 'english' ? 'Correct' : 'சரி') : (language === 'english' ? 'Incorrect' : 'தவறு')}
                                </span>
                              </div>
                              <h4 className="text-lg font-bold text-slate-900 mb-8 leading-relaxed">
                                {language === 'english'
                                  ? 'What is the minimum age requirement to become a member of the Rajya Sabha in India?'
                                  : 'இந்தியாவில் ராஜ்யசபா உறுப்பினராவதற்கான குறைந்தபட்ச வயது வரம்பு என்ன?'}
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                  { label: '25 Years', labelTa: '25 ஆண்டுகள்' },
                                  { label: '30 Years', labelTa: '30 ஆண்டுகள்' },
                                  { label: '35 Years', labelTa: '35 ஆண்டுகள்' },
                                  { label: '21 Years', labelTa: '21 ஆண்டுகள்' }
                                ].map((opt, idx) => {
                                  const isUserChoice = selectedAnalysisQuestion > 38 && idx === 0;
                                  const isCorrectChoice = idx === 1;
                                  return (
                                    <div
                                      key={idx}
                                      className={`p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${isCorrectChoice
                                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700'
                                        : isUserChoice
                                          ? 'border-rose-500 bg-rose-50/50 text-rose-700'
                                          : 'border-slate-100 text-slate-600 bg-slate-50/30'
                                        }`}
                                    >
                                      <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${isCorrectChoice ? 'bg-emerald-600 text-white' : isUserChoice ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-500'
                                          }`}>
                                          {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className="text-sm font-semibold">{language === 'english' ? opt.label : opt.labelTa}</span>
                                      </div>
                                      {isCorrectChoice && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                  <HelpCircle className="h-4 w-4 text-blue-600" />
                                  <h5 className="text-xs font-bold text-blue-900 uppercase tracking-widest">{language === 'english' ? 'Explanation' : 'விளக்கம்'}</h5>
                                </div>
                                <p className="text-sm text-blue-800 leading-relaxed">
                                  {language === 'english'
                                    ? 'According to Article 84 of the Constitution, a person must be at least 30 years of age to be a member of Rajya Sabha, while for Lok Sabha it is 25 years.'
                                    : 'அரசியலமைப்பின் 84 வது பிரிவின்படி, ராஜ்யசபா உறுப்பினராக ஒருவருக்கு குறைந்தபட்சம் 30 வயது இருக்க வேண்டும், அதே நேரத்தில் மக்களவைக்கு 25 வயது.'}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-slate-900 rounded-[32px] p-8 text-white">
                      <h3 className="text-lg font-bold mb-6">{language === 'english' ? 'Next Steps' : 'அடுத்த கட்டங்கள்'}</h3>
                      <div className="space-y-6">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                            <BookOpen className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold">{language === 'english' ? 'Revise weak topics' : 'பலவீனமான தலைப்புகளைத் திருத்தவும்'}</h4>
                            <p className="text-xs text-slate-400 mt-1">{language === 'english' ? 'Focus on your missed questions.' : 'உங்கள் தவறவிட்ட கேள்விகளில் கவனம் செலுத்துங்கள்.'}</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                            <Target className="h-5 w-5 text-emerald-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold">{language === 'english' ? 'Practice' : 'பயிற்சி'}</h4>
                            <p className="text-xs text-slate-400 mt-1">{language === 'english' ? 'Build speed in your strong areas.' : 'உங்கள் வலுவான பகுதிகளில் வேகத்தை அதிகரிக்கவும்.'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : currentView === 'marks' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Marks Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Test Performance & Marks</h2>
                    <p className="text-slate-500 text-sm mt-1">Track your scores across TNPSC, SSC, and Railway mock tests.</p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => downloadStudentMarksPdf(dynamicResults, { name: userProfile.name, rollNo: 'AGM-2024-042', mobile: userProfile.mobile })}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Download className="h-4 w-4" />
                      {language === 'english' ? 'Download Report (PDF)' : 'அறிக்கையைப் பதிவிறக்குக (PDF)'}
                    </button>
                  </div>
                </div>

                {/* Performance Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><TrendingUp className="h-5 w-5" /></div>
                      <span className="text-sm font-semibold text-slate-700">Average Score</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 tabular-nums">
                      {dynamicResults.length > 0
                        ? `${Math.round(dynamicResults.reduce((acc: number, r: any) => acc + (r.percentage || Math.round(((r.score ?? r.marksScored ?? 0) / ((r.total ?? r.totalMarks) || 1)) * 100)), 0) / dynamicResults.length)}%`
                        : '0%'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                      {dynamicResults.length > 0 ? `${dynamicResults.length} tests attempted` : 'No attempts recorded'}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Target className="h-5 w-5" /></div>
                      <span className="text-sm font-semibold text-slate-700">Highest Score</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 tabular-nums">
                      {dynamicResults.length > 0
                        ? `${Math.max(...dynamicResults.map((r: any) => r.percentage || Math.round(((r.score ?? r.marksScored ?? 0) / ((r.total ?? r.totalMarks) || 1)) * 100)))}%`
                        : '0%'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider truncate">
                      {dynamicResults.length > 0
                        ? (dynamicResults.find((r: any) => (r.percentage || Math.round(((r.score ?? r.marksScored ?? 0) / ((r.total ?? r.totalMarks) || 1)) * 100)) === Math.max(...dynamicResults.map((x: any) => x.percentage || Math.round(((x.score ?? x.marksScored ?? 0) / ((x.total ?? x.totalMarks) || 1)) * 100))))?.exam || 'Best Mock')
                        : 'None'}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><HistoryIcon className="h-5 w-5" /></div>
                      <span className="text-sm font-semibold text-slate-700">Recent Attempt</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 tabular-nums">
                      {dynamicResults.length > 0
                        ? new Date(dynamicResults[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : 'None'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider truncate">
                      {dynamicResults.length > 0
                        ? (dynamicResults[0].exam || dynamicResults[0].examName || 'Mock Test')
                        : 'No attempts'}
                    </p>
                  </div>
                </div>

                {/* Results Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-slate-900 text-sm">Recent Test Results</h3>
                      <span className="text-xs font-semibold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {dynamicResults.length} {dynamicResults.length === 1 ? 'record' : 'records'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {dynamicResults.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearAllResults}
                          className="px-2.5 py-1 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                          title="Delete All Results"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete All</span>
                        </button>
                      )}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter by:</span>
                        <select className="bg-transparent border-none text-[10px] font-bold text-blue-600 focus:ring-0 cursor-pointer uppercase tracking-widest">
                          <option>All Exams</option>
                          <option>TNPSC</option>
                          <option>SSC</option>
                          <option>Railway</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Test Name</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {dynamicResults.map((result: any) => (
                          <tr key={result.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-slate-900">{result.exam || result.examName}</span>
                              {result.studentName && (
                                <span className="block text-[10px] text-slate-400 font-medium">Aspirant: {result.studentName} ({result.rollNo})</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs text-slate-500 font-medium">{new Date(result.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900 tabular-nums">
                                  {result.score ?? result.marksScored}/{result.total ?? result.totalMarks}
                                </span>
                                <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${result.percentage || Math.round(((result.score ?? result.marksScored) / ((result.total ?? result.totalMarks) || 1)) * 100)}%` }} />
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${result.status === 'Excellent' || result.status === 'Outstanding' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                                }`}>
                                {result.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => setSelectedResult(result)}
                                  className="text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest cursor-pointer"
                                >
                                  {language === 'english' ? 'Review' : 'மதிப்பாய்வு'}
                                  <ChevronRight className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => downloadSingleResultPdf(result, { name: result.studentName || userProfile.name, rollNo: result.rollNo || 'AGM-2024-042' })}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                  title="Download Marksheet (PDF)"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteResult(result.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Result Record"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}

                        {dynamicResults.length === 0 && (
                          <tr>
                            <td colSpan={5} className="text-center py-16 text-slate-400">
                              <Award className="h-10 w-10 mx-auto mb-2 opacity-20" />
                              <p className="text-xs font-bold uppercase tracking-wider">No test results found</p>
                              <p className="text-[11px] text-slate-400 mt-1">Take a practice mock test from the Quizzes tab to see your scores here.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            ) : currentView === 'calendar' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* 2026 Academic Calendar Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-blue-200">
                        <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                        2026 Academic Roadmap & Master Planner
                      </span>
                      <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold border border-amber-200">
                        Year 2026
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {language === 'english' ? '2026 Academic Calendar & Study Plan' : '2026 விரிவான காலண்டர் & படிப்புத் திட்டம்'}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 max-w-2xl">
                      {language === 'english'
                        ? 'Subject Syllabus Targets • Multi-Phase Revision Cycles • Evaluation Mock Tests • Official Exam Notifications'
                        : 'பாடத்திட்ட இலக்குகள், மீள்பார்வை சுழற்சிகள், மாதிரித் தேர்வுகள் மற்றும் அரசு தேர்வு அறிவிப்புகள்'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => setCalendarViewMode('list')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${calendarViewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                          }`}
                      >
                        <ListFilter className="h-3.5 w-3.5" />
                        {language === 'english' ? 'Timeline List' : 'காலவரிசை பட்டியல்'}
                      </button>
                      <button
                        onClick={() => setCalendarViewMode('grid')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${calendarViewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                          }`}
                      >
                        <CalendarDays className="h-3.5 w-3.5" />
                        {language === 'english' ? 'Monthly Grid' : 'மாதாந்திர கட்டம்'}
                      </button>
                    </div>

                    {/* Download 2026 Plan PDF */}
                    <button
                      onClick={() => {
                        const filtered = calendarPlans.filter(item => {
                          if (calendarSelectedMonth !== null && new Date(item.date).getMonth() !== calendarSelectedMonth) return false;
                          if (calendarPlanType !== 'all' && item.type !== calendarPlanType) return false;
                          if (calendarExamFilter !== 'all' && !(item.category + ' ' + (item.subject || '')).toLowerCase().includes(calendarExamFilter.toLowerCase())) return false;
                          return true;
                        });
                        const label = calendarPlanType === 'all'
                          ? (calendarSelectedMonth !== null ? `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][calendarSelectedMonth]} 2026 Plan` : 'Full 2026 Master Plan')
                          : `${calendarPlanType.toUpperCase()} Plan 2026`;
                        download2026CalendarPlanPdf(filtered.length > 0 ? filtered : calendarPlans, label);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {language === 'english' ? 'Download 2026 Plan (PDF)' : '2026 திட்டத்தை பதிவிறக்கு (PDF)'}
                    </button>
                  </div>
                </div>

                {/* 2026 Progress Banner & KPI Cards */}
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                  <div className="relative z-10 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                      <div>
                        <div className="flex items-center gap-2">
                          <Flame className="h-5 w-5 text-amber-400" />
                          <span className="text-xs font-extrabold tracking-widest uppercase text-amber-300">
                            {language === 'english' ? 'Your 2026 Goal Progress' : 'உங்கள் 2026 படிப்பு இலக்கு'}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mt-1">
                          {calendarPlans.filter(p => completedPlanIds.includes(String(p.id))).length} of {calendarPlans.length} Milestones Achieved
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-2xl font-black text-emerald-400">
                            {Math.round((calendarPlans.filter(p => completedPlanIds.includes(String(p.id))).length / (calendarPlans.length || 1)) * 100)}%
                          </span>
                          <span className="block text-[10px] text-slate-300 uppercase tracking-widest">Completed</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 via-emerald-400 to-emerald-300 transition-all duration-500 rounded-full"
                        style={{ width: `${Math.round((calendarPlans.filter(p => completedPlanIds.includes(String(p.id))).length / (calendarPlans.length || 1)) * 100)}%` }}
                      />
                    </div>

                    {/* KPI Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                      <div
                        onClick={() => setCalendarPlanType('subject')}
                        className={`p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer ${calendarPlanType === 'subject' ? 'ring-2 ring-emerald-400 bg-white/15' : ''
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-slate-300">Subject Plan</span>
                          <BookOpen className="h-4 w-4 text-emerald-400" />
                        </div>
                        <p className="text-xl font-black mt-1 text-white">
                          {calendarPlans.filter(p => p.type === 'subject').length}
                        </p>
                        <span className="text-[10px] text-emerald-300 font-medium">Syllabus Units</span>
                      </div>

                      <div
                        onClick={() => setCalendarPlanType('revision')}
                        className={`p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer ${calendarPlanType === 'revision' ? 'ring-2 ring-amber-400 bg-white/15' : ''
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-slate-300">Revision Plan</span>
                          <RotateCcw className="h-4 w-4 text-amber-400" />
                        </div>
                        <p className="text-xl font-black mt-1 text-white">
                          {calendarPlans.filter(p => p.type === 'revision').length}
                        </p>
                        <span className="text-[10px] text-amber-300 font-medium">Structured Cycles</span>
                      </div>

                      <div
                        onClick={() => setCalendarPlanType('test')}
                        className={`p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer ${calendarPlanType === 'test' ? 'ring-2 ring-blue-400 bg-white/15' : ''
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-slate-300">Test Plan</span>
                          <ClipboardCheck className="h-4 w-4 text-blue-400" />
                        </div>
                        <p className="text-xl font-black mt-1 text-white">
                          {calendarPlans.filter(p => p.type === 'test').length}
                        </p>
                        <span className="text-[10px] text-blue-300 font-medium">Mock Tests</span>
                      </div>

                      <div
                        onClick={() => setCalendarPlanType('notification')}
                        className={`p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer ${calendarPlanType === 'notification' ? 'ring-2 ring-purple-400 bg-white/15' : ''
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-slate-300">Exam Notices</span>
                          <Bell className="h-4 w-4 text-purple-400" />
                        </div>
                        <p className="text-xl font-black mt-1 text-white">
                          {calendarPlans.filter(p => p.type === 'notification').length}
                        </p>
                        <span className="text-[10px] text-purple-300 font-medium">Official 2026 Dates</span>
                      </div>
                    </div>
                  </div>
                  <CalendarIcon className="absolute right-[-30px] bottom-[-30px] w-72 h-72 text-white/5 rotate-12 pointer-events-none" />
                </div>

                {/* 2026 Month Switcher & Quick Navigation Bar */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Month Carousel Controller */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
                        <button
                          onClick={() => {
                            if (calendarSelectedMonth === null) {
                              setCalendarSelectedMonth(11);
                            } else {
                              setCalendarSelectedMonth(prev => (prev === 0 ? 11 : (prev! - 1)));
                            }
                            setSelectedCalendarDay(null);
                          }}
                          className="p-2 hover:bg-white rounded-lg transition-colors cursor-pointer text-slate-600"
                          title="Previous Month"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>

                        <div className="px-4 py-1 text-center min-w-[150px]">
                          <span className="text-sm font-black text-slate-900 block">
                            {calendarSelectedMonth === null
                              ? 'Full Year 2026'
                              : `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][calendarSelectedMonth]} 2026`}
                          </span>
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">
                            {calendarSelectedMonth === null
                              ? (language === 'english' ? 'All 12 Months' : 'அனைத்து மாதங்கள்')
                              : (language === 'english' ? 'Academic Month' : ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'][calendarSelectedMonth])}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            if (calendarSelectedMonth === null) {
                              setCalendarSelectedMonth(0);
                            } else {
                              setCalendarSelectedMonth(prev => (prev === 11 ? 0 : (prev! + 1)));
                            }
                            setSelectedCalendarDay(null);
                          }}
                          className="p-2 hover:bg-white rounded-lg transition-colors cursor-pointer text-slate-600"
                          title="Next Month"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>

                      {calendarSelectedMonth !== null && (
                        <button
                          onClick={() => {
                            setCalendarSelectedMonth(null);
                            setSelectedCalendarDay(null);
                          }}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          {language === 'english' ? 'View All 2026' : 'அனைத்தையும் காண்க'}
                        </button>
                      )}
                    </div>

                    {/* Filter by Target Exam & Search */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
                        <Filter className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-bold text-slate-400 uppercase text-[10px]">Exam:</span>
                        <select
                          value={calendarExamFilter}
                          onChange={(e) => setCalendarExamFilter(e.target.value)}
                          className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
                        >
                          <option value="all">All Exams</option>
                          <option value="Group I">TNPSC Group I</option>
                          <option value="Group II">TNPSC Group II / IIA</option>
                          <option value="Group IV">TNPSC Group IV</option>
                          <option value="CTS">TNPSC CTS</option>
                          <option value="SSC">SSC</option>
                          <option value="Railway">Railway</option>
                          <option value="TRT">TRT</option>
                          <option value="TET">TET</option>
                        </select>
                      </div>

                      <div className="relative">
                        <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder={language === 'english' ? 'Search 2026 plans...' : 'திட்டங்களை தேடுக...'}
                          value={calendarSearchQuery}
                          onChange={(e) => setCalendarSearchQuery(e.target.value)}
                          className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-44 sm:w-56"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 12 Months Quick Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
                    <button
                      onClick={() => {
                        setCalendarSelectedMonth(null);
                        setSelectedCalendarDay(null);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${calendarSelectedMonth === null
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      {language === 'english' ? 'All 2026' : 'அனைத்தும்'}
                    </button>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((mName, idx) => {
                      const count = calendarPlans.filter(p => new Date(p.date).getMonth() === idx).length;
                      return (
                        <button
                          key={mName}
                          onClick={() => {
                            setCalendarSelectedMonth(idx);
                            setSelectedCalendarDay(null);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${calendarSelectedMonth === idx
                            ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/30'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                          <span>{mName}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${calendarSelectedMonth === idx ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Plan Type Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setCalendarPlanType('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${calendarPlanType === 'all'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      {language === 'english' ? 'All Plans' : 'அனைத்து திட்டங்கள்'} ({calendarPlans.length})
                    </button>
                    <button
                      onClick={() => setCalendarPlanType('subject')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${calendarPlanType === 'subject'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      {language === 'english' ? 'Subject Plan' : 'பாடத்திட்டம்'} ({calendarPlans.filter(p => p.type === 'subject').length})
                    </button>
                    <button
                      onClick={() => setCalendarPlanType('revision')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${calendarPlanType === 'revision'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                        }`}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      {language === 'english' ? 'Revision Plan' : 'மீள்பார்வை திட்டம்'} ({calendarPlans.filter(p => p.type === 'revision').length})
                    </button>
                    <button
                      onClick={() => setCalendarPlanType('test')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${calendarPlanType === 'test'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-blue-700 bg-blue-50 hover:bg-blue-100'
                        }`}
                    >
                      <ClipboardCheck className="h-3.5 w-3.5" />
                      {language === 'english' ? 'Test Plan' : 'தேர்வு திட்டம்'} ({calendarPlans.filter(p => p.type === 'test').length})
                    </button>
                    <button
                      onClick={() => setCalendarPlanType('notification')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${calendarPlanType === 'notification'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
                        }`}
                    >
                      <Bell className="h-3.5 w-3.5" />
                      {language === 'english' ? 'Exam Notifications' : 'தேர்வு அறிவிப்புகள்'} ({calendarPlans.filter(p => p.type === 'notification').length})
                    </button>
                  </div>
                </div>

                {/* VIEW A: MONTHLY CALENDAR GRID VIEW */}
                {calendarViewMode === 'grid' && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-lg">
                          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][calendarSelectedMonth ?? 8]} 2026 Interactive Calendar
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Click any day to highlight scheduled subject tasks, revisions, and test series.</p>
                      </div>
                      {selectedCalendarDay !== null && (
                        <button
                          onClick={() => setSelectedCalendarDay(null)}
                          className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl cursor-pointer"
                        >
                          Clear Day Selection
                        </button>
                      )}
                    </div>

                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-2 text-center">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
                        <div key={dayName} className="text-[11px] font-bold uppercase tracking-wider text-slate-400 py-1">
                          {dayName}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Day Grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {(() => {
                        const m = calendarSelectedMonth ?? 8;
                        const daysCount = new Date(2026, m + 1, 0).getDate();
                        const startDay = new Date(2026, m, 1).getDay();
                        const cells = [];

                        // Empty leading cells
                        for (let i = 0; i < startDay; i++) {
                          cells.push(
                            <div key={`empty-${i}`} className="min-h-[85px] bg-slate-50/50 rounded-2xl border border-dashed border-slate-200/50" />
                          );
                        }

                        // Month days
                        for (let d = 1; d <= daysCount; d++) {
                          const dateStr = `2026-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                          const dayPlans = calendarPlans.filter(p => p.date === dateStr);
                          const isSelected = selectedCalendarDay === d;
                          const hasPlans = dayPlans.length > 0;

                          cells.push(
                            <div
                              key={`day-${d}`}
                              onClick={() => setSelectedCalendarDay(prev => (prev === d ? null : d))}
                              className={`min-h-[85px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${isSelected
                                ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-sm'
                                : hasPlans
                                  ? 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs'
                                  : 'border-slate-100 bg-slate-50/40 hover:bg-slate-50'
                                }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-extrabold ${isSelected ? 'text-blue-600' : 'text-slate-800'}`}>
                                  {d}
                                </span>
                                {hasPlans && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                    {dayPlans.length}
                                  </span>
                                )}
                              </div>

                              <div className="space-y-1 mt-1">
                                {dayPlans.slice(0, 2).map(p => (
                                  <div
                                    key={p.id}
                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate ${p.type === 'subject'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : p.type === 'revision'
                                        ? 'bg-amber-100 text-amber-800'
                                        : p.type === 'test'
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'bg-purple-100 text-purple-800'
                                      }`}
                                    title={p.title}
                                  >
                                    {p.type === 'subject' ? '📚 ' : p.type === 'revision' ? '🔄 ' : p.type === 'test' ? '📝 ' : '📢 '}
                                    {p.subject || p.category}
                                  </div>
                                ))}
                                {dayPlans.length > 2 && (
                                  <span className="text-[8px] font-bold text-slate-400 block text-right">
                                    +{dayPlans.length - 2} more
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        }
                        return cells;
                      })()}
                    </div>
                  </div>
                )}

                {/* VIEW B: TIMELINE / LIST VIEW */}
                <div className="space-y-4">
                  {/* Results Count Header */}
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
                    <span>
                      {language === 'english' ? '2026 Academic Milestones' : '2026 கல்வி மைல்கற்கள்'} ({
                        calendarPlans.filter(item => {
                          if (calendarSelectedMonth !== null && new Date(item.date).getMonth() !== calendarSelectedMonth) return false;
                          if (selectedCalendarDay !== null && calendarSelectedMonth !== null) {
                            const id = new Date(item.date);
                            if (id.getDate() !== selectedCalendarDay || id.getMonth() !== calendarSelectedMonth) return false;
                          }
                          if (calendarPlanType !== 'all' && item.type !== calendarPlanType) return false;
                          if (calendarExamFilter !== 'all' && !(item.category + ' ' + (item.subject || '')).toLowerCase().includes(calendarExamFilter.toLowerCase())) return false;
                          if (calendarSearchQuery.trim()) {
                            const q = calendarSearchQuery.toLowerCase();
                            const match = item.title.toLowerCase().includes(q) || (item.titleTa && item.titleTa.toLowerCase().includes(q)) || (item.subject && item.subject.toLowerCase().includes(q)) || item.category.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || (item.syllabusTopics && item.syllabusTopics.some(t => t.toLowerCase().includes(q)));
                            if (!match) return false;
                          }
                          return true;
                        }).length
                      })
                    </span>
                    {selectedCalendarDay !== null && (
                      <span className="text-blue-600 normal-case font-bold">
                        Filtered for Day {selectedCalendarDay} ({['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][calendarSelectedMonth ?? 8]} 2026)
                      </span>
                    )}
                  </div>

                  {/* Plan Cards Grid */}
                  <div className="grid grid-cols-1 gap-4">
                    {calendarPlans
                      .filter(item => {
                        if (calendarSelectedMonth !== null && new Date(item.date).getMonth() !== calendarSelectedMonth) return false;
                        if (selectedCalendarDay !== null && calendarSelectedMonth !== null) {
                          const id = new Date(item.date);
                          if (id.getDate() !== selectedCalendarDay || id.getMonth() !== calendarSelectedMonth) return false;
                        }
                        if (calendarPlanType !== 'all' && item.type !== calendarPlanType) return false;
                        if (calendarExamFilter !== 'all' && !(item.category + ' ' + (item.subject || '')).toLowerCase().includes(calendarExamFilter.toLowerCase())) return false;
                        if (calendarSearchQuery.trim()) {
                          const q = calendarSearchQuery.toLowerCase();
                          const match =
                            item.title.toLowerCase().includes(q) ||
                            (item.titleTa && item.titleTa.toLowerCase().includes(q)) ||
                            (item.subject && item.subject.toLowerCase().includes(q)) ||
                            item.category.toLowerCase().includes(q) ||
                            item.description.toLowerCase().includes(q) ||
                            (item.syllabusTopics && item.syllabusTopics.some(t => t.toLowerCase().includes(q)));
                          if (!match) return false;
                        }
                        return true;
                      })
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .map((item) => {
                        const isDone = completedPlanIds.includes(String(item.id));
                        const dateObj = new Date(item.date);
                        const dayNum = dateObj.getDate();
                        const monthName = dateObj.toLocaleString('en-US', { month: 'short' });

                        return (
                          <div
                            key={item.id}
                            className={`p-5 md:p-6 rounded-2xl border transition-all flex flex-col md:flex-row md:items-start justify-between gap-5 group ${isDone
                              ? 'bg-emerald-50/20 border-emerald-200/80 shadow-xs'
                              : 'bg-white border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md'
                              }`}
                          >
                            {/* Left: Date Badge & Type */}
                            <div className="flex items-start gap-4">
                              <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 border shadow-xs transition-transform group-hover:scale-105 ${item.type === 'subject'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : item.type === 'revision'
                                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                                  : item.type === 'test'
                                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                                    : 'bg-purple-50 border-purple-200 text-purple-700'
                                }`}>
                                <span className="text-xl leading-none">{dayNum}</span>
                                <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">{monthName}</span>
                                <span className="text-[8px] opacity-75">2026</span>
                              </div>

                              {/* Center Content */}
                              <div className="space-y-1.5 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {/* Type Badge */}
                                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md flex items-center gap-1 ${item.type === 'subject'
                                    ? 'bg-emerald-100/70 text-emerald-800'
                                    : item.type === 'revision'
                                      ? 'bg-amber-100/70 text-amber-800'
                                      : item.type === 'test'
                                        ? 'bg-blue-100/70 text-blue-800'
                                        : 'bg-purple-100/70 text-purple-800'
                                    }`}>
                                    {item.type === 'subject' && <BookOpen className="h-3 w-3" />}
                                    {item.type === 'revision' && <RotateCcw className="h-3 w-3" />}
                                    {item.type === 'test' && <ClipboardCheck className="h-3 w-3" />}
                                    {item.type === 'notification' && <Bell className="h-3 w-3" />}
                                    {item.type === 'subject' ? 'Subject Plan' : item.type === 'revision' ? 'Revision Plan' : item.type === 'test' ? 'Test Plan' : 'Exam Notification'}
                                  </span>

                                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                    {item.category}
                                  </span>

                                  {item.subject && (
                                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                      {item.subject}
                                    </span>
                                  )}

                                  {item.duration && (
                                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {item.duration}
                                    </span>
                                  )}

                                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isDone
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : item.status === 'Ongoing'
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {isDone ? 'Completed' : item.status}
                                  </span>
                                </div>

                                {/* Title */}
                                <h4 className={`text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors ${isDone ? 'line-through text-slate-500' : ''
                                  }`}>
                                  {language === 'tamil' && item.titleTa ? item.titleTa : item.title}
                                </h4>

                                {/* Description */}
                                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                                  {language === 'tamil' && item.descriptionTa ? item.descriptionTa : item.description}
                                </p>

                                {/* Syllabus Topics Tags */}
                                {item.syllabusTopics && item.syllabusTopics.length > 0 && (
                                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Topics:</span>
                                    {item.syllabusTopics.map((topic, tidx) => (
                                      <span key={tidx} className="text-[10px] font-medium bg-slate-50 text-slate-700 border border-slate-200/60 px-2 py-0.5 rounded-md">
                                        {topic}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center md:flex-col md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                              {/* Mark as Completed Toggle */}
                              <button
                                onClick={() => togglePlanCompletion(item.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${isDone
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200/80'
                                  }`}
                                title={isDone ? 'Mark as Incomplete' : 'Mark as Completed'}
                              >
                                {isDone ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
                                {isDone ? (language === 'english' ? 'Completed' : 'முடிந்தது') : (language === 'english' ? 'Mark Done' : 'முடிந்தது என குறி')}
                              </button>

                              {/* Contextual Action Button */}
                              <div className="flex items-center gap-2">
                                {item.type === 'test' && (
                                  <button
                                    onClick={() => {
                                      setCurrentView('quiz');
                                      setActiveMockTest(null);
                                    }}
                                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                                  >
                                    <Play className="h-3.5 w-3.5" />
                                    {language === 'english' ? 'Start Test' : 'தேர்வு தொடங்கு'}
                                  </button>
                                )}

                                {item.type === 'subject' && (
                                  <button
                                    onClick={() => setSelectedPlanModal(item)}
                                    className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                                  >
                                    <BookOpen className="h-3.5 w-3.5" />
                                    {language === 'english' ? 'Syllabus & Notes' : 'பாடக் குறிப்புகள்'}
                                  </button>
                                )}

                                {item.pdfUrl && (
                                  <button
                                    onClick={() => openPdfPreview(item.pdfUrl!, item.fileName || '2026_Notice.pdf')}
                                    className="px-3 py-1.5 bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                                  >
                                    <FileText className="h-3.5 w-3.5" />
                                    PDF
                                  </button>
                                )}

                                <button
                                  onClick={() => setSelectedPlanModal(item)}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                  title="View Full Details"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                    {/* Empty State */}
                    {calendarPlans.filter(item => {
                      if (calendarSelectedMonth !== null && new Date(item.date).getMonth() !== calendarSelectedMonth) return false;
                      if (selectedCalendarDay !== null && calendarSelectedMonth !== null) {
                        const id = new Date(item.date);
                        if (id.getDate() !== selectedCalendarDay || id.getMonth() !== calendarSelectedMonth) return false;
                      }
                      if (calendarPlanType !== 'all' && item.type !== calendarPlanType) return false;
                      if (calendarExamFilter !== 'all' && !(item.category + ' ' + (item.subject || '')).toLowerCase().includes(calendarExamFilter.toLowerCase())) return false;
                      if (calendarSearchQuery.trim()) {
                        const q = calendarSearchQuery.toLowerCase();
                        const match = item.title.toLowerCase().includes(q) || (item.titleTa && item.titleTa.toLowerCase().includes(q)) || (item.subject && item.subject.toLowerCase().includes(q)) || item.category.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || (item.syllabusTopics && item.syllabusTopics.some(t => t.toLowerCase().includes(q)));
                        if (!match) return false;
                      }
                      return true;
                    }).length === 0 && (
                        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                          <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto" />
                          <h4 className="text-base font-bold text-slate-800">No scheduled plans found for this filter</h4>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto">Try clearing your filters or select "All 2026" to explore the full academic year schedule.</p>
                          <button
                            onClick={() => {
                              setCalendarPlanType('all');
                              setCalendarSelectedMonth(null);
                              setSelectedCalendarDay(null);
                              setCalendarExamFilter('all');
                              setCalendarSearchQuery('');
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reset Filters & View All 2026
                          </button>
                        </div>
                      )}
                  </div>
                </div>

                {/* Official Learning Channels & Community Network */}
                <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-800 shadow-xl">
                  <div className="relative z-10 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider mb-2">
                          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                          <span>Official Agamakizh Academy Learning Network</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                          Connect with YouTube, Instagram, WhatsApp & Telegram
                        </h3>
                        <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
                          Subscribe to our official communities for daily live classes, high-yield PDF study materials, topper strategy sessions, and real-time 2026 exam notifications.
                        </p>
                      </div>

                      <button
                        onClick={() => download2026CalendarPlanPdf(calendarPlans, 'Full 2026 Academic Calendar')}
                        className="px-5 py-2.5 bg-white text-slate-900 rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-100 transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0 self-start sm:self-auto"
                      >
                        <Download className="h-4 w-4 text-blue-600" />
                        <span>Download 2026 Planner (PDF)</span>
                      </button>
                    </div>

                    {/* 4 Social Cards: YouTube, Instagram, WhatsApp, Telegram */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* YouTube */}
                      <a
                        href="https://www.youtube.com/@agamakizhiasacademy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/40 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between hover:-translate-y-0.5 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                            Video Classes
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base group-hover:text-red-300 transition-colors">YouTube</h4>
                          <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">Daily video lectures, subject analysis & exam syllabus strategy sessions.</p>
                        </div>
                        <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-red-400 group-hover:text-red-300">
                          <span>Subscribe Channel</span>
                          <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </a>

                      {/* Instagram */}
                      <a
                        href="https://www.instagram.com/agamakizh_ias_academy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/40 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between hover:-translate-y-0.5 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-600/30 group-hover:scale-105 transition-transform">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                            Daily Updates
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base group-hover:text-pink-300 transition-colors">Instagram</h4>
                          <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">Daily GK infographics, quick exam reels, topper interviews & milestones.</p>
                        </div>
                        <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-pink-400 group-hover:text-pink-300">
                          <span>Follow on Instagram</span>
                          <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </a>

                      {/* WhatsApp */}
                      <a
                        href="https://whatsapp.com/channel/0029VaAgamakizh"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between hover:-translate-y-0.5 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                            </svg>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Instant Alerts
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">WhatsApp</h4>
                          <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">Direct notifications, exam date updates, hall ticket alerts & study groups.</p>
                        </div>
                        <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                          <span>Join WhatsApp Channel</span>
                          <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </a>

                      {/* Telegram */}
                      <a
                        href="https://t.me/AgamakizhIAS"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-500/40 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between hover:-translate-y-0.5 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-transform">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.197 1.006.128.832.942z" />
                            </svg>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                            PDF Notes
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base group-hover:text-sky-300 transition-colors">Telegram</h4>
                          <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">Free downloadable syllabus PDFs, question banks & daily mock test polls.</p>
                        </div>
                        <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-sky-400 group-hover:text-sky-300">
                          <span>Join Telegram Group</span>
                          <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </a>
                    </div>
                  </div>
                  <CalendarIcon className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/5 rotate-12 pointer-events-none" />
                </div>

                {/* MODAL: Full 2026 Plan Item Details */}
                <AnimatePresence>
                  {selectedPlanModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
                      onClick={() => setSelectedPlanModal(null)}
                    >
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto"
                      >
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                          <div className="space-y-1">
                            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full inline-block ${selectedPlanModal.type === 'subject'
                              ? 'bg-emerald-100 text-emerald-800'
                              : selectedPlanModal.type === 'revision'
                                ? 'bg-amber-100 text-amber-800'
                                : selectedPlanModal.type === 'test'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                              {selectedPlanModal.type.toUpperCase()} PLAN • {selectedPlanModal.category}
                            </span>
                            <h3 className="text-lg md:text-xl font-black text-slate-900">
                              {language === 'tamil' && selectedPlanModal.titleTa ? selectedPlanModal.titleTa : selectedPlanModal.title}
                            </h3>
                          </div>
                          <button
                            onClick={() => setSelectedPlanModal(null)}
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Scheduled Date</span>
                            <span className="font-bold text-slate-800 mt-0.5 block">
                              {new Date(selectedPlanModal.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                          </div>

                          <div className="p-3 bg-slate-50 rounded-xl">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Duration / Target</span>
                            <span className="font-bold text-slate-800 mt-0.5 block">
                              {selectedPlanModal.duration || 'Full Session'}
                            </span>
                          </div>

                          {selectedPlanModal.subject && (
                            <div className="p-3 bg-slate-50 rounded-xl col-span-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Subject / Discipline</span>
                              <span className="font-bold text-slate-800 mt-0.5 block">
                                {selectedPlanModal.subject}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Overview & Objectives</h4>
                          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                            {language === 'tamil' && selectedPlanModal.descriptionTa ? selectedPlanModal.descriptionTa : selectedPlanModal.description}
                          </p>
                        </div>

                        {/* Syllabus Topics */}
                        {selectedPlanModal.syllabusTopics && selectedPlanModal.syllabusTopics.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Syllabus Topics Covered</h4>
                            <div className="space-y-1.5">
                              {selectedPlanModal.syllabusTopics.map((topic, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                  <span>{topic}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions in Modal */}
                        <div className="flex items-center gap-3 pt-2">
                          <button
                            onClick={() => {
                              togglePlanCompletion(selectedPlanModal.id);
                              setSelectedPlanModal(null);
                            }}
                            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            <CheckSquare className="h-4 w-4" />
                            {completedPlanIds.includes(String(selectedPlanModal.id)) ? 'Mark Incomplete' : 'Mark as Completed'}
                          </button>

                          {selectedPlanModal.type === 'test' && (
                            <button
                              onClick={() => {
                                setSelectedPlanModal(null);
                                setCurrentView('quiz');
                              }}
                              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                            >
                              <Play className="h-4 w-4" />
                              Take Practice Test
                            </button>
                          )}

                          {selectedPlanModal.pdfUrl && (
                            <button
                              onClick={() => {
                                openPdfPreview(selectedPlanModal.pdfUrl!, selectedPlanModal.fileName || '2026_Notice.pdf');
                                setSelectedPlanModal(null);
                              }}
                              className="py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                            >
                              <FileText className="h-4 w-4" />
                              View PDF
                            </button>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : currentView === 'settings' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto space-y-10"
              >
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {language === 'english' ? 'Profile Settings' : 'சுயவிவர அமைப்புகள்'}
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    {language === 'english' ? 'Update your personal information and contact details.' : 'உங்கள் தனிப்பட்ட தகவல் மற்றும் தொடர்பு விவரங்களைப் புதுப்பிக்கவும்.'}
                  </p>
                </div>

                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-10 space-y-10">
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-[32px] bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 relative cursor-pointer overflow-hidden transition-all hover:border-blue-400">
                          {userProfile.avatar ? (
                            <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <User className="h-10 w-10" />
                          )}
                          <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer">
                            <Camera className="h-6 w-6 mb-1" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Update</span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setUserProfile({ ...userProfile, avatar: reader.result as string });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg border-2 border-white pointer-events-none">
                          <Upload className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{language === 'english' ? 'Profile Picture' : 'சுயவிவரப் படம்'}</h3>
                        <p className="text-xs text-slate-500 mt-1">PNG or JPG, max 5MB. Recommended 256x256.</p>
                        {userProfile.avatar && (
                          <button
                            onClick={() => setUserProfile({ ...userProfile, avatar: null })}
                            className="text-xs font-bold text-red-500 mt-2 hover:text-red-600 transition-colors"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block ml-1">
                          {language === 'english' ? 'Full Name' : 'முழு பெயர்'}
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            value={userProfile.name}
                            onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block ml-1">
                          {language === 'english' ? 'Phone Number' : 'தொலைபேசி எண்'}
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="tel"
                            value={userProfile.mobile}
                            onChange={(e) => setUserProfile({ ...userProfile, mobile: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <p className="text-xs text-slate-400 italic">
                        {language === 'english' ? 'Changes are saved to your local profile.' : 'மாற்றங்கள் உங்கள் உள்ளூர் சுயவிவரத்தில் சேமிக்கப்படும்.'}
                      </p>
                      <button
                        onClick={() => {
                          setShowSaveSuccess(true);
                          setTimeout(() => setShowSaveSuccess(false), 3000);
                        }}
                        className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                      >
                        {language === 'english' ? 'Save Profile' : 'சுயவிவரத்தைச் சேமி'}
                      </button>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {showSaveSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-emerald-500/20 flex items-center gap-4 border border-emerald-500/50"
                    >
                      <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                        <ThumbsUp className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{language === 'english' ? 'Profile saved successfully!' : 'சுயவிவரம் வெற்றிகரமாக சேமிக்கப்பட்டது!'}</p>
                        <p className="text-[10px] font-medium text-emerald-100 opacity-80">{language === 'english' ? 'All your changes are now live.' : 'உங்கள் மாற்றங்கள் அனைத்தும் இப்போது நேரலை.'}</p>
                      </div>
                      <button
                        onClick={() => setShowSaveSuccess(false)}
                        className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Quiz Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Quiz Test Center</h2>
                    <p className="text-slate-500 text-sm mt-1">Test your knowledge with chapter-wise and full-length mock tests.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                      <Trophy className="h-5 w-5 text-amber-500" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Rank</p>
                        <p className="text-sm font-bold text-slate-900 tabular-nums">#1,402</p>
                      </div>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Tests</p>
                        <p className="text-sm font-bold text-slate-900 tabular-nums">12 Done</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Quizzes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dynamicQuizzes.map((quiz) => (
                    <motion.div
                      key={quiz.id}
                      whileHover={{ y: -4 }}
                      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-start gap-5 group cursor-pointer"
                    >
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                        <HelpCircle className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{quiz.title}</h4>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${quiz.difficulty === 'High' ? 'bg-red-50 text-red-600' :
                            quiz.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' :
                              'bg-amber-50 text-amber-600'
                            }`}>{quiz.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mt-3">
                          <div className="flex items-center gap-1.5">
                            <Timer className="h-3.5 w-3.5" />
                            <span>{quiz.duration}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" />
                            <span>{quiz.questions} Questions</span>
                          </div>
                        </div>
                        <button
                          onClick={() => startTest(quiz)}
                          className="w-full mt-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                        >
                          Start Quiz Now
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {dynamicQuizzes.length === 0 && (
                    <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center py-16 shadow-xs">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-2xs">
                        <HelpCircle className="h-8 w-8" />
                      </div>
                      <h3 className="text-base font-bold text-slate-800">No Question Tests Available</h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                        All previous sample tests have been deleted. Newly published interactive question tests from the Admin Console will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Test Assessment Result & Solution Review Modal */}
      <AnimatePresence>
        {testResultSummary && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-4xl max-h-[92vh] rounded-[32px] overflow-hidden shadow-2xl flex flex-col border border-slate-100 my-auto"
            >
              {/* Modal Top Header */}
              <div className="px-8 py-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                      Assessment Result · {testResultSummary.category}
                    </span>
                    <h2 className="text-lg font-bold text-white leading-tight">
                      {testResultSummary.testTitle}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => setTestResultSummary(null)}
                  className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Close Result"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                {/* Score & Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Hero Score Tile */}
                  <div className="md:col-span-2 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-6 rounded-2xl text-white flex flex-col justify-between relative overflow-hidden shadow-lg">
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Final Score</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${testResultSummary.percentage >= 60 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                          {testResultSummary.percentage >= 80 ? 'Distinction' : testResultSummary.percentage >= 60 ? 'First Class' : testResultSummary.percentage >= 50 ? 'Passed' : 'Needs Practice'}
                        </span>
                      </div>
                      <div className="mt-4 flex items-baseline gap-3">
                        <span className="text-5xl font-extrabold tracking-tight tabular-nums text-white">
                          {testResultSummary.score}
                        </span>
                        <span className="text-xl font-bold text-slate-400">
                          / {testResultSummary.totalQuestions} Marks
                        </span>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-slate-400 mb-1 font-medium">
                          <span>Accuracy</span>
                          <span className="text-white font-bold">{testResultSummary.percentage}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-1000"
                            style={{ width: `${testResultSummary.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stat 1: Correct */}
                  <div className="bg-emerald-50/60 border border-emerald-100 p-5 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Correct</span>
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="mt-3">
                      <span className="text-3xl font-extrabold text-emerald-950 tabular-nums">
                        {testResultSummary.correct}
                      </span>
                      <p className="text-[11px] text-emerald-700 mt-0.5">+{testResultSummary.correct} Marks</p>
                    </div>
                  </div>

                  {/* Stat 2: Incorrect */}
                  <div className="bg-rose-50/60 border border-rose-100 p-5 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Wrong</span>
                      <X className="h-5 w-5 text-rose-600" />
                    </div>
                    <div className="mt-3">
                      <span className="text-3xl font-extrabold text-rose-950 tabular-nums">
                        {testResultSummary.wrong}
                      </span>
                      <p className="text-[11px] text-rose-700 mt-0.5">{testResultSummary.totalQuestions - testResultSummary.attempted} Unanswered</p>
                    </div>
                  </div>
                </div>

                {/* Additional Quick Info Pill Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-500">Time Taken:</span>
                    <span className="font-bold text-slate-800">{testResultSummary.timeSpent}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-500" />
                    <span className="text-slate-500">Student Rank:</span>
                    <span className="font-bold text-slate-800">
                      {testResultSummary.percentage >= 80 ? 'Rank #1 (Top 5%)' : testResultSummary.percentage >= 60 ? 'Rank #2' : 'Rank #3'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-blue-500" />
                    <span className="text-slate-500">Status:</span>
                    <span className="font-bold text-emerald-600">Saved to Test Marks</span>
                  </div>
                </div>

                {/* Modal Action Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setReviewMode(!reviewMode)}
                      className="w-full sm:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                      <span>{reviewMode ? 'Hide Explanations' : 'Review Questions'}</span>
                    </button>
                    <button
                      onClick={() => downloadSingleResultPdf({
                        examName: testResultSummary.testTitle,
                        category: testResultSummary.category,
                        marksScored: testResultSummary.score,
                        totalMarks: testResultSummary.totalQuestions,
                        percentage: testResultSummary.percentage,
                        date: new Date().toISOString().split('T')[0],
                        status: testResultSummary.percentage >= 80 ? 'Distinction' : testResultSummary.percentage >= 60 ? 'First Class' : testResultSummary.percentage >= 50 ? 'Passed' : 'Needs Practice'
                      }, { name: userProfile.name, rollNo: 'AGM-2024-042' })}
                      className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Scorecard (PDF)</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setTestResultSummary(null);
                        setCurrentView('marks');
                      }}
                      className="flex-1 sm:flex-none px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center"
                    >
                      View in Test Marks
                    </button>
                    <button
                      onClick={() => {
                        const mQuiz = dynamicQuizzes.find(q => q.title === testResultSummary.testTitle) || dynamicQuizzes[0];
                        setTestResultSummary(null);
                        startTest(mQuiz);
                      }}
                      className="flex-1 sm:flex-none px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Retake</span>
                    </button>
                  </div>
                </div>

                {/* Question-by-Question Review with Explanations */}
                {reviewMode && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-6 border-t border-slate-200 space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Question-by-Question Solution & Analysis</h3>
                        <p className="text-slate-500 text-xs">Verify correct options and read comprehensive faculty explanations.</p>
                      </div>

                      {/* Bilingual Review Switch */}
                      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
                        <button
                          onClick={() => setReviewLang('english')}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${reviewLang === 'english' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                          English
                        </button>
                        <button
                          onClick={() => setReviewLang('tamil')}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${reviewLang === 'tamil' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                          தமிழ்
                        </button>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {testResultSummary.questions.map((q, idx) => {
                        const qNum = idx + 1;
                        const userChoice = testResultSummary.userAnswers[qNum];
                        const isCorrect = userChoice === q.correctAnswer;
                        const isAttempted = userChoice !== undefined;
                        const options = reviewLang === 'tamil' && q.optionsTa ? q.optionsTa : q.optionsEn;
                        const qText = reviewLang === 'tamil' && q.textTa ? q.textTa : q.textEn;
                        const explanation = reviewLang === 'tamil' && q.explanationTa ? q.explanationTa : q.explanationEn;

                        return (
                          <div
                            key={q.id || idx}
                            className={`p-6 rounded-2xl border transition-all ${!isAttempted
                              ? 'bg-slate-50/60 border-slate-200'
                              : isCorrect
                                ? 'bg-emerald-50/30 border-emerald-200'
                                : 'bg-rose-50/30 border-rose-200'
                              }`}
                          >
                            {/* Question Header Status */}
                            <div className="flex items-center justify-between gap-3 mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                                  Q. {qNum}
                                </span>
                                {q.subject && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                                    {q.subject}
                                  </span>
                                )}
                              </div>

                              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${!isAttempted
                                ? 'bg-slate-100 text-slate-600'
                                : isCorrect
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                                }`}>
                                {!isAttempted ? 'Not Attempted (0 Marks)' : isCorrect ? 'Correct (+1 Mark)' : 'Incorrect (0 Marks)'}
                              </span>
                            </div>

                            {/* Question Text */}
                            <h4 className="text-sm font-bold text-slate-900 leading-relaxed mb-4">
                              {qText}
                            </h4>

                            {/* Options List */}
                            <div className="space-y-2 mb-4">
                              {options.map((optText, optIdx) => {
                                const isUserSelected = userChoice === optIdx;
                                const isRightChoice = q.correctAnswer === optIdx;

                                let optClass = 'bg-white border-slate-200 text-slate-700';
                                if (isRightChoice) {
                                  optClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                                } else if (isUserSelected && !isRightChoice) {
                                  optClass = 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                                }

                                return (
                                  <div
                                    key={optIdx}
                                    className={`flex items-center justify-between p-3 rounded-xl border text-xs leading-normal transition-all ${optClass}`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] ${isRightChoice
                                        ? 'bg-emerald-600 text-white'
                                        : isUserSelected
                                          ? 'bg-rose-600 text-white'
                                          : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {String.fromCharCode(65 + optIdx)}
                                      </span>
                                      <span>{optText}</span>
                                    </div>

                                    {isRightChoice && (
                                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" /> Correct Answer
                                      </span>
                                    )}
                                    {isUserSelected && !isRightChoice && (
                                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded flex items-center gap-1">
                                        <X className="h-3 w-3" /> Your Choice
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Detailed Explanation */}
                            {explanation && (
                              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs space-y-1">
                                <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                                  <span>{reviewLang === 'tamil' ? 'விரிவான விளக்கம்:' : 'Official Solution & Explanation:'}</span>
                                </div>
                                <p className="text-slate-700 leading-relaxed font-medium">
                                  {explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarLink({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all w-full text-left ${active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white px-5 py-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center gap-4">
      <div className="flex-shrink-0 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col text-left">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-black text-slate-900 tabular-nums leading-none mt-1">{value}</p>
      </div>
    </div>
  );
}
