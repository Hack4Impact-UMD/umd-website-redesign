import type { ReactNode } from 'react';

import CornerBrackets from './CornerBrackets';

interface PageHeroProps {
  title: string;
  /** Already-resolved image URL. */
  image?: string;
  /** Empty string marks the image as decorative. */
  imageAlt?: string;
  headingId?: string;
  /** Sits above the bracketed block, e.g. a back link. */
  leading?: ReactNode;
  /** Lead paragraph, facts, buttons: whatever sits under the title. */
  children?: ReactNode;
  /** Optional right-hand column on large screens (e.g. a product screenshot). Stacks below on mobile. */
  aside?: ReactNode;
  /**
   * From xl the aside is oversized and bleeds off the right and bottom edges,
   * which suits a browser window. Off, it sits centred in its column instead,
   * which suits something with its own outline, like a phone.
   */
  asideBleed?: boolean;
}

/**
 * Inner-page hero shared by About, Apply, Our Work and Contact: the home hero's
 * navy overlay, regular-weight Karla and corner brackets, a little shorter.
 * Pages using it should pass `transparentNav` to BaseLayout, since it reserves
 * room for the header.
 */
export default function PageHero({
  title,
  image,
  imageAlt = '',
  headingId,
  leading,
  children,
  aside,
  asideBleed = true,
}: PageHeroProps) {
  return (
    <section
      aria-labelledby={headingId}
      className="relative isolate flex min-h-[440px] items-center overflow-hidden bg-h4i-navy md:min-h-[520px]"
    >
      {image ? (
        <img
          src={image}
          alt={imageAlt}
          aria-hidden={imageAlt ? undefined : true}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
      ) : null}
      {/* Below md the copy spans the full width, so the overlay is even rather than side-fading. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-h4i-navy/75 md:bg-transparent md:bg-gradient-to-r md:from-h4i-navy/90 md:from-20% md:via-h4i-navy/70 md:via-50% md:to-h4i-navy/20"
      />

      {/* With an aside, the right side gets its own slightly darker panel for the screenshot to sit in. */}
      {aside ? (
        <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 hidden w-[44%] bg-black/20 xl:block" />
      ) : null}

      <div className="mx-auto w-full max-w-[1440px] px-6 pb-14 pt-[116px] sm:px-10 lg:px-24">
        {leading ? <div className="mb-6">{leading}</div> : null}
        <div className={aside ? 'grid items-center gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] xl:gap-16' : undefined}>
        {/* w-fit so the brackets hug the text. The title may run wider than the
            paragraph (which keeps a readable measure), so a one-line title
            like "Apply as a Nonprofit" doesn't wrap and strand the bracket. */}
        <div className="relative w-fit max-w-4xl py-5 pr-8 text-white sm:py-6 sm:pr-14">
          <CornerBrackets />
          <h1
            id={headingId}
            className={`font-heading text-5xl font-normal leading-[1.05] tracking-tight sm:-ml-1 ${aside ? 'sm:text-6xl' : 'sm:text-7xl'}`}
          >
            {title}
          </h1>
          {children ? <div className="max-w-2xl">{children}</div> : null}
        </div>
          {/* From xl the aside is oversized and bleeds off the right and
              bottom edges (the section clips it), so it reads as a window into the product. */}
          {aside ? (
            <div
              className={
                asideBleed
                  ? 'min-w-0 xl:-mb-14 xl:self-end xl:pt-16 [&>*]:xl:w-[calc(100%_+_(100vw_-_min(100vw,1440px))_/_2_+_18rem)] [&>*]:xl:max-w-none'
                  : 'flex min-w-0 justify-center'
              }
            >
              {aside}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
