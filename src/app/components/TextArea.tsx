type TextAreaProps = {
  placeholder: string;
};

export default function Input({ placeholder }: TextAreaProps) {
  return (
    <div className='rounded-md bg-black font-semibold m-2 sm:min-w-[500px]'>
      <textarea
        placeholder={placeholder}
        className='textarea text-base -translate-x-1 -translate-y-1 input-bordered border-black border-2 focus:outline-none focus:border-black min-w-[300px] sm:min-w-[500px]'
      />
    </div>
  );
}
