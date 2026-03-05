import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ ...props }: InputProps) {
  return (
    <input
      {...props}
      className="w-full rounded-lg px-2 py-1.5 border border-neutral-300 outline-0 focus:ring-1 focus:border-blue-500 focus:ring-blue-500 transition-all"
    />
  );
}
