const base =
  'inline-flex h-11 min-w-[200px] items-center justify-center rounded-lg px-6 font-heading text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

// For navy backgrounds (heroes and closing CTAs): solid white for the main
// action, white outline for the second.
export const darkPrimaryButton = `${base} bg-white text-h4i-blue hover:bg-state-secondary-hover focus-visible:ring-white focus-visible:ring-offset-h4i-navy`;

export const darkSecondaryButton = `${base} border-2 border-white/80 bg-transparent text-white hover:border-white hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-h4i-navy`;

// For white and grey backgrounds.
export const lightPrimaryButton = `${base} bg-[#0056A3] text-white hover:bg-state-primary-hover focus-visible:ring-h4i-blue`;

// An action that isn't available yet (e.g. applications closed): same shape,
// no hover, dimmed. Render on a <span aria-disabled> rather than a link.
const unavailable = `${base} cursor-not-allowed opacity-60`;
export const darkPrimaryButtonUnavailable = `${unavailable} bg-white text-h4i-blue`;
export const lightPrimaryButtonUnavailable = `${unavailable} bg-[#0056A3] text-white`;
