import { useEffect, useState } from "react";

export function BarChartSkeleton() {
  const [heights, setHeights] = useState<number[]>([]);

  useEffect(() => {
    // Solo generar alturas aleatorias en el cliente
    setHeights(
      [1, 2, 3, 4, 5, 6, 7, 8].map(() => Math.floor(Math.random() * 150) + 20)
    );
  }, []);

  return (
    <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-blue-200 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-6 w-6 bg-gray-200 rounded-full"></div>
          ))}
        </div>
      </div>
      <div className="h-64 flex items-end justify-between space-x-2 px-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="w-full">
            <div
              className="bg-gray-200 rounded-t"
              style={{
                height: heights[i - 1] ? `${heights[i - 1]}px` : "50px",
              }}
            ></div>
            <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
