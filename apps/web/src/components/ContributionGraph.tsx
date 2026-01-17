"use client";

import { useMemo, useState, useEffect } from "react";

interface ActivityDay {
  date: string;
  attempts: number;
  correct: number;
  total: number;
  accuracy: number;
}

interface ContributionGraphProps {
  activity: ActivityDay[];
  className?: string;
}

interface TooltipData {
  x: number;
  y: number;
  date: string;
  dayOfMonth: number;
  month: string;
  year: number;
  activity: ActivityDay | null;
}

export function ContributionGraph({ activity, className = "" }: ContributionGraphProps) {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Create a map of date to activity for quick lookup
  const activityMap = useMemo(() => {
    const map = new Map<string, ActivityDay>();
    activity.forEach((day) => {
      map.set(day.date, day);
    });
    return map;
  }, [activity]);

  // Generate days for last 3 months
  const { months, totalWeeks } = useMemo(() => {
    const today = new Date();
    const result: {
      month: string;
      year: number;
      weeks: { date: string; dayOfMonth: number; dayOfWeek: number }[][];
    }[] = [];

    // Go back 2 months from current month (to get 3 months total)
    for (let m = 2; m >= 0; m--) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() - m, 1);
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth();
      const monthName = targetDate.toLocaleDateString("en-US", { month: "short" });
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const days: { date: string; dayOfMonth: number; dayOfWeek: number; week: number }[] = [];

      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        // Don't include future dates
        if (date > today) break;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const weekOfMonth = Math.floor((d - 1 + firstDayOfMonth) / 7);

        days.push({
          date: date.toISOString().split("T")[0],
          dayOfMonth: d,
          dayOfWeek: date.getDay(),
          week: weekOfMonth,
        });
      }

      // Group by week
      const weekMap = new Map<number, typeof days>();
      days.forEach((day) => {
        if (!weekMap.has(day.week)) {
          weekMap.set(day.week, []);
        }
        weekMap.get(day.week)!.push(day);
      });
      const weeks = Array.from(weekMap.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([_, days]) => days);

      result.push({ month: monthName, year, weeks });
    }

    const totalWeeks = result.reduce((sum, m) => sum + m.weeks.length, 0);
    return { months: result, totalWeeks };
  }, []);

  // Animate on mount
  useEffect(() => {
    if (hasAnimated) return;

    const duration = 600;
    const interval = duration / totalWeeks;

    let week = 0;
    const timer = setInterval(() => {
      week++;
      setAnimationProgress(week);
      if (week >= totalWeeks) {
        clearInterval(timer);
        setHasAnimated(true);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [hasAnimated, totalWeeks]);

  // Get color based on accuracy - using primary blue (#dk)
  const getColor = (date: string) => {
    const dayActivity = activityMap.get(date);
    if (!dayActivity || dayActivity.attempts === 0) {
      return "bg-gray-100";
    }

    const accuracy = dayActivity.accuracy;
    if (accuracy >= 80) return "bg-primary-500";
    if (accuracy >= 60) return "bg-primary-400";
    if (accuracy >= 40) return "bg-primary-300";
    if (accuracy >= 20) return "bg-primary-200";
    return "bg-primary-100";
  };

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Track cumulative week index for animation
  let cumulativeWeekIndex = 0;

  return (
    <div className={`relative ${className}`}>
      {/* Month labels row */}
      <div className="flex mb-1">
        <div className="w-7 flex-shrink-0" /> {/* Spacer for day labels */}
        <div className="flex">
          {months.map((monthData) => (
            <div
              key={`label-${monthData.month}-${monthData.year}`}
              className="text-[10px] font-medium text-gray-500"
              style={{ width: `${monthData.weeks.length * 14 + (monthData.weeks.length - 1) * 3}px` }}
            >
              {monthData.month} {monthData.year}
            </div>
          ))}
        </div>
      </div>

      {/* Graph row */}
      <div className="flex">
        {/* Day labels column */}
        <div className="flex flex-col gap-[3px] text-[10px] text-gray-400 w-7 flex-shrink-0 pr-1">
          <span className="h-[14px] leading-[14px]">Sun</span>
          <span className="h-[14px] leading-[14px]">Mon</span>
          <span className="h-[14px] leading-[14px]">Tue</span>
          <span className="h-[14px] leading-[14px]">Wed</span>
          <span className="h-[14px] leading-[14px]">Thu</span>
          <span className="h-[14px] leading-[14px]">Fri</span>
          <span className="h-[14px] leading-[14px]">Sat</span>
        </div>

        {/* All weeks in a single row */}
        <div className="flex gap-[3px]">
          {months.map((monthData) => {
            const startWeekIndex = cumulativeWeekIndex;
            cumulativeWeekIndex += monthData.weeks.length;

            return monthData.weeks.map((weekDays, weekIndex) => {
              const globalWeekIndex = startWeekIndex + weekIndex;
              const shouldShow = hasAnimated || globalWeekIndex < animationProgress;

              return (
                <div
                  key={`${monthData.month}-${monthData.year}-week-${weekIndex}`}
                  className="flex flex-col gap-[3px]"
                  style={{
                    opacity: shouldShow ? 1 : 0,
                    transform: shouldShow ? "scale(1)" : "scale(0.8)",
                    transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
                  }}
                >
                  {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => {
                    const day = weekDays.find((d) => d.dayOfWeek === dayOfWeek);
                    if (!day) {
                      return <div key={dayOfWeek} className="w-[14px] h-[14px]" />;
                    }
                    const isToday = day.date === todayStr;
                    const dayActivity = activityMap.get(day.date);

                    return (
                      <div
                        key={dayOfWeek}
                        className={`w-[14px] h-[14px] rounded-[3px] ${getColor(day.date)} cursor-pointer hover:ring-1 hover:ring-gray-400 transition-all ${isToday ? "ring-2 ring-primary-500" : ""}`}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const containerRect = e.currentTarget.closest('.relative')?.getBoundingClientRect();
                          if (containerRect) {
                            setTooltip({
                              x: rect.left - containerRect.left + rect.width / 2,
                              y: rect.top - containerRect.top,
                              date: day.date,
                              dayOfMonth: day.dayOfMonth,
                              month: monthData.month,
                              year: monthData.year,
                              activity: dayActivity || null,
                            });
                          }
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })}
                </div>
              );
            });
          }).flat()}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 text-[10px] text-gray-400">
        <span>Less</span>
        <div className="w-[10px] h-[10px] rounded-[2px] bg-gray-100" />
        <div className="w-[10px] h-[10px] rounded-[2px] bg-primary-100" />
        <div className="w-[10px] h-[10px] rounded-[2px] bg-primary-200" />
        <div className="w-[10px] h-[10px] rounded-[2px] bg-primary-300" />
        <div className="w-[10px] h-[10px] rounded-[2px] bg-primary-400" />
        <div className="w-[10px] h-[10px] rounded-[2px] bg-primary-500" />
        <span>More</span>
      </div>

      {/* GitHub-style Tooltip */}
      {tooltip && (
        <div
          className="absolute z-10 pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - 8,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap">
            {tooltip.activity && tooltip.activity.attempts > 0 ? (
              <>
                <span className="font-medium">{tooltip.activity.correct}/{tooltip.activity.total}</span>
                <span className="text-gray-400"> correct on </span>
                <span className="font-medium">{tooltip.month} {tooltip.dayOfMonth}, {tooltip.year}</span>
              </>
            ) : (
              <>
                <span className="text-gray-400">No activity on </span>
                <span className="font-medium">{tooltip.month} {tooltip.dayOfMonth}, {tooltip.year}</span>
              </>
            )}
          </div>
          {/* Arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full">
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900" />
          </div>
        </div>
      )}
    </div>
  );
}
