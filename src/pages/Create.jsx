import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import ProgressDots from "@/components/create/ProgressDots";
import TypeSelect from "@/components/create/TypeSelect";
import QuoteContent from "@/components/create/QuoteContent";
import MemoryContent from "@/components/create/MemoryContent";
import VoiceContent from "@/components/create/VoiceContent";
import ReviewStep from "@/components/create/ReviewStep";

export default function Create() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: type, 1: content, 2: review, 3: success
  const [keepType, setKeepType] = useState(null);
  const [data, setData] = useState({});

  const handleTypeSelect = (type) => {
    setKeepType(type);
    setStep(1);
  };

  const handleContentContinue = (content) => {
    setData((prev) => ({ ...prev, ...content }));
    setStep(2);
  };

  const handleKeep = (reviewData) => {
    setData((prev) => ({ ...prev, ...reviewData }));
    setStep(3);
    setTimeout(() => navigate("/"), 1500);
  };

  const handleBack = () => {
    if (step === 0) navigate(-1);
    else setStep(step - 1);
  };

  if (step === 3) {
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
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-[max(env(safe-area-inset-top),12px)] pb-2">
        <button
          onClick={handleBack}
          className="w-9 h-9 flex items-center justify-center -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <ProgressDots step={step} />
      </div>

      {/* Steps */}
      {step === 0 && <TypeSelect onSelect={handleTypeSelect} />}
      {step === 1 && keepType === "quote" && (
        <QuoteContent initialData={data} onContinue={handleContentContinue} />
      )}
      {step === 1 && keepType === "memory" && (
        <MemoryContent initialData={data} onContinue={handleContentContinue} />
      )}
      {step === 1 && keepType === "voice" && (
        <VoiceContent onContinue={handleContentContinue} />
      )}
      {step === 2 && (
        <ReviewStep keepType={keepType} data={data} onKeep={handleKeep} />
      )}
    </div>
  );
}