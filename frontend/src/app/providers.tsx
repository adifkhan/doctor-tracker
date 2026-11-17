'use client';

import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { MotionConfig } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner';
import { readAuthCookie } from '@/lib/cookies';
import { makeStore } from '@/store/store';
import { hydrateToken } from '@/store/slices/authSlice';

export function Providers({ children }: { children: React.ReactNode }) {
  const [store] = useState(makeStore);

  useEffect(() => {
    store.dispatch(hydrateToken(readAuthCookie()));
  }, [store]);

  return (
    <Provider store={store}>
      <MotionConfig reducedMotion="user">
        {children}
        <Toaster />
      </MotionConfig>
    </Provider>
  );
}
