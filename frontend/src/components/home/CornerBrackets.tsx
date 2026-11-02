/**
 * The logo's corner brackets, used to frame the two "invitation" moments on the
 * home page (hero and closing CTA). Decorative only. The parent must be
 * positioned (`relative`).
 */
export default function CornerBrackets() {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-3 top-0 h-7 w-7 border-l-[2.5px] border-t-[2.5px] border-white/80 sm:-left-6 sm:h-11 sm:w-11 sm:border-l-[3px] sm:border-t-[3px]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-3 bottom-0 h-7 w-7 border-b-[2.5px] border-r-[2.5px] border-white/80 sm:right-2 sm:h-11 sm:w-11 sm:border-b-[3px] sm:border-r-[3px]"
      />
    </>
  );
}
