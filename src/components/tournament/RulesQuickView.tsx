import type { RuleItem } from '../../types/tournament';
import { CheckCircle2 } from 'lucide-react';

interface RulesProps {
  rules: RuleItem[];
}

export default function RulesQuickView({ rules }: RulesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rules.map((rule) => (
        <div key={rule.id} className="bg-[var(--color-surface-alt)] p-6 rounded-xl border border-[var(--color-surface)] hover:border-[var(--color-chec-cyan)]/40 transition-colors">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-[var(--color-gamebox-green)] mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-[var(--color-text-primary)] font-bold mb-2">{rule.title}</h4>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {rule.description}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      <div className="col-span-full mt-4 p-5 bg-[var(--color-chec-blue)]/10 border border-[var(--color-chec-blue)]/30 rounded-xl text-center">
        <p className="text-[var(--color-text-secondary)] text-sm">
          Para ver el detalle completo, consulta el <span className="text-[var(--color-chec-cyan)] font-semibold cursor-pointer hover:underline">Reglamento Técnico oficial (DOCX)</span> proporcionado por el Comité de Deportes CHEC.
        </p>
      </div>
    </div>
  );
}
