import { Linkedin } from 'lucide-react';
import defaultPfp from '@/components/assets/icons/default_pfp.png?url';
import { resolveMediaUrl } from '@/lib/media';
import { isSafeHttpsUrl } from '@/lib/urls';

interface PersonCardProps {
  name: string;
  role: string;
  pronouns?: string | null;
  team?: string | null;
  imageSrc?: string | null;
  linkedinUrl?: string | null;
  prominent?: boolean;
  showSecondaryPlaceholderIcon?: boolean;
  showPrimaryPlaceholderWhenNoLink?: boolean;
}

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('');

function isSafeLinkedinUrl(value: string) {
  if (!isSafeHttpsUrl(value)) return false;
  const hostname = new URL(value).hostname.toLowerCase();
  return hostname === 'linkedin.com' || hostname.endsWith('.linkedin.com');
}

/**
 * Left-aligned like the project cards: photo, name in the heading face, role in
 * the blue label style. `prominent` is the larger board treatment.
 */
export default function PersonCard({
  name,
  role,
  pronouns,
  team,
  imageSrc,
  linkedinUrl,
  prominent = false,
  showSecondaryPlaceholderIcon = false,
  showPrimaryPlaceholderWhenNoLink = false,
}: PersonCardProps) {
  const resolvedImageSrc = resolveMediaUrl(imageSrc);
  const safeLinkedinUrl = linkedinUrl && isSafeLinkedinUrl(linkedinUrl) ? linkedinUrl : undefined;
  const hasPrimaryLink = Boolean(safeLinkedinUrl);
  const showPrimaryPlaceholder = !hasPrimaryLink && showPrimaryPlaceholderWhenNoLink;
  const showIcons = hasPrimaryLink || showPrimaryPlaceholder || showSecondaryPlaceholderIcon;

  return (
    <article className="flex min-w-0 flex-col">
      {resolvedImageSrc ? (
        <img
          src={resolvedImageSrc}
          alt={`${name} headshot`}
          className="aspect-square w-full rounded-lg bg-muted object-cover"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = defaultPfp;
          }}
        />
      ) : (
        // No headshot: initials read better than a stretched silhouette, especially at board size.
        <div
          aria-hidden="true"
          className={`flex aspect-square w-full items-center justify-center rounded-lg bg-[#E7EFF8] font-heading font-normal tracking-tight text-h4i-blue ${
            prominent ? 'text-6xl' : 'text-3xl'
          }`}
        >
          {initialsOf(name)}
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-baseline gap-x-2">
        <h3
          className={
            prominent
              ? 'font-heading text-2xl font-normal leading-tight tracking-tight text-foreground'
              : 'font-heading text-base font-medium leading-snug text-foreground'
          }
        >
          {name}
        </h3>
        {pronouns ? <p className="text-xs leading-5 text-muted-foreground">{pronouns}</p> : null}
      </div>
      {role ? (
        <p
          className={
            prominent
              ? 'mt-1 font-heading text-label text-h4i-blue'
              : 'mt-0.5 font-body text-sm leading-snug text-h4i-blue'
          }
        >
          {role}
        </p>
      ) : null}
      {team && team !== role ? (
        <p className="mt-0.5 font-body text-sm leading-snug text-text-secondary">{team}</p>
      ) : null}
      {showIcons ? (
        <div className="mt-2 flex gap-2">
          {hasPrimaryLink ? (
            <a
              href={safeLinkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name}'s LinkedIn`}
              className="rounded-sm text-text-secondary transition-colors hover:text-h4i-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
            >
              <Linkedin className="h-5 w-5" aria-hidden="true" />
            </a>
          ) : showPrimaryPlaceholder ? (
            <Linkedin className="h-5 w-5 text-muted-foreground/40" aria-hidden="true" />
          ) : null}
          {showSecondaryPlaceholderIcon ? (
            <Linkedin className="h-5 w-5 text-muted-foreground/40" aria-hidden="true" />
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
