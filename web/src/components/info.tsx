import { InfoIcon } from 'lucide-react';

export function Info({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-muted-foreground bg-muted/50 flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm dark:bg-transparent">
      <InfoIcon className="size-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
