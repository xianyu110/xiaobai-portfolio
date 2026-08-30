import type { AnyFieldApi } from '@tanstack/react-form';

import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

function fieldError(field: AnyFieldApi): string | null {
  if (!field.state.meta.isTouched) return null;
  const errs = field.state.meta.errors;
  if (!errs?.length) return null;
  const first = errs[0] as unknown;
  if (typeof first === 'string') return first;
  if (first && typeof first === 'object' && 'message' in first) {
    return String((first as { message: unknown }).message);
  }
  return String(first);
}

// Standard text input wired to a TanStack Form field — label, value,
// blur/change handlers and first-error display in one component.
export function TextField({
  field,
  label,
  type = 'text',
  placeholder,
  autoComplete,
  required,
  disabled,
}: {
  field: AnyFieldApi;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const error = fieldError(field);

  return (
    <Field>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        value={(field.state.value as string) ?? ''}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
    </Field>
  );
}
