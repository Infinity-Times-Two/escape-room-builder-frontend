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
  submitError?: boolean;
};

export default function Input({ fieldType, placeholder, onChange, value, disabled, required, onKeyDown, dataTest, submitError }: InputProps) {
  return (
    <div className={`${submitError && value === '' && 'bg-red-500'} rounded-md bg-black font-semibold m-2`}>
      <input
        data-type={fieldType}
        data-test={dataTest}
        data-testid={dataTest}
        // Need to refactor Cypress to accept data-test
        name={fieldType}
        id={fieldType}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={value}
        className={`rounded px-4 pt-3 pb-3 ${submitError && value === '' ? 'bg-red-100 border-red-500 focus:border-red-500' : 'bg-white'} text-2xl sm:text-3xl w-full -translate-x-1 -translate-y-1 border-black border-2 focus:outline-none focus:border-black w-full`}
        aria-disabled={disabled}
        required={required}
      />
    </div>
  );
}
