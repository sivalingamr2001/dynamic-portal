import React from "react";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => (
  <QueryProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </QueryProvider>
);
