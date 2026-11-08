import * as React from "react";
import { X } from "@keyline-icons/react";
import { cn } from "@/lib/utils";

function Dialog({ open, onOpenChange, children, labelledBy }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return undefined;
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onCancel={(event) => { event.preventDefault(); onOpenChange?.(false); }}
      onClick={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.target === event.currentTarget && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) onOpenChange?.(false);
      }}
      className="hidden open:flex fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-4xl max-h-[90vh] flex-col p-0 bg-white text-slate-900 border border-slate-200/90 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden backdrop:bg-black/60"
    >
      {children}
    </dialog>
  );
}

function DialogClose({ onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full min-w-11 min-h-11 p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900 cursor-pointer",
        className
      )}
      aria-label="Close"
    >
      <X className="w-5 h-5" />
    </button>
  );
}

export { Dialog, DialogClose };
