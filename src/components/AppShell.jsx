import React from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

export default function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-28">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}