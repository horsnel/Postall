/**
 * Accessibility Utilities for PostAll
 * Screen reader announcements, focus management, and keyboard navigation helpers.
 */

/**
 * Announces a message to screen readers via a visually hidden live region.
 * Creates a temporary element, speaks the message, then removes it.
 */
export function announceToScreenReader(message: string): void {
  if (typeof document === 'undefined') return;

  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.setAttribute('aria-atomic', 'true');
  el.className = 'sr-only';
  el.textContent = message;

  document.body.appendChild(el);

  // Allow the screen reader to pick up the change, then clean up
  setTimeout(() => {
    document.body.removeChild(el);
  }, 1000);
}

/**
 * Returns all focusable elements within a container.
 * Used for focus trapping in modals and dialogs.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ];

  const elements = Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelectors.join(','))
  );

  // Filter out hidden elements
  return elements.filter((el) => {
    const style = window.getComputedStyle(el);
    if (style.display === 'none') return false;
    if (style.visibility === 'hidden') return false;
    if (el.getAttribute('aria-hidden') === 'true') return false;
    return true;
  });
}

/**
 * Traps keyboard focus within an element (for modals, dialogs, dropdowns).
 * Returns a cleanup function that restores focus to the previously focused element.
 */
export function trapFocus(element: HTMLElement): () => void {
  const previouslyFocused = document.activeElement as HTMLElement | null;
  const focusableElements = getFocusableElements(element);

  if (focusableElements.length === 0) {
    return () => previouslyFocused?.focus();
  }

  // Focus the first focusable element
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  firstElement.focus();

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    // If shift+tab on first element, wrap to last
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
      return;
    }

    // If tab on last element, wrap to first
    if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
      return;
    }
  }

  element.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
    previouslyFocused?.focus();
  };
}
