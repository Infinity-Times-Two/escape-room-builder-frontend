import FillInTheBlankChallenge from '../components/challenges/FillInTheBlank';

const currentChallenge = {
  id: 'Challenge 1',
  type: 'fill-in-the-blanks',
  description: 'Fill in the blanks',
  clue: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
  answer: 'one two three four five six seven eight nine ten',
}
const nextChallenge = 2;
const singleGame = {
  id: '1',
  gameTitle: 'Test FITB',
  gameDescription: 'Test game for FITB challenge',
  timeLimit: 600,
  theme: '',
  author: 'James',
  authorId: '12345',
  titleBg: 'yellow',
  bodyBg: 'green',
  challenges: [
    {
      id: 'Challenge 1',
      type: '',
      description: '',
      clue: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
      answer: 'one two three four five six seven eight nine ten',
    },
  ],
};

export default function FITB() {
  return (
    <div className='pt-16 sm:pt-0'>
      {/* <h2 className='mb-8'>
        {currentChallenge?.type}: {currentChallenge?.description}
      </h2> */}
      <FillInTheBlankChallenge
        currentChallenge={currentChallenge}
        nextChallenge={1}
        currentGame={singleGame}
      />
    </div>
  );
}
