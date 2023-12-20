import Image from 'next/image';

import Card from './components/Card';
import Input from './components/Input';
import TextArea from './components/TextArea';

const room = {
  name: 'Room Name',
  challenges: 5,
  timeLimit: 15,
  description:
    'A brief description of the escape room that makes it sound extremely fun and you want to play it!',
  titleBg: 'yellow',
  bodyBg: 'green',
};

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center py-16 gap-4'>
      <div className='flex flex-wrap items-start w-96'>
        <button>
          <span>Button</span>
        </button>
        <button className='green'>
          <span>Button</span>
        </button>
        <button className='red large'>
          <span className='text-nowrap'>Large Button</span>
        </button>
      </div>
      <div className='flex flex-wrap items-start w-96'>
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
      <Card
        roomName={room.name}
        challenges={room.challenges}
        timeLimit={room.timeLimit}
        description={room.description}
        titleBackgroundColor={room.titleBg}
        bodyBackgroundColor={room.bodyBg}
      />
      <Input type='text' placeholder='Type here' />
      <TextArea placeholder='bio' />
    </main>
  );
}
