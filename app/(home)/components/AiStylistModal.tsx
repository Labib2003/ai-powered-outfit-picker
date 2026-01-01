"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SparklesIcon, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { trpc } from "@/app/_trpc/client";
import ProductCard from "./ProductCard";
import type { Product } from "@/db/schema/product";

const LOADING_MESSAGES = [
  "Thinking about your request…",
  "Understanding your style…",
  "Checking the catalog…",
  "Matching the right products…",
  "Almost there…",
];

const EXAMPLE_PROMPTS = [
  "Elegant watch for a wedding",
  "Casual weekend outfit",
  "Professional work attire",
];

function AiSpeechBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="bg-linear-to-br from-primary/10 to-accent/10 backdrop-blur-sm border border-primary/20 rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex items-start gap-2">
          <SparklesIcon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/80 leading-relaxed">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}

const AiStylistModal = () => {
  const [prompt, setPrompt] = useState("");
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const stylistMutation = trpc.search.semanticProductSearch.useMutation();

  useEffect(() => {
    if (!stylistMutation.isPending) return;

    const interval = setInterval(() => {
      setLoadingMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [stylistMutation.isPending]);

  const handleSearch = () => {
    if (!prompt.trim()) return;

    stylistMutation.mutate({ prompt });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="group relative px-8 py-4 bg-linear-to-r from-primary to-primary/90 text-primary-foreground rounded-full font-semibold text-base flex items-center gap-3 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-bounce my-5">
          <SparklesIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>Consult our AI Stylist</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl! max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            AI Stylist
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          {!stylistMutation.data && !stylistMutation.isPending && (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-2 mb-8">
                <h3 className="text-xl font-semibold text-foreground">
                  Welcome! How can I help you today?
                </h3>
                <p className="text-muted-foreground">
                  Describe what you're looking for, and I'll find the perfect
                  products for you
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="e.g., Suggest a watch for a wedding"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="h-12 text-base px-4 border-2 focus-visible:ring-2 focus-visible:ring-primary/20"
                />
                <Button
                  onClick={handleSearch}
                  className="w-full h-12 text-base gap-2 bg-linear-to-r from-primary to-primary/90 hover:shadow-md transition-all"
                  disabled={!prompt.trim()}
                >
                  <SparklesIcon className="w-5 h-5" />
                  Get Recommendations
                </Button>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  Or try one of these:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {EXAMPLE_PROMPTS.map((example) => (
                    <button
                      key={example}
                      onClick={() => setPrompt(example)}
                      className="px-4 py-2 bg-secondary hover:bg-accent text-secondary-foreground text-sm rounded-full transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {stylistMutation.isPending && (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="relative">
                <Loader2Icon className="w-12 h-12 text-primary animate-spin opacity-30" />
                <SparklesIcon className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <p className="text-base text-muted-foreground animate-pulse font-medium">
                {LOADING_MESSAGES[loadingMessageIndex]}
              </p>
            </div>
          )}

          {stylistMutation.data && (
            <div className="space-y-12 py-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl text-balance leading-tight">
                  {stylistMutation.data.message}
                </h2>
              </div>

              {stylistMutation.data.results.map((group) => (
                <div key={group.category.id} className="space-y-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">
                      {group.category.name}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
                      {group.category.reason}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.products.map(({ reason, ...product }) => (
                      <div
                        key={product.id}
                        className="space-y-1 flex flex-col gap-3"
                      >
                        <div className="grow flex items-end">
                          <AiSpeechBubble>{reason}</AiSpeechBubble>
                        </div>
                        <ProductCard product={product as unknown as Product} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-center pt-8">
                <Button
                  onClick={() => {
                    stylistMutation.reset();
                    setPrompt("");
                  }}
                  variant="outline"
                  className="gap-2 h-11 px-6 border-2 hover:bg-accent hover:border-primary/30 transition-all"
                >
                  <SparklesIcon className="w-4 h-4" />
                  Start New Search
                </Button>
              </div>
            </div>
          )}

          {/* EMPTY RESULT */}
          {stylistMutation.data &&
            stylistMutation.data.results.length === 0 && (
              <div className="text-center py-16 space-y-4">
                <p className="text-base text-muted-foreground">
                  I couldn't find anything that fits well. Try rephrasing your
                  request.
                </p>
                <Button
                  onClick={() => {
                    stylistMutation.reset();
                    setPrompt("");
                  }}
                  variant="outline"
                  className="gap-2"
                >
                  Try Again
                </Button>
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AiStylistModal;
