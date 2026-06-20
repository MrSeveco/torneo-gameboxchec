interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-10 text-center md:text-left">
      <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-xl text-[var(--color-text-secondary)]">
          {subtitle}
        </p>
      )}
      <div className="mt-4 h-1 w-20 bg-gradient-to-r from-[var(--color-gamebox-green)] to-[var(--color-chec-cyan)] mx-auto md:mx-0 rounded-full"></div>
    </div>
  );
}
