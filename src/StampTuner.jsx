import React, { useState, useEffect, useRef, useCallback } from 'react';
import { STAMP_CONFIG, STAMP_STORAGE_KEY as STORAGE_KEY } from './CanvasStamp';

const PRESETS = {
  defaultMichroma: {
    name: 'User Dialed (Michroma)',
    config: {
      ...STAMP_CONFIG,
      x: 1295,
      y: 300,
      scale: 0.35,
      rotation: -72.2,
      textRadiusX: 255,
      textRadiusY: 142,
      clicksFontSize: 34,
      clicksLetterSpacing: 1.2,
      dateFontSize: 28,
      dateLetterSpacing: 1.0,
      fontFamily: 'Michroma, sans-serif',
      fontWeight: '400',
      textStroke: 3.5,
    },
  },
  tightReference: {
    name: 'Reference Match',
    config: {
      ...STAMP_CONFIG,
      x: 1240,
      y: 300,
      scale: 0.48,
      rotation: -60.4,
      rxOuter: 292,
      ryOuter: 177,
      rxInner: 194.5,
      ryInner: 118,
      textRadiusX: 255,
      textRadiusY: 154.5,
      outerStroke: 20,
      innerStroke: 6.5,
      dotDistance: 241.5,
      dotRadius: 10.5,
      clicksFontSize: 28,
      clicksLetterSpacing: 1.5,
      dateFontSize: 26,
      dateLetterSpacing: 1.2,
    },
  },
  compact: {
    name: 'Compact & Subtle',
    config: {
      ...STAMP_CONFIG,
      scale: 0.40,
      textRadiusX: 255,
      textRadiusY: 154.5,
      outerStroke: 14,
      innerStroke: 5,
      clicksFontSize: 26,
      dateFontSize: 24,
      dotRadius: 8,
    },
  },
  boldGraphic: {
    name: 'Bold Graphic',
    config: {
      ...STAMP_CONFIG,
      scale: 0.52,
      textRadiusX: 255,
      textRadiusY: 154.5,
      outerStroke: 26,
      innerStroke: 8,
      clicksFontSize: 34,
      dateFontSize: 32,
      dotRadius: 12,
    },
  },
};

export default function StampTuner({
  config,
  onChange,
  onReset,
  isVisible = true,
  onToggleVisible,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('transform');
  const [copied, setCopied] = useState(false);
  const [position, setPosition] = useState({ x: 24, y: 24 }); // offset from bottom-right
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });
  const panelRef = useRef(null);

  // Auto-save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      // ignore quota errors
    }
  }, [config]);

  // Keyboard shortcut: Toggle tuner with backslash `\` or Option+S
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.key === '\\' || (e.altKey && e.code === 'KeyS')) {
        e.preventDefault();
        onToggleVisible ? onToggleVisible() : setIsOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleVisible]);

  // Dragging logic
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) {
      return;
    }
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: position.x,
      startY: position.y,
    };

    const handleMouseMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.mouseX;
      const dy = moveEvent.clientY - dragStartRef.current.mouseY;
      // position is measured from right & bottom
      setPosition({
        x: Math.max(10, Math.min(window.innerWidth - 360, dragStartRef.current.startX - dx)),
        y: Math.max(10, Math.min(window.innerHeight - 80, dragStartRef.current.startY - dy)),
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [position]);

  const updateParam = (key, value) => {
    const num = typeof value === 'number' ? value : Number(value);
    onChange({
      ...config,
      [key]: isNaN(num) ? value : num,
    });
  };

  const handleCopyConfig = () => {
    const code = `export const STAMP_CONFIG = ${JSON.stringify(config, null, 2)};`;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePresetSelect = (e) => {
    const presetKey = e.target.value;
    if (PRESETS[presetKey]) {
      onChange({ ...PRESETS[presetKey].config });
    }
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    onReset();
  };

  if (!isVisible) {
    return (
      <button
        className="stamp-tuner-launcher"
        onClick={() => onToggleVisible && onToggleVisible()}
        title="Open Stamp Tuner (\ or Option+S)"
        aria-label="Open Stamp Tuner"
      >
        <span className="tuner-launcher-dot" />
        <span className="tuner-launcher-text">Stamp DialKit</span>
      </button>
    );
  }

  return (
    <div
      ref={panelRef}
      className={`stamp-tuner-panel ${isOpen ? 'is-open' : 'is-minimized'}`}
      style={{
        right: `${position.x}px`,
        bottom: `${position.y}px`,
      }}
    >
      {/* ─── Header & Draggable Bar ─── */}
      <div
        className="stamp-tuner-header"
        onMouseDown={handleMouseDown}
      >
        <div className="stamp-tuner-title">
          <span className="tuner-status-dot" />
          <span className="tuner-title-text">Stamp Tuner</span>
          <span className="tuner-version-badge">Michroma</span>
        </div>

        <div className="stamp-tuner-header-actions">
          <button
            type="button"
            className="tuner-icon-btn"
            onClick={() => setIsOpen(!isOpen)}
            title={isOpen ? 'Minimize' : 'Expand'}
          >
            {isOpen ? '—' : '▢'}
          </button>
          {onToggleVisible && (
            <button
              type="button"
              className="tuner-icon-btn close-btn"
              onClick={onToggleVisible}
              title="Close Tuner (press \ to reopen)"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <>
          {/* ─── Presets & Top Utility Bar ─── */}
          <div className="stamp-tuner-presets-bar">
            <select
              className="stamp-tuner-preset-select"
              onChange={handlePresetSelect}
              defaultValue=""
            >
              <option value="" disabled>Load Preset...</option>
              {Object.entries(PRESETS).map(([k, p]) => (
                <option key={k} value={k}>{p.name}</option>
              ))}
            </select>

            <button
              type="button"
              className={`stamp-tuner-copy-btn ${copied ? 'is-copied' : ''}`}
              onClick={handleCopyConfig}
              title="Copy current config as JavaScript code"
            >
              {copied ? '✓ Copied' : 'Copy Config'}
            </button>

            <button
              type="button"
              className="stamp-tuner-reset-btn"
              onClick={handleReset}
              title="Reset all parameters to default"
            >
              Reset
            </button>
          </div>

          {/* ─── Tab Navigation ─── */}
          <div className="stamp-tuner-tabs">
            <button
              type="button"
              className={`tuner-tab-btn ${activeTab === 'transform' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('transform')}
            >
              Transform
            </button>
            <button
              type="button"
              className={`tuner-tab-btn ${activeTab === 'ellipses' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('ellipses')}
            >
              Ellipses
            </button>
            <button
              type="button"
              className={`tuner-tab-btn ${activeTab === 'typography' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('typography')}
            >
              Type
            </button>
            <button
              type="button"
              className={`tuner-tab-btn ${activeTab === 'dots' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('dots')}
            >
              Dots & Style
            </button>
          </div>

          {/* ─── Controls Body ─── */}
          <div className="stamp-tuner-body">
            {/* TAB 1: Transform & Placement */}
            {activeTab === 'transform' && (
              <div className="tuner-tab-content">
                <ControlSlider
                  label="Position X (Canvas)"
                  paramKey="x"
                  value={config.x}
                  min={0}
                  max={1440}
                  step={1}
                  onChange={updateParam}
                />
                <ControlSlider
                  label="Position Y (Canvas)"
                  paramKey="y"
                  value={config.y}
                  min={0}
                  max={1020}
                  step={1}
                  onChange={updateParam}
                />
                <ControlSlider
                  label="Scale Factor"
                  paramKey="scale"
                  value={config.scale}
                  min={0.15}
                  max={1.20}
                  step={0.01}
                  onChange={updateParam}
                />
                <ControlSlider
                  label="Rotation (° Tilt)"
                  paramKey="rotation"
                  value={config.rotation}
                  min={-180}
                  max={180}
                  step={0.2}
                  onChange={updateParam}
                />

                <div className="tuner-row tuner-toggle-row">
                  <label className="tuner-label">Live Clock Ticking</label>
                  <input
                    type="checkbox"
                    className="tuner-checkbox"
                    checked={config.liveClock}
                    onChange={(e) => updateParam('liveClock', e.target.checked)}
                  />
                </div>

                <div className="tuner-row tuner-toggle-row" style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <label className="tuner-label" style={{ color: '#E4E4E7' }}>Show on Main Canvas</label>
                  <input
                    type="checkbox"
                    className="tuner-checkbox"
                    checked={config.showOnCanvas !== false}
                    onChange={(e) => updateParam('showOnCanvas', e.target.checked)}
                  />
                </div>
                <div style={{ fontSize: '9.5px', color: '#71717A', marginTop: 2 }}>
                  * Stamp is ALWAYS visible on print export regardless of this toggle.
                </div>
              </div>
            )}

            {/* TAB 2: Ellipses Geometry */}
            {activeTab === 'ellipses' && (
              <div className="tuner-tab-content">
                <div className="tuner-section-title">Outer Ellipse (Bold)</div>
                <ControlSlider
                  label="Outer Radius X"
                  paramKey="rxOuter"
                  value={config.rxOuter}
                  min={100}
                  max={450}
                  step={1}
                  onChange={updateParam}
                />
                <ControlSlider
                  label="Outer Radius Y"
                  paramKey="ryOuter"
                  value={config.ryOuter}
                  min={50}
                  max={300}
                  step={1}
                  onChange={updateParam}
                />
                <ControlSlider
                  label="Outer Stroke Width"
                  paramKey="outerStroke"
                  value={config.outerStroke}
                  min={1}
                  max={40}
                  step={0.5}
                  onChange={updateParam}
                />

                <div className="tuner-section-title" style={{ marginTop: 14 }}>Inner Ellipse (Fine)</div>
                <ControlSlider
                  label="Inner Radius X"
                  paramKey="rxInner"
                  value={config.rxInner}
                  min={50}
                  max={350}
                  step={0.5}
                  onChange={updateParam}
                />
                <ControlSlider
                  label="Inner Radius Y"
                  paramKey="ryInner"
                  value={config.ryInner}
                  min={30}
                  max={250}
                  step={0.5}
                  onChange={updateParam}
                />
                <ControlSlider
                  label="Inner Stroke Width"
                  paramKey="innerStroke"
                  value={config.innerStroke}
                  min={0.5}
                  max={20}
                  step={0.5}
                  onChange={updateParam}
                />
              </div>
            )}

            {/* TAB 3: Typography (Michroma) */}
            {activeTab === 'typography' && (
              <div className="tuner-tab-content">
                <div className="tuner-row tuner-select-row">
                  <label className="tuner-label">Font Family</label>
                  <select
                    className="tuner-select"
                    value={config.fontFamily}
                    onChange={(e) => updateParam('fontFamily', e.target.value)}
                  >
                    <option value='"Michroma", sans-serif'>Michroma (Active)</option>
                    <option value="'Vollkorn', serif">Vollkorn (Serif)</option>
                    <option value='-apple-system, BlinkMacSystemFont, sans-serif'>System Sans-Serif</option>
                    <option value='"Courier New", monospace'>Monospace</option>
                  </select>
                </div>

                <div className="tuner-section-title" style={{ marginTop: 10 }}>Clicks Text Arc</div>
                <ControlSlider
                  label="Clicks Font Size"
                  paramKey="clicksFontSize"
                  value={config.clicksFontSize}
                  min={12}
                  max={60}
                  step={1}
                  onChange={updateParam}
                />
                <ControlSlider
                  label="Clicks Letter Spacing"
                  paramKey="clicksLetterSpacing"
                  value={config.clicksLetterSpacing}
                  min={-2}
                  max={8}
                  step={0.1}
                  onChange={updateParam}
                />

                <div className="tuner-section-title" style={{ marginTop: 14 }}>Timestamp Arc</div>
                <ControlSlider
                  label="Date Font Size"
                  paramKey="dateFontSize"
                  value={config.dateFontSize}
                  min={12}
                  max={60}
                  step={1}
                  onChange={updateParam}
                />
                <ControlSlider
                  label="Date Letter Spacing"
                  paramKey="dateLetterSpacing"
                  value={config.dateLetterSpacing}
                  min={-2}
                  max={8}
                  step={0.1}
                  onChange={updateParam}
                />

                <div className="tuner-section-title" style={{ marginTop: 14 }}>Text Arc Radii</div>
                <ControlSlider
                  label="Text Arc Radius X"
                  paramKey="textRadiusX"
                  value={config.textRadiusX}
                  min={50}
                  max={350}
                  step={0.5}
                  onChange={updateParam}
                />
                <ControlSlider
                  label="Text Arc Radius Y"
                  paramKey="textRadiusY"
                  value={config.textRadiusY}
                  min={30}
                  max={250}
                  step={0.5}
                  onChange={updateParam}
                />

                <div className="tuner-section-title" style={{ marginTop: 14 }}>Text Stroke (Black Outline)</div>
                <ControlSlider
                  label="Black Stroke Width"
                  paramKey="textStroke"
                  value={config.textStroke ?? 3.5}
                  min={0}
                  max={8}
                  step={0.2}
                  onChange={updateParam}
                />
              </div>
            )}

            {/* TAB 4: Dots & Color Style */}
            {activeTab === 'dots' && (
              <div className="tuner-tab-content">
                <div className="tuner-section-title">Apex Dots</div>
                <ControlSlider
                  label="Dot Distance (from center)"
                  paramKey="dotDistance"
                  value={config.dotDistance}
                  min={50}
                  max={350}
                  step={0.5}
                  onChange={updateParam}
                />
                <ControlSlider
                  label="Dot Radius"
                  paramKey="dotRadius"
                  value={config.dotRadius}
                  min={2}
                  max={25}
                  step={0.5}
                  onChange={updateParam}
                />

                <div className="tuner-section-title" style={{ marginTop: 14 }}>Colors</div>
                <div className="tuner-color-row">
                  <div className="tuner-color-item">
                    <label className="tuner-label">Accent Green</label>
                    <div className="tuner-color-input-wrap">
                      <input
                        type="color"
                        value={config.greenColor}
                        onChange={(e) => updateParam('greenColor', e.target.value)}
                        className="tuner-color-picker"
                      />
                      <input
                        type="text"
                        value={config.greenColor}
                        onChange={(e) => updateParam('greenColor', e.target.value)}
                        className="tuner-color-text"
                      />
                    </div>
                  </div>

                  <div className="tuner-color-item">
                    <label className="tuner-label">Rings Black</label>
                    <div className="tuner-color-input-wrap">
                      <input
                        type="color"
                        value={config.blackColor}
                        onChange={(e) => updateParam('blackColor', e.target.value)}
                        className="tuner-color-picker"
                      />
                      <input
                        type="text"
                        value={config.blackColor}
                        onChange={(e) => updateParam('blackColor', e.target.value)}
                        className="tuner-color-text"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─── Footer Readout ─── */}
          <div className="stamp-tuner-footer">
            <span className="tuner-footer-hint">Shortcut: press \ or Option+S to hide</span>
            <span className="tuner-footer-coords">
              X:{Math.round(config.x)} Y:{Math.round(config.y)} S:{config.scale.toFixed(2)} R:{config.rotation}°
            </span>
          </div>
        </>
      )}
    </div>
  );
}

function ControlSlider({ label, paramKey, value, min, max, step, onChange }) {
  return (
    <div className="tuner-control-slider">
      <div className="tuner-slider-top">
        <span className="tuner-param-label">{label}</span>
        <input
          type="number"
          className="tuner-param-number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(paramKey, e.target.value)}
        />
      </div>
      <input
        type="range"
        className="tuner-range-input"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(paramKey, parseFloat(e.target.value))}
      />
    </div>
  );
}
