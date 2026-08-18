import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-5 pt-14 pb-12">
        <Link to="/welcome" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mb-4">Privacy Policy</h1>
        <div className="text-sm text-muted-foreground space-y-4">
          <p>
            Keep is a private shared-memory app. Your Circles and Keeps are only visible to the
            members of that Circle. We do not make your content public, searchable, or indexable.
          </p>
          <h2 className="text-base font-semibold text-foreground mt-6">What we collect</h2>
          <p>
            Your email address, display name, and the content you and your Circle members choose to
            keep. We do not track your location, browsing history, or activity outside the app.
          </p>
          <h2 className="text-base font-semibold text-foreground mt-6">Who can see your data</h2>
          <p>
            Only authenticated, active members of a Circle can see that Circle, its Keeps, comments,
            reactions, and member list. When a member leaves or is removed, they lose access
            immediately.
          </p>
          <h2 className="text-base font-semibold text-foreground mt-6">Voice and media</h2>
          <p>
            Voice Keeps and any future media are stored privately and served via time-limited links.
            They are not publicly accessible.
          </p>
          <h2 className="text-base font-semibold text-foreground mt-6">Your data is yours</h2>
          <p>
            You can delete your Keeps, comments, and Circles at any time. You can request account
            deletion from your Profile settings. We do not use your private content for AI training
            or advertising.
          </p>
          <h2 className="text-base font-semibold text-foreground mt-6">Analytics</h2>
          <p>
            We track only product-level events (such as account creation or Keep created) to
            evaluate the app. We never send Keep text, audio, comments, or Circle names as
            analytics properties.
          </p>
          <p className="text-xs pt-4">Last updated: August 2026</p>
        </div>
      </div>
    </div>
  );
}