'use client';
import { useState, useEffect, useContext } from 'react';
import { Game, Challenge } from '../../types/types';
import { UserContext } from '@/app/contexts/userContext';
import { SavedGamesContext } from '@/app/contexts/savedGamesContext';
import { LoadedGamesContext } from '@/app/contexts/loadedGamesContext';
import { SingleGameContext } from '@/app/contexts/singleGameContext';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import NewChallenge from './NewChallenge';
import {
  QuestionMarkCircleIcon,
  KeyIcon,
  ArrowPathIcon,
  PuzzlePieceIcon,
} from '@heroicons/react/24/outline';

/***
 * TO DO: Refactor this form to use a server action for submission
 * https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms
 *
 */

export default function NewGameForm({ editGame }: { editGame?: string }) {
  const { user } = useContext(UserContext);

  const defaultGameData = {
    id: '',
    gameTitle: '',
    gameDescription: '',
    timeLimit: 900,
    theme: '',
    author: user.firstName,
    authorId: user.id,
    bodyBg: '',
    titleBg: '',
    private: false,
    challenges: [],
  };

  const [nextChallenge, setNextChallenge] = useState<string>('trivia');
  const [savingToDB, setSavingToDB] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string[]>([]);
  const [editError, setEditError] = useState<boolean>(false);
  const [editMessage, setEditMessage] = useState<string>('');
  const [tooManyGames, setTooManyGames] = useState(false);
  const [challengeId, setChallengeId] = useState(0);
  // Instead of using a fancy way to get a unique ID for mapped challenges, we're just incrementing each time a challenge is added
  // and not decrementing whenever a challenge is deleted.

  const { setSavedGames } = useContext(SavedGamesContext);
  const { setLoadedGames } = useContext(LoadedGamesContext);
  const { singleGame, setSingleGame } = useContext(SingleGameContext);

  const [newGame, setNewGame] = useState<Game>(defaultGameData);

  useEffect(() => {
    if (newGame.id === '') {
      let localStorageData: string | null = '';

      if (typeof window !== 'undefined') {
        localStorageData = localStorage.getItem('newGameForm');
      }
      let gameData: Game = defaultGameData;

      if (editGame === singleGame.id) {
        gameData = singleGame;
        setNewGame(gameData);
        saveForm(gameData);
      } else if (localStorageData) {
        gameData = JSON.parse(localStorageData);
        setNewGame(gameData);
      } else {
        if (user.firstName === '') {
          gameData.author = 'Anonymous';
        } else {
          gameData.author = user.firstName;
        }
        if (user.id === '') {
          gameData.authorId = 'noAuthorId';
        } else {
          gameData.authorId = user.id;
        }
        if (newGame.id === '') {
          gameData.id = uuidv4();
        }
        if (newGame.bodyBg === '') {
          const colours = [
            'red',
            'blue',
            'yellow',
            'green',
            'orange',
            'purple',
          ];
          const bodybgIndex = Math.floor(Math.random() * 6);
          const titlebgIndex = Math.floor(Math.random() * 6);
          gameData.bodyBg = colours[bodybgIndex];
          gameData.titleBg = colours[titlebgIndex];
        }
        setNewGame(gameData);
        saveForm(gameData);
      }
    }
  }, [user.id, newGame.id]);

  // Reusable function to save form to localStorage
  const saveForm = (updatedGame: Game) => {
    localStorage.setItem('newGameForm', JSON.stringify(updatedGame));
  };

  // Set game ID and colours when loading a new form
  useEffect(() => {
    const now = Date.now();
    if (user.recentGameTimestamps && !user.isAdmin) {
      if (
        user.recentGameTimestamps.length === 3 &&
        now - user.recentGameTimestamps[0] < 86400000
      ) {
        setTooManyGames(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newGame.id]);

  useEffect(() => {
    // adding newGame.challenges scrolls to the newest challenge whenever any challenge value changes
    if (newGame.challenges.length > 0) {
      const index = newGame.challenges.length - 1;
      const challengeType = newGame.challenges[index].type;
      const challengeId = document.getElementById(`${challengeType}-${index}`);
      window.scrollTo({
        top: challengeId?.offsetTop,
        behavior: 'smooth',
      });
    }
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
    // Array clues come from the actual value passed to onClueChange, not the event target
    if (
      type === 'cryptogram' ||
      type === 'word-scramble' ||
      type === 'fill-in-the-blank'
    ) {
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
      const newChallenges = [
        ...prevGame.challenges,
        {
          id: `challenge-${challengeId}`, // this number should be the current length of the challenge array (challenges are zero-indexed)
          type: nextChallenge,
          description: '',
          clue: '',
          answer: '',
        },
      ];
      setChallengeId(challengeId + 1);
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
    setSavingToDB(true);
    setSubmitError(false);
    setSubmitMessage([]);

    const hasNoClues = newGame.challenges.length === 0;

    const hasEmptyClue = newGame.challenges.some(
      (challenge) =>
        challenge.clue === '' ||
        challenge.clue === undefined ||
        challenge.clue === null
    );

    const hasEmptyAnswer = newGame.challenges.some((challenge) => {
      if (challenge.answer === '') {
        return true;
      }
    });

    // If any required fields are empty, stop submission
    switch (true) {
      case newGame.gameTitle === '':
        setSubmitError(true);
        setSubmitMessage((prev) => [
          ...prev,
          'Please add a title for your game.',
        ]);
      case newGame.gameDescription === '':
        setSubmitError(true);
        setSubmitMessage((prev) => [
          ...prev,
          'Please add a short description for your game.',
        ]);
      case hasNoClues:
        setSubmitError(true);
        setSubmitMessage((prev) => [
          ...prev,
          'Please add at least one challenge',
        ]);
        break;
      case hasEmptyClue:
        setSubmitError(true);
        setSubmitMessage((prev) => [
          ...prev,
          'Some challenge clues are empty.',
        ]);
      case hasEmptyAnswer:
        setSubmitError(true);
        setSubmitMessage((prev) => [
          ...prev,
          'Some challenge answers are empty.',
        ]);
    }

    if (
      newGame.gameTitle === '' ||
      newGame.gameDescription === '' ||
      hasNoClues ||
      hasEmptyClue ||
      hasEmptyAnswer
    ) {
      console.log('Not saving game');
      setSavingToDB(false);
      return;
    } else {
      console.log('Saving game...');
      // Format clues for DB
      newGame.challenges.map((challenge) => {
        if (typeof challenge.clue === 'string') {
          challenge.clue = challenge.clue.trim();
          if (challenge.type === 'word-scramble') {
            let sentenceArray: string[] = [];
            sentenceArray = challenge.clue.split(' ');
            challenge.clue = sentenceArray;
          }
        }
        if (challenge.type === 'fill-in-the-blank') {
          challenge.answer = challenge.answer.replaceAll('"', '');
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

      if (!newGame.private) {
        // Add to public games in front-end (no need for refetching)
        setLoadedGames((prevGames: Game[]) => {
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
          localStorage.setItem('loadedGames', JSON.stringify(newGames));
          return newGames;
        });
      } else {
        // remove from public games in FE
        if (editGame) {
          setLoadedGames((prevGames: Game[]) => {
            let newGames: Game[];

            newGames = prevGames.filter((game) => game.id !== editGame);
            return newGames;
          });
        }
      }

      // Add to main games table in DB
      if (user.id !== '') {
        if (editGame) {
          setEditError(false);
          setEditMessage('');
          const response = await fetch(`/api/game/${editGame}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newGame),
          });
          const data = await response.json();
          if (data.updateGameResponse.$metadata.httpStatusCode === 200) {
            setEditMessage('Your game was updated successfully!');
          } else {
            setEditError(true);
            setEditMessage(data.message);
          }
        } else {
          // /api/createGame directly adds to DB with DynamoDB SDK
          const response = await fetch('/api/createGame', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newGame),
          });
          const data = await response.json();
          console.log(`data from creating game: ${JSON.stringify(data)}`);
          if (data.createGameResponse.$metadata.httpStatusCode === 200) {
            setSubmitMessage(['Game saved!']);
          }
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
      }
      setSavingToDB(false);
    }
  };

  // Reset the current game form
  const handleReset = (e: any) => {
    e.preventDefault();
    localStorage.removeItem('newGameForm');
    setSubmitError(false);
    setSubmitMessage([]);
    saveForm(defaultGameData);
    setNewGame(defaultGameData);
  };

  const minutes = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
  return (
    <>
      {tooManyGames && (
        <div
          role='alert'
          className='alert alert-error lg:max-w-2xl text-white bg-rose-900'
        >
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
          <span data-test='tooManyGames-error'>
            Only 3 games may be created per day. You can create another game in{' '}
            {Number(
              (86400000 - (Date.now() - user.recentGameTimestamps[0])) /
                1000 /
                60 /
                60
            ).toFixed(1)}{' '}
            hours.
          </span>
        </div>
      )}
      {/* Update to <form action={...}> when this has been refactored to a server action */}
      <form className='flex flex-col min-h-screen w-11/12 xs:w-4/5 md:w-3/4 gap-8'>
        <div className='flex flex-col gap-4'>
          <h1>Create your Quiz</h1>
          <label htmlFor='gameTitle'>Name your Quiz</label>
          <Input
            fieldType='gameTitle'
            value={newGame.gameTitle}
            placeholder='Room name'
            onChange={handleInputChange}
            required
            dataTest='game-title'
          />
        </div>
        <div className='flex flex-col gap-4 max-w-full'>
          <label htmlFor='gameDescription'>Describe your Quiz</label>
          <TextArea
            fieldType='gameDescription'
            value={newGame.gameDescription}
            placeholder='Describe this room'
            onChange={handleInputChange}
            dataTest='game-description'
          />
        </div>
        <div className='flex flex-col gap-4'>
          <label htmlFor='timeLimit'>
            Time limit:{' '}
            <span className='countdown'>
              <span
                style={
                  { '--value': newGame.timeLimit / 60 } as React.CSSProperties
                }
                className='text-right mr-1'
              ></span>
            </span>
            minutes
          </label>
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
            data-testid='time-limit'
          />
          <div className='w-full flex justify-between text-xs sm:text-base pl-px'>
            {minutes.map((item: number) => {
              return (
                <span
                  data-test={`minute-marker-${item}`}
                  key={`minute-${item}`}
                  className={
                    Number(newGame.timeLimit) === item * 60
                      ? 'flex items-center justify-center p-0 sm:p-2 font-bold sm:border sm:border-black rounded-full w-[1rem] min-h-[1rem] sm:w-[2.5rem] sm:min-h-[2.5rem] bg-teal-100'
                      : 'flex items-center justify-center p-0 sm:p-2 w-[1rem] min-h-[1rem] sm:w-[2.5rem] sm:min-h-[2.5rem]'
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

            console.log(`challenge.id: ${challenge.id + '-' + challenge.type}`);

            return (
              <NewChallenge
                key={challenge.type + '-' + challenge.id}
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
                )}`}
                submitError={submitError}
              />
            );
          })
        )}

        <>
          <div className='flex flex-row flex-wrap gap-8 w-full'>
            <div className='flex flex-row flex-wrap gap-8 border-2 border-black p-8 rounded-xl bg-white/50 w-full'>
              <fieldset className='flex flex-col w-full gap-4'>
                <legend className='mb-4 w-full text-center'>
                  Add a challenge:
                </legend>
                <div className='flex w-full justify-around'>
                  <div className='flex gap-2'>
                    <label
                      htmlFor='trivia'
                      className={`p-2 flex flex-col items-center text-center text-2xl gap-2 ${
                        nextChallenge === 'trivia'
                          ? 'border border-black rounded bg-slate-200'
                          : null
                      }`}
                    >
                      <QuestionMarkCircleIcon className='size-24' />
                      Trivia
                    </label>
                    <input
                      type='radio'
                      name='challengeType'
                      id='trivia'
                      value='trivia'
                      className='hidden'
                      onChange={handleNextChallenge}
                      checked={nextChallenge === 'trivia'}
                      required
                    />
                  </div>
                  <div className='flex gap-2'>
                    <label
                      htmlFor='cryptogram'
                      className={`p-2 flex flex-col items-center text-center text-2xl gap-2 ${
                        nextChallenge === 'cryptogram'
                          ? 'border border-black rounded bg-slate-200'
                          : null
                      }`}
                    >
                      <KeyIcon className='size-24' />
                      Cryptogram
                    </label>
                    <input
                      type='radio'
                      name='challengeType'
                      id='cryptogram'
                      value='cryptogram'
                      className='hidden'
                      onChange={handleNextChallenge}
                      checked={nextChallenge === 'cryptogram'}
                    />
                  </div>
                  <div className='flex flex-row-reverse justify-end gap-2'>
                    <label
                      htmlFor='wordScramble'
                      className={`p-2 flex flex-col items-center text-center text-2xl gap-2 ${
                        nextChallenge === 'word-scramble'
                          ? 'border border-black rounded bg-slate-200'
                          : null
                      }`}
                    >
                      <ArrowPathIcon className='size-24' />
                      Word Scramble
                    </label>
                    <input
                      type='radio'
                      name='challengeType'
                      id='wordScramble'
                      value='word-scramble'
                      className='hidden'
                      onChange={handleNextChallenge}
                      checked={nextChallenge === 'word-scramble'}
                    />
                  </div>
                  <div className='flex flex-row-reverse justify-end gap-2'>
                    <label
                      htmlFor='fillInTheBlank'
                      className={`p-2 flex flex-col items-center text-center text-2xl gap-2 ${
                        nextChallenge === 'fill-in-the-blank'
                          ? 'border border-black rounded bg-slate-200'
                          : null
                      }`}
                    >
                      <PuzzlePieceIcon className='size-24' />
                      Fill in the Blank
                    </label>
                    <input
                      type='radio'
                      name='challengeType'
                      id='fillInTheBlank'
                      value='fill-in-the-blank'
                      className='hidden'
                      onChange={handleNextChallenge}
                      checked={nextChallenge === 'fill-in-the-blank'}
                    />
                  </div>
                </div>
              </fieldset>
              <div className='grid place-items-center flex-grow'>
                <button
                  onClick={handleAddChallenge}
                  data-test='add-challenge'
                  data-testid={`add-${nextChallenge}-challenge`}
                >
                  <span>
                    Add {nextChallenge.replaceAll('-', ' ')} Challenge
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
        <div className='flex flex-col sm:flex-row sm:flex-nowrap w-full justify-between'>
          <div className='w-full text-center p-4'>
            {savingToDB && (
              <>
                <span className='loading loading-spinner text-primary text-center'></span>{' '}
                Saving...
              </>
            )}
          </div>
        </div>

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
            // remove onClick when this is refactored to a server action
            onClick={handleSubmit}
            data-test='create-game'
            data-testid='create-game'
            disabled={tooManyGames}
          >
            <span>Create Game</span>
          </button>
        )}
        <div className='flex justify-center w-full form-control w-24'>
          <label className='cursor-pointer label flex flex-row justify-center gap-4'>
            <span>Make Private</span>
            <input
              type='checkbox'
              className='checkbox checkbox-secondary'
              checked={newGame.private}
              onChange={() =>
                setNewGame((prevGame: Game) => ({
                  ...prevGame,
                  private: !prevGame.private,
                }))
              }
            />
          </label>
        </div>
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

        {submitMessage[0] === `Game saved!` && (
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
            <span data-test='edit-message'>{submitMessage}</span>
          </div>
        )}

        {/* Show after creating game or after editing game*/}
        {singleGame?.id === newGame.id && newGame.id !== '' && (
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
            <ul>
              {submitMessage.map((message, index) => (
                <li key={`${message}-${index}`}>{message}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
      {!editGame && (
        <button
          className='red self-end small'
          onClick={handleReset}
          role='reset'
        >
          <span className='group flex gap-1 items-center'>
            Reset
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='stroke-current group-hover:stroke-red-500 shrink-0 h-6 w-6'
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
          </span>
        </button>
      )}
    </>
  );
}
