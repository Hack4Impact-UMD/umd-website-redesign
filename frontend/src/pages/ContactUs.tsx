import { Mail, MapPin } from 'lucide-react';

import ApplyLink from '@/components/apply/ApplyLink';
import { defaultSiteSettings, type SiteSettings } from '@/content/site-settings';

interface ContactUsProps {
  settings?: SiteSettings;
}

export default function ContactUs({ settings = defaultSiteSettings }: ContactUsProps) {
  const { footer } = settings;
  const communityLinks = [
    ...footer.socialLinks.map(({ label, href }) => ({ label, href })),
    ...footer.exploreLinks.filter(({ href }) => href.startsWith('https://')),
  ];

  return (
    <main className="bg-background">
      <section className="bg-h4i-blue px-6 py-16 text-white lg:px-24 lg:py-20">
        <div className="mx-auto max-w-[1248px] text-center">
          <h1 className="font-heading text-h1 font-bold text-white sm:text-display">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-7 text-white/90">
            Questions about joining, partnering, sponsoring, or our projects? Reach the Hack4Impact UMD team directly.
          </p>
        </div>
      </section>

      <section aria-label="Contact options" className="px-6 py-16 lg:px-24 lg:py-20">
        <div className="mx-auto grid max-w-[1000px] gap-6 md:grid-cols-2">
          <article className="rounded-xl border border-border bg-card p-8 shadow-sm">
            <Mail className="h-8 w-8 text-h4i-blue" aria-hidden="true" />
            <h2 className="mt-5 font-heading text-h2 font-bold text-foreground">Email</h2>
            <p className="mt-3 text-base leading-6 text-muted-foreground">
              Email is the fastest way to reach our student leadership team.
            </p>
            <ApplyLink
              href={`mailto:${footer.contact.email}`}
              className="mt-6 inline-flex rounded-lg bg-h4i-blue px-5 py-3 font-heading text-label font-bold text-white transition-colors hover:bg-state-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
            >
              {footer.contact.email}
            </ApplyLink>
          </article>

          <article className="rounded-xl border border-border bg-card p-8 shadow-sm">
            <MapPin className="h-8 w-8 text-h4i-blue" aria-hidden="true" />
            <h2 className="mt-5 font-heading text-h2 font-bold text-foreground">Find and follow us</h2>
            <address className="mt-3 not-italic text-base leading-6 text-muted-foreground">
              {footer.contact.addressLines.map((line) => <div key={line}>{line}</div>)}
            </address>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-3" aria-label="Chapter links">
              {communityLinks.map(({ label, href }) => (
                <li key={`${label}-${href}`}>
                  <ApplyLink
                    href={href}
                    className="font-heading text-label font-bold text-h4i-blue underline underline-offset-4 hover:text-state-primary-hover"
                  >
                    {label}
                  </ApplyLink>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
