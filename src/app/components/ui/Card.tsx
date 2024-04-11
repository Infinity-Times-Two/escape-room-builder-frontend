export default function Card({
  children,
  bgColor,
}: {
  bgColor?: string;
  children: React.ReactNode;
}) {
  const colorVariants: { [key: string]: string } = {
    blue: 'bg-blue-200',
    red: 'bg-red-200',
    yellow: 'bg-yellow-200',
    green: 'bg-green-200',
    orange: 'bg-orange-200',
    purple: 'bg-purple-200',
    pink: 'bg-pink-200',
  };

  return (
    <div className='w-full sm:mx-8'>
      <div className='rounded-md bg-black font-semibold m-2 self-start'>
        <div
          className={`card ${
            bgColor ? colorVariants[bgColor] : 'bg-white'
          } -translate-x-1 -translate-y-1 border-2 border-black rounded-md px-4 @xs:px-12 py-4 sm:py-8 min-h-[120px]`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
