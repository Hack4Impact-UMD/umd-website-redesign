export default function MissionSection() {
  return (
    <section className="bg-primary">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-16 lg:py-16">
        <div className="relative mx-auto max-w-3xl">
          <svg
            className="pointer-events-none absolute -left-8 -top-8 hidden h-12 w-12 text-primary-foreground/90 sm:block md:h-14 md:w-14"
            viewBox="49.5 77.5 117 116"
            aria-hidden="true"
          >
            <path
              d="M64.3389 193.5V92.1904H166.5V77.5H49.5V193.5H64.3389Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
          <svg
            className="pointer-events-none absolute -bottom-8 -right-8 hidden h-12 w-12 text-primary-foreground/90 sm:block md:h-14 md:w-14"
            viewBox="169.5 243.5 117 116"
            aria-hidden="true"
          >
            <path
              d="M271.661 243.5V344.81H169.5V359.5H286.5V243.5H271.661Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>

          <h2 className="font-heading text-2xl font-bold text-primary-foreground">
            Our Mission
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-primary-foreground/90 md:text-lg">
            Our mission is to leverage technology for social good by building impactful
            software solutions for nonprofit organizations while providing students with
            real-world, professional experience.
          </p>
        </div>
      </div>
    </section>
  );
}
