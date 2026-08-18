import React from "react";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, onBack, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background px-5 pt-[max(env(safe-area-inset-top),32px)] pb-[max(env(safe-area-inset-bottom),24px)]">
      {onBack && (
        <button
          onClick={onBack}
          className="self-start -ml-2 mb-2 w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      <div className="flex flex-col items-center text-center mb-10 mt-6">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary mb-5"
          style={{ boxShadow: "0 8px 24px -8px rgba(0,0,0,0.25)" }}
        >
          <Icon className="w-7 h-7 text-primary-foreground" aria-hidden="true" strokeWidth={2} />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">{subtitle}</p>}
      </div>
      <div className="flex-1 w-full max-w-sm mx-auto">
        {children}
      </div>
      {footer && (
        <p className="text-center text-sm text-muted-foreground mt-6">{footer}</p>
      )}
    </div>
  );
}