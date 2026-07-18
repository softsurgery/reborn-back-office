"use client";

import React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface CarouselImageItem {
  url?: string | null;
  id?: string | number;
  alt?: string;
}

export interface ImageCarouselProps {
  images: (CarouselImageItem | string)[];
  className?: string;
  containerClassName?: string;
  heightClassName?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
  showThumbnails?: boolean;
  isLoading?: boolean;
  onImageSelect?: (index: number, image: CarouselImageItem) => void;
  defaultIndex?: number;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  className,
  containerClassName,
  heightClassName = "h-[320px] md:h-[480px]",
  emptyTitle = "No photos attached",
  emptyDescription = "No images available for this item.",
  emptyIcon,
  showThumbnails = true,
  isLoading = false,
  onImageSelect,
  defaultIndex = 0,
}) => {
  const validImages = React.useMemo(() => {
    return (images || [])
      .map((item, idx) => {
        if (typeof item === "string") {
          return { url: item, id: idx, alt: `Image ${idx + 1}` };
        }
        return {
          url: item?.url || "",
          id: item?.id ?? idx,
          alt: item?.alt || `Image ${idx + 1}`,
        };
      })
      .filter((img) => Boolean(img.url));
  }, [images]);

  const [selectedIdx, setSelectedIdx] = React.useState<number>(defaultIndex);
  const [direction, setDirection] = React.useState<number>(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (selectedIdx >= validImages.length && validImages.length > 0) {
      setSelectedIdx(0);
    }
  }, [validImages.length, selectedIdx]);

  const handlePrev = React.useCallback(() => {
    if (validImages.length <= 1) return;
    setDirection(-1);
    const nextIdx = selectedIdx === 0 ? validImages.length - 1 : selectedIdx - 1;
    setSelectedIdx(nextIdx);
    if (validImages[nextIdx]) {
      onImageSelect?.(nextIdx, validImages[nextIdx]);
    }
  }, [selectedIdx, validImages, onImageSelect]);

  const handleNext = React.useCallback(() => {
    if (validImages.length <= 1) return;
    setDirection(1);
    const nextIdx = selectedIdx === validImages.length - 1 ? 0 : selectedIdx + 1;
    setSelectedIdx(nextIdx);
    if (validImages[nextIdx]) {
      onImageSelect?.(nextIdx, validImages[nextIdx]);
    }
  }, [selectedIdx, validImages, onImageSelect]);

  const handleSelect = React.useCallback(
    (idx: number) => {
      setDirection(idx > selectedIdx ? 1 : -1);
      setSelectedIdx(idx);
      if (validImages[idx]) {
        onImageSelect?.(idx, validImages[idx]);
      }
    },
    [selectedIdx, validImages, onImageSelect],
  );

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      const isHovered = containerRef.current.matches(":hover");
      const isFocused = containerRef.current.contains(document.activeElement);
      if (!isHovered && !isFocused) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  if (isLoading) {
    return (
      <div
        className={cn(
          "w-full rounded-3xl bg-card border border-border/80 shadow-lg flex items-center justify-center animate-pulse",
          heightClassName,
          className,
        )}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary/70" />
          <span className="text-xs font-semibold">Loading photos...</span>
        </div>
      </div>
    );
  }

  if (validImages.length === 0) {
    return (
      <div
        className={cn(
          "w-full rounded-3xl border border-dashed border-border/80 bg-card/50 flex flex-col items-center justify-center text-center p-6 text-muted-foreground",
          heightClassName || "h-[220px]",
          className,
        )}
      >
        {emptyIcon || <ImageIcon className="w-12 h-12 text-muted-foreground/40 mb-3" />}
        <span className="font-semibold text-sm text-foreground">
          {emptyTitle}
        </span>
        {emptyDescription && (
          <span className="text-xs text-muted-foreground/80 mt-1 max-w-sm">
            {emptyDescription}
          </span>
        )}
      </div>
    );
  }

  const currentImage = validImages[selectedIdx];

  return (
    <div ref={containerRef} tabIndex={0} className={cn("w-full space-y-4 focus:outline-none", className)}>
      <div
        className={cn(
          "relative w-full rounded-3xl overflow-hidden bg-card border border-border/80 shadow-2xl group",
          heightClassName,
          containerClassName,
        )}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          {currentImage && currentImage.url ? (
            <motion.div
              key={currentImage.id || selectedIdx}
              custom={direction}
              variants={{
                enter: (dir: number) => ({
                  x: dir > 0 ? "100%" : dir < 0 ? "-100%" : 0,
                  opacity: 0,
                  scale: 0.96,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                  scale: 1,
                  transition: {
                    x: { type: "spring", stiffness: 350, damping: 35 },
                    opacity: { duration: 0.25 },
                    scale: { duration: 0.25 },
                  },
                },
                exit: (dir: number) => ({
                  x: dir < 0 ? "100%" : dir > 0 ? "-100%" : 0,
                  opacity: 0,
                  scale: 0.96,
                  transition: {
                    x: { type: "spring", stiffness: 350, damping: 35 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 },
                  },
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              drag={validImages.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(e, { offset, velocity }) => {
                if (validImages.length <= 1) return;
                const swipe = Math.abs(offset.x) * velocity.x;
                if (offset.x < -40 || swipe < -400) {
                  handleNext();
                } else if (offset.x > 40 || swipe > 400) {
                  handlePrev();
                }
              }}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
            >
              <Image
                src={currentImage.url}
                alt={currentImage.alt || `Preview ${selectedIdx + 1}`}
                fill
                unoptimized
                className="object-contain md:object-cover bg-black/90 pointer-events-none select-none"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Slide Counter Overlay */}
        {validImages.length > 1 && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-bold backdrop-blur-md z-10 border border-white/10 shadow-sm pointer-events-none">
            {selectedIdx + 1} / {validImages.length}
          </div>
        )}

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <motion.button
              type="button"
              onClick={handlePrev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md opacity-80 hover:opacity-100 transition-all z-10 focus:outline-none focus:ring-2 focus:ring-primary shadow-lg"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <motion.button
              type="button"
              onClick={handleNext}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md opacity-80 hover:opacity-100 transition-all z-10 focus:outline-none focus:ring-2 focus:ring-primary shadow-lg"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </>
        )}
      </div>

      {/* Thumbnails Strip */}
      {showThumbnails && validImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {validImages.map((img, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <motion.button
                key={img.id || idx}
                type="button"
                onClick={() => handleSelect(idx)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0 transition-all duration-300 border-2 focus:outline-none",
                  isSelected
                    ? "border-primary ring-4 ring-primary/20 scale-105 shadow-lg"
                    : "border-transparent opacity-60 hover:opacity-100 bg-muted",
                )}
              >
                <Image
                  src={img.url || ""}
                  alt={img.alt || `Thumbnail ${idx + 1}`}
                  fill
                  unoptimized
                  className="object-cover pointer-events-none select-none"
                />
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
};
