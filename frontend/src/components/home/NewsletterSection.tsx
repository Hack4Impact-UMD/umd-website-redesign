import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const stats = [
  { value: '149', label: 'active members' },
  { value: '7', label: 'nonprofits supported' },
  { value: '6', label: 'semesters running' },
  { value: '15', label: 'team-building events' },
  { value: '160', label: 'students and guests attended Hack4Impact Free Showcase' },
  { value: '200+', label: 'applicants' },
];

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    // Placeholder - would connect to EmailJS or similar
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Check Out Our Recent Newsletter
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Stay updated with the latest news from Hack4Impact UMD. Get insights into our projects,
              events, and the impact we're making in the community.
            </p>

            <div className="mb-8">
              <h3 className="font-heading text-lg font-bold text-foreground mb-4">
                Subscribe For Updates
              </h3>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 px-4 bg-card border-border"
                  required
                />
                <Button
                  type="submit"
                  disabled={status === 'loading'}
                  className="h-12 px-8 bg-foreground hover:bg-foreground/90 text-background font-medium"
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
              {status === 'success' && (
                <p className="mt-3 text-sm text-state-success">
                  Thanks for subscribing! Check your inbox for confirmation.
                </p>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
              <div className="bg-h4i-blue px-6 py-4">
                <p className="text-xs text-white/70 mb-1">January 5, 2025</p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">H</span>
                  </div>
                  <span className="text-white text-sm font-medium">Hack4Impact-UMD</span>
                </div>
                <h4 className="font-heading text-xl font-bold text-white">
                  Fall Semester Recap Newsletter
                </h4>
              </div>

              <div className="p-6">
                <div className="border-b border-border pb-4 mb-4">
                  <h5 className="font-heading font-bold text-foreground mb-2">
                    End of Semester Recap
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    Here's our summary of what happened recently this fall semester!
                  </p>
                </div>

                <div className="space-y-3">
                  {stats.slice(0, 4).map((stat, index) => (
                    <div key={index} className="flex items-baseline gap-2">
                      <span className="font-heading text-2xl font-bold text-h4i-blue">
                        {stat.value}
                      </span>
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-h4i-mint/20 rounded-full blur-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-h4i-blue/20 rounded-full blur-2xl -z-10" />
          </div>
        </div>

        <div className="mt-16 pt-12 border-t border-border">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-heading text-3xl md:text-4xl font-bold text-h4i-blue mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
