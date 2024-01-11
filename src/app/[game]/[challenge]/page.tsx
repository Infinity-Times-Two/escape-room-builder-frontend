'use client';
import { useState } from 'react';
import { mockSavedGames } from '@/app/contexts/mockSavedGames';
import { useRouter } from 'next/navigation';
import TriviaChallenge from '@/app/components/challenges/Trivia';
import WordScrambleChallenge from '@/app/components/challenges/WordScramble';
import CaesarCypherChallenge from '@/app/components/challenges/CaesarCypher';

export default function Challenge({
  params,
}: {
  params: { game: string; challenge: string };
}) {
  const currentGame = mockSavedGames.find(
    (game) => game.id === Number(params.game)
  );

  if (!currentGame) {
    return (
      <div className='flex flex-col items-center justify-start p-16 min-h-screen gap-8'>
        <h2>Game not found</h2>
      </div>
    );
  }

  const currentChallenge = currentGame.challenges.find(
    (challenge) => challenge.id === decodeURIComponent(params.challenge)
  );

  if (!currentChallenge) {
    return <div>Challenge not found</div>;
  }

  const nextChallenge = currentGame.challenges.indexOf(currentChallenge) + 1;

  console.log(currentChallenge.type);
  const Challenge = () => {
    switch (currentChallenge.type) {
      case 'Trivia': {
        return (
          <TriviaChallenge
            currentChallenge={currentChallenge}
            nextChallenge={nextChallenge}
            currentGame={currentGame}
          />
        );
      }
      case 'Word Scramble': {
        return (
          <WordScrambleChallenge
            currentChallenge={currentChallenge}
            nextChallenge={nextChallenge}
            currentGame={currentGame}
          />
        );
      }
      case 'Caesar Cypher': {
        return (
          <CaesarCypherChallenge
            currentChallenge={currentChallenge}
            nextChallenge={nextChallenge}
            currentGame={currentGame}
          />
        );
      }
    }
  };
  return <Challenge />;
}
