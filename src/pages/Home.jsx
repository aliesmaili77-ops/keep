import React from "react";

export default function Home() {
  return (
    <div className="px-5 pt-14 pb-4">
      <h1 className="text-2xl font-semibold tracking-tight">Keeps</h1>
      <p className="text-muted-foreground text-sm mt-1">Recent memories from all your Circles</p>
      <div className="mt-24 text-center">
        <p className="text-muted-foreground text-sm">
          No Keeps yet. Create a Circle to start keeping what happens.
        </p>
      </div>
    </div>
  );
}