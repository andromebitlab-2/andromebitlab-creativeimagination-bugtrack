
import React, { useState, useRef } from 'react';
import { AppSettings, GameVersion } from '../types';

interface AdminSettingsProps {
  settings: AppSettings;
  versions: GameVersion[];
  onSave: (settings: AppSettings) => void;
  onManageVersions: { add: (v: string) => void; remove: (v: string) => void; };
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, versions, onSave, onManageVersions }) => {
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [emphasisColor, setEmphasisColor] = useState(settings.emphasisColor);
  const [newVersion, setNewVersion] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ logoUrl, emphasisColor });
  };

  const handleAddVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersion.trim()) return;
    onManageVersions.add(newVersion.trim());
    setNewVersion('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoUrl(event.target?.result as string);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Ajustes Visuales */}
      <div className="bg-[#111113] border border-zinc-800 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Apariencia</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-center gap-6 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <div className="w-16 h-16 bg-black rounded flex items-center justify-center p-2"><img src={logoUrl} className="max-h-full" /></div>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-zinc-800 text-xs font-bold rounded border border-zinc-700">{uploading ? 'Cargando...' : 'Cambiar Logo'}</button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          </div>
          <div className="flex items-center gap-4">
            <input type="color" value={emphasisColor} onChange={(e) => setEmphasisColor(e.target.value)} className="w-12 h-12 bg-transparent cursor-pointer" />
            <input type="text" value={emphasisColor} onChange={(e) => setEmphasisColor(e.target.value)} className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded font-mono text-sm uppercase" />
          </div>
          <button type="submit" className="w-full py-4 bg-emphasis text-white font-bold rounded-xl shadow-lg shadow-emphasis/20">Guardar Cambios Visuales</button>
        </form>
      </div>

      {/* Gestión de Versiones */}
      <div className="bg-[#111113] border border-zinc-800 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Versiones del Juego</h2>
        <form onSubmit={handleAddVersion} className="flex gap-2 mb-6">
          <input type="text" value={newVersion} onChange={(e) => setNewVersion(e.target.value)} placeholder="Ej: 1.3.0" className="flex-grow bg-zinc-900 border border-zinc-800 px-4 py-2 rounded text-sm" />
          <button type="submit" className="bg-emerald-600 px-6 py-2 rounded text-xs font-bold uppercase">Añadir</button>
        </form>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {versions.map(v => (
            <div key={v} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 px-3 py-2 rounded group">
              <span className="text-xs font-bold text-zinc-400">V {v}</span>
              <button onClick={() => onManageVersions.remove(v)} className="text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
