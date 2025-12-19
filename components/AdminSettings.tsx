
import React, { useState, useRef } from 'react';
import { AppSettings } from '../types';

interface AdminSettingsProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onSave }) => {
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [emphasisColor, setEmphasisColor] = useState(settings.emphasisColor);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ logoUrl, emphasisColor });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida.');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setLogoUrl(base64);
      setUploading(false);
    };
    reader.onerror = () => {
      alert('Error al leer el archivo');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-[#111113] border border-zinc-800 rounded-2xl p-8 shadow-xl max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-emphasis/10 flex items-center justify-center text-emphasis">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Ajustes del Sistema</h2>
          <p className="text-zinc-500 text-xs">Personaliza la apariencia visual del portal.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Logotipo y Favicon</label>
          
          <div className="flex items-center gap-6 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <div className="w-20 h-20 bg-[#0a0a0c] rounded-lg border border-zinc-800 flex items-center justify-center p-2 overflow-hidden">
              <img src={logoUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex-grow space-y-2">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded transition-colors w-full border border-zinc-700"
              >
                {uploading ? 'Cargando...' : 'Subir Nueva Imagen'}
              </button>
              <p className="text-[10px] text-zinc-500 text-center italic">Esto también actualizará el favicon de la página.</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload} 
              />
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-zinc-600 uppercase mb-1 block">O usar URL directa:</span>
            <input 
              type="text" 
              value={logoUrl} 
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full bg-[#18181b] border border-zinc-800 px-4 py-3 rounded-lg focus:ring-2 focus:ring-emphasis/20 text-sm font-mono text-zinc-400"
              placeholder="https://ejemplo.com/logo.png"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Esquema de Color</label>
          <div className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <div className="relative group">
              <input 
                type="color" 
                value={emphasisColor} 
                onChange={(e) => setEmphasisColor(e.target.value)}
                className="w-14 h-14 bg-transparent border-none cursor-pointer rounded-lg overflow-hidden"
              />
              <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-lg"></div>
            </div>
            <div className="flex-grow">
              <input 
                type="text" 
                value={emphasisColor} 
                onChange={(e) => setEmphasisColor(e.target.value)}
                className="w-full bg-[#18181b] border border-zinc-800 px-4 py-3 rounded-lg focus:ring-2 focus:ring-emphasis/20 text-sm font-mono uppercase text-zinc-300"
              />
              <p className="text-[10px] text-zinc-600 mt-1">Color de botones, estados y resaltados.</p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            className="w-full py-4 bg-emphasis text-white font-bold rounded-xl transition-all shadow-lg shadow-emphasis/20 hover:scale-[1.01] active:scale-[0.99]"
          >
            Guardar Todos los Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
