'use client';
import { useState, useEffect, useContext } from 'react';
import { Game, Challenge } from '../../types/types';
import { UserContext } from '@/app/contexts/userContext';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import { v4 as uuidv4 } from 'uuid';
import { SavedGamesContext } from '@/app/contexts/savedGamesContext';
import { SingleGameContext } from '@/app/contexts/singleGameContext';
import Link from 'next/link';
import NewChallenge from './NewChallenge';

export default function NewGameForm() {
  const { user } = useContext(UserContext);
  let author: string;
  if (user.firstName === '') {
    author = 'Anonymous'
  } else {
    author = user.firstName
  }

  const defaultGameData = {
    id: '',
    gameTitle: '',
    gameDescription: '',
    timeLimit: 900,
    theme: '',
    author: author,
    bodyBg: '',
    titleBg: '',
    challenges: [
      {
        id: 'challenge-0',
        type: 'trivia',
        description: '',
        clue: '',
        answer: '',
      },
      {
        id: 'challenge-1',
        type: 'caesar cypher',
        description: '',
        clue: '',
        answer: '',
      },
      {
        id: 'challenge-2',
        type: 'word scramble',
        description: '',
        clue: [''],
        answer: '',
      },
    ],
  };
  const [newGame, setNewGame] = useState<Game>(() => {
    const localStorageData = localStorage.getItem('newGameForm');
    return localStorageData ? JSON.parse(localStorageData) : defaultGameData;
  });

  const { savedGames, setSavedGames } = useContext(SavedGamesContext);
  const { singleGame, setSingleGame } = useContext(SingleGameContext);
  // Set state to saved form in localStorage if one exists

  useEffect(() => {
    console.log('username changed')
  }, [author])
  useEffect(() => {
    if (newGame.id === '') {
      const newId = uuidv4();
      setNewGame((prevGame: Game) => {
        const newGame = { ...prevGame, id: newId };
        return newGame;
      });
    }

    if (newGame.bodyBg === '') {
      const colours = ['red', 'blue', 'yellow', 'green', 'orange', 'purple'];
      const bodybgIndex = Math.floor(Math.random() * 6);
      const titlebgIndex = Math.floor(Math.random() * 6);
      setNewGame((prevGame: Game) => {
        const newGame = {
          ...prevGame,
          bodyBg: colours[bodybgIndex],
          titleBg: colours[titlebgIndex],
        };
        return newGame;
      });
    }
    localStorage.setItem('newGameForm', JSON.stringify(newGame));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e: any) => {
    setNewGame((prevGame: Game) => {
      let saveGame: Game = prevGame;
      switch (e.target.dataset.type) {
        case 'gameTitle':
          saveGame = { ...prevGame, gameTitle: e.target.value };
          break;
        case 'gameDescription':
          saveGame = { ...prevGame, gameDescription: e.target.value };
          break;
      }
      localStorage.setItem('newGameForm', JSON.stringify(saveGame));
      return saveGame;
    });
  };

  const handleTimeLimitChange = (e: any) => {
    setNewGame((prevGame: Game) => {
      const newGame = { ...prevGame, timeLimit: e.target.value };
      localStorage.setItem('newGameForm', JSON.stringify(newGame));
      return newGame;
    });
  };

  const handleClueChange = (e: any, type: string, index: number) => {
    let clue: string | string[];
    // Caesar Cypher and Word Scramble clues come from the actual value passed to onClueChange, not the event target
    if (type === 'caesar cypher' || type === 'word scramble') {
      clue = e;
    } else if (type === 'trivia') {
      clue = e.target.value;
    }
    setNewGame((prevGame: Game) => {
      const newChallenges = prevGame.challenges.map((item, itemIndex) => {
        if (itemIndex === index) {
          return { ...item, clue: clue };
        }
        return item;
      });
      const updatedGame = { ...prevGame, challenges: newChallenges };
      localStorage.setItem('newGameForm', JSON.stringify(updatedGame));
      return updatedGame;
    });
  };

  const handleDescriptionChange = (e: any, index: number) => {
    setNewGame((prevGame: Game) => {
      const newChallenges = prevGame.challenges.map((item, itemIndex) => {
        if (itemIndex === index) {
          return { ...item, description: e.target.value };
        }
        return item;
      });
      const updatedGame = { ...prevGame, challenges: newChallenges };
      localStorage.setItem('newGameForm', JSON.stringify(updatedGame));
      return updatedGame;
    });
  };

  const handleAnswerChange = (e: any, index: number) => {
    setNewGame((prevGame: Game) => {
      const newChallenges = prevGame.challenges.map((item, itemIndex) => {
        if (itemIndex === index) {
          return { ...item, answer: e.target.value };
        }
        return item;
      });
      const updatedGame = { ...prevGame, challenges: newChallenges };
      localStorage.setItem('newGameForm', JSON.stringify(updatedGame));
      return updatedGame;
    });
  };

  const handleAddChallenge = (e: any) => {
    e.preventDefault();

    setNewGame((prevGame: Game) => {
      const numberOfChallenges = prevGame.challenges.length;
      const newChallenges = [
        ...prevGame.challenges,
        {
          id: `challenge-${numberOfChallenges}`, // this number should be the current length of the challenge array (challenges are zero-indexed)
          type: 'trivia',
          description: '',
          clue: '',
          answer: '',
        },
      ];
      const updatedGame = { ...prevGame, challenges: newChallenges };
      localStorage.setItem('newGameForm', JSON.stringify(updatedGame));
      return updatedGame;
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    newGame.challenges.map((challenge) => {
      if (typeof challenge.clue === 'string') {
        let sentence = challenge.clue.trim();
        if (challenge.type === 'word scramble') {
          let sentenceArray: string[] = [];
          sentenceArray = sentence.split(' ');
          challenge.clue = sentenceArray;
        }
      }
    });

    // When saving games is implemented, set state, save to localstorage
    // and add to user's array of saved games in DB

    // Set this game to be the current game in state
    setSingleGame(newGame);
    localStorage.setItem('singleGame', JSON.stringify(newGame));

    // Add this game to saved games in state & local storage
    setSavedGames((prevGames: Game[]) => {
      const newGames = [...prevGames, newGame];
      localStorage.setItem('savedGames', JSON.stringify(newGames));
      return newGames;
    });

    // Add to all games in DB
    // TO DO: Allow user to make each game public or private
    if (user.id !== '') {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGame),
      });
      const data = await response.json();
    }

    // TO DO: Add game ID to user's saved games array in escape-room-users table in DB
  };

  return (
    <form>
      <div className='flex flex-col gap-12'>
        <div className='flex flex-col gap-4'>
          <h1>Create your escape room</h1>
          <h2>Room Info</h2>
          <label htmlFor='gameTitle'>Name your Escape room</label>
          <Input
            fieldType='gameTitle'
            value={newGame.gameTitle}
            placeholder='Room name'
            onChange={handleInputChange}
            required
          />
        </div>
        <p>By: {author}</p>
        <div className='flex flex-col gap-4'>
          <label htmlFor='gameDescription'>Describe your Escape room</label>
          <TextArea
            fieldType='gameDescription'
            value={newGame.gameDescription}
            placeholder='Describe this room'
            onChange={handleInputChange}
          />
        </div>
        <div className='flex flex-col gap-4'>
          <label htmlFor='timeLimit'>Set time limit (minutes)</label>
          <input
            type='range'
            min={300}
            max={3600}
            value={newGame.timeLimit}
            className='range range-lg [--range-shdw:violet]'
            step='300'
            onChange={handleTimeLimitChange}
            id='timeLimit'
          />

          <div className='w-full flex justify-between text-sm px-2'>
            <span>05</span>
            <span>10</span>
            <span>15</span>
            <span>20</span>
            <span>25</span>
            <span>30</span>
            <span>35</span>
            <span>40</span>
            <span>45</span>
            <span>50</span>
            <span>55</span>
            <span>60</span>
          </div>
        </div>
        <h2>Challenges</h2>

        {newGame.challenges.map((challenge: Challenge, index) => {
          const onClueChange = (e: any) => {
            handleClueChange(e, challenge.type, index);
          };
          const onDescriptionChange = (e: any) => {
            handleDescriptionChange(e, index);
          };
          const onAnswerChange = (e: any) => {
            handleAnswerChange(e, index);
          };

          return (
            <NewChallenge
              key={challenge.id}
              challenge={challenge}
              clue={newGame.challenges[index].clue}
              description={newGame.challenges[index].description}
              answer={newGame.challenges[index].answer}
              onClueChange={onClueChange}
              onDescriptionChange={onDescriptionChange}
              onAnswerChange={onAnswerChange}
              index={index}
            />
          );
        })}

        {singleGame?.id !== newGame.id && (
          <>
            <button onClick={handleAddChallenge}>
              <span>Add Trivia Challenge</span>
            </button>
            <button className='w-60 self-center' onClick={handleSubmit}>
              <span>Create Game</span>
            </button>
          </>
        )}
        {singleGame?.id === newGame.id && (
          <Link
            key={newGame.id}
            href={`/game/${newGame.id}`}
            className='hover:no-underline self-center'
          >
            <button className='green w-60'>
              <span>Play Game!</span>
            </button>
          </Link>
        )}
        {singleGame?.id === newGame.id && user.id === '' && (
          <div role='alert' className='alert alert-info'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              className='stroke-current shrink-0 w-6 h-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              ></path>
            </svg>
            <span>
              Your game is saved to your device. If you would like to share or
              save across devices, please <Link href='/sign-in'>sign in</Link>{' '}
              or <Link href='/sign-up'>sign up</Link>.
            </span>
          </div>
        )}
      </div>

      {/*
      <fieldset className='flex flex-col gap-4'>
        <legend className='mb-4'>Choose a challenge type:</legend>
        <div className='flex flex-row-reverse justify-end gap-2'>
          <label htmlFor='trivia'>Trivia</label>
          <input
            type='radio'
            name='challengeType'
            id='trivia'
            value='Trivia'
            className='radio radio-primary'
            required
          />
        </div>
        <div className='flex flex-row-reverse justify-end gap-2'>
          <label htmlFor='caesarCypher'>Caesar Cypher</label>
          <input
            type='radio'
            name='challengeType'
            id='caesarCypher'
            value='Caesar Cypher'
            className='radio radio-primary'
          />
        </div>
        <div className='flex flex-row-reverse justify-end gap-2'>
          <label htmlFor='wordScramble'>Word Scramble</label>
          <input
            type='radio'
            name='challengeType'
            id='wordScramble'
            value='Word Scramble'
            className='radio radio-primary'
          />
        </div>
      </fieldset> */}
    </form>
  );
}
