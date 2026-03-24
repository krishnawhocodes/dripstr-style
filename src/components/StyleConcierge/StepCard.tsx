import { useState, useRef, useEffect } from "react";
import TypewriterText from "./TypewriterText";
import { Upload, Camera } from "lucide-react";

interface StepCardProps {
  stepNumber: number;
  question: string;
  helperText?: string;
  options?: string[];
  type?: "chips" | "photo";
  answered?: string | null;
  onAnswer: (answer: string) => void;
  isActive: boolean;
}

const StepCard = ({ stepNumber, question, helperText, options, type = "chips", answered, onAnswer, isActive }: StepCardProps) => {
  const [questionDone, setQuestionDone] = useState(false);
  const [helperDone, setHelperDone] = useState(!helperText);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && cardRef.current) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    }
  }, [isActive]);

  // Answered/collapsed state
  if (answered !== undefined && answered !== null) {
    return (
      <div ref={cardRef} className="glass-card rounded-xl px-5 py-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-60 scale-[0.98]">
        <div className="flex items-center gap-3">
          <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase font-medium">Step {stepNumber}</span>
          <span className="text-sm text-foreground font-medium">{answered}</span>
        </div>
      </div>
    );
  }

  if (!isActive) return null;

  const handlePhotoSkip = () => onAnswer("Skipped");
  const handlePhotoUpload = () => {
    setPhotoUploaded(true);
    setTimeout(() => onAnswer("Photo uploaded — Warm palette · Relaxed fit · Street vibe"), 1500);
  };

  return (
    <div ref={cardRef} className="glass-card rounded-2xl p-6 md:p-8 animate-fade-up" style={{ animationDuration: "0.7s" }}>
      <span className="text-[10px] tracking-[0.3em] text-primary uppercase font-semibold mb-4 block">
        Step {stepNumber}
      </span>

      <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground mb-1" style={{ lineHeight: "1.2" }}>
        <TypewriterText text={question} speed={50} onComplete={() => setQuestionDone(true)} />
      </h3>

      {helperText && questionDone && (
        <p className="text-sm text-muted-foreground mt-2 mb-4">
          <TypewriterText text={helperText} speed={30} onComplete={() => setHelperDone(true)} />
        </p>
      )}

      {questionDone && helperDone && type === "chips" && options && (
        <div className="flex flex-wrap gap-3 mt-5 animate-fade-up" style={{ animationDuration: "0.5s" }}>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => onAnswer(opt)}
              className="chip-base hover:border-primary/40 active:scale-96"
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {questionDone && helperDone && type === "photo" && (
        <div className="mt-5 animate-fade-up" style={{ animationDuration: "0.5s" }}>
          {!photoUploaded ? (
            <>
              <div className="flex flex-wrap gap-3">
                <button onClick={handlePhotoUpload} className="chip-base chip-selected flex items-center gap-2">
                  <Upload size={14} /> Upload photo
                </button>
                <button onClick={handlePhotoUpload} className="chip-base flex items-center gap-2">
                  <Camera size={14} /> Open camera
                </button>
                <button onClick={handlePhotoSkip} className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
                  Skip
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-3 opacity-60">
                Photos are used only for this session.
              </p>
            </>
          ) : (
            <div className="space-y-3">
              <div className="w-20 h-20 rounded-xl bg-secondary border border-border overflow-hidden">
                <div className="w-full h-full shimmer-bar" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium">Style Snapshot</p>
                <div className="flex flex-wrap gap-2">
                  {["Warm palette", "Relaxed fit", "Street vibe"].map(tag => (
                    <span key={tag} className="chip-base chip-selected text-xs px-3 py-1.5">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StepCard;
