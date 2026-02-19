import React from "react"
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminClientLayout from "./AdminClientLayout";
import { getUserProfile } from "@/lib/actions/user-dashboard-actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const userProfile = await getUserProfile();

  return (
    <AdminClientLayout userProfile={userProfile}>
      {children}
    </AdminClientLayout>
  );
}
