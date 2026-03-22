import {
  PropertyInputs,
  DerivedValues,
  YearRow,
  ReturnsSummary,
  CalculationResult,
} from './types';

function pmt(rate: number, nper: number, pv: number): number {
  if (rate === 0) return -pv / nper;
  return (-pv * rate * Math.pow(1 + rate, nper)) / (Math.pow(1 + rate, nper) - 1);
}

export function calculate(inputs: PropertyInputs): CalculationResult {
  const zinsen = inputs.zinsenPct / 100;
  const mietsteigerung = inputs.mietsteigerungPct / 100;
  const wohnungspreissteigerung = inputs.wohnungspreissteigerungPct / 100;
  const aktienmarktRendite = inputs.aktienmarktRenditePct / 100;
  const steuerklasse = inputs.steuerklasse / 100;
  const abschreibung = inputs.abschreibungPct / 100;
  const grundanteil = inputs.grundanteilPct / 100;
  const kostensteigerung = inputs.kostensteigerungPct / 100;

  const nebenkosten = inputs.kaufpreis * (inputs.nebenkostenPct / 100);
  const gesamtkosten = inputs.kaufpreis + nebenkosten + inputs.sanierung;
  const summeKosten =
    inputs.betriebskosten +
    inputs.wlan +
    inputs.heizung +
    inputs.versicherung +
    inputs.abnutzung;
  const einnahmen = inputs.miete - summeKosten;
  const mietrendite = gesamtkosten > 0 ? (einnahmen * 11) / gesamtkosten : 0;
  const eigenkapital = gesamtkosten - inputs.kredithoehe;
  const eigenkapitalquote = gesamtkosten > 0 ? eigenkapital / gesamtkosten : 0;
  const annuitaet = pmt(zinsen, inputs.dauerJahre, inputs.kredithoehe);
  const afaBasis = inputs.kaufpreis * (1 - grundanteil);

  const derived: DerivedValues = {
    nebenkosten,
    gesamtkosten,
    summeKosten,
    einnahmen,
    mietrendite,
    eigenkapital,
    eigenkapitalquote,
    afaBasis,
    afaJaehrlich: afaBasis * abschreibung,
    annuitaet,
  };

  const currentYear = new Date().getFullYear();
  const schedule: YearRow[] = [];

  let restschuld = inputs.kredithoehe;
  let jahresKosten = summeKosten * 11;
  let cashflowNettoReinvested = 0;
  let wertImmobilie = gesamtkosten - nebenkosten + inputs.marktkorrektur;

  const maxYears = Math.max(inputs.dauerJahre, 30);

  for (let i = 1; i <= maxYears; i++) {
    const loanActive = i <= inputs.dauerJahre && restschuld > 0;
    const zinsenBetrag = loanActive && restschuld * zinsen >= 1 ? restschuld * zinsen : 0;
    const jahresAnnuitaet = loanActive && zinsenBetrag >= 1 ? annuitaet : 0;
    const tilgung = -jahresAnnuitaet - zinsenBetrag;

    if (i > 1) {
      jahresKosten = jahresKosten * (1 + kostensteigerung);
    }

    const bruttoMiete = inputs.miete * 11 * Math.pow(1 + mietsteigerung, i - 1);
    const nettoMiete = bruttoMiete - jahresKosten;
    const cashflowBrutto = nettoMiete + jahresAnnuitaet;
    const steuern =
      -((nettoMiete - zinsenBetrag) - (afaBasis * abschreibung)) *
      steuerklasse;
    const cashflowNetto = cashflowBrutto + steuern;

    if (i === 1) {
      cashflowNettoReinvested = cashflowNetto;
    } else {
      cashflowNettoReinvested =
        (cashflowNetto + cashflowNettoReinvested) * aktienmarktRendite +
        cashflowNettoReinvested +
        cashflowNetto;
    }

    if (i > 1) {
      wertImmobilie = wertImmobilie * (1 + wohnungspreissteigerung);
    }

    schedule.push({
      year: i,
      calendarYear: currentYear + i - 1,
      zinsen: zinsenBetrag,
      tilgung,
      annuitaet: jahresAnnuitaet,
      restschuld,
      kosten: jahresKosten,
      miete: nettoMiete,
      cashflowBrutto,
      steuern,
      cashflowNetto,
      cashflowNettoReinvested,
      wertImmobilie,
    });

    restschuld = restschuld - tilgung;
  }

  const returnYears = [5, 10, 20, 30].filter((y) => y <= maxYears);
  const returns: ReturnsSummary[] = returnYears.map((years) => {
    const initialRestschuld = inputs.kredithoehe;
    const rowAtYear = schedule[years - 1];
    const nextRow = schedule[years] ?? null;
    const restschuldAtYear = nextRow ? nextRow.restschuld : (rowAtYear.restschuld - rowAtYear.tilgung);

    const equityGained = initialRestschuld - restschuldAtYear;
    const sumNettoCashflow = schedule
      .slice(0, years)
      .reduce((sum, r) => sum + r.cashflowNetto, 0);
    const sumNetCashflowReinvested = rowAtYear.cashflowNettoReinvested;
    const increasedValueProperty =
      (rowAtYear.wertImmobilie - gesamtkosten) * 0.75;
    const summe = equityGained + sumNetCashflowReinvested + increasedValueProperty;
    const jaehrlich = summe / years;

    const annualizedReturnGesamtkapital =
      gesamtkosten > 0
        ? Math.pow((gesamtkosten + summe) / gesamtkosten, 1 / years) - 1
        : 0;

    const gesamtkapitalVal = summe + eigenkapital;
    const annualizedReturnEigenkapital =
      eigenkapital > 0
        ? Math.pow(gesamtkapitalVal / eigenkapital, 1 / years) - 1
        : 0;

    return {
      years,
      equityGained,
      sumNettoCashflow,
      sumNetCashflowReinvested,
      increasedValueProperty,
      summe,
      jaehrlich,
      annualizedReturnGesamtkapital,
      annualizedReturnEigenkapital,
      gesamtkapital: gesamtkapitalVal,
    };
  });

  return { inputs, derived, schedule, returns };
}
