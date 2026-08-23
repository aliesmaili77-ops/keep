import React, { useState } from "react";
import { Copy, Check, Link as LinkIcon } from "lucide-react";

export default function ShareOptions({ token, circleName }) {
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const inviteLink = `${window.location.origin}/invite?token=${token}`;
  const inviteCode = token.slice(0, 8).toUpperCase();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Shareable link */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Shareable Link
        </p>
        <div className="flex items-center gap-2 glass-tight rounded-full pl-4 pr-1.5 py-1.5">
          <LinkIcon className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="flex-1 text-xs truncate text-muted-foreground">{inviteLink}</span>
          <button
            onClick={handleCopyLink}
            className="shrink-0 h-8 px-3 rounded-full bg-primary/10 flex items-center gap-1 text-primary text-xs font-medium active:scale-95 transition-transform"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* QR Code */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          QR Code
        </p>
        <div className="flex flex-col items-center glass-tight rounded-2xl py-4">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data=${encodeURIComponent(inviteLink)}`}
            alt="Invite QR code"
            className="w-40 h-40 rounded-lg"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Scan to join{circleName ? ` ${circleName}` : ""}
          </p>
        </div>
      </div>

      {/* Invite code */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Invite Code
        </p>
        <div className="glass-tight rounded-2xl px-4 py-3 flex items-center justify-between">
          <span className="text-lg font-mono font-semibold tracking-widest">{inviteCode}</span>
          <button
            onClick={handleCopyCode}
            className="text-xs text-primary font-medium flex items-center gap-1"
          >
            {codeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {codeCopied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}