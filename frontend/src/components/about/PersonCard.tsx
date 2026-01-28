import { Linkedin } from 'lucide-react';
import defaultPfp from '@/components/assets/icons/default_pfp.png';

interface PersonCardProps {
  name: string;
  role: string;
  imageSrc?: string | null;
  linkedinUrl?: string;
}

export default function PersonCard({
  name,
  role,
  imageSrc,
  linkedinUrl,
}: PersonCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <img
        src={imageSrc || defaultPfp}
        alt={`${name} headshot`}
        className="w-32 h-32 rounded-xl object-cover bg-muted"
      />
      <h3 className="font-heading text-sm font-bold text-foreground mt-3">
        {name}
      </h3>
      <p className="font-body text-xs text-muted-foreground mt-1">{role}</p>
      <div className="flex gap-2 mt-2">
        {linkedinUrl ? (
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name}'s LinkedIn`}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        ) : (
          <Linkedin className="w-5 h-5 text-muted-foreground/40" />
        )}
      </div>
    </div>
  );
}
