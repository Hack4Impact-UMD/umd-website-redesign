import teamPhoto from '@/components/assets/h4igroup_photo.jpg';

export default function AboutHeader() {
  return (
    <section className="py-12 lg:py-20 px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-6">
              About Us
            </h1>
            <div className="space-y-4 font-body text-lg text-muted-foreground leading-relaxed">
              <p>
                Hack4Impact-UMD is a student-led organization at the University of Maryland
                and an official chapter of Hack4Impact, a national 501(c)(3) nonprofit using
                technology for social good. We partner with local and mission-driven nonprofit
                organizations to design and build free, high-quality software that helps
                organizations operate more efficiently and scale their impact.
              </p>
              <p>
                Our cross-functional teams of student designers, software engineers, and
                product managers collaborate closely with nonprofit partners to deliver custom
                web and mobile applications tailored to real organizational needs, providing
                sustainable technology solutions nonprofits may not otherwise have access to.
              </p>
            </div>
          </div>
          <div>
            <img
              src={teamPhoto}
              alt="Hack4Impact UMD team members"
              className="w-full rounded-2xl object-cover shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
