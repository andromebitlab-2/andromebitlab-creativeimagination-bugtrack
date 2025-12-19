
import React, { useState } from 'react';
import { Report, IssueType } from '../types';
import { ISSUE_TYPES } from '../constants';

interface IssueListProps {
  reports: Report[];
  isAdmin: boolean;
  onUpdateStatus: (id: string, status: string) => void;
}

const IssueList: React.FC<IssueListProps> = ({ reports, isAdmin, onUpdateStatus }) => {
  const [filter, setFilter] = useState<IssueType | 'Todos'>('Todos');

  const getStatusOptions = (type: IssueType) => {
    switch (type) {
      case 'Bug':
      case 'Error crítico':
        return ['Pendiente', 'En revisión', 'Error Solucionado', 'Bug Solucionado', 'No reproducible'];
      case 'Propuesta':
        return ['Pendiente', 'Propuesta Aceptada', 'Propuesta Rechazada', 'En revisión'];
      case 'Sugerencia':
        return ['Pendiente', 'Sugerencia en revisión', 'Aceptada', 'Rechazada'];
      default:
        return ['Pendiente', 'Comentario Leído', 'En revisión'];
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes('Solucionado') || status.includes('Aceptada') || status.includes('Leído')) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (status.includes('Rechazada')) return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (status.includes('revisión')) return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
  };

  const filteredReports = filter === 'Todos' ? reports : reports.filter(r => r.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mr-2">Filtrar:</span>
        <button onClick={() => setFilter('Todos')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${filter === 'Todos' ? 'bg-zinc-100 text-zinc-900 border-zinc-100' : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-700'}`}>Todos</button>
        {ISSUE_TYPES.map(type => (
          <button key={type} onClick={() => setFilter(type)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${filter === type ? 'bg-emphasis text-white border-emphasis shadow-lg shadow-emphasis/20' : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-700'}`}>{type}</button>
        ))}
      </div>

      {filteredReports.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-20 text-center text-zinc-500">No hay reportes.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredReports.map(report => (
            <div key={report.id} className="bg-[#111113] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl hover:border-zinc-700 transition-all">
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emphasis/20 flex items-center justify-center border border-emphasis/30 text-emphasis font-bold">
                      {report.username[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-100">{report.username}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold">
                        <span>Ver. {report.version}</span>
                        <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                        <span className="font-mono text-emphasis">{report.reportCode}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${
                        report.type === 'Bug' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                        report.type === 'Error crítico' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
                        'bg-zinc-500/10 border-zinc-500/30 text-zinc-400'
                      }`}>
                        {report.type}
                      </span>
                      <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>

                    {isAdmin && (
                      <div className="mt-2">
                        <select 
                          value={report.status}
                          onChange={(e) => onUpdateStatus(report.id, e.target.value)}
                          className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-[10px] font-bold text-zinc-300 focus:ring-1 focus:ring-emphasis/50"
                        >
                          {getStatusOptions(report.type).map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed mb-6 whitespace-pre-wrap">{report.description}</p>

                {report.mediaUrl && (
                  <div className="mt-6 rounded-xl overflow-hidden border border-zinc-800/50 bg-[#0a0a0c]">
                    {report.mediaType === 'image' ? (
                      <img src={report.mediaUrl} alt="Evidencia" className="w-full h-auto max-h-[500px] object-contain mx-auto" />
                    ) : (
                      <video src={report.mediaUrl} controls className="w-full h-auto max-h-[500px]" />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IssueList;
