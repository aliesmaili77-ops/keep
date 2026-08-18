import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-8">
        <Bookmark className="w-8 h-8 text-primary-foreground" strokeWidth={2} />
      </div>
      <h1
        className="text-4xl font-semibold tracking-tight text-foreground mb-4"
        style={{ lineHeight: 1.1 }}
      >
        What happens between you
        <br />
        is worth keeping.
      </h1>
      <p className="text-muted-foreground text-lg mb-12 max-w-sm">
        The things your group chat forgets—kept with the people who lived them.
      </p>
      <div className="w-full max-w-sm space-y-3">
        <Link to="/register">
          <Button className="w-full h-12 text-base font-medium">Create your account</Button>
        </Link>
        <Link to="/login">
          <Button variant="outline" className="w-full h-12 text-base font-medium">
            I already have one
          </Button>
        </Link>
      </div>
      <p className="text-xs text-muted-foreground mt-10 max-w-xs leading-relaxed">
        By continuing you agree to our{" "}
        <Link to="/privacy" className="underline">Privacy Policy</Link>
        {" "}and{" "}
        <Link to="/terms" className="underline">Terms</Link>.
      </p>
    </div>
  );
}