'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import { Game, Challenge } from '@/app/types/types';

interface FillInTheBlankChallengeProps {
  currentChallenge: Challenge;
  nextChallenge: number;
  currentGame: Game;
}

interface Word {
  word: string;
  hidden: boolean;
  index: number;
}

export default function FillInTheBlankChallenge({
  currentChallenge,
  nextChallenge,
  currentGame,
}: FillInTheBlankChallengeProps) {
  const [answer, setAnswer] = useState<Word[]>(
    Array.isArray(currentChallenge.clue)
      ? currentChallenge.clue.map((word, index) => ({
          word,
          hidden: false,
          index: index,
        }))
      : [{ word: currentChallenge.clue, hidden: false, index: 0 }]
  );

  let numberOfWords = Math.ceil(answer.length * 0.25);
  const [removedWords, setRemovedWords] = useState<Word[]>([]);

  const [removedWordIndexes, setRemovedWordIndexes] = useState<number[]>([]);
  const [nextIndex, setNextIndex] = useState<number>(0);
  const [incorrect, setIncorrect] = useState<boolean>(false);
  const [correct, setCorrect] = useState<boolean>(false);

  const router = useRouter();

  // Select a % of words to be removed from the answer
  const selectWords = () => {
    let newRemovedWords: Word[] = [];
    setRemovedWordIndexes([]);
    // Making a copy with [...answer] causes extra words to be selected when useEffect runs twice in development
    let newAnswer = Array.isArray(currentChallenge.clue)
      ? currentChallenge.clue.map((word, index) => ({
          word,
          hidden: false,
          index: index,
        }))
      : [{ word: currentChallenge.clue, hidden: false, index: 0 }];
    
    while (newRemovedWords.length < numberOfWords) {
      let randomIndex = Math.floor(Math.random() * newAnswer.length);
      // Skip this unless it generated a unique randomIndex
      // This:
      // 1. Saves the indexes of the removed words to help add them to the answer
      // 2. Saves the removed words
      if (!newRemovedWords.some((element) => element.index === randomIndex)) {
        setRemovedWordIndexes((prev) => [...prev, randomIndex].sort());
        newRemovedWords.push({
          word: newAnswer[randomIndex].word,
          hidden: false,
          index: newAnswer[randomIndex].index,
        });
        newAnswer[randomIndex].word = '';
        newAnswer[randomIndex].hidden = true;
      }
    }
    setRemovedWords(newRemovedWords);
    setAnswer(newAnswer);
  };

  // "Sends" the clicked word to the first blank word in the answer box
  const handleClueClick = (word: Word) => {
    let newWords = [...removedWords];
    newWords.map((newWord) => {
      newWord.word === word.word ? (newWord.hidden = !newWord.hidden) : newWord;
    });
    setRemovedWords(newWords);
    let newAnswer = [...answer];
    newAnswer.map((revealWord) => {
      if (revealWord.index === removedWordIndexes[nextIndex]) {
        revealWord.word = word.word;
        // find the first available blank word
        const isBlank = (element: Word) => element.word === ''
        const firstAvailableIndex = newAnswer.findIndex(isBlank)
        // get the index of the removedWordIndex
        const matchesIndex = (index: number) => index === firstAvailableIndex
        const next = removedWordIndexes.findIndex(matchesIndex)
        setNextIndex((prevIndex) => (prevIndex = next));
      }
      return revealWord;
    });
    setAnswer(newAnswer);
  };

  // "Sends" the word back to the clue box
  const handleAnswerClick = (word: Word) => {
    let newWords = [...removedWords];

    // Just toggles visiblity, doesn't rearrange
    newWords.map((newWord) => {
      newWord.word === word.word ? (newWord.hidden = !newWord.hidden) : newWord;
    });
    setRemovedWords(newWords);

    // Makes the clicked answer word blank and decrements next index (where the next word will be placed)
    let newAnswer = [...answer];
    newAnswer.map((revealWord) => {
      if (revealWord.index === word.index) {
        revealWord.word = '';
        // find the index of the first word with a blank word... thank you MDN!
        const isBlank = (element: Word) => element.word === ''
        const firstAvailableIndex = newAnswer.findIndex(isBlank)
        // get the index of the removedWordIndex
        const matchesIndex = (index: number) => index === firstAvailableIndex
        const next = removedWordIndexes.findIndex(matchesIndex)
        setNextIndex((prevIndex) => (prevIndex = next));
      }
      return revealWord;
    });
    setAnswer(newAnswer);
  };
  
  useEffect(() => {
    console.log(nextIndex)
  }, [nextIndex])

  useEffect(() => {
    selectWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Concatenates all answer words to be checked against the answer
    let checkAnswer = '';
    for (let i = 0; i < answer.length; i++) {
      checkAnswer += answer[i].word;
      if (i === answer.length - 1) break;
      checkAnswer += ' ';
      console.log(`"${checkAnswer}"`);
    }
    console.log('Real answer:');
    console.log(currentChallenge.answer.toLowerCase());
    if (checkAnswer === currentChallenge.answer.toLowerCase()) {
      if (nextChallenge === currentGame.challenges.length) {
        // router.push(`../${currentGame.id}/win`);
        setCorrect(true)
      } else {
        router.push(`./${currentGame.challenges[nextChallenge].id}`);
      }
    } else {
      setIncorrect(true)
    }
  };

  return (
    <div className='flex flex-col gap-2 items-center max-w-full'>
      <Card maxWidth='max-w-[600px]'>
        <div className='flex flex-row gap-2 flex-wrap justify-center'>
          {removedWords.map((word: Word) => (
            <div
              key={word.index}
              className={`badge orange ${word.hidden ? `invisible` : ''}`}
              onClick={() => handleClueClick(word)}
            >
              <span>{word.word}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card maxWidth='max-w-[600px]'>
        <div className='flex flex-row gap-2 flex-wrap justify-center items-center'>
          {answer.map((word: Word) =>
            !word.hidden ? (
              removedWordIndexes.some((index) => word.index === index) ? (
                <div key={word.index} className={`badge orange`}>
                  <span>{word.word}</span>
                </div>
              ) : (
                <span className='text-xl font-bold' key={word.index}>{word.word}</span>
              )
            ) : (
              <div
                key={word.index}
                className={`badge orange`}
                onClick={() => handleAnswerClick(word)}
              >
                <span>{word.word}</span>
              </div>
            )
          )}
        </div>
      </Card>
      <button
        className='large'
        onClick={handleSubmit}
        data-type='challenge-submit'
      >
        <span>Submit</span>
      </button>
      {incorrect && <Modal setIncorrect={setIncorrect}>Incorrect!</Modal>}
      {correct && <Modal setIncorrect={() => setCorrect(false)}>Correct!</Modal>}
    </div>
  );
}
