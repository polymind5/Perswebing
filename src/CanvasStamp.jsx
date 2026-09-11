import React, { useState, useEffect, useId, useMemo } from 'react';

/* ==========================================================================
   CanvasStamp Component
   --------------------------------------------------------------------------
   Dynamic code-generated elliptical stamp matching the reference design.
   Features:
   - Outer bold black ellipse (#1E1E1E)
   - Inner fine black ellipse (#1E1E1E)
   - 2 green circular dots (#27AA20) at the major axis apexes
   - Dynamic upper arc: real-time/formatted timestamp (M/D/YYYY H:MM:SS)
   - Dynamic lower arc: synchronized click counter ({cardClicks} CLICKS)
   - Fully vector SVG with fine-tuning parameters below.
   ========================================================================== */

// ─── TUNING PARAMETERS (Tweak these freely to adjust the look & placement) ───
export const STAMP_CONFIG = {
  // Placement on 1440 x 1020 Canvas
  x: 1240,                 // <-- Line 20: Center X on canvas (tweak left/right)
  y: 300,                  // <-- Line 21: Center Y on canvas (tweak up/down)
  scale: 0.48,             // <-- Line 22: Overall stamp scale factor (0.45 - 0.55)
  rotation: -60.4,         // <-- Line 23: Tilt angle in degrees (-60.4° matches reference)
  liveClock: true,         // <-- Line 24: True = clock ticks live; False = locked to session start

  // Ellipse Geometry (base unit size before scale)
  rxOuter: 292,            // Outer ellipse semi-major axis
  ryOuter: 177,            // Outer ellipse semi-minor axis
  rxInner: 194.5,          // Inner ellipse semi-major axis
  ryInner: 118,            // Inner ellipse semi-minor axis
  outerStroke: 20,         // Bold black border stroke width
  innerStroke: 6.5,        // Fine black inner border stroke width

  // Apex Green Dots
  dotRadius: 10.5,         // Radius of green dots
  dotDistance: 241.5,      // Distance from center along major axis

  // Typography & Arcs
  textRadiusX: 241.5,      // Text centerline semi-major axis (centered in channel)
  textRadiusY: 146,        // Text centerline semi-minor axis (centered in channel)
  clicksFontSize: 30,      // Font size for "{clicks} CLICKS"
  clicksLetterSpacing: 1.2,// Letter spacing for clicks
  dateFontSize: 28,        // Font size for timestamp
  dateLetterSpacing: 1.0,  // Letter spacing for timestamp
  fontFamily: '"Michroma", sans-serif',
  fontWeight: '400',

  // Colors
  blackColor: '#1E1E1E',   // Ring stroke color
  greenColor: '#27AA20',   // Text and dot green color
};

export const STAMP_STORAGE_KEY = 'persweb_stamp_tuning_config_v2';

export function loadSavedStampConfig() {
  if (typeof window === 'undefined') return { ...STAMP_CONFIG };
  try {
    const raw = localStorage.getItem(STAMP_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const merged = { ...STAMP_CONFIG, ...parsed };
      // Self-heal: ensure text radius is centered in channel (not inside inner ellipse 194.5)
      if (!merged.textRadiusX || merged.textRadiusX < 210) {
        merged.textRadiusX = 241.5;
        merged.textRadiusY = 146;
      }
      return merged;
    }
  } catch (e) {
    console.warn('Failed to load saved stamp config:', e);
  }
  return { ...STAMP_CONFIG };
}

export function formatStampDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const year = d.getFullYear();
  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}

export default function CanvasStamp({
  clicks = 0,
  timestamp,
  customConfig = {},
  className = '',
  style = {},
}) {
  const uniqueId = useId().replace(/:/g, '');
  const cfg = useMemo(() => ({ ...STAMP_CONFIG, ...customConfig }), [customConfig]);

  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    if (!cfg.liveClock || timestamp) return;
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [cfg.liveClock, timestamp]);

  const clicksText = `${clicks} CLICKS`;
  const formattedDate = useMemo(() => {
    if (typeof timestamp === 'string') return timestamp;
    return formatStampDate(timestamp || currentTime);
  }, [timestamp, currentTime]);


  const lowerPathId = `stamp-lower-path-${uniqueId}`;
  const upperPathId = `stamp-upper-path-${uniqueId}`;

  // Elliptical arc paths:
  // Lower arc: from -X to +X via +Y (counter-clockwise sweep=0 in SVG coords)
  const lowerArcD = `M ${-cfg.textRadiusX} 0 A ${cfg.textRadiusX} ${cfg.textRadiusY} 0 0 0 ${cfg.textRadiusX} 0`;
  // Upper arc: from +X to -X via -Y (counter-clockwise sweep=0 in SVG coords)
  const upperArcD = `M ${cfg.textRadiusX} 0 A ${cfg.textRadiusX} ${cfg.textRadiusY} 0 0 0 ${-cfg.textRadiusX} 0`;

  return (
    <g
      className={`canvas-stamp ${className}`}
      transform={`translate(${cfg.x}, ${cfg.y}) scale(${cfg.scale}) rotate(${cfg.rotation})`}
      style={style}
    >
      <defs>
        <path id={lowerPathId} d={lowerArcD} fill="none" />
        <path id={upperPathId} d={upperArcD} fill="none" />
      </defs>

      {/* Outer Bold Ellipse */}
      <ellipse
        cx="0"
        cy="0"
        rx={cfg.rxOuter}
        ry={cfg.ryOuter}
        fill="none"
        stroke={cfg.blackColor}
        strokeWidth={cfg.outerStroke}
      />

      {/* Inner Fine Ellipse */}
      <ellipse
        cx="0"
        cy="0"
        rx={cfg.rxInner}
        ry={cfg.ryInner}
        fill="none"
        stroke={cfg.blackColor}
        strokeWidth={cfg.innerStroke}
      />

      {/* Major Axis Green Apex Dots */}
      <circle cx={cfg.dotDistance} cy="0" r={cfg.dotRadius} fill={cfg.greenColor} />
      <circle cx={-cfg.dotDistance} cy="0" r={cfg.dotRadius} fill={cfg.greenColor} />

      {/* Lower Arc: "{clicks} CLICKS" */}
      <text
        fontFamily={cfg.fontFamily}
        fontSize={cfg.clicksFontSize}
        fontWeight={cfg.fontWeight}
        fill={cfg.greenColor}
        letterSpacing={cfg.clicksLetterSpacing}
        dominantBaseline="central"
      >
        <textPath href={`#${lowerPathId}`} startOffset="50%" textAnchor="middle">
          {clicksText}
        </textPath>
      </text>

      {/* Upper Arc: Timestamp */}
      <text
        fontFamily={cfg.fontFamily}
        fontSize={cfg.dateFontSize}
        fontWeight={cfg.fontWeight}
        fill={cfg.greenColor}
        letterSpacing={cfg.dateLetterSpacing}
        dominantBaseline="central"
      >
        <textPath href={`#${upperPathId}`} startOffset="50%" textAnchor="middle">
          {formattedDate}
        </textPath>
      </text>
    </g>
  );
}

export function getStampSvgString({ clicks = 0, timestamp, customConfig = {} } = {}) {
  const cfg = { ...STAMP_CONFIG, ...customConfig };
  const clicksText = `${clicks} CLICKS`;
  const formattedDate = typeof timestamp === 'string' ? timestamp : formatStampDate(timestamp || new Date());
  const lowerArcD = `M ${-cfg.textRadiusX} 0 A ${cfg.textRadiusX} ${cfg.textRadiusY} 0 0 0 ${cfg.textRadiusX} 0`;
  const upperArcD = `M ${cfg.textRadiusX} 0 A ${cfg.textRadiusX} ${cfg.textRadiusY} 0 0 0 ${-cfg.textRadiusX} 0`;

  return `
    <g transform="translate(${cfg.x}, ${cfg.y}) scale(${cfg.scale}) rotate(${cfg.rotation})">
      <defs>
        <path id="export-stamp-lower" d="${lowerArcD}" fill="none" />
        <path id="export-stamp-upper" d="${upperArcD}" fill="none" />
      </defs>
      <ellipse cx="0" cy="0" rx="${cfg.rxOuter}" ry="${cfg.ryOuter}" fill="none" stroke="${cfg.blackColor}" stroke-width="${cfg.outerStroke}" />
      <ellipse cx="0" cy="0" rx="${cfg.rxInner}" ry="${cfg.ryInner}" fill="none" stroke="${cfg.blackColor}" stroke-width="${cfg.innerStroke}" />
      <circle cx="${cfg.dotDistance}" cy="0" r="${cfg.dotRadius}" fill="${cfg.greenColor}" />
      <circle cx="${-cfg.dotDistance}" cy="0" r="${cfg.dotRadius}" fill="${cfg.greenColor}" />
      <text font-family="${cfg.fontFamily}" font-size="${cfg.clicksFontSize}" font-weight="${cfg.fontWeight}" fill="${cfg.greenColor}" letter-spacing="${cfg.clicksLetterSpacing}" dominant-baseline="central">
        <textPath href="#export-stamp-lower" startOffset="50%" text-anchor="middle">${clicksText}</textPath>
      </text>
      <text font-family="${cfg.fontFamily}" font-size="${cfg.dateFontSize}" font-weight="${cfg.fontWeight}" fill="${cfg.greenColor}" letter-spacing="${cfg.dateLetterSpacing}" dominant-baseline="central">
        <textPath href="#export-stamp-upper" startOffset="50%" text-anchor="middle">${formattedDate}</textPath>
      </text>
    </g>
  `;
}

