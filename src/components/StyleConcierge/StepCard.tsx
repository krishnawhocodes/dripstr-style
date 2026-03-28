import { useState, useRef, useEffect } from "react";
import TypewriterText from "./TypewriterText";
import { Upload, Camera, Pencil, Send } from "lucide-react";

interface StepCardProps {
  stepNumber: number;
  question: string;
  helperText?: string;
  options?: string[];
  type?: "chips" | "photo" | "prompt";
  answered?: string | null;
  onAnswer: (answer: string) => void;
  onEdit?: () => void;
  isActive: boolean;
  analysisText?: string;
}

const StepCard = ({ stepNumber, question, helperText, options, type = "chips", answered, onAnswer, onEdit, isActive, analysisText }: StepCardProps) => {
  const [questionDone, setQuestionDone] = useState(false);
  const [helperDone, setHelperDone] = useState(!helperText);
  const [analysisDone, setAnalysisDone] = useState(!analysisText);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [promptValue, setPromptValue] = useState("");
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive && cardRef.current) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
    }
  }, [isActive]);

  useEffect(() => {
    if (isEditingPrompt && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingPrompt]);

  // Answered/collapsed state
  if (answered !== undefined && answered !== null) {
    const isPromptType = type === "prompt";

    return (
      <div
        ref={cardRef}
        className="glass-card rounded-xl px-5 py-4 opacity-60 hover:opacity-80"
        style={{ transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase font-medium shrink-0">
              Step {stepNumber}
            </span>
            {isPromptType && isEditingPrompt ? (
              <form
                className="flex-1 flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (promptValue.trim()) {
                    onAnswer(promptValue.trim());
                    setIsEditingPrompt(false);
                  }
                }}
              >
                <input
                  ref={inputRef}
                  value={promptValue}
                  onChange={(e) => setPromptValue(e.target.value)}
                  className="flex-1 bg-transparent border-b border-border text-sm text-foreground font-medium outline-none focus:border-primary"
                  style={{ transition: "border-color 0.2s ease" }}
                />
                <button type="submit" className="text-primary hover:text-primary/80 transition-colors">
                  <Send size={14} />
                </button>
              </form>
            ) : (
              <span className="text-sm text-foreground font-medium truncate">{answered}</span>
            )}
          </div>
          {onEdit && !isEditingPrompt && (
            <button
              onClick={() => {
                if (isPromptType) {
                  setPromptValue(answered);
                  setIsEditingPrompt(true);
                } else {
                  onEdit();
                }
              }}
              className="text-muted-foreground hover:text-primary shrink-0 p-1 rounded-md hover:bg-secondary/50"
              style={{ transition: "all 0.2s ease" }}
            >
              <Pencil size={13} />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!isActive) return null;

  const handlePhotoSkip = () => onAnswer("Skipped");
  const handlePhotoUpload = () => {
    setPhotoUploaded(true);
    setTimeout(() => onAnswer("Photo uploaded — Warm palette · Relaxed fit · Street vibe"), 1200);
  };

  const handlePromptSubmit = () => {
    if (promptValue.trim()) {
      onAnswer(promptValue.trim());
    }
  };

  return (
    <div
      ref={cardRef}
      className="glass-card rounded-2xl p-6 md:p-8 animate-fade-up"
      style={{ animationDuration: "0.5s" }}
    >
      <span className="text-[10px] tracking-[0.3em] text-primary uppercase font-semibold mb-4 block">
        Step {stepNumber}
      </span>

      {/* Analysis text before question */}
      {analysisText && (
        <div className="mb-4 px-4 py-3.5 rounded-2xl" style={{
          background: "linear-gradient(135deg, hsla(18,100%,50%,0.08), hsla(30,100%,60%,0.05))",
          border: "1px solid hsla(18,100%,50%,0.12)"
        }}>
          <p className="text-sm text-foreground/90 font-medium leading-relaxed">
            <TypewriterText text={analysisText} speed={20} onComplete={() => setAnalysisDone(true)} />
          </p>
        </div>
      )}

      {(analysisDone || !analysisText) && (
        <>
          <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground mb-1" style={{ lineHeight: "1.2" }}>
            <TypewriterText text={question} speed={30} onComplete={() => setQuestionDone(true)} />
          </h3>

          {helperText && questionDone && (
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              <TypewriterText text={helperText} speed={25} onComplete={() => setHelperDone(true)} />
            </p>
          )}

          {/* Chips */}
          {questionDone && helperDone && type === "chips" && options && (
            <div className="flex flex-wrap gap-3 mt-5 animate-fade-up" style={{ animationDuration: "0.4s" }}>
              {options.map((opt, i) => (
                <button
                  key={opt}
                  onClick={() => onAnswer(opt)}
                  className="chip-base hover:border-primary/40 active:scale-95"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Photo */}
          {questionDone && helperDone && type === "photo" && (
            <div className="mt-5 animate-fade-up" style={{ animationDuration: "0.4s" }}>
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

          {/* Prompt input */}
          {questionDone && helperDone && type === "prompt" && (
            <div className="mt-5 animate-fade-up" style={{ animationDuration: "0.4s" }}>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handlePromptSubmit()}
                    placeholder="e.g. College fest, date night, office casual..."
                    className="w-full bg-[hsla(0,0%,10%,0.6)] border border-[hsla(0,0%,25%,0.5)] rounded-full px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50"
                    style={{ transition: "border-color 0.3s ease", backdropFilter: "blur(8px)" }}
                    autoFocus
                  />
                </div>
                <button
                  onClick={handlePromptSubmit}
                  disabled={!promptValue.trim()}
                  className="shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-30 hover:bg-primary/90 active:scale-95"
                  style={{ transition: "all 0.2s ease" }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StepCard;
