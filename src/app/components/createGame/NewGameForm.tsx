'use client';
import { useState, useEffect, useContext } from 'react';
import { Game, Challenge } from '../../types/types';
import { UserContext } from '@/app/contexts/userContext';
import { SavedGamesContext } from '@/app/contexts/savedGamesContext';
import { SingleGameContext } from '@/app/contexts/singleGameContext';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import NewChallenge from './NewChallenge';

export default function NewGameForm() {
  const { user } = useContext(UserContext);
  let author: string;
  if (user.firstName === '') {
    author = 'Anonymous';
  } else {
    author = user.firstName;
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

  const [nextChallenge, setNextChallenge] = useState('trivia');

  const { setSavedGames } = useContext(SavedGamesContext);
  const { singleGame, setSingleGame } = useContext(SingleGameContext);

  // Reusable function to save form to localStorage
  const saveForm = (updatedGame: Game) => {
    localStorage.setItem('newGameForm', JSON.stringify(updatedGame));
  };

  // Set game ID and colours when loading a new form
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
    saveForm(newGame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newGame.id]);

  useEffect(() => {
    if (newGame.challenges.length > 3) {
      const index = newGame.challenges.length - 1;
      const challengeType = newGame.challenges[index].type;
      const challengeId = document.getElementById(`${challengeType}-${index}`);
      window.scrollTo({
        top: challengeId?.offsetTop,
        behavior: 'smooth',
      });
    }
    // adding newGame.challenges would scroll to newest challenge whenever any challenge value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newGame.challenges.length]);

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
      saveForm(saveGame);
      return saveGame;
    });
  };

  const handleTimeLimitChange = (e: any) => {
    setNewGame((prevGame: Game) => {
      const newGame = { ...prevGame, timeLimit: e.target.value };
      saveForm(newGame);
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
      saveForm(updatedGame);
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
      saveForm(updatedGame);
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
      saveForm(updatedGame);
      return updatedGame;
    });
  };

  const handleAddChallenge = (e: any) => {
    e.preventDefault();
    setNewGame((prevGame: Game) => {
      const numberOfChallenges: number = prevGame.challenges.length;
      const newChallenges = [
        ...prevGame.challenges,
        {
          id: `challenge-${numberOfChallenges}`, // this number should be the current length of the challenge array (challenges are zero-indexed)
          type: nextChallenge,
          description: '',
          clue: '',
          answer: '',
        },
      ];
      const updatedGame = { ...prevGame, challenges: newChallenges };
      saveForm(updatedGame);
      return updatedGame;
    });
  };

  const handleRemoveChallenge = (e: any, index: number) => {
    e.preventDefault();
    setNewGame((prevGame: Game) => {
      const newChallenges = prevGame.challenges.filter(
        (item, itemIndex) => itemIndex !== index
      );
      const updatedGame = { ...prevGame, challenges: newChallenges };
      saveForm(updatedGame);
      return updatedGame;
    });
  };

  const handleNextChallenge = (e: any) => {
    setNextChallenge(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Format clues for DB
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

    // Set this game to be the current game in state (if the player chooses to play the game)
    setSingleGame(newGame);
    localStorage.setItem('singleGame', JSON.stringify(newGame));

    // Add this game to saved games in state & local storage
    setSavedGames((prevGames: Game[]) => {
      const newGames = [...prevGames, newGame];
      localStorage.setItem('savedGames', JSON.stringify(newGames));
      return newGames;
    });

    // Add to main games table in DB
    // TO DO: Allow user to mark a game as public or private
    if (user.id !== '') {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGame),
      });
      const data = await response.json();
      console.log('Response from saving to DB:');
      console.log(data);
    }

    // Add game ID to the user's saved games array in escape-room-users table in DB
    const response = await fetch(`/api/updateUser/${user.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ savedGame: newGame.id }),
    });
    const data = await response.json();
    console.log("Response from adding game to user's saved games in DB:");
    console.log(data);
  };

  // Reset the current game form
  const handleReset = (e: any) => {
    e.preventDefault();
    setNewGame(defaultGameData);
  };

  const minutes = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
  return (
    <>
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
              dataTest='game-title'
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
              dataTest='game-description'
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
              step={300}
              onChange={handleTimeLimitChange}
              id='timeLimit'
              data-test='time-limit'
            />
            <div className='w-full flex justify-between text-sm pl-px'>
              {minutes.map((item: number) => {
                return (
                  <span
                    data-test={`minute-marker-${item}`}
                    key={`minute-${item}`}
                    className={
                      Number(newGame.timeLimit) === item * 60
                        ? 'flex items-center justify-center font-bold border p-2 border-black rounded-full w-[2.5rem] min-h-[2.5rem] bg-teal-100'
                        : 'flex items-center justify-center p-2 w-[2.5rem] min-h-[2.5rem]'
                    }
                  >
                    {String(item).padStart(2, "0")}
                  </span>
                );
              })}
            </div>
          </div>
          <h2>Challenges</h2>

          {newGame.challenges.length === 0 ? (
            <p>Add a challenge!</p>
          ) : (
            newGame.challenges.map((challenge: Challenge, index) => {
              const onClueChange = (e: any) => {
                handleClueChange(e, challenge.type, index);
              };
              const onDescriptionChange = (e: any) => {
                handleDescriptionChange(e, index);
              };
              const onAnswerChange = (e: any) => {
                handleAnswerChange(e, index);
              };
              const onRemove = (e: any) => {
                handleRemoveChallenge(e, index);
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
                  onRemove={onRemove}
                  index={index}
                  dataTest={`${challenge.id}-${String(challenge.type).replace(" ", "-")}`} // Mmm.. maybe refactor challenge type names?
                />
              );
            })
          )}
          {singleGame?.id !== newGame.id && (
            <>
              <div className='flex flex-row flex-wrap gap-8 w-full'>
                <div className='flex flex-row gap-8 border-2 border-black p-8 rounded-xl bg-white/50 w-full'>
                  <fieldset className='flex flex-col flex-shrink gap-4'>
                    <legend className='mb-4'>Choose a challenge type:</legend>
                    <div className='flex flex-row-reverse justify-end gap-2'>
                      <label htmlFor='trivia'>Trivia</label>
                      <input
                        type='radio'
                        name='challengeType'
                        id='trivia'
                        value='trivia'
                        className='radio radio-primary'
                        onChange={handleNextChallenge}
                        checked={nextChallenge === 'trivia'}
                        required
                      />
                    </div>
                    <div className='flex flex-row-reverse justify-end gap-2'>
                      <label htmlFor='caesarCypher'>Caesar Cypher</label>
                      <input
                        type='radio'
                        name='challengeType'
                        id='caesarCypher'
                        value='caesar cypher'
                        className='radio radio-primary'
                        onChange={handleNextChallenge}
                        checked={nextChallenge === 'caesar cypher'}
                      />
                    </div>
                    <div className='flex flex-row-reverse justify-end gap-2'>
                      <label htmlFor='wordScramble'>Word Scramble</label>
                      <input
                        type='radio'
                        name='challengeType'
                        id='wordScramble'
                        value='word scramble'
                        className='radio radio-primary'
                        onChange={handleNextChallenge}
                        checked={nextChallenge === 'word scramble'}
                      />
                    </div>
                  </fieldset>
                  <div className='grid place-items-center flex-grow'>
                    <button onClick={handleAddChallenge} data-test='add-challenge' data-testid={`add-${nextChallenge.replaceAll(" ", "-")}-challenge`}>
                      <span>Add {nextChallenge} Challenge</span>
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={handleSubmit} data-test='create-game' role='create-game'>
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
              <button className='green w-60' data-test='play-game'>
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
              <span data-test='logged-out-message'>
                Your game is saved to your device. If you would like to share or
                save across devices, please <Link href='/sign-in'>sign in</Link>{' '}
                or <Link href='/sign-up'>sign up</Link>.
              </span>
            </div>
          )}
        </div>
      </form>
      <button className='red self-end' onClick={handleReset} role='reset'>
        <span>Reset</span>
      </button>
    </>
  );
}
