import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContentItem } from '@/lib/content-utils';

interface ContentItemCardProps {
  item: ContentItem;
  isEditing: boolean;
  editContent: string;
  onEdit: (item: ContentItem) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: 'published' | 'draft') => void;
  onContentChange: (content: string) => void;
}

export function ContentItemCard({
  item,
  isEditing,
  editContent,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onStatusChange,
  onContentChange,
}: ContentItemCardProps) {
  return (
    <Card className="p-6 bg-card border-border hover:shadow-md transition-shadow">
      <div className="mb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
              <Badge
                className={
                  item.status === 'published'
                    ? 'bg-green-500/20 text-green-700'
                    : 'bg-yellow-500/20 text-yellow-700'
                }
              >
                {item.status}
              </Badge>
            </div>
            <p className="text-sm text-foreground/60 mt-1">
              {item.section} • Updated {item.lastUpdated}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {isEditing ? (
              <>
                <Button
                  onClick={() => onSave(item.id)}
                  size="sm"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Save
                </Button>
                <Button
                  onClick={onCancel}
                  size="sm"
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => onEdit(item)}
                  size="sm"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Edit
                </Button>
                <Button
                  onClick={() =>
                    onStatusChange(item.id, item.status === 'published' ? 'draft' : 'published')
                  }
                  size="sm"
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted"
                >
                  {item.status === 'published' ? 'Unpublish' : 'Publish'}
                </Button>
                <Button
                  onClick={() => onDelete(item.id)}
                  size="sm"
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/10"
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => onContentChange(e.target.value)}
            rows={6}
            className="w-full p-3 bg-background border border-border rounded-md text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter content..."
          />
          <p className="text-xs text-foreground/60">Character count: {editContent.length}</p>
        </div>
      ) : (
        <p className="text-foreground/70 text-sm bg-background p-4 rounded-md leading-relaxed">
          {item.content}
        </p>
      )}
    </Card>
  );
}
