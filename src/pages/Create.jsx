import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Create() {
  return (
    <div className="px-5 pt-14 pb-4">
      <h1 className="text-2xl font-semibold tracking-tight">Keep this</h1>
      <p className="text-muted-foreground text-sm mt-1">Choose what to preserve</p>
      <div className="mt-24 text-center space-y-4">
        <p className="text-muted-foreground text-sm">
          Create a Circle first, then keep your first memory.
        </p>
        <Link to="/circles">
          <Button variant="outline">Create a Circle</Button>
        </Link>
      </div>
    </div>
  );
}