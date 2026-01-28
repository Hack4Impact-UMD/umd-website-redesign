export default function MissionSection() {
  return (
    <section className="py-12 px-6 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <div className="relative border-2 border-primary px-8 py-10 lg:px-16 lg:py-12">
          <div className="absolute -top-[2px] -left-[2px] w-8 h-8 border-t-4 border-l-4 border-primary" />
          <div className="absolute -bottom-[2px] -right-[2px] w-8 h-8 border-b-4 border-r-4 border-primary" />

          <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
            Our Mission
          </h2>
          <p className="font-body text-lg text-foreground leading-relaxed">
            Our mission is to leverage technology for social good by building impactful
            software solutions for nonprofit organizations while providing students with
            real-world, professional experience.
          </p>
        </div>
      </div>
    </section>
  );
}
