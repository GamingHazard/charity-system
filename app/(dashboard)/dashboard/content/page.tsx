'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContentItemCard } from '@/components/dashboard/content-item-card';
import { ContentStats } from '@/components/dashboard/content-stats';
import { ContentItem, defaultContentItems, normalizeContentItem, searchContent as filterContent, sortContent } from '@/lib/content-utils';
import { apiRequest } from '@/lib/query-client';

const initialContent: ContentItem[] = defaultContentItems;

export default function ContentPage() {
  const [content, setContent] = useState<ContentItem[]>(initialContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title'>('updated');

  const sections = ['All', ...Array.from(new Set(content.map(item => item.section)))];
  const statuses = ['All', 'published', 'draft'];

  useEffect(() => {
    let active = true;
    apiRequest('GET', '/content/all')
      .then((response) => response.json())
      .then((items) => {
        if (active) setContent(items.map(normalizeContentItem));
      })
      .catch(() => {
        if (active) setError('Unable to load content from the server. Showing local defaults.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filteredContent = useMemo(() => {
    const filtered = filterContent(content, searchTerm, selectedSection, selectedStatus);
    return sortContent(filtered, sortBy);
  }, [content, searchTerm, selectedSection, selectedStatus, sortBy]);

  const handleEdit = (item: ContentItem) => {
    setEditingId(item.id);
    setEditContent(item.content);
  };

  const handleSave = async (id: string) => {
    const item = content.find((entry) => entry.id === id);
    if (!item) return;
    try {
      const response = await apiRequest('PUT', `/content/${id}`, { ...item, content: editContent, status: 'published' });
      const updated = normalizeContentItem(await response.json());
      setContent((items) => items.map((entry) => entry.id === id ? updated : entry));
      setEditingId(null);
      setEditContent('');
    } catch {
      setError('Unable to save this content item.');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleDelete = async (id: string) => {
    try {
      await apiRequest('DELETE', `/content/${id}`);
      setContent((items) => items.filter((item) => item.id !== id));
    } catch {
      setError('Unable to delete this content item.');
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'published' | 'draft') => {
    const item = content.find((entry) => entry.id === id);
    if (!item) return;
    try {
      const response = await apiRequest('PUT', `/content/${id}`, { ...item, status: newStatus });
      const updated = normalizeContentItem(await response.json());
      setContent((items) => items.map((entry) => entry.id === id ? updated : entry));
    } catch {
      setError('Unable to update publication status.');
    }
  };

  const handleAddNew = () => {
    const newId = `content-${Date.now()}`;
    const newItem: ContentItem = {
      id: newId,
      title: 'New Content',
      section: selectedSection === 'All' ? 'Home' : selectedSection,
      content: 'Enter your content here...',
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'draft',
    };
    apiRequest('POST', '/content', newItem)
      .then((response) => response.json())
      .then((item) => setContent((items) => [...items, normalizeContentItem(item)]))
      .catch(() => setError('Unable to create a content item.'));
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Content Management</h2>
        <p className="text-foreground/70">Edit website content across different sections and manage publishing status</p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Statistics */}
      <ContentStats items={content} />

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Search Content</label>
          <Input
            type="text"
            placeholder="Search by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background text-foreground border-border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Section</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
          >
            {sections.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'updated' | 'created' | 'title')}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
          >
            <option value="updated">Last Updated</option>
            <option value="created">Created</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-foreground/70">
          Showing {filteredContent.length} of {content.length} content items
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
        >
          + Add New Content
        </Button>
      </div>

      {/* Content List */}
      {isLoading ? (
        <Card className="p-12 text-center bg-card border-border">Loading content...</Card>
      ) : filteredContent.length === 0 ? (
        <Card className="p-12 text-center bg-card border-border">
          <p className="text-foreground/70">No content items found matching your filters.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredContent.map((item) => (
            <ContentItemCard
              key={item.id}
              item={item}
              isEditing={editingId === item.id}
              editContent={editContent}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onContentChange={setEditContent}
            />
          ))}
        </div>
      )}
    </div>
  );
}
