import { Skeleton } from '@/components/ui/skeleton';

interface ChartCardProps {
  title: string;
  description?: string;
  loading: boolean;
  empty: boolean;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}

export function ChartCard({ title, description, loading, empty, className, bodyClassName = 'h-64', children }: ChartCardProps) {
  return (
    <section className={`rounded-lg border bg-card p-5 shadow-soft ${className ?? ''}`}>
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <div className={`mt-4 ${bodyClassName}`}>
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : empty ? (
          <div className="flex size-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            No data to display yet
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
