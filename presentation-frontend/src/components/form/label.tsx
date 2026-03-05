import type { LabelHTMLAttributes } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ children, ...props }: LabelProps) {
  return (
    <label {...props} className="block mb-1 font-medium text-sm">
      {children}
    </label>
  );
}
