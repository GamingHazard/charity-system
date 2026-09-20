'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    organizationName: 'Seeds of Love Foundation',
    email: 'hello@seedsoflove.org',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, New York, NY 10001',
    taxId: '12-3456789',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Settings</h2>
        <p className="text-foreground/70">Manage your organization settings</p>
      </div>

      <div className="max-w-2xl">
        <Card className="p-8 bg-card border-border">
          <h3 className="text-xl font-bold text-foreground mb-6">Organization Information</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Organization Name
              </label>
              <Input
                type="text"
                name="organizationName"
                value={settings.organizationName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-background border-border text-foreground disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-background border-border text-foreground disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-background border-border text-foreground disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Address
              </label>
              <Input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-background border-border text-foreground disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tax ID
              </label>
              <Input
                type="text"
                name="taxId"
                value={settings.taxId}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-background border-border text-foreground disabled:opacity-50"
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="flex-1 border-primary text-primary hover:bg-primary/10"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Edit Settings
              </Button>
            )}
          </div>
        </Card>

        <Card className="mt-8 p-8 bg-card border-border border-destructive/20">
          <h3 className="text-lg font-bold text-destructive mb-2">Danger Zone</h3>
          <p className="text-sm text-foreground/70 mb-4">
            These actions cannot be undone. Please proceed with caution.
          </p>
          <Button
            variant="outline"
            className="text-destructive border-destructive hover:bg-destructive/10"
          >
            Delete All Data
          </Button>
        </Card>
      </div>
    </div>
  );
}
