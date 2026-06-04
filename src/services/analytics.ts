// src/services/analytics.ts

export const trackEvent = (eventName: string, data?: Record<string, any>) => {
  // In a real application, this would send data to Mixpanel, Amplitude, etc.
  console.log(`[Analytics Track] ${eventName}`, data || {});
};
