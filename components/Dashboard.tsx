
import React from 'react';
import { User, Report, AppSettings } from '../types';
import IssueForm from './IssueForm';
import IssueList from './IssueList';
import AdminSettings from './AdminSettings';

interface DashboardProps {
  user: User;
  reports: Report[];
  settings: AppSettings;
  activeTab: 'reports' | 'submit' | 'admin';
  setActiveTab: (tab: 'reports' | 'submit' | 'admin') => void;
  onAddReport: (report: Report) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onUpdateSettings: (settings: AppSettings) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  reports, 
  settings, 
  activeTab,
  setActiveTab,
  onAddReport, 
  onUpdateStatus, 
  onUpdateSettings 
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <aside className="w-full md:w-64 space-y-2 sticky top-28">
          <button 
            onClick={() => setActiveTab('reports')}
            className={`w-full text-left px-6 py-4 rounded-xl font-bold flex items-center justify-between transition-all border ${
              activeTab === 'reports' ? 'bg-emphasis/10 border-emphasis text-emphasis' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
            }`}
          >
            Reportes Públicos
            <span className="bg-zinc-800 text-[10px] px-2 py-0.5 rounded-full border border-zinc-700">{reports.length}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('submit')}
            className={`w-full text-left px-6 py-4 rounded-xl font-bold flex items-center justify-between transition-all border ${
              activeTab === 'submit' ? 'bg-emphasis/10 border-emphasis text-emphasis' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
            }`}
          >
            Nuevo Reporte
            <span className="w-2 h-2 bg-emphasis rounded-full animate-pulse shadow-[0_0_8px_var(--emphasis-color)]"></span>
          </button>

          {user.isAdmin && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={`w-full text-left px-6 py-4 rounded-xl font-bold flex items-center justify-between transition-all border ${
                activeTab === 'admin' ? 'bg-purple-600/10 border-purple-500 text-purple-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
              }`}
            >
              Configuración Admin
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          )}

          <div className="mt-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Tu Actividad</h3>
            <div className="flex items-center gap-2">
              <div className="flex-grow h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emphasis" style={{ width: `${Math.min(user.submissionCount * 10, 100)}%` }} />
              </div>
              <span className="text-xs font-bold text-emphasis font-mono">{user.submissionCount}</span>
            </div>
          </div>
        </aside>

        <div className="flex-grow w-full">
          {activeTab === 'submit' && (
            <IssueForm user={user} onSubmit={(report) => { onAddReport(report); setActiveTab('reports'); }} />
          )}
          {activeTab === 'reports' && (
            <IssueList reports={reports} isAdmin={user.isAdmin} onUpdateStatus={onUpdateStatus} />
          )}
          {activeTab === 'admin' && user.isAdmin && (
            <AdminSettings settings={settings} onSave={onUpdateSettings} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
