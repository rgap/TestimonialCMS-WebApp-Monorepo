'use client';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label?: string;
}

export function ToggleSwitch({ checked, onChange, disabled = false, label }: ToggleSwitchProps) {
  return (
    <div className="flex items-center gap-3">
      {label && (
        <span className="text-sm font-medium text-[var(--color-text-secondary)]">
          {label}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        disabled={disabled}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2 ${
          checked
            ? 'bg-gradient-to-r from-[var(--color-accent-500)] to-[var(--color-accent-600)] shadow-md'
            : 'bg-slate-300 hover:bg-slate-400'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
