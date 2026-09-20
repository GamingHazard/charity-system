'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Donation {
  id: number;
  donor: string;
  amount: number;
  date: string;
  purpose: string;
}

const initialDonations: Donation[] = [
  { id: 1, donor: 'John Smith', amount: 5000, date: '2024-03-10', purpose: 'Education Program' },
  { id: 2, donor: 'Jane Doe', amount: 10000, date: '2024-03-08', purpose: 'Nutrition Initiative' },
  { id: 3, donor: 'ABC Corporation', amount: 25000, date: '2024-03-05', purpose: 'General Fund' },
  { id: 4, donor: 'Community Fund', amount: 15000, date: '2024-03-01', purpose: 'Healthcare Program' },
];

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>(initialDonations);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ donor: '', amount: '', date: '', purpose: '' });

  const handleAddDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.donor && formData.amount && formData.date) {
      const newDonation: Donation = {
        id: Math.max(...donations.map(d => d.id), 0) + 1,
        donor: formData.donor,
        amount: parseFloat(formData.amount),
        date: formData.date,
        purpose: formData.purpose,
      };
      setDonations([...donations, newDonation]);
      setFormData({ donor: '', amount: '', date: '', purpose: '' });
      setShowForm(false);
    }
  };

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Donations</h2>
          <p className="text-foreground/70 mt-1">Track and manage all donations</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {showForm ? 'Cancel' : '+ Log Donation'}
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-card border-border">
          <p className="text-foreground/60 text-sm mb-2">Total Donations</p>
          <p className="text-3xl font-bold text-accent">${totalDonations.toLocaleString()}</p>
        </Card>
        <Card className="p-6 bg-card border-border">
          <p className="text-foreground/60 text-sm mb-2">Number of Donations</p>
          <p className="text-3xl font-bold text-primary">{donations.length}</p>
        </Card>
        <Card className="p-6 bg-card border-border">
          <p className="text-foreground/60 text-sm mb-2">Average Donation</p>
          <p className="text-3xl font-bold text-primary">
            ${Math.round(totalDonations / donations.length).toLocaleString()}
          </p>
        </Card>
      </div>

      {showForm && (
        <Card className="p-6 bg-card border-border mb-8">
          <form onSubmit={handleAddDonation} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Donor Name</label>
                <Input
                  type="text"
                  value={formData.donor}
                  onChange={(e) => setFormData({ ...formData, donor: e.target.value })}
                  placeholder="Enter donor name"
                  className="w-full bg-background border-border text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Amount ($)</label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-background border-border text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-background border-border text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Purpose</label>
                <Input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="e.g., Education Program"
                  className="w-full bg-background border-border text-foreground"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Log Donation
            </Button>
          </form>
        </Card>
      )}

      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-bold text-foreground mb-4">Recent Donations</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-foreground font-semibold">Donor</th>
                <th className="text-left py-3 px-4 text-foreground font-semibold">Amount</th>
                <th className="text-left py-3 px-4 text-foreground font-semibold">Date</th>
                <th className="text-left py-3 px-4 text-foreground font-semibold">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation.id} className="border-b border-border hover:bg-background">
                  <td className="py-3 px-4 text-foreground">{donation.donor}</td>
                  <td className="py-3 px-4 text-accent font-semibold">${donation.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-foreground/70">{donation.date}</td>
                  <td className="py-3 px-4 text-foreground/70">{donation.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
