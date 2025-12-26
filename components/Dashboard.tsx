
import React from 'react';
import { User, Report, AppSettings, GameVersion } from '../types';
import IssueForm from './IssueForm';
import IssueList from './IssueList';
import AdminSettings from './AdminSettings';

interface DashboardProps {
  user: User;
  reports: Report[];
  versions: GameVersion[];
  settings: AppSettings;
  activeTab: 'reports' | 'submit' | 'admin';
  setActiveTab: (tab: 'reports' | 'submit' | 'admin') => void;
  onAddReport: (report: Report) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onUpdateSettings: (settings: AppSettings) => void;
  onManageVersions: { add: (v: string) => void; remove: (v: string) => void; };
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, reports, versions, settings, activeTab, setActiveTab, 
  onAddReport, onUpdateStatus, onUpdateSettings, onManageVersions 
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <aside className="w-full md:w-64 space-y-2 sticky top-28">
          <button onClick={() => setActiveTab('reports')} className={`w-full text-left px-6 py-4 rounded-xl font-bold flex items-center justify-between border ${activeTab === 'reports' ? 'bg-emphasis/10 border-emphasis text-emphasis' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
            Reportes Públicos
            <span className="bg-zinc-800 text-[10px] px-2 py-0.5 rounded-full border border-zinc-700">{reports.length}</span>
          </button>
          <button onClick={() => setActiveTab('submit')} className={`w-full text-left px-6 py-4 rounded-xl font-bold flex items-center justify-between border ${activeTab === 'submit' ? 'bg-emphasis/10 border-emphasis text-emphasis' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
            Nuevo Reporte
            <span className="w-2 h-2 bg-emphasis rounded-full animate-pulse"></span>
          </button>
          {user.isAdmin && (
            <button onClick={() => setActiveTab('admin')} className={`w-full text-left px-6 py-4 rounded-xl font-bold flex items-center justify-between border ${activeTab === 'admin' ? 'bg-purple-600/10 border-purple-500 text-purple-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
              Configuración Admin
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          )}
        </aside>

        <div className="flex-grow w-full">
          {activeTab === 'submit' && (
            <IssueForm user={user} versions={versions} onSubmit={(report) => { onAddReport(report); setActiveTab('reports'); }} />
          )}
          {activeTab === 'reports' && (
            <IssueList reports={reports} isAdmin={user.isAdmin} onUpdateStatus={onUpdateStatus} />
          )}
          {activeTab === 'admin' && user.isAdmin && (
            <AdminSettings settings={settings} versions={versions} onSave={onUpdateSettings} onManageVersions={onManageVersions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
