import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { base44 } from "@/api/base44Client";
import { Loader2, CheckCircle } from "lucide-react";

const reasons = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "other", label: "Other" },
];

export default function ReportProblemSheet({ open, onOpenChange }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reason, setReason] = useState("spam");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await base44.entities.Report.create({
        reported_by: user.id,
        reason,
        details: details.trim(),
      });
      setSubmitted(true);
    } catch (e) {
      toast({ title: "Couldn't submit report", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) {
          setSubmitted(false);
          setDetails("");
          setReason("spam");
        }
      }}
    >
      <SheetContent
        side="bottom"
        className="rounded-t-3xl px-5 pb-8 pt-4 max-h-[85vh] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Report a Problem</SheetTitle>
        </SheetHeader>
        {submitted ? (
          <div className="mt-5 flex flex-col items-center text-center py-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <CheckCircle className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Thanks — your report has been submitted. We'll review it shortly.
            </p>
            <Button className="w-full mt-5" size="lg" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Reason
              </label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {reasons.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setReason(r.value)}
                    className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-all ${
                      reason === r.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 bg-card text-muted-foreground"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Details (optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                placeholder="Tell us what happened..."
                className="w-full mt-1.5 rounded-2xl border border-border/60 bg-card px-4 py-2.5 text-sm outline-none focus:border-primary resize-none"
              />
            </div>
            <Button
              className="w-full"
              size="lg"
              disabled={submitting}
              onClick={handleSubmit}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}