"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { health, type HealthResponse } from "@/lib/api";

export default function DashboardPage() {
  const [apiHealth, setApiHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);

  useEffect(() => {
    health
      .ready()
      .then(setApiHealth)
      .catch((err) => setHealthError(err.message));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Career Dashboard</h1>
        <p className="text-muted-foreground">
          Your Career DNA™ intelligence at a glance.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Career DNA Score", value: "—", icon: "🧬", description: "Upload a resume to begin" },
          { label: "Job Matches", value: "0", icon: "🎯", description: "No matches yet" },
          { label: "Skill Gaps", value: "—", icon: "📈", description: "Analysis pending" },
          { label: "Threat Level", value: "—", icon: "🛡️", description: "Monitoring inactive" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <span className="text-2xl">{stat.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* API Connectivity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">System Status</CardTitle>
          <CardDescription>Backend API connectivity check</CardDescription>
        </CardHeader>
        <CardContent>
          {apiHealth ? (
            <div className="flex items-center gap-3">
              <Badge variant="default" className="bg-green-600">
                ● Connected
              </Badge>
              <span className="text-sm text-muted-foreground">
                {apiHealth.app} v{apiHealth.version} — Database: {apiHealth.database}
              </span>
            </div>
          ) : healthError ? (
            <div className="flex items-center gap-3">
              <Badge variant="destructive">● Disconnected</Badge>
              <span className="text-sm text-muted-foreground">{healthError}</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Badge variant="secondary">● Checking...</Badge>
              <span className="text-sm text-muted-foreground">
                Connecting to API...
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
