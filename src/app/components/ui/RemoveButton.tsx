export default function RemoveButton({ onRemove, testId }: { onRemove: (e: any) => void, testId?: string }) {
  return (
    <button
      onClick={onRemove}
      className='btn btn-circle bg-transparent hover:bg-red-500/15 border-0 absolute top-0 right-0 p-0 w-[2.5rem] h-[2.5rem] min-h-[2.5rem]'
      data-testid={testId}
      data-test={testId}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-6 w-6'
        fill='none'
        viewBox='0 0 24 24'
        stroke='red'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='1'
          d='M6 18L18 6M6 6l12 12'
        />
      </svg>
    </button>
  );
}
