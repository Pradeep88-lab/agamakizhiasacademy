/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import LoginScreen from './components/auth/LoginScreen';
import ExamDashboard from './components/dashboard/ExamDashboard';
import AdminLogin from './components/admin/AdminLogin';
import AdminPanel from './components/admin/AdminPanel';
import FloatingContact from './components/common/FloatingContact';

type View = 'login' | 'dashboard' | 'admin-login' | 'admin-panel';

export default function App() {
  const [view, setView] = useState<View>('login');

  useEffect(() => {
    // Basic route detection that works locally and on GitHub Pages
    const path = window.location.pathname;
    if (path === '/admin' || path === '/agamakizhiasacademy/admin' || path.endsWith('/admin')) {
      setView('admin-login');
    }
  }, []);

  return (
    <div className="antialiased font-sans text-slate-900">
      {view === 'login' && <LoginScreen onLogin={() => setView('dashboard')} />}
      {view === 'dashboard' && <ExamDashboard onLogout={() => setView('login')} />}
      {view === 'admin-login' && <AdminLogin onLogin={() => setView('admin-panel')} />}
      {view === 'admin-panel' && <AdminPanel onLogout={() => setView('admin-login')} />}

      <FloatingContact
        email="support@agamakizh.example.com"
        whatsappNumber="+919791434639"
      />
    </div>
  );
}
