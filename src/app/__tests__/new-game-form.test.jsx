import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, fireEvent } from '@testing-library/react';
import NewGameForm from '../components/createGame/NewGameForm';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ status: 200 }),
  })
);

describe('New Game Form', () => {
  it('renders all inputs', () => {
    const { getByLabelText, getByText } = render(<NewGameForm />);

    const gameTitle = getByLabelText('Name your Escape room');
    expect(gameTitle).toBeInTheDocument();
    const gameDescription = getByLabelText('Describe your Escape room');
    expect(gameDescription).toBeInTheDocument();
  });
});

describe('Handle form inputs and submission', () => {
  it('Updates the title and description', async () => {
    const user = userEvent.setup();
    const { getByLabelText } = render(<NewGameForm />);

    // Change title
    const gameTitle = getByLabelText('Name your Escape room');
    await user.click(gameTitle);
    await user.keyboard('New game title');
    expect(gameTitle.value).toBe('New game title');

    // Change description
    const gameDescription = getByLabelText('Describe your Escape room');
    await user.click(gameDescription);
    await user.keyboard('New game description');
    expect(gameDescription.value).toBe('New game description');

    // Change time limit
    const timeLimit = getByLabelText('Set time limit (minutes)');
    fireEvent.change(timeLimit, { target: { value: 1800 } }); // Change value to 1800
    expect(timeLimit.value).toBe('1800');
  });

  it('Adds inputs to challenges', async () => {
    const { getByLabelText, getAllByLabelText, getByTestId, getByText, getByRole } =
      render(<NewGameForm />);
    const user = userEvent.setup();

    // Add Trivia clue
    const triviaClue = getByLabelText('Question (required)');
    await user.click(triviaClue);
    await user.keyboard('Trivia question #1');
    expect(triviaClue.value).toBe('Trivia question #1');

    // Add Caesar Cypher description
    const cypherDesc = getByLabelText('Describe the word to be decrypted');
    await user.click(cypherDesc);
    await user.keyboard('Decrypt this phrase');
    expect(cypherDesc.value).toBe('Decrypt this phrase');
    const encryptButton = getByTestId('1-encrypt-button')
    await user.click(encryptButton)
    const cypherClue = getByTestId('challenge-1-caesar-cypher-clue')
    expect(cypherClue.value).not.toBeNull();

    // Add Word Scramble answer
    const scrambleAnswer = getAllByLabelText('Answer (required)');
    const scrambleButton = getByTestId('2-scramble-button');
    await user.click(scrambleAnswer[2]);

    // Invalid
    await user.keyboard('Unscramble these');
    await user.click(scrambleButton);
    const warning = getByText(/Please enter at least 3 words/);
    expect(warning).toBeInTheDocument();
    await user.click(scrambleAnswer[2]);

    // Add a word to make it valid
    await user.keyboard(' words{enter}');
    expect(scrambleAnswer[2].value).toBe('Unscramble these words');
    expect(warning).not.toBeInTheDocument();

    // Remove a challenge
    const removeCaesarCypher = getByTestId('remove-caesar-cypher-1');
    user.click(removeCaesarCypher);
    const removeTrivia = getByTestId('remove-trivia-0');
    user.click(removeTrivia);
  });

  it('submits the form', async () => {
    const { getByTestId, getByText } = render(<NewGameForm />);
    const user = userEvent.setup();

    const submitButton = getByTestId('create-game');
    await user.click(submitButton);
    const warning = getByText('Some challenge clues and answers are empty')
    expect(warning).toBeInTheDocument();
    // const playButton = getByTestId('play-game');
    // expect(playButton).toBeInTheDocument();
  });


  it('selects a challenge type and adds a new challenge to the form', async () => {
    jest.clearAllMocks();
    const { getByTestId, queryByTestId, getByLabelText } = render(
      <NewGameForm />
    );

    const user = userEvent.setup();
    // Verify that initially there are 3 challenges
    expect(queryByTestId('caesar-cypher-3')).toBeNull();

    // Add a new challenge
    const caesarCypherRadioButton = getByLabelText('Caesar Cypher');
    await user.click(caesarCypherRadioButton);

    const addChallengeButton = getByTestId('add-caesar-cypher-challenge');
    await user.click(addChallengeButton);

    // Verify the new challenge was added
    const newChallenge = getByTestId('caesar-cypher-3');
    expect(newChallenge).toBeInTheDocument();
  });

  window.scrollTo = jest.fn(); // for handleRemoveChallenge

  it('removes a challenge from the form', () => {
    jest.clearAllMocks();

    const { getByTestId, queryByTestId } = render(<NewGameForm />);

    // Verify that initially there are 3 challenges
    expect(queryByTestId('trivia-0')).toBeInTheDocument();
    // Remove the challenge
    const removeChallengeButton = getByTestId('remove-trivia-0');
    fireEvent.click(removeChallengeButton);
    // Verify the challenge was remove
    expect(queryByTestId('trivia-0')).toBeNull();
  });

  it('resets the form when Reset button is clicked', async () => {
    const { getByLabelText, getByRole } = render(<NewGameForm />);

    const gameTitle = getByLabelText('Name your Escape room');
    const gameDescription = getByLabelText('Describe your Escape room');
    expect(gameTitle.value).toBe('New game title');
    expect(gameDescription.value).toBe('New game description');

    const user = userEvent.setup();

    const resetButton = getByRole('reset');
    await user.click(resetButton);

    expect(gameTitle.value).toBe('');
    expect(gameDescription.value).toBe('');
  });
});
