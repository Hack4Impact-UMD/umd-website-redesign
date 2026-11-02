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
import PageHero from '@/components/shared/PageHero';
import teamShowcase from '@/components/assets/about/team-showcase.webp?url';
import { defaultSiteSettings, type SiteSettings } from '@/content-schema/site-settings';

interface ContactUsSectionProps {
  settings?: SiteSettings;
}

export default function ContactUsSection({ settings = defaultSiteSettings }: ContactUsSectionProps) {
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
    <main className="bg-white">
      <PageHero
        title="Contact us"
        image={teamShowcase}
        imageAlt="Hack4Impact UMD student team gathered after a project presentation"
        headingId="contact-title"
      >
        <p className="mt-6 font-body text-base leading-relaxed text-white/90 sm:text-lg">
          Have a question, an idea, or a mission we can support? We&apos;d love to hear what
          you&apos;re working on.
        </p>
      </PageHero>

      <section aria-label="Contact options" className="px-6 py-16 sm:px-8 lg:px-24 lg:py-24">
        <div className="mx-auto grid max-w-[1248px] gap-10 lg:grid-cols-12 lg:gap-16">
          <h2 className="text-section text-foreground lg:col-span-4">Get in touch</h2>

          <div className="border-t border-black/10 lg:col-span-8">
            <article className="grid gap-3 border-b border-black/10 py-8 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-8">
              <div className="flex items-center gap-3 self-start sm:pt-1">
                <Mail className="h-5 w-5 shrink-0 text-h4i-blue" aria-hidden="true" />
                <h3 className="font-heading text-2xl font-normal tracking-tight text-foreground">Email</h3>
              </div>
              <div>
                <ApplyLink
                  href={`mailto:${footer.contact.email}`}
                  className="group inline-flex max-w-full items-center gap-2 rounded-sm font-heading text-2xl font-normal tracking-tight text-h4i-blue underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2 sm:text-3xl"
                >
                  <span className="break-all">{footer.contact.email}</span>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </ApplyLink>
                <p className="mt-3 font-body text-lg leading-relaxed text-text-secondary">
                  The fastest way to reach our student leadership team about applications,
                  partnerships, sponsorships, or projects.
                </p>
              </div>
            </article>

            <article className="grid gap-3 border-b border-black/10 py-8 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-8">
              <div className="flex items-center gap-3 self-start sm:pt-1">
                <MapPin className="h-5 w-5 shrink-0 text-h4i-blue" aria-hidden="true" />
                <h3 className="font-heading text-2xl font-normal tracking-tight text-foreground">Based at UMD</h3>
              </div>
              <div>
                <address className="font-body text-lg not-italic leading-relaxed text-foreground">
                  {footer.contact.addressLines.map((line) => <div key={line}>{line}</div>)}
                </address>
                <p className="mt-3 font-body text-lg leading-relaxed text-text-secondary">
                  Our chapter is part of the University of Maryland community.
                </p>
              </div>
            </article>

            <article className="grid gap-3 py-8 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-8">
              <div className="flex items-center gap-3 self-start sm:pt-1">
                <Users className="h-5 w-5 shrink-0 text-h4i-blue" aria-hidden="true" />
                <h3 className="font-heading text-2xl font-normal tracking-tight text-foreground">Follow our work</h3>
              </div>
              <div>
                <p className="font-body text-lg leading-relaxed text-text-secondary">
                  Chapter news, events, and projects across our community channels.
                </p>
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3" aria-label="Chapter links">
                  {communityLinks.map(({ label, href, Icon }) => (
                    <li key={`${label}-${href}`}>
                      <ApplyLink
                        href={href}
                        className="inline-flex min-h-11 items-center gap-2 rounded-sm font-heading text-base font-bold text-h4i-blue underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                        {label}
                      </ApplyLink>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
