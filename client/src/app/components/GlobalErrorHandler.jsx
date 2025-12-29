'use client';

import { useEffect } from 'react';

export default function GlobalErrorHandler({ children }) {
  useEffect(() => {
    // Override console.error to suppress specific extension errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const errorMessage = args.join(' ');
      // Suppress known browser extension and favicon errors
      if (
        errorMessage.includes('share-modal') ||
        errorMessage.includes('favicon.ico') ||
        errorMessage.includes('Failed to load resource') ||
        errorMessage.includes('addEventListener') && errorMessage.includes('null')
      ) {
        return; // Suppress these errors
      }
      originalConsoleError.apply(console, args);
    };

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      const errorMessage = event.reason?.toString() || '';
      if (
        errorMessage.includes('share-modal') ||
        errorMessage.includes('favicon') ||
        errorMessage.includes('play()') ||
        errorMessage.includes('addEventListener')
      ) {
        event.preventDefault();
        return;
      }
      console.error('Unhandled promise rejection:', event.reason);
    };

    // Handle uncaught errors
    const handleError = (event) => {
      const errorMessage = event.error?.message || event.message || '';
      if (
        errorMessage.includes('share-modal') ||
        errorMessage.includes('favicon') ||
        errorMessage.includes('addEventListener') && errorMessage.includes('null') ||
        errorMessage.includes('Failed to load resource')
      ) {
        event.preventDefault();
        return;
      }
      console.error('Uncaught error:', event.error);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Try to prevent extension errors by checking for common extension elements
    const checkForExtensionElements = () => {
      const extensionSelectors = [
        '[data-extension]',
        '.share-modal',
        '[id*="share"]',
        '[class*="share"]'
      ];

      extensionSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            if (element && typeof element.remove === 'function') {
              element.remove();
            }
          });
        } catch (e) {
          // Ignore errors from checking elements
        }
      });
    };

    // Check after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkForExtensionElements);
    } else {
      checkForExtensionElements();
    }

    // Override addEventListener to prevent errors on null elements
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      try {
        if (this === null || this === undefined) {
          return; // Prevent adding listeners to null elements
        }
        return originalAddEventListener.call(this, type, listener, options);
      } catch (e) {
        // Suppress extension-related errors
        if (!e.message?.includes('share-modal')) {
          console.error('addEventListener error:', e);
        }
        return;
      }
    };

    return () => {
      console.error = originalConsoleError;
      EventTarget.prototype.addEventListener = originalAddEventListener;
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
      document.removeEventListener('DOMContentLoaded', checkForExtensionElements);
    };
  }, []);

  return <>{children}</>;
}