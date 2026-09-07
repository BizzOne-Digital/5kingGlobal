'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Label, Input, Select, Textarea, FieldError } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { apiClient, ApiError } from '@/lib/api-client';
import { CUSTOMER_TYPES } from '@/lib/constants';
import type { IService } from '@/models/Service';

interface FormState {
  name: string;
  email: string;
  phone: string;
  customerType: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  website: string; // honeypot
}

const initialState: FormState = {
  name: '',
  email: '',
  phone: '',
  customerType: 'residential',
  service: '',
  preferredDate: '',
  preferredTime: '',
  message: '',
  website: '',
};

export function BookingForm({ services }: { services: IService[] }) {
  const [form, setForm] = useState<FormState>(initialState);
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
      await apiClient.post('/api/bookings', form);
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
        <h3 className="mt-4 font-display text-xl text-navy-950">Request received</h3>
        <p className="mt-2 text-navy-600">
          Thank you — a member of our team will contact you shortly to confirm your appointment.
          We do not automatically confirm bookings; you&apos;ll hear from us directly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && <FieldError>{errors.form}</FieldError>}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>Full Name</Label>
          <Input id="name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
          <FieldError>{errors.name}</FieldError>
        </div>
        <div>
          <Label htmlFor="email" required>Email</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
          <FieldError>{errors.email}</FieldError>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone" required>Phone Number</Label>
          <Input id="phone" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
          <FieldError>{errors.phone}</FieldError>
        </div>
        <div>
          <Label htmlFor="customerType" required>I am a…</Label>
          <Select id="customerType" value={form.customerType} onChange={(e) => update('customerType', e.target.value)} required>
            {CUSTOMER_TYPES.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="service" required>Service Needed</Label>
        <Select id="service" value={form.service} onChange={(e) => update('service', e.target.value)} required>
          <option value="">Select a service…</option>
          {services.map((service) => (
            <option key={service.slug} value={service.title}>{service.title}</option>
          ))}
          <option value="Other">Other / Not Sure</option>
        </Select>
        <FieldError>{errors.service}</FieldError>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="preferredDate">Preferred Date</Label>
          <Input id="preferredDate" type="date" value={form.preferredDate} onChange={(e) => update('preferredDate', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="preferredTime">Preferred Time</Label>
          <Input id="preferredTime" placeholder="e.g. Morning, 2–4pm" value={form.preferredTime} onChange={(e) => update('preferredTime', e.target.value)} />
        </div>
      </div>

      <div>
        <Label htmlFor="message">Additional Details</Label>
        <Textarea id="message" rows={4} value={form.message} onChange={(e) => update('message', e.target.value)} />
      </div>

      {/* Honeypot field — hidden from real users via CSS, catches simple bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update('website', e.target.value)} />
      </div>

      <Button type="submit" variant="gold" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? 'Submitting…' : 'Book a Service'}
      </Button>
    </form>
  );
}
