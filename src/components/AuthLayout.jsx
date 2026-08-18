import React from "react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background px-5 pt-[max(env(safe-area-inset-top),32px)] pb-[max(env(safe-area-inset-bottom),24px)]">
      <div className="flex flex-col items-center text-center mb-10 mt-6">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-5"
          style={{ boxShadow: "0 8px 24px -8px rgba(0,0,0,0.25)" }}
        >
          <Icon className="w-8 h-8 text-primary-foreground" aria-hidden="true" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
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