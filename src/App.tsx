import { useState, useMemo, useCallback } from 'react';
import { PropertyInputs, SavedCalculation } from './lib/types';
import { DEFAULT_INPUTS } from './lib/defaults';
import { calculate } from './lib/calculate';
import {
  loadAll,
  saveCalculation,
  deleteCalculation,
  exportToJson,
  importFromJson,
} from './lib/storage';
import InputForm from './components/InputForm';
import DerivedPanel from './components/DerivedPanel';
import AmortizationTable from './components/AmortizationTable';
import ReturnsDashboard from './components/ReturnsDashboard';
import Charts from './components/Charts';
import SaveLoad from './components/SaveLoad';
import './App.css';

export default function App() {
  const [inputs, setInputs] = useState<PropertyInputs>({ ...DEFAULT_INPUTS });
  const [saved, setSaved] = useState<SavedCalculation[]>(() => loadAll());
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'table' | 'charts' | 'returns'>('returns');

  const result = useMemo(() => calculate(inputs), [inputs]);

  const handleSave = useCallback(() => {
    const calc = saveCalculation(inputs, currentId ?? undefined);
    setCurrentId(calc.id);
    setSaved(loadAll());
  }, [inputs, currentId]);

  const handleLoad = useCallback((calc: SavedCalculation) => {
    setInputs(calc.inputs);
    setCurrentId(calc.id);
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteCalculation(id);
    setSaved(loadAll());
    if (currentId === id) setCurrentId(null);
  }, [currentId]);

  const handleNew = useCallback(() => {
    setInputs({ ...DEFAULT_INPUTS });
    setCurrentId(null);
  }, []);

  const handleExport = useCallback(() => {
    const json = exportToJson(saved);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'immo-berechnungen.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [saved]);

  const handleImport = useCallback((parsed: SavedCalculation[]) => {
    try {
      const updated = importFromJson(JSON.stringify(parsed));
      setSaved(updated);
    } catch {
      alert('Fehler beim Importieren.');
    }
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Immobilien-Rechner</h1>
        <p className="subtitle">Rentabilitätsberechnung für Wohnungsinvestments</p>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <InputForm inputs={inputs} onChange={setInputs} />
          <DerivedPanel derived={result.derived} />
          <SaveLoad
            saved={saved}
            currentId={currentId}
            onSave={handleSave}
            onLoad={handleLoad}
            onDelete={handleDelete}
            onNew={handleNew}
            onImport={handleImport}
            onExport={handleExport}
          />
        </aside>

        <main className="main-content">
          <nav className="tabs">
            <button
              className={`tab${activeTab === 'returns' ? ' active' : ''}`}
              onClick={() => setActiveTab('returns')}
            >
              Rentabilität
            </button>
            <button
              className={`tab${activeTab === 'charts' ? ' active' : ''}`}
              onClick={() => setActiveTab('charts')}
            >
              Diagramme
            </button>
            <button
              className={`tab${activeTab === 'table' ? ' active' : ''}`}
              onClick={() => setActiveTab('table')}
            >
              Tilgungsplan
            </button>
          </nav>

          <div className="tab-content">
            {activeTab === 'returns' && (
              <ReturnsDashboard returns={result.returns} />
            )}
            {activeTab === 'charts' && <Charts schedule={result.schedule} />}
            {activeTab === 'table' && <AmortizationTable schedule={result.schedule} />}
          </div>
        </main>
      </div>
    </div>
  );
}
