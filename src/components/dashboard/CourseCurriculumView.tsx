import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Lock,
  CheckCircle2,
  HelpCircle,
  Clock,
  Star,
  Smartphone,
  Copy,
  Camera,
  CreditCard,
  Upload,
  X,
  Check,
  ChevronUp,
  FileText
} from 'lucide-react';

interface CurriculumSection {
  id: string;
  title: string;
  titleTa?: string;
  examsCount: number;
  items: Array<{
    id: string;
    num: number;
    title: string;
    titleTa?: string;
    questionsCount: number;
    duration: string;
    isFree?: boolean;
  }>;
}

interface CourseCurriculumViewProps {
  courseName: string;
  price?: number;
  originalPrice?: number;
  discountPercent?: number;
  language: 'english' | 'tamil';
  onLanguageChange: (lang: 'english' | 'tamil') => void;
  onBack: () => void;
  onStartQuiz: (quizDetails: { title: string; category: string; questionsCount: number; duration: string }) => void;
}

export default function CourseCurriculumView({
  courseName = 'RRB NTPC',
  price = 299,
  originalPrice = 2999,
  discountPercent = 90,
  language = 'tamil',
  onLanguageChange,
  onBack,
  onStartQuiz
}: CourseCurriculumViewProps) {
  const [activeLanguage, setActiveLanguage] = useState<'english' | 'tamil'>(language);
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>('sec-1');
  const [expandedItemsGroup, setExpandedItemsGroup] = useState<boolean>(true);

  // Enrollment state
  const [isEnrolled, setIsEnrolled] = useState(() => {
    try {
      const list = JSON.parse(localStorage.getItem('ambedkar_enrolled_courses') || '[]');
      return list.some((c: string) =>
        c.toLowerCase().includes(courseName.toLowerCase()) ||
        courseName.toLowerCase().includes(c.toLowerCase()) ||
        c === 'all-in-one-2026'
      );
    } catch {
      return false;
    }
  });

  // Manual payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [paymentSubmittedSuccess, setPaymentSubmittedSuccess] = useState(false);

  const upiId = localStorage.getItem('ambedkar_upi_id') || 'name@upi';

  const toggleLanguage = (lang: 'english' | 'tamil') => {
    setActiveLanguage(lang);
    if (onLanguageChange) onLanguageChange(lang);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshotPreview && !transactionId) {
      alert('Please upload a screenshot or enter your Transaction / UTR ID.');
      return;
    }
    setIsSubmittingProof(true);

    setTimeout(() => {
      setIsSubmittingProof(false);
      setPaymentSubmittedSuccess(true);

      try {
        const currentPurchases = JSON.parse(localStorage.getItem('ambedkar_enrolled_courses') || '[]');
        if (!currentPurchases.includes(courseName)) {
          currentPurchases.push(courseName);
          localStorage.setItem('ambedkar_enrolled_courses', JSON.stringify(currentPurchases));
        }
      } catch {}

      setIsEnrolled(true);

      setTimeout(() => {
        setPaymentSubmittedSuccess(false);
        setShowPaymentModal(false);
        setScreenshotFile(null);
        setScreenshotPreview(null);
        setTransactionId('');
      }, 2000);
    }, 1000);
  };

  // Generate sections based on course name
  const getCurriculumData = (): CurriculumSection[] => {
    const lower = courseName.toLowerCase();
    if (lower.includes('group 4') || lower.includes('tnpsc')) {
      return [
        {
          id: 'sec-1',
          title: 'General Tamil (பொதுத்தமிழ்)',
          titleTa: 'பொதுத்தமிழ் - முழு பாடத்திட்டம்',
          examsCount: 10,
          items: [
            { id: 'item-1', num: 1, title: 'General Tamil - பகுதி (அ) இலக்கணம் & சொல் பொருள்', titleTa: 'பொதுத்தமிழ் - பகுதி (அ) இலக்கணம் & சொல் பொருள்', questionsCount: 100, duration: '60 min', isFree: true },
            { id: 'item-2', num: 2, title: 'General Tamil - பகுதி (ஆ) இலக்கியம் - திருக்குறள், எட்டுத்தொகை', titleTa: 'பொதுத்தமிழ் - பகுதி (ஆ) இலக்கியம்', questionsCount: 100, duration: '60 min', isFree: false },
            { id: 'item-3', num: 3, title: 'General Tamil - பகுதி (இ) தமிழ் அறிஞர்களும் தொண்டும்', titleTa: 'பொதுத்தமிழ் - பகுதி (இ) தமிழ் அறிஞர்கள்', questionsCount: 100, duration: '60 min', isFree: false }
          ]
        },
        {
          id: 'sec-2',
          title: 'General Studies (பொது அறிவு)',
          titleTa: 'பொது அறிவு (வரலாறு, பாலிட்டி, அறிவியல்)',
          examsCount: 15,
          items: [
            { id: 'item-4', num: 1, title: 'History & Culture of India and Tamil Nadu', questionsCount: 100, duration: '60 min', isFree: true },
            { id: 'item-5', num: 2, title: 'Indian Polity & Constitution', questionsCount: 100, duration: '60 min', isFree: false }
          ]
        },
        {
          id: 'sec-3',
          title: 'Aptitude & Mental Ability',
          titleTa: 'திறனறிவும் மனக்கணக்கும் (Aptitude)',
          examsCount: 10,
          items: [
            { id: 'item-6', num: 1, title: 'Simplification, Percentage & Ratio', questionsCount: 25, duration: '30 min', isFree: true }
          ]
        },
        {
          id: 'sec-4',
          title: 'Previous Year Question Paper',
          titleTa: 'முந்தைய ஆண்டு வினாத்தாள்கள்',
          examsCount: 5,
          items: [
            { id: 'item-7', num: 1, title: 'TNPSC Group 4 Official Question Paper 2024', questionsCount: 200, duration: '180 min', isFree: true }
          ]
        }
      ];
    }

    // Default RRB NTPC Sections (matching Screenshots 2, 3, 4)
    return [
      {
        id: 'sec-1',
        title: 'General Awareness',
        titleTa: 'பொது விழிப்புணர்வு (General Awareness)',
        examsCount: 7,
        items: [
          {
            id: 'item-1',
            num: 1,
            title: 'General Awareness - national international importance',
            titleTa: 'பொது விழிப்புணர்வு - தேசிய மற்றும் சர்வதேச நிகழ்வுகள்',
            questionsCount: 100,
            duration: '60 min',
            isFree: true
          },
          {
            id: 'item-2',
            num: 2,
            title: 'General Awareness - history and freedom struggle of India',
            titleTa: 'பொது விழிப்புணர்வு - இந்திய வரலாறு & சுதந்திரப் போராட்டம்',
            questionsCount: 100,
            duration: '60 min',
            isFree: false
          },
          {
            id: 'item-3',
            num: 3,
            title: 'General Awareness - physical social and economic geography',
            questionsCount: 100,
            duration: '60 min',
            isFree: false
          },
          {
            id: 'item-4',
            num: 4,
            title: 'General Awareness - Indian polity and constitution',
            questionsCount: 100,
            duration: '60 min',
            isFree: false
          }
        ]
      },
      {
        id: 'sec-2',
        title: 'Arithmetic / Math',
        titleTa: 'கணிதம் (Arithmetic / Math)',
        examsCount: 13,
        items: [
          { id: 'item-m1', num: 1, title: 'Number System, Decimals & Fractions', questionsCount: 30, duration: '30 min', isFree: true },
          { id: 'item-m2', num: 2, title: 'LCM, HCF, Ratio and Proportions', questionsCount: 30, duration: '30 min', isFree: false }
        ]
      },
      {
        id: 'sec-3',
        title: 'General Intelligence and Reasoning',
        titleTa: 'காரணவியல் (General Intelligence & Reasoning)',
        examsCount: 9,
        items: [
          { id: 'item-r1', num: 1, title: 'Analogies, Syllogisms & Coding-Decoding', questionsCount: 30, duration: '30 min', isFree: true },
          { id: 'item-r2', num: 2, title: 'Mathematical Operations & Blood Relations', questionsCount: 30, duration: '30 min', isFree: false }
        ]
      },
      {
        id: 'sec-4',
        title: 'Previous Year Question Paper',
        titleTa: 'முந்தைய ஆண்டு வினாத்தாள்கள்',
        examsCount: 4,
        items: [
          { id: 'item-p1', num: 1, title: 'RRB NTPC CBT-1 Official PYQ Shift 1', questionsCount: 100, duration: '90 min', isFree: true }
        ]
      }
    ];
  };

  const sections = getCurriculumData();

  return (
    <div className="space-y-6 pb-28 animate-fadeIn">
      {/* Top Header matching Screenshot 2 */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {courseName}
            </h1>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              {courseName} Comprehensive Test Series & Notes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher pill matching screenshot */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-bold">
            <span className="text-slate-400 px-2 text-[11px]">Lang:</span>
            <button
              onClick={() => toggleLanguage('tamil')}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeLanguage === 'tamil' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              TA
            </button>
            <button
              onClick={() => toggleLanguage('english')}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeLanguage === 'english' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
          </div>

          {/* Orange Cart Pricing Pill matching screenshot */}
          {!isEnrolled && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-xl text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <span>🛒</span>
              <span className="line-through text-orange-200 text-[10px]">₹{originalPrice}</span>
              <span className="text-white font-black text-sm">₹{price}</span>
              <span className="bg-[#facc15] text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded">{discountPercent}%</span>
            </button>
          )}
        </div>
      </div>

      {/* Course Sections List (Accordion matching Screenshot 2, 3, 4) */}
      <div className="space-y-4">
        {sections.map(sec => {
          const isExpanded = expandedSectionId === sec.id;

          return (
            <div
              key={sec.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
            >
              {/* Main Section Header */}
              <button
                type="button"
                onClick={() => setExpandedSectionId(isExpanded ? null : sec.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Circular progress badge matching screenshot */}
                  <div className="w-11 h-11 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs bg-slate-50 shrink-0">
                    {isEnrolled ? '1/1' : '0/1'}
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {activeLanguage === 'tamil' && sec.titleTa ? sec.titleTa : sec.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {sec.title}
                    </p>
                    <div className="mt-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        <FileText className="w-3 h-3" />
                        <span>{sec.examsCount} Exams</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-slate-400 p-1">
                  {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-700" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </button>

              {/* Progress bar under section header */}
              <div className="px-5 pb-2">
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: isEnrolled ? '100%' : '0%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                  <span>{isEnrolled ? '1/1' : '0/1'}</span>
                </div>
              </div>

              {/* Expanded Sub-items (Matching Screenshot 3 & 4) */}
              {isExpanded && (
                <div className="p-4 sm:p-5 pt-2 border-t border-slate-100 bg-slate-50/30 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Items</span>
                  </div>

                  {/* Sub-accordion Box */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                    <div
                      onClick={() => setExpandedItemsGroup(!expandedItemsGroup)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">{sec.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            ≡ {sec.items.length} sections
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            🗂 {sec.examsCount} Exams
                          </span>
                        </div>
                      </div>
                      <div className="text-slate-400">
                        {expandedItemsGroup ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {expandedItemsGroup && (
                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        {sec.items.map((item, idx) => {
                          const isLocked = !item.isFree && !isEnrolled;

                          return (
                            <React.Fragment key={item.id}>
                              <div
                                onClick={() => {
                                  if (isLocked) {
                                    setShowPaymentModal(true);
                                  } else {
                                    onStartQuiz({
                                      title: item.title,
                                      category: courseName,
                                      questionsCount: item.questionsCount,
                                      duration: item.duration
                                    });
                                  }
                                }}
                                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                                  isLocked
                                    ? 'bg-amber-50/20 border-amber-200/60 hover:bg-amber-50/40'
                                    : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs'
                                }`}
                              >
                                {/* Step number node */}
                                <div className="w-7 h-7 rounded-full border-2 border-emerald-500 text-emerald-600 font-extrabold text-xs flex items-center justify-center shrink-0 bg-white">
                                  {item.num}
                                </div>

                                {/* Icon box */}
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                  item.isFree ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                  <HelpCircle className="w-5 h-5" />
                                </div>

                                {/* Item Info */}
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                                    {activeLanguage === 'tamil' && item.titleTa ? item.titleTa : item.title}
                                  </h5>
                                  <p className="text-[11px] text-slate-400 font-medium flex items-center gap-2 mt-0.5">
                                    <span>{item.questionsCount} Qs</span>
                                    <span>•</span>
                                    <span>Exam</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {item.duration}
                                    </span>
                                  </p>
                                </div>

                                {/* Right Badge */}
                                <div>
                                  {item.isFree || isEnrolled ? (
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> FREE
                                      </span>
                                      <ChevronRight className="w-4 h-4 text-slate-400" />
                                    </div>
                                  ) : (
                                    <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-300 text-amber-600 flex items-center justify-center">
                                      <Lock className="w-3.5 h-3.5" />
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Prominent Unlock Box under Item 2 matching Screenshot 4 */}
                              {idx === 1 && !isEnrolled && (
                                <div className="bg-[#fffbeb] border-2 border-[#fde047] rounded-3xl p-6 text-center space-y-3 shadow-xs my-3">
                                  <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto text-amber-600 shadow-2xs">
                                    <Lock className="w-6 h-6" />
                                  </div>
                                  <h4 className="font-black text-base sm:text-lg text-slate-900">
                                    Unlock the Full Selection Path
                                  </h4>
                                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                                    Get access to all lessons and premium content
                                  </p>
                                  <button
                                    onClick={() => {
                                      const freeItem = sec.items.find((i: any) => i.isFree) || sec.items[0];
                                      if (freeItem) {
                                        onStartQuiz({
                                          title: freeItem.title,
                                          category: courseName,
                                          questionsCount: freeItem.questionsCount,
                                          duration: freeItem.duration
                                        });
                                      }
                                    }}
                                    className="px-6 py-2.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-black rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer inline-flex items-center gap-2"
                                  >
                                    <span>Free Test</span>
                                  </button>
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>


      {/* Manual Payment Modal matching Screenshot 3 */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col my-auto max-h-[92vh]"
            >
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-1 text-slate-500 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="font-extrabold text-base text-slate-900">
                  Manual Payment
                </h3>
                <div className="w-6" />
              </div>

              <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
                <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-5 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-500 mb-2 shadow-xs">
                    <Star className="w-6 h-6 fill-current text-amber-400" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-lg">
                    Premium Access
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {courseName}
                  </p>
                  <span className="text-3xl font-black text-[#0284c7] mt-2">
                    ₹{price}
                  </span>
                </div>

                <div className="text-left">
                  <h4 className="font-black text-sm text-slate-900 mb-3">
                    Payment Instructions
                  </h4>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 mb-4 shadow-2xs">
                    <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>Step 1: Make Payment</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Choose any payment method:
                    </p>

                    <div className="bg-[#f0f9ff] border border-blue-200 rounded-xl p-3.5 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <Smartphone className="w-4 h-4 text-blue-600" />
                        <span>UPI Payment (Recommended)</span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="font-extrabold text-blue-700 text-sm tracking-wide">
                          {upiId}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                        >
                          {copiedUpi ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-400 font-medium">
                        Use GPay, PhonePe, Paytm, or any UPI app
                      </p>
                    </div>

                    <div className="border border-slate-100 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setShowBankDetails(!showBankDetails)}
                        className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-slate-100/50 flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer transition-colors"
                      >
                        <span>Bank Transfer / NEFT / RTGS</span>
                        {showBankDetails ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </button>

                      {showBankDetails && (
                        <div className="p-3.5 bg-white text-xs space-y-1.5 text-slate-600 border-t border-slate-100">
                          <p><strong className="text-slate-800">Account Name:</strong> Ambedkar IAS Academy</p>
                          <p><strong className="text-slate-800">Account No:</strong> 50200083921049</p>
                          <p><strong className="text-slate-800">IFSC Code:</strong> HDFC0001234</p>
                          <p><strong className="text-slate-800">Branch:</strong> Chennai Main Branch</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2 mb-4 shadow-2xs">
                    <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
                      <Camera className="w-4 h-4 text-blue-600" />
                      <span>Step 2: Take Screenshot</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      After making the payment, take a clear screenshot of the payment confirmation screen showing:
                    </p>
                    <ul className="text-xs text-slate-600 space-y-1 pl-3 font-medium list-disc">
                      <li>Transaction ID</li>
                      <li>Date & Time</li>
                      <li>Amount (₹{price}.0)</li>
                      <li>Receiver details</li>
                    </ul>
                  </div>

                  <form onSubmit={handleSubmitProof} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                    <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span>Step 3: Upload Payment Proof</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Select and upload the screenshot of your payment:
                    </p>

                    {screenshotPreview ? (
                      <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={screenshotPreview}
                            alt="Payment Proof"
                            className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-800 truncate max-w-[180px]">
                              {screenshotFile?.name || 'payment_proof.jpg'}
                            </p>
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Ready to submit
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setScreenshotFile(null);
                            setScreenshotPreview(null);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="w-full py-3 bg-[#1e293b] hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs">
                        <Camera className="w-4 h-4" />
                        <span>Select Screenshot</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}

                    <div className="pt-2">
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        UTR / UPI Transaction ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 423589102432"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingProof || paymentSubmittedSuccess}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                    >
                      {isSubmittingProof ? (
                        <span>Verifying Payment Proof...</span>
                      ) : paymentSubmittedSuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Submitted! Unlocking Access...</span>
                        </>
                      ) : (
                        <span>Submit Proof & Activate Access</span>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
