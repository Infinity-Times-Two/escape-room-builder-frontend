'use client';
import {
  useState,
  useEffect,
  createContext,
  useMemo,
  PropsWithChildren,
} from 'react';

import { SingleGame } from '../types/types';

interface SingleGameContextType {
  singleGame: SingleGame;
  setSingleGame: React.Dispatch<React.SetStateAction<SingleGame>>;
}

const defaultContextValue: SingleGameContextType = {
  singleGame: {
    id: '',
    gameTitle: '',
    gameDescription: '',
    timeLimit: 300,
    theme: '',
    author: '',
    bodyBg: '',
    titleBg: '',
    challenges: [
      {
        id: 'challenge-1',
        type: '',
        description: '',
        clue: '',
        answer: '',
      },
      {
        id: 'challenge-2',
        type: '',
        description: '',
        clue: '',
        answer: '',
      },
      {
        id: 'challenge-3',
        type: '',
        description: '',
        clue: '',
        answer: '',
      },
    ],
  },
  setSingleGame: () => {},
};

const SingleGameContext = createContext(defaultContextValue);

const SingleGameContextProvider = (props: PropsWithChildren<{}>) => {
  const [singleGame, setSingleGame] = useState<SingleGame>({
    id: '',
    gameTitle: '',
    gameDescription: '',
    timeLimit: 300,
    theme: '',
    author: '',
    bodyBg: '',
    titleBg: '',
    challenges: [
      {
        id: 'challenge-1',
        type: '',
        description: '',
        clue: '',
        answer: '',
      },
      {
        id: 'challenge-2',
        type: '',
        description: '',
        clue: '',
        answer: '',
      },
      {
        id: 'challenge-3',
        type: '',
        description: '',
        clue: '',
        answer: '',
      },
    ],
  });

  const value = useMemo(
    () => ({
      singleGame,
      setSingleGame,
    }),
    [singleGame, setSingleGame]
  );

  return (
    <SingleGameContext.Provider value={value}>
      {props.children}
    </SingleGameContext.Provider>
  );
};

export { SingleGameContext, SingleGameContextProvider };
