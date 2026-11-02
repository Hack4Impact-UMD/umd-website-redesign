import teamPhoto from '@/components/assets/apply/apply-team.webp?url';
import collaborationPhoto from '@/components/assets/about/values-collaboration.webp?url';
import groupPhoto from '@/components/assets/h4igroup_photo.webp?url';

export default function CommunityEventsSection() {
  return (
    <section
      aria-labelledby="community-events-heading"
      className="bg-[#F1F3F5] px-6 py-16 sm:px-8 lg:px-24 lg:py-20"
    >
      <div className="mx-auto grid max-w-[1248px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="max-w-xl">
          <h2 id="community-events-heading" className="text-section text-foreground">
            Student-led community events
          </h2>
          <p className="mt-4 font-body text-lg leading-relaxed text-text-secondary">
            Workshops, coffee chats, networking nights, and volunteer trips help members grow
            their careers and get to know each other outside of project work.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <img
            src={groupPhoto}
            alt="Hack4Impact UMD members together at a chapter event"
            className="col-span-2 aspect-[16/9] w-full rounded-lg object-cover"
            loading="lazy"
          />
          <img
            src={teamPhoto}
            alt="Hack4Impact UMD members at a team social"
            className="aspect-[4/3] w-full rounded-lg object-cover"
            loading="lazy"
          />
          <img
            src={collaborationPhoto}
            alt="Hack4Impact UMD members collaborating at a workshop"
            className="aspect-[4/3] w-full rounded-lg object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
