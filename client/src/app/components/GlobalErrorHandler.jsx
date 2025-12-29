'use client';

import { useEffect } from 'react';

export default function GlobalErrorHandler({ children }) {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      // Prevent the default browser behavior (logging to console)
      event.preventDefault();
    };

    // Handle uncaught errors
    const handleError = (event) => {
      console.error('Uncaught error:', event.error);
      // Only prevent default if it's not a critical error
      if (event.error?.message?.includes('share-modal') ||
          event.error?.message?.includes('favicon') ||
          event.error?.message?.includes('play()')) {
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return <>{children}</>;
}