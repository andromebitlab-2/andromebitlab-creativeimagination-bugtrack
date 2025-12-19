
import React, { useState, useEffect } from 'react';
import { User, Report, AppSettings } from './types';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { supabase } from './supabase';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState<'reports' | 'submit' | 'admin'>('reports');
  const [settings, setSettings] = useState<AppSettings>({
    logoUrl: 'https://raw.githubusercontent.com/AndromebitLab/CreativeImagination_WPF_Edition/refs/heads/main/CreativeImagination%20Logo.png',
    emphasisColor: '#6366f1'
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Sincronizar Favicon con el Logo
  useEffect(() => {
    const favicon = document.getElementById('favicon') as HTMLLinkElement;
    if (favicon) {
      favicon.href = settings.logoUrl;
    }
  }, [settings.logoUrl]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 1. Cargar Configuración
        const { data: settingsData, error: settingsError } = await supabase.from('settings').select('*').single();
        if (settingsData && !settingsError) {
          const newSettings = {
            logoUrl: settingsData.logo_url,
            emphasisColor: settingsData.emphasis_color
          };
          setSettings(newSettings);
          document.documentElement.style.setProperty('--emphasis-color', newSettings.emphasisColor);
        }

        // 2. Cargar Sesión
        const storedUser = localStorage.getItem('ci_user_v2');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            const { data: userData } = await supabase
              .from('users')
              .select('*')
              .eq('id', parsed.id)
              .single();
            
            if (userData) {
              setCurrentUser({
                id: userData.id,
                username: userData.username,
                userHex: userData.user_hex,
                submissionCount: userData.submission_count,
                isAdmin: userData.is_admin
              });
            }
          } catch (e) {
            localStorage.removeItem('ci_user_v2');
          }
        }

        // 3. Cargar Reportes
        const { data: reportData } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (reportData) {
          setReports(reportData.map(r => ({
            id: r.id,
            userId: r.user_id,
            username: r.username,
            version: r.version,
            type: r.type,
            description: r.description,
            mediaUrl: r.media_url,
            mediaType: r.media_type,
            reportCode: r.report_code,
            status: r.status || 'Pendiente',
            createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now()
          })));
        }
      } catch (err) {
        console.error("Error loading initial data:", err);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchInitialData();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('ci_user_v2', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ci_user_v2');
  };

  const addReport = async (report: Report) => {
    if (!currentUser) return;
    const { error } = await supabase.from('reports').insert({
      user_id: currentUser.id,
      username: currentUser.username,
      version: report.version,
      type: report.type,
      description: report.description,
      media_url: report.mediaUrl,
      media_type: report.mediaType,
      report_code: report.reportCode,
      status: 'Pendiente'
    });

    if (error) return alert("Error: " + error.message);

    const newCount = currentUser.submissionCount + 1;
    await supabase.from('users').update({ submission_count: newCount }).eq('id', currentUser.id);
    setCurrentUser({ ...currentUser, submissionCount: newCount });
    
    // Recargar reportes
    const { data } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
    if (data) {
      setReports(data.map(r => ({
        id: r.id,
        userId: r.user_id,
        username: r.username,
        version: r.version,
        type: r.type,
        description: r.description,
        mediaUrl: r.media_url,
        mediaType: r.media_type,
        reportCode: r.report_code,
        status: r.status || 'Pendiente',
        createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now()
      })));
    }
  };

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    const { error } = await supabase
      .from('reports')
      .update({ status: newStatus })
      .eq('id', reportId);

    if (error) return alert("Error al actualizar estado");

    setReports(reports.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
  };

  const updateSettings = async (newSettings: AppSettings) => {
    const { error } = await supabase
      .from('settings')
      .update({ 
        logo_url: newSettings.logoUrl, 
        emphasis_color: newSettings.emphasisColor 
      })
      .eq('id', 1);

    if (error) return alert("Error al actualizar ajustes");

    setSettings(newSettings);
    document.documentElement.style.setProperty('--emphasis-color', newSettings.emphasisColor);
  };

  const resetToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab('reports');
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emphasis border-t-transparent rounded-full animate-spin"></div>
        <div className="animate-pulse text-zinc-500 font-mono text-sm tracking-[0.3em]">INITIALIZING...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 flex flex-col">
      <nav className="border-b border-zinc-800/50 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-4 cursor-pointer group select-none" 
            onClick={resetToHome}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setActiveTab('reports')}
          >
            <img src={settings.logoUrl} alt="CreativeImagination" className="h-10 w-auto transition-transform group-hover:scale-105 pointer-events-none" />
            <div className="hidden md:block h-8 w-[1px] bg-zinc-800 mx-2" />
            <h1 className="hidden md:block text-sm font-bold tracking-widest text-zinc-400 uppercase group-hover:text-emphasis transition-colors">
              BugTrack Center
            </h1>
          </div>
          
          {currentUser && (
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-zinc-100">{currentUser.username}</span>
                <span className="text-[10px] font-mono text-emphasis">HEX: {currentUser.userHex}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-xs font-bold uppercase tracking-tighter bg-zinc-900 hover:bg-zinc-800 rounded transition-all border border-zinc-800 hover:border-zinc-700"
              >
                Salir
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-grow">
        {!currentUser ? (
          <Auth onLogin={handleLogin} logoUrl={settings.logoUrl} />
        ) : (
          <Dashboard 
            user={currentUser} 
            reports={reports} 
            settings={settings}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onAddReport={addReport} 
            onUpdateStatus={updateReportStatus}
            onUpdateSettings={updateSettings}
          />
        )}
      </main>

      <footer className="border-t border-zinc-900 bg-[#070708] py-8 px-4 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 text-xs">
          <p>© 2024 CreativeImagination WPF Edition - BugTrack System</p>
          <div className="flex gap-4">
            <a 
              href="https://andromebitlab.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded hover:border-emphasis hover:text-emphasis transition-all flex items-center gap-2 font-bold uppercase tracking-tight"
            >
              <span>Andromebit Lab</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
