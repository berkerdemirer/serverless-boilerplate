'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>500</h1>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '1rem' }}>Critical Error</h2>
            <p style={{ color: '#666', marginTop: '0.5rem' }}>A critical error occurred. Please try again.</p>
            {error.digest && <p style={{ color: '#999', fontSize: '0.75rem', marginTop: '0.5rem' }}>Error ID: {error.digest}</p>}
            <button
              onClick={reset}
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
