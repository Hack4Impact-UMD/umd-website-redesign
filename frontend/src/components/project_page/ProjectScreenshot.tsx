import type { ScreenshotFrame } from '@/lib/screenshots';

interface ProjectScreenshotProps {
  src: string;
  alt: string;
  frame: ScreenshotFrame;
  /** Shown in the browser frame's address bar, e.g. the hosted project's domain. */
  url?: string;
  width?: number;
  height?: number;
  /**
   * In the hero the browser frame is a fixed window that bleeds off the
   * section's right and bottom edges, so it is squared off there and
   * whatever does not fit is lost off those same edges. In the gallery a
   * desktop capture shows whole, in its own shape, without browser chrome.
   */
  placement?: 'hero' | 'gallery';
}

/** Known dimensions reserve the image's space before it loads. */
const naturalRatio = (width?: number, height?: number) =>
  width && height ? { aspectRatio: `${width} / ${height}` } : undefined;

const hostOf = (url?: string) => {
  if (!url) return undefined;
  try {
    return new URL(url).host;
  } catch {
    return undefined;
  }
};

const FRAME_SHADOW = 'shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)]';

/** A desktop capture on its own, for the gallery: no browser chrome, just the screen. */
function PlainShot({ src, alt, width, height }: Omit<ProjectScreenshotProps, 'frame' | 'url' | 'placement'>) {
  return (
    <figure className={`overflow-hidden rounded-sm bg-white ring-1 ring-white/20 ${FRAME_SHADOW}`}>
      <img src={src} alt={alt} loading="lazy" style={naturalRatio(width, height)} className="block h-auto w-full" />
    </figure>
  );
}

function BrowserFrame({ src, alt, url, width, height, placement }: Omit<ProjectScreenshotProps, 'frame'>) {
  const host = hostOf(url);
  const isHero = placement === 'hero';

  return (
    <figure
      className={`overflow-hidden rounded-xl bg-white ring-1 ring-white/20 ${FRAME_SHADOW} ${isHero ? 'rounded-b-none rounded-r-none' : ''}`}
    >
      <div aria-hidden="true" className="flex items-center gap-3 bg-[#F1F3F5] px-3 py-1.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        {host ? (
          <span className="min-w-0 flex-1 truncate rounded bg-white px-3 py-0.5 text-center font-body text-[11px] leading-4 text-text-secondary">
            {host}
          </span>
        ) : null}
      </div>
      <img
        src={src}
        alt={alt}
        loading={isHero ? undefined : 'lazy'}
        style={naturalRatio(width, height)}
        // In the hero it bleeds off the right and bottom edges: pinned to the
        // top-left corner, as on the link-preview card, the header and
        // navigation stay in view and the overflow is lost off those edges.
        className={
          isHero
            ? 'block h-auto w-full !aspect-[16/10] object-cover object-left-top'
            : 'block h-auto w-full'
        }
      />
    </figure>
  );
}

/** A modern phone: a dark bezel with even margins and a camera pill over the screen. */
function PhoneFrame({ src, alt, width, height, placement }: Omit<ProjectScreenshotProps, 'frame' | 'url'>) {
  return (
    <figure className={`relative mx-auto w-full rounded-[2.75rem] bg-[#101418] p-2.5 ring-1 ring-white/15 ${FRAME_SHADOW}`}>
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-[18px] z-10 h-[22px] w-[30%] -translate-x-1/2 rounded-full bg-[#101418]"
      />
      <img
        src={src}
        alt={alt}
        loading={placement === 'hero' ? undefined : 'lazy'}
        style={naturalRatio(width, height)}
        className="block h-auto w-full rounded-[2.25rem] bg-white"
      />
    </figure>
  );
}

/**
 * A product screenshot. A phone-shaped capture is framed as a phone; a
 * desktop one as a browser window in the hero, and on its own in the gallery.
 */
export default function ProjectScreenshot({ frame, url, ...props }: ProjectScreenshotProps) {
  if (frame === 'phone') return <PhoneFrame {...props} />;
  if (props.placement === 'gallery') return <PlainShot {...props} />;
  return <BrowserFrame url={url} {...props} />;
}
