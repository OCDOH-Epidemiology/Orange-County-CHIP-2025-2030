/**
 * Lightweight PostHog helper. The official snippet in index.html inits
 * the client; this only captures when it is present (never on localhost).
 * Do not pass personal data or free-text input.
 */
export function track(event, properties) {
  try {
    if (typeof window !== "undefined" && window.posthog && typeof window.posthog.capture === "function") {
      window.posthog.capture(event, properties);
    }
  } catch (err) {
    // ignore analytics errors
  }
}
