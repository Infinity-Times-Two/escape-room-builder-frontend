import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { encrypt } from '../components/createGame/challengeInputs/CryptogramChallenge';
import { shuffleWords } from '../components/createGame/challengeInputs/WordScrambleChallenge';
import WordScrambleChallenge from '../components/createGame/challengeInputs/WordScrambleChallenge';

describe('Cryptogram encryptor', () => {
  it('encrypts a string', () => {
    const clue = 'apple banana';
    const seed = 4;
    const answer = encrypt(clue, seed);
    expect(answer).toBe('ettpi ferere');
  });
});

describe('Word Scramble function', () => {
  it('scrambles a string of at least 3 words', () => {
    const answer = ['Life,', 'the', 'universe', 'and', 'everything'];
    const clue = shuffleWords(answer);
    expect(clue.length).toBe(answer.length);
    expect(clue).not.toEqual(answer); // it isn't toBe() here because they are not the same object in memory
  });
});
