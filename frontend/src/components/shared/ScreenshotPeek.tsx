import type { CardScreenshot } from '@/lib/screenshots';
import { BLUEPRINT_GRID_SMALL, BLUEPRINT_GRID_SMALL_ON_COLOR } from './blueprint';

interface ScreenshotPeekProps {
  screenshot: CardScreenshot;
  /** Sizes the panel; it fills whatever box it is given. */
  className?: string;
}

/**
 * A project's screenshot on a drafting panel in the partner's brand colour
 * (navy when it has none), as a window into the product: a browser frame pinned at its top-left that runs off the right and
 * bottom edges, like the project page hero, or a phone rising from the bottom.
 * Decorative: the card around it names the project.
 */
export default function ScreenshotPeek({ screenshot, className = '' }: ScreenshotPeekProps) {
  const { src, frame, width, height, color } = screenshot;

  return (
    <div
      aria-hidden="true"
      className={`relative isolate overflow-hidden bg-h4i-navy ${className}`}
      style={color ? { backgroundColor: color } : undefined}
    >
      {/* Blue lines vanish on a coloured panel, so it gets white ones. */}
      <div className="absolute inset-0 -z-10" style={color ? BLUEPRINT_GRID_SMALL_ON_COLOR : BLUEPRINT_GRID_SMALL} />
      {frame === 'phone' ? (
        <div className="absolute left-1/2 top-[12%] w-[34%] max-w-[200px] -translate-x-1/2 rounded-[1.6rem] bg-[#101418] p-1.5 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.7)] ring-1 ring-white/15">
          <img
            src={src}
            alt=""
            loading="lazy"
            style={width && height ? { aspectRatio: `${width} / ${height}` } : undefined}
            className="block h-auto w-full rounded-[1.25rem] bg-white"
          />
        </div>
      ) : (
        <div className="absolute left-[9%] top-[13%] w-[108%] overflow-hidden rounded-tl-lg bg-white shadow-[0_18px_40px_-16px_rgba(0,0,0,0.7)] ring-1 ring-white/20">
          <div className="flex gap-1 bg-[#F1F3F5] px-2.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF5F57]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#FEBC2E]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#28C840]" />
          </div>
          {/* Pinned top-left, like the hero: what does not fit is lost off the right and bottom. */}
          <img src={src} alt="" loading="lazy" className="block aspect-[16/10] w-full object-cover object-left-top" />
        </div>
      )}
    </div>
  );
}
