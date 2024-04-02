export default function Card({ maxWidth, minWidth, children }: { maxWidth?: string, minWidth?: string, children: React.ReactNode }) {
  return (
    <div className={`${maxWidth ? maxWidth : `max-w-[500px]`} ${minWidth && minWidth} w-full`}>
      <div className='rounded-md bg-black font-semibold m-2 self-start'>
        <div className='card bg-white -translate-x-1 -translate-y-1 border-2 border-black rounded-md px-4 @xs:px-12 py-4 sm:py-8 min-h-[120px]'>
          {children}
        </div>
      </div>
    </div>
  );
}
