import { useRef } from 'react';
import { Upload } from 'lucide-react';

interface DataImportExportProps {
  onImport: (file: File) => Promise<boolean>;
}

export default function DataImportExport({ onImport }: DataImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!window.confirm('¿Estás seguro de querer importar estos datos? Reemplazarán tu estado actual no guardado.')) {
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      const success = await onImport(file);
      if (success) {
        alert('Datos importados correctamente. Recuerda guardar los cambios si deseas mantenerlos.');
      } else {
        alert('Error al importar el archivo JSON. Verifica que sea un respaldo válido del torneo.');
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <button
        onClick={handleImportClick}
        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-surface)] text-[var(--color-text-primary)] font-medium rounded-lg hover:bg-black/30 border border-[var(--color-surface-alt)] transition-colors"
      >
        <Upload size={16} /> Importar
      </button>
      <input 
        type="file" 
        accept=".json" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
    </>
  );
}
