/**
 * Analytics utilities for Plausible tracking.
 *
 * For React components, use the usePlausible hook from next-plausible.
 * For non-React contexts, use the trackEvent function below.
 */

type EventOptions = {
  /** Custom properties to attach to the event */
  props?: Record<string, string | number | boolean>;
  /** Revenue tracking for e-commerce */
  revenue?: { currency: string; amount: number };
  /** Override the default URL */
  url?: string;
};

/**
 * Track a custom event in Plausible.
 * Use this in non-React contexts (API routes, event handlers, etc.)
 *
 * @example
 * ```ts
 * // Simple event
 * trackEvent('signup');
 *
 * // Event with properties
 * trackEvent('purchase', {
 *   props: { product: 'Pro Plan', method: 'credit_card' },
 *   revenue: { currency: 'USD', amount: 29.99 }
 * });
 * ```
 */
export function trackEvent(eventName: string, options?: EventOptions): void {
  if (typeof window === 'undefined') return;

  const plausible = (window as Window & { plausible?: PlausibleFunction }).plausible;
  if (!plausible) return;

  plausible(eventName, options);
}

type PlausibleFunction = (eventName: string, options?: EventOptions) => void;

// Re-export the hook for convenience
export { usePlausible } from 'next-plausible';
