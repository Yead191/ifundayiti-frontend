"use client";

import * as React from "react";

const TranslationContext = React.createContext<any>(null);

export function TranslationProvider({
  children,
  messages,
}: {
  children: React.ReactNode;
  messages: any;
}) {
  return (
    <TranslationContext.Provider value={messages}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = React.useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
