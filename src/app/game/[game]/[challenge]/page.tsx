'use client';
import { useContext, useEffect } from 'react';
import { SingleGameContext } from '@/app/contexts/singleGameContext';
import TriviaChallenge from '@/app/components/challenges/Trivia';
import WordScrambleChallenge from '@/app/components/challenges/WordScramble';
import CaesarCypherChallenge from '@/app/components/challenges/CaesarCypher';

export default function Challenge({
  params,
}: {
  params: { game: string; challenge: string };
}) {
  const { singleGame, setSingleGame } = useContext(SingleGameContext);
  
  // If user navigates to a challenge page directly, check if the game is in localStorage
  useEffect(() => {
    const localStorageGame: any = localStorage.getItem('singleGame');
    if (!singleGame && localStorageGame !== null) {
      const parsedGame = JSON.parse(localStorageGame)
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
  console.log(currentChallenge)
  const nextChallenge = singleGame.challenges.indexOf(currentChallenge) + 1;

  const Challenge = () => {
    switch (currentChallenge.type) {
      case 'Trivia' || 'trivia': {
        return (
          <TriviaChallenge
            currentChallenge={currentChallenge}
            nextChallenge={nextChallenge}
            currentGame={singleGame}
          />
        );
      }
      case 'Word Scramble' || 'word scramble': {
        return (
          <WordScrambleChallenge
            currentChallenge={currentChallenge}
            nextChallenge={nextChallenge}
            currentGame={singleGame}
          />
        );
      }
      case 'Caesar Cypher' || 'caesar cypher': {
        return (
          <CaesarCypherChallenge
            currentChallenge={currentChallenge}
            nextChallenge={nextChallenge}
            currentGame={singleGame}
          />
        );
      }
    }
  };
  return (
    <div className='pt-16 sm:pt-0'>
      <h1 className='mb-8'>
        {currentChallenge?.type}: {currentChallenge?.description}
      </h1>
      <Challenge />
    </div>
  );
}
