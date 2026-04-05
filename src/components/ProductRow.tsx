import { PRODUCTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface ProductRowProps {
  index: number;
  product: string;
  option: string;
  quantity: number;
  onProductChange: (index: number, product: string) => void;
  onOptionChange: (index: number, option: string) => void;
  onQuantityChange: (index: number, quantity: number) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export default function ProductRow({
  index, product, option, quantity,
  onProductChange, onOptionChange, onQuantityChange, onRemove, canRemove,
}: ProductRowProps) {
  const selectedProduct = PRODUCTS.find((p) => p.name === product);
  const hasOptions = selectedProduct?.options !== null && selectedProduct?.options !== undefined;
  const price = hasOptions
    ? selectedProduct?.options?.find((o) => o.label === option)?.price ?? 0
    : selectedProduct?.fixedPrice ?? 0;
  const subtotal = price * quantity;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-end sm:gap-3">
      <div className="flex-1 min-w-0">
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Product</label>
        <Select value={product} onValueChange={(v) => onProductChange(index, v)}>
          <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
          <SelectContent>
            {PRODUCTS.map((p) => (
              <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasOptions && (
        <div className="flex-1 min-w-0">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Option</label>
          <Select value={option} onValueChange={(v) => onOptionChange(index, v)}>
            <SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger>
            <SelectContent>
              {selectedProduct?.options?.map((o) => (
                <SelectItem key={o.label} value={o.label}>{o.label} — ₹{o.price}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="w-20">
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Qty</label>
        <Input
          type="number" min={1} value={quantity}
          onChange={(e) => onQuantityChange(index, Math.max(1, parseInt(e.target.value) || 1))}
        />
      </div>

      <div className="flex items-end gap-2">
        <div className="text-sm font-semibold text-primary whitespace-nowrap py-2">
          ₹{subtotal}
        </div>
        {canRemove && (
          <Button variant="ghost" size="icon" onClick={() => onRemove(index)} className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
