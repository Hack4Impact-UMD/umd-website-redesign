import { Linkedin } from 'lucide-react';
import defaultPfp from '@/components/assets/icons/default_pfp.png';

interface PersonCardProps {
  name: string;
  role: string;
  imageSrc?: string | null;
  linkedinUrl?: string;
  showSecondaryPlaceholderIcon?: boolean;
  showPrimaryPlaceholderWhenNoLink?: boolean;
}

function resolveImageSrc(src?: string | null) {
  if (!src) return defaultPfp;
  if (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('data:') ||
    src.startsWith('blob:')
  ) {
    return src;
  }
  if (src.startsWith('/')) {
    return `${import.meta.env.VITE_ROOT_URL}${src}`;
  }
  return `${import.meta.env.VITE_ROOT_URL}/${src}`;
}

export default function PersonCard({
  name,
  role,
  imageSrc,
  linkedinUrl,
  showSecondaryPlaceholderIcon = false,
  showPrimaryPlaceholderWhenNoLink = true,
}: PersonCardProps) {
  const resolvedImageSrc = resolveImageSrc(imageSrc);
  const hasPrimaryLink = Boolean(linkedinUrl);
  const showPrimaryPlaceholder = !hasPrimaryLink && showPrimaryPlaceholderWhenNoLink;

  return (
    <div className="flex flex-col items-center text-center">
      <img
        src={resolvedImageSrc}
        alt={`${name} headshot`}
        className="w-32 h-32 rounded-xl object-cover bg-muted"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = defaultPfp;
        }}
      />
      <h3 className="font-heading text-sm font-bold text-foreground mt-3">
        {name}
      </h3>
      <p className="font-body text-xs text-muted-foreground mt-1">{role}</p>
      <div className="flex gap-2 mt-2">
        {hasPrimaryLink ? (
          <a
            href={linkedinUrl}
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
    </div>
  );
}
