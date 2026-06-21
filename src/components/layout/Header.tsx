import { Menu, X, Shield, LogOut } from 'lucide-react';
import { useState } from 'react';
import checLogo from '../../assets/chec.svg';
import gameboxLogo from '../../assets/gamebox.png';

interface HeaderProps {
  isAdmin?: boolean;
  onLogout?: () => void;
}

export default function Header({ isAdmin = false, onLogout }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const publicNavLinks = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Grupos/VS', href: '#grupos' },
    { label: 'Resultados', href: '#resultados' },
    { label: 'Clasificados', href: '#clasificados' },
    { label: 'Cronograma', href: '#cronograma' },
    { label: 'Reglamento', href: '#reglamento' },
  ];

  const adminNavLinks = [
    { label: 'Grupos/VS', href: '#grupos' },
    { label: 'Resultados', href: '#resultados' },
    { label: 'Clasificados', href: '#clasificados' }
  ];

  const navLinks = isAdmin ? adminNavLinks : publicNavLinks;

  return (
    <header className="fixed top-0 w-full z-50 bg-[var(--color-bg-primary)]/90 backdrop-blur-md border-b border-[var(--color-surface-alt)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-4">
            <img
              src={checLogo}
              alt="Logo CHEC"
              className="h-10 sm:h-12 w-auto object-contain drop-shadow-md"
            />
            <div className="h-8 w-px bg-[var(--color-surface-alt)]"></div>
            <img
              src={gameboxLogo}
              alt="Logo GameBox"
              className="h-10 sm:h-12 w-auto object-contain shadow-sm"
            />

            {isAdmin && (
              <div className="ml-4 flex items-center gap-1 bg-[var(--color-gamebox-green)]/10 text-[var(--color-gamebox-neon)] border border-[var(--color-gamebox-green)]/30 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                <Shield size={14} /> Admin
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 items-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-colors"
              >
                {link.label}
              </a>
            ))}

            {isAdmin ? (
              <div className="flex items-center ml-4 pl-4 border-l border-[var(--color-surface-alt)] gap-2">
                <a href="#home" className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] px-2 py-1 transition-colors">Vista Pública</a>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-colors"
                >
                  <LogOut size={14} /> Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center ml-4 pl-4 border-l border-[var(--color-surface-alt)]">
                <a
                  href="#admin"
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-[var(--color-surface)] border border-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-chec-cyan)] hover:text-[var(--color-chec-cyan)] text-xs font-bold transition-colors"
                >
                  <Shield size={14} /> Modo Admin
                </a>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            {isAdmin && (
              <button onClick={onLogout} className="p-1.5 rounded text-red-400 hover:bg-red-500/10">
                <LogOut size={18} />
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] focus:outline-none"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[var(--color-surface)] border-b border-[var(--color-surface-alt)]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]"
              >
                {link.label}
              </a>
            ))}
            {isAdmin ? (
              <a
                href="#home"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[var(--color-chec-cyan)] hover:bg-[var(--color-surface-alt)] mt-2"
              >
                Ir a Vista Pública
              </a>
            ) : (
              <a
                href="#admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-[var(--color-gamebox-neon)] hover:bg-[var(--color-surface-alt)] mt-2 border border-[var(--color-surface)]"
              >
                <Shield size={18} /> Acceso Administrador
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
