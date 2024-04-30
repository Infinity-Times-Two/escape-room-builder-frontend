import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, fireEvent, getByTestId } from '@testing-library/react';
import NewGameForm from '../components/createGame/NewGameForm';
import { SavedGamesContextProvider } from '../contexts/savedGamesContext';
import { SingleGameContextProvider } from '../contexts/singleGameContext';
import { UserContextProvider } from '../contexts/userContext';
import CreateButton from '../components/ui/CreateButton';

describe('Context providers render content', () => {
  it('SavedGamesContextProvider renders correctly', () => {
    // Render the SavedGamesContextProvider
    const { getByText } = render(
      <SavedGamesContextProvider>
        <div>Test Content</div>
      </SavedGamesContextProvider>
    );

    // Check if the provider renders the children correctly
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('SingleGameContextProvider renders correctly', () => {
    // Render the SingleGameContextProvider
    const { getByText } = render(
      <SingleGameContextProvider>
        <div>Test Content</div>
      </SingleGameContextProvider>
    );

    // Check if the provider renders the children correctly
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('UserContextProvider renders correctly', () => {
    // Render the UserContextProvider
    const { getByText } = render(
      <UserContextProvider>
        <div>Test Content</div>
      </UserContextProvider>
    );

    // Check if the provider renders the children correctly
    expect(getByText('Test Content')).toBeInTheDocument();
  });
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ status: 200 }),
  })
);

describe('New Game Form', () => {
  it('renders all inputs', () => {
    const { getByLabelText } = render(<NewGameForm />);

    const gameTitle = getByLabelText('Name your Quiz');
    expect(gameTitle).toBeInTheDocument();
    const gameDescription = getByLabelText('Describe your Quiz');
    expect(gameDescription).toBeInTheDocument();
  });
});

describe('Handle form inputs and submission', () => {
  it('Updates the title and description', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByTestId } = render(<NewGameForm />);

    // Change title
    const gameTitle = getByLabelText('Name your Quiz');
    await user.click(gameTitle);
    await user.keyboard('New game title');
    expect(gameTitle.value).toBe('New game title');

    // Change description
    const gameDescription = getByLabelText('Describe your Quiz');
    await user.click(gameDescription);
    await user.keyboard('New game description');
    expect(gameDescription.value).toBe('New game description');

    // Change time limit
    const timeLimit = getByTestId('time-limit');
    fireEvent.change(timeLimit, { target: { value: 1800 } }); // Change value to 1800
    expect(timeLimit.value).toBe('1800');
  });

  it('Adds inputs to challenges', async () => {
    const {
      getByLabelText,
      getAllByLabelText,
      getByTestId,
      getByText,
      getByPlaceholderText,
    } = render(<NewGameForm />);
    const user = userEvent.setup();

    // Add Trivia clue
    const triviaClue = getByLabelText('Question (required)');
    await user.click(triviaClue);
    await user.keyboard('Trivia question #1');
    expect(triviaClue.value).toBe('Trivia question #1');
    const triviaAnswer = getByTestId('challenge-0-trivia-answer');
    await user.click(triviaAnswer);
    await user.keyboard('Trivia answer #1');

    // Add Cryptogram description
    const cipherDesc = getByTestId('challenge-1-cryptogram-answer');
    await user.click(cipherDesc);
    await user.keyboard('Decrypt this phrase');
    expect(cipherDesc.value).toBe('Decrypt this phrase');
    const encryptButton = getByTestId('1-encrypt-button');
    await user.click(encryptButton);
    const cipherClue = getByTestId('challenge-1-cryptogram-clue');
    expect(cipherClue.value).not.toBeNull();

    // Add Word Scramble description & answer
    const scrambleDescription = getByPlaceholderText(
      'Describe the phrase to be solved'
    );
    await user.click(scrambleDescription);
    await user.keyboard('Word scramble description');
    expect(scrambleDescription.value).toBe('Word scramble description');
    const scrambleAnswer = getAllByLabelText('Answer (required)');
    const scrambleButton = getByTestId('2-scramble-button');
    await user.click(scrambleAnswer[2]);

    // - Invalid
    await user.keyboard('same same');
    await user.click(scrambleButton);
    const warning1 = getByText(/Please enter at least 3 words/);
    expect(warning1).toBeInTheDocument();
    await user.click(scrambleAnswer[2]);

    // - Add the same word for error
    await user.keyboard(' same{enter}');
    await user.click(scrambleButton);
    const warning2 = getByText(/They are all the same word!/);
    expect(warning2).toBeInTheDocument();
    await user.click(scrambleAnswer[2]);

    // Add a word to make it valid
    await user.keyboard(' different{enter}');
    await user.click(scrambleButton);
    expect(scrambleAnswer[2].value).toBe('same same same different');
    await user.click(scrambleAnswer[2]);
    expect(warning2).not.toBeInTheDocument();

    // Remove a challenge
    const removeCryptogram = getByTestId('remove-cryptogram-1');
    user.click(removeCryptogram);
    const removeTrivia = getByTestId('remove-trivia-0');
    user.click(removeTrivia);
  });

  it('submits the form', async () => {
    const { getByTestId, getByText, getByRole, getAllByRole } = render(
      <NewGameForm />
    );
    const user = userEvent.setup();

    const submitButton = getByTestId('create-game');
    await user.click(submitButton);
    // const submitWarning1 = getByText('Some challenge clues and answers are empty');
    // expect(submitWarning1).toBeInTheDocument();
    // const warnings = getByRole('alert')
    // console.log(warnings)
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
    expect(queryByTestId('cryptogram-3')).toBeNull();

    // Add a new challenge
    const cryptogramRadioButton = getByLabelText('Cryptogram');
    await user.click(cryptogramRadioButton);

    const addChallengeButton = getByTestId('add-cryptogram-challenge');
    await user.click(addChallengeButton);

    // Verify the new challenge was added
    const newChallenge = getByTestId('cryptogram-3');
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

    const gameTitle = getByLabelText('Name your Quiz');
    const gameDescription = getByLabelText('Describe your Quiz');
    expect(gameTitle.value).toBe('New game title');
    expect(gameDescription.value).toBe('New game description');

    const user = userEvent.setup();

    const resetButton = getByRole('reset');
    await user.click(resetButton);

    expect(gameTitle.value).toBe('');
    expect(gameDescription.value).toBe('');
  });
});

it('Adds a FITB challenge and renders the answer & clues', async () => {
  jest.clearAllMocks();
  const { getByLabelText, getByTestId, getByText } = render(<NewGameForm />);
  const user = userEvent.setup();

  const fillInTheBlankRadioButton = getByLabelText('Fill in the Blank');
  await user.click(fillInTheBlankRadioButton);
  const addChallengeButton = getByTestId('add-fill-in-the-blank-challenge');
  await user.click(addChallengeButton);

  const answer = getByTestId('challenge-3-fill-in-the-blank-answer')
  await user.click(answer)
  await user.keyboard('Challenge answer with blank spaces')

  // Remove a word - expect a blank space and
  const wordToRemove = getByTestId('challenge-3-fill-in-the-blank-highlight-word-3')
  await user.click(wordToRemove)
  const blank = getByText('________')
  expect(blank).toBeInTheDocument();
  const correctClueWord = getByTestId('challenge-3-fill-in-the-blank-correct-clue-word-3')
  expect(correctClueWord).toBeInTheDocument();

  const incorrectWordInput = getByTestId('challenge-3-fill-in-the-blank-incorrect-words')
  await user.click(incorrectWordInput)
  await user.keyboard('incorrect, words')
  const incorrectClueWord = getByTestId('challenge-3-fill-in-the-blank-incorrect-clue-word-0')
  expect(incorrectClueWord).toBeInTheDocument();
});

describe('Testing misc UI', () => {
  it('Renders a button and can be clicked', async () => {
    const { getByTestId } = render(<CreateButton />);
    const user = userEvent.setup();
    const button = getByTestId('create');
    await user.click(button);
  });
});
