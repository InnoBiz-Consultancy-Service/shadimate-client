"use client";

import React from "react";

interface HeartProps {
  size: number;
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  opacity: number;
  animation: string;
  color: string;
  outlined?: boolean;
  blur?: boolean;
}

const Heart = ({
  size,
  top,
  left,
  bottom,
  right,
  opacity,
  animation,
  color,
  outlined,
  blur,
}: HeartProps) => (
  <svg
    viewBox="0 0 100 90"
    aria-hidden
    className="pointer-events-none absolute"
    style={{
      width: size,
      height: size,
      top,
      left,
      bottom,
      right,
      opacity,
      animation: `${animation} infinite`,
      fill: outlined ? "none" : color,
      stroke: outlined ? color : "none",
      strokeWidth: outlined ? 4 : 0,
      filter: blur ? "blur(4px)" : "none",
    }}
  >
    <path d="M50 85 C30 68 5 55 5 33 C5 14 20 5 35 5 C43 5 50 11 50 11 C50 11 57 5 65 5 C80 5 95 14 95 33 C95 55 70 68 50 85Z" />
  </svg>
);

export default function FloatingHearts() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large rose heart – top-left anchor */}
      <Heart
        size={208}
        top="-24px"
        left="-40px"
        opacity={0.07}
        animation="floatSlow 9s ease-in-out"
        color="#E8547A"
        blur
      />

      {/* Bokeh blurred heart – mid-right */}
      <Heart
        size={180}
        top="20%"
        right="-50px"
        opacity={0.04}
        animation="floatSlow 15s ease-in-out 2s"
        color="#F0C070"
        blur
      />

      {/* Medium champagne heart – top-right */}
      <Heart
        size={80}
        top="8%"
        right="12%"
        opacity={0.13}
        animation="float 7s ease-in-out 1s"
        color="#F0C070"
      />

      {/* Small outlined rose heart – mid-left */}
      <Heart
        size={48}
        top="38%"
        left="3%"
        opacity={0.18}
        animation="floatSimple 6s ease-in-out 0.5s"
        color="#E8547A"
        outlined
      />

      {/* Tiny solid champagne heart – bottom-left */}
      <Heart
        size={32}
        bottom="18%"
        left="8%"
        opacity={0.22}
        animation="float 8s ease-in-out 2s"
        color="#F0C070"
      />

      {/* Medium outlined champagne heart – bottom-right */}
      <Heart
        size={112}
        bottom="6%"
        right="6%"
        opacity={0.1}
        animation="floatSlow 11s ease-in-out 3s"
        color="#F0C070"
        outlined
      />

      {/* Tiny solid rose heart – top-centre */}
      <Heart
        size={24}
        top="12%"
        left="48%"
        opacity={0.25}
        animation="floatSimple 5s ease-in-out 1.5s"
        color="#E8547A"
      />

      {/* Small solid blush heart – right-centre */}
      <Heart
        size={40}
        top="55%"
        right="2%"
        opacity={0.15}
        animation="float 10s ease-in-out 4s"
        color="#F0A0B0"
      />

      {/* Medium blurred bokeh heart – lower-left */}
      <Heart
        size={120}
        bottom="10%"
        left="-30px"
        opacity={0.05}
        animation="floatSlow 12s ease-in-out 1s"
        color="#E8547A"
        blur
      />

      {/* Large faint outlined rose heart – bottom-centre */}
      <Heart
        size={144}
        bottom="-4%"
        left="35%"
        opacity={0.06}
        animation="floatSlow 13s ease-in-out 2.5s"
        color="#E8547A"
        outlined
      />

      {/* Tiny champagne heart – left-lower */}
      <Heart
        size={20}
        top="72%"
        left="22%"
        opacity={0.28}
        animation="floatSimple 7s ease-in-out 0.8s"
        color="#F0C070"
      />
    </div>
  );
}
