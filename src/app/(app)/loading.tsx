"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";

export default function AppLoading() {
  return (
    <Container className="py-8 min-w-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-8 min-w-0"
      >
        {/* Header Skeleton */}
        <div className="space-y-4">
          <div className="h-10 w-1/3 bg-brand-surface-elevated animate-pulse rounded-md"></div>
          <div className="h-6 w-2/3 bg-brand-surface-elevated animate-pulse rounded-md"></div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-brand-surface-elevated animate-pulse rounded-xl"
            ></div>
          ))}
        </div>

        {/* List Skeleton */}
        <div className="space-y-4 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 bg-brand-surface-elevated animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      </motion.div>
    </Container>
  );
}
