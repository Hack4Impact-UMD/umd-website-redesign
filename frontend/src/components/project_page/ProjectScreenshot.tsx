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
   * In the hero the browser frame is squared off at the bottom and right from
   * xl, where the hero crops it at its edges. Elsewhere it is rounded all round.
   */
  placement?: 'hero' | 'gallery';
}

const hostOf = (url?: string) => {
  if (!url) return undefined;
  try {
    return new URL(url).host;
  } catch {
    return undefined;
  }
};

const FRAME_SHADOW = 'shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)]';

function BrowserFrame({ src, alt, url, placement }: Omit<ProjectScreenshotProps, 'frame'>) {
  const host = hostOf(url);
  const cropped = placement === 'hero' ? 'xl:rounded-b-none xl:rounded-r-none' : '';

  return (
    <figure className={`overflow-hidden rounded-xl bg-white ring-1 ring-white/20 ${FRAME_SHADOW} ${cropped}`}>
      <div aria-hidden="true" className="flex items-center gap-3 border-b border-black/10 bg-[#F1F3F5] px-3 py-1.5">
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
      <img src={src} alt={alt} loading={placement === 'hero' ? undefined : 'lazy'} className="block aspect-[16/10] w-full object-cover object-top" />
    </figure>
  );
}

/** A modern phone: a dark bezel with even margins and a camera pill over the screen. */
function PhoneFrame({ src, alt, width, height, placement }: Omit<ProjectScreenshotProps, 'frame' | 'url'>) {
  // The capture's own shape when known, so nothing is cropped; else a typical phone.
  const aspectRatio = width && height ? `${width} / ${height}` : '9 / 19.5';

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
        style={{ aspectRatio }}
        className="block w-full rounded-[2.25rem] bg-white object-cover object-top"
      />
    </figure>
  );
}

/** A product screenshot, framed as a browser window or, for a phone-shaped capture, a phone. */
export default function ProjectScreenshot({ frame, url, ...props }: ProjectScreenshotProps) {
  return frame === 'phone' ? <PhoneFrame {...props} /> : <BrowserFrame url={url} {...props} />;
}
