export default function GameCardSkeleton() {
  return (
    <div className='rounded-md bg-gray-200 font-semibold w-[300px] sm:w-[350px] m-2 self-start '>
      <div className='card bg-[#f4f1f7] -translate-x-1 -translate-y-1 border-2 border-gray-200 rounded-md hover:-translate-y-2 hover:-translate-x-2 transition-all'>
        <div
          className={`card-title flex flex-col bg-gray-50 px-4 py-5 border-b-2 border-gray-200 rounded-t`}
        >
          <div className='skel h-12 w-full'></div>
          <div className='skel h-6 w-28'></div>
        </div>
        <div
          className={`card-body bg-gray-50 px-6 py-12 flex flex-col gap-6 rounded-md`}
        >
          <div className='skel chip'>
            <span className='text-transparent block w-32'>Loading</span>
          </div>
          <div className='skel chip'>
            <span className='text-transparent block w-36'>Loading</span>
          </div>
          <div className='skel h-6 w-24'></div>
        </div>
      </div>
    </div>
  );
}
