/**
 * Security Monitoring Module
 * 
 * Provides hooks/functions to track suspicious patterns across the platform,
 * such as excessive requests, rapid XP gains, or potential manipulation.
 */

import { logAdminAction } from './audit-log'; // Reusing audit logger for critical alerts

// Simple in-memory tracker for suspicious activities
interface UserActivity {
  xpGainedRecent: number;
  lastXpAwardTime: number;
  rapidRequestsCount: number;
  lastRequestTime: number;
}

const activityMonitor = new Map<string, UserActivity>();

/**
 * Tracks request patterns and returns true if excessive requests are detected.
 * Often used in conjunction with standard rate limiting to identify malicious actors.
 * 
 * @param userId - The user ID to check
 * @returns boolean indicating if the pattern is suspicious
 */
export function detectExcessiveRequests(userId: string): boolean {
  const now = Date.now();
  let activity = activityMonitor.get(userId);

  if (!activity) {
    activity = {
      xpGainedRecent: 0,
      lastXpAwardTime: 0,
      rapidRequestsCount: 1,
      lastRequestTime: now,
    };
    activityMonitor.set(userId, activity);
    return false;
  }

  // If requests are within 50ms of each other, count as rapid
  if (now - activity.lastRequestTime < 50) {
    activity.rapidRequestsCount += 1;
  } else {
    // Reset rapid count if gap is larger than 1 second
    if (now - activity.lastRequestTime > 1000) {
      activity.rapidRequestsCount = Math.max(0, activity.rapidRequestsCount - 1);
    }
  }

  activity.lastRequestTime = now;

  // Threshold for excessive requests
  if (activity.rapidRequestsCount > 20) {
    console.warn(`[SECURITY MONITOR] Excessive requests detected for user ${userId}`);
    return true;
  }

  return false;
}

/**
 * Detects potential manipulation of the XP system.
 * e.g., gaining an abnormally large amount of XP in a short time frame.
 * 
 * @param userId - The user ID to check
 * @param xpAmount - The amount of XP just awarded
 * @returns boolean indicating if the manipulation is suspected
 */
export function detectManipulation(userId: string, xpAmount: number): boolean {
  const now = Date.now();
  let activity = activityMonitor.get(userId);

  if (!activity) {
    activityMonitor.set(userId, {
      xpGainedRecent: xpAmount,
      lastXpAwardTime: now,
      rapidRequestsCount: 0,
      lastRequestTime: now,
    });
    return false;
  }

  // Reset XP gained tracker if more than 5 minutes have passed
  if (now - activity.lastXpAwardTime > 5 * 60 * 1000) {
    activity.xpGainedRecent = xpAmount;
  } else {
    activity.xpGainedRecent += xpAmount;
  }
  
  activity.lastXpAwardTime = now;

  // If user gains more than 1000 XP in a 5-minute window, flag as suspicious
  if (activity.xpGainedRecent > 1000) {
    console.warn(`[SECURITY MONITOR] Manipulation detected! User ${userId} gained ${activity.xpGainedRecent} XP rapidly.`);
    
    // Log as a critical system action
    logAdminAction('SYSTEM', 'DETECT_MANIPULATION', userId, {
      xpGained: activity.xpGainedRecent,
      timeWindowMinutes: 5
    });
    
    return true;
  }

  return false;
}
