import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { YearRow } from '../lib/types';
import { eur } from '../lib/format';

interface Props {
  schedule: YearRow[];
}

const COLORS = {
  restschuld: '#ef4444',
  wert: '#22c55e',
  brutto: '#3b82f6',
  netto: '#8b5cf6',
  reinvested: '#f59e0b',
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {eur(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function Charts({ schedule }: Props) {
  const data = schedule.map((r) => ({
    year: r.calendarYear,
    restschuld: Math.round(r.restschuld),
    wert: Math.round(r.wertImmobilie),
    brutto: Math.round(r.cashflowBrutto),
    netto: Math.round(r.cashflowNetto),
    reinvested: Math.round(r.cashflowNettoReinvested),
  }));

  return (
    <div className="charts">
      <h3>Diagramme</h3>
      <div className="charts-grid">
        <div className="chart-card">
          <h4>Restschuld & Immobilienwert</h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="year" stroke="#999" />
              <YAxis stroke="#999" tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="restschuld"
                name="Restschuld"
                stroke={COLORS.restschuld}
                fill={COLORS.restschuld}
                fillOpacity={0.15}
              />
              <Area
                type="monotone"
                dataKey="wert"
                name="Immobilienwert"
                stroke={COLORS.wert}
                fill={COLORS.wert}
                fillOpacity={0.15}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>Cashflow pro Jahr</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="year" stroke="#999" />
              <YAxis stroke="#999" tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="brutto" name="CF Brutto" stroke={COLORS.brutto} dot={false} />
              <Line type="monotone" dataKey="netto" name="CF Netto" stroke={COLORS.netto} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>Kumulierter Cashflow (reinvestiert)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="year" stroke="#999" />
              <YAxis stroke="#999" tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="reinvested"
                name="CF Reinvestiert"
                stroke={COLORS.reinvested}
                fill={COLORS.reinvested}
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
