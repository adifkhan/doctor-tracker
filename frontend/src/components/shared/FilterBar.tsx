'use client';

import { memo } from 'react';
import { FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ALL = '__all__';

export function FilterBar({
  children,
  activeCount,
  onClear,
}: {
  children: React.ReactNode;
  activeCount: number;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b p-3 sm:p-4">
      {children}
      {activeCount > 0 && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <FilterX />
          Clear ({activeCount})
        </Button>
      )}
    </div>
  );
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  loading?: boolean;
}

export const FilterSelect = memo(function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  loading,
}: FilterSelectProps) {
  return (
    <Select value={value || ALL} onValueChange={(v) => onChange(v === ALL ? '' : v)} disabled={loading}>
      <SelectTrigger className="w-full sm:w-44" aria-label={placeholder}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{placeholder}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

interface DateRangeFilterProps {
  from: string;
  to: string;
  onChange: (patch: { from?: string; to?: string }) => void;
}

export const DateRangeFilter = memo(function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  return (
    <div className="flex w-full items-center gap-2 sm:w-auto">
      <Input
        type="date"
        aria-label="Created from"
        value={from}
        max={to || undefined}
        onChange={(e) => onChange({ from: e.target.value })}
        className="sm:w-36"
      />
      <span className="text-sm text-muted-foreground">to</span>
      <Input
        type="date"
        aria-label="Created to"
        value={to}
        min={from || undefined}
        onChange={(e) => onChange({ to: e.target.value })}
        className="sm:w-36"
      />
    </div>
  );
});
