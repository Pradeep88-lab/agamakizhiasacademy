import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, ShoppingCart, Star, Filter, ArrowRight, BookOpen, ShieldCheck, Loader2, X, Smartphone, QrCode, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface BookItem {
  id: string;
  title: string;
  titleTa: string;
  category: 'TNPSC' | 'SSC' | 'Railway' | 'All';
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  coverImage: string;
  isBestSeller?: boolean;
}

const STORE_BOOKS: BookItem[] = [
  {
    id: 'b1',
    title: 'TNPSC Group 1, 2, 2A & 4 Full Syllabus Master Guide',
    titleTa: 'TNPSC குரூப் 1, 2, 2A & 4 முழுமையான வழிகாட்டி',
    category: 'TNPSC',
    price: 899,
    originalPrice: 1299,
    rating: 4.8,
    reviews: 1240,
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true,
  },
  {
    id: 'b2',
    title: 'SSC CGL/CHSL Tier 1 & 2 Mathematics Shortcuts',
    titleTa: 'SSC CGL/CHSL கணித குறுக்கு வழிகள்',
    category: 'SSC',
    price: 549,
    originalPrice: 899,
    rating: 4.7,
    reviews: 850,
    coverImage: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'b3',
    title: 'RRB NTPC & Group D General Science Capsule',
    titleTa: 'RRB NTPC பொது அறிவியல் தொகுப்பு',
    category: 'Railway',
    price: 399,
    originalPrice: 599,
    rating: 4.6,
    reviews: 620,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'b4',
    title: 'TNPSC General Tamil (பொதுத்தமிழ்) Question Bank',
    titleTa: 'TNPSC பொதுத்தமிழ் வினா வங்கி (10,000+ Qs)',
    category: 'TNPSC',
    price: 649,
    originalPrice: 999,
    rating: 4.9,
    reviews: 2100,
    coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600',
    isBestSeller: true,
  },
  {
    id: 'b5',
    title: 'SSC English Comprehension & Grammar',
    titleTa: 'SSC ஆங்கில இலக்கணம்',
    category: 'SSC',
    price: 499,
    originalPrice: 799,
    rating: 4.5,
    reviews: 430,
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'b6',
    title: 'Railway General Awareness Previous Year Papers',
    titleTa: 'ரயில்வே முந்தைய ஆண்டு வினாத்தாள்கள்',
    category: 'Railway',
    price: 449,
    originalPrice: 699,
    rating: 4.7,
    reviews: 910,
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600',
  }
];

export default function StoreView({ language }: { language: 'english' | 'tamil' }) {
  const [activeCategory, setActiveCategory] = useState<'All' | 'TNPSC' | 'SSC' | 'Railway'>('All');
  const [books, setBooks] = useState<BookItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBookForPurchase, setSelectedBookForPurchase] = useState<BookItem | null>(null);
  const [paymentStep, setPaymentStep] = useState<'select' | 'processing' | 'success'>('select');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  
  useEffect(() => {
    const fetchBooks = async () => {
      const localAdminBooks = JSON.parse(localStorage.getItem('agamakizh_store_books') || 'null');
      try {
        const snap = await getDocs(collection(db, 'storeBooks'));
        const remoteBooks = snap.docs.map(d => ({ id: d.id, ...d.data() } as BookItem));
        if (remoteBooks.length > 0) {
          setBooks(remoteBooks);
        } else {
          setBooks(localAdminBooks && localAdminBooks.length > 0 ? localAdminBooks : STORE_BOOKS);
        }
      } catch (error) {
        setBooks(localAdminBooks && localAdminBooks.length > 0 ? localAdminBooks : STORE_BOOKS);
      }
      setIsLoading(false);
    };
    fetchBooks();
  }, []);
  
  const filteredBooks = books.filter(book => activeCategory === 'All' || book.category === 'All' || book.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Store Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            {language === 'english' ? 'Academy Bookstore' : 'அகாடமி புத்தகக் கடை'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {language === 'english' 
              ? 'Premium study materials crafted by top educators for your exam success.'
              : 'சிறந்த கல்வியாளர்களால் தயாரிக்கப்பட்ட பிரத்தியேக ஆய்வுப் பொருட்கள்.'}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider leading-none">Guaranteed</p>
              <p className="text-xs font-bold text-emerald-900 mt-0.5">100% Authentic</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
        {['All', 'TNPSC', 'SSC', 'Railway'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
              activeCategory === cat
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat === 'All' && <Filter className="h-4 w-4" />}
            {cat} {language === 'tamil' && cat === 'All' ? 'அனைத்தும்' : cat === 'All' ? 'Exams' : 'Books'}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
          <p className="text-slate-500 font-medium">Loading books...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredBooks.map((book) => (
              <motion.div
                layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={book.id}
              className="bg-white rounded-[24px] border border-slate-200 overflow-hidden flex flex-col hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-200 transition-all duration-300 group"
            >
              {/* Cover Image */}
              <div className="h-48 relative overflow-hidden bg-slate-100">
                <img 
                  src={book.coverImage} 
                  alt={book.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                {book.isBestSeller && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                    Bestseller
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                    {book.category} Exam
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                  {language === 'english' ? book.title : book.titleTa}
                </h3>
                
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="flex items-center text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="text-xs font-bold text-slate-700 ml-1">{book.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">({book.reviews.toLocaleString()} reviews)</span>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-slate-900">₹{book.price}</span>
                    <span className="text-xs text-slate-400 line-through ml-2">₹{book.originalPrice}</span>
                  </div>
                  <button onClick={() => setSelectedBookForPurchase(book)} className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-md shadow-blue-500/20 active:scale-95">
                    <ShoppingCart className="h-4 w-4" />
                    {language === 'english' ? 'Buy' : 'வாங்கு'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      )}

      {/* Payment Modal */}
      <AnimatePresence>
        {selectedBookForPurchase && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative my-auto"
            >
              {/* Header */}
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900">{language === 'english' ? 'Complete Purchase' : 'கொள்முதல்'}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Secure UPI Payment</p>
                </div>
                <button
                  onClick={() => { setSelectedBookForPurchase(null); setPaymentStep('select'); setSelectedMethod(''); }}
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* Book Summary */}
                <div className="flex gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 mb-6">
                  <div className="w-16 h-20 bg-slate-200 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                    {selectedBookForPurchase.coverImage ? (
                       <img src={selectedBookForPurchase.coverImage} alt="cover" className="w-full h-full object-cover" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center bg-slate-100"><Book className="h-6 w-6 text-slate-300" /></div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="font-bold text-sm text-slate-900 line-clamp-2">{language === 'english' ? selectedBookForPurchase.title : selectedBookForPurchase.titleTa || selectedBookForPurchase.title}</h4>
                    <div className="mt-2 text-lg font-black text-blue-700">₹{selectedBookForPurchase.price}</div>
                  </div>
                </div>

                {paymentStep === 'select' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{language === 'english' ? 'Select Payment App' : 'பணம் செலுத்தும் முறை'}</h4>
                    
                    <button onClick={() => { setSelectedMethod('GPay'); setPaymentStep('processing'); setTimeout(() => setPaymentStep('success'), 2000); }} className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-[#1a73e8] hover:shadow-md transition-all group bg-white">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden p-2">
                          <svg viewBox="0 0 48 48" className="w-full h-full"><path fill="#4285F4" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.5 2 29.9 0 24 0 14.7 0 6.8 5.3 2.7 13l8 6.2C12.5 13.5 17.8 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.7-.2-3.3-.4-4.9H24v9.3h12.5c-.5 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.1 7.1-10.2 7.1-17.6z"/><path fill="#FBBC05" d="M10.7 28.8c-1-2.9-1-6 0-8.9l-8-6.2C.9 17.5 0 20.7 0 24c0 3.3.9 6.5 2.7 10.3l8-5.5z"/><path fill="#EA4335" d="M24 48c6 0 11.1-2 14.8-5.4l-7.7-6c-2 1.4-4.6 2.2-7.1 2.2-6.2 0-11.5-4.2-13.3-9.9l-8 5.5C6.8 42.7 14.7 48 24 48z"/></svg>
                        </div>
                        <span className="font-bold text-slate-700 group-hover:text-[#1a73e8] transition-colors">Google Pay</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-[#1a73e8] transition-colors" />
                    </button>

                    <button onClick={() => { setSelectedMethod('PhonePe'); setPaymentStep('processing'); setTimeout(() => setPaymentStep('success'), 2000); }} className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-[#5f259f] hover:shadow-md transition-all group bg-white">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden">
                          <div className="w-full h-full bg-[#5f259f] flex items-center justify-center text-white font-black text-xl leading-none">प</div>
                        </div>
                        <span className="font-bold text-slate-700 group-hover:text-[#5f259f] transition-colors">PhonePe</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-[#5f259f] transition-colors" />
                    </button>

                    <button onClick={() => { setSelectedMethod('Paytm'); setPaymentStep('processing'); setTimeout(() => setPaymentStep('success'), 2000); }} className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-[#00baf2] hover:shadow-md transition-all group bg-white">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 p-1">
                          <div className="text-[#002970] font-black tracking-tighter text-sm flex items-center">Pay<span className="text-[#00baf2]">tm</span></div>
                        </div>
                        <span className="font-bold text-slate-700 group-hover:text-[#002970] transition-colors">Paytm</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-[#00baf2] transition-colors" />
                    </button>

                    <button onClick={() => { setSelectedMethod('BHIM UPI'); setPaymentStep('processing'); setTimeout(() => setPaymentStep('success'), 2000); }} className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-md transition-all group bg-white">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                          <div className="flex flex-col items-center justify-center -space-y-1">
                            <span className="text-orange-500 font-black text-[10px]">BHIM</span>
                            <span className="text-green-600 font-bold text-[8px]">UPI</span>
                          </div>
                        </div>
                        <span className="font-bold text-slate-700 group-hover:text-orange-600 transition-colors">BHIM / Any UPI ID</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-orange-500 transition-colors" />
                    </button>

                    <button onClick={() => { setSelectedMethod('QR Scan'); setPaymentStep('processing'); setTimeout(() => setPaymentStep('success'), 2000); }} className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all group bg-white">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                          <QrCode className="h-5 w-5 text-emerald-600" />
                        </div>
                        <span className="font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">Scan QR Code</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                    </button>
                  </div>
                )}

                {paymentStep === 'processing' && (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-6" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Opening {selectedMethod}...</h3>
                    <p className="text-slate-500 text-sm max-w-[250px]">Please complete the payment in your UPI app. Do not close this window.</p>
                  </div>
                )}

                {paymentStep === 'success' && (
                  <div className="py-8 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Order Successful!</h3>
                    <p className="text-slate-500 text-sm mb-8">Thank you for your purchase. You can now access this book in your library.</p>
                    <button onClick={() => { setSelectedBookForPurchase(null); setPaymentStep('select'); setSelectedMethod(''); }} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm transition-colors">
                      Done
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
