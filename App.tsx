
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { User, Report, AppSettings, GameVersion } from './types';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import IssueForm from './components/IssueForm';
import IssueList from './components/IssueList';
import AdminSettings from './components/AdminSettings';
import { supabase } from './supabase';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [versions, setVersions] = useState<GameVersion[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    logoUrl: 'https://raw.githubusercontent.com/AndromebitLab/CreativeImagination_WPF_Edition/refs/heads/main/CreativeImagination%20Logo.png',
    emphasisColor: '#6366f1'
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const favicon = document.getElementById('favicon') as HTMLLinkElement;
    if (favicon) {
      favicon.href = settings.logoUrl;
    }
  }, [settings.logoUrl]);

  const fetchVersions = async () => {
    const { data, error } = await supabase.from('game_versions').select('version').order('version', { ascending: false });
    if (!error && data) {
      setVersions(data.map(v => v.version));
    }
  };

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
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

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data: settingsData } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
        if (settingsData) {
          const newSettings = { logoUrl: settingsData.logo_url, emphasisColor: settingsData.emphasis_color };
          setSettings(newSettings);
          document.documentElement.style.setProperty('--emphasis-color', newSettings.emphasisColor);
        }

        const storedUser = localStorage.getItem('ci_user_v2');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            const { data: userData } = await supabase.from('users').select('*').eq('id', parsed.id).single();
            if (userData) {
              setCurrentUser({
                id: userData.id,
                username: userData.username,
                userHex: userData.user_hex,
                submissionCount: userData.submission_count,
                isAdmin: userData.is_admin
              });
            }
          } catch (e) { localStorage.removeItem('ci_user_v2'); }
        }

        await Promise.all([fetchReports(), fetchVersions()]);
      } catch (err) {
        console.error("Initial load error:", err);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchInitialData();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('ci_user_v2', JSON.stringify(user));
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ci_user_v2');
    navigate('/login');
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

    if (error) return alert(`Error: ${error.message}`);

    const newCount = currentUser.submissionCount + 1;
    await supabase.from('users').update({ submission_count: newCount }).eq('id', currentUser.id);
    setCurrentUser({ ...currentUser, submissionCount: newCount });
    await fetchReports();
  };

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    const { error } = await supabase.from('reports').update({ status: newStatus }).eq('id', reportId);
    if (error) return alert("Error al actualizar estado");
    setReports(reports.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
  };

  const updateSettings = async (newSettings: AppSettings) => {
    const { error } = await supabase.from('settings').upsert({ 
      id: 1, logo_url: newSettings.logoUrl, emphasis_color: newSettings.emphasisColor 
    });
    if (error) return alert("Error al guardar ajustes");
    setSettings(newSettings);
    document.documentElement.style.setProperty('--emphasis-color', newSettings.emphasisColor);
    alert("Configuración guardada.");
  };

  const manageVersions = {
    add: async (v: string) => {
      const { error } = await supabase.from('game_versions').insert({ version: v });
      if (error) return alert("Error al añadir versión");
      await fetchVersions();
    },
    remove: async (v: string) => {
      const { error } = await supabase.from('game_versions').delete().eq('version', v);
      if (error) return alert("Error al eliminar versión");
      await fetchVersions();
    }
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emphasis border-t-transparent rounded-full animate-spin"></div>
        <div className="animate-pulse text-zinc-500 font-mono text-sm tracking-[0.3em]">INITIALIZING...</div>
      </div>
    </div>
  );

  const ProtectedLayout = () => (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 flex flex-col">
      <nav className="border-b border-zinc-800/50 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 cursor-pointer group">
            <img src={settings.logoUrl} alt="Logo" className="h-10 w-auto" />
            <h1 className="hidden md:block text-sm font-bold tracking-widest text-zinc-400 uppercase group-hover:text-emphasis transition-colors">
              BugTrack Center
            </h1>
          </Link>
          {currentUser && (
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold">{currentUser.username}</span>
                <span className="text-[10px] font-mono text-emphasis">HEX: {currentUser.userHex}</span>
              </div>
              <button onClick={handleLogout} className="px-4 py-2 text-xs font-bold uppercase bg-zinc-900 border border-zinc-800 rounded hover:border-zinc-700">Salir</button>
            </div>
          )}
        </div>
      </nav>
      <main className="flex-grow">
        <Dashboard user={currentUser} reports={reports} />
      </main>
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={!currentUser ? <Auth isRegistering={false} onLogin={handleLogin} logoUrl={settings.logoUrl} /> : <Navigate to="/" />} />
      <Route path="/register" element={!currentUser ? <Auth isRegistering={true} onLogin={handleLogin} logoUrl={settings.logoUrl} /> : <Navigate to="/" />} />
      
      <Route element={!currentUser ? <Navigate to="/login" state={{ from: location }} /> : <ProtectedLayout />}>
        <Route index element={<IssueList reports={reports} isAdmin={currentUser?.isAdmin || false} onUpdateStatus={updateReportStatus} />} />
        <Route path="submit" element={<IssueForm user={currentUser!} versions={versions} onSubmit={(report) => { addReport(report); navigate('/'); }} />} />
        <Route path="admin" element={currentUser?.isAdmin ? <AdminSettings settings={settings} versions={versions} onSave={updateSettings} onManageVersions={manageVersions} /> : <Navigate to="/" />} />
      </Route>

      <Route path="*" element={<Navigate to={currentUser ? "/" : "/login"} />} />
    </Routes>
  );
};

export default App;
