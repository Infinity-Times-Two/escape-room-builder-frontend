import Card from './Card';

export default function Modal({
  setIncorrect,
  children,
}: {
  setIncorrect: (value: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <dialog id='my_modal_1' className='modal bg-slate-700/50' open>
      <div className='w-[500px] pr-8'>
        <Card>
          <h3 className='font-bold text-lg'>{children}</h3>
          <button className='small green' onClick={() => setIncorrect(false)}>
            <span>Close</span>
          </button>
        </Card>
      </div>
    </dialog>
  );
}
