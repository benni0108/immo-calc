import { PropertyInputs } from '../lib/types';

interface Props {
  inputs: PropertyInputs;
  onChange: (inputs: PropertyInputs) => void;
}

interface FieldDef {
  key: keyof PropertyInputs;
  label: string;
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
}

const purchaseFields: FieldDef[] = [
  { key: 'kaufpreis', label: 'Kaufpreis', suffix: '€' },
  { key: 'nebenkostenPct', label: 'Nebenkosten', suffix: '%', step: 0.5, min: 0, max: 20 },
  { key: 'sanierung', label: 'Sanierung + Einrichtung', suffix: '€' },
];

const costFields: FieldDef[] = [
  { key: 'betriebskosten', label: 'Betriebskosten inkl. RR', suffix: '€/mtl.' },
  { key: 'wlan', label: 'WLAN', suffix: '€/mtl.' },
  { key: 'heizung', label: 'Heizung', suffix: '€/mtl.' },
  { key: 'versicherung', label: 'Versicherung', suffix: '€/mtl.' },
  { key: 'abnutzung', label: 'Abnutzung', suffix: '€/mtl.' },
];

const incomeFields: FieldDef[] = [
  { key: 'miete', label: 'Miete monatlich', suffix: '€' },
];

const taxFields: FieldDef[] = [
  { key: 'steuerklasse', label: 'Steuersatz', suffix: '%', step: 1, min: 0, max: 100 },
  { key: 'abschreibungPct', label: 'Abschreibung (AfA)', suffix: '%', step: 0.5, min: 0, max: 10 },
  { key: 'grundanteilPct', label: 'Grundanteil', suffix: '%', step: 5, min: 0, max: 100 },
];

const loanFields: FieldDef[] = [
  { key: 'kredithoehe', label: 'Kredithöhe', suffix: '€' },
  { key: 'dauerJahre', label: 'Laufzeit', suffix: 'Jahre', step: 1, min: 1, max: 50 },
  { key: 'zinsenPct', label: 'Zinssatz', suffix: '%', step: 0.05, min: 0, max: 20 },
];

const growthFields: FieldDef[] = [
  { key: 'mietsteigerungPct', label: 'Mietsteigerung / Jahr', suffix: '%', step: 0.1 },
  { key: 'kostensteigerungPct', label: 'Kostensteigerung / Jahr', suffix: '%', step: 0.1 },
  { key: 'wohnungspreissteigerungPct', label: 'Wertsteigerung / Jahr', suffix: '%', step: 0.1 },
  { key: 'aktienmarktRenditePct', label: 'Aktienmarkt Rendite', suffix: '%', step: 0.5 },
  { key: 'marktkorrektur', label: 'Marktkorrektur (einmalig)', suffix: '€' },
];

function FieldGroup({ title, fields, inputs, onChange }: {
  title: string;
  fields: FieldDef[];
  inputs: PropertyInputs;
  onChange: (key: keyof PropertyInputs, val: number) => void;
}) {
  return (
    <fieldset className="field-group">
      <legend>{title}</legend>
      {fields.map((f) => (
        <div className="field" key={f.key}>
          <label htmlFor={f.key}>{f.label}</label>
          <div className="input-wrap">
            <input
              id={f.key}
              type="number"
              step={f.step ?? 1}
              min={f.min ?? 0}
              max={f.max}
              value={inputs[f.key] as number}
              onChange={(e) => onChange(f.key, parseFloat(e.target.value) || 0)}
            />
            {f.suffix && <span className="suffix">{f.suffix}</span>}
          </div>
        </div>
      ))}
    </fieldset>
  );
}

export default function InputForm({ inputs, onChange }: Props) {
  const handleField = (key: keyof PropertyInputs, val: number) => {
    onChange({ ...inputs, [key]: val });
  };

  return (
    <div className="input-form">
      <div className="field" style={{ marginBottom: '1rem' }}>
        <label htmlFor="name">Bezeichnung</label>
        <input
          id="name"
          type="text"
          value={inputs.name}
          onChange={(e) => onChange({ ...inputs, name: e.target.value })}
          style={{ width: '100%' }}
        />
      </div>
      <div className="form-grid">
        <FieldGroup title="Kaufkosten" fields={purchaseFields} inputs={inputs} onChange={handleField} />
        <FieldGroup title="Monatliche Kosten" fields={costFields} inputs={inputs} onChange={handleField} />
        <FieldGroup title="Einnahmen" fields={incomeFields} inputs={inputs} onChange={handleField} />
        <FieldGroup title="Steuer & Abschreibung" fields={taxFields} inputs={inputs} onChange={handleField} />
        <FieldGroup title="Kredit" fields={loanFields} inputs={inputs} onChange={handleField} />
        <FieldGroup title="Wachstum & Vergleich" fields={growthFields} inputs={inputs} onChange={handleField} />
      </div>
    </div>
  );
}
