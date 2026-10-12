import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, Loader2, Sparkles, CheckCircle2, Flame, Rocket, Layers } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { StoreCourseItem } from '../dashboard/StoreView';

const INITIAL_ADMIN_COURSES: StoreCourseItem[] = [
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
    description: 'Complete syllabus coverage for RRB NTPC Stage 1 & 2 with General Awareness, Math, and Reasoning test series.'
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
    description: 'Complete 100+ full-length bilingual mock tests based on latest 2026 syllabus with instant ranking.'
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
    description: 'Samacheer Kalvi 6th to 12th condensed master notes, Tamil grammar compendium, and GK capsules.'
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
    description: 'All-inclusive premium bundle combining comprehensive study materials, chapter-wise notes and 150+ mock tests.'
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
    description: 'Quantitative Aptitude shortcuts, Reasoning Puzzles, English comprehension and Banking Awareness.'
  }
];

export default function AdminStorePanel() {
  const [courses, setCourses] = useState<StoreCourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<StoreCourseItem, 'id'>>({
    title: '',
    titleTa: '',
    subtitle: '',
    category: 'TNPSC',
    price: 299,
    originalPrice: 2999,
    discountPercent: 90,
    themeColor: 'emerald',
    hasFreeTrial: true,
    isFillingFast: false,
    freeExamsCount: 5,
    topicsCount: 100,
    description: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    const local = JSON.parse(localStorage.getItem('ambedkar_store_courses') || 'null');
    try {
      const snap = await getDocs(collection(db, 'storeCourses'));
      const remote = snap.docs.map(d => ({ id: d.id, ...d.data() } as StoreCourseItem));
      const list = remote.length > 0 ? remote : (local && local.length > 0 ? local : INITIAL_ADMIN_COURSES);
      setCourses(list);
      localStorage.setItem('ambedkar_store_courses', JSON.stringify(list));
    } catch {
      setCourses(local && local.length > 0 ? local : INITIAL_ADMIN_COURSES);
    }
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await setDoc(doc(db, 'storeCourses', editingId), form);
      } else {
        await addDoc(collection(db, 'storeCourses'), form);
      }
    } catch {
      // Local fallback
    }

    const localCourses = JSON.parse(localStorage.getItem('ambedkar_store_courses') || '[]');
    let updated: StoreCourseItem[];
    if (editingId) {
      updated = localCourses.map((c: StoreCourseItem) => c.id === editingId ? { id: editingId, ...form } : c);
    } else {
      const newCourse: StoreCourseItem = { id: `c-${Date.now()}`, ...form };
      updated = [...localCourses, newCourse];
    }
    localStorage.setItem('ambedkar_store_courses', JSON.stringify(updated));
    setCourses(updated);

    setSuccessMessage(editingId ? 'Package updated successfully!' : 'New package added to Premium Store!');
    setTimeout(() => setSuccessMessage(''), 3000);
    resetForm();
    setIsSaving(false);
  };

  const handleEdit = (course: StoreCourseItem) => {
    setEditingId(course.id);
    setForm({
      title: course.title,
      titleTa: course.titleTa || '',
      subtitle: course.subtitle,
      category: course.category,
      price: course.price,
      originalPrice: course.originalPrice,
      discountPercent: course.discountPercent,
      themeColor: course.themeColor || 'emerald',
      hasFreeTrial: course.hasFreeTrial ?? true,
      isFillingFast: course.isFillingFast ?? false,
      freeExamsCount: course.freeExamsCount || 5,
      topicsCount: course.topicsCount || 100,
      description: course.description || ''
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course package?')) return;
    try {
      await deleteDoc(doc(db, 'storeCourses', id));
    } catch {}
    const updated = courses.filter(c => c.id !== id);
    setCourses(updated);
    localStorage.setItem('ambedkar_store_courses', JSON.stringify(updated));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      title: '',
      titleTa: '',
      subtitle: '',
      category: 'TNPSC',
      price: 299,
      originalPrice: 2999,
      discountPercent: 90,
      themeColor: 'emerald',
      hasFreeTrial: true,
      isFillingFast: false,
      freeExamsCount: 5,
      topicsCount: 100,
      description: ''
    });
  };

  const [adminUpiId, setAdminUpiId] = useState(() => localStorage.getItem('ambedkar_upi_id') || 'name@upi');

  const handleSaveUpi = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('ambedkar_upi_id', adminUpiId);
    setSuccessMessage('Academy UPI ID updated successfully to ' + adminUpiId);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Rocket className="h-5 w-5 text-blue-600" />
            Premium Store Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Publish, edit course bundles, set offer pricing, and manage payment receiving settings.
          </p>
        </div>

        {/* Global UPI Settings */}
        <form onSubmit={handleSaveUpi} className="flex items-center gap-2">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Receiving UPI ID</label>
            <input
              type="text"
              value={adminUpiId}
              onChange={e => setAdminUpiId(e.target.value)}
              placeholder="e.g. name@upi"
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Save UPI
          </button>
        </form>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Package Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">
          {editingId ? 'Edit Package' : 'Add New Premium Package'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Package Title (English)</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. RRB NTPC"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Package Title (Tamil)</label>
            <input
              type="text"
              value={form.titleTa}
              onChange={e => setForm({ ...form, titleTa: e.target.value })}
              placeholder="e.g. ரயில்வே RRB NTPC"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Subtitle / Target Group</label>
            <input
              type="text"
              required
              value={form.subtitle}
              onChange={e => setForm({ ...form, subtitle: e.target.value })}
              placeholder="e.g. Group 4 / RRB NTPC"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Category</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value as any })}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="TNPSC">TNPSC</option>
              <option value="RRB">RRB</option>
              <option value="Banking">Banking</option>
              <option value="All">All</option>
            </select>
          </div>


          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Theme Gradient</label>
            <select
              value={form.themeColor}
              onChange={e => setForm({ ...form, themeColor: e.target.value as any })}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="emerald">Emerald Green (RRB)</option>
              <option value="navy">Navy / Slate (Group 4 Test)</option>
              <option value="blue">Royal Blue (Notes Series)</option>
              <option value="purple">Deep Purple (Combos)</option>
            </select>
          </div>

          <div className="flex items-center gap-6 pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={form.hasFreeTrial}
                onChange={e => setForm({ ...form, hasFreeTrial: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>FREE TRIAL Ribbon</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={form.isFillingFast}
                onChange={e => setForm({ ...form, isFillingFast: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded"
              />
              <span>🔥 Filling Fast</span>
            </label>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Description</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Details about tests, notes, video classes, etc."
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{editingId ? 'Update Package' : 'Publish Package'}</span>
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Existing Packages List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-4">
          Live Store Packages ({courses.length})
        </h3>

        {isLoading ? (
          <div className="py-12 flex justify-center text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <div key={course.id} className="p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3 bg-slate-50/50">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {course.category}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{course.title}</h4>
                    <p className="text-xs text-slate-500">{course.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(course)}
                      className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 font-bold">
                  <span className="text-[11px] text-slate-500 font-medium">Course Package</span>
                  {course.hasFreeTrial && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Free Trial Active
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
