'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

import type {
  TestField,
  TestResult,
  TestSpec,
} from '@/modules/config/settings-test-specs';
import { apiPost } from '@/lib/api-client';
import { m } from '@/paraglide/messages.js';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: string;
  spec: TestSpec;
  groupTitle: string;
  /** Current (possibly unsaved) form values for this group, merged over saved config server-side. */
  configOverrides?: Record<string, string>;
}

export function SettingsTestDialog({
  open,
  onOpenChange,
  group,
  spec,
  groupTitle,
  configOverrides,
}: Props) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<TestResult | null>(null);

  const testMutation = useMutation({
    mutationFn: () =>
      apiPost<TestResult>('/api/admin/settings/test', {
        group,
        inputs,
        configs: configOverrides ?? {},
      }),
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (err: any) => {
      setResult({
        success: false,
        message: err?.message || m['admin.settings.test.error'](),
      });
    },
  });
  const running = testMutation.isPending;

  // Reset form + result each time the dialog opens for a new group
  useEffect(() => {
    if (!open) return;
    const initial: Record<string, string> = {};
    for (const f of spec.fields) {
      if (f.defaultValue) initial[f.name] = f.defaultValue;
    }
    setInputs(initial);
    setResult(null);
    testMutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, group, spec]);

  const canRun = useMemo(
    () => spec.fields.every((f) => !f.required || !!inputs[f.name]?.trim()),
    [spec.fields, inputs]
  );

  function handleRun() {
    setResult(null);
    testMutation.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {m['admin.settings.test.title']({ group: groupTitle })}
          </DialogTitle>
          <DialogDescription>
            {m['admin.settings.test.description']()}
          </DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleRun();
          }}
        >
          <div className="space-y-3">
            {spec.fields.map((field) => (
              <TestInput
                key={field.name}
                field={field}
                value={inputs[field.name] ?? ''}
                onChange={(v) =>
                  setInputs((prev) => ({ ...prev, [field.name]: v }))
                }
              />
            ))}
          </div>

          {result && <TestResultView result={result} />}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={running}
            >
              {m['admin.settings.test.close']()}
            </Button>
            <Button type="submit" disabled={running || !canRun}>
              {running && <Loader2 className="size-4 animate-spin" />}
              {running
                ? m['admin.settings.test.running']()
                : m['admin.settings.test.run']()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TestInput({
  field,
  value,
  onChange,
}: {
  field: TestField;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {field.type === 'textarea' ? (
        <textarea
          id={field.name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none"
        />
      ) : (
        <Input
          id={field.name}
          type={
            field.type === 'number'
              ? 'number'
              : field.type === 'email'
                ? 'email'
                : 'text'
          }
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
        />
      )}
    </div>
  );
}

function TestResultView({ result }: { result: TestResult }) {
  return (
    <div
      className={`rounded-lg border p-3 text-sm ${
        result.success
          ? 'border-emerald-500/30 bg-emerald-500/5'
          : 'border-destructive/30 bg-destructive/5'
      }`}
    >
      <div className="flex items-start gap-2 font-medium">
        {result.success ? (
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
        ) : (
          <XCircle className="text-destructive mt-0.5 size-4 shrink-0" />
        )}
        <span className={result.success ? '' : 'text-destructive'}>
          {result.message}
        </span>
      </div>

      {result.details && Object.keys(result.details).length > 0 && (
        <dl className="mt-3 space-y-1.5 text-xs">
          {Object.entries(result.details).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[auto_1fr] gap-2">
              <dt className="text-muted-foreground whitespace-nowrap">{k}:</dt>
              <dd className="break-all">
                {v?.startsWith('http') ? (
                  <a
                    href={v}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline underline-offset-2"
                  >
                    {v}
                  </a>
                ) : (
                  <span className="font-mono">{v}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
