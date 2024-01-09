import Card from '../components/Card';
import Input from '../components/Input';
import TextArea from '../components/TextArea';

const room = {
  name: 'Room Name',
  challenges: 5,
  timeLimit: 15,
  description:
    'A brief description of the escape room that makes it sound extremely fun and you want to play it!',
  titleBg: 'yellow',
  bodyBg: 'green',
};

export default function About() {
  return (
    <div className='flex flex-col items-center justify-start p-16 min-h-screen gap-8'>
      <h1 className='text-4xl font-bold'>Style Guide</h1>
      <p className='text-xl'>
        The UI is built with DaisyUI components customized with Tailwind CSS.
      </p>
      <div className='flex flex-wrap items-start sm:w-11/12 justify-center'>
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
      <div className='flex flex-wrap items-start sm:w-11/12 justify-center'>
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
      <div className='flex flex-wrap items-start sm:w-11/12 gap-8 justify-center'>
        <Card
          roomName={room.name}
          challenges={room.challenges}
          timeLimit={room.timeLimit}
          description={room.description}
          titleBackgroundColor={room.titleBg}
          bodyBackgroundColor={room.bodyBg}
        />
        <div className='flex flex-col gap-4'>
          <Input type='text' placeholder='Type here' />
          <TextArea placeholder='bio' />
        </div>
      </div>
    </div>
  );
}
