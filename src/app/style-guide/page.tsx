import GameCard from '../components/ui/GameCard';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';

const room = {
  name: 'Game Card',
  challenges: 5,
  timeLimit: 900,
  description:
    'A brief description of the escape room that makes it sound extremely fun and you want to play it!',
  titleBg: 'yellow',
  bodyBg: 'green',
};

export default function About() {
  return (
    <div className='flex flex-col items-center justify-start sm:mx-16 py-16 min-h-screen gap-8 border-x border-black'>
      <h1>Style Guide</h1>
      <p className='text-xl'>
        The UI is built with DaisyUI components customized with Tailwind CSS.
      </p>
      <h2>Buttons</h2>
      <div className='flex flex-wrap items-start w-full justify-center border-b border-black pb-8 px-4'>
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
      <hr />
      <h2>Badges</h2>
      <div className='flex flex-wrap items-start w-full justify-center border-b border-black pb-8 px-4'>
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
      <h2>Cards</h2>
      <div className='flex flex-wrap items-start gap-8 w-full justify-center border-b border-black pb-8 px-4'>
        <GameCard
          roomName={room.name}
          challenges={room.challenges}
          timeLimit={room.timeLimit}
          description={room.description}
          titleBackgroundColor={room.titleBg}
          bodyBackgroundColor={room.bodyBg}
        />
        <Card>
          <p>Card</p>
        </Card>
      </div>
      <div className='flex flex-col gap-4 w-full items-center border-b border-black pb-8 px-4'>
        <h2>Inputs</h2>
        <div>
          <Input type='text' placeholder='Type here' />
        </div>
        <div>
          <TextArea placeholder='bio' />
        </div>
      </div>
    </div>
  );
}
