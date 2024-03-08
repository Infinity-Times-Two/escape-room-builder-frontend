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
    <SavedGamesContextProvider>
      <LoadedGamesContextProvider>
        <SingleGameContextProvider>
          <UserContextProvider>
            <TimerContextProvider>
              {children}
            </TimerContextProvider>
          </UserContextProvider>
        </SingleGameContextProvider>
      </LoadedGamesContextProvider>
    </SavedGamesContextProvider>
  );
};

export default CompositeContextProvider;
