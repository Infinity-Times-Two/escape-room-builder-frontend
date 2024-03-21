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

export default function NewGameForm({ editGame }: { editGame?: string }) {
  const { user } = useContext(UserContext);

  let author: string;
  if (user.firstName === '') {
    author = 'Anonymous';
  } else {
    author = user.firstName;
  }
  let authorId: string;
  if (user.id === '') {
    authorId = '';
  } else {
    authorId = user.id;
  }

  const defaultGameData = {
    id: '',
    gameTitle: '',
    gameDescription: '',
    timeLimit: 900,
    theme: '',
    author: author,
    authorId: authorId,
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

  const [nextChallenge, setNextChallenge] = useState('trivia');
  const [submitError, setSubmitError] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState('');
  const [editError, setEditError] = useState(false);
  const [editMessage, setEditMessage] = useState('');

  const { setSavedGames } = useContext(SavedGamesContext);
  const { singleGame, setSingleGame } = useContext(SingleGameContext);

  const [newGame, setNewGame] = useState<Game>(() => {
    const localStorageData = localStorage.getItem('newGameForm');
    let gameData = defaultGameData;
    if (localStorageData) {
      gameData = JSON.parse(localStorageData);
    }
    if (editGame === singleGame.id) {
      return singleGame;
    } else {
    }
    return localStorageData ? gameData : defaultGameData;
  });

  // Reusable function to save form to localStorage
  const saveForm = (updatedGame: Game) => {
    localStorage.setItem('newGameForm', JSON.stringify(updatedGame));
  };

  // Set game ID and colours when loading a new form
  useEffect(() => {
    if (editGame) {
      setSingleGame((prevGame: Game) => {
        const newGame = { ...prevGame, id: '' };
        return newGame;
      });
    }
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
    setSubmitError(false);
    setSubmitErrorMessage('');

    // Check if any challenge clue is empty
    const hasEmptyClue = newGame.challenges.some(
      (challenge) =>
        challenge.clue === '' ||
        challenge.clue === undefined ||
        challenge.clue === null
    );

    const hasEmptyAnswer = newGame.challenges.some((challenge) => {
      if (typeof challenge.answer === 'string') {
        if (
          challenge.answer === '' ||
          challenge.answer === undefined ||
          challenge.answer === null
        ) {
          return true;
        }
      } else if (typeof challenge.answer === 'object') {
        if (challenge.answer[0] === '') {
          return true;
        }
      }
    });

    // If any challenge clue is empty, stop submission
    if (hasEmptyClue && hasEmptyAnswer) {
      console.log('Cannot submit: Some challenge clues and answers are empty.');
      setSubmitError(true);
      setSubmitErrorMessage('Some challenge clues and answers are empty');
      return;
    } else if (hasEmptyClue) {
      console.log('Cannot submit: Some challenge clues are empty.');
      setSubmitError(true);
      setSubmitErrorMessage('Some challenge clues are empty');
      return;
    } else if (hasEmptyAnswer) {
      console.log('Cannot submit: Some challenge answers are empty.');
      setSubmitError(true);
      setSubmitErrorMessage('Some challenge answers are empty');
      return;
    }

    // Format clues for DB
    newGame.challenges.map((challenge) => {
      if (typeof challenge.clue === 'string') {
        challenge.clue = challenge.clue.trim();
        if (challenge.type === 'word scramble') {
          let sentenceArray: string[] = [];
          sentenceArray = challenge.clue.split(' ');
          challenge.clue = sentenceArray;
        }
      }
    });

    // Set this game to be the current game in state (if the player chooses to play the game)
    setSingleGame(newGame);
    localStorage.setItem('singleGame', JSON.stringify(newGame));

    // Add this game to saved games in state & local storage
    setSavedGames((prevGames: Game[]) => {
      let newGames: Game[];
      if (editGame) {
        newGames = prevGames.map((game) => {
          if (game.id === editGame) {
            return newGame;
          } else {
            return game;
          }
        });
      } else {
        newGames = [...prevGames, newGame];
      }
      localStorage.setItem('savedGames', JSON.stringify(newGames));
      return newGames;
    });

    // Add to main games table in DB
    // TO DO: Allow user to mark a game as public or private
    if (user.id !== '') {
      if (editGame) {
        setEditError(false);
        console.log('Editing game in DB...');
        const response = await fetch(`/api/game/${editGame}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newGame),
        });
        const data = await response.json();
        console.log('Response from saving edited game to DB:');
        console.log(data);
        if (data.message === 'Game updated successfully') {
          setEditMessage('Your game was updated successfully!');
        } else {
          setEditError(true);
          setEditMessage(data.message);
        }
      } else {
        const response = await fetch('/api/games', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newGame),
        });
        const data = await response.json();
        console.log('Response from saving to DB:');
        console.log(data);
      }
    }

    // Add game ID to the user's saved games array in escape-room-users table in DB
    if (user.id !== '' && !editGame) {
      const response = await fetch(`/api/updateUser/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savedGame: newGame.id }),
      });
      const data = await response.json();
      console.log("Response from adding game to user's saved games in DB:");
      console.log(data);
    }
  };

  // Reset the current game form
  const handleReset = (e: any) => {
    e.preventDefault();
    setSubmitError(false);
    setSubmitErrorMessage('');
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
                    {String(item).padStart(2, '0')}
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
                  dataTest={`${challenge.id}-${String(challenge.type).replace(
                    ' ',
                    '-'
                  )}`} // Mmm.. maybe refactor challenge type names?
                  submitError={submitError}
                />
              );
            })
          )}

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
                  <button
                    onClick={handleAddChallenge}
                    data-test='add-challenge'
                    data-testid={`add-${nextChallenge.replaceAll(
                      ' ',
                      '-'
                    )}-challenge`}
                  >
                    <span>Add {nextChallenge} Challenge</span>
                  </button>
                </div>
              </div>
            </div>
          </>

          {/* Show by default on edit page */}
          {editGame === newGame.id && (
            <button
              onClick={handleSubmit}
              data-test='edit-game'
              data-testid='edit-game'
            >
              <span>Update Game</span>
            </button>
          )}

          {/* Show by default on create page */}
          {!editGame && singleGame?.id !== newGame.id && (
            <button
              onClick={handleSubmit}
              data-test='create-game'
              data-testid='create-game'
            >
              <span>Create Game</span>
            </button>
          )}

          {editMessage && (
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
              <span data-test='edit-message'>{editMessage}</span>
            </div>
          )}

          {editError && (
            <div role='alert' className='alert alert-error'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='stroke-current shrink-0 h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <span data-test='edit-error'>{editError}</span>
            </div>
          )}

          {/* Show after creating game or after editing game*/}
          {singleGame?.id === newGame.id && (
            <Link
              key={newGame.id}
              href={`/game/${newGame.id}`}
              className='hover:no-underline self-center'
            >
              <button
                className='green w-60'
                data-test='play-game'
                data-testid='play-game'
              >
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
          {submitError && (
            <div role='alert' className='alert alert-warning mx-4 self-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='stroke-current shrink-0 h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
              <span>{submitErrorMessage}</span>
            </div>
          )}
        </div>
      </form>
      {!editGame && (
        <button className='red self-end' onClick={handleReset} role='reset'>
          <span>Reset</span>
        </button>
      )}
    </>
  );
}
