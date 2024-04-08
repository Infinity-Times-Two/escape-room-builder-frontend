export default function Card({children }: { children: React.ReactNode }) {
  return (
    <div className='w-full'>
      <div className='rounded-md bg-black font-semibold m-2 self-start'>
        <div className='card bg-white -translate-x-1 -translate-y-1 border-2 border-black rounded-md px-4 @xs:px-12 py-4 sm:py-8 min-h-[120px]'>
          {children}
        </div>
      </div>
    </div>
  );
}
