import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";

const { Card, CardContent, CardFooter, Input, Label, Select, Badge, Separator } = UI;
const { AlertCircle } = Icons;

const CATEGORIES = [
  {
    key: 'length',
    label: 'Length',
    defaultFrom: 'meters',
    defaultTo: 'feet',
    units: [
      { key: 'meters', label: 'Meters', abbr: 'm', factor: 1 },
      { key: 'kilometers', label: 'Kilometers', abbr: 'km', factor: 1000 },
      { key: 'centimeters', label: 'Centimeters', abbr: 'cm', factor: 0.01 },
      { key: 'feet', label: 'Feet', abbr: 'ft', factor: 0.3048 },
      { key: 'inches', label: 'Inches', abbr: 'in', factor: 0.0254 },
      { key: 'miles', label: 'Miles', abbr: 'mi', factor: 1609.344 },
    ],
  },
  {
    key: 'weight',
    label: 'Weight/Mass',
    defaultFrom: 'kilograms',
    defaultTo: 'pounds',
    units: [
      { key: 'kilograms', label: 'Kilograms', abbr: 'kg', factor: 1 },
      { key: 'grams', label: 'Grams', abbr: 'g', factor: 0.001 },
      { key: 'pounds', label: 'Pounds', abbr: 'lb', factor: 0.45359237 },
      { key: 'ounces', label: 'Ounces', abbr: 'oz', factor: 0.028349523125 },
    ],
  },
  {
    key: 'temperature',
    label: 'Temperature',
    defaultFrom: 'celsius',
    defaultTo: 'fahrenheit',
    units: [
      { key: 'celsius', label: 'Celsius', abbr: '°C' },
      { key: 'fahrenheit', label: 'Fahrenheit', abbr: '°F' },
      { key: 'kelvin', label: 'Kelvin', abbr: 'K' },
    ],
  },
  {
    key: 'volume',
    label: 'Volume',
    defaultFrom: 'liters',
    defaultTo: 'gallons',
    units: [
      { key: 'liters', label: 'Liters', abbr: 'L', factor: 1 },
      { key: 'milliliters', label: 'Milliliters', abbr: 'mL', factor: 0.001 },
      { key: 'gallons', label: 'Gallons (US)', abbr: 'gal', factor: 3.785411784 },
      { key: 'cups', label: 'Cups (US)', abbr: 'cup', factor: 0.2365882365 },
    ],
  },
  {
    key: 'area',
    label: 'Area',
    defaultFrom: 'sqmeters',
    defaultTo: 'sqfeet',
    units: [
      { key: 'sqmeters', label: 'Square Meters', abbr: 'm²', factor: 1 },
      { key: 'sqfeet', label: 'Square Feet', abbr: 'ft²', factor: 0.09290304 },
      { key: 'acres', label: 'Acres', abbr: 'ac', factor: 4046.8564224 },
      { key: 'hectares', label: 'Hectares', abbr: 'ha', factor: 10000 },
    ],
  },
  {
    key: 'speed',
    label: 'Speed',
    defaultFrom: 'kmh',
    defaultTo: 'mph',
    units: [
      { key: 'kmh', label: 'Kilometers/hour', abbr: 'km/h', factor: 0.2777777778 },
      { key: 'mph', label: 'Miles/hour', abbr: 'mph', factor: 0.44704 },
      { key: 'ms', label: 'Meters/second', abbr: 'm/s', factor: 1 },
    ],
  },
];

const convertTemperature = (value, from, to) => {
  let celsius;
  if (from === 'celsius') celsius = value;
  else if (from === 'fahrenheit') celsius = (value - 32) * (5 / 9);
  else celsius = value - 273.15;

  if (to === 'celsius') return celsius;
  if (to === 'fahrenheit') return celsius * (9 / 5) + 32;
  return celsius + 273.15;
};

const formatNumber = (n) => {
  if (!isFinite(n)) return '—';
  let rounded = Math.round(n * 1e6) / 1e6;
  if (rounded === 0) rounded = 0; // avoid -0
  return rounded.toLocaleString(undefined, { maximumFractionDigits: 6 });
};

const NUMERIC_TYPING_PATTERN = /^-?\d*\.?\d*$/;

export default function Screen() {
  const [categoryKey, setCategoryKey] = React.useState('length');
  const initialCategory = CATEGORIES.find((c) => c.key === 'length');
  const [fromUnit, setFromUnit] = React.useState(initialCategory.defaultFrom);
  const [toUnit, setToUnit] = React.useState(initialCategory.defaultTo);
  const [inputValue, setInputValue] = React.useState('1');

  const category = CATEGORIES.find((c) => c.key === categoryKey);

  const handleCategoryChange = (key) => {
    const cat = CATEGORIES.find((c) => c.key === key);
    setCategoryKey(key);
    setFromUnit(cat.defaultFrom);
    setToUnit(cat.defaultTo);
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const trimmed = inputValue.trim();
  let error = '';
  let resultText = '';

  if (trimmed !== '') {
    if (!NUMERIC_TYPING_PATTERN.test(trimmed)) {
      error = "That doesn't look like a number";
    } else {
      const num = Number(trimmed);
      if (!isNaN(num)) {
        let resultNum;
        if (categoryKey === 'temperature') {
          resultNum = convertTemperature(num, fromUnit, toUnit);
        } else {
          const fromU = category.units.find((u) => u.key === fromUnit);
          const toU = category.units.find((u) => u.key === toUnit);
          resultNum = (num * fromU.factor) / toU.factor;
        }
        resultText = formatNumber(resultNum);
      }
      // else: input mid-typing (e.g. "-", ".", "-."), leave result blank quietly
    }
  }

  const abbrFor = (unitKey) => {
    const u = category.units.find((x) => x.key === unitKey);
    return u ? u.abbr : '';
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6" style={{ fontFamily: brand.fontBody, color: '#111827' }}>
      <div className="mb-5 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold" style={{ fontFamily: brand.fontHeading }}>
              Unit Converter
            </h1>
            <Badge style={{ backgroundColor: brand.accentColor + '22', color: '#92400E' }}>Live</Badge>
          </div>
          <p className="text-sm mt-1" style={{ color: brand.neutralColor }}>
            Pick a category, choose your units, and watch the result update as you type. No sign-up, nothing saved.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b mb-6" style={{ borderColor: '#E5E7EB' }}>
        {CATEGORIES.map((cat) => {
          const active = cat.key === categoryKey;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => handleCategoryChange(cat.key)}
              className={
                'px-3 py-2 text-sm font-medium -mb-px border-b-2 whitespace-nowrap transition-colors ' +
                (active ? '' : 'border-transparent text-gray-500 hover:text-gray-800')
              }
              style={active ? { borderColor: brand.primaryColor, color: brand.primaryColor } : {}}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:items-start">
            <div>
              <Label>From</Label>
              <div className="mt-1">
                <Select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                  {category.units.map((u) => (
                    <option key={u.key} value={u.key}>
                      {u.label} ({u.abbr})
                    </option>
                  ))}
                </Select>
              </div>
              <div className="mt-2">
                <Input
                  type="text"
                  inputMode="decimal"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter a value"
                  className="text-lg"
                />
              </div>
              {error ? (
                <p className="mt-1.5 text-xs flex items-center gap-1" style={{ color: '#B91C1C' }}>
                  <Icons.AlertCircle size={14} />
                  {error}
                </p>
              ) : (
                <p className="mt-1.5 text-xs" style={{ color: 'transparent' }}>
                  placeholder
                </p>
              )}
            </div>

            <div className="flex md:flex-col items-center justify-center md:pt-8">
              <button
                type="button"
                onClick={handleSwap}
                title="Swap units"
                aria-label="Swap units"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border text-base font-medium hover:bg-gray-50"
                style={{ borderColor: '#E5E7EB', color: brand.primaryColor, borderRadius: brand.radius }}
              >
                ⇄
              </button>
            </div>

            <div>
              <Label>To</Label>
              <div className="mt-1">
                <Select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
                  {category.units.map((u) => (
                    <option key={u.key} value={u.key}>
                      {u.label} ({u.abbr})
                    </option>
                  ))}
                </Select>
              </div>
              <div
                className="mt-2 w-full border px-3 py-2 text-lg font-semibold flex items-center min-h-[42px]"
                style={{
                  borderColor: '#E5E7EB',
                  backgroundColor: '#F9FAFB',
                  color: resultText ? '#111827' : brand.neutralColor,
                  borderRadius: brand.radius,
                }}
              >
                {resultText ? resultText : trimmed === '' ? '—' : ''}
              </div>
              <p className="mt-1.5 text-xs" style={{ color: 'transparent' }}>
                placeholder
              </p>
            </div>
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="px-5 py-3 text-sm" style={{ color: brand.neutralColor }}>
          {trimmed !== '' && !error && resultText ? (
            <span>
              <span style={{ color: '#111827', fontWeight: 500 }}>{trimmed}</span> {abbrFor(fromUnit)} ={' '}
              <span style={{ color: brand.primaryColor, fontWeight: 600 }}>{resultText}</span> {abbrFor(toUnit)}
            </span>
          ) : (
            <span>Enter a value above to see the conversion.</span>
          )}
        </CardFooter>
      </Card>

      <p className="mt-4 text-xs text-center" style={{ color: brand.neutralColor }}>
        Free to use, works instantly, and keeps nothing after you close the tab.
      </p>
    </div>
  );
}
