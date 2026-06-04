'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { FinancialTopic } from '@/services/topicsDB';

interface TopicChipProps {
  topic: FinancialTopic;
  selected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: (topic: FinancialTopic) => void;
  showCount?: boolean;
  index?: number; // for stagger animation
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-3 text-base gap-2.5',
};

const emojiSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function TopicChip({
  topic,
  selected = false,
  size = 'md',
  onClick,
  showCount = true,
  index = 0,
}: TopicChipProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.04,
        duration: 0.3,
        ease: [0.23, 1, 0.32, 1],
      }}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick?.(topic)}
      className={cn(
        'relative inline-flex items-center rounded-2xl border font-semibold',
        'transition-all duration-200 cursor-pointer select-none',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        // shadow glow on hover
        'hover:shadow-lg',
        sizeClasses[size],
        selected
          ? `${topic.color} ${topic.textColor} border-current ring-2 ring-current shadow-md`
          : `${topic.color} ${topic.textColor} border-transparent hover:border-current/30`,
      )}
    >
      <span className={emojiSizeClasses[size]}>{topic.emoji}</span>
      <span className="leading-none">{topic.label}</span>

      {showCount && (
        <span
          className={cn(
            'ml-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold leading-none',
            selected
              ? 'bg-white/50 text-current'
              : 'bg-white/70 text-current/70',
          )}
        >
          {topic.trending
            ? '🔥 Trending'
            : topic.learnerCount >= 1000
              ? `${(topic.learnerCount / 1000).toFixed(1)}k`
              : topic.learnerCount}
        </span>
      )}
    </motion.button>
  );
}
