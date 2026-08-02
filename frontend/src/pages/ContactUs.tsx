import {
  ArrowUpRight,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Users,
  type LucideIcon,
} from 'lucide-react';

import ApplyLink from '@/components/apply/ApplyLink';
import teamShowcase from '@/components/assets/about/team-showcase.webp';
import { defaultSiteSettings, type SiteSettings } from '@/content/site-settings';

interface ContactUsProps {
  settings?: SiteSettings;
}

export default function ContactUs({ settings = defaultSiteSettings }: ContactUsProps) {
  const { footer } = settings;
  const socialIcons: Record<string, LucideIcon> = {
    Facebook,
    Github,
    Instagram,
    Linkedin,
  };
  const communityLinks = [
    ...footer.socialLinks.map(({ label, href, icon }) => ({
      label,
      href,
      Icon: socialIcons[icon] ?? Users,
    })),
    ...footer.exploreLinks
      .filter(({ href }) => href.startsWith('https://'))
      .map(({ label, href }) => ({ label, href, Icon: Users })),
  ];

  return (
    <main className="overflow-hidden bg-white">
      <section aria-labelledby="contact-title" className="relative isolate border-b border-slate-100 bg-[#F7FAFC]">
        <div className="absolute -left-32 top-6 -z-10 h-72 w-72 rounded-full bg-h4i-mint-light/70 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-h4i-blue-light/55 blur-3xl" aria-hidden="true" />

        <div className="mx-auto grid max-w-[1248px] items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-12 lg:py-24 xl:px-0">
          <div className="max-w-xl">
            <p className="text-label font-bold uppercase tracking-[0.18em] text-h4i-blue">Let&apos;s connect</p>
            <h1 id="contact-title" className="mt-4 font-heading text-[48px] font-bold leading-[1.04] tracking-[-0.03em] text-foreground sm:text-[64px]">
              Contact Us
            </h1>
            <p className="mt-6 max-w-lg text-xl leading-8 text-slate-600">
              Have a question, an idea, or a mission we can support? We&apos;d love to hear what you&apos;re working on.
            </p>
            <div className="mt-8 flex flex-wrap gap-2" aria-label="Reasons to contact us">
              {['Student applications', 'Nonprofit partnerships', 'Sponsorships', 'Projects'].map((label) => (
                <span key={label} className="rounded-full border border-h4i-blue/15 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm">
                  {label}
                </span>
              ))}
            </div>
          </div>

          <figure className="relative mx-auto w-full max-w-[650px]">
            <div className="absolute -bottom-4 -left-4 h-full w-full rounded-[32px] bg-h4i-mint" aria-hidden="true" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] border-4 border-white bg-slate-200 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.45)]">
              <img
                src={teamShowcase}
                alt="Hack4Impact UMD student team gathered after a project presentation"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 to-transparent px-6 pb-5 pt-16 sm:px-8 sm:pb-7" aria-hidden="true">
                <p className="text-base font-bold leading-6 text-white sm:text-lg">Students and nonprofits, building for impact together.</p>
              </div>
            </div>
          </figure>
        </div>
      </section>

      <section aria-label="Contact options" className="bg-[#EFF5F8] px-6 py-16 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1120px]">
          <div className="max-w-2xl">
            <p className="text-label font-bold uppercase tracking-[0.18em] text-h4i-blue">Start a conversation</p>
            <h2 className="mt-3 text-[34px] font-bold leading-tight text-slate-900 sm:text-[42px]">Choose the best way to reach us.</h2>
          </div>

          <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <article className="relative isolate flex min-h-[430px] flex-col overflow-hidden rounded-[28px] bg-[#0F172A] p-8 text-white shadow-[0_18px_55px_-34px_rgba(15,23,42,0.8)] sm:p-10">
              <div className="absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full bg-h4i-blue/45 blur-2xl" aria-hidden="true" />
              <div className="absolute -bottom-24 -left-20 -z-10 h-72 w-72 rounded-full bg-h4i-mint/20 blur-3xl" aria-hidden="true" />
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                <Mail className="h-7 w-7 text-h4i-mint" aria-hidden="true" />
              </div>
              <h3 className="mt-8 text-[30px] font-bold leading-tight text-white">Email our team</h3>
              <p className="mt-4 max-w-md text-lg leading-7 text-white/72">
                Email is the fastest way to reach our student leadership team about applications, partnerships, sponsorships, or projects.
              </p>
              <div className="mt-auto pt-10">
                <ApplyLink
                  href={`mailto:${footer.contact.email}`}
                  className="group inline-flex max-w-full items-center gap-3 rounded-xl bg-white px-5 py-4 font-heading text-base font-bold text-slate-900 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-mint focus-visible:ring-offset-4 focus-visible:ring-offset-[#0F172A] sm:text-lg"
                >
                  <span className="break-all">{footer.contact.email}</span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-h4i-blue transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </ApplyLink>
              </div>
            </article>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <article className="rounded-[28px] border border-slate-200/80 bg-white p-8 shadow-[0_16px_45px_-36px_rgba(15,23,42,0.6)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-h4i-blue-light/60">
                  <MapPin className="h-6 w-6 text-h4i-blue" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-slate-900">Based at UMD</h3>
                <p className="mt-2 text-base leading-6 text-slate-600">Our chapter is part of the University of Maryland community.</p>
                <address className="mt-5 not-italic text-base font-bold leading-6 text-slate-800">
                  {footer.contact.addressLines.map((line) => <div key={line}>{line}</div>)}
                </address>
              </article>

              <article className="rounded-[28px] border border-slate-200/80 bg-white p-8 shadow-[0_16px_45px_-36px_rgba(15,23,42,0.6)]">
                <h3 className="text-2xl font-bold text-slate-900">Follow our work</h3>
                <p className="mt-2 text-base leading-6 text-slate-600">See chapter news, events, and projects across our community channels.</p>
                <ul className="mt-6 flex flex-wrap gap-3" aria-label="Chapter links">
                  {communityLinks.map(({ label, href, Icon }) => (
                    <li key={`${label}-${href}`}>
                      <ApplyLink
                        href={href}
                        className="group inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-heading text-sm font-bold text-slate-700 transition-colors hover:border-h4i-blue/40 hover:bg-h4i-blue-light/30 hover:text-h4i-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
                      >
                        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                        {label}
                      </ApplyLink>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
