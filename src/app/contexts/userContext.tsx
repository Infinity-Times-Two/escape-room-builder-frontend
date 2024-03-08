'use client';
import { useState, createContext, useMemo, PropsWithChildren } from 'react';

import { DBuser } from '../types/types';

interface DBuserContextType {
  user: DBuser | undefined;
  setUser: React.Dispatch<React.SetStateAction<DBuser | undefined>>;
}

const defaultContextValue: DBuserContextType = {
  user: undefined,
  setUser: () => {},
};

const UserContext = createContext(defaultContextValue);

const UserContextProvider = (props: PropsWithChildren<{}>) => {
  const [user, setUser] = useState<DBuser | undefined>({
    id: '',
    firstName: '',
    nickName: '',
    savedGames: [],
    createdGames: [],
    isAdmin: false,
  });

  const value = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user, setUser]
  );

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
