import React from "react";

export default function CirclesIcon({ className, strokeWidth = 2 }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="9" r="5" />
      <circle cx="15" cy="15" r="5" />
    </svg>
  );
}