import classroomPhoto from '@/components/assets/apply/apply-classroom.jpg';
import teamPhoto from '@/components/assets/apply/apply-team.jpg';
import teamShowcase from '@/components/assets/about/team-showcase.webp';
import collaborationPhoto from '@/components/assets/about/values-collaboration.webp';
import groupPhoto from '@/components/assets/h4igroup_photo.jpg';

const eventPhotos = [
  { src: groupPhoto, alt: 'Hack4Impact UMD students at a networking event', className: 'aspect-[4/3] lg:col-span-3' },
  { src: classroomPhoto, alt: 'Hack4Impact UMD students at a workshop', className: 'aspect-[4/3] lg:col-span-3 lg:mt-10' },
  { src: teamShowcase, alt: 'Hack4Impact UMD students collaborating', className: 'aspect-[4/3] lg:col-span-3 lg:mt-4' },
  { src: collaborationPhoto, alt: 'Hack4Impact UMD students at a community event', className: 'aspect-[4/3] lg:col-span-3 lg:mt-14' },
  { src: teamPhoto, alt: 'Hack4Impact UMD team bonding', className: 'aspect-[4/3] lg:col-span-4 lg:-mt-3' },
  { src: classroomPhoto, alt: 'Hack4Impact UMD coffee chat', className: 'aspect-[4/3] lg:col-span-4 lg:mt-10' },
  { src: groupPhoto, alt: 'Hack4Impact UMD students volunteering together', className: 'aspect-[4/3] lg:col-span-4 lg:mt-2' },
];

export default function CommunityEventsSection() {
  return (
    <section aria-labelledby="community-events-heading" className="bg-[#F9FAFB] px-4 py-16 sm:px-6 lg:px-24 lg:py-[107px]">
      <div className="mx-auto max-w-[1248px]">
        <header className="mx-auto max-w-5xl text-center">
          <h2 id="community-events-heading" className="text-[28px] leading-9 text-foreground">
            Participate in Student-Led Community Events
          </h2>
          <p className="mt-2 text-base font-bold leading-5 text-text-secondary">
            Workshops, coffee chats, networking, community events, volunteer trips, and more fun events to help support students in their career growth.
          </p>
        </header>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:mt-14 lg:grid-cols-12 lg:items-start lg:gap-x-7 lg:gap-y-5">
          {eventPhotos.map((photo, index) => (
            <figure key={`${photo.alt}-${index}`} className={photo.className}>
              <img
                src={photo.src}
                alt={photo.alt}
                className="h-full w-full border-4 border-white object-cover shadow-[0_1px_2px_1px_rgba(0,0,0,0.1)]"
                loading="lazy"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
