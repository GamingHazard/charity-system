'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Program {
  id: number;
  title: string;
  description: string;
  impact: string;
  status: 'active' | 'planning' | 'completed';
}

const initialPrograms: Program[] = [
  {
    id: 1,
    title: 'Education Initiatives',
    description: 'Building schools and scholarships',
    impact: '5,000+ students',
    status: 'active',
  },
  {
    id: 2,
    title: 'Nutrition Program',
    description: 'Providing nutritious meals',
    impact: '12,000+ people',
    status: 'active',
  },
  {
    id: 3,
    title: 'Teacher Training',
    description: 'Training local educators',
    impact: '200+ teachers',
    status: 'planning',
  },
];

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', impact: '' });

  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description) {
      const newProgram: Program = {
        id: Math.max(...programs.map(p => p.id), 0) + 1,
        title: formData.title,
        description: formData.description,
        impact: formData.impact,
        status: 'planning',
      };
      setPrograms([...programs, newProgram]);
      setFormData({ title: '', description: '', impact: '' });
      setShowForm(false);
    }
  };

  const handleDeleteProgram = (id: number) => {
    setPrograms(programs.filter(p => p.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Programs Management</h2>
          <p className="text-foreground/70 mt-1">Manage your foundation's programs</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {showForm ? 'Cancel' : '+ Add Program'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 bg-card border-border mb-8">
          <form onSubmit={handleAddProgram} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Program Title</label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter program title"
                className="w-full bg-background border-border text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter program description"
                rows={3}
                className="w-full p-2 bg-background border border-border rounded-md text-foreground resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Impact Metric</label>
              <Input
                type="text"
                value={formData.impact}
                onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                placeholder="e.g., 5,000+ students"
                className="w-full bg-background border-border text-foreground"
              />
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Save Program
            </Button>
          </form>
        </Card>
      )}

      <div className="grid gap-6">
        {programs.map((program) => (
          <Card key={program.id} className="p-6 bg-card border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">{program.title}</h3>
                <p className="text-foreground/70 mb-3">{program.description}</p>
                <div className="flex items-center gap-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                    {program.status}
                  </span>
                  <span className="text-sm text-accent font-semibold">📊 {program.impact}</span>
                </div>
              </div>
              <Button
                onClick={() => handleDeleteProgram(program.id)}
                variant="outline"
                size="sm"
                className="text-destructive border-destructive hover:bg-destructive/10"
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
