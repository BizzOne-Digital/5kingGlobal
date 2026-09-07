'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/components/providers/CartProvider';
import { useToast } from '@/components/providers/ToastProvider';
import type { IProduct } from '@/models/Product';

export function AddToCartButton({ product }: { product: IProduct }) {
  const { addItem } = useCart();
  const toast = useToast();
  const [quantity, setQuantity] = useState(1);
  const outOfStock = product.inventory <= 0;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center rounded-sm border border-navy-900/15">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex h-11 w-11 items-center justify-center text-navy-700 hover:bg-navy-50"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-10 text-center text-sm font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="flex h-11 w-11 items-center justify-center text-navy-700 hover:bg-navy-50"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <Button
        variant="gold"
        size="lg"
        disabled={outOfStock}
        className="flex-1"
        onClick={() => {
          addItem(
            {
              productId: product._id.toString(),
              name: product.name,
              slug: product.slug,
              price: product.price,
              image: product.images?.[0],
            },
            quantity
          );
          toast.success(`${product.name} added to cart`);
        }}
      >
        <ShoppingBag className="h-4 w-4" />
        {outOfStock ? 'Out of Stock' : 'Add to Cart'}
      </Button>
    </div>
  );
}
