
import React, { useState, useRef } from 'react';
import { User, Report, GameVersion, IssueType } from '../types';
import { VERSIONS, ISSUE_TYPES, MAX_VIDEO_SIZE_MB } from '../constants';
import { getCounterString, formatReportCode } from '../utils';

interface IssueFormProps {
  user: User;
  onSubmit: (report: Report) => void;
}

const IssueForm: React.FC<IssueFormProps> = ({ user, onSubmit }) => {
  const [version, setVersion] = useState<GameVersion>(VERSIONS[VERSIONS.length - 1]);
  const [type, setType] = useState<IssueType>(ISSUE_TYPES[0]);
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const counter = getCounterString(user.submissionCount);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    if (isVideo && file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) return setError(`Límite de ${MAX_VIDEO_SIZE_MB}MB.`);
    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => setMedia({ url: event.target?.result as string, type: isVideo ? 'video' : 'image' });
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counter) return;
    onSubmit({
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      username: user.username,
      version,
      type,
      description,
      mediaUrl: media?.url || null,
      mediaType: media?.type || null,
      reportCode: formatReportCode(user.userHex, counter),
      createdAt: Date.now(),
      status: 'Pendiente'
    });
  };

  if (!counter) return <div className="p-10 text-center text-red-500 font-bold">Ciclo de reportes completado (Z9).</div>;

  return (
    <div className="bg-[#111113] border border-zinc-800 rounded-2xl p-8 shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Nuevo Reporte</h2>
        <span className="text-xs font-mono text-emphasis bg-emphasis/10 px-3 py-1 rounded border border-emphasis/20">{formatReportCode(user.userHex, counter)}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <select value={version} onChange={(e) => setVersion(e.target.value as GameVersion)} className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-sm">
            {VERSIONS.map(v => <option key={v} value={v}>V {v}</option>)}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value as IssueType)} className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-sm">
            {ISSUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-sm resize-none" placeholder="Descripción detallada..." />
        
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-zinc-800 hover:border-emphasis/50 p-10 rounded-xl text-center cursor-pointer transition-all">
          {media ? <p className="text-emphasis font-bold">Archivo cargado ✓</p> : <p className="text-zinc-500 text-sm">Click para adjuntar evidencia (Img/Video)</p>}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
        </div>

        <button type="submit" className="w-full py-4 bg-emphasis text-white font-bold rounded-xl shadow-lg shadow-emphasis/20">Publicar</button>
      </form>
    </div>
  );
};

export default IssueForm;
