"use client";

import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  theme?: "light" | "dark";
  useImage?: boolean;
}

export function Logo({
  size = "md",
  showText = true,
  className = "",
  theme = "light",
  useImage = true,
}: LogoProps) {
  const sizeMap = {
    sm: { box: "w-7 h-7", iconSize: 18, text: "text-base", badge: "text-[9px] px-1.5 py-0.5" },
    md: { box: "w-9 h-9", iconSize: 22, text: "text-lg", badge: "text-[10px] px-2 py-0.5" },
    lg: { box: "w-11 h-11", iconSize: 28, text: "text-xl", badge: "text-xs px-2.5 py-0.5" },
    xl: { box: "w-14 h-14", iconSize: 36, text: "text-2xl", badge: "text-xs px-3 py-1" },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Designed Logo Icon Box */}
      <div
        className={`${current.box} rounded-xl bg-slate-950 border border-slate-800 shadow-sm flex items-center justify-center shrink-0 overflow-hidden relative group-hover:scale-105 transition-transform duration-200`}
      >
        {useImage ? (
          <img
            src="/logo.png"
            alt="Syncora Brand Logo"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
              style={{ width: `${current.iconSize}px`, height: `${current.iconSize}px` }}
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="currentColor" fillOpacity="0.2" />
            </svg>
          </div>
        )}
      </div>

      {/* Unique Brand Wordmark */}
      {showText && (
        <div className="flex items-center gap-1.5 font-bold tracking-tight leading-none">
          <span className={theme === "light" ? "text-slate-900" : "text-white"}>
            Syncora
          </span>
          <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-200/80 px-1.5 py-0.5 rounded-md">
            COMMERCE
          </span>
        </div>
      )}
    </div>
  );
}
