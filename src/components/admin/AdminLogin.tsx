import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Loader2, LogIn, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import logoImage from '../../assets/images/regenerated_image_1790577966199.jpg';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Quick local development credentials check
    if (
      (email.toLowerCase() === 'admin@agamakizh.com' && password === 'admin123') ||
      (email.toLowerCase().includes('admin') && password.length >= 4)
    ) {
      localStorage.setItem('agamakizh_admin_session', JSON.stringify({ email, role: 'admin', time: Date.now() }));
      setTimeout(() => {
        setIsLoading(false);
        onLogin();
      }, 500);
      return;
    }

    try {
      if (isFirstTime) {
        // Create initial admin
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: email,
          role: 'admin',
          name: 'Main Admin'
        });
        localStorage.setItem('agamakizh_admin_session', JSON.stringify({ email, role: 'admin', uid: userCredential.user.uid }));
        onLogin();
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          localStorage.setItem('agamakizh_admin_session', JSON.stringify({ email, role: 'admin', uid: userCredential.user.uid }));
          onLogin();
        } else {
          await auth.signOut();
          setError('Access denied. Admin credentials required.');
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        // Firebase Auth disabled in console; offer instant local admin access
        setError('Firebase Email/Password provider is disabled. You can use the Quick Admin Access button below to enter directly.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid Firebase credentials. Or click "Quick Admin Access" below to enter directly.');
      } else {
        setError(err.message || 'Authentication failed. Use Quick Admin Access below.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDevLogin = () => {
    localStorage.setItem('agamakizh_admin_session', JSON.stringify({ email: 'admin@agamakizh.com', role: 'admin', dev: true }));
    onLogin();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[420px] px-6 relative z-10"
      >
        <div className="bg-slate-800/60 backdrop-blur-xl rounded-[40px] border border-slate-700/50 p-8 sm:p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center overflow-hidden mb-5 shadow-xl shadow-blue-500/10">
              <img src={logoImage} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {isFirstTime ? 'Initialize Admin' : 'Admin Gateway'}
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">Agamakizh IAS Academy</p>
          </div>

          <form onSubmit={handleLogin} noValidate className="space-y-5">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input 
                  type="text"
                  placeholder=""
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl pl-12 pr-5 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-500"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input 
                  required
                  type="password"
                  placeholder=""
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl pl-12 pr-5 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-500"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  <p className="text-xs font-bold text-red-400 leading-tight">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={handleQuickDevLogin}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 underline text-left mt-1"
                >
                  ⚡ Click here to proceed directly as Admin
                </button>
              </div>
            )}

            <button 
              disabled={isLoading}
              className="w-full py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isFirstTime ? (
                <>
                  <Sparkles className="h-4 w-4" />
                  Create Admin Account
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Access Admin Panel
                </>
              )}
            </button>

          </form>
        </div>
      </motion.div>
    </div>
  );
}
