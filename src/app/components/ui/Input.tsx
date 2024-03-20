import { ChangeEvent } from 'react';

type InputProps = {
  fieldType: string;
  placeholder: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>, index?: number) => void;
  onBlur?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string | string[] | undefined;
  disabled?: boolean;
  required?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  dataTest?: string;
};

export default function Input({ fieldType, placeholder, onChange, value, disabled, required, onKeyDown, dataTest }: InputProps) {
  return (
    <div className='rounded-md bg-black font-semibold m-2'>
      <input
        data-type={fieldType}
        data-test={dataTest}
        name={fieldType}
        id={fieldType}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={value}
        className='rounded px-4 pt-3 pb-4 bg-white text-5xl w-full -translate-x-1 -translate-y-1 input-bordered border-black border-2 focus:outline-none focus:border-black w-full'
        disabled={disabled}
        required={required}
      />
    </div>
  );
}
