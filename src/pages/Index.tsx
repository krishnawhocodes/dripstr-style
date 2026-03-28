import { useState, useCallback, useRef, useEffect } from "react";
import TopBar from "@/components/StyleConcierge/TopBar";
import Hero from "@/components/StyleConcierge/Hero";
import StepCard from "@/components/StyleConcierge/StepCard";
import CuratingLoader from "@/components/StyleConcierge/CuratingLoader";
import ResultsSection from "@/components/StyleConcierge/ResultsSection";

interface Answers {
  gender: string | null;
  photo: string | null;
  vibe: string | null;
  category: string | null;
  occasion: string | null;
  priceRange: string | null;
}

const INITIAL: Answers = { gender: null, photo: null, vibe: null, category: null, occasion: null, priceRange: null };

const STEPS = [
  { key: "gender" as const, stepNumber: 1, question: "Who are we styling for?", options: ["Women", "Men"], type: "chips" as const },
  { key: "photo" as const, stepNumber: 2, question: "Want a sharper match?", helperText: "Optional — adds palette + fit cues. Takes 10 seconds.", type: "photo" as const },
  { key: "vibe" as const, stepNumber: 3, question: "Pick your vibe", options: ["Streetwear", "Minimal", "Daily", "Thrift", "Fusion"], type: "chips" as const },
  { key: "category" as const, stepNumber: 4, question: "Choose a category", options: ["Tops & Dresses", "Cargo & Pants", "Tees", "Shorts & Skirts", "Sweatshirts & Hoodies", "Jackets", "Cord Set", "Athleisure"], type: "chips" as const },
  { key: "occasion" as const, stepNumber: 5, question: "Tell us more about the occasion", helperText: "Help us understand where you'll rock this look.", type: "prompt" as const },
  { key: "priceRange" as const, stepNumber: 6, question: "Choose your range", options: ["Under ₹300", "₹300–₹500", "₹500+"], type: "chips" as const },
];

const Index = () => {
  const [answers, setAnswers] = useState<Answers>(INITIAL);
  const [activeStep, setActiveStep] = useState(0);
  const [curating, setCurating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [bagCount, setBagCount] = useState(0);
  const flowRef = useRef<HTMLDivElement>(null);

  const isCompact = activeStep > 0 || showResults;

  useEffect(() => {
    if (!isCompact) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isCompact]);

  // Build analysis text for step 5 (occasion) based on photo answer
  const getAnalysisText = (stepKey: string): string | undefined => {
    if (stepKey === "occasion" && answers.photo && answers.photo !== "Skipped") {
      return "✨ Love what we see — warm tones look stunning on you, and relaxed fits are totally your thing. Now let's match this vibe to the perfect occasion!";
    }
    return undefined;
  };

  const handleAnswer = useCallback((key: keyof Answers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setCurating(true);

    const delay = key === "photo" ? 600 : 300;

    setTimeout(() => {
      setCurating(false);
      const nextStep = activeStep + 1;
      if (nextStep < STEPS.length) {
        setActiveStep(nextStep);
      } else {
        setCurating(true);
        setTimeout(() => {
          setCurating(false);
          setShowResults(true);
        }, 1000);
      }
    }, delay);
  }, [activeStep]);

  const handleEditStep = useCallback((stepIndex: number) => {
    // Clear answers from this step onwards
    const keysToReset = STEPS.slice(stepIndex).map(s => s.key);
    setAnswers(prev => {
      const updated = { ...prev };
      keysToReset.forEach(k => { updated[k] = null; });
      return updated;
    });
    setActiveStep(stepIndex);
    setShowResults(false);
    setCurating(false);
  }, []);

  const handleRestart = useCallback(() => {
    setAnswers(INITIAL);
    setActiveStep(0);
    setCurating(false);
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleAddToBag = useCallback((id: number) => {
    setBagCount(prev => prev + 1);
  }, []);

  const handleRefine = () => {
    flowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleChangeVibe = () => {
    handleEditStep(2);
  };

  const handleChangeCategory = () => {
    handleEditStep(3);
  };

  return (
    <div className={`bg-background grain-overlay corner-glow ${!isCompact ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <TopBar bagCount={bagCount} onRestart={handleRestart} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 md:px-6">
        <Hero compact={isCompact} />

        <div ref={flowRef} className="space-y-3 pb-8">
          {STEPS.map((step, i) => {
            const answerValue = answers[step.key];
            const isAnswered = answerValue !== null;
            const isActive = i === activeStep && !curating;

            if (i > activeStep && !isAnswered) return null;

            return (
              <StepCard
                key={step.key}
                stepNumber={step.stepNumber}
                question={step.question}
                helperText={step.helperText}
                options={step.options}
                type={step.type}
                answered={isAnswered ? answerValue : undefined}
                onAnswer={(val) => handleAnswer(step.key, val)}
                onEdit={isAnswered ? () => handleEditStep(i) : undefined}
                isActive={isActive}
                analysisText={getAnalysisText(step.key)}
              />
            );
          })}

          {curating && <CuratingLoader text={showResults ? "Curating your edit…" : "Curating…"} />}
        </div>

        {showResults && !curating && (
          <div className="pb-20">
            <ResultsSection
              gender={answers.gender!}
              vibe={answers.vibe!}
              category={answers.category!}
              priceRange={answers.priceRange!}
              onAddToBag={handleAddToBag}
              onRefine={handleRefine}
              onRestart={handleRestart}
              onChangeVibe={handleChangeVibe}
              onChangeCategory={handleChangeCategory}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
