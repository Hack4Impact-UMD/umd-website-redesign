import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Github, Linkedin, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSiteSettings } from '@/api/content';
import { defaultSiteSettings } from '@/api/defaultContent';
import { useApiData } from '@/hooks/useApiData';
import { resolveMediaUrl } from '@/lib/media';
import h4iLogo from '@/components/assets/h4i_files/h4i_logo.svg';

const iconMap: Record<string, LucideIcon> = {
  Instagram,
  Facebook,
  Github,
  Linkedin,
};

export default function Footer() {
  const siteSettings = useApiData(useCallback(() => getSiteSettings(), []), defaultSiteSettings);
  const footer = siteSettings.data.footer;
  const brandingLogo = resolveMediaUrl(siteSettings.data.branding.logo) || h4iLogo;

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');

    try {
      // Newsletter backend integration is intentionally deferred in this migration.
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img
                src={brandingLogo}
                alt="Hack4Impact UMD Logo"
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>

            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              {footer.newsletterPrompt}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-h4i-blue"
                required
              />
              <Button
                type="submit"
                disabled={status === 'loading'}
                className="w-full h-10 bg-white text-[#0F172A] hover:bg-white/90 font-medium"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </Button>
              {status === 'success' && (
                <p className="text-xs text-h4i-mint">Subscribed successfully!</p>
              )}
              {status === 'error' && (
                <p className="text-xs text-state-error">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>

            <div className="flex gap-4 mt-6">
              {footer.socialLinks.map((item) => {
                const Icon = iconMap[item.icon] ?? Linkedin;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    aria-label={item.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-white/80 mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              {footer.exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-white/80 mb-4">
              Apply
            </h4>
            <ul className="space-y-3">
              {footer.applyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-white/80 mb-4">
              Contact Us
            </h4>
            <address className="not-italic space-y-3">
              <p className="text-sm text-white/60">
                {footer.contact.addressLines.map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < footer.contact.addressLines.length - 1 ? <br /> : null}
                  </span>
                ))}
              </p>
              <a
                href={`mailto:${footer.contact.email}`}
                className="text-sm text-white/60 hover:text-white transition-colors block"
              >
                {footer.contact.email}
              </a>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Hack4Impact UMD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
