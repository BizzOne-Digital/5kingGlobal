import { Star } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import type { ITestimonial } from '@/models/Testimonial';

export function TestimonialsSection({ testimonials }: { testimonials: ITestimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="Client Feedback"
          title="What our customers say"
          align="center"
          className="mx-auto"
        />
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Reveal key={testimonial._id.toString()} delay={index * 100}>
              <div className="flex h-full flex-col rounded-md border border-navy-900/10 bg-navy-50/40 p-8">
                <div className="flex gap-1 text-gold-500">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-navy-700">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="mt-6">
                  <p className="font-semibold text-navy-950">{testimonial.name}</p>
                  {testimonial.company && <p className="text-sm text-navy-500">{testimonial.company}</p>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
