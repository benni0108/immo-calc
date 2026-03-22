import { DerivedValues } from '../lib/types';
import { eur, pct } from '../lib/format';

interface Props {
  derived: DerivedValues;
}

export default function DerivedPanel({ derived }: Props) {
  const items = [
    { label: 'Nebenkosten', value: eur(derived.nebenkosten) },
    { label: 'Gesamtkosten', value: eur(derived.gesamtkosten), highlight: true },
    { label: 'Monatliche Kosten', value: eur(derived.summeKosten) },
    { label: 'Netto-Einnahmen / Monat', value: eur(derived.einnahmen) },
    { label: 'Mietrendite (11 Mon.)', value: pct(derived.mietrendite), highlight: true },
    { label: 'AfA-Basis (ohne Grund)', value: eur(derived.afaBasis) },
    { label: 'AfA jährlich', value: eur(derived.afaJaehrlich) },
    { label: 'Eigenkapital', value: eur(derived.eigenkapital) },
    { label: 'Eigenkapitalquote', value: pct(derived.eigenkapitalquote) },
    { label: 'Annuität (jährl.)', value: eur(derived.annuitaet) },
  ];

  return (
    <div className="derived-panel">
      <h3>Kennzahlen</h3>
      <div className="derived-grid">
        {items.map((item) => (
          <div key={item.label} className={`derived-item${item.highlight ? ' highlight' : ''}`}>
            <span className="derived-label">{item.label}</span>
            <span className="derived-value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
