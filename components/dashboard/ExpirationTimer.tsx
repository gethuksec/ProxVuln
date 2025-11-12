"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle } from "lucide-react";
import { getTimeUntilExpiration, isExpired } from "@/utils/date-helpers";

interface ExpirationTimerProps {
  expiresAt: Date;
}

/**
 * Komponen untuk menampilkan countdown timer sampai data expired
 */
export default function ExpirationTimer({ expiresAt }: ExpirationTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilExpiration(expiresAt));
  const expired = isExpired(expiresAt);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilExpiration(expiresAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  if (expired) {
    return (
      <Card className="mb-6 border-red-500 bg-red-50 dark:bg-red-950">
        <CardContent className="py-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-red-600 font-medium">
              Data sudah kedaluwarsa dan akan dihapus
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 border-blue-200 dark:border-blue-800">
      <CardContent className="py-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Data akan dihapus: <strong>{timeLeft}</strong>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

