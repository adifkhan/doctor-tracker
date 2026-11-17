"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const SearchInput = memo(function SearchInput({
  value,
  onChange,
  placeholder,
}: SearchInputProps) {
  const [text, setText] = useState(value);
  const emitted = useRef(value);
  const { debounced, cancel } = useDebouncedCallback((next: string) => {
    emitted.current = next;
    onChange(next);
  });

  useEffect(() => {
    if (value !== emitted.current) {
      cancel();
      emitted.current = value;
      setText(value);
    }
  }, [value, cancel]);

  const handleChange = (next: string) => {
    setText(next);
    debounced(next.trim());
  };

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        className="px-9"
      />
      {text && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            cancel();
            setText("");
            emitted.current = "";
            onChange("");
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
});
