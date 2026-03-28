
// components/OfflineIndicator.tsx
import React, { useState, useEffect } from 'react';
import { useOffline } from '../hooks/useOffline';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, queueSize, pendingCount } = useOffline();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOnline && queueSize === 0) {
        setShow(false);
      } else {
        setShow(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isOnline, queueSize]);

  if (!show) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 rounded-lg shadow-lg p-4 ${
      isOnline ? 'bg-green-600' : 'bg-yellow-600'
    } text-white`}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {isOnline ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
        </div>
        <div>
          <p className="text-sm font-medium">
            {isOnline ? 'Online' : 'Offline Mode'}
          </p>
          {queueSize > 0 && (
            <p className="text-xs opacity-90">
              {pendingCount} pending sync{queueSize > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};