import React, { createContext, useContext, useMemo, useState } from "react";

type Session = {
  userId: string | null;
  name: string | null;
  email: string | null;
  setSession: (s: { userId: string; name: string; email: string }) => void;
  clearSession: () => void;
};

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      userId,
      name,
      email,
      setSession: (s: { userId: string; name: string; email: string }) => {
        setUserId(s.userId);
        setName(s.name);
        setEmail(s.email);
      },
      clearSession: () => {
        setUserId(null);
        setName(null);
        setEmail(null);
      },
    }),
    [userId, name, email]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
