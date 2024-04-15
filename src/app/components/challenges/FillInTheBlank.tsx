'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import { Game, Challenge } from '@/app/types/types';
import shuffle from 'lodash.shuffle';

interface FillInTheBlankChallengeProps {
  currentChallenge: Challenge;
  nextChallenge: number;
  currentGame: Game;
}

interface Word {
  word: string;
  hidden: boolean;
  remove: boolean;
  index: number;
}

//****************************
//
// currentChallenge.clue is an array of strings.
// The array starts with the answer words in the correct order,
// incorrect words come after the answer at the end of the array.
//
// Strings that begin with ~ are to be removed from the answer
// and supplied as clues. The ~strings embedded in the answer are correct,
// the ~strings at the end of the array are the incorrect words.
//
// The displayed answer is trimmed of the incorrect ~strings by comparing
// the answer length and subtracting the difference with the clue length.
//
// Example:
//
// currentChallenge.clue = ['This', 'is', 'the', '~correct', 'answer', '~funny', '~wrong' ]
// currentChallenge.answer = 'This is the correct answer'
//
// The app will display "This is the _____ answer"
// and show ~correct, ~funny and ~wrong as possible words. It will know that ~correct is correct
//
// It will also account for multiple word clues
//
// currentChallenge.answer is a string with the anwser.
// It is used to find the total number of words in the answer
// as well as determining challenge success on submit.
//
//****************************

export default function FillInTheBlankChallenge({
  currentChallenge,
  nextChallenge,
  currentGame,
}: FillInTheBlankChallengeProps) {
  const [answer, setAnswer] = useState<Word[]>(
    Array.isArray(currentChallenge.clue)
      ? currentChallenge.clue.map((word, index) => {
          if (word[0] === '~') {
            return {
              word,
              hidden: false, // whether it is hidden from clue words
              remove: true, // whether to display a "blank" to be filled
              index: index,
            };
          } else {
            return {
              word,
              hidden: false,
              remove: false,
              index: index,
            };
          }
        })
      : []
  );

  const [removedWords, setRemovedWords] = useState<Word[]>([]);

  const [removedWordIndexes, setRemovedWordIndexes] = useState<number[]>([]);
  const [nextIndex, setNextIndex] = useState<number>(0);
  const [incorrect, setIncorrect] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  // Filter correct and incorrect answer words from answer array
  const filterWords = () => {
    let newRemovedWords: Word[] = [];
    setRemovedWordIndexes([]);
    // Making a copy with [...answer] causes extra words to be selected when useEffect runs twice in development
    let newAnswer = Array.isArray(currentChallenge.clue)
      ? currentChallenge.clue.map((word, index) => {
          if (word[0] === '~') {
            const removedWord = {
              word: word.slice(1),
              hidden: false,
              remove: true,
              index: index,
            };
            newRemovedWords.push(removedWord);
            setRemovedWords(newRemovedWords);
            setRemovedWordIndexes((prev) => [...prev, index].sort(sortNumbers));
            const newWord = {
              ...removedWord,
              word: '',
            };
            return newWord;
          } else {
            return {
              word,
              hidden: false,
              remove: false,
              index: index,
            };
          }
        })
      : [];
    newRemovedWords = shuffle(newRemovedWords);

    setRemovedWords(newRemovedWords);
    // Remove extra words from the end of the answer

    // Get the last word of the answer
    const answerArray = currentChallenge.answer.split(' ');
    const lastWord = answerArray[answerArray.length - 1];

    // find last index of the element containing lastWord
    const findLastIndexWithMatch = (array: string[], searchWord: any) => {
      for (let i = array.length - 1; i >= 0; i--) {
        if (searchWord(array[i])) {
          return i;
        }
      }
      return -1;
    };

    let lastIndex: number = 0;
    if (Array.isArray(currentChallenge.clue)) {
      lastIndex = findLastIndexWithMatch(currentChallenge.clue, (item: any) =>
        item.includes(lastWord)
      );
    }

    // Remove words after the last word so they don't display as blanks
    newAnswer.splice(lastIndex + 1, newAnswer.length - lastIndex);
    setAnswer(newAnswer);
    setLoading(false);
  };

  // "Sends" the clicked word to the first blank word in the answer box
  const handleClueClick = (word: Word) => {
    if (nextIndex === -1) return; // Don't add any more words if all blanks are full
    // Remove the word from clue words
    let newWords = [...removedWords];
    newWords.map((newWord) => {
      newWord.word === word.word ? (newWord.hidden = !newWord.hidden) : newWord;
    });
    setRemovedWords(newWords);

    // Add the word to the first blank space in the answer
    let newAnswer = [...answer];
    newAnswer.map((revealWord) => {
      if (revealWord.index === removedWordIndexes[nextIndex]) {
        revealWord.word = word.word;
        // find the first available blank word
        // TO-DO: next 4 lines are duplicated in handleAnswerClick, refactor for DRY code
        const isBlank = (element: Word) => element.word === '';
        const firstAvailableIndex = newAnswer.findIndex(isBlank);
        // get the index of the removedWordIndex
        const matchesIndex = (index: number) => index === firstAvailableIndex;
        const next = removedWordIndexes.findIndex(matchesIndex);
        setNextIndex((prevIndex) => (prevIndex = next));
      }
      return revealWord;
    });
    setAnswer(newAnswer);
  };

  // "Sends" the word back to the clue box
  const handleAnswerClick = (word: Word) => {
    let newWords = [...removedWords];

    // Toggles visiblity, doesn't rearrange
    newWords.map((newWord) => {
      newWord.word === word.word ? (newWord.hidden = !newWord.hidden) : newWord;
    });
    setRemovedWords(newWords);

    // Makes the clicked answer word blank and decrements next index (where the next word will be placed)
    let newAnswer = [...answer];
    newAnswer.map((revealWord) => {
      if (revealWord.index === word.index) {
        revealWord.word = '';
        // find the index of the first word with a blank word
        const isBlank = (element: Word) => element.word === '';
        const firstAvailableIndex = newAnswer.findIndex(isBlank);
        // get the index of the removedWordIndex
        const matchesIndex = (index: number) => index === firstAvailableIndex;
        const next = removedWordIndexes.findIndex(matchesIndex);
        setNextIndex(next);
      }
      return revealWord;
    });
    setAnswer(newAnswer);
  };

  const punctuationRegex = /^[,.!?]$/;

  useEffect(() => {
    filterWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Concatenates all answer words to be checked against the answer. ❤️ reduce!
    const checkAnswer = answer
      .reduce((acc, cur) => acc + cur.word + ' ', '')
      .trim()
      .toLowerCase()
      .replace(/ (\,|\!|\?|\.)/g, '$1'); // removes single space before , . ! ?

    if (checkAnswer === currentChallenge.answer.toLowerCase()) {
      if (nextChallenge === currentGame.challenges.length) {
        router.push(`../${currentGame.id}/win`);
      } else {
        router.push(`./${currentGame.challenges[nextChallenge].id}`);
      }
    } else {
      setIncorrect(true);
    }
  };

  return (
    <div className='flex flex-col gap-2 items-center max-w-full'>
      <Card>
        <div className='flex flex-row flex-wrap justify-center items-center'>
          {!loading &&
            answer.map((word: Word) =>
              !word.hidden && !word.remove ? (
                removedWordIndexes.some((index) => word.index === index) ? (
                  <div key={word.index} className={`badge mr-0 orange`}>
                    <span>{' ' /* one of the "blanks" to be filled */}</span>
                  </div>
                ) : (
                  <span
                    className={`text-xl ${
                      word.word.match(punctuationRegex) ? `mr-1` : `mx-1`
                    } font-bold`}
                    key={word.index}
                  >
                    {word.word /* a regular word in the answer */}
                  </span>
                )
              ) : (
                <div
                  key={word.index}
                  className={`badge orange`}
                  onClick={() => handleAnswerClick(word)}
                >
                  <span>{word.word /* a word added to a "blank space" */}</span>
                </div>
              )
            )}
          {loading && (
            <div className='flex flex-row flex-wrap gap-y-6 gap-x-4 m-2 justify-center'>
              <div className='skel h-8 w-20'></div>
              <div className='skel h-8 w-14'></div>
              <div className='skel h-8 w-32'></div>
              <div className='skel h-8 w-20'></div>
              <div className='skel h-8 w-28'></div>
              <div className='skel h-8 w-32'></div>
              <div className='skel h-8 w-20'></div>
              <div className='skel h-8 w-14'></div>
              <div className='skel h-8 w-20'></div>
              <div className='skel h-8 w-28'></div>
            </div>
          )}
        </div>
      </Card>
      <Card>
        <p className='text-sm mb-2'>Choose the correct word(s):</p>
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
          {loading && (
            // <div className='flex flex-row flex-wrap gap-y-4 gap-x-8 justify-center'>
            <>
              <div className='skel h-8 w-32 m-2'></div>
              <div className='skel h-8 w-32 m-2'></div>
              <div className='skel h-8 w-32 m-2'></div>
              <div className='skel h-8 w-32 m-2'></div>
              <div className='skel h-8 w-32 m-2``'></div>
            </>
            // </div>
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
    </div>
  );
}

function sortNumbers(a: number, b: number) {
  return a - b;
}
