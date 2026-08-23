const EASE = [0.32, 0.72, 0, 1];

// Subtle spring for the nav active pill layout animation
export const springPill = { type: "spring", stiffness: 400, damping: 32 };

// Fade + slide-up for scroll-triggered card entrance
export const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.18, ease: EASE },
};

// Sheet content fade-in (layers on top of Radix slide)
export const sheetFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.15 },
};