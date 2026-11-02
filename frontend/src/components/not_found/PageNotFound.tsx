import { darkPrimaryButton, darkSecondaryButton } from '@/components/shared/buttonStyles';
import PageHero from '@/components/shared/PageHero';

// The site's hero treatment on plain navy, sized to fill the screen so the
// footer doesn't ride up under a short message.
export default function PageNotFound() {
  return (
    <main className="[&>section]:min-h-[calc(100vh-1px)]">
      <PageHero title="Page not found" headingId="not-found-title">
        <p className="mt-6 font-body text-lg leading-relaxed text-white/90 sm:text-xl">
          This page may have moved, or the address may be incomplete.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
          <a href="/" className={darkPrimaryButton}>
            Go to the home page
          </a>
          <a href="/ourwork" className={darkSecondaryButton}>
            See our work
          </a>
        </div>
      </PageHero>
    </main>
  );
}
