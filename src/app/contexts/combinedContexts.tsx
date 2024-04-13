import React, { ReactNode } from 'react';
import { SavedGamesContextProvider } from './savedGamesContext';
import { LoadedGamesContextProvider } from './loadedGamesContext';
import { SingleGameContextProvider } from './singleGameContext';
import { UserContextProvider } from './userContext';
import { TimerContextProvider } from './timerContext';

interface CompositeContextProviderProps {
  children: ReactNode;
}

const CompositeContextProvider: React.FC<CompositeContextProviderProps> = ({
  children,
}) => {
  return (
    <UserContextProvider>
      <SavedGamesContextProvider>
        <LoadedGamesContextProvider>
          <SingleGameContextProvider>
            <TimerContextProvider>{children}</TimerContextProvider>
          </SingleGameContextProvider>
        </LoadedGamesContextProvider>
      </SavedGamesContextProvider>
    </UserContextProvider>
  );
};

export default CompositeContextProvider;
