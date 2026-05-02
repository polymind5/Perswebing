import { useState } from 'react'
import { motion } from 'motion/react'

const TEXTS = {
  Context: 'What world does this exist in? What is the room already feeling before this walks in? What has been said here before, and by whom? What does the audience already believe, fear, or expect? What makes this moment different?',
  Intent: 'What is this actually trying to do? What changes if this works perfectly? Whose mind, feeling, or behavior is being moved and in which direction? What would the weaker, safer version of this intent look like? Is this stronger than that?',
  Contrast: 'What is this pushing against? What does it refuse to be? What is the dominant language of this space and where does this break from it? Is the tension surface level or does it run deeper? Could someone confuse this with something else?',
}
const DIALKIT_IDEOLOGY_DEFAULTS = {
  body: {
    fontSize: 13,
    lineHeight: 1.3,
    width: 600,
  },
  active: {
    strokeWidth: 1,
    bodyFontSize: 14,
  },
  big: {
    fontSize: 126,
    letterSpacing: -4,
    lineHeight: 1,
  },
  context: {
    textX: 555,
    textY: 240,
    wordX: 425,
    wordY: 210,
    activeTextX: 820,
    activeWordX: 175,
  },
  intent: {
    textX: 245,
    textY: 440,
    wordX: 210,
    wordY: 410,
    activeTextX: 560,
    activeWordX: 95,
  },
  contrast: {
    textX: 660,
    textY: 645,
    wordX: 530,
    wordY: 615,
    activeTextX: 850,
    activeWordX: 140,
  },
};

const DIALKIT_IDEOLOGY_MOBILE_DEFAULTS = {
  body: {
    fontSize: 10,
    lineHeight: 1.3,
    width: 275,
  },
  active: {
    strokeWidth: 1,
    bodyFontSize: 10,
  },
  big: {
    fontSize: 48,
    letterSpacing: -1,
    lineHeight: 0.5,
  },
  context: {
    textX: 20,
    textY: 100,
    wordX: 20,
    wordY: 80,
    activeTextX: 20,
    activeWordX: 10,
  },
  intent: {
    textX: 20,
    textY: 300,
    wordX: 20,
    wordY: 280,
    activeTextX: 20,
    activeWordX: 10,
  },
  contrast: {
    textX: 20,
    textY: 500,
    wordX: 20,
    wordY: 480,
    activeTextX: 20,
    activeWordX: 10,
  },
};

export default function IdeologyView({ layout, isMobile }) {
  const [activeSection, setActiveSection] = useState(null)
  const [hoveredSection, setHoveredSection] = useState(null)

  const ideo = isMobile ? DIALKIT_IDEOLOGY_MOBILE_DEFAULTS : DIALKIT_IDEOLOGY_DEFAULTS;

  const sections = [
    { word: 'Context', pos: ideo.context, text: TEXTS.Context },
    { word: 'Intent', pos: ideo.intent, text: TEXTS.Intent },
    { word: 'Contrast', pos: ideo.contrast, text: TEXTS.Contrast },
  ]

  return (
    <motion.div
      className={`ideology-view ${isMobile ? 'is-mobile' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: layout.archiveTransition.duration, ease: 'easeInOut' }}
    >
      {sections.map(({ word, pos, text }) => {
        const isActive = activeSection === word
        const isHovered = hoveredSection === word && !isActive

        return (
          <div
            key={word}
            className="ideology-unit"
          >
            {/* Big word — behind the text block */}
            <motion.span
              className="ideology-big-word"
              onClick={() => setActiveSection(isActive ? null : word)}
              onMouseEnter={() => setHoveredSection(word)}
              onMouseLeave={() => setHoveredSection(null)}
              initial={false}
              animate={{
                left: isActive ? pos.activeWordX : pos.wordX,
                color: isHovered ? '#27AA20' : '#FFFFFF',
                WebkitTextStroke: isHovered
                  ? `${ideo.active.strokeWidth}px #FFFFFF`
                  : `${ideo.active.strokeWidth}px #27AA20`,
              }}
              transition={{
                duration: 0.15,
                ease: 'easeInOut',
                color: { duration: 0.15 },
                WebkitTextStroke: { duration: 0.15 }
              }}
              style={{
                cursor: 'pointer',
                top: pos.wordY,
                fontSize: ideo.big.fontSize,
                letterSpacing: ideo.big.letterSpacing,
                lineHeight: ideo.big.lineHeight,
              }}
            >
              {word}
            </motion.span>

            {/* Body text block — on top */}
            <motion.p
              className="ideology-body"
              initial={false}
              animate={{
                left: isActive ? pos.activeTextX : pos.textX,
                fontSize: isActive ? ideo.active.bodyFontSize : ideo.body.fontSize,
              }}
              transition={{ duration: 0.15, ease: 'easeInOut' }}
              style={{
                top: pos.textY,
                width: ideo.body.width,
                lineHeight: ideo.body.lineHeight,
                textAlign: 'left',
                whiteSpace: 'pre-wrap',
                pointerEvents: 'none',
              }}
            >
              <span
                onClick={() => setActiveSection(isActive ? null : word)}
                onMouseEnter={() => setHoveredSection(word)}
                onMouseLeave={() => setHoveredSection(null)}
                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              >
                {text.replace(/\?\s*/g, '?\n')}
              </span>
            </motion.p>
          </div>
        )
      })}
    </motion.div>
  )
}
