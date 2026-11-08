"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded bg-bg-highlight",
        className
      )}
    />
  );
}

export function EditorSkeleton() {
  return (
    <div className="h-dvh flex overflow-hidden bg-bg-primary">
      {/* Main content skeleton */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Navbar skeleton */}
        <div className="h-14 bg-bg-navbar flex items-center px-4 gap-4">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-6" />
          <div className="flex-1" />
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-6" />
        </div>

        {/* Document tabs skeleton */}
        <div className="h-11 border-b border-border-light bg-bg-navbar px-4 flex items-center gap-2">
          <Skeleton className="h-7 w-36" />
        </div>

        {/* Document title skeleton */}
        <div className="h-14 bg-bg-primary flex items-center px-4 border-b border-border-light">
          <Skeleton className="h-6 w-48" />
        </div>

        {/* Editor/preview area */}
        <div className="flex-1 flex">
          {/* Editor pane */}
          <div className="w-1/2 border-r border-border-light p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {/* Preview pane */}
          <div className="w-1/2 p-4 space-y-3">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </main>
    </div>
  );
}
