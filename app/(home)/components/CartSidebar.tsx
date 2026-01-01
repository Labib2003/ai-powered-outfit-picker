"use client";

import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
}: CartSidebarProps) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-screen w-full sm:w-96 bg-background border-l border-border z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p>
            Cart functionality is still cooking 🍳! Meanwhile, feel free to try
            out our AI agent feature 🤖✨.
          </p>

          {/* Cart Items */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {cartItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Your cart is empty
              </p>
            ) : (
              cartItems.map((item) => (
                <Card key={item.id} className="p-4 flex gap-4">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                    <p className="font-bold text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button className="p-2 hover:bg-muted rounded-lg transition">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </Card>
              ))
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Summary */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-semibold">$10.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-semibold">${(total * 0.1).toFixed(2)}</span>
            </div>

            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold text-lg text-primary">
                ${(total + 10 + total * 0.1).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold py-6">
              Checkout
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={onClose}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
