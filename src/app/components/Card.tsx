type CardProps = {
  roomName: string;
  challenges: number;
  timeLimit: number;
  description: string;
  titleBackgroundColor: string;
  bodyBackgroundColor: string;
};

const brickPattern = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='84' height='88' viewBox='0 0 84 88' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Page-1' fill='none' fill-rule='evenodd'%3E%3Cg id='brick-wall' fill='%23D3D3D3' fill-opacity='0.25'%3E%3Cpath d='M0 0h84v88H0V0zm2 2h80v40H2V2zM0 46h40v40H0V46zm44 0h40v40H44V46z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
};

export default function Card({
  roomName,
  challenges,
  timeLimit,
  description,
  titleBackgroundColor,
  bodyBackgroundColor,
}: CardProps) {
  return (
    <div className='rounded-md bg-black font-semibold m-2'>
      <div className='card bg-white -translate-x-1 -translate-y-1 border-2 border-black rounded-md max-w-[350px]'>
        <div
          className={`card-title bg-${titleBackgroundColor}-50 px-4 py-5 border-b-2 border-black rounded-t -md`}
        >
          <h3>{roomName}</h3>
        </div>
        <div
          className={`card-body bg-${bodyBackgroundColor}-50 px-6 py-12 flex flex-col gap-6`}
          style={brickPattern}
        >
          <div className='chip'>
            <span>{timeLimit} minutes</span>
          </div>
          <div className='chip'>
            <span>{challenges} challenges</span>
          </div>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}
