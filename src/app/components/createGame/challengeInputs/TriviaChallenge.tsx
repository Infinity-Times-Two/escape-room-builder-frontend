import Input from '../../ui/Input';
import RemoveButton from '../../ui/RemoveButton';

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
  dataTest,
  submitError
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
  dataTest: string;
  submitError: boolean;
}) {
  return (
    <div
      className='border-2 border-black p-8 rounded-xl bg-white/50 relative'
      key={`${challengeType}-${index}`}
      id={`${challengeType}-${index}`}
      data-testid={`${challengeType}-${index}`}
    >
      <p className='absolute top-0 left-0 p-6 text-2xl'>{index + 1}</p>
      <h3 className='mb-6'>New {challengeType} Challenge</h3>
      <label htmlFor={`challenge-clue-${index}`}>Question (required)</label>
      <Input
        fieldType={`challenge-clue-${index}`}
        value={clue}
        placeholder={`${
          challengeType[0].toUpperCase() + challengeType.substring(1)
        } question*`}
        onChange={onClueChange}
        key={`challenge-clue-${index}`}
        dataTest={`${dataTest}-clue`}
        submitError={submitError}
        required
      />
      <label htmlFor={`challenge-answer-${index}`}>Answer (required)</label>
      <Input
        fieldType={`challenge-answer-${index}`}
        value={answer}
        placeholder='Answer*'
        onChange={onAnswerChange}
        key={`challenge-answer-${index}`}
        dataTest={`${dataTest}-answer`}
        submitError={submitError}
        required
      />
      <RemoveButton onRemove={onRemove} testId={`remove-trivia-${index}`} />
    </div>
  );
}
