"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/query-client";
import {
  AnimatedElement,
  AnimatedContainer,
} from "@/components/motion/animated-elements";
import { AnimatedCounter } from "@/components/motion/animated-counter";

type DashboardSummary = {
  children: { total: number; sponsored: number; available: number };
  sponsors: { totalActive: number };
  sponsorships: {
    active: number;
    pending: number;
    cancelled: number;
    totalPledged: number;
  };
  payments: {
    completedCount: number;
    totalReceived: number;
    pendingCount: number;
    failedCount: number;
    currency: string;
  };
  reportCards: { total: number };
  recentPayments: Array<{
    id?: string;
    amount: number;
    currency: string;
    method: string;
    status: string;
    date?: string;
    childName: string;
    sponsorName: string;
  }>;
};

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useQuery<DashboardSummary>({
    queryKey: ["dashboard", "summary"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/dashboard/summary");
      return response.json();
    },
  });

  const summary = data || {
    children: { total: 0, sponsored: 0, available: 0 },
    sponsors: { totalActive: 0 },
    sponsorships: { active: 0, pending: 0, cancelled: 0, totalPledged: 0 },
    payments: {
      completedCount: 0,
      totalReceived: 0,
      pendingCount: 0,
      failedCount: 0,
      currency: "UGX",
    },
    reportCards: { total: 0 },
    recentPayments: [],
  };

  const stats = [
    {
      label: "Sponsored Children",
      value: summary.children.sponsored,
      color: "bg-primary",
    },
    {
      label: "Total Received",
      value: summary.payments.totalReceived,
      suffix: ` ${summary.payments.currency}`,
      color: "bg-accent",
    },
    {
      label: "Active Sponsorships",
      value: summary.sponsorships.active,
      color: "bg-primary",
    },
    {
      label: "Completed Payments",
      value: summary.payments.completedCount,
      color: "bg-accent",
    },
  ];

  return (
    <div className="p-8">
      <AnimatedElement variant="fadeInDown">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome to Dashboard
          </h2>
          <p className="text-foreground/70">
            Manage your foundation's operations and track impact
          </p>
        </div>
      </AnimatedElement>

      {isError ? (
        <Card className="mb-8 border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-destructive">
              Unable to load live dashboard data.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : null}

      {/* Stats Grid */}
      <AnimatedContainer staggerDelay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <AnimatedElement
              key={index}
              variant="slideInUp"
              delay={index * 0.08}
              className="p-6 bg-card border-border"
            >
              <p className="text-foreground/60 text-sm mb-2">{stat.label}</p>
              <div className="flex items-end gap-3">
                <p className="text-3xl font-bold text-foreground">
                  {isLoading ? (
                    "--"
                  ) : (
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  )}
                </p>
                <div className={`${stat.color} w-2 h-8 rounded-full`}></div>
              </div>
            </AnimatedElement>
          ))}
        </div>
      </AnimatedContainer>

      {/* Quick Actions */}
      <AnimatedContainer staggerDelay={0.2}>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <AnimatedElement variant="fadeInLeft">
            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2 gap-5 flex flex-col">
                <Link className="mx-5" href="/dashboard/children">
                  <Button
                    className=" w-full justify-start text-left"
                    variant="outline"
                  >
                    🧒 Children
                  </Button>
                </Link>
                <Link className="mx-5" href="/dashboard/sponsorships">
                  <Button
                    className=" w-full justify-start text-left"
                    variant="outline"
                  >
                    💝 Sponsorships
                  </Button>
                </Link>
                <Link className="mx-5" href="/dashboard/staff">
                  <Button
                    className=" w-full justify-start text-left"
                    variant="outline"
                  >
                    👥 Staff & Volunteers
                  </Button>
                </Link>
                <Link className="mx-5" href="/dashboard/blogs">
                  <Button
                    className=" w-full justify-start text-left"
                    variant="outline"
                  >
                    📖 Blogs
                  </Button>
                </Link>
                <Link className="mx-5" href="/dashboard/gallery">
                  <Button
                    className=" w-full justify-start text-left"
                    variant="outline"
                  >
                    🖼️ Gallery
                  </Button>
                </Link>
                <Link className="mx-5" href="/dashboard/events">
                  <Button
                    className=" w-full justify-start text-left"
                    variant="outline"
                  >
                    📅 Events
                  </Button>
                </Link>
              </div>
            </Card>
          </AnimatedElement>

          {/* Recent Activity */}
          <AnimatedElement variant="fadeInRight">
            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Live Summary
              </h3>
              <div className="space-y-3">
                {[
                  `${summary.children.total} total children (${summary.children.available} available)`,
                  `${summary.sponsors.totalActive} active sponsors`,
                  `${summary.sponsorships.pending} pending sponsorships`,
                  `${summary.reportCards.total} report cards uploaded`,
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between pb-3 border-b border-border last:border-b-0"
                  >
                    <div>
                      <p className="text-foreground font-medium">
                        {isLoading ? "Loading live summary..." : activity}
                      </p>
                      <p className="text-xs text-foreground/60 mt-1">
                        Current data
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </AnimatedElement>
        </div>
      </AnimatedContainer>

      <Card className="bg-card border-border p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Recent Payments
            </h3>
            <p className="text-sm text-muted-foreground">
              Latest recorded sponsorship payments
            </p>
          </div>
          <Link href="/dashboard/sponsorships">
            <Button variant="outline">View sponsorships</Button>
          </Link>
        </div>
        {summary.recentPayments.length > 0 ? (
          <div className="space-y-3">
            {summary.recentPayments.map((payment, index) => (
              <div
                key={payment.id || `${payment.childName}-${index}`}
                className="flex flex-col gap-2 border-b border-border pb-3 last:border-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {payment.sponsorName} → {payment.childName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {payment.method} ·{" "}
                    {payment.date
                      ? new Date(payment.date).toLocaleDateString()
                      : "No date"}
                  </p>
                </div>
                <p className="font-semibold text-accent">
                  {payment.amount.toLocaleString()} {payment.currency}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No payments have been recorded yet.
          </p>
        )}
      </Card>
    </div>
  );
}
