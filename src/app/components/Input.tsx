type InputProps = {
  type: string;
  placeholder: string;
};

export default function Input({ type, placeholder }: InputProps) {
  return (
    <div className='rounded-md bg-black font-semibold m-2'>
      <input
        type={type}
        placeholder={placeholder}
        className='input -translate-x-1 -translate-y-1 input-bordered border-black border-2 focus:outline-none focus:border-black w-full max-w-xs'
      />
    </div>
  );
}
