import GameCard from '../components/ui/GameCard';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';

const room = {
  name: 'Game Card',
  author: 'Author',
  theme: 'none',
  challenges: 5,
  timeLimit: 900,
  description:
    'A brief description of the Quiz that makes it sound extremely fun and you want to play it!',
  titleBg: 'yellow',
  bodyBg: 'green',
};

let formattedTime: { minutes: string; seconds: string } = {
  minutes: '13',
  seconds: '37',
};

export default function UIKit() {
  return (
    <div className='flex flex-col items-center justify-start sm:mx-16 lg:mx-0 min-h-screen gap-16 border-x border-t pt-8 border-black bg-indigo-50'>
      <h1>UI Kit</h1>
      <p className='text-xl px-4'>
        The UI is built with DaisyUI components customized with Tailwind CSS.
      </p>
      <div className='flex flex-col gap-4 w-full items-center justify-center border-b border-black pb-8 px-4'>
        <h2>Buttons</h2>
        <div className='flex flex-wrap items-start w-full justify-center pb-8 px-4'>
          <button>
            <span>Button</span>
          </button>
          <button className='green'>
            <span>Button</span>
          </button>
          <button className='red large'>
            <span className='text-nowrap'>Large Button</span>
          </button>
          <button className='xl'>
            <span>XL Button</span>
          </button>
        </div>
      </div>
      <div className='flex flex-col gap-4 w-full items-center justify-center border-b border-black pb-8 px-4'>
        <h2>Badges</h2>

        <div className='flex flex-wrap w-full justify-center items-center pb-8 px-4'>
          <div className='badge'>
            <span>Default Badge</span>
          </div>
          <div className='badge red'>
            <span>Red Badge</span>
          </div>
          <div className='badge blue'>
            <span>Blue Badge</span>
          </div>
          <div className='badge orange'>
            <span>Orange Badge</span>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4 w-full items-center justify-center border-b border-black pb-8'>
        <h2>Cards</h2>
        <div className='flex flex-wrap items-start gap-8 w-full justify-center pb-8'>
          <GameCard
            roomName={room.name}
            author={room.author}
            theme={room.theme}
            challenges={room.challenges}
            timeLimit={room.timeLimit}
            description={room.description}
            titleBackgroundColor={room.titleBg}
            bodyBackgroundColor={room.bodyBg}
          />
          <Card>
            <p>Info Card</p>
          </Card>
        </div>
      </div>
      <div className='flex flex-col gap-4 w-full items-center pb-8 px-4'>
        <h2>Inputs</h2>
        <div>
          <Input fieldType='text' placeholder='Input' />
        </div>
        <div>
          <TextArea fieldType='sampleTextarea' placeholder='TextArea' />
        </div>
      </div>
      <div className='flex flex-col gap-4 w-full items-center justify-center border-b border-black pb-8'>
        <h2>Timer</h2>
        <div className='flex flex-wrap items-start gap-8 w-full justify-center pb-8'>
          <div className='flex justify-center m-6 min-w-[200px]'>
            <div className='flex flex-row nowrap justify-between gap-2 rounded-full bg-white min-w-[250px] text-black text-xl font-semibold border-2 border-black py-1.5 px-8 tracking-wider'>
              <span>Time left:</span>{' '}
              <span>
                {Number(formattedTime.minutes) < 300 &&
                  formattedTime.minutes + 'm ' + formattedTime.seconds + 's'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div> 
  );
}
