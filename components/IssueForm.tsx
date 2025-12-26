import React, { useState, useRef, useEffect } from 'react';
import { User, Report, GameVersion, IssueType } from '../types';
import { ISSUE_TYPES, MAX_VIDEO_SIZE_MB } from '../constants';
import { getCounterString, formatReportCode } from '../utils';

interface IssueFormProps {
  user: User;
  versions: GameVersion[];
  onSubmit: (report: Report) => void;
}

const IssueForm: React.FC<IssueFormProps> = ({ user, versions, onSubmit }) => {
  const [version, setVersion] = useState<GameVersion>('');
  const [type, setType] = useState<IssueType>(ISSUE_TYPES[0]);
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Read from URL on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlVersion = params.get('version');
    const urlType = params.get('type') as IssueType;

    if (urlVersion && versions.includes(urlVersion)) {
      setVersion(urlVersion);
    } else if (versions.length > 0) {
      setVersion(versions[0]);
    }

    if (urlType && ISSUE_TYPES.includes(urlType)) {
      setType(urlType);
    }
  }, [versions]);


  // Update URL when form fields change
  useEffect(() => {
    const params = new URLSearchParams();
    if (version) params.set('version', version);
    if (type) params.set('type', type);
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  }, [version, type]);


  const counter = getCounterString(user.submissionCount);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    if (isVideo && file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      setError(`El archivo de video excede el límite de ${MAX_VIDEO_SIZE_MB}MB.`);
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => setMedia({ url: event.target?.result as string, type: isVideo ? 'video' : 'image' });
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counter || !version) {
      setError("Por favor, selecciona una versión válida del juego.");
      return;
    }
    if (!description.trim()) {
        setError("La descripción no puede estar vacía.");
        return;
    }
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
    // Clear URL params after submission
    window.history.pushState({}, '', window.location.pathname);
  };

  if (!counter) return <div className="p-10 text-center text-red-500 font-bold">Has alcanzado el límite de reportes.</div>;

  return (
    <div className="bg-[#111113] border border-zinc-800 rounded-2xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Nuevo Reporte</h2>
        <span className="text-xs font-mono text-emphasis bg-emphasis/10 px-3 py-1 rounded border border-emphasis/20">{formatReportCode(user.userHex, counter)}</span>
      </div>

      {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-500 text-xs text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <select value={version} onChange={(e) => setVersion(e.target.value)} className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-sm w-full">
            {versions.length > 0 ? versions.map(v => <option key={v} value={v}>Versión {v}</option>) : <option disabled>Cargando versiones...</option>}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value as IssueType)} className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-sm w-full">
            {ISSUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-sm resize-none" placeholder="Descripción detallada del problema o sugerencia..." />
        
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-zinc-800 hover:border-emphasis/50 p-10 rounded-xl text-center cursor-pointer transition-all">
          {media ? (
            <div className="flex flex-col items-center gap-2">
                <span className="text-emphasis font-bold text-sm">✓ {media.type === 'image' ? 'Imagen' : 'Video'} cargado</span>
                <button type="button" onClick={(e) => { e.stopPropagation(); setMedia(null); if(fileInputRef.current) fileInputRef.current.value = ''; }} className="text-xs text-red-500 hover:underline">Quitar</button>
            </div>
          ) : (
            <p className="text-zinc-500 text-sm">Adjuntar evidencia (Imagen o Video)<br/><span className="text-xs">(Max {MAX_VIDEO_SIZE_MB}MB para videos)</span></p>
          )}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
        </div>

        <button type="submit" className="w-full py-4 bg-emphasis text-white font-bold rounded-xl shadow-lg shadow-emphasis/20 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed" disabled={!version || !description.trim()}>
          Enviar Reporte
        </button>
      </form>
    </div>
  );
};

export default IssueForm;
