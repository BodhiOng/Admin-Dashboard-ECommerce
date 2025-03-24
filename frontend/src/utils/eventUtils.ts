/**
 * Utility functions for custom events
 */

// Event name constants
export const PROFILE_UPDATED_EVENT = 'profile-updated';

/**
 * Dispatches an event to notify that the user profile has been updated
 * This can be used to trigger UI updates across components
 */
export function notifyProfileUpdated(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
  }
}
