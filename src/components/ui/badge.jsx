import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)]",
    secondary: "border-purple-500/30 bg-purple-500/10 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.15)]",
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.15)]",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)]",
    outline: "border-white/10 bg-white/[0.02] text-slate-300",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium transition-colors tracking-wide",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  );
}

export { Badge };
