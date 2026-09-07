import Image from 'next/image';
import { GraduationCap, Briefcase, TrendingUp } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { STOCK_IMAGES } from '@/lib/stock-images';

const PROGRAMS = [
  {
    icon: GraduationCap,
    title: 'Training',
    description: 'Hands-on training pathways across security, electrical, and trade disciplines.',
  },
  {
    icon: Briefcase,
    title: 'Recruiting & Hiring',
    description: 'Active recruiting across technical, sales, and field service roles nationwide.',
  },
  {
    icon: TrendingUp,
    title: 'Job Placement',
    description: 'A workforce development team dedicated to developing individuals and placing them into fulfilling roles.',
  },
];

export function RecruitingSection() {
  return (
    <section id="careers" className="relative overflow-hidden bg-navy-950 py-24">
      <div className="absolute inset-0">
        <Image
          src={STOCK_IMAGES.trainingWorkshop}
          alt="Trainees learning technical skills in a workshop setting"
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />
      </div>
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            Workforce Development
          </p>
          <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">Join our team.</h2>
          <p className="mt-4 text-white/70">
            As a trusted brand in home and commercial security, 5Kings Global places the same
            trust in our team members. We&apos;re proud to offer a diverse range of fulfilling
            roles within the United States — for technicians, sales professionals, and recruits
            ready to build a career.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PROGRAMS.map((program, index) => (
            <Reveal key={program.title} delay={index * 100}>
              <div className="h-full rounded-md border border-white/10 bg-white/5 p-8 backdrop-blur">
                <program.icon className="h-8 w-8 text-gold-300" strokeWidth={1.5} />
                <h3 className="mt-5 font-display text-xl text-white">{program.title}</h3>
                <p className="mt-2 text-sm text-white/60">{program.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button href="/contact?subject=careers" variant="gold" size="lg">
            Submit Your Information
          </Button>
        </div>
      </Container>
    </section>
  );
}
