import { useState } from 'react'
import { motion } from 'motion/react'

const TEXTS = {
  Context: 'What world does this exist in? What is the room already feeling before this walks in? What has been said here before, and by whom? What does the audience already believe, fear, or expect? What makes this moment different?',
  Intent: 'What is this actually trying to do? What changes if this works perfectly? Whose mind, feeling, or behavior is being moved and in which direction? What would the weaker, safer version of this intent look like? Is this stronger than that?',
  Contrast: 'What is this pushing against? What does it refuse to be? What is the dominant language of this space and where does this break from it? Is the tension surface level or does it run deeper? Could someone confuse this with something else?',
}

const IDEOLOGY_MANIFESTO = `These are functions, functions of understanding and action.
I don't have faith in these ideas. These don't come as a marking scheme to judge or create. 
This is very much still, a vibe based system; with them stirring away in the back of my mind as I watch myself dissect an idea in an environment.

The disposition of CIC stands in its presence throughout the land and seas.
There is context to everything, a intent to work towards, and a contrast to be differentiated.
These act as a way to the progression of the ideas, by assessing them through the functions as to where they stand in relation to each other through them.

A environment, any environment, is in a discretion to the idea itself. 
Most of the time they don't come in simultaneously with that sudden spark, but rather have to be brought up with these type of functions to be able to communicate it with other people, sometimes self and often with the idea itself. 
These stand as that, and would keep themselves until there are things to see and make.`
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
    textY: 150,
    wordX: 425,
    wordY: 120,
    activeTextX: 820,
    activeWordX: 175,
  },
  intent: {
    textX: 245,
    textY: 350,
    wordX: 210,
    wordY: 320,
    activeTextX: 560,
    activeWordX: 95,
  },
  contrast: {
    textX: 660,
    textY: 555,
    wordX: 530,
    wordY: 525,
    activeTextX: 850,
    activeWordX: 140,
  },
  manifesto: {
    width: 600,
    x: 720,
    y: 760,
    fontSize: 18,
    lineHeight: 1.3,
  },
  exclamark: {
    y: 1400,
    size: 200,
  },
  blur: {
    bottomStart: 140,
    bottomEnd: 100,
  },
  paddingBottom: 100,
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
    textX: '54%',
    textY: 115,
    wordX: '50%',
    wordY: 80,
    activeTextX: '50%',
    activeWordX: '50%',
  },
  intent: {
    textX: '62%',
    textY: 260,
    wordX: '50%',
    wordY: 225,
    activeTextX: '50%',
    activeWordX: '50%',
  },
  contrast: {
    textX: '51%',
    textY: 420,
    wordX: '50%',
    wordY: 385,
    activeTextX: '50%',
    activeWordX: '50%',
  },
  manifesto: {
    width: 280,
    x: '50%',
    y: 600,
    fontSize: 11,
    lineHeight: 1.3,
  },
  exclamark: {
    y: 1100,
    size: 120,
  },
  blur: {
    bottomStart: 80,
    bottomEnd: 40,
  },
  paddingBottom: 0,
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
      style={{
        '--ideo-blur-bottom-start': `${ideo.blur.bottomStart}px`,
        '--ideo-blur-bottom-end': `${ideo.blur.bottomEnd}px`,
      }}
    >
      <div
        className="ideology-content"
        style={{
          minHeight: '100%',
          height: ideo.exclamark.y + 450,
          paddingBottom: ideo.paddingBottom
        }}
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
                  top: pos.wordY,
                  x: isMobile ? '-50%' : 0,
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
                  position: 'absolute',
                  left: isActive ? pos.activeWordX : pos.wordX,
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
                  top: pos.textY,
                  x: isMobile ? '-50%' : 0,
                  fontSize: isActive ? ideo.active.bodyFontSize : ideo.body.fontSize,
                }}
                transition={{ duration: 0.15, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
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
                  {text ? text.replace(/\?\s*/g, '?\n') : ''}
                </span>
              </motion.p>
            </div>
          )
        })}

        {/* Central Manifesto Text */}
        <div
          className="ideology-manifesto"
          style={{
            position: 'absolute',
            left: ideo.manifesto.x,
            top: ideo.manifesto.y,
            width: ideo.manifesto.width,
            transform: 'translate(-50%, 0)',
            fontSize: ideo.manifesto.fontSize,
            lineHeight: ideo.manifesto.lineHeight,
            textAlign: 'left',
            whiteSpace: 'pre-wrap',
            color: '#1E1E1E',
            zIndex: 10,
            fontFamily: "'Vollkorn', serif",
          }}
        >
          {IDEOLOGY_MANIFESTO}
        </div>

        {/* Exclamation Mark SVG */}
        <motion.img
          src="/exclamark.svg"
          alt="Exclamation Mark"
          style={{
            position: 'absolute',
            left: '50%',
            top: ideo.exclamark.y,
            width: ideo.exclamark.size,
            height: 'auto',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </div>
    </motion.div>
  )
}
