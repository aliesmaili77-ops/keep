import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-5 pt-[max(env(safe-area-inset-top),1rem)] pb-12">
        <Link to="/welcome" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mb-4">Terms of Service</h1>
        <div className="text-sm text-muted-foreground space-y-4">
          <p>
            By using Keep, you agree to use the app to preserve genuine memories with people you
            know. You are responsible for the content you create and for ensuring you have the
            consent of anyone you mention or tag.
          </p>
          <h2 className="text-base font-semibold text-foreground mt-6">Private spaces</h2>
          <p>
            Circles are private. Do not share content from a Circle outside its members without
            consent. Do not invite people to a Circle without a genuine relationship to them.
          </p>
          <h2 className="text-base font-semibold text-foreground mt-6">Acceptable use</h2>
          <p>
            Do not use Keep to harass, threaten, or harm others. Do not post content that is illegal
            or violates others' rights. You can report or block any user from their profile or a
            Keep.
          </p>
          <h2 className="text-base font-semibold text-foreground mt-6">Your content</h2>
          <p>
            You own your content. You can edit or delete your Keeps and comments at any time. Circle
            owners can deactivate a Circle, which removes access for all members.
          </p>
          <p className="text-xs pt-4">Last updated: August 2026</p>
        </div>
      </div>
    </div>
  );
}