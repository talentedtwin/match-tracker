"use client";

import { useEffect, useState } from "react";

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  avgRenderTime: number;
  memoryUsage?: number;
}

interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export function usePerformanceMonitor(componentName: string) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    avgRenderTime: 0,
  });

  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      setMetrics((prev) => {
        const newRenderCount = prev.renderCount + 1;
        const newAvgRenderTime =
          (prev.avgRenderTime * prev.renderCount + renderTime) / newRenderCount;

        return {
          renderCount: newRenderCount,
          lastRenderTime: renderTime,
          avgRenderTime: newAvgRenderTime,
          memoryUsage: (performance as { memory?: { usedJSHeapSize: number } })
            .memory?.usedJSHeapSize,
        };
      });

      // Log performance in development
      if (process.env.NODE_ENV === "development") {
        console.log(
          `🔍 ${componentName} render time: ${renderTime.toFixed(2)}ms`
        );
      }
    };
  });

  return metrics;
}

interface PerformanceDebugProps {
  show?: boolean;
}

export function PerformanceDebug({ show = false }: PerformanceDebugProps) {
  const [fps, setFps] = useState(0);
  const [memoryInfo, setMemoryInfo] = useState<PerformanceMemory | null>(null);

  useEffect(() => {
    if (!show) return;

    let frameCount = 0;
    let lastTime = performance.now();

    function updateFPS() {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;

        // Update memory info if available
        const perfWithMemory = performance as Performance & {
          memory?: PerformanceMemory;
        };
        if (perfWithMemory.memory) {
          setMemoryInfo(perfWithMemory.memory);
        }
      }

      requestAnimationFrame(updateFPS);
    }

    const id = requestAnimationFrame(updateFPS);
    return () => cancelAnimationFrame(id);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-2 rounded text-xs font-mono z-50">
      <div>FPS: {fps}</div>
      {memoryInfo && (
        <div>
          Memory: {Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024)}MB
        </div>
      )}
    </div>
  );
}
