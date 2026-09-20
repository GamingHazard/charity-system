'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Monthly donation data
const donationData = [
  { month: 'Jan', amount: 15000 },
  { month: 'Feb', amount: 18000 },
  { month: 'Mar', amount: 22000 },
  { month: 'Apr', amount: 19000 },
  { month: 'May', amount: 25000 },
  { month: 'Jun', amount: 28000 },
];

// Program impact data
const programData = [
  { program: 'Education', impact: 5000 },
  { program: 'Nutrition', impact: 12000 },
  { program: 'Health', impact: 3000 },
  { program: 'Training', impact: 200 },
];

// Donation distribution by type
const donationTypeData = [
  { name: 'Individual', value: 65 },
  { name: 'Corporate', value: 25 },
  { name: 'Foundation', value: 10 },
];

const COLORS = ['#CD7F32', '#FFD700', '#35A359'];

export default function AnalyticsPage() {
  const totalDonations = donationData.reduce((sum, item) => sum + item.amount, 0);
  const totalImpact = programData.reduce((sum, item) => sum + item.impact, 0);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Analytics & Reports</h2>
        <p className="text-foreground/70">Track and visualize your foundation's impact</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-card border-border">
          <p className="text-foreground/60 text-sm mb-2">Total Donations (6 months)</p>
          <p className="text-4xl font-bold text-primary">${(totalDonations / 1000).toFixed(1)}K</p>
          <p className="text-xs text-accent mt-2">Average: ${(totalDonations / 6 / 1000).toFixed(1)}K/month</p>
        </Card>

        <Card className="p-6 bg-card border-border">
          <p className="text-foreground/60 text-sm mb-2">Total Impact</p>
          <p className="text-4xl font-bold text-accent">{totalImpact.toLocaleString()}</p>
          <p className="text-xs text-primary mt-2">People reached across programs</p>
        </Card>

        <Card className="p-6 bg-card border-border">
          <p className="text-foreground/60 text-sm mb-2">Active Programs</p>
          <p className="text-4xl font-bold text-primary">4</p>
          <p className="text-xs text-accent mt-2">Education, Nutrition, Health, Training</p>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation Trends */}
        <Card className="col-span-1 bg-card border-border">
          <CardHeader>
            <CardTitle>Donation Trends</CardTitle>
            <CardDescription>Monthly donation amounts over 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: {
                  label: 'Donations',
                  color: 'hsl(var(--chart-1))',
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={donationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#CD7F32"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Program Impact */}
        <Card className="col-span-1 bg-card border-border">
          <CardHeader>
            <CardTitle>Impact by Program</CardTitle>
            <CardDescription>Number of people reached per program</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                impact: {
                  label: 'People Reached',
                  color: 'hsl(var(--chart-2))',
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={programData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="program" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="impact" fill="#FFD700" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Donation Distribution Pie Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Donation Distribution</CardTitle>
          <CardDescription>Breakdown of donations by source type</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              individual: { label: 'Individual', color: '#CD7F32' },
              corporate: { label: 'Corporate', color: '#FFD700' },
              foundation: { label: 'Foundation', color: '#35A359' },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donationTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {donationTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
