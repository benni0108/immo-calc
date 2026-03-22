import { useRef } from 'react';
import { SavedCalculation } from '../lib/types';

interface Props {
  saved: SavedCalculation[];
  currentId: string | null;
  onSave: () => void;
  onLoad: (calc: SavedCalculation) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  onImport: (calcs: SavedCalculation[]) => void;
  onExport: () => void;
}

export default function SaveLoad({
  saved,
  currentId,
  onSave,
  onLoad,
  onDelete,
  onNew,
  onImport,
  onExport,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        onImport(parsed);
      } catch {
        alert('Fehler beim Importieren der Datei.');
      }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="save-load">
      <div className="save-actions">
        <button className="btn primary" onClick={onSave}>Speichern</button>
        <button className="btn" onClick={onNew}>Neue Berechnung</button>
        <button className="btn" onClick={onExport} disabled={saved.length === 0}>
          Export JSON
        </button>
        <button className="btn" onClick={() => fileRef.current?.click()}>
          Import JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </div>

      {saved.length > 0 && (
        <div className="saved-list">
          <h4>Gespeicherte Berechnungen</h4>
          {saved.map((calc) => (
            <div
              key={calc.id}
              className={`saved-item${calc.id === currentId ? ' active' : ''}`}
            >
              <div className="saved-info" onClick={() => onLoad(calc)}>
                <span className="saved-name">{calc.name}</span>
                <span className="saved-date">
                  {new Date(calc.updatedAt).toLocaleDateString('de-DE')}
                </span>
              </div>
              <button
                className="btn-icon delete"
                onClick={(e) => { e.stopPropagation(); onDelete(calc.id); }}
                title="Löschen"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
