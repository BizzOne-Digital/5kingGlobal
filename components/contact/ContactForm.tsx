'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Label, Input, Textarea, FieldError } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { apiClient, ApiError } from '@/lib/api-client';

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  website: string;
}

export function ContactForm({ defaultSubject = '' }: { defaultSubject?: string }) {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    subject: defaultSubject,
    message: '',
    website: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    try {
      await apiClient.post('/api/contact', form);
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof ApiError && error.details) {
        const fieldErrors = (error.details as { fieldErrors?: Record<string, string[]> }).fieldErrors;
        if (fieldErrors) {
          const flat: Record<string, string> = {};
          Object.entries(fieldErrors).forEach(([key, messages]) => {
            if (messages?.[0]) flat[key] = messages[0];
          });
          setErrors(flat);
        }
      } else if (error instanceof ApiError) {
        setErrors({ form: error.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="rounded-md border border-emerald-200 bg-emerald-50 p-10 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <h3 className="mt-4 font-display text-xl text-navy-950">Message sent</h3>
        <p className="mt-2 text-navy-600">
          Thanks for reaching out — we typically respond within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && <FieldError>{errors.form}</FieldError>}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="c-name" required>Full Name</Label>
          <Input id="c-name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
          <FieldError>{errors.name}</FieldError>
        </div>
        <div>
          <Label htmlFor="c-email" required>Email</Label>
          <Input id="c-email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
          <FieldError>{errors.email}</FieldError>
        </div>
      </div>

      <div>
        <Label htmlFor="c-phone">Phone Number</Label>
        <Input id="c-phone" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
      </div>

      <div>
        <Label htmlFor="c-subject" required>Subject</Label>
        <Input id="c-subject" value={form.subject} onChange={(e) => update('subject', e.target.value)} required />
        <FieldError>{errors.subject}</FieldError>
      </div>

      <div>
        <Label htmlFor="c-message" required>Message</Label>
        <Textarea id="c-message" rows={5} value={form.message} onChange={(e) => update('message', e.target.value)} required />
        <FieldError>{errors.message}</FieldError>
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="c-website">Leave this field empty</label>
        <input id="c-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update('website', e.target.value)} />
      </div>

      <Button type="submit" variant="gold" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  );
}
