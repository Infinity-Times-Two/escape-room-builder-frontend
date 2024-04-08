import { ChangeEvent } from 'react';

type TextAreaProps = {
  fieldType: string;
  placeholder: string;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string;
  dataTest?: string;
};

export default function TextArea({
  fieldType,
  placeholder,
  onChange,
  value,
  dataTest,
}: TextAreaProps) {
  return (
    <div className='rounded-md bg-black font-semibold w-full m-2'>
      <textarea
        data-type={fieldType}
        data-test={dataTest}
        id={fieldType}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className='textarea textarea-md bg-white pt-4 text-2xl w-full -translate-x-1 -translate-y-1 input-bordered border-black border-2 focus:outline-none focus:border-black'
      />
    </div>
  );
}
