import Input from "../../ui/Input";

export default function TriviaChallenge({
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
    <div className='border-2 border-black p-8 rounded-xl bg-white/50' key={`${challengeType}-${index}`}>
      <h3 className='mb-6'>New {challengeType} Challenge</h3>
      <label htmlFor={`challenge-clue-${index}`}>Question</label>
      <Input
        fieldType={`challenge-clue-${index}`}
        value={clue}
        placeholder={`${challengeType[0].toUpperCase() + challengeType.substring(1)} question`}
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
