import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import ContentScreen from "@/components/create/ContentScreen";
import ReviewStep from "@/components/create/ReviewStep";
import { base44 } from "@/api/base44Client";
import { useInvalidateKeeps } from "@/hooks/useKeeps";

export default function Create() {
  const navigate = useNavigate();
  const invalidateKeeps = useInvalidateKeeps();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [saving, setSaving] = useState(false);

  const handleContentContinue = (content) => {
    const keepType = content.title ? "memory" : "quote";
    setData({ ...content, keepType });
    setStep(1);
  };

  const handleKeep = async (reviewData) => {
    setSaving(true);
    try {
      const payload = {
        circle_id: reviewData.circle_id,
        keep_type: data.keepType,
        text: data.text,
        title: data.title || undefined,
        speaker_name: data.speaker_name || undefined,
        context: data.context || undefined,
        happened_at: reviewData.happened_at || undefined,
        milestone_tag: reviewData.milestone_tag || undefined,
        status: "active",
        circle_member_ids: reviewData.circle_member_ids,
      };
      await base44.entities.Keep.create(payload);
      invalidateKeeps();
      setData((prev) => ({ ...prev, ...reviewData }));
      setStep(2);
      setTimeout(() => navigate("/"), 1500);
    } catch (e) {
      console.error("Failed to keep", e);
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (step === 0) navigate(-1);
    else setStep(step - 1);
  };

  if (step === 2) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-primary" strokeWidth={2.5} />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Kept!</h1>
        <p className="text-muted-foreground text-sm mt-1">Your moment is preserved</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto">
      <div className="flex items-center px-5 pt-[max(env(safe-area-inset-top),12px)] pb-2">
        <button
          onClick={handleBack}
          className="w-9 h-9 flex items-center justify-center -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowLeft className="w-5 h-5" />}
        </button>
      </div>

      {step === 0 && <ContentScreen initialData={data} onContinue={handleContentContinue} />}
      {step === 1 && (
        <ReviewStep keepType={data.keepType} data={data} onKeep={handleKeep} saving={saving} />
      )}
    </div>
  );
}