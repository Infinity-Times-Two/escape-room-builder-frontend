'use client';
import { useContext, useEffect } from 'react';
import { SingleGameContext } from '@/app/contexts/singleGameContext';
import TriviaChallenge from '@/app/components/challenges/Trivia';
import WordScrambleChallenge from '@/app/components/challenges/WordScramble';
import CaesarCypherChallenge from '@/app/components/challenges/CaesarCypher';
import FillInTheBlankChallenge from '@/app/components/challenges/FillInTheBlank';
import { Challenge, Game } from '@/app/types/types';

type SingleChallengeProps = {
  currentChallenge: Challenge;
  nextChallenge: number;
  singleGame: Game;
};

const SingleChallenge: React.FC<SingleChallengeProps> = ({
  currentChallenge,
  nextChallenge,
  singleGame,
}) => {
  const challengeType = currentChallenge.type.toLowerCase().replace(" ", "-");
  switch (challengeType) {
    case 'trivia': {
      return (
        <>
          <TriviaChallenge
            currentChallenge={currentChallenge}
            nextChallenge={nextChallenge}
            currentGame={singleGame}
          />
        </>
      );
    }
    case 'word-scramble': {
      return (
        <WordScrambleChallenge
          currentChallenge={currentChallenge}
          nextChallenge={nextChallenge}
          currentGame={singleGame}
        />
      );
    }
    case 'caesar-cypher': {
      return (
        <CaesarCypherChallenge
          currentChallenge={currentChallenge}
          nextChallenge={nextChallenge}
          currentGame={singleGame}
        />
      );
    }
    case 'fill-in-the-blank': {
      return (
        <FillInTheBlankChallenge
          currentChallenge={currentChallenge}
          nextChallenge={nextChallenge}
          currentGame={singleGame}
        />
      );
    }
  }
};

export default function ChallengePage({
  params,
}: {
  params: { game: string; challenge: string };
}) {
  const { singleGame, setSingleGame } = useContext(SingleGameContext);

  // If user navigates to a challenge page directly, check if the game is in localStorage
  useEffect(() => {
    const localStorageGame: any = localStorage.getItem('singleGame');
    if (!singleGame && localStorageGame !== null) {
      const parsedGame = JSON.parse(localStorageGame);
      setSingleGame(parsedGame);
    }
  }, [setSingleGame, singleGame]);

  if (!singleGame) {
    return (
      <div className='flex flex-col items-center justify-start sm:p-16 min-h-screen gap-8'>
        <h2>Game not found</h2>
      </div>
    );
  }

  const currentChallenge = singleGame.challenges.find(
    (challenge) => challenge.id === decodeURIComponent(params.challenge)
  );

  if (!currentChallenge) {
    return <div>Challenge not found</div>;
  }
  let nextChallenge: number = 1;
  if (singleGame.challenges && singleGame.challenges.length > 0) {
    nextChallenge = singleGame.challenges.indexOf(currentChallenge) + 1;
  }

  return (
    <div className='pt-16 sm:pt-0'>
      <h2 className='mb-8'>
        {currentChallenge?.type.replace("-", " ")}: {currentChallenge?.description}
      </h2>
      <SingleChallenge
        currentChallenge={currentChallenge}
        nextChallenge={nextChallenge}
        singleGame={singleGame}
      />
    </div>
  );
}
