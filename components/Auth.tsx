
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { generateUserHex } from '../utils';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  logoUrl: string;
  isRegistering: boolean;
}

const Auth: React.FC<AuthProps> = ({ onLogin, logoUrl, isRegistering }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegistering) {
        const userHex = generateUserHex(username);
        const { data, error: signUpError } = await supabase.from('users').insert({ username, password, user_hex: userHex, submission_count: 0 }).select().single();
        if (signUpError) throw new Error(signUpError.code === '23505' ? "Usuario ya existe" : signUpError.message);
        onLogin({ id: data.id, username: data.username, userHex: data.user_hex, submissionCount: data.submission_count, isAdmin: data.is_admin });
      } else {
        const { data, error: loginError } = await supabase.from('users').select('*').eq('username', username).eq('password', password).single();
        if (loginError || !data) throw new Error("Credenciales inválidas");
        onLogin({ id: data.id, username: data.username, userHex: data.user_hex, submissionCount: data.submission_count, isAdmin: data.is_admin });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-6">
      <div className="bg-[#111113] border border-zinc-800 p-8 rounded-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-emphasis" />
        <div className="flex justify-center mb-8"><img src={logoUrl} alt="Logo" className="h-12 w-auto" /></div>
        <h2 className="text-2xl font-bold text-center mb-8">{isRegistering ? 'Crear Cuenta' : 'Acceso Autorizado'}</h2>
        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-500 text-xs text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[#18181b] border border-zinc-800 px-4 py-3 rounded-lg text-sm" placeholder="Usuario" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#18181b] border border-zinc-800 px-4 py-3 rounded-lg text-sm" placeholder="Contraseña" required />
          <button type="submit" disabled={loading} className="w-full py-3 bg-emphasis text-white font-bold rounded-lg shadow-lg shadow-emphasis/20">{loading ? '...' : isRegistering ? 'Registrarse' : 'Entrar'}</button>
        </form>
        <Link to={isRegistering ? '/login' : '/register'} className="block w-full text-center mt-6 text-xs text-zinc-500 hover:text-emphasis transition-colors">
          {isRegistering ? 'Ya tengo cuenta' : 'No tengo cuenta'}
        </Link>
      </div>
    </div>
  );
};

export default Auth;
