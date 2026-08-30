import { useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { resetPassword } from '@/core/auth/client';
import { Link, useRouter } from '@/core/i18n/navigation';
import { envConfigs } from '@/config';
import { m } from '@/paraglide/messages.js';
import { TextField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';

const resetSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: m['common.sign.password_mismatch'](),
  });

function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    const linkError = params.get('error');
    setToken(linkError ? null : tokenParam);
    setTokenChecked(true);
  }, []);

  const form = useForm({
    defaultValues: { password: '', confirmPassword: '' },
    validators: { onSubmit: resetSchema },
    onSubmit: async ({ value }) => {
      setError('');
      if (!token) {
        setError(m['common.sign.reset_password_missing_token']());
        return;
      }
      try {
        const result = await resetPassword({
          newPassword: value.password,
          token,
        });
        if (result.error) {
          setError(result.error.message || 'Reset failed');
        } else {
          setSuccess(true);
          setTimeout(() => router.push('/sign-in'), 1500);
        }
      } catch (err: any) {
        setError(err.message || 'Reset failed');
      }
    },
  });

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="self-center font-serif text-lg italic">
          {envConfigs.app_name}
        </Link>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {m['common.sign.reset_password_title']()}
            </CardTitle>
            {!success && tokenChecked && token && (
              <CardDescription>
                {m['common.sign.reset_password_description']()}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {!tokenChecked ? null : !token ? (
              <FieldGroup>
                <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-center text-sm">
                  {m['common.sign.reset_password_invalid_token']()}
                </div>
                <Field>
                  <Link
                    href="/forgot-password"
                    className="text-center text-sm underline underline-offset-4"
                  >
                    {m['common.sign.forgot_password_title']()}
                  </Link>
                </Field>
              </FieldGroup>
            ) : success ? (
              <FieldGroup>
                <p className="text-center text-sm">
                  {m['common.sign.reset_password_success']()}
                </p>
                <Field>
                  <Link
                    href="/sign-in"
                    className="text-center text-sm underline underline-offset-4"
                  >
                    {m['common.sign.back_to_sign_in']()}
                  </Link>
                </Field>
              </FieldGroup>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
              >
                <FieldGroup>
                  {error && (
                    <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
                      {error}
                    </div>
                  )}
                  <form.Field name="password">
                    {(field) => (
                      <TextField
                        field={field}
                        label={m['common.sign.new_password_title']()}
                        type="password"
                        required
                        placeholder={m[
                          'common.sign.new_password_placeholder'
                        ]()}
                      />
                    )}
                  </form.Field>
                  <form.Field name="confirmPassword">
                    {(field) => (
                      <TextField
                        field={field}
                        label={m['common.sign.confirm_password_title']()}
                        type="password"
                        required
                        placeholder={m[
                          'common.sign.confirm_new_password_placeholder'
                        ]()}
                      />
                    )}
                  </form.Field>
                  <Field>
                    <form.Subscribe selector={(s) => s.isSubmitting}>
                      {(isSubmitting) => (
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting
                            ? '...'
                            : m['common.sign.reset_password_submit']()}
                        </Button>
                      )}
                    </form.Subscribe>
                    <FieldDescription className="text-center">
                      <Link
                        href="/sign-in"
                        className="underline underline-offset-4"
                      >
                        {m['common.sign.back_to_sign_in']()}
                      </Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/(auth)/reset-password')({
  component: ResetPasswordPage,
});
