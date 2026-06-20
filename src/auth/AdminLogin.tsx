import { useState } from 'react';
import { supabase } from '../config/supabaseClient';
import { Lock, ArrowLeft, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminLogin({ onSuccess, onCancel }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setIsLoading(false);

      if (error) {
        setError(true);
        setPassword('');
      } else {
        onSuccess();
      }
    } catch (err) {
      setIsLoading(false);
      setError(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[var(--color-surface-alt)] border border-[var(--color-surface)] rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">

        <div className="flex justify-center items-center mb-6 gap-4">
          <img
            src="/src/assets/chec.svg"
            alt="Logo CHEC"
            className="h-12 w-auto object-contain"
          />
          <div className="h-10 w-px bg-[var(--color-surface-alt)]"></div>
          <img
            src="/src/assets/gamebox.png"
            alt="Logo GameBox"
            className="h-12 w-auto object-contain"
          />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2 flex justify-center items-center gap-2">
            <Lock className="text-[var(--color-text-secondary)]" size={20} />
            Acceso Administrador
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Inicia sesión con tu cuenta de Supabase.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="sr-only" htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(false); }}
              className={`w-full bg-[var(--color-bg-primary)] border ${error ? 'border-red-500' : 'border-[var(--color-surface)]'} rounded-lg px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)] transition-colors`}
              placeholder="Correo electrónico"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="sr-only" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              className={`w-full bg-[var(--color-bg-primary)] border ${error ? 'border-red-500' : 'border-[var(--color-surface)]'} rounded-lg px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-chec-cyan)] transition-colors`}
              placeholder="Contraseña"
              disabled={isLoading}
              required
            />
            {error && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> Credenciales incorrectas
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !password || !email}
            className="w-full bg-[var(--color-gamebox-green)] hover:bg-[var(--color-gamebox-neon)] text-[var(--color-bg-primary)] font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onCancel}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-sm font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} /> Volver a la vista pública
          </button>
        </div>
      </div>
    </div>
  );
}
