import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logoImage from '../../assets/images/regenerated_image_1790577966199.jpg';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  CheckCircle2, 
  ChevronLeft, 
  ShieldCheck, 
  KeyRound, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface LoginScreenProps {
  onLogin?: () => void;
}

type AuthView = 'login' | 'signup' | 'forgot-password' | 'otp-verify' | 'reset-password';

interface UserAccount {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

const getStoredAccounts = (): UserAccount[] => {
  try {
    const saved = localStorage.getItem('agamakizh_accounts');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [
    {
      name: 'Alex Johnson',
      email: 'alex@example.com',
      mobile: '9876543210',
      password: 'password123'
    },
    {
      name: 'Alex Johnson',
      email: 'alex@company.com',
      mobile: '9876543210',
      password: 'password123'
    },
    {
      name: 'Candidate Student',
      email: 'student@agamakizh.com',
      mobile: '9840012345',
      password: 'password123'
    }
  ];
};

const saveAccount = (account: UserAccount) => {
  try {
    const accounts = getStoredAccounts();
    const filtered = accounts.filter(
      a => a.email.toLowerCase() !== account.email.toLowerCase() && a.mobile !== account.mobile
    );
    filtered.push(account);
    localStorage.setItem('agamakizh_accounts', JSON.stringify(filtered));
  } catch {}
};

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [view, setView] = useState<AuthView>('login');
  // Login identifier can be email OR 10-digit mobile number
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetMethod, setResetMethod] = useState<'email' | 'mobile'>('email');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);



  // Detect whether current login identifier looks like a phone number
  const cleanPhoneCandidate = identifier.replace(/[\s+-]/g, '');
  const isPhoneNumber = cleanPhoneCandidate.length > 0 && /^\d+$/.test(cleanPhoneCandidate);



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const newErrors: { [key: string]: string } = {};

    if (view === 'login') {
      const cleanId = identifier.trim();
      if (!cleanId) {
        newErrors.identifier = 'Please enter your Email or Mobile Number';
      } else if (/^[0-9+\s-]{6,15}$/.test(cleanId)) {
        const digits = cleanId.replace(/\D/g, '');
        if (digits.length < 10) {
          newErrors.identifier = 'Invalid mobile number. Mobile number must be 10 digits';
        }
      } else if (cleanId.includes('@')) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanId)) {
          newErrors.identifier = 'Invalid email address format (e.g. name@company.com)';
        }
      }

      if (!password) {
        newErrors.password = 'Please enter your password';
      }

      if (Object.keys(newErrors).length > 0) {
        setFieldErrors(newErrors);
        setErrorMessage(Object.values(newErrors)[0]);
        return;
      }

      // Check password against system saved accounts
      const cleanIdLower = cleanId.toLowerCase();
      const digitsOnly = cleanId.replace(/\D/g, '');
      const accounts = getStoredAccounts();

      const matchedAccount = accounts.find(acc => 
        acc.email.toLowerCase() === cleanIdLower ||
        (digitsOnly.length >= 10 && (acc.mobile === digitsOnly || acc.mobile.includes(digitsOnly))) ||
        acc.name.toLowerCase() === cleanIdLower
      );

      if (matchedAccount) {
        if (matchedAccount.password !== password) {
          newErrors.password = 'Invalid password: The characters you typed do not match what the system has saved for your account.';
          setFieldErrors(newErrors);
          setErrorMessage('Invalid password: The characters you typed do not match what the system has saved for your account.');
          return;
        }
      } else {
        // If not found in explicit saved accounts, check if password matches standard credentials or is invalid
        if (password.length < 6) {
          newErrors.password = 'Invalid password: The characters you typed do not match what the system has saved for your account.';
          setFieldErrors(newErrors);
          setErrorMessage('Invalid password: The characters you typed do not match what the system has saved for your account.');
          return;
        }
      }
    }

    if (view === 'signup') {
      const trimmedName = name.trim();
      if (!trimmedName) {
        newErrors.name = 'Please enter your Full Name';
      } else if (trimmedName.length < 2) {
        newErrors.name = 'Invalid name. Name must be at least 2 characters';
      } else if (/[0-9!@#$%^&*()_+={}\[\]:;"'<>?,/\\|]/.test(trimmedName)) {
        newErrors.name = 'Invalid name. Full name should only contain letters';
      }

      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        newErrors.email = 'Please enter your Email Address';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        newErrors.email = 'Invalid email address (e.g. name@company.com)';
      }

      const digits = mobileNumber.replace(/\D/g, '');
      if (!mobileNumber.trim()) {
        newErrors.mobile = 'Please enter your Mobile Number';
      } else if (digits.length !== 10) {
        newErrors.mobile = 'Invalid mobile number. Must be exactly 10 digits';
      }

      if (!password) {
        newErrors.password = 'Please create a password';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (Object.keys(newErrors).length > 0) {
        setFieldErrors(newErrors);
        setErrorMessage(Object.values(newErrors)[0]);
        return;
      }
    }

    if (view === 'forgot-password') {
      if (resetMethod === 'email') {
        const trimmedEmail = email.trim();
        if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
          newErrors.resetEmail = 'Please enter a valid email address to receive OTP';
        }
      } else {
        const digits = mobileNumber.replace(/\D/g, '');
        if (digits.length !== 10) {
          newErrors.resetMobile = 'Please enter a valid 10-digit mobile number to receive OTP';
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setFieldErrors(newErrors);
        setErrorMessage(Object.values(newErrors)[0]);
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setView('otp-verify');
      }, 1000);
      return;
    }

    if (view === 'otp-verify') {
      if (otp.trim().length !== 6) {
        setFieldErrors({ otp: 'Please enter the complete 6-digit OTP code' });
        setErrorMessage('Invalid OTP. Please enter 6-digit verification code');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setView('reset-password');
      }, 1000);
      return;
    }

    if (view === 'reset-password') {
      if (password.length < 6) {
        setFieldErrors({ newPassword: 'Password must be at least 6 characters' });
        setErrorMessage('Invalid password. Minimum 6 characters required');
        return;
      }
      if (password !== confirmPassword) {
        setFieldErrors({ confirmPassword: 'Passwords do not match' });
        setErrorMessage('Passwords do not match');
        return;
      }

      // Update password in stored accounts
      const accounts = getStoredAccounts();
      const targetId = (resetMethod === 'email' ? email : mobileNumber).trim().toLowerCase();
      const updatedAccounts = accounts.map(acc => {
        if (
          (resetMethod === 'email' && acc.email.toLowerCase() === targetId) ||
          (resetMethod === 'mobile' && acc.mobile.includes(targetId.replace(/\D/g, '')))
        ) {
          return { ...acc, password };
        }
        return acc;
      });
      localStorage.setItem('agamakizh_accounts', JSON.stringify(updatedAccounts));

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setView('login');
        setSuccessMessage('Password reset successfully! Please sign in with your new password.');
        setPassword('');
        setConfirmPassword('');
      }, 1000);
      return;
    }

    // Login or Signup process
    setIsLoading(true);
    setFieldErrors({});

    setTimeout(() => {
      setIsLoading(false);

      // Determine display profile
      let displayName = 'Alex Johnson';
      let displayMobile = '+91 9876543210';
      let displayEmail = 'alex@example.com';

      if (view === 'signup') {
        displayName = name.trim();
        displayEmail = email.trim();
        displayMobile = `+91 ${mobileNumber.trim().replace(/\D/g, '')}`;

        // Save new user account into persistent storage
        saveAccount({
          name: displayName,
          email: displayEmail.toLowerCase(),
          mobile: mobileNumber.trim().replace(/\D/g, ''),
          password: password
        });
      } else {
        const cleanId = identifier.trim();
        const accounts = getStoredAccounts();
        const matched = accounts.find(acc => 
          acc.email.toLowerCase() === cleanId.toLowerCase() ||
          acc.mobile === cleanId.replace(/\D/g, '') ||
          acc.name.toLowerCase() === cleanId.toLowerCase()
        );

        if (matched) {
          displayName = matched.name;
          displayEmail = matched.email;
          displayMobile = `+91 ${matched.mobile}`;
        } else if (/^[0-9+\s-]{6,15}$/.test(cleanId)) {
          const num = cleanId.replace(/\D/g, '');
          displayMobile = `+91 ${num}`;
          displayName = `Student ${num.slice(-4)}`;
          displayEmail = `student${num.slice(-4)}@agamakizh.com`;
        } else if (cleanId.includes('@')) {
          displayEmail = cleanId;
          const userPart = cleanId.split('@')[0];
          displayName = userPart.charAt(0).toUpperCase() + userPart.slice(1);
        } else {
          displayName = cleanId;
        }
      }

      // Store in localStorage for ExamDashboard
      localStorage.setItem('agamakizh_student_session', JSON.stringify({
        name: displayName,
        email: displayEmail,
        mobile: displayMobile,
        loginTime: Date.now()
      }));

      // Show welcome toast then navigate
      setShowWelcomeToast(true);
      setTimeout(() => {
        setShowWelcomeToast(false);
        if (onLogin) {
          onLogin();
        } else {
          alert(view === 'signup' ? 'Account created successfully!' : 'Signed in successfully!');
        }
      }, 2800);
    }, 1000);
  };

  const handleBackToLogin = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setView('login');
    setOtp('');
    setConfirmPassword('');
    setErrorMessage('');
    setFieldErrors({});
  };

  return (
    <div className="min-h-screen w-full flex bg-white relative overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative bg-gradient-to-br from-indigo-700 via-blue-700 to-blue-600 flex-col justify-between p-10 overflow-hidden shrink-0">

        {/* Decorative background lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 700" fill="none" preserveAspectRatio="xMidYMid slice">
          <rect x="-60" y="80" width="260" height="260" rx="40" stroke="white" strokeWidth="1.5" transform="rotate(-15 -60 80)" />
          <rect x="80" y="200" width="260" height="260" rx="40" stroke="white" strokeWidth="1.5" transform="rotate(-15 80 200)" />
          <rect x="160" y="380" width="260" height="260" rx="40" stroke="white" strokeWidth="1.5" transform="rotate(-15 160 380)" />
          <circle cx="320" cy="60" r="100" stroke="white" strokeWidth="1" />
          <circle cx="-20" cy="620" r="120" stroke="white" strokeWidth="1" />
        </svg>

        {/* Glow blobs */}
        <div className="absolute top-[-60px] left-[-60px] w-64 h-64 bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-60px] right-[-40px] w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl" />

        {/* Logo — top center */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center overflow-hidden border border-white/30 shadow-xl mb-3">
            <img src={logoImage} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <p className="text-white font-black text-xl leading-none tracking-tight">Agamakizh</p>
          <p className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">IAS Academy</p>
        </div>

        {/* Hero text — centered */}
        <div className="relative z-10 text-center">
          <h2 className="text-4xl font-black text-white leading-tight tracking-tight mb-4">
            Hello<br />Agamakizh<br />IAS Academy
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed max-w-xs mx-auto">
            Your personalized IAS exam preparation hub — study notes, mock tests, syllabus tracker &amp; live calendar plans.
          </p>

          {/* Feature badges */}
          <div className="mt-8 space-y-3 inline-block text-left">
            {[
              { icon: '📚', text: 'TNPSC · SSC · Railway · TRT · TET' },
              { icon: '🏆', text: 'Topic-wise Mock Tests & Score Tracking' },
              { icon: '📅', text: '2026 Study Plan Calendar' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center text-base shrink-0 border border-white/20">
                  {f.icon}
                </div>
                <span className="text-blue-100 text-xs font-semibold">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-blue-300/70 text-[11px] font-medium text-center">
          © {new Date().getFullYear()} Agamakizh IAS Academy. All rights reserved.
        </p>
      </div>

      {/* ── RIGHT PANEL (existing form) ── */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 relative overflow-hidden py-8 px-4">
        {/* Subtle blobs on form side */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-3xl opacity-50" />

      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[460px] px-5 sm:px-6 relative z-10"
      >
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 overflow-hidden">
          <div className="p-7 sm:p-9">
            {/* Branding */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/10 overflow-hidden border border-slate-100 mb-3">
                <img src={logoImage} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">Agamakizh</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 mt-1">IAS Academy</span>
            </div>

            {/* Header */}
            <div className="mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1.5">
                    {view === 'login' && 'Welcome back'}
                    {view === 'signup' && 'Create an account'}
                    {view === 'forgot-password' && 'Reset password'}
                    {view === 'otp-verify' && 'Verification'}
                    {view === 'reset-password' && 'Set new password'}
                  </h1>
                  <p className="text-slate-500 text-xs sm:text-sm">
                    {view === 'login' && 'Enter your credentials to access your dashboard.'}
                    {view === 'signup' && 'Sign up to access assessments, notes & test results.'}
                    {view === 'forgot-password' && 'Choose a method to recover your account access.'}
                    {view === 'otp-verify' && `Enter the 6-digit code sent to your ${resetMethod}.`}
                    {view === 'reset-password' && 'Create a strong password to secure your account.'}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Error / Success Notifications */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-start gap-2.5 shadow-sm"
              >
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{errorMessage}</div>
                <button
                  type="button"
                  onClick={() => setErrorMessage('')}
                  className="text-rose-400 hover:text-rose-600 transition-colors text-sm font-bold ml-1"
                >
                  ✕
                </button>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-start gap-2.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{successMessage}</div>
                <button
                  type="button"
                  onClick={() => setSuccessMessage('')}
                  className="text-emerald-500 hover:text-emerald-700 transition-colors text-sm font-bold ml-1"
                >
                  ✕
                </button>
              </motion.div>
            )}

            {/* Form with noValidate to prevent native browser tooltips */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <AnimatePresence mode="wait">
                {view === 'login' && (
                  <motion.div
                    key="login-fields"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Email or Mobile Number Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block ml-1" htmlFor="identifier">
                        Email or Mobile Number <span className="normal-case font-normal text-slate-400 text-[11px]">(மின்னஞ்சல் / கைபேசி எண்)</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          {isPhoneNumber ? (
                            <Phone className="h-4 w-4 text-blue-600 transition-colors" />
                          ) : (
                            <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                          )}
                        </div>
                        <input
                          id="identifier"
                          type="text"
                          inputMode="text"
                          autoComplete="username"
                          value={identifier}
                          onChange={(e) => {
                            setIdentifier(e.target.value);
                            if (errorMessage) setErrorMessage('');
                            if (fieldErrors.identifier) setFieldErrors(prev => ({ ...prev, identifier: '' }));
                          }}
                          className={`block w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                            fieldErrors.identifier
                              ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500'
                              : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                          }`}
                          placeholder="e.g. name@company.com or 9876543210"
                        />
                      </div>
                      {fieldErrors.identifier && (
                        <p className="text-rose-600 text-[11px] font-medium ml-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 inline shrink-0" />
                          {fieldErrors.identifier}
                        </p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between ml-1">
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block" htmlFor="password">
                          Password <span className="normal-case font-normal text-slate-400 text-[11px]">(கடவுச்சொல்)</span>
                        </label>
                        <button 
                          type="button"
                          onClick={() => {
                            setView('forgot-password');
                            setErrorMessage('');
                            setFieldErrors({});
                          }}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          Forgot?
                        </button>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errorMessage) setErrorMessage('');
                            if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                          }}
                          className={`block w-full pl-10 pr-12 py-3 bg-slate-50 border rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                            fieldErrors.password
                              ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500'
                              : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                          }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {fieldErrors.password && (
                        <p className="text-rose-600 text-[11px] font-medium ml-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 inline shrink-0" />
                          {fieldErrors.password}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {view === 'signup' && (
                  <motion.div
                    key="signup-fields"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Name Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block ml-1" htmlFor="name">
                        Full Name <span className="normal-case font-normal text-slate-400 text-[11px]">(முழுப் பெயர்)</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: '' }));
                          }}
                          className={`block w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                            fieldErrors.name
                              ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500'
                              : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                          }`}
                          placeholder="e.g. Alex Johnson"
                        />
                      </div>
                      {fieldErrors.name && (
                        <p className="text-rose-600 text-[11px] font-medium ml-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 inline shrink-0" />
                          {fieldErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block ml-1" htmlFor="signup-email">
                        Email Address <span className="normal-case font-normal text-slate-400 text-[11px]">(மின்னஞ்சல்)</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                          id="signup-email"
                          type="text"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                          }}
                          className={`block w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                            fieldErrors.email
                              ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500'
                              : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                          }`}
                          placeholder="student@gmail.com"
                        />
                      </div>
                      {fieldErrors.email && (
                        <p className="text-rose-600 text-[11px] font-medium ml-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 inline shrink-0" />
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>

                    {/* Mobile Number Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block ml-1" htmlFor="mobile">
                        Mobile Number <span className="normal-case font-normal text-slate-400 text-[11px]">(கைபேசி எண்)</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                          id="mobile"
                          type="tel"
                          maxLength={10}
                          value={mobileNumber}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setMobileNumber(val);
                            if (fieldErrors.mobile) setFieldErrors(prev => ({ ...prev, mobile: '' }));
                          }}
                          className={`block w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                            fieldErrors.mobile
                              ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500'
                              : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                          }`}
                          placeholder="10-digit mobile number (e.g. 9876543210)"
                        />
                      </div>
                      {fieldErrors.mobile && (
                        <p className="text-rose-600 text-[11px] font-medium ml-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 inline shrink-0" />
                          {fieldErrors.mobile}
                        </p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block ml-1" htmlFor="signup-password">
                        Password <span className="normal-case font-normal text-slate-400 text-[11px]">(கடவுச்சொல் - min 6 chars)</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                          }}
                          className={`block w-full pl-10 pr-12 py-3 bg-slate-50 border rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                            fieldErrors.password
                              ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500'
                              : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                          }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {fieldErrors.password && (
                        <p className="text-rose-600 text-[11px] font-medium ml-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 inline shrink-0" />
                          {fieldErrors.password}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {view === 'forgot-password' && (
                  <motion.div
                    key="forgot-password-fields"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => { setResetMethod('email'); setErrorMessage(''); setFieldErrors({}); }}
                        className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 transition-all ${
                          resetMethod === 'email' 
                            ? 'border-blue-600 bg-blue-50/50 text-blue-700' 
                            : 'border-slate-100 text-slate-500 hover:border-slate-200'
                        }`}
                      >
                        <Mail className={`h-5 w-5 ${resetMethod === 'email' ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold uppercase tracking-tight">Email OTP</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setResetMethod('mobile'); setErrorMessage(''); setFieldErrors({}); }}
                        className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 transition-all ${
                          resetMethod === 'mobile' 
                            ? 'border-blue-600 bg-blue-50/50 text-blue-700' 
                            : 'border-slate-100 text-slate-500 hover:border-slate-200'
                        }`}
                      >
                        <Phone className={`h-5 w-5 ${resetMethod === 'mobile' ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold uppercase tracking-tight">Mobile OTP</span>
                      </button>
                    </div>

                    {resetMethod === 'email' ? (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block ml-1" htmlFor="email-reset">
                          Email Address
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                          </div>
                          <input
                            id="email-reset"
                            type="text"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (fieldErrors.resetEmail) setFieldErrors(prev => ({ ...prev, resetEmail: '' }));
                            }}
                            className={`block w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                              fieldErrors.resetEmail
                                ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500'
                                : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                            }`}
                            placeholder="name@company.com"
                          />
                        </div>
                        {fieldErrors.resetEmail && (
                          <p className="text-rose-600 text-[11px] font-medium ml-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 inline shrink-0" />
                            {fieldErrors.resetEmail}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block ml-1" htmlFor="mobile-reset">
                          Mobile Number
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Phone className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                          </div>
                          <input
                            id="mobile-reset"
                            type="tel"
                            maxLength={10}
                            value={mobileNumber}
                            onChange={(e) => {
                              setMobileNumber(e.target.value.replace(/\D/g, ''));
                              if (fieldErrors.resetMobile) setFieldErrors(prev => ({ ...prev, resetMobile: '' }));
                            }}
                            className={`block w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                              fieldErrors.resetMobile
                                ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500'
                                : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                            }`}
                            placeholder="10-digit mobile number"
                          />
                        </div>
                        {fieldErrors.resetMobile && (
                          <p className="text-rose-600 text-[11px] font-medium ml-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 inline shrink-0" />
                            {fieldErrors.resetMobile}
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {view === 'otp-verify' && (
                  <motion.div
                    key="otp-fields"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                        <ShieldCheck className="h-7 w-7 text-blue-600" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block text-center" htmlFor="otp">
                        One-Time Password (6 Digits)
                      </label>
                      <input
                        id="otp"
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value.replace(/\D/g, ''));
                          if (fieldErrors.otp) setFieldErrors(prev => ({ ...prev, otp: '' }));
                        }}
                        className={`block w-full px-4 py-3.5 bg-slate-50 border rounded-xl text-slate-900 text-2xl font-bold tracking-[0.5em] text-center placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all ${
                          fieldErrors.otp
                            ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500'
                            : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                        }`}
                        placeholder="000000"
                      />
                      {fieldErrors.otp && (
                        <p className="text-rose-600 text-[11px] font-medium text-center flex items-center justify-center gap-1">
                          <AlertCircle className="w-3 h-3 inline shrink-0" />
                          {fieldErrors.otp}
                        </p>
                      )}
                    </div>
                    <p className="text-center text-xs text-slate-500">
                      Didn't receive code?{' '}
                      <button type="button" onClick={() => alert('Verification code resent!')} className="font-semibold text-blue-600 hover:text-blue-700">Resend Code</button>
                    </p>
                  </motion.div>
                )}

                {view === 'reset-password' && (
                  <motion.div
                    key="reset-password-fields"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                        <KeyRound className="h-7 w-7 text-blue-600" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block ml-1" htmlFor="new-password">
                        New Password (min 6 chars)
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                          id="new-password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (fieldErrors.newPassword) setFieldErrors(prev => ({ ...prev, newPassword: '' }));
                          }}
                          className={`block w-full pl-10 pr-12 py-3 bg-slate-50 border rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                            fieldErrors.newPassword
                              ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500'
                              : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                          }`}
                          placeholder="••••••••"
                        />
                      </div>
                      {fieldErrors.newPassword && (
                        <p className="text-rose-600 text-[11px] font-medium ml-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 inline shrink-0" />
                          {fieldErrors.newPassword}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block ml-1" htmlFor="confirm-new-password">
                        Confirm New Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                          id="confirm-new-password"
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
                          }}
                          className={`block w-full pl-10 pr-12 py-3 bg-slate-50 border rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                            fieldErrors.confirmPassword
                              ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-500/20 focus:border-rose-500'
                              : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                          }`}
                          placeholder="••••••••"
                        />
                      </div>
                      {fieldErrors.confirmPassword && (
                        <p className="text-rose-600 text-[11px] font-medium ml-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 inline shrink-0" />
                          {fieldErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full mt-2 overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl py-3.5 text-sm font-semibold focus:ring-4 focus:ring-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed group shadow-md shadow-blue-500/25 active:scale-[0.98]"
              >
                {/* Shimmer sweep on loading */}
                {isLoading && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.2s_infinite]" style={{ animationName: 'shimmer', animationDuration: '1.2s', animationIterationCount: 'infinite', animationTimingFunction: 'linear' }} />
                )}
                {isLoading ? (
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold">Signing in</span>
                    <span className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </span>
                  </span>
                ) : (
                  <>
                    {view === 'login' && 'Sign in'}
                    {view === 'signup' && 'Create account'}
                    {view === 'forgot-password' && 'Send OTP'}
                    {view === 'otp-verify' && 'Verify & Continue'}
                    {view === 'reset-password' && 'Update Password'}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>

              {view !== 'login' && view !== 'signup' && (
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors py-2 flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="h-3 w-3" />
                  Back to Sign In
                </button>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="px-7 sm:px-9 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-center">
            <p className="text-xs text-slate-500">
              {view === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                type="button"
                onClick={() => {
                  setView(view === 'signup' ? 'login' : 'signup');
                  setErrorMessage('');
                  setFieldErrors({});
                }}
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors ml-1"
              >
                {view === 'signup' ? 'Sign in' : 'Create an account'}
              </button>
            </p>
          </div>
        </div>


      </motion.div>


      </div>{/* end right panel */}

      {/* ── WELCOME TOAST OVERLAY ── */}
      <AnimatePresence>
        {showWelcomeToast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-100 overflow-hidden relative"
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-t-3xl" />

              {/* Header */}
              <div className="flex flex-col items-center text-center mb-5 mt-1">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-3">
                  <span className="text-2xl">🎉</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Welcome to Agamakizh!</h3>
                <p className="text-xs text-slate-500 mt-1">Notifications sent to your registered contact</p>
              </div>

              {/* Email notification card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-3.5 mb-3"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Email Sent ✓</p>
                    <span className="text-[10px] text-blue-400">just now</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    Hello Agamakizh IAS Academy 🎓<br />
                    <span className="text-slate-600 font-normal">TNPSC · SSC · Railway Free Class — Happy Learning! 🚀</span>
                  </p>
                </div>
              </motion.div>

              {/* WhatsApp notification card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-3.5"
              >
                <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.135 1.528 5.88L.057 24l6.276-1.643A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.799 9.799 0 01-5.001-1.374l-.358-.213-3.724.976.994-3.63-.234-.374A9.8 9.8 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">WhatsApp Sent ✓✓</p>
                    <span className="text-[10px] text-emerald-400">just now</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    Hello Agamakizh IAS Academy 🎓<br />
                    <span className="text-slate-600 font-normal">TNPSC · SSC · Railway Free Class — Happy Learning! 🚀</span>
                  </p>
                </div>
              </motion.div>

              {/* Progress bar */}
              <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.8, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                />
              </div>
              <p className="text-center text-[10px] text-slate-400 mt-2">Opening your dashboard…</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

