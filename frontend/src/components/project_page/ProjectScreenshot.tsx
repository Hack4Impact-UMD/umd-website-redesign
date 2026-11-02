interface ProjectScreenshotProps {
  src: string;
  alt: string;
  /** Shown in the address bar, e.g. the hosted project's domain. */
  url?: string;
}

const hostOf = (url?: string) => {
  if (!url) return undefined;
  try {
    return new URL(url).host;
  } catch {
    return undefined;
  }
};

/** A product screenshot in a minimal browser frame, for the project hero. */
export default function ProjectScreenshot({ src, alt, url }: ProjectScreenshotProps) {
  const host = hostOf(url);

  return (
    // Squared off at the bottom and right from xl, where the hero crops it at its edges.
    <figure className="overflow-hidden rounded-xl bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/20 xl:rounded-b-none xl:rounded-r-none">
      <div aria-hidden="true" className="flex items-center gap-3 border-b border-black/10 bg-[#F1F3F5] px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        </div>
        {host ? (
          <span className="min-w-0 flex-1 truncate rounded-md bg-white px-3 py-1 text-center font-body text-xs text-text-secondary">
            {host}
          </span>
        ) : null}
      </div>
      <img src={src} alt={alt} className="block aspect-[16/10] w-full object-cover object-top" />
    </figure>
  );
}
