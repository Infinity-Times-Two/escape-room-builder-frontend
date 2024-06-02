'use client';
import { useState, createContext, useMemo, PropsWithChildren } from 'react';

type TimerContextType = {
  expiry: number;
  setExpiry: (value: number) => void;
  finishTime: number;
  setFinishTime: (value: number) => void;
};

const TimerContext = createContext<TimerContextType>({
  expiry: 0,
  setExpiry: () => {},
  finishTime: 0,
  setFinishTime: () => {},
});

const TimerContextProvider = (props: PropsWithChildren<{}>) => {
  const [expiry, setExpiry] = useState<number>(0);
  const [finishTime, setFinishTime] = useState<number>(0);

  const value = useMemo(
    () => ({
      expiry,
      setExpiry,
      finishTime,
      setFinishTime,
    }),
    [expiry, setExpiry, finishTime, setFinishTime]
  );

  return (
    <TimerContext.Provider value={value}>
      {props.children}
    </TimerContext.Provider>
  );
};

export { TimerContext, TimerContextProvider };
