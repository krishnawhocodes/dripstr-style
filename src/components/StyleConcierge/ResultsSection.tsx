import { useState, useRef, useEffect } from "react";
import { products, type Product } from "@/data/products";
import ProductCard from "./ProductCard";
import { ArrowUp } from "lucide-react";

interface ResultsSectionProps {
  gender: string;
  vibe: string;
  category: string;
  priceRange: string;
  onAddToBag: (id: number) => void;
  onRefine: () => void;
  onRestart: () => void;
  onChangeVibe: () => void;
  onChangeCategory: () => void;
}

function filterProducts(gender: string, vibe: string, category: string, priceRange: string): Product[] {
  return products.filter(p => {
    if (p.gender !== gender) return false;
    if (p.vibe !== vibe) return false;
    if (p.category !== category) return false;
    const price = p.price;
    if (priceRange === "Under ₹300" && price >= 300) return false;
    if (priceRange === "₹300–₹500" && (price < 300 || price > 500)) return false;
    if (priceRange === "₹500+" && price < 500) return false;
    return true;
  });
}

function getRelaxedProducts(gender: string, vibe: string, category: string): Product[] {
  // Relaxed filter: match gender + at least vibe OR category
  return products.filter(p => {
    if (p.gender !== gender) return false;
    return p.vibe === vibe || p.category === category;
  });
}

const ResultsSection = ({ gender, vibe, category, priceRange, onAddToBag, onRefine, onRestart, onChangeVibe, onChangeCategory }: ResultsSectionProps) => {
  const [showAll, setShowAll] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }, []);

  let filtered = filterProducts(gender, vibe, category, priceRange);
  if (filtered.length === 0) {
    filtered = getRelaxedProducts(gender, vibe, category);
  }

  const displayed = showAll ? filtered : filtered.slice(0, 8);

  if (filtered.length === 0) {
    return (
      <div ref={ref} className="glass-card rounded-2xl p-8 text-center animate-fade-up">
        <p className="text-lg text-foreground font-display font-semibold mb-2">No matches for this combo</p>
        <p className="text-sm text-muted-foreground mb-6">Try a different vibe or category.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={onChangeVibe} className="chip-base">Change vibe</button>
          <button onClick={onChangeCategory} className="chip-base">Change category</button>
          <button onClick={onRestart} className="chip-base chip-selected">Restart</button>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="animate-fade-up" style={{ animationDuration: "0.7s" }}>
      {/* Results header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground" style={{ lineHeight: "1.1" }}>
          Your Edit
        </h2>
        <p className="text-sm text-muted-foreground mt-2">Curated from Drippr picks</p>
        <button onClick={onRefine} className="inline-flex items-center gap-1.5 text-xs text-primary mt-3 hover:underline underline-offset-4 transition-colors">
          <ArrowUp size={12} /> Refine selections
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {displayed.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} onAddToBag={onAddToBag} />
        ))}
      </div>

      {filtered.length > 8 && !showAll && (
        <div className="flex justify-center mt-8">
          <button onClick={() => setShowAll(true)} className="chip-base chip-selected px-8">
            Show more ({filtered.length - 8} more)
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;
