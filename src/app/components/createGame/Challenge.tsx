import Input from '../ui/Input';

export default function Challenge({
  index,
  clue,
  description,
  answer,
  onClueChange,
  onDescriptionChange,
  onAnswerChange,
  challengeType,
}: {
  index: number;
  clue: string | string[] | undefined;
  description: string | undefined;
  answer: string | undefined;
  onClueChange(e: any, index: number | undefined): void;
  onDescriptionChange(e: any, index: number | undefined): void;
  onAnswerChange(e: any, index: number | undefined): void;
  challengeType: string;
}) {
  return (
    <div key={`${challengeType}-${index}`}>
      <h3 className='mb-6'>New {challengeType} Challenge</h3>
      <label htmlFor={`challenge-description-${index}`} className=''>
        Description
      </label>
      <Input
        fieldType={`challenge-description-${index}`}
        value={description}
        placeholder={`${challengeType} description`}
        onChange={onDescriptionChange}
        key={`challenge-description-${index}`}
      />
      <label htmlFor={`challenge-clue-${index}`}>Clue</label>
      <Input
        fieldType={`challenge-clue-${index}`}
        value={clue}
        placeholder={`${challengeType} clue`}
        onChange={onClueChange}
        key={`challenge-clue-${index}`}
      />
      <label htmlFor={`challenge-answer-${index}`}>Answer</label>
      <Input
        fieldType={`challenge-answer-${index}`}
        value={answer}
        placeholder={`${challengeType} answer`}
        onChange={onAnswerChange}
        key={`challenge-answer-${index}`}
      />
    </div>
  );
}
