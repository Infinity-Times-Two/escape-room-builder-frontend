import { Challenge } from "@/app/types/types";

type CardProps = {
  roomName: string;
  author: string;
  theme: string;
  challenges: number | undefined;
  timeLimit: number;
  description: string;
  titleBackgroundColor: string;
  bodyBackgroundColor: string;
};

const brickPattern = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='84' height='88' viewBox='0 0 84 88' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Page-1' fill='none' fill-rule='evenodd'%3E%3Cg id='brick-wall' fill='%23D3D3D3' fill-opacity='0.25'%3E%3Cpath d='M0 0h84v88H0V0zm2 2h80v40H2V2zM0 46h40v40H0V46zm44 0h40v40H44V46z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
};

export default function GameCard({
  roomName,
  author,
  theme,
  challenges,
  timeLimit,
  description,
  titleBackgroundColor,
  bodyBackgroundColor,
}: CardProps) {
  const timeInMinutes = (timeLimit / 60).toFixed(2);
  const formattedTime = parseFloat(timeInMinutes);
  return (
    <div className='rounded-md bg-black font-semibold w-[300px] sm:w-[350px] m-2 self-start '>
      <div className='card bg-white -translate-x-1 -translate-y-1 border-2 border-black rounded-md hover:-translate-y-2 hover:-translate-x-2 transition-all'>
        {roomName ? <div
          className={`card-title flex flex-col bg-${titleBackgroundColor}-100 px-4 py-5 border-b-2 border-black rounded-t`}
        >
          <h3 className='text-center'>{roomName}</h3>
          <p className='text-base'>By {author}</p>
        </div>
        : null }
        <div
          className={`card-body bg-${bodyBackgroundColor}-50 px-6 py-12 flex flex-col gap-6 rounded-md`}
          style={brickPattern}
        >
          <div className='chip'>
            <span>{formattedTime} minutes</span>
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
