import { ReturnsSummary } from '../lib/types';
import { eur, pct } from '../lib/format';

interface Props {
  returns: ReturnsSummary[];
}

export default function ReturnsDashboard({ returns }: Props) {
  if (returns.length === 0) return null;

  return (
    <div className="returns-dashboard">
      <h3>Rentabilität</h3>
      <div className="returns-grid">
        {returns.map((r) => (
          <div key={r.years} className="return-card">
            <div className="return-header">{r.years} Jahre</div>
            <div className="return-rows">
              <Row label="Equity Gained" value={eur(r.equityGained)} />
              <Row label="Netto Cashflow" value={eur(r.sumNettoCashflow)} />
              <Row label="CF Reinvestiert" value={eur(r.sumNetCashflowReinvested)} />
              <Row label="Wertsteigerung (×0,75)" value={eur(r.increasedValueProperty)} />
              <div className="return-divider" />
              <Row label="Summe" value={eur(r.summe)} bold />
              <Row label="Jährlich" value={eur(r.jaehrlich)} />
              <Row label="Rendite Gesamtkap." value={pct(r.annualizedReturnGesamtkapital)} />
              <Row label="Rendite Eigenkap." value={pct(r.annualizedReturnEigenkapital)} highlight />
              <Row label="Gesamtkapital" value={eur(r.gesamtkapital)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ label, value, bold, highlight }: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={`return-row${bold ? ' bold' : ''}${highlight ? ' highlight' : ''}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
