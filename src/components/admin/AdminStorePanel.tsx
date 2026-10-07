import React, { useState, useEffect } from 'react';
import { Book, Plus, Trash2, Edit3, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';

interface StoreBook {
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

export default function AdminStorePanel() {
  const [books, setBooks] = useState<StoreBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<StoreBook, 'id'>>({
    title: '',
    titleTa: '',
    category: 'TNPSC',
    price: 0,
    originalPrice: 0,
    rating: 4.5,
    reviews: 0,
    coverImage: '',
    isBestSeller: false
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setIsLoading(true);
    const local = JSON.parse(localStorage.getItem('agamakizh_store_books') || '[]');
    try {
      const snap = await getDocs(collection(db, 'storeBooks'));
      const remote = snap.docs.map(d => ({ id: d.id, ...d.data() } as StoreBook));
      const list = remote.length > 0 ? remote : local;
      setBooks(list);
      localStorage.setItem('agamakizh_store_books', JSON.stringify(list));
    } catch (e) {
      setBooks(local);
    }
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await setDoc(doc(db, 'storeBooks', editingId), form);
      } else {
        await addDoc(collection(db, 'storeBooks'), form);
      }
      setSuccessMessage('Book saved successfully!');
    } catch (e) {
      console.warn('Firebase save failed, falling back to local storage', e);
      const localBooks = JSON.parse(localStorage.getItem('agamakizh_store_books') || '[]');
      if (editingId) {
        const updated = localBooks.map((b: any) => b.id === editingId ? { id: editingId, ...form } : b);
        localStorage.setItem('agamakizh_store_books', JSON.stringify(updated));
      } else {
        const newBook = { id: 'book_' + Date.now(), ...form };
        localStorage.setItem('agamakizh_store_books', JSON.stringify([...localBooks, newBook]));
      }
      setSuccessMessage('Book saved locally!');
    }
    setEditingId(null);
    setForm({
      title: '', titleTa: '', category: 'TNPSC', price: 0, originalPrice: 0,
      rating: 4.5, reviews: 0, coverImage: '', isBestSeller: false
    });
    fetchBooks();
    setIsSaving(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEdit = (book: StoreBook) => {
    setEditingId(book.id);
    setForm({
      title: book.title,
      titleTa: book.titleTa || '',
      category: book.category,
      price: book.price,
      originalPrice: book.originalPrice,
      rating: book.rating || 4.5,
      reviews: book.reviews || 0,
      coverImage: book.coverImage || '',
      isBestSeller: book.isBestSeller || false
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await deleteDoc(doc(db, 'storeBooks', id));
    } catch (e) {
      console.warn('Firebase delete failed, falling back to local storage', e);
      const localBooks = JSON.parse(localStorage.getItem('agamakizh_store_books') || '[]');
      const updated = localBooks.filter((b: any) => b.id !== id);
      localStorage.setItem('agamakizh_store_books', JSON.stringify(updated));
    }
    fetchBooks();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-4">
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm sticky top-8 flex flex-col max-h-[calc(100vh-4rem)] -mt-[42px]">
          <div className="p-6 sm:p-8 pb-4 sm:pb-6 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                {editingId ? <Edit3 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Book' : 'Add New Book'}</h3>
                <p className="text-xs text-slate-500">Fill details to {editingId ? 'update' : 'publish'} the book</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 pt-4 sm:pt-6 overflow-y-auto flex-1">
            <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Book Title (English)</label>
              <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. TNPSC Master Guide" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Book Title (Tamil)</label>
              <input type="text" value={form.titleTa} onChange={e => setForm({...form, titleTa: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. TNPSC முழுமையான வழிகாட்டி" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value as any})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="TNPSC">TNPSC</option>
                  <option value="SSC">SSC</option>
                  <option value="Railway">Railway</option>
                  <option value="All">All Exams</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Bestseller?</label>
                <div className="flex items-center h-[46px]">
                  <input type="checkbox" checked={form.isBestSeller} onChange={e => setForm({...form, isBestSeller: e.target.checked})} className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-slate-600">Yes</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Sale Price (₹)</label>
                <input required type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Original Price (₹)</label>
                <input required type="number" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Cover Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input type="url" value={form.coverImage} onChange={e => setForm({...form, coverImage: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://..." />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm({title: '', titleTa: '', category: 'TNPSC', price: 0, originalPrice: 0, rating: 4.5, reviews: 0, coverImage: '', isBestSeller: false}); }} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
              )}
              <button disabled={isSaving} type="submit" className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editingId ? 'Update Book' : 'Add Book'}
              </button>
            </div>
            </form>

            {successMessage && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-sm font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {successMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="lg:col-span-8">
        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Book className="h-6 w-6 text-blue-600" />
                Published Store Books
              </h3>
              <p className="text-sm text-slate-500 mt-1">Manage books available for purchase across website and mobile app.</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-2xl font-black text-slate-900">{books.length}</span>
              <span className="text-xs font-bold text-slate-400 uppercase ml-2">Total</span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                <p>Loading books from database...</p>
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Book className="h-8 w-8 text-slate-300" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">No books found</h4>
                <p className="text-slate-500 text-sm mt-1">Add your first book using the form.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {books.map(book => (
                  <div key={book.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 hover:border-blue-300 hover:shadow-lg transition-all group">
                    <div className="w-24 h-32 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {book.category}
                        </span>
                        {book.isBestSeller && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
                            Bestseller
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {book.title}
                      </h4>
                      <div className="mt-auto pt-3 flex items-center justify-between">
                        <div>
                          <span className="font-black text-slate-900">₹{book.price}</span>
                          <span className="text-xs text-slate-400 line-through ml-1.5">₹{book.originalPrice}</span>
                        </div>
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(book)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(book.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
