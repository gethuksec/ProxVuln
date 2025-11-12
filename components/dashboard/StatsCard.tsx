import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
}

/**
 * Komponen card untuk menampilkan statistik
 */
export default function StatsCard({ title, value, description }: StatsCardProps) {
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
          {value}
        </div>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

