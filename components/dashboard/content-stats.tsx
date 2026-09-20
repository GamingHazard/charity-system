import { Card } from '@/components/ui/card';
import { ContentItem, getContentStats } from '@/lib/content-utils';

interface ContentStatsProps {
  items: ContentItem[];
}

export function ContentStats({ items }: ContentStatsProps) {
  const stats = getContentStats(items);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-4 bg-card border-border">
        <div className="space-y-2">
          <p className="text-sm text-foreground/60">Total Content</p>
          <p className="text-3xl font-bold text-foreground">{stats.total}</p>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <div className="space-y-2">
          <p className="text-sm text-foreground/60 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
            Published
          </p>
          <p className="text-3xl font-bold text-foreground">{stats.published}</p>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <div className="space-y-2">
          <p className="text-sm text-foreground/60 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
            Drafts
          </p>
          <p className="text-3xl font-bold text-foreground">{stats.draft}</p>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <div className="space-y-2">
          <p className="text-sm text-foreground/60">Sections</p>
          <p className="text-3xl font-bold text-foreground">{Object.keys(stats.bySection).length}</p>
        </div>
      </Card>
    </div>
  );
}
