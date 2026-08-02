import missionCornerEnd from '@/components/assets/about/mission-corner-end.svg';
import missionCornerStart from '@/components/assets/about/mission-corner-start.svg';
import type { AboutContent } from '@/content/about';

type MissionSectionProps = AboutContent['mission'];

export default function MissionSection({ heading, body }: MissionSectionProps) {
  return (
    <section className="bg-primary">
      <div className="mx-auto max-w-[1440px] px-6 py-12 sm:px-8 lg:px-24">
        <div className="relative mx-auto flex min-h-[220px] max-w-[1248px] items-center px-8 py-12 sm:px-16 lg:px-28">
          <img
            src={missionCornerStart}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 h-[72px] w-[72px] sm:h-[96px] sm:w-[96px]"
          />
          <img
            src={missionCornerEnd}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 h-[72px] w-[72px] sm:h-[96px] sm:w-[96px]"
          />

          <div className="relative z-10">
            <h2 className="font-heading text-h2 font-bold text-primary-foreground">{heading}</h2>
            <p className="mt-2 font-heading text-lg font-bold leading-7 text-primary-foreground sm:text-h3 sm:leading-[30px]">
              {body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
