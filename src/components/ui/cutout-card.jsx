"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// ============================================================================
// Internal controllable state hook
// ============================================================================

function useControllableState({ prop, defaultProp, onChange }) {
  const [uncontrolledProp, setUncontrolledProp] = useState(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledProp;

  const setValue = useCallback(
    (next) => {
      const setter = next;
      const nextValue = typeof setter === "function" ? setter(value) : next;
      if (!isControlled) {
        setUncontrolledProp(nextValue);
      }
      onChange?.(nextValue);
    },
    [isControlled, value, onChange]
  );

  return [value, setValue];
}

// ============================================================================
// Tokens & Styling Classes
// ============================================================================

export const cutoutCardSurfaceShadowClassName = cn(
  "border border-white/10",
  "shadow-[0_4px_24px_rgba(0,0,0,0.6)]",
  "transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
  "hover:border-cyan-500/40 hover:shadow-[0_0_35px_rgba(6,182,212,0.2)]"
);

export const cutoutCardSurfaceClassName = cn(
  "group/cutout bg-[#0b0c16] text-slate-100 relative cursor-pointer overflow-hidden rounded-[28px] border border-white/10",
  cutoutCardSurfaceShadowClassName
);

/** Staggered text/footer entrance inside `CutoutCardContent` */
export function useCutoutContentStaggerVariants() {
  const reduceMotion = useReducedMotion();

  return useMemo(() => {
    if (reduceMotion) {
      return {
        container: {
          hidden: {},
          show: {
            transition: { staggerChildren: 0.03, delayChildren: 0 },
          },
        },
        item: {
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
          },
        },
      };
    }

    return {
      container: {
        hidden: {},
        show: {
          transition: { staggerChildren: 0.055, delayChildren: 0.06 },
        },
      },
      item: {
        hidden: { opacity: 0, y: 12, filter: "blur(5px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { type: "spring", duration: 0.48, bounce: 0.14 },
        },
      },
    };
  }, [reduceMotion]);
}

const CORNER_PATH = "M0 200C155.996 199.961 200.029 156.308 200 0V200H0Z";

// ============================================================================
// Context
// ============================================================================

const CutoutCardContext = createContext(null);

export function useCutoutCard() {
  const ctx = useContext(CutoutCardContext);
  if (!ctx) {
    throw new Error("useCutoutCard must be used within <CutoutCard>");
  }
  return ctx;
}

export function useOptionalCutoutCard() {
  return useContext(CutoutCardContext);
}

// ============================================================================
// Root Component
// ============================================================================

export function CutoutCard({
  className,
  hovered: hoveredProp,
  defaultHovered = false,
  onHoveredChange,
  trackPointerHover = true,
  onMouseEnter,
  onMouseLeave,
  children,
  ...props
}) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useControllableState({
    prop: hoveredProp,
    defaultProp: defaultHovered,
    onChange: onHoveredChange,
  });

  const setHoveredStable = useCallback(
    (next) => {
      setHovered(next);
    },
    [setHovered]
  );

  const ctx = useMemo(
    () => ({
      hovered: hovered ?? false,
      setHovered: setHoveredStable,
    }),
    [hovered, setHoveredStable]
  );

  const handleMouseEnter = (e) => {
    onMouseEnter?.(e);
    if (e.defaultPrevented || !trackPointerHover) {
      return;
    }
    setHoveredStable(true);
  };

  const handleMouseLeave = (e) => {
    onMouseLeave?.(e);
    if (e.defaultPrevented || !trackPointerHover) {
      return;
    }
    setHoveredStable(false);
  };

  return (
    <CutoutCardContext.Provider value={ctx}>
      <motion.div
        animate={{ opacity: 1 }}
        className={cn(className)}
        data-slot="cutout-card"
        data-state={ctx.hovered ? "hovered" : "idle"}
        initial={{ opacity: 0 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        transition={
          reduceMotion
            ? { duration: 0.22, ease: [0.23, 1, 0.32, 1] }
            : { duration: 0.36, ease: [0.23, 1, 0.32, 1] }
        }
        {...props}
      >
        {children}
      </motion.div>
    </CutoutCardContext.Provider>
  );
}

// ============================================================================
// Layout primitives
// ============================================================================

export function CutoutCardMedia({ className, ...props }) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      data-slot="cutout-card-media"
      {...props}
    />
  );
}

export function CutoutCardImage({
  className,
  alt = "",
  src,
  loading = "lazy",
  ...props
}) {
  return (
    <img
      alt={alt}
      src={src}
      loading={loading}
      className={cn(
        "object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/cutout:scale-105 h-full w-full",
        className
      )}
      data-slot="cutout-card-image"
      {...props}
    />
  );
}

export function CutoutCardOverlay({ className, ...props }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0c16]/80 via-transparent to-transparent",
        className
      )}
      data-slot="cutout-card-overlay"
      {...props}
    />
  );
}

export function CutoutCardContent({ className, ...props }) {
  return (
    <div
      className={cn("p-6", className)}
      data-slot="cutout-card-content"
      {...props}
    />
  );
}

export function CutoutCardFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center justify-between", className)}
      data-slot="cutout-card-footer"
      {...props}
    />
  );
}

// ============================================================================
// Cutout Geometry
// ============================================================================

export function CutoutCorner({
  className,
  size = 32,
  viewBox = "0 0 200 200",
  ...props
}) {
  return (
    <svg
      aria-hidden="true"
      className={cn(className)}
      data-slot="cutout-corner"
      height={size}
      viewBox={viewBox}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d={CORNER_PATH} fill="currentColor" />
    </svg>
  );
}

export function CutoutCardInsetLabel({ className, ...props }) {
  return (
    <div
      className={cn("absolute", className)}
      data-slot="cutout-card-inset-label"
      {...props}
    />
  );
}

export function CutoutCardPin({ className, ...props }) {
  return (
    <div
      className={cn("absolute", className)}
      data-slot="cutout-card-pin"
      {...props}
    />
  );
}

// ============================================================================
// Context-sensitive action region (slides up & fades in on hover)
// ============================================================================

export function CutoutCardAction({
  className,
  revealOnHover = true,
  ...props
}) {
  const { hovered } = useCutoutCard();
  const reduceMotion = useReducedMotion();
  const visible = !revealOnHover || hovered;

  return (
    <motion.div
      animate={
        visible
          ? { opacity: 1, transform: "translateY(0px)" }
          : { opacity: 0, transform: "translateY(8px)" }
      }
      className={cn(
        "absolute",
        revealOnHover && !visible && "pointer-events-none",
        className
      )}
      data-reveal={revealOnHover ? "hover" : "always"}
      data-slot="cutout-card-action"
      transition={
        reduceMotion
          ? { duration: 0.15, ease: [0.23, 1, 0.32, 1] }
          : { duration: 0.24, ease: [0.23, 1, 0.32, 1] }
      }
      {...props}
    />
  );
}
