import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What is a Keep?",
    a: "A Keep is a saved moment — a quote, memory, or voice note — shared within a Circle with your closest people.",
  },
  {
    q: "How do I invite someone?",
    a: "Go to People or open a Circle and tap the invite button. You can share a link or send an email invitation.",
  },
  {
    q: "Who can see my Keeps?",
    a: "Only the members of the Circle the Keep belongs to. You control who's in each Circle.",
  },
  {
    q: "How do Circles work?",
    a: "Circles are private spaces for a group of people. Each Circle has its own Keeps, comments, and reactions.",
  },
  {
    q: "Can I leave a Circle?",
    a: "Yes — open the Circle and tap 'Leave Circle'. You'll no longer see its content.",
  },
];

export default function HelpCenterSheet({ open, onOpenChange }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl px-5 pb-8 pt-4 max-h-[85vh] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Help Center</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2">
          {faqs.map((f, i) => (
            <div key={i} className="glass-tight rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <span className="text-sm font-medium">{f.q}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-muted-foreground shrink-0 transition-transform",
                    openIdx === i && "rotate-180"
                  )}
                />
              </button>
              {openIdx === i && (
                <p className="px-4 pb-3 text-sm text-muted-foreground leading-relaxed">
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-5">
          Need more help? Contact Base44 support.
        </p>
      </SheetContent>
    </Sheet>
  );
}