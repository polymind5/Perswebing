import React, { useRef, useEffect } from 'react'
import { motion } from 'motion/react'

/* ============================================
   Archive image data — grouped by section/project
   ============================================ */
const GRAPHICS_ROW = [
  { src: '/images/Archive/Graphics/Open.webp', alt: 'Open' },
  { src: '/images/Archive/Graphics/Pixel sun.webp', alt: 'Pixel sun' },
  { src: '/images/Archive/Graphics/Spirit.webp', alt: 'Spirit' },
  { src: '/images/Archive/Graphics/To be or not to be.webp', alt: 'To be or not to be' },
  { src: '/images/Archive/Graphics/E guy.webp', alt: 'E guy' },
  { src: '/images/Archive/Graphics/Numbers.webp', alt: 'Numbers' },
  { src: '/images/Archive/Graphics/Shell.webp', alt: 'Shell' },
  { src: '/images/Archive/Graphics/surajmukhi.webp', alt: 'surajmukhi' },
  { src: '/images/Archive/Graphics/Soft Reset.webp', alt: 'Soft Reset' },
  { src: '/images/Archive/Graphics/hi.mp4', alt: 'hi' },
]

const MARINAY_ROW = [
  { src: '/images/Archive/The Marinay/logomark.webp', alt: 'logomark' },
  { src: '/images/Archive/The Marinay/greece.webp', alt: 'greece' },
  { src: '/images/Archive/The Marinay/illustrations.webp', alt: 'illustrations' },
  { src: '/images/Archive/The Marinay/india.webp', alt: 'india' },
  { src: '/images/Archive/The Marinay/patterning.webp', alt: 'patterning' },
  { src: '/images/Archive/The Marinay/present.webp', alt: 'present' },
  { src: '/images/Archive/The Marinay/social media.webp', alt: 'social media' },
  { src: '/images/Archive/The Marinay/secondary partial mark.webp', alt: 'secondary partial mark' },
  { src: '/images/Archive/The Marinay/card.webp', alt: 'card' },
]

const VICHITRA_ROW = [
  { src: '/images/Archive/Vichitra/logomark.webp', alt: 'logomark' },
  { src: '/images/Archive/Vichitra/bag.webp', alt: 'bag' },
  { src: '/images/Archive/Vichitra/exp.webp', alt: 'exp' },
  { src: '/images/Archive/Vichitra/card.webp', alt: 'card' },
  { src: '/images/Archive/Vichitra/emblem exp.webp', alt: 'emblem exp' },
  { src: '/images/Archive/Vichitra/marks.webp', alt: 'marks' },
  { src: '/images/Archive/Vichitra/patterns.webp', alt: 'patterns' },
]

const GRAPHICS_2_ROW = [
  { src: '/images/Archive/Graphics 2/The.webp', alt: 'The' },
  { src: '/images/Archive/Graphics 2/Pixel flower.webp', alt: 'Pixel flower' },
  { src: '/images/Archive/Graphics 2/Doodle.webp', alt: 'Doodle' },
  { src: '/images/Archive/Graphics 2/Helvetica charmix.webp', alt: 'Helvetica charmix' },
  { src: '/images/Archive/Graphics 2/System Defiant expo.webp', alt: 'System Defiant expo' },
  { src: '/images/Archive/Graphics 2/Pattern.webp', alt: 'Pattern' },
  { src: '/images/Archive/Graphics 2/Eyes.webp', alt: 'Eyes' },
  { src: '/images/Archive/Graphics 2/Funny man.webp', alt: 'Funny man' },
  { src: '/images/Archive/Graphics 2/IDI.webp', alt: 'IDI' },
  { src: '/images/Archive/Graphics 2/Line face.webp', alt: 'Line face' },
]

const GRAPHICS_3_ROW = [
  { src: '/images/Archive/Graphics 3/CIC.webp', alt: 'CIC' },
  { src: '/images/Archive/Graphics 3/Dog.webp', alt: 'Dog' },
  { src: '/images/Archive/Graphics 3/Fruit.webp', alt: 'Fruit' },
  { src: '/images/Archive/Graphics 3/beginning of ruins.webp', alt: 'beginning of ruins' },
  { src: '/images/Archive/Graphics 3/So many.webp', alt: 'So many' },
  { src: '/images/Archive/Graphics 3/Lightman.webp', alt: 'Lightman' },
  { src: '/images/Archive/Graphics 3/transmute.webp', alt: 'transmute' },
  { src: '/images/Archive/Graphics 3/Globes.webp', alt: 'Globes' },
  { src: '/images/Archive/Graphics 3/text.webp', alt: 'text' },
]


const DIALKIT_ARCHIVE_DEFAULTS = {
  padding: {
    top: 108,
    right: 86,
    bottom: 120,
    left: 86,
  },
  rowOffsets: {
    graphics: 0,
    marinay: 501,
    vichitra: 117,
    row4: 348,
    row5: 0,
  },
  blur: {
    bottomStart: 100,
    bottomEnd: 40,
    rightStart: 120,
    rightEnd: 88,
  },
  rowGap: 16,
  imageGap: 10,
  rowHeight: 225,
  borderRadius: 8,
  title: {
    size: 16,
    marginBottom: 2,
    marginTop: 10,
  },
  sectionGap: 2,
};

const DIALKIT_ARCHIVE_MOBILE_DEFAULTS = {
  padding: {
    top: 84,
    right: 0,
    bottom: 84,
    left: 45,
  },
  rowOffsets: {
    graphics: 0,
    marinay: 0,
    vichitra: 0,
    row4: 0,
    row5: 0,
  },
  blur: {
    bottomStart: 80,
    bottomEnd: 40,
    rightStart: 25,
    rightEnd: 5,
  },
  rowGap: 16,
  imageGap: 10,
  rowHeight: 135,
  borderRadius: 7,
  title: {
    size: 12,
    marginBottom: 2,
    marginTop: 10,
  },
  sectionGap: 2,
};

export default function ArchiveView({ layout, isMobile }) {
  /* ──────────────────────────────────────────────
     DialKit — Archive-specific controls
     ────────────────────────────────────────────── */
  const arc = isMobile ? DIALKIT_ARCHIVE_MOBILE_DEFAULTS : DIALKIT_ARCHIVE_DEFAULTS

  /* ── Row refs for programmatic scroll positioning ── */
  const rowRefs = useRef({})

  useEffect(() => {
    const offsets = arc.rowOffsets
    for (const key of Object.keys(offsets)) {
      if (key === '_collapsed') continue
      const el = rowRefs.current[key]
      const offset = offsets[key]
      if (el && offset < 0) {
        // Pre-scroll to reveal the right-side content first
        el.scrollLeft = Math.abs(offset)
      }
    }
  }, [arc.rowOffsets])

  /* ── Helpers ── */
  const getTitleStyle = (offset) => ({
    paddingLeft: offset > 0 ? `${offset + arc.imageGap}px` : `${arc.imageGap}px`,
    textAlign: 'left'
  });

  // Always render a spacer with abs(offset) — for positive offsets it pushes right,
  // for negative offsets it creates scrollable space on the left that we pre-scroll past
  const renderSpacer = (offset) => {
    const w = Math.abs(offset)
    return w > 0 ? <div style={{ flexShrink: 0, width: `${w}px` }} /> : null;
  };

  const renderMedia = (item, i, prefix) => (
    <div className="archive-media-item" key={`${prefix}-${i}`}>
      {item.src.endsWith('.mp4') ? (
        <video src={item.src} autoPlay loop muted playsInline />
      ) : (
        <img src={item.src} alt={item.alt} />
      )}
    </div>
  );

  return (
    <motion.div
      className="archive-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: layout.archiveTransition.duration, ease: 'easeInOut' }}
      style={{
        '--arc-pad-top': `${arc.padding.top}px`,
        '--arc-pad-right': `${arc.padding.right}px`,
        '--arc-pad-bottom': `${arc.padding.bottom}px`,
        '--arc-pad-left': `${arc.padding.left}px`,
        '--arc-row-gap': `${arc.rowGap}px`,
        '--arc-img-gap': `${arc.imageGap}px`,
        '--arc-row-h': `${arc.rowHeight}px`,
        '--arc-radius': `${arc.borderRadius}px`,
        '--arc-title-size': `${arc.title.size}px`,
        '--arc-title-mb': `${arc.title.marginBottom}px`,
        '--arc-title-mt': `${arc.title.marginTop}px`,
        '--arc-section-gap': `${arc.sectionGap}px`,
        '--arc-blur-bottom-start': `${arc.blur.bottomStart}px`,
        '--arc-blur-bottom-end': `${arc.blur.bottomEnd}px`,
        '--arc-blur-right-start': `${arc.blur.rightStart}px`,
        '--arc-blur-right-end': `${arc.blur.rightEnd}px`,
      }}
    >
      <div className="archive-content" style={{ paddingBottom: isMobile ? '0px' : '100px' }}>

        {/* ═══════════════════ Graphics ═══════════════════ */}
        <div className="archive-section">
          <div className="archive-project-row" ref={el => rowRefs.current.graphics = el}>
            {renderSpacer(arc.rowOffsets.graphics)}
            {GRAPHICS_ROW.map((item, i) => renderMedia(item, i, 'g1'))}
          </div>
        </div>

        {/* ═══════════════════ The Marinay ═══════════════════ */}
        <div className="archive-section">
          <h2 className="archive-project__name" style={getTitleStyle(arc.rowOffsets.marinay)}>The Marinay</h2>
          <div className="archive-project-row" ref={el => rowRefs.current.marinay = el}>
            {renderSpacer(arc.rowOffsets.marinay)}
            {MARINAY_ROW.map((item, i) => renderMedia(item, i, 'mar'))}
          </div>
        </div>

        {/* ═══════════════════ Vichitra ═══════════════════ */}
        <div className="archive-section">
          <h2 className="archive-project__name" style={getTitleStyle(arc.rowOffsets.vichitra)}>Vichitra</h2>
          <div className="archive-project-row" ref={el => rowRefs.current.vichitra = el}>
            {renderSpacer(arc.rowOffsets.vichitra)}
            {VICHITRA_ROW.map((item, i) => renderMedia(item, i, 'vic'))}
          </div>
        </div>

        {/* ═══════════════════ Row 4 ═══════════════════ */}
        <div className="archive-section" style={{ paddingTop: `${arc.title.marginTop + arc.title.size * 1.3 + arc.title.marginBottom}px` }}>
          <div className="archive-project-row" ref={el => rowRefs.current.row4 = el}>
            {renderSpacer(arc.rowOffsets.row4)}
            {GRAPHICS_2_ROW.map((item, i) => renderMedia(item, i, 'g2'))}
          </div>
        </div>

        {/* ═══════════════════ Row 5 ═══════════════════ */}
        <div className="archive-section" style={{ paddingTop: `${arc.title.marginTop + arc.title.size * 1.3 + arc.title.marginBottom}px` }}>
          <div className="archive-project-row" ref={el => rowRefs.current.row5 = el}>
            {renderSpacer(arc.rowOffsets.row5)}
            {GRAPHICS_3_ROW.map((item, i) => renderMedia(item, i, 'g3'))}
          </div>
        </div>

      </div>
    </motion.div>
  )
}
