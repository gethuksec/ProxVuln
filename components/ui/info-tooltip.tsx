"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  content: string;
  title?: string;
  className?: string;
}

/**
 * Komponen tooltip untuk menampilkan informasi tambahan
 */
export default function InfoTooltip({ content, title, className }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center"
      >
        <Info className={cn("h-4 w-4 text-slate-400 hover:text-slate-600", className)} />
      </button>
      {isOpen && (
        <div className="absolute z-50 w-64 p-3 mt-2 text-xs text-left bg-slate-900 text-slate-100 rounded-lg shadow-lg left-0 top-full">
          {title && (
            <h4 className="font-semibold mb-1 text-white">{title}</h4>
          )}
          <p className="text-slate-300 whitespace-pre-line">{content}</p>
          <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-900 rotate-45" />
        </div>
      )}
    </div>
  );
}

