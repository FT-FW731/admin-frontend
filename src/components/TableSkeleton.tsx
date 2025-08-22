import React from "react";

const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 10,
  columns = 4,
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <tr key={idx}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <td key={colIdx} className="px-6 py-4">
              <div
                className={`h-4 bg-gray-300 rounded animate-pulse ${
                  colIdx === 0
                    ? "w-3/4"
                    : colIdx === 1
                    ? "w-1/2"
                    : colIdx === 2
                    ? "w-1/3"
                    : "w-1/4"
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;
