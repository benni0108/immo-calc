export interface PropertyInputs {
  name: string;
  kaufpreis: number;
  nebenkostenPct: number;
  sanierung: number;
  betriebskosten: number;
  wlan: number;
  heizung: number;
  versicherung: number;
  abnutzung: number;
  miete: number;
  steuerklasse: number;
  abschreibungPct: number;
  grundanteilPct: number;
  kostensteigerungPct: number;
  kredithoehe: number;
  dauerJahre: number;
  zinsenPct: number;
  mietsteigerungPct: number;
  wohnungspreissteigerungPct: number;
  aktienmarktRenditePct: number;
  marktkorrektur: number;
}

export interface DerivedValues {
  nebenkosten: number;
  gesamtkosten: number;
  summeKosten: number;
  einnahmen: number;
  mietrendite: number;
  eigenkapital: number;
  eigenkapitalquote: number;
  afaBasis: number;
  afaJaehrlich: number;
  annuitaet: number;
}

export interface YearRow {
  year: number;
  calendarYear: number;
  zinsen: number;
  tilgung: number;
  annuitaet: number;
  restschuld: number;
  kosten: number;
  miete: number;
  cashflowBrutto: number;
  steuern: number;
  cashflowNetto: number;
  cashflowNettoReinvested: number;
  wertImmobilie: number;
}

export interface ReturnsSummary {
  years: number;
  equityGained: number;
  sumNettoCashflow: number;
  sumNetCashflowReinvested: number;
  increasedValueProperty: number;
  summe: number;
  jaehrlich: number;
  annualizedReturnGesamtkapital: number;
  annualizedReturnEigenkapital: number;
  gesamtkapital: number;
}

export interface CalculationResult {
  inputs: PropertyInputs;
  derived: DerivedValues;
  schedule: YearRow[];
  returns: ReturnsSummary[];
}

export interface SavedCalculation {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  inputs: PropertyInputs;
}
