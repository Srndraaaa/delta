import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

function Dialog({ open, onOpenChange, children }) {
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        onOpenChange?.(false);
      }
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => onOpenChange?.(false)}
      />

      {/* Modal Dialog Content */}
      <div className="relative z-50 w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-950/95 border border-cyan-500/20 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function DialogClose({ onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500",
        className
      )}
      aria-label="Close"
    >
      <X className="w-5 h-5" />
    </button>
  );
}

export { Dialog, DialogClose };
