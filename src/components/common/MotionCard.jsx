import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.32, 0.72, 0, 1];

/**
 * Reusable motion wrapper: fades + slides up on scroll into view,
 * scales down slightly on tap (only when clickable).
 * Respects prefers-reduced-motion.
 */
export default function MotionCard({ children, className, onClick, ...props }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      onClick={onClick}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.18, ease: EASE }}
      whileTap={reduced || !onClick ? undefined : { scale: 0.97 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}