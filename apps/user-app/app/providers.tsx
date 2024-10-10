"use client"
import { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@repo/store/shared-store'; // Import your shared Redux store
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ReduxProvider store={store}>
      <SessionProvider>
      {/* Add other providers here (e.g., ThemeProvider) */}
      {children}
      </SessionProvider>
    </ReduxProvider>
  );
};

export default Providers;