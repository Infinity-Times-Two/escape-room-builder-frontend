import Input from '../../ui/Input';

export default function TriviaChallenge({
  index,
  clue,
  description,
  answer,
  onClueChange,
  onDescriptionChange,
  onAnswerChange,
  onRemove,
  challengeType,
}: {
  index: number;
  clue: string | string[] | undefined;
  description: string | undefined;
  answer: string | undefined;
  onClueChange(e: any, index: number | undefined): void;
  onDescriptionChange(e: any, index: number | undefined): void;
  onAnswerChange(e: any, index: number | undefined): void;
  onRemove(e: any): void;
  challengeType: string;
}) {
  return (
    <div
      className='border-2 border-black p-8 rounded-xl bg-white/50 relative'
      key={`${challengeType}-${index}`}
      id={`${challengeType}-${index}`}
    >
      <button
        onClick={onRemove}
        className='btn btn-circle btn-outline absolute top-0 right-0'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1'
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </button>
      <h3 className='mb-6'>New {challengeType} Challenge</h3>
      <label htmlFor={`challenge-clue-${index}`}>Question</label>
      <Input
        fieldType={`challenge-clue-${index}`}
        value={clue}
        placeholder={`${
          challengeType[0].toUpperCase() + challengeType.substring(1)
        } question`}
        onChange={onClueChange}
        key={`challenge-clue-${index}`}
      />
      <label htmlFor={`challenge-answer-${index}`}>Answer</label>
      <Input
        fieldType={`challenge-answer-${index}`}
        value={answer}
        placeholder='Answer'
        onChange={onAnswerChange}
        key={`challenge-answer-${index}`}
      />
    </div>
  );
}
