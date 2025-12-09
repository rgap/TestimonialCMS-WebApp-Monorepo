'use client';

import { AppLayoutWithSidebar } from "@/components/layout/AppLayoutWithSidebar";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayoutWithSidebar>{children}</AppLayoutWithSidebar>;
}



