import { CalendarClock } from 'lucide-react';

const toLocalInputValue = (date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const futureValue = (hours) => {
  const date = new Date(Date.now() + hours * 60 * 60 * 1000);
  date.setMinutes(Math.ceil(date.getMinutes() / 5) * 5, 0, 0);
  return toLocalInputValue(date);
};

export default function DateTimePicker({ value, onChange }) {
  const min = toLocalInputValue(new Date());
  const selected = value ? new Date(value) : null;
  const isValid = selected && !Number.isNaN(selected.getTime());

  return <div className="md:col-span-2 rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
    <label htmlFor="needed-at" className="flex items-center gap-2 font-bold text-slate-100">
      <CalendarClock className="h-5 w-5 text-red-400" />
      When is blood needed?
    </label>
    <p className="mt-1 text-xs text-slate-400">Choose both date and time in one field.</p>
    <input
      id="needed-at"
      type="datetime-local"
      required
      min={min}
      step="60"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-white outline-none focus:border-red-500 [color-scheme:dark]"
    />
    <div className="mt-3 flex flex-wrap gap-2">
      {[['In 1 hour', 1], ['In 3 hours', 3], ['Tomorrow', 24]].map(([label, hours]) =>
        <button key={label} type="button" onClick={() => onChange(futureValue(hours))} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 hover:border-red-500 hover:text-white">{label}</button>
      )}
    </div>
    {isValid && <p className="mt-3 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-300">
      Selected: {selected.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
    </p>}
  </div>;
}
