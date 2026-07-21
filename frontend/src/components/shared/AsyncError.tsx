import { Button } from '@/components/ui/button';

interface AsyncErrorProps {
  message?: string;
  onRetry: () => void;
}

export default function AsyncError({
  message = 'We could not load this content.',
  onRetry,
}: AsyncErrorProps) {
  return (
    <div role="alert" className="rounded-lg border border-state-error/30 bg-state-error-subtle p-4 text-center">
      <p className="text-sm text-state-error">{message}</p>
      <Button type="button" variant="outline" className="mt-3" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
