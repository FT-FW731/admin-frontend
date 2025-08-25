import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  count?: number;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  showEdit?: boolean;
  compact?: boolean;
  ariaLabel?: string;
};

const sizeMap = {
  sm: {
    title: "h-3 w-20",
    icon: "h-3 w-3",
    edit: "h-6 w-6",
    value: "h-6 w-16 text-lg",
    valueBlock: "h-6 w-16",
  },
  md: {
    title: "h-4 w-24",
    icon: "h-4 w-4",
    edit: "h-8 w-8",
    value: "h-8 w-20 text-2xl",
    valueBlock: "h-8 w-20",
  },
  lg: {
    title: "h-5 w-28",
    icon: "h-5 w-5",
    edit: "h-10 w-10",
    value: "h-10 w-24 text-3xl",
    valueBlock: "h-10 w-24",
  },
};

const CardSkeleton: React.FC<Props> = ({
  count = 4,
  size = "md",
  showIcon = true,
  showEdit = true,
  compact = true,
  ariaLabel = "loading card",
}) => {
  const s = sizeMap[size] ?? sizeMap.md;

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <Card
          key={idx}
          className="shadow-card border-0 bg-card/50 backdrop-blur"
          role="status"
          aria-live="polite"
          aria-label={ariaLabel}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              <div
                className={`bg-gray-300 dark:bg-gray-700 rounded ${s.title} animate-pulse`}
              />
            </CardTitle>

            <div className="flex items-center gap-2">
              {showIcon && (
                <div
                  className={`bg-gray-300 dark:bg-gray-700 rounded ${s.icon} animate-pulse`}
                />
              )}
              {showEdit && (
                <div
                  className={`bg-gray-300 dark:bg-gray-700 rounded-full ${s.edit} animate-pulse`}
                />
              )}
            </div>
          </CardHeader>

          <CardContent>
            <div
              className={`flex ${
                compact ? "flex-col gap-2" : "items-center justify-between"
              } w-full`}
            >
              <div
                className={`font-bold text-card-foreground ${
                  compact ? "" : s.value
                }`}
              >
                <div
                  className={`bg-gray-300 dark:bg-gray-700 rounded ${s.valueBlock} animate-pulse`}
                />
              </div>

              {/* optional secondary lines to mimic additional info */}
              {!compact && (
                <div className="flex flex-col items-end space-y-2">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded h-3 w-20 animate-pulse" />
                  <div className="bg-gray-200 dark:bg-gray-700 rounded h-2 w-14 animate-pulse" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default CardSkeleton;
