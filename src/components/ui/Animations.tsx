'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

/**
 * GoalCelebration
 * Triggers a burst of confetti when the `trigger` prop changes to true.
 * Ideal for when a user completes a goal or milestone.
 */
export function GoalCelebration({ 
  trigger, 
  duration = 3000 
}: { 
  trigger: boolean; 
  duration?: number;
}) {
  useEffect(() => {
    if (trigger) {
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#387ED1', '#2D7A4F', '#FFB020', '#E5484D', '#8A2BE2']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#387ED1', '#2D7A4F', '#FFB020', '#E5484D', '#8A2BE2']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [trigger, duration]);

  return null; // This component doesn't render any DOM elements
}

/**
 * FloatingXP
 * A floating +XP animation that spawns in the center of the screen 
 * (or relative to a container if properly styled) and floats up before disappearing.
 */
export function FloatingXP({ 
  amount, 
  trigger, 
  onComplete 
}: { 
  amount: number; 
  trigger: boolean; 
  onComplete?: () => void;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        if (onComplete) onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{ opacity: 1, y: -50, scale: 1.2 }}
          exit={{ opacity: 0, y: -80, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="pointer-events-none fixed z-[100] flex items-center justify-center font-bold text-brand-warning drop-shadow-md text-2xl"
          style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
        >
          +{amount} XP
        </motion.div>
      )}
    </AnimatePresence>
  );
}
