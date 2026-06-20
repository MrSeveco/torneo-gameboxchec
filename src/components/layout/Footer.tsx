export default function Footer() {
  return (
    <footer className="bg-[var(--color-bg-alt)] border-t border-[var(--color-surface-alt)] mt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center mb-8 gap-6 opacity-80 hover:opacity-100 transition-all duration-300">
          <img
            src="/src/assets/chec.svg"
            alt="Logo CHEC"
            className="h-14 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
          />
          <img
            src="/src/assets/gamebox.png"
            alt="Logo GameBox"
            className="h-14 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
          />
        </div>
        <div className="mt-8 md:mt-0 flex flex-col items-center">
          <p className="text-center text-base text-[var(--color-text-secondary)]">
            Torneo Gamers CHEC 2026
          </p>
          <div className="flex flex-col items-center mt-2 gap-1 text-sm text-[var(--color-chec-gray)]">
            <p>Comité de Deportes CHEC • Landing informativa privada</p>
            <a href="#admin" className="hover:text-[var(--color-text-primary)] transition-colors opacity-50 hover:opacity-100 text-xs mt-2">
              Acceso administrador
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
