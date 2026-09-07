'use client';

import Image from 'next/image';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency } from '@/lib/utils/format';

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-navy-950/50 backdrop-blur-sm animate-fade-in">
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-premium">
        <div className="flex items-center justify-between border-b border-navy-900/10 px-6 py-5">
          <h2 className="font-display text-lg text-navy-950">Your Cart</h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded-full p-1.5 text-navy-500 hover:bg-navy-900/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              description="Browse our products to add items to your cart."
            />
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-navy-50">
                    {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-navy-950">{item.name}</p>
                    <p className="mt-1 text-sm text-navy-500">{formatCurrency(item.price)}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-sm border border-navy-900/15 hover:bg-navy-50"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-sm border border-navy-900/15 hover:bg-navy-50"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="ml-auto text-navy-400 hover:text-red-600"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-navy-900/10 px-6 py-6">
            <div className="flex items-center justify-between text-base font-semibold text-navy-950">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-navy-500">
              Final pricing is confirmed by our team before any payment is collected.
            </p>
            <Button href="/contact?subject=order" variant="gold" className="mt-5 w-full">
              Request to Order
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
