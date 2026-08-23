import { Quote, BookOpen, Mic } from "lucide-react";

export const typeIcon = {
  quote: Quote,
  memory: BookOpen,
  voice: Mic,
};

export function formatKeepDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function isRTLText(text) {
  if (!text) return false;
  const rtlChars = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;
  return rtlChars.test(text);
}