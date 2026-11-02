// Button pair for navy backgrounds (hero and closing CTA): solid white for the
// main action, white outline for the second.
const base =
  'inline-flex h-11 min-w-[200px] items-center justify-center rounded-lg px-6 font-heading text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-h4i-navy';

export const darkPrimaryButton = `${base} bg-white text-h4i-blue hover:bg-state-secondary-hover`;

export const darkSecondaryButton = `${base} border-2 border-white/80 bg-transparent text-white hover:border-white hover:bg-white/10`;
