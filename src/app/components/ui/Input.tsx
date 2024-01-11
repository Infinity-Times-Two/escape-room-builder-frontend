import { ChangeEvent } from 'react';

type InputProps = {
  type: string;
  placeholder: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
};

export default function Input({ type, placeholder, onChange, value }: InputProps) {
  return (
    <div className='rounded-md bg-black font-semibold m-2 self-start'>
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className='rounded px-4 py-2 bg-white text-5xl -translate-x-1 -translate-y-1 input-bordered border-black border-2 focus:outline-none focus:border-black w-full max-w-xs'
      />
    </div>
  );
}
