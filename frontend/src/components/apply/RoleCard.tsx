import { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

export type RoleCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

function RoleCard({ title, description, icon: Icon }: RoleCardProps) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="space-y-4 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border">
          <Icon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h3 className="font-heading text-lg font-bold">{title}</h3>
          <p className="font-body text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default RoleCard;
