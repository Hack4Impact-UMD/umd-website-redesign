import { Link } from 'react-router-dom';
import Projects from '@/components/projects/Projects';

export default function CurrentProjectsSection() {
  return (
    <section className="py-16 px-6 lg:px-16 bg-inverse">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-3xl font-bold text-inverse-foreground">
            Current Project Teams
          </h2>
          <Link
            to="/ourwork"
            className="font-body text-inverse-foreground hover:text-inverse-foreground/80 transition-colors"
          >
            View all projects →
          </Link>
        </div>
        <div className="[&_#sectionTitle]:hidden [&_h3]:text-inverse-foreground [&_p]:text-inverse-foreground/80 [&_a]:text-inverse-foreground [&_h1]:text-inverse-foreground">
          <Projects isFeatured={false} containerClassName="!mx-0 !max-w-none" />
        </div>
      </div>
    </section>
  );
}
