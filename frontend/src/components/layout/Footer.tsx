import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const footerLinks = {
  explore: [
    { label: 'About Us', href: '/aboutus' },
    { label: 'Our Work', href: '/ourwork' },
    { label: 'Contact', href: '/contactus' },
  ],
  apply: [
    { label: 'For Students', href: '/apply/student' },
    { label: 'For Nonprofits', href: '/apply/nonprofit' },
  ],
  connect: [
    { label: 'Instagram', href: 'https://instagram.com/hack4impactumd', icon: Instagram },
    { label: 'GitHub', href: 'https://github.com/Hack4Impact-UMD', icon: Github },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/hack4impact-umd', icon: Linkedin },
    { label: 'Facebook', href: 'https://facebook.com/hack4impactumd', icon: Facebook },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('success');
    setEmail('');
  };

  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-h4i-blue"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M8 12L11 15L16 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-heading text-lg font-bold">hack4impact-UMD</span>
            </Link>

            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              Subscribe to our newsletter to receive monthly updates.
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
                className="w-full h-10 bg-white text-[#0F172A] hover:bg-white/90 font-medium"
              >
                Subscribe
              </Button>
              {status === 'success' && (
                <p className="text-xs text-h4i-mint">Subscribed successfully!</p>
              )}
            </form>

            <div className="flex gap-4 mt-6">
              {footerLinks.connect.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label={item.label}
                >
                  <item.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-white/80 mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
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
              {footerLinks.apply.map((link) => (
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
                7809 Regents Drive,
                <br />
                College Park, MD 20742
              </p>
              <a
                href="mailto:umd@hack4impact.org"
                className="text-sm text-white/60 hover:text-white transition-colors block"
              >
                umd@hack4impact.org
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
