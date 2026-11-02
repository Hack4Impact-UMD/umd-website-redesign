import type { LucideIcon } from 'lucide-react';

export type RoleCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

// A ruled column rather than a shadowed card, matching the story and impact grids.
function RoleCard({ title, description, icon: Icon }: RoleCardProps) {
  return (
    <div className="h-full border-t border-black/10 pt-5">
      <Icon className="h-6 w-6 text-h4i-blue" aria-hidden="true" />
      <h3 className="mt-3 font-heading text-2xl font-normal leading-tight tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-2 font-body text-base leading-relaxed text-text-secondary">{description}</p>
    </div>
  );
}

export default RoleCard;
