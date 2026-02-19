import React from "react"
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClientLayout from "./DashboardClientLayout";
import { getUserProfile } from "@/lib/actions/user-dashboard-actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/api/auth/logout");
  }

  const userProfile = await getUserProfile();

  return (
    <DashboardClientLayout userProfile={userProfile}>
      {children}
    </DashboardClientLayout>
  );
}
