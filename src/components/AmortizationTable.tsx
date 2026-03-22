import { YearRow } from '../lib/types';
import { eurDetail } from '../lib/format';

interface Props {
  schedule: YearRow[];
}

export default function AmortizationTable({ schedule }: Props) {
  return (
    <div className="table-container">
      <h3>Tilgungsplan & Cashflow</h3>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Jahr</th>
              <th>Zinsen</th>
              <th>Tilgung</th>
              <th>Annuität</th>
              <th>Restschuld</th>
              <th>Kosten (11M)</th>
              <th>Netto-Miete</th>
              <th>CF Brutto</th>
              <th>Steuern</th>
              <th>CF Netto</th>
              <th>CF Reinvest.</th>
              <th>Wert Immob.</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row) => (
              <tr key={row.year}>
                <td className="num">{row.calendarYear}</td>
                <td className="num">{eurDetail(row.zinsen)}</td>
                <td className="num">{eurDetail(row.tilgung)}</td>
                <td className="num">{eurDetail(row.annuitaet)}</td>
                <td className="num">{eurDetail(row.restschuld)}</td>
                <td className="num">{eurDetail(row.kosten)}</td>
                <td className="num">{eurDetail(row.miete)}</td>
                <td className="num">{eurDetail(row.cashflowBrutto)}</td>
                <td className="num neg">{eurDetail(row.steuern)}</td>
                <td className={`num${row.cashflowNetto < 0 ? ' neg' : ' pos'}`}>
                  {eurDetail(row.cashflowNetto)}
                </td>
                <td className="num">{eurDetail(row.cashflowNettoReinvested)}</td>
                <td className="num">{eurDetail(row.wertImmobilie)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
