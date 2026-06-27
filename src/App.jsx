import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react'
import ArchiveView from './ArchiveView'
import IdeologyView from './IdeologyView'
import { Analytics } from '@vercel/analytics/react'


/* ============================================
   Image data — each card's cycleable images
   with titles for the companion text card
   ============================================ */
const PROJECTS_IMAGES = [
  { src: '/images/Projects/Patterns_72.webp', title: 'RangRekh', desc: 'RangRekh is an exploration of patterns emerging from constrainted space of means, where only one origin exists but how countless variations arise from within.', dark: false, link: 'https://rangrekh.framer.website' },
  { src: '/images/Projects/Tria.webp', title: 'Tria', desc: 'Tria is a revolving gallery of arts. Showcasing all the things made and said by women.', dark: false, link: 'https://tria.framer.website' },
]

const ANIMATIONS_VIDEOS = [
  { src: '/images/Animations/Light_compressed.mp4', title: 'Light', desc: 'A short looping animation of a poem appearing in the form of light, as the poem describes it.', dark: true },
  { src: '/images/Animations/Rumi_disturbed_compressed.mp4', title: 'Rumi disturbed', desc: 'Animation of a angry Rumi, disturbed in his sleep and raging upon the world, and then going back to peace of his dreams.', dark: false },
]

const GRAPHICS_IMAGES = [
  { src: '/images/Graphics/The all.webp', title: 'The All', desc: 'Playlist cover art for all the songs that I have liked over the years, encompassing all genres and times far and wide.', dark: false },
  { src: '/images/Graphics/System Defiant.webp', title: 'System Defiant', desc: 'A wordmark for a group of people defying systems, and riding the world the way they see it.', dark: false },
  { src: '/images/Graphics/Taking time.webp', title: 'Taking time', desc: 'A sketch of a person lying down, hands folded behind their head, legs in obscure folding mid air. Seems relaxing.', dark: true },
  { src: '/images/Graphics/Flowing.webp', title: 'Flowing', desc: 'Depth mapped experimental gradient.', dark: false },
  { src: '/images/Graphics/And.webp', title: 'And', desc: 'Combining the forms of a ampersand, a At symbol and a abstract bird for a experimental type foundry logo.', dark: true },
  { src: '/images/Graphics/Ambiguity.webp', title: 'Ambiguity', desc: 'Illustration for the concept of ambiguity; one of the interesting ones at that.', dark: false },
  { src: '/images/Graphics/TIFI.webp', title: 'TIFI', desc: 'Logo exploations for a new age publisher, inspired by japanese paper lamps, Chōchin.', dark: false },
  { src: '/images/Graphics/So many ways to live.webp', title: 'So Many Ways to Live', desc: 'Sketch of a man seeing the paths in front of him, changing his face itself as he observes more.', dark: false },
]

const PHOTOS_IMAGES = [
  { src: '/images/Photos/Lightman.webp', title: 'Lightman', desc: 'Street light caught in a moment of urban poetry.', dark: false },
  { src: '/images/Photos/Hands in the air.webp', title: 'Hands in the Air', desc: 'Celebration or surrender — hands reaching skyward.', dark: true },
  { src: '/images/Photos/BW legs.webp', title: 'BW Legs', desc: 'Black and white study of movement and stillness.', dark: true },
  { src: '/images/Photos/Ants.webp', title: 'Ants', desc: 'Macro perspective — the world from a smaller vantage point.', dark: false },
  { src: '/images/Photos/Beam.webp', title: 'Beam', desc: 'Light cutting through space, a beam as subject.', dark: true },
  { src: '/images/Photos/Blades.webp', title: 'Blades', desc: 'Sharp edges and natural forms in close conversation.', dark: false },
  { src: '/images/Photos/The lights in screen.webp', title: 'The Lights in Screen', desc: 'Digital glow bleeding into the physical world.', dark: true },
  { src: '/images/Photos/Dashing.webp', title: 'Dashing', desc: 'Motion blur and urgency — the rush of city life.', dark: false },
  { src: '/images/Photos/Way.webp', title: 'Way', desc: 'The road ahead — direction and possibility.', dark: true },
  { src: '/images/Photos/On light.webp', title: 'On Light', desc: 'Chasing light — photography at its most essential.', dark: false },
  { src: '/images/Photos/Bus.webp', title: 'Bus', desc: 'Transit as metaphor — the journey captured in a frame.', dark: false },
  { src: '/images/Photos/Demol.webp', title: 'Demol', desc: 'Demolition and rebirth — destruction as a creative act.', dark: false },
  { src: '/images/Photos/Colours.webp', title: 'Colours', desc: 'Raw color, unfiltered and vivid.', dark: false },
  { src: '/images/Photos/Spiral.webp', title: 'Spiral', desc: 'Architecture in a curve — spiraling upward or inward.', dark: false },
  { src: '/images/Photos/Tree.webp', title: 'Tree', desc: 'A tree standing alone — rooted, reaching.', dark: false },
  { src: '/images/Photos/Flower.webp', title: 'Flower', desc: 'Delicate petals, simple beauty.', dark: true },
]

const DESKTOP_DEFAULT_PHOTO_INDEX = PHOTOS_IMAGES.findIndex((image) => image.title === 'Lightman')
const MOBILE_DEFAULT_PHOTO_INDEX = PHOTOS_IMAGES.findIndex((image) => image.title === 'Demol')

const WORDS_ARTICLES = [
  { title: 'The Question is the First Answer', desc: '"What do you want to know?", starts the cycle of curiosity as being the question zero.', link: 'https://open.substack.com/pub/polymind45/p/the-question-is-the-first-answer?r=5v0rm5&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true' },
]
const DIALKIT_LAYOUT_DEFAULTS = {
  canvasW: 1440,
  canvasH: 1020,
  contentYOffset: 30,

  lineProjects: {
    sx: 173, sy: 279, cx: 108, cy: 290, ex: 115, ey: 405
  },
  lineAnimations: {
    sx: 806, sy: 175, cx: 833, cy: 117, ex: 903, ey: 129
  },
  lineGraphics: {
    sx: 675, sy: 566, cx: 750, cy: 562, ex: 740, ey: 638
  },

  labels: {
    speed: 0.12,
    topOffset: 0,
    startSlide: -5,
    endSlide: 5,
  },
  archiveBtn: {
    right: 60,
    bottom: 32,
    size: 24,
    stroke: 1,
    duration: 0.2,
  },
  ideologyBtn: {
    left: 60,
    bottom: 32,
    size: 24,
    stroke: 1,
    duration: 0.2,
  },
  archiveTransition: {
    scaleExit: 0.99,
    duration: 0.3,
  },
  faceIcon: {
    width: 260,
    height: 260,
  },
  viewProjectBtn: {
    top: -19,
    right: -31,
    scale: 1.30,
    fadeSpeed: 0.25,
  },

  interactiveCard: {
    hoverOffsetX: -79,
    hoverOffsetY: -42,
    hoverScale: 0.2,
    hoverRotate: -39,
    'shadow1.offsetY': 41,
    'shadow1.blur': 55,
    'shadow1.opacity': 0.5,
    'shadow2.blur': 91,
    'shadow2.opacity': 0.4,
  },
};

const MOBILE_LAYOUT_DEFAULTS = {
  gap: 12,
  paddingX: 15,
  paddingTop: 60,
  paddingBottom: 84,
  cardMaxWidth: 400,
  cardMinWidth: 270,
  cardInset: 58,
  dotSize: 20,
  dotInset: 20,
  sideLabelInset: 21,
  sideLabelBottom: 50,
  sideLabelSize: 20,
  projectBtnRight: 20,
  projectBtnBottom: 92,
  projectBtnScale: 0.82,
  projectAnchorX: 60,
  projectAnchorY: 115,
};

const STAGGERED_MOBILE_LAYOUT = {
  projects: { x: -20, mt: 0, w: 260 },
  words: { x: 35, mt: -87, w: 240 },
  graphics: { x: -35, mt: -10, w: 200 },
  animations: { x: 52, mt: -29, w: 190 },
  vision: { x: 10, mt: -8, w: 180 },
  photos: { x: -15, mt: -10, w: 240 },
  info: { x: 20, mt: -10, w: 240 },
};

/* ──────────────────────────────────────────────
   Vertical Indicator Dots Component (Option 1)
   With progressive shrinking like Instagram
   ────────────────────────────────────────────── */
function CardDots({ total, current, positionClass, isDark }) {
  if (total <= 1) return null;

  const maxVisible = 5;
  const useScrolling = total > maxVisible;

  // Height of each dot cell = 6px dot + 6px gap = 12px
  // If scrolling, we shift the container to keep active dot centered
  let translateY = 0;
  if (useScrolling) {
    let targetTranslate = -(current - 2) * 12;
    // Clamp so we don't scroll past boundaries
    translateY = Math.min(0, Math.max(-(total - maxVisible) * 12, targetTranslate));
  }

  const dots = [];
  for (let i = 0; i < total; i++) {
    const diff = i - current;
    const absDiff = Math.abs(diff);

    let scale = 1;
    let opacity = 0.6;

    if (useScrolling) {
      if (absDiff === 0) {
        scale = 1.0;
        opacity = 1.0;
      } else if (absDiff === 1) {
        scale = 0.8;
        opacity = 0.6;
      } else if (absDiff === 2) {
        scale = 0.5;
        opacity = 0.3;
      } else {
        scale = 0.0;
        opacity = 0.0;
      }
    } else {
      if (absDiff === 0) {
        scale = 1.0;
        opacity = 1.0;
      } else {
        scale = 0.8;
        opacity = 0.4;
      }
    }

    dots.push(
      <span
        key={i}
        className="card-dot"
        style={{
          backgroundColor: isDark ? '#ffffff' : '#000000',
          transform: `scale(${scale})`,
          opacity: opacity,
        }}
      />
    );
  }

  return (
    <div
      className={`card-dots ${positionClass}`}
      style={{
        height: useScrolling ? `${maxVisible * 12 - 6}px` : 'auto',
        overflow: useScrolling ? 'hidden' : 'visible',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          transform: `translateY(${translateY}px)`,
          transition: 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {dots}
      </div>
    </div>
  );
}

export default function App() {
  const canvasRef = useRef(null)
  const cursorRef = useRef(null)

  const getInitialView = () => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      return ['archive', 'ideology'].includes(hash) ? hash : 'home';
    }
    return 'home';
  };
  const [view, setView] = useState(getInitialView());

  // --- Image Preloading Logic ---
  useEffect(() => {
    const allImages = [
      ...PROJECTS_IMAGES.map(img => img.src),
      ...GRAPHICS_IMAGES.map(img => img.src),
      ...PHOTOS_IMAGES.map(img => img.src),
    ];

    allImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const syncViewWithLocation = () => {
      setView(getInitialView());
    };
    window.addEventListener('popstate', syncViewWithLocation);
    window.addEventListener('hashchange', syncViewWithLocation);
    return () => {
      window.removeEventListener('popstate', syncViewWithLocation);
      window.removeEventListener('hashchange', syncViewWithLocation);
    };
  }, []);

  const navigateTo = (newView) => {
    if (newView === view) return;
    if (newView === 'home') {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    } else {
      window.history.pushState(null, '', `#${newView}`);
    }
    setView(newView);
  };

  const [activeMobileCard, setActiveMobileCard] = useState(null);
  const [useNewMobileLayout, setUseNewMobileLayout] = useState(true); // Toggle for safety

  const [hoveredCard, setHoveredCard] = useState(null)
  const [isLinkHovered, setIsLinkHovered] = useState(false)

  /* ── Interactive 3D Card State ── */
  const [cardState, setCardState] = useState('hidden') // 'hidden', 'hover', 'thrown'
  const cardStateRef = useRef('hidden') // Synchronous tracker to prevent stale closures
  const [isCardFlipped, setIsCardFlipped] = useState(false)

  const cardTargetX = useMotionValue(60) // Initialize roughly where the dot is so it doesn't fly from 0,0
  const cardTargetY = useMotionValue(60)

  // Spring physics for smooth hover tracking
  const cardSpringX = useSpring(cardTargetX, { stiffness: 400, damping: 30 })
  const cardSpringY = useSpring(cardTargetY, { stiffness: 400, damping: 30 })

  const dotCenterLoc = useRef({ x: 60, y: 60 })
  const dotRectRef = useRef({ left: 0, top: 0, width: 30, height: 30 })
  const cardRotateTarget = useMotionValue(0)
  const cardRotateSpring = useSpring(cardRotateTarget, { stiffness: 300, damping: 20 })

  // Parallax tracking when thrown
  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)

  // 3D Parallax Tilt when thrown (like Apple/mymind cards)
  const tiltX = useTransform(rawMouseY, v => {
    const halfH = typeof window !== 'undefined' ? window.innerHeight / 2 : 450;
    return ((v - halfH) / halfH) * -15; // Inverted
  });
  const tiltY = useTransform(rawMouseX, v => {
    const halfW = typeof window !== 'undefined' ? window.innerWidth / 2 : 720;
    return ((v - halfW) / halfW) * 25; // Inverted
  });

  const springTiltX = useSpring(tiltX, { stiffness: 400, damping: 40 });
  const springTiltY = useSpring(tiltY, { stiffness: 400, damping: 40 });

  // --- Gyroscope Tilt (Mobile Only) ---
  const gyroBeta = useMotionValue(0)
  const gyroGamma = useMotionValue(0)
  const springGyroX = useSpring(gyroBeta, { stiffness: 150, damping: 25 })
  const springGyroY = useSpring(gyroGamma, { stiffness: 150, damping: 25 })

  const handleOrientation = useCallback((e) => {
    // beta: front-back tilt (-180 to 180)
    // gamma: left-right tilt (-90 to 90)
    const b = e.beta || 0;
    const g = e.gamma || 0;

    // Map orientation to rotation: phone at ~45 deg is "flat" for beta
    const rotationX = Math.max(-25, Math.min(25, (b - 45) * 0.8));
    const rotationY = Math.max(-25, Math.min(25, g * 0.8));
    gyroBeta.set(rotationX);
    gyroGamma.set(rotationY);

    // Position Float (only when thrown and on mobile)
    if (window.innerWidth < 768 && cardStateRef.current === 'thrown') {
      const offsetX = g * 0.75;
      const offsetY = (b - 45) * 0.75;
      cardTargetX.set(window.innerWidth / 2 + offsetX);
      cardTargetY.set(window.innerHeight / 2 + offsetY);
    }
  }, [gyroBeta, gyroGamma, cardTargetX, cardTargetY]);

  const requestGyroPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
        }
      } catch (err) { console.error(err); }
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }
  };

  // Shine reflection — map mouse position to gradient center (0–100%)
  const shineX = useTransform(rawMouseX, v => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1440;
    return (v / w) * 100;
  });
  const shineY = useTransform(rawMouseY, v => {
    const h = typeof window !== 'undefined' ? window.innerHeight : 900;
    return (v / h) * 100;
  });
  const shineBackground = useMotionTemplate`radial-gradient(ellipse at ${shineX}% ${shineY}%, rgba(255, 255, 255, 0.25), transparent 80%)`;

  // Helper: return card to dot and then hide
  const returnCardToDot = useCallback(() => {
    if (cardStateRef.current === 'returning') return; // already returning
    cardStateRef.current = 'returning';
    setCardState('returning');
    setIsCardFlipped(false);
    // Animate springs back to dot center
    cardTargetX.set(dotCenterLoc.current.x);
    cardTargetY.set(dotCenterLoc.current.y);
    cardRotateTarget.set(0);
    // After spring settles, fully hide
    setTimeout(() => {
      if (cardStateRef.current === 'returning') {
        cardStateRef.current = 'hidden';
        setCardState('hidden');
      }
    }, 450);
  }, [cardTargetX, cardTargetY, cardRotateTarget]);

  // Global click to dismiss thrown card
  useEffect(() => {
    const handleGlobalClick = () => {
      if (cardStateRef.current === 'thrown') {
        returnCardToDot();
      }
    }
    window.addEventListener('click', handleGlobalClick)
    return () => window.removeEventListener('click', handleGlobalClick)
  }, [returnCardToDot])

  // Top-left dot interaction handlers
  const handleDotEnter = (e) => {
    if (cardStateRef.current !== 'thrown' && cardStateRef.current !== 'returning') {
      const rect = e.target.getBoundingClientRect();
      const dotCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      dotCenterLoc.current = dotCenter;
      dotRectRef.current = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };

      // Snap springs instantly to dot center so card appears from the dot
      cardSpringX.set(dotCenter.x);
      cardSpringY.set(dotCenter.y);
      cardTargetX.set(dotCenter.x);
      cardTargetY.set(dotCenter.y);
      cardRotateTarget.set(0);
      cardRotateSpring.set(0);

      cardStateRef.current = 'hover';
      setCardState('hover');
    }
  }

  const handleDotLeave = () => {
    if (cardStateRef.current === 'hover') {
      cardStateRef.current = 'hidden';
      setCardState('hidden');
    }
  }

  const handleDotClick = (e) => {
    e.stopPropagation() // Prevent global dismiss
    if (cardStateRef.current === 'hover' || cardStateRef.current === 'hidden') {
      cardStateRef.current = 'thrown';
      setCardState('thrown');
      cardTargetX.set(window.innerWidth / 2);
      cardTargetY.set(window.innerHeight / 2);
      cardRotateTarget.set(0); // straighten out when thrown
      if (isMobile) {
        requestGyroPermission();
      }
    } else if (cardStateRef.current === 'thrown') {
      returnCardToDot();
    }
  }

  /* ── Cycle indices ── */
  const [projectIdx, setProjectIdx] = useState(0)
  const [animationIdx, setAnimationIdx] = useState(0)
  const [graphicIdx, setGraphicIdx] = useState(0)
  const [photoIdx, setPhotoIdx] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return MOBILE_DEFAULT_PHOTO_INDEX >= 0 ? MOBILE_DEFAULT_PHOTO_INDEX : 0
    }
    return DESKTOP_DEFAULT_PHOTO_INDEX >= 0 ? DESKTOP_DEFAULT_PHOTO_INDEX : 0
  })
  const [wordIdx, setWordIdx] = useState(0)

  /* ──────────────────────────────────────────────
     DialKit controls
     ────────────────────────────────────────────── */
  const [windowSize, setWindowSize] = useState({ w: 1440, h: 1020 });

  useEffect(() => {
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.w < 768;

  const layoutControls = DIALKIT_LAYOUT_DEFAULTS;
  const mobileControls = MOBILE_LAYOUT_DEFAULTS;

  const CARDS_LAYOUT = {
    projects: { name: 'projects', w: 420, h: 420, x: 190, y: 50 },
    animations: { name: 'animations', w: 340, h: 340, x: 590, y: 190 },
    graphics: { name: 'graphics', w: 350, h: 350, x: 310, y: 500 },
    photos: { name: 'photos', w: 390, h: 390, x: 910, y: 380 },
    words: { name: 'words', w: 350, h: 190, x: 920, y: 100 },
    info: { name: 'info', w: 390, h: 230, x: 710, y: 650 },
    vision: { name: 'vision', w: 290, h: 160, x: 95, y: 420 },
  }

  const layout = { ...layoutControls, ...CARDS_LAYOUT }

  /* ──────────────────────────────────────────────
     Viewport scaling
     ────────────────────────────────────────────── */
  const scaleCanvas = useCallback(() => {
    const el = canvasRef.current
    if (!el) return
    const vw = window.innerWidth
    const vh = window.innerHeight
    if (vw < 768) {
      // Mobile: no transform scaling, let CSS flex handle it
      el.style.transform = 'none'
      el.style.left = '0'
      el.style.top = '0'
      return
    }
    const scale = Math.min(vw / layout.canvasW, vh / layout.canvasH)
    const scaledW = layout.canvasW * scale
    const scaledH = layout.canvasH * scale
    el.style.transform = `scale(${scale})`
    el.style.left = `${(vw - scaledW) / 2}px`
    el.style.top = `${(vh - scaledH) / 2}px`
  }, [layout.canvasW, layout.canvasH])

  useEffect(() => {
    scaleCanvas()
    window.addEventListener('resize', scaleCanvas)
    return () => window.removeEventListener('resize', scaleCanvas)
  }, [scaleCanvas])

  useEffect(() => {
    let currentLinkHovered = false;
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
      const isLink = !!e.target.closest('a, button');
      if (isLink !== currentLinkHovered) {
        currentLinkHovered = isLink;
        setIsLinkHovered(isLink);
      }

      // Update tracking for the 3D interaction card
      rawMouseX.set(e.clientX)
      rawMouseY.set(e.clientY)

      // If we're hovering the dot, the card peeks out toward the cursor
      if (cardStateRef.current === 'hover') {
        const diffX = e.clientX - dotCenterLoc.current.x;
        const diffY = e.clientY - dotCenterLoc.current.y;

        // Card peeks out in cursor's direction — anchored at dot center
        cardTargetX.set(dotCenterLoc.current.x + diffX * 0.4);
        cardTargetY.set(dotCenterLoc.current.y + diffY * 0.4);

        // Rotate based on horizontal cursor offset
        cardRotateTarget.set(diffX * 1.2);
      } else if (cardStateRef.current === 'hidden') {
        // Keep springs parked at dot center so card never spawns far away
        cardTargetX.set(dotCenterLoc.current.x);
        cardTargetY.set(dotCenterLoc.current.y);
        cardRotateTarget.set(0);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [rawMouseX, rawMouseY, cardTargetX, cardTargetY, cardRotateTarget]);

  /* ──────────────────────────────────────────────
     Card pairings
     Projects → text on Animations card
     Animations → text on Photos card
     Graphics → text on Info card
     ────────────────────────────────────────────── */
  const pairings = {
    projects: 'vision',
    animations: 'words',
    graphics: 'info',
  }
  const pairedTarget = hoveredCard ? pairings[hoveredCard] : null
  const effectivePairedTarget = isMobile ? null : pairedTarget

  /* helper: is a card grayed out? */
  const isGrayed = (cardName) => {
    if (!hoveredCard) return false
    if (hoveredCard === 'info' || hoveredCard === 'vision') return false   // these hovers don't gray others
    return cardName !== hoveredCard && cardName !== effectivePairedTarget
  }

  const changingMechanismCards = ['projects', 'animations', 'graphics', 'photos', 'words'];
  const showCustomCursor = !isMobile && hoveredCard && changingMechanismCards.includes(hoveredCard) && !isLinkHovered;

  const isCurrentCardDark = () => {
    switch (hoveredCard) {
      case 'projects': return PROJECTS_IMAGES[projectIdx].dark;
      case 'graphics': return GRAPHICS_IMAGES[graphicIdx].dark;
      case 'photos': return PHOTOS_IMAGES[photoIdx].dark;
      case 'animations': return ANIMATIONS_VIDEOS[animationIdx].dark;
      case 'words': return false; // Words is a white card
      default: return false;
    }
  }

  const getHoveredCardProgress = () => {
    if (!hoveredCard) return { current: 0, total: 1 };
    switch (hoveredCard) {
      case 'projects':
        return { current: projectIdx, total: PROJECTS_IMAGES.length };
      case 'animations':
        return { current: animationIdx, total: ANIMATIONS_VIDEOS.length };
      case 'graphics':
        return { current: graphicIdx, total: GRAPHICS_IMAGES.length };
      case 'photos':
        return { current: photoIdx, total: PHOTOS_IMAGES.length };
      case 'words':
        return { current: wordIdx, total: WORDS_ARTICLES.length };
      default:
        return { current: 0, total: 1 };
    }
  };

  /* helper: inline style for a positioned card */
  const cardStyle = (cardName, lp) => {
    const overrideCursor = changingMechanismCards.includes(cardName) && !isLinkHovered;
    return {
      position: 'absolute',
      width: lp.w,
      height: lp.h,
      left: lp.x,
      top: lp.y,
      zIndex: (hoveredCard === cardName || pairedTarget === cardName) ? 200 : (cardName === 'vision' ? 101 : 1),
      filter: isGrayed(cardName) ? 'grayscale(100%)' : 'none',
      transition: 'filter 0.35s ease, transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
      cursor: overrideCursor ? 'none' : 'auto',
    };
  }

  const handleEnter = (name) => {
    setHoveredCard(name)
  }
  const handleLeave = () => setHoveredCard(null)

  /* ── Click‑to‑cycle ── */
  const handleProjectClick = () => setProjectIdx((i) => (i + 1) % PROJECTS_IMAGES.length)
  const handleAnimationClick = () => setAnimationIdx((i) => (i + 1) % ANIMATIONS_VIDEOS.length)
  const handleGraphicClick = () => setGraphicIdx((i) => (i + 1) % GRAPHICS_IMAGES.length)
  const handlePhotoClick = () => setPhotoIdx((i) => (i + 1) % PHOTOS_IMAGES.length)

  /* ── Current companion text (shown on the paired card) ── */
  const companionText = () => {
    if (hoveredCard === 'projects') return PROJECTS_IMAGES[projectIdx]
    if (hoveredCard === 'animations') return ANIMATIONS_VIDEOS[animationIdx]
    if (hoveredCard === 'graphics') return GRAPHICS_IMAGES[graphicIdx]
    return null
  }
  const companion = companionText()

  const mobileUniformWidth = Math.min(
    mobileControls.cardMaxWidth,
    Math.max(
      mobileControls.cardMinWidth,
      windowSize.w - (mobileControls.dotInset * 2) - (mobileControls.cardInset * 2)
    )
  )

  const mobileSlotStyle = (lp) => {
    const targetW = (isMobile && useNewMobileLayout)
      ? (STAGGERED_MOBILE_LAYOUT[lp.name]?.w || mobileUniformWidth)
      : mobileUniformWidth;
    const scale = targetW / lp.w;

    return {
      position: 'relative',
      width: targetW,
      height: lp.h * scale,
      flex: '0 0 auto',
      zIndex: activeMobileCard === lp.name ? 500 : (lp.name === 'vision' ? 101 : 1),
      marginTop: isMobile && useNewMobileLayout ? (STAGGERED_MOBILE_LAYOUT[lp.name]?.mt || 0) : 0,
      transform: isMobile && useNewMobileLayout ? `translateX(${STAGGERED_MOBILE_LAYOUT[lp.name]?.x || 0}px)` : 'none',
      transition: 'z-index 0.01s step-start, transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    };
  };

  const mobileScaledCardStyle = (lp) => {
    const targetW = (isMobile && useNewMobileLayout)
      ? (STAGGERED_MOBILE_LAYOUT[lp.name]?.w || mobileUniformWidth)
      : mobileUniformWidth;

    return {
      position: 'absolute',
      left: 0,
      top: 0,
      width: lp.w,
      height: lp.h,
      transform: `scale(${targetW / lp.w})`,
      transformOrigin: 'top left',
      zIndex: 1,
      filter: 'none',
      cursor: 'auto',
      overflow: 'visible',
    }
  }

  const projectsCard = (style) => (
    <div
      className="frame-card frame-anchor-tl projects-card"
      style={{
        ...style,
        '--mobile-project-anchor-x': `${mobileControls.projectAnchorX}%`,
        '--mobile-project-anchor-y': `${mobileControls.projectAnchorY}%`,
      }}
      onMouseEnter={() => handleEnter('projects')}
      onMouseLeave={handleLeave}
      onClick={handleProjectClick}
    >
      <img
        src={PROJECTS_IMAGES[projectIdx].src}
        alt={PROJECTS_IMAGES[projectIdx].title}
      />
      <div className="card-label card-label--tl">Projects</div>
      <CardDots total={PROJECTS_IMAGES.length} current={projectIdx} positionClass="card-dots--tl" isDark={PROJECTS_IMAGES[projectIdx].dark} />
      <a
        href={PROJECTS_IMAGES[projectIdx].link || '#'}
        target={PROJECTS_IMAGES[projectIdx].link ? '_blank' : undefined}
        rel="noreferrer"
        className="view-project-btn"
        style={{
          top: isMobile ? 'auto' : layout.viewProjectBtn.top,
          bottom: isMobile ? mobileControls.projectBtnBottom : 'auto',
          right: isMobile ? 'auto' : layout.viewProjectBtn.right,
          left: isMobile ? mobileControls.projectBtnRight : 'auto',
          transform: isMobile ? `scale(${mobileControls.projectBtnScale})` : `scale(${layout.viewProjectBtn.scale})`,
          transformOrigin: isMobile ? 'bottom left' : 'center center',
          '--vp-fade': `${layout.viewProjectBtn.fadeSpeed}s`,
          visibility: PROJECTS_IMAGES[projectIdx].link ? 'visible' : 'hidden',
          opacity: isMobile ? 1 : undefined,
          pointerEvents: isMobile ? 'auto' : undefined,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="view-project-btn__text">
          View
          <svg className="view-project-btn__icon" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 16 16 12 12 8" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <br />Project
        </span>
      </a>
    </div>
  )

  const animationsCard = (style) => (
    <div
      className="frame-card frame-anchor-tl"
      style={style}
      onMouseEnter={() => handleEnter('animations')}
      onMouseLeave={handleLeave}
      onClick={handleAnimationClick}
    >
      <div className="frame-card-media-wrapper">
        <video
          src={ANIMATIONS_VIDEOS[animationIdx].src}
          autoPlay
          muted
          loop
          playsInline
        />
        {effectivePairedTarget === 'animations' && companion && (
          <div className="companion-text">
            <h3 className="companion-text__title">{companion.title}</h3>
            <hr className="card-article__divider" />
            <p className="companion-text__desc">{companion.desc}</p>
          </div>
        )}
      </div>
      <div className="card-label card-label--tl">Animations</div>
      <CardDots total={ANIMATIONS_VIDEOS.length} current={animationIdx} positionClass="card-dots--tl" isDark={ANIMATIONS_VIDEOS[animationIdx].dark} />
    </div>
  )

  const visionCard = (style) => (
    <div
      className={`card-article ${effectivePairedTarget === 'vision' ? 'card-article--text-mode' : ''}`}
      style={style}
      onMouseEnter={() => handleEnter('vision')}
      onMouseLeave={handleLeave}
    >
      {effectivePairedTarget === 'vision' && companion ? (
        <div className="companion-text companion-text--article">
          <h3 className="companion-text__title">{companion.title}</h3>
          <hr className="card-article__divider" />
          <p className="companion-text__desc">{companion.desc}</p>
        </div>
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/Face.svg"
            alt="Face"
            style={{
              width: layout.faceIcon.width,
              height: layout.faceIcon.height,
              transition: 'all 0.3s ease'
            }}
          />
        </div>
      )}
    </div>
  )

  const graphicsCard = (style) => (
    <div
      className="frame-card frame-anchor-tl"
      style={style}
      onMouseEnter={() => handleEnter('graphics')}
      onMouseLeave={handleLeave}
      onClick={handleGraphicClick}
    >
      <img
        src={GRAPHICS_IMAGES[graphicIdx].src}
        alt={GRAPHICS_IMAGES[graphicIdx].title}
      />
      <div className="card-label card-label--bl">Graphics</div>
      <CardDots total={GRAPHICS_IMAGES.length} current={graphicIdx} positionClass="card-dots--bl" isDark={GRAPHICS_IMAGES[graphicIdx].dark} />
    </div>
  )

  const photosCard = (style) => (
    <div
      className="frame-card frame-anchor-tr photos-card"
      style={style}
      onMouseEnter={() => handleEnter('photos')}
      onMouseLeave={handleLeave}
      onClick={handlePhotoClick}
    >
      <div className="frame-card-media-wrapper">
        <img
          src={PHOTOS_IMAGES[photoIdx].src}
          alt={PHOTOS_IMAGES[photoIdx].title}
        />
        {effectivePairedTarget === 'photos' && companion && (
          <div className="companion-text">
            <h3 className="companion-text__title">{companion.title}</h3>
            <hr className="card-article__divider" />
            <p className="companion-text__desc">{companion.desc}</p>
          </div>
        )}
      </div>
      <div className="card-label card-label--tr">Photos</div>
      <CardDots total={PHOTOS_IMAGES.length} current={photoIdx} positionClass="card-dots--tr" isDark={PHOTOS_IMAGES[photoIdx].dark} />
    </div>
  )

  const wordsCard = (style) => (
    <div
      className={`card-article ${effectivePairedTarget === 'words' ? 'card-article--text-mode' : ''}`}
      style={style}
      onMouseEnter={() => handleEnter('words')}
      onMouseLeave={handleLeave}
      onClick={() => setWordIdx((i) => (i + 1) % WORDS_ARTICLES.length)}
    >
      <div className="card-label card-label--tr">Words</div>
      <CardDots total={WORDS_ARTICLES.length} current={wordIdx} positionClass="card-dots--tr" isDark={false} />
      {effectivePairedTarget === 'words' && companion ? (
        <div className="companion-text companion-text--article">
          <h3 className="companion-text__title">{companion.title}</h3>
          <hr className="card-article__divider" />
          <p className="companion-text__desc">{companion.desc}</p>
        </div>
      ) : (
        <>
          <h2 className="card-article__title">{WORDS_ARTICLES[wordIdx].title}</h2>
          <hr className="card-article__divider" />
          <p className="card-article__desc">
            {WORDS_ARTICLES[wordIdx].desc}
          </p>
          <a
            className="card-article__link"
            href={WORDS_ARTICLES[wordIdx].link}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="card-article__link-text">Read it</span>
            <svg className="card-article__link-icon" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 16 16 12 12 8" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <span className="card-article__link-border" />
          </a>
        </>
      )}
    </div>
  )

  const infoCard = (style) => (
    <div
      className={`card-bio ${effectivePairedTarget === 'info' ? 'card-bio--text-mode' : ''}`}
      style={style}
      onMouseEnter={() => handleEnter('info')}
      onMouseLeave={handleLeave}
    >
      {effectivePairedTarget === 'info' && companion ? (
        <div className="companion-text companion-text--bio">
          <h3 className="companion-text__title">{companion.title}</h3>
          <hr className="card-article__divider" />
          <p className="companion-text__desc">{companion.desc}</p>
        </div>
      ) : (
        <>
          <p className="card-bio__text">
            Yugansh Agarwal is a designer,<br />
            working through and around the title,<br />
            all thanks to chronic curiosity.
          </p>
          <div className="card-bio__links">
            <a href="https://www.instagram.com/polymind_" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.x.com/Polymind_" target="_blank" rel="noreferrer">Twitter(X)</a>
            <a href="https://substack.com/@polymind45?r=5v0rm5&utm_campaign=profile&utm_medium=profile-page" target="_blank" rel="noreferrer">Substack</a>
            <a className="card-bio__email" href="mailto:yugansh.poly@gmail.com">yugansh.poly@gmail.com</a>
          </div>
        </>
      )}
    </div>
  )

  /* ──────────────────────────────────────────────
     Render
     ────────────────────────────────────────────── */
  return (
    <>
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          left: -100,
          top: -100,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 99999,
        }}
      >
        <AnimatePresence>
          {showCustomCursor && (
            <motion.svg
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.15 }}
              style={{
                width: 20,
                height: 20,
                display: 'block',
                overflow: 'visible'
              }}
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="translate(10, 10) scale(0.8)">
                <circle cx="50" cy="50" r="48" fill="black" stroke={isCurrentCardDark() ? "white" : "black"} strokeWidth="3" style={{ transition: 'stroke 0.2s' }} />
                <path
                  d="M85.3506 15.3555C89.7814 19.877 93.3076 25.2048 95.7314 31.0566C97.7124 35.8394 98.929 40.8958 99.3418 46.04C99.4288 47.1304 99.4806 48.2245 99.4951 49.3203C99.504 50.0163 99.5 50.7139 99.4805 51.4102L99.4551 52.1064C99.428 52.7255 99.3911 53.3434 99.3418 53.96C98.929 59.1038 97.7124 64.1606 95.7314 68.9434C93.3077 74.7944 89.781 80.1216 85.3506 84.6426L80.7539 80.0469C84.5813 76.1294 87.6295 71.518 89.7266 66.4551C91.3696 62.4886 92.4065 58.3057 92.8096 54.0469L92.8613 53.5H50.5V46.5H92.8613L92.8096 45.9531C92.4065 41.6938 91.3696 37.5114 89.7266 33.5449C87.6294 28.4819 84.5824 23.8691 80.7549 19.9512L85.3506 15.3555Z"
                  fill="white"
                  stroke={isCurrentCardDark() ? "white" : "black"}
                  strokeWidth="2"
                  style={{ transition: 'stroke 0.2s' }}
                />
              </g>
              <circle
                cx="50"
                cy="50"
                r="46"
                stroke="#ff1457"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="289.026"
                strokeDashoffset={289.026 - ((getHoveredCardProgress().current + 1) / getHoveredCardProgress().total) * 289.026}
                transform="rotate(-90 50 50)"
                style={{
                  transition: 'stroke-dashoffset 0.25s ease',
                }}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>
      <div
        className={`canvas-wrapper ${isMobile ? 'is-mobile' : ''}`}
        style={{
          '--label-speed': `${layout.labels.speed}s`,
          '--label-top': `${layout.labels.topOffset}px`,
          '--label-start': `${layout.labels.startSlide}px`,
          '--label-end': `${layout.labels.endSlide}px`,
          '--archive-right': `${layout.archiveBtn.right}px`,
          '--archive-bottom': `${layout.archiveBtn.bottom}px`,
          '--archive-size': `${layout.archiveBtn.size}px`,
          '--archive-stroke': `${layout.archiveBtn.stroke}px`,
          '--archive-d': `${layout.archiveBtn.duration}s`,
          '--ideology-left': `${layout.ideologyBtn.left}px`,
          '--ideology-bottom': `${layout.ideologyBtn.bottom}px`,
          '--ideology-size': `${layout.ideologyBtn.size}px`,
          '--ideology-stroke': `${layout.ideologyBtn.stroke}px`,
          '--ideology-d': `${layout.ideologyBtn.duration}s`,
        }}
      >
        <div
          ref={canvasRef}
          className="canvas"
          style={{
            width: isMobile ? '100%' : layout.canvasW,
            height: isMobile ? 'auto' : layout.canvasH,
            minHeight: isMobile ? '100vh' : undefined,
            position: 'relative',
          }}
        >
          {/* ──────────────────────────────────────────────
             Page Transitions
             ────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {view === 'home' && (
              <motion.div
                key="home"
                className="home-content"
                initial={{ opacity: 0, scale: isMobile ? 1 : layout.archiveTransition.scaleExit }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: isMobile ? 1 : layout.archiveTransition.scaleExit }}
                transition={{ duration: layout.archiveTransition.duration, ease: 'easeInOut' }}
                style={isMobile ? {
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: `${mobileControls.paddingTop}px ${mobileControls.paddingX}px ${mobileControls.paddingBottom}px`,
                  pointerEvents: 'auto',
                } : {
                  position: 'absolute',
                  top: layout.contentYOffset,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'auto',
                }}
              >
                {/* ═══════════════════ Hover connecting line ═══════════════════ */}
                <AnimatePresence>
                  {!isMobile && hoveredCard && pairedTarget && (
                    <motion.svg
                      key="connecting-line"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 150,
                        overflow: 'visible'
                      }}
                    >
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        exit={{ pathLength: 0, opacity: 0, transition: { duration: 0.1 } }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        d={(function () {
                          const lp = layout.lineProjects;
                          const la = layout.lineAnimations;
                          const lg = layout.lineGraphics;

                          const CONNECTING_PATHS = {
                            projects: `M ${lp.sx} ${lp.sy} Q ${lp.cx} ${lp.cy} ${lp.ex} ${lp.ey}`,
                            animations: `M ${la.sx} ${la.sy} Q ${la.cx} ${la.cy} ${la.ex} ${la.ey}`,
                            graphics: `M ${lg.sx} ${lg.sy} Q ${lg.cx} ${lg.cy} ${lg.ex} ${lg.ey}`,
                          }
                          return CONNECTING_PATHS[hoveredCard] || ''
                        })()}
                        stroke="black"
                        strokeWidth={1.5}
                        fill="none"
                        strokeLinecap="round"
                      />
                    </motion.svg>
                  )}
                </AnimatePresence>

                {isMobile ? (
                  useNewMobileLayout ? (
                    /* ─── NEW STAGGERED LAYOUT ─── */
                    <>
                      <div className="mobile-card-slot"
                        style={{ ...mobileSlotStyle(layout.projects), overflow: 'visible' }}
                        onClickCapture={() => setActiveMobileCard('projects')}
                      >
                        {projectsCard(mobileScaledCardStyle(layout.projects))}
                        {PROJECTS_IMAGES[projectIdx]?.link && (
                          <a
                            href={PROJECTS_IMAGES[projectIdx].link}
                            target="_blank"
                            rel="noreferrer"
                            className="mobile-view-project-btn"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="mobile-view-project-btn__text">
                              View
                              <svg className="mobile-view-project-btn__icon" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 16 16 12 12 8" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                              </svg>
                              <br />Project
                            </span>
                          </a>
                        )}
                      </div>

                      <div className="mobile-card-slot"
                        style={{ ...mobileSlotStyle(layout.words), overflow: 'visible' }}
                        onClickCapture={() => setActiveMobileCard('words')}
                      >
                        {wordsCard(mobileScaledCardStyle(layout.words))}
                      </div>

                      <div className="mobile-card-slot"
                        style={{ ...mobileSlotStyle(layout.graphics), overflow: 'visible' }}
                        onClickCapture={() => setActiveMobileCard('graphics')}
                      >
                        {graphicsCard(mobileScaledCardStyle(layout.graphics))}
                      </div>

                      <div className="mobile-card-slot"
                        style={{ ...mobileSlotStyle(layout.animations), overflow: 'visible' }}
                        onClickCapture={() => setActiveMobileCard('animations')}
                      >
                        {animationsCard(mobileScaledCardStyle(layout.animations))}
                      </div>

                      <div className="mobile-card-slot"
                        style={{ ...mobileSlotStyle(layout.vision), overflow: 'visible' }}
                        onClickCapture={() => setActiveMobileCard('vision')}
                      >
                        {visionCard(mobileScaledCardStyle(layout.vision))}
                      </div>

                      <div className="mobile-card-slot"
                        style={{ ...mobileSlotStyle(layout.photos), overflow: 'visible' }}
                        onClickCapture={() => setActiveMobileCard('photos')}
                      >
                        {photosCard(mobileScaledCardStyle(layout.photos))}
                      </div>

                      <div className="mobile-card-slot"
                        style={{ ...mobileSlotStyle(layout.info), overflow: 'visible' }}
                        onClickCapture={() => setActiveMobileCard('info')}
                      >
                        {infoCard(mobileScaledCardStyle(layout.info))}
                      </div>
                    </>
                  ) : (
                    /* ─── LEGACY STACK LAYOUT ─── */
                    <>
                      <div className="mobile-card-slot" style={{ ...mobileSlotStyle(layout.projects), overflow: 'visible' }}>
                        {projectsCard(mobileScaledCardStyle(layout.projects))}
                        {PROJECTS_IMAGES[projectIdx].link && (
                          <a
                            href={PROJECTS_IMAGES[projectIdx].link}
                            target="_blank"
                            rel="noreferrer"
                            className="mobile-view-project-btn"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="mobile-view-project-btn__text">
                              View
                              <svg className="mobile-view-project-btn__icon" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 16 16 12 12 8" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                              </svg>
                              <br />Project
                            </span>
                          </a>
                        )}
                      </div>
                      <div className="mobile-card-slot" style={mobileSlotStyle(layout.info)}>
                        {infoCard(mobileScaledCardStyle(layout.info))}
                      </div>
                      <div className="mobile-card-slot" style={mobileSlotStyle(layout.graphics)}>
                        {graphicsCard(mobileScaledCardStyle(layout.graphics))}
                      </div>
                      <div className="mobile-card-slot" style={mobileSlotStyle(layout.animations)}>
                        {animationsCard(mobileScaledCardStyle(layout.animations))}
                      </div>
                      <div className="mobile-card-slot" style={mobileSlotStyle(layout.vision)}>
                        {visionCard(mobileScaledCardStyle(layout.vision))}
                      </div>
                      <div className="mobile-card-slot" style={mobileSlotStyle(layout.photos)}>
                        {photosCard(mobileScaledCardStyle(layout.photos))}
                      </div>
                      <div className="mobile-card-slot" style={mobileSlotStyle(layout.words)}>
                        {wordsCard(mobileScaledCardStyle(layout.words))}
                      </div>
                    </>
                  )
                ) : (
                  <>
                    {projectsCard(cardStyle('projects', layout.projects))}
                    {animationsCard(cardStyle('animations', layout.animations))}
                    {visionCard(cardStyle('vision', layout.vision))}
                    {graphicsCard(cardStyle('graphics', layout.graphics))}
                    {photosCard(cardStyle('photos', layout.photos))}
                    {wordsCard(cardStyle('words', layout.words))}
                    {infoCard(cardStyle('info', layout.info))}
                  </>
                )}

              </motion.div>
            )}
            {view === 'archive' && (
              <ArchiveView
                key="archive"
                view={view}
                layout={layout}
                isMobile={isMobile}
                onClose={() => navigateTo('home')}
              />
            )}
            {view === 'ideology' && <IdeologyView key="ideology" layout={layout} isMobile={isMobile} />}
          </AnimatePresence>
        </div> {/* END .canvas */}

        {/* ── Fixed Viewport Elements (Corner dots, buttons) ── */}
        {/* Rendered outside the scaled .canvas so they pin to the viewport */}
        {isMobile ? (
          <>
            <button
              className="ideology-button mobile-side-button mobile-side-button--left"
              onClick={() => navigateTo(view === 'ideology' ? 'home' : 'ideology')}
              style={{
                '--mobile-side-label-inset': `${mobileControls.sideLabelInset}px`,
                '--mobile-side-label-bottom': `${mobileControls.sideLabelBottom}px`,
                '--mobile-side-label-size': `${mobileControls.sideLabelSize}px`,
                color: view === 'ideology' ? '#27AA20' : 'transparent',
                WebkitTextStroke: `${layout.ideologyBtn.stroke}px ${view === 'ideology' ? 'white' : '#27AA20'}`,
                transition: `all ${layout.ideologyBtn.duration}s ease`,
              }}
            >
              IDEOLOGY
            </button>
            <button
              className="archive-button mobile-side-button mobile-side-button--right"
              onClick={() => navigateTo(view === 'archive' ? 'home' : 'archive')}
              style={{
                '--mobile-side-label-inset': `${mobileControls.sideLabelInset}px`,
                '--mobile-side-label-bottom': `${mobileControls.sideLabelBottom}px`,
                '--mobile-side-label-size': `${mobileControls.sideLabelSize}px`,
                color: view === 'archive' ? '#27AA20' : 'transparent',
                WebkitTextStroke: `${layout.archiveBtn.stroke}px ${view === 'archive' ? 'white' : '#27AA20'}`,
                transition: `all ${layout.archiveBtn.duration}s ease`,
              }}
            >
              ARCHIVE
            </button>
          </>
        ) : (
          <>
            {/* ── Ideology Button ── */}
            <button
              className="ideology-button"
              onClick={() => navigateTo(view === 'ideology' ? 'home' : 'ideology')}
              style={{
                color: view === 'ideology' ? '#27AA20' : 'transparent',
                WebkitTextStroke: `${layout.ideologyBtn.stroke}px ${view === 'ideology' ? 'white' : '#27AA20'}`,
                transition: `all ${layout.ideologyBtn.duration}s ease`,
              }}
            >
              IDEOLOGY
            </button>

            {/* ── Archive Button ── */}
            <button
              className="archive-button"
              onClick={() => navigateTo(view === 'archive' ? 'home' : 'archive')}
              style={{
                // Style overriden specifically for the active state
                color: view === 'archive' ? '#27AA20' : 'transparent',
                WebkitTextStroke: `${layout.archiveBtn.stroke}px ${view === 'archive' ? 'white' : '#27AA20'}`,
                transition: `all ${layout.archiveBtn.duration}s ease`,
              }}
            >
              ARCHIVE
            </button>
          </>
        )}

        {/* ── Green corner dots ── */}
        <div
          className="corner-dot corner-dot--tl"
          onMouseEnter={handleDotEnter}
          onMouseLeave={handleDotLeave}
          onClick={handleDotClick}
          style={isMobile ? {
            position: 'fixed', cursor: 'pointer', zIndex: 1101,
            width: mobileControls.dotSize, height: mobileControls.dotSize,
            left: mobileControls.dotInset, top: mobileControls.dotInset,
          } : { cursor: 'pointer', zIndex: 1101 }}
        />
        <div className="corner-dot corner-dot--tr"
          style={isMobile ? {
            position: 'fixed',
            width: mobileControls.dotSize, height: mobileControls.dotSize,
            right: mobileControls.dotInset, top: mobileControls.dotInset,
            left: 'auto',
          } : undefined}
        />
        <div className="corner-dot corner-dot--bl"
          style={isMobile ? {
            position: 'fixed',
            width: mobileControls.dotSize, height: mobileControls.dotSize,
            left: mobileControls.dotInset, bottom: mobileControls.dotInset,
            top: 'auto',
          } : undefined}
        />
        <div className="corner-dot corner-dot--br"
          style={isMobile ? {
            position: 'fixed',
            width: mobileControls.dotSize, height: mobileControls.dotSize,
            right: mobileControls.dotInset, bottom: mobileControls.dotInset,
            left: 'auto', top: 'auto',
          } : undefined}
        />

        {/* ── Eye icon — Frame 5.svg ── */}
        <div className="eye-icon" style={{ display: 'none' }}>
          <img src="/eye-icon.svg" alt="Universal state" />
        </div>

        {/* Card is rendered via portal below — outside the scaled .canvas */}
      </div>
      {/* ── Interactive floating 3D Card (Portal) ── */}
      {/* Rendered outside .canvas via portal so position:fixed works against viewport, not the scaled canvas */}
      {createPortal(
        <motion.div
          className={`interactive-card-wrapper ${cardState === 'thrown' ? 'is-thrown' : ''}`}
          animate={{
            opacity: (cardState === 'hidden') ? 0 : (cardState === 'returning' ? 0 : 1),
            scale: (cardState === 'hidden' || cardState === 'returning')
              ? 0.15
              : (cardState === 'thrown' ? 1.0 : layoutControls.interactiveCard.hoverScale),
            x: '-50%',
            y: '-50%'
          }}
          transition={{
            type: 'spring',
            stiffness: cardState === 'thrown' ? 200 : (cardState === 'returning' ? 300 : 600),
            damping: cardState === 'thrown' ? 22 : (cardState === 'returning' ? 28 : 40),
          }}
          style={{
            left: cardSpringX,
            top: cardSpringY,
            rotate: cardRotateSpring,
            zIndex: cardState === 'thrown' ? 1200 : 1100,
            pointerEvents: cardState === 'thrown' ? 'auto' : 'none',
            '--shadow1-oy': `${layoutControls.interactiveCard['shadow1.offsetY']}px`,
            '--shadow1-blur': `${layoutControls.interactiveCard['shadow1.blur']}px`,
            '--shadow1-opacity': layoutControls.interactiveCard['shadow1.opacity'],
            '--shadow2-blur': `${layoutControls.interactiveCard['shadow2.blur']}px`,
            '--shadow2-opacity': layoutControls.interactiveCard['shadow2.opacity'],
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (cardState === 'thrown') {
              setIsCardFlipped(!isCardFlipped);
            }
          }}
        >
          <motion.div
            className="interactive-card-parallax-layer"
            style={{
              rotateX: cardState === 'thrown' ? (isMobile ? springGyroX : springTiltX) : 0,
              rotateY: cardState === 'thrown' ? (isMobile ? springGyroY : springTiltY) : 0,
            }}
          >
            <div className={`interactive-card-inner ${isCardFlipped ? 'is-flipped' : ''}`}>
              <img src="/Card front.png" className="interactive-card-face interactive-card-front" alt="Card front" />
              <img src="/Card back.png" className="interactive-card-face interactive-card-back" alt="Card back" />
              {/* Light reflection shine overlay — follows mouse position */}
              <motion.div
                className="interactive-card-shine"
                style={{
                  background: cardState === 'thrown' ? shineBackground : 'transparent',
                }}
              />
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}
      {/* Green dot overlay — sits on top of the card during hover so card peeks from behind */}
      {(cardState === 'hover') && createPortal(
        <div
          style={{
            position: 'fixed',
            left: dotRectRef.current.left,
            top: dotRectRef.current.top,
            width: dotRectRef.current.width,
            height: dotRectRef.current.height,
            borderRadius: '50%',
            background: '#27AA20',
            zIndex: 1150,
            pointerEvents: 'none',
          }}
        />,
        document.body
      )}
      {/* Agentation removed for production */}
      <Analytics />
    </>
  )
}
