"use client";

interface ScoreBadgeProps {
  score: number; // 0-1 float from API
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

/**
 * Circular score indicator with color interpolation.
 * 0-40% = red, 40-70% = amber, 70-100% = green
 */
export function ScoreBadge({ score, size = "md", showLabel = true }: ScoreBadgeProps) {
  const percentage = Math.round(score * 100);

  // Color interpolation
  const getColor = (pct: number) => {
    if (pct >= 70) return { ring: "stroke-emerald-500", text: "text-emerald-500", bg: "bg-emerald-500/10" };
    if (pct >= 40) return { ring: "stroke-amber-500", text: "text-amber-500", bg: "bg-amber-500/10" };
    return { ring: "stroke-red-500", text: "text-red-500", bg: "bg-red-500/10" };
  };

  const colors = getColor(percentage);

  // SVG dimensions by size
  const dimensions = {
    sm: { size: 40, stroke: 3, fontSize: "text-xs", radius: 16 },
    md: { size: 56, stroke: 4, fontSize: "text-sm", radius: 22 },
    lg: { size: 72, stroke: 5, fontSize: "text-base", radius: 28 },
  };

  const d = dimensions[size];
  const circumference = 2 * Math.PI * d.radius;
  const dashOffset = circumference - (percentage / 100) * circumference;
  const center = d.size / 2;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`relative inline-flex items-center justify-center rounded-full ${colors.bg}`}>
        <svg width={d.size} height={d.size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={center}
            cy={center}
            r={d.radius}
            fill="none"
            strokeWidth={d.stroke}
            className="stroke-muted/30"
          />
          {/* Score ring */}
          <circle
            cx={center}
            cy={center}
            r={d.radius}
            fill="none"
            strokeWidth={d.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className={`${colors.ring} transition-all duration-700 ease-out`}
          />
        </svg>
        <span className={`absolute ${d.fontSize} font-bold ${colors.text}`}>
          {percentage}
        </span>
      </div>
      {showLabel && (
        <span className={`${d.fontSize} font-medium ${colors.text}`}>
          {percentage >= 70 ? "Strong" : percentage >= 40 ? "Fair" : "Low"}
        </span>
      )}
    </div>
  );
}
