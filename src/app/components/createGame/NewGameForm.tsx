'use client';
import { useState, useEffect, useContext } from 'react';
import { SingleGame, Challenge } from '../../types/types';
import { UserContext } from '@/app/contexts/userContext';
import NewChallenge from './Challenge';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import { v4 as uuidv4 } from 'uuid';
import { SavedGamesContext } from '@/app/contexts/savedGamesContext';
import { SingleGameContext } from '@/app/contexts/singleGameContext';
import Link from 'next/link';

export default function NewGameForm() {
  const [newGame, setNewGame] = useState<SingleGame>({
    id: '',
    gameTitle: '',
    gameDescription: '',
    timeLimit: 900,
    theme: '',
    author: '',
    bodyBg: '',
    titleBg: '',
    challenges: [
      {
        id: 'challenge-1',
        type: 'trivia',
        description: '',
        clue: '',
        answer: '',
      },
      {
        id: 'challenge-2',
        type: 'caesar cypher',
        description: '',
        clue: '',
        answer: '',
      },
      {
        id: 'challenge-3',
        type: 'word scramble',
        description: '',
        clue: [''],
        answer: '',
      },
    ],
  });

  const { savedGames, setSavedGames } = useContext(SavedGamesContext);
  const { singleGame, setSingleGame } = useContext(SingleGameContext);
  const { user } = useContext(UserContext);
  console.log(user);

  // Set state to saved form in localStorage if one exists
  useEffect(() => {
    const localStorageGameForm: any = localStorage.getItem('newGameForm');
    if (localStorageGameForm !== null) {
      const parsedGame = JSON.parse(localStorageGameForm);
      setNewGame(parsedGame);
    }
  }, []);

  useEffect(() => {
    if (!newGame.id) {
      const newId = uuidv4();
      setNewGame((prevGame: SingleGame) => {
        const newGame = { ...prevGame, id: newId };
        return newGame;
      });
    }

    if (newGame.author === '') {
      const author = user?.firstName;
      if (author) {
        setNewGame((prevGame: SingleGame) => {
          const newGame = { ...prevGame, author: author };
          return newGame;
        });
      } else {
        setNewGame((prevGame: SingleGame) => {
          const newGame = { ...prevGame, author: 'Anonymous' };
          return newGame;
        });
      }
    }
    if (newGame.bodyBg === '') {
      const colours = ['red', 'blue', 'yellow', 'green', 'orange', 'purple'];
      const bodybgIndex = Math.floor(Math.random() * 6);
      const titlebgIndex = Math.floor(Math.random() * 6);
      setNewGame((prevGame: SingleGame) => {
        const newGame = {
          ...prevGame,
          bodyBg: colours[bodybgIndex],
          titleBg: colours[titlebgIndex],
        };
        return newGame;
      });
    }
    localStorage.setItem('newGameForm', JSON.stringify(newGame));
  }, [newGame, user?.firstName]);

  const handleInputChange = (e: any) => {
    setNewGame((prevGame: SingleGame) => {
      let saveGame: SingleGame = prevGame;
      switch (e.target.dataset.type) {
        case 'gameTitle':
          saveGame = { ...prevGame, gameTitle: e.target.value };
          break;
        case 'gameDescription':
          saveGame = { ...prevGame, gameDescription: e.target.value };
          break;
      }
      localStorage.setItem('newGameForm', JSON.stringify(newGame));
      return saveGame;
    });
  };

  const handleTimeLimitChange = (e: any) => {
    setNewGame((prevGame: SingleGame) => {
      const newGame = { ...prevGame, timeLimit: e.target.value };
      localStorage.setItem('newGameForm', JSON.stringify(newGame));
      return newGame;
    });
  };

  const handleClueChange = (e: any, type: string, index: number) => {
    const clue = e.target.value.trim();
    setNewGame((prevGame: SingleGame) => {
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
    setNewGame((prevGame: SingleGame) => {
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
    setNewGame((prevGame: SingleGame) => {
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
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    newGame.challenges.map((challenge) => {
      if (challenge.type === 'word scramble') {
        const sentence = challenge.clue;
        let sentenceArray: string[] = [];
        if (typeof sentence === 'string') {
          sentenceArray = sentence.split(' ');
        }
        challenge.clue = sentenceArray;
      }
    });
    // When saving games is implemented, set state, save to localstorage
    // and add to user's array of saved games in DB
    // setSavedGames((prevGames) => [ ...prevGames, newGame]);
    setSingleGame(newGame);
    localStorage.setItem('singleGame', JSON.stringify(newGame));
    const response = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGame),
    });
    const data = await response.json();
    console.log(data.message);
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
          />
        </div>
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
            className='range'
            step='300'
            onChange={handleTimeLimitChange}
            id='timeLimit'
          />

          <div className='w-full flex justify-between text-sm px-0.5'>
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
              challengeType={challenge.type}
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
          <button className='w-60 self-center' onClick={handleSubmit}>
            <span>Create Game</span>
          </button>
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
      </div>
      {/* 
      <button onClick={handleAddChallenge}>
        <span>Add Challenge</span>
      </button>

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
