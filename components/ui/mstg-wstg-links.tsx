"use client";

import { ExternalLink } from "lucide-react";
import { parseMSTGWSTG } from "@/utils/wstg-mapper";
import { cn } from "@/lib/utils";

interface MSTGWSTGLinksProps {
  mstgWstg: string;
  className?: string;
}

/**
 * Komponen untuk menampilkan MSTG/WSTG sebagai clickable links
 */
export default function MSTGWSTGLinks({ mstgWstg, className }: MSTGWSTGLinksProps) {
  if (!mstgWstg || !mstgWstg.trim()) {
    return <span className={cn("text-slate-500", className)}>-</span>;
  }

  const links = parseMSTGWSTG(mstgWstg);

  if (links.length === 0) {
    return <span className={cn("text-slate-600 dark:text-slate-400", className)}>{mstgWstg}</span>;
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
        >
          {link.id}
          <ExternalLink className="h-3 w-3" />
        </a>
      ))}
    </div>
  );
}

