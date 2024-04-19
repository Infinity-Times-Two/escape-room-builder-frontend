import Card from './Card';

export default function Modal({
  setIncorrect,
  children,
}: {
  setIncorrect: (value: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <dialog id='my_modal_1' className='absolute top-0 w-full h-full grid place-items-center bg-slate-700/50 border-none' open>
      <div className='w-[500px] pr-8'>
        <Card>
          <h3 className='font-bold text-lg text-neutral-800'>{children}</h3>
          <button className='small green' onClick={() => setIncorrect(false)}>
            <span>Close</span>
          </button>
        </Card>
      </div>
    </dialog>
  );
}
