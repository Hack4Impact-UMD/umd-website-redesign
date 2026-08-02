import { Linkedin } from 'lucide-react';
import defaultPfp from '@/components/assets/icons/default_pfp.png';
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

function resolveImageSrc(src?: string | null) {
  return resolveMediaUrl(src) || defaultPfp;
}

function isSafeLinkedinUrl(value: string) {
  if (!isSafeHttpsUrl(value)) return false;
  const hostname = new URL(value).hostname.toLowerCase();
  return hostname === 'linkedin.com' || hostname.endsWith('.linkedin.com');
}

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
  const resolvedImageSrc = resolveImageSrc(imageSrc);
  const safeLinkedinUrl = linkedinUrl && isSafeLinkedinUrl(linkedinUrl) ? linkedinUrl : undefined;
  const hasPrimaryLink = Boolean(safeLinkedinUrl);
  const showPrimaryPlaceholder = !hasPrimaryLink && showPrimaryPlaceholderWhenNoLink;

  return (
    <article className={prominent ? 'flex w-full max-w-72 flex-col items-center text-center' : 'flex flex-col items-center text-center'}>
      <img
        src={resolvedImageSrc}
        alt={`${name} headshot`}
        className={prominent ? 'aspect-square w-full rounded-lg bg-muted object-cover' : 'h-32 w-32 rounded-xl bg-muted object-cover'}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = defaultPfp;
        }}
      />
      <h3 className={prominent ? 'mt-3 font-heading text-h3 font-bold text-foreground' : 'mt-3 font-heading text-sm font-bold text-foreground'}>
        {name}
      </h3>
      {pronouns ? <p className="mt-0.5 text-xs text-muted-foreground">{pronouns}</p> : null}
      {role ? (
        <p className={prominent ? 'mt-1 font-heading text-label font-bold text-muted-foreground' : 'mt-1 font-body text-xs text-muted-foreground'}>
          {role}
        </p>
      ) : null}
      {team && team !== role ? (
        <p className="mt-0.5 font-body text-xs text-muted-foreground">{team}</p>
      ) : null}
      <div className="flex gap-2 mt-2">
        {hasPrimaryLink ? (
          <a
            href={safeLinkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name}'s LinkedIn`}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        ) : showPrimaryPlaceholder ? (
          <Linkedin className="w-5 h-5 text-muted-foreground/40" />
        ) : null}
        {showSecondaryPlaceholderIcon ? (
          <Linkedin
            className="w-5 h-5 text-muted-foreground/40"
            aria-hidden="true"
          />
        ) : null}
      </div>
    </article>
  );
}
