"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  XCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Inbox,
} from "lucide-react";

const appTabs = ["Pending", "Accepted", "In Progress", "Completed", "Declined"];

const sampleApplications = [
  {
    id: "1",
    taskTitle: "Build a responsive landing page for restaurant",
    postedBy: "Emeka Okafor",
    postedByInitials: "EO",
    proposedPrice: 120,
    status: "pending",
    dateApplied: "Dec 15, 2024",
    taskId: "1",
  },
  {
    id: "2",
    taskTitle: "WordPress Blog Setup",
    postedBy: "Amina Kaduna",
    postedByInitials: "AK",
    proposedPrice: 180,
    status: "accepted",
    dateApplied: "Dec 13, 2024",
    taskId: "2",
  },
  {
    id: "3",
    taskTitle: "Social Media Content Creation",
    postedBy: "Fatima Al-Rashid",
    postedByInitials: "FA",
    proposedPrice: 250,
    status: "in_progress",
    dateApplied: "Dec 10, 2024",
    taskId: "3",
  },
  {
    id: "4",
    taskTitle: "Logo Design for Fashion Brand",
    postedBy: "Kwame Mensah",
    postedByInitials: "KM",
    proposedPrice: 300,
    status: "completed",
    dateApplied: "Dec 5, 2024",
    taskId: "4",
  },
  {
    id: "5",
    taskTitle: "Mobile App UI Design",
    postedBy: "Lagos Dev Hub",
    postedByInitials: "LD",
    proposedPrice: 400,
    status: "declined",
    dateApplied: "Dec 3, 2024",
    taskId: "5",
  },
  {
    id: "6",
    taskTitle: "Data Entry for E-commerce Store",
    postedBy: "Chinedu Eze",
    postedByInitials: "CE",
    proposedPrice: 60,
    status: "pending",
    dateApplied: "Dec 16, 2024",
    taskId: "6",
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-emerald-100 text-emerald-700",
  in_progress: "bg-cyan-100 text-emerald-700",
  completed: "bg-teal-100 text-teal-700",
  declined: "bg-rose-100 text-rose-700",
};

const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  accepted: CheckCircle2,
  in_progress: AlertCircle,
  completed: CheckCircle2,
  declined: XCircle,
};

function ApplicationCard({
  app,
}: {
  app: (typeof sampleApplications)[0];
}) {
  const StatusIcon = statusIcons[app.status];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Link
                href={`/task/${app.taskId}`}
                className="text-sm font-semibold hover:text-primary transition-colors line-clamp-2"
              >
                {app.taskTitle}
              </Link>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge
                  variant="secondary"
                  className={`text-[10px] gap-1 ${statusColors[app.status]}`}
                >
                  <StatusIcon className="h-3 w-3" />
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </Badge>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-emerald-600">
                ${app.proposedPrice}
              </p>
              <p className="text-[11px] text-muted-foreground">proposed</p>
            </div>
          </div>

          {/* Posted by */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                {app.postedByInitials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              Posted by{" "}
              <span className="font-medium text-foreground">
                {app.postedBy}
              </span>
            </span>
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Applied {app.dateApplied}
            </span>
          </div>

          {/* Actions */}
          {app.status === "pending" && (
            <div className="flex items-center gap-2 pt-1 border-t">
              <Link href={`/task/${app.taskId}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs h-8"
                >
                  <Eye className="h-3 w-3" />
                  View Task
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs h-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
              >
                <XCircle className="h-3 w-3" />
                Withdraw
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ tab }: { tab: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <Inbox className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="font-medium">No {tab.toLowerCase()} applications</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        {tab === "Pending"
          ? "You haven't applied for any tasks yet. Start browsing available tasks."
          : `You don't have any ${tab.toLowerCase()} applications.`}
      </p>
      <Link href="/browse">
        <Button size="sm" className="gap-1.5 mt-3">
          <Search className="h-4 w-4" />
          Find Work
        </Button>
      </Link>
    </div>
  );
}

export default function MyApplicationsPage() {
  const [activeTab, setActiveTab] = useState("Pending");

  const filteredApps = sampleApplications.filter(
    (a) => a.status === activeTab.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Inbox className="h-6 w-6 text-emerald-600" />
            My Applications
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track the status of your task applications
          </p>
        </div>
        <Link href="/browse">
          <Button className="gap-2">
            <Search className="h-4 w-4" />
            Find Work
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-auto flex-wrap gap-1 p-1">
          {appTabs.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="text-xs px-3 py-1.5">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {appTabs.map((tab) => (
          <TabsContent key={tab} value={tab}>
            {filteredApps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
                {sampleApplications
                  .filter((a) => a.status === tab.toLowerCase())
                  .map((app) => (
                    <ApplicationCard key={app.id} app={app} />
                  ))}
              </div>
            ) : (
              <EmptyState tab={tab} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
