import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <main className="flex min-h-[60vh] items-center bg-background px-4 py-16 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-2xl rounded-xl border border-border bg-card p-8 text-center shadow-sm sm:p-12">
        <p className="text-label font-bold uppercase text-h4i-blue">Error 404</p>
        <h1 className="mt-3 text-h1 font-bold text-foreground">Page not found</h1>
        <p className="mx-auto mt-4 max-w-lg text-body text-muted-foreground">
          The page may have moved, or the address may be incomplete. Return home to keep exploring Hack4Impact UMD.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-h4i-blue px-6 py-3 text-label font-bold text-white transition-colors hover:bg-state-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-4"
        >
          Go to Home
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
