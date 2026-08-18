import React from "react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const { user, logout } = useAuth();
  return (
    <div className="px-5 pt-14 pb-4">
      <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
      <p className="text-muted-foreground text-sm mt-1">{user?.email}</p>
      <Button variant="outline" className="mt-8" onClick={() => logout()}>
        Log out
      </Button>
    </div>
  );
}