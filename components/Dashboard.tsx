import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { User, Report } from '../types';

interface DashboardProps {
  user: User;
  reports: Report[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, reports }) => {
  const getLinkClassName = (isActive: boolean, isAdminLink: boolean = false) => {
    const baseClasses = 'w-full text-left px-6 py-4 rounded-xl font-bold flex items-center justify-between border';
    let activeClasses, inactiveClasses;

    if (isAdminLink) {
        activeClasses = 'bg-purple-600/10 border-purple-500 text-purple-400';
        inactiveClasses = 'bg-zinc-900 border-zinc-800 text-zinc-500';
    } else {
        activeClasses = 'bg-emphasis/10 border-emphasis text-emphasis';
        inactiveClasses = 'bg-zinc-900 border-zinc-800 text-zinc-500';
    }
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <aside className="w-full md:w-64 space-y-2 sticky top-28">
          <NavLink to="/" end className={({ isActive }) => getLinkClassName(isActive)}>
            Foro de Reportes
            <span className="bg-zinc-800 text-[10px] px-2 py-0.5 rounded-full border border-zinc-700">{reports.length}</span>
          </NavLink>
          <NavLink to="/submit" className={({ isActive }) => getLinkClassName(isActive)}>
            Nuevo Reporte
            <span className="w-2 h-2 bg-emphasis rounded-full animate-pulse"></span>
          </NavLink>
          {user.isAdmin && (
            <NavLink to="/admin" end className={({ isActive }) => getLinkClassName(isActive, true)}>
              Configuración Admin
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </NavLink>
          )}
        </aside>

        <div className="flex-grow w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;