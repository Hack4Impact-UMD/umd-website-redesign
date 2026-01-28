import { Link } from 'react-router-dom';
import Projects from '@/components/projects/Projects';

export default function CurrentProjectsSection() {
  return (
    <section className="py-16 px-6 lg:px-16 bg-[#0F172A]">
      <div className="mx-auto max-w-7xl">
        <div className="relative mb-10">
          <h2 className="font-heading text-3xl font-bold text-white text-center">
            Current Project Teams
          </h2>
          <Link
            to="/ourwork"
            className="absolute right-0 top-1/2 -translate-y-1/2 font-body text-white hover:text-white/80 transition-colors"
          >
            View all projects →
          </Link>
        </div>
        <div className="[&_#sectionTitle]:hidden [&_h3]:text-white [&_p]:text-white/80 [&_a]:text-white [&_h1]:hidden">
          <Projects isFeatured={false} />
        </div>
      </div>
    </section>
  );
}
