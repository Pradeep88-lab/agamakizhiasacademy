import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Rocket,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Upload,
  CheckCircle2,
  X,
  ArrowLeft,
  Smartphone,
  Building,
  Train,
  Landmark,
  BookOpen,
  HelpCircle,
  FileText,
  Star,
  ShieldCheck,
  Flame,
  Camera,
  CreditCard,
  QrCode,
  Eye,
  Lock,
  Sparkles
} from 'lucide-react';
import logoImage from '../../assets/images/regenerated_image_1790577966199.jpg';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export interface StoreCourseItem {
  id: string;
  title: string;
  titleTa?: string;
  subtitle: string;
  category: 'TNPSC' | 'RRB' | 'Banking' | 'All';
  price: number;
  originalPrice: number;
  discountPercent: number;
  themeColor: 'emerald' | 'navy' | 'blue' | 'purple';
  isFillingFast?: boolean;
  hasFreeTrial?: boolean;
  freeExamsCount?: number;
  topicsCount?: number;
  description?: string;
  previewVideoUrl?: string;
}

const DEFAULT_COURSES: StoreCourseItem[] = [
  {
    id: 'rrb-ntpc',
    title: 'RRB NTPC',
    titleTa: 'ரயில்வே RRB NTPC தேர்வு',
    subtitle: 'RRB NTPC',
    category: 'RRB',
    price: 299,
    originalPrice: 2999,
    discountPercent: 90,
    themeColor: 'emerald',
    hasFreeTrial: true,
    freeExamsCount: 7,
    topicsCount: 140,
    description: 'Complete syllabus coverage for RRB NTPC Stage 1 & 2 with General Awareness, Math, and Reasoning test series.',
  },
  {
    id: 'tnpsc-g4-test-series',
    title: 'Group 4 -Test Series',
    titleTa: 'குரூப் 4 - மாதிரித் தேர்வுத் தொடர்',
    subtitle: 'Group 4',
    category: 'TNPSC',
    price: 299,
    originalPrice: 2999,
    discountPercent: 90,
    themeColor: 'navy',
    hasFreeTrial: true,
    isFillingFast: true,
    freeExamsCount: 5,
    topicsCount: 120,
    description: 'Complete 100+ full-length bilingual mock tests based on latest 2026 syllabus with instant ranking.',
  },
  {
    id: 'tnpsc-g4-notes-series',
    title: 'Group 4 - Notes Series',
    titleTa: 'குரூப் 4 - பிரத்யேக குறிப்புகள்',
    subtitle: 'Group 4 - Notes Series',
    category: 'TNPSC',
    price: 999,
    originalPrice: 13999,
    discountPercent: 93,
    themeColor: 'blue',
    hasFreeTrial: true,
    freeExamsCount: 3,
    topicsCount: 85,
    description: 'Samacheer Kalvi 6th to 12th condensed master notes, Tamil grammar compendium, and GK capsules.',
  },
  {
    id: 'tnpsc-g4-combo',
    title: 'Group 4 - Test & Notes Series',
    titleTa: 'குரூப் 4 - தேர்வுகள் & குறிப்புகள் தொகுப்பு',
    subtitle: 'Merged group content',
    category: 'TNPSC',
    price: 1799,
    originalPrice: 16999,
    discountPercent: 89,
    themeColor: 'purple',
    hasFreeTrial: true,
    freeExamsCount: 10,
    topicsCount: 220,
    description: 'All-inclusive premium bundle combining comprehensive study materials, chapter-wise notes and 150+ mock tests.',
  },
  {
    id: 'banking-sbi-ibps',
    title: 'Banking All-in-One (IBPS & SBI)',
    titleTa: 'வங்கி தேர்வுகள் (IBPS & SBI)',
    subtitle: 'Banking PO & Clerk',
    category: 'Banking',
    price: 499,
    originalPrice: 3999,
    discountPercent: 88,
    themeColor: 'blue',
    hasFreeTrial: true,
    freeExamsCount: 6,
    topicsCount: 95,
    description: 'Quantitative Aptitude shortcuts, Reasoning Puzzles, English comprehension and Banking Awareness.',
  }
];

export default function StoreView({
  language = 'english',
  onSelectCourse,
  onStartFreeTest
}: {
  language?: 'english' | 'tamil';
  onSelectCourse?: (courseId: string) => void;
  onStartFreeTest?: (course: StoreCourseItem) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<'All' | 'TNPSC' | 'RRB' | 'Banking'>('All');
  const [courses, setCourses] = useState<StoreCourseItem[]>(DEFAULT_COURSES);
  const [selectedCourseForPurchase, setSelectedCourseForPurchase] = useState<StoreCourseItem | null>(null);
  const [selectedCourseForPreview, setSelectedCourseForPreview] = useState<StoreCourseItem | null>(null);

  // Manual payment state
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [paymentSubmittedSuccess, setPaymentSubmittedSuccess] = useState(false);

  // Fetch remote store items if configured in Firestore / LocalStorage
  useEffect(() => {
    const fetchStoreItems = async () => {
      try {
        const local = localStorage.getItem('ambedkar_store_courses');
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCourses(parsed);
          }
        }
        const snap = await getDocs(collection(db, 'storeCourses'));
        if (!snap.empty) {
          const remoteList = snap.docs.map(d => ({ id: d.id, ...d.data() } as StoreCourseItem));
          setCourses(remoteList);
          localStorage.setItem('ambedkar_store_courses', JSON.stringify(remoteList));
        }
      } catch {
        // Fallback to default courses
      }
    };
    fetchStoreItems();
  }, []);

  const filteredCourses = courses.filter(item => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  const upiId = localStorage.getItem('ambedkar_upi_id') || 'name@upi';

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

      // Save unlocked state to localStorage
      try {
        const currentPurchases = JSON.parse(localStorage.getItem('ambedkar_enrolled_courses') || '[]');
        if (selectedCourseForPurchase && !currentPurchases.includes(selectedCourseForPurchase.id)) {
          currentPurchases.push(selectedCourseForPurchase.id);
          localStorage.setItem('ambedkar_enrolled_courses', JSON.stringify(currentPurchases));
        }
      } catch {}

      setTimeout(() => {
        setPaymentSubmittedSuccess(false);
        setSelectedCourseForPurchase(null);
        setScreenshotFile(null);
        setScreenshotPreview(null);
        setTransactionId('');
      }, 2500);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm flex items-center justify-center p-1">
            <img src={logoImage} alt="Logo" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
              Premium Store
            </h1>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1 block">
              Ambedkar IAS Academy
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Special 2026 Offer
          </span>
        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['All', 'TNPSC', 'RRB', 'Banking'] as const).map(cat => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Product Course Cards (2 Columns Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {filteredCourses.map(course => {
          // Color styles for top card banner
          const getThemeClasses = () => {
            switch (course.themeColor) {
              case 'emerald':
                return {
                  headerBg: 'bg-gradient-to-br from-[#059669] to-[#047857]',
                  icon: <Train className="w-20 h-20 text-white/20 absolute -right-2 -bottom-2" />
                };
              case 'navy':
                return {
                  headerBg: 'bg-gradient-to-br from-[#334155] to-[#1e293b]',
                  icon: <Landmark className="w-20 h-20 text-white/20 absolute -right-2 -bottom-2" />
                };
              case 'blue':
                return {
                  headerBg: 'bg-gradient-to-br from-[#2563eb] to-[#1d4ed8]',
                  icon: <Building className="w-20 h-20 text-white/20 absolute -right-2 -bottom-2" />
                };
              case 'purple':
              default:
                return {
                  headerBg: 'bg-gradient-to-br from-[#4338ca] to-[#312e81]',
                  icon: <BookOpen className="w-20 h-20 text-white/20 absolute -right-2 -bottom-2" />
                };
            }
          };

          const theme = getThemeClasses();

          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col relative group"
            >
              {/* Top Banner with diagonal ribbon & title */}
              <div className={`relative h-28 sm:h-32 ${theme.headerBg} p-4 sm:p-5 flex flex-col justify-end text-white overflow-hidden`}>
                {/* Diagonal Ribbon: FREE TRIAL */}
                {course.hasFreeTrial && (
                  <div className="absolute -left-9 top-3.5 w-32 bg-[#16a34a] text-white text-[9px] font-black uppercase tracking-wider py-0.5 text-center transform -rotate-45 shadow-sm pointer-events-none z-10">
                    FREE TRIAL
                  </div>
                )}

                {/* Optional Filling Fast badge */}
                {course.isFillingFast && (
                  <div className="absolute top-3 right-3 bg-[#dc2626] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Flame className="w-3 h-3 fill-current text-amber-200" />
                    <span>Filling Fast</span>
                  </div>
                )}

                {/* Watermark Icon */}
                {theme.icon}

                {/* Title */}
                <h3 className="font-black text-base sm:text-lg text-white leading-snug tracking-tight z-10 drop-shadow-xs">
                  {language === 'tamil' && course.titleTa ? course.titleTa : course.title}
                </h3>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 flex flex-col flex-1">
                {/* Subtitle */}
                <p className="text-xs font-semibold text-slate-500 mb-3">
                  {course.subtitle}
                </p>

                {/* Action Buttons */}
                <div className="mt-auto pt-3">
                  <button
                    onClick={() => setSelectedCourseForPreview(course)}
                    className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-2xs active:scale-[0.99]"
                  >
                    Free Test
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Payment Modal (Screenshot 3) */}
      <AnimatePresence>
        {selectedCourseForPurchase && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col my-auto max-h-[92vh]"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <button
                  onClick={() => setSelectedCourseForPurchase(null)}
                  className="p-1 text-slate-500 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="font-extrabold text-base text-slate-900">
                  Manual Payment
                </h3>
                <div className="w-6" /> {/* spacer */}
              </div>

              {/* Scrollable Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
                {/* Course & Price Badge Card */}
                <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-5 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-500 mb-2 shadow-xs">
                    <Star className="w-6 h-6 fill-current text-amber-400" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-lg">
                    Premium Access
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {selectedCourseForPurchase.title}
                  </p>
                  <span className="text-3xl font-black text-[#0284c7] mt-2">
                    ₹{selectedCourseForPurchase.price}
                  </span>
                </div>

                <div className="text-left">
                  <h4 className="font-black text-sm text-slate-900 mb-3">
                    Payment Instructions
                  </h4>

                  {/* Step 1: Make Payment */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 mb-4 shadow-2xs">
                    <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>Step 1: Make Payment</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Choose any payment method:
                    </p>

                    {/* UPI Box */}
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

                    {/* Bank Transfer Accordion */}
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

                  {/* Step 2: Take Screenshot */}
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
                      <li>Amount (₹{selectedCourseForPurchase.price}.0)</li>
                      <li>Receiver details</li>
                    </ul>
                  </div>

                  {/* Step 3: Upload Payment Proof */}
                  <form onSubmit={handleSubmitProof} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                    <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span>Step 3: Upload Payment Proof</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Select and upload the screenshot of your payment:
                    </p>

                    {/* Screenshot Preview */}
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

                    {/* Optional UTR Input */}
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

                    {/* Submit Button */}
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

      {/* Free Trial / Preview Modal */}
      <AnimatePresence>
        {selectedCourseForPreview && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col my-auto"
            >
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Free Trial Preview
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 mt-1">
                    {selectedCourseForPreview.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCourseForPreview(null)}
                  className="p-1 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedCourseForPreview.description}
                </p>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-800">Free Preview Inclusions:</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Free Full Mock Test 01 with All India Rank</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Chapter 1 High-Yield Notes (PDF)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Detailed Answer Keys & Tamil Explanations</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      const course = selectedCourseForPreview;
                      setSelectedCourseForPreview(null);
                      if (onStartFreeTest && course) {
                        onStartFreeTest(course);
                      } else if (onSelectCourse && course) {
                        onSelectCourse(course.id);
                      }
                    }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs cursor-pointer text-center"
                  >
                    Start Free Test
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
