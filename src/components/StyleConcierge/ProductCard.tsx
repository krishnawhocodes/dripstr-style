import { ShoppingBag, ExternalLink } from "lucide-react";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToBag: (id: number) => void;
}

const ProductCard = ({ product, index, onAddToBag }: ProductCardProps) => {
  return (
    <div
      className="glass-card rounded-2xl overflow-hidden group animate-stagger-in"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
    >
      <div className="aspect-[4/5] overflow-hidden bg-secondary relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h4 className="font-medium text-sm text-foreground leading-tight">{product.name}</h4>
          <p className="text-primary font-semibold text-base mt-1">₹{product.price}</p>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">{product.reason}</p>

        <div className="flex flex-wrap gap-2 pt-1">
          <button className="chip-base text-xs px-3 py-2 flex items-center gap-1.5 hover:border-primary/40">
            <ExternalLink size={12} /> View
          </button>
          <button
            onClick={() => onAddToBag(product.id)}
            className="chip-base chip-selected text-xs px-3 py-2 flex items-center gap-1.5"
          >
            <ShoppingBag size={12} /> Bag
          </button>
          <button className="chip-base text-xs px-3 py-2 opacity-40 cursor-not-allowed" disabled>
            Buy <span className="text-[9px] ml-0.5 opacity-60">Soon</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
