import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import ContentScreen from "@/components/create/ContentScreen";
import ReviewStep from "@/components/create/ReviewStep";

export default function Create() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: content, 1: review, 2: success
  const [data, setData] = useState({});

  const handleContentContinue = (content) => {
    const keepType = content.title ? "memory" : "quote";
    setData({ ...content, keepType });
    setStep(1);
  };

  const handleKeep = (reviewData) => {
    setData((prev) => ({ ...prev, ...reviewData }));
    setStep(2);
    setTimeout(() => navigate("/"), 1500);
  };

  const handleBack = () => {
    if (step === 0) navigate(-1);
    else setStep(step - 1);
  };

  if (step === 2) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Check className="w-10 h-10 text-primary" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Kept!</h1>
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
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {step === 0 && <ContentScreen initialData={data} onContinue={handleContentContinue} />}
      {step === 1 && <ReviewStep keepType={data.keepType} data={data} onKeep={handleKeep} />}
    </div>
  );
}