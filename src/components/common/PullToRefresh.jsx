import { useState, useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";

const THRESHOLD = 60;
const MAX_PULL = 100;

/**
 * Window-based pull-to-refresh wrapper.
 * Detects pull-down at the top of the page (scrollY <= 0),
 * shows a spinning indicator, and calls onRefresh on release.
 */
export default function PullToRefresh({ onRefresh, children }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);
  const pullRef = useRef(0);

  const handleTouchStart = useCallback(
    (e) => {
      if (window.scrollY <= 0 && !refreshing) {
        startY.current = e.touches[0].clientY;
        pulling.current = true;
      }
    },
    [refreshing]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!pulling.current || refreshing) return;
      const diff = e.touches[0].clientY - startY.current;
      if (diff > 0 && window.scrollY <= 0) {
        const distance = Math.min(diff * 0.5, MAX_PULL);
        pullRef.current = distance;
        setPullDistance(distance);
      } else if (diff <= 0) {
        pullRef.current = 0;
        setPullDistance(0);
      }
    },
    [refreshing]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current) return;
    pulling.current = false;
    if (pullRef.current >= THRESHOLD) {
      setRefreshing(true);
      setPullDistance(THRESHOLD);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        setPullDistance(0);
        pullRef.current = 0;
      }
    } else {
      setPullDistance(0);
      pullRef.current = 0;
    }
  }, [onRefresh]);

  const progress = Math.min(pullDistance / THRESHOLD, 1);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{
          height: pullDistance,
          transition: "height 0.15s ease-out",
        }}
      >
        <Loader2
          className={`w-5 h-5 text-muted-foreground ${refreshing ? "animate-spin" : ""}`}
          style={{
            transform: refreshing ? undefined : `rotate(${pullDistance * 4}deg)`,
            opacity: progress,
          }}
        />
      </div>
      {children}
    </div>
  );
}