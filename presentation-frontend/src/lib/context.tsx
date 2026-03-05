import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from './types';

const userStateKey = 'userState';

type UserCtx = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const UserContext = createContext<UserCtx | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(userStateKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(userStateKey, JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserState() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUserState must be used inside <UserProvider>');
  return ctx; // { user, setUser }
}
