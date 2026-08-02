import { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

export type RoleCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

function RoleCard({ title, description, icon: Icon }: RoleCardProps) {
  return (
    <Card className="h-full border-0 bg-card shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
      <CardContent className="space-y-4 p-6">
        <Icon className="h-12 w-12 text-muted-foreground sm:h-16 sm:w-16" aria-hidden="true" />
        <div className="space-y-2">
          <h3 className="font-heading text-h3 font-bold">{title}</h3>
          <p className="font-body text-base leading-6 text-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default RoleCard;
