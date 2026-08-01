import { Facebook, Github, Instagram, Linkedin, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import footerMark from '@/components/assets/h4i-footer-mark.png';
import { defaultSiteSettings, type SiteSettings } from '@/content/site-settings';

const socialIcons: Partial<Record<string, LucideIcon>> = {
  facebook: Facebook,
  github: Github,
  instagram: Instagram,
  linkedin: Linkedin,
};

const FooterLink = ({ href, label }: { href: string; label: string }) =>
  href.startsWith('/') ? (
    <Link to={href} className="rounded-sm text-base leading-6 text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#0F172A]">
      {label}
    </Link>
  ) : (
    <a href={href} className="rounded-sm text-base leading-6 text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#0F172A]">
      {label}
    </a>
  );

interface FooterProps {
  settings?: SiteSettings;
}

export default function Footer({ settings = defaultSiteSettings }: FooterProps) {
  const { footer } = settings;
  const socialLinks = footer.socialLinks.flatMap((item) => {
    const Icon = socialIcons[item.icon.toLowerCase()];
    return Icon ? [{ ...item, Icon }] : [];
  });

  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-24">
        <h2 className="sr-only">Hack4Impact UMD site links</h2>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[minmax(240px,300px)_1fr] md:justify-between lg:gap-20">
          <div className="max-w-[300px]">
            <Link to="/" className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#0F172A]">
              <img
                src={footerMark}
                alt="Hack4Impact UMD"
                className="h-16 w-16 object-contain"
              />
            </Link>

            <p className="mt-4 text-base leading-6 text-white/90">{footer.newsletterPrompt}</p>
            {footer.newsletterUrl && (
              <div className="mt-4">
                <a
                  href={footer.newsletterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white px-6 py-2 text-label font-bold transition-colors hover:bg-white hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#0F172A]"
                >
                  Read our newsletter
                </a>
              </div>
            )}

            {socialLinks.length > 0 && (
              <ul aria-label="Social media" className="mt-5 flex flex-wrap gap-2">
                {socialLinks.map(({ Icon, href, label }) => (
                  <li key={`${label}-${href}`}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      aria-label={label}
                    >
                      <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
            <section aria-labelledby="footer-explore-heading">
              <h3 id="footer-explore-heading" className="text-[22px] font-bold leading-[30px]">Explore</h3>
              <ul className="mt-3 space-y-2">
                {footer.exploreLinks.map((item) => (
                  <li key={`${item.label}-${item.href}`}><FooterLink {...item} /></li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="footer-apply-heading">
              <h3 id="footer-apply-heading" className="text-[22px] font-bold leading-[30px]">Apply</h3>
              <ul className="mt-3 space-y-2">
                {footer.applyLinks.map((item) => (
                  <li key={`${item.label}-${item.href}`}><FooterLink {...item} /></li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="footer-contact-heading">
              <h3 id="footer-contact-heading" className="text-[22px] font-bold leading-[30px]">Contact Us</h3>
              <address className="mt-3 not-italic text-base leading-6 text-white/80">
                {footer.contact.addressLines.map((line) => <div key={line}>{line}</div>)}
                <a
                  href={`mailto:${footer.contact.email}`}
                  className="mt-2 inline-block max-w-full rounded-sm [overflow-wrap:anywhere] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#0F172A]"
                >
                  {footer.contact.email}
                </a>
              </address>
            </section>
          </div>
        </div>

        <p className="mt-12 border-t border-white/15 pt-6 text-center text-sm leading-5 text-white/60">
          © {new Date().getFullYear()} Hack4Impact UMD. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
