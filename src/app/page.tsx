import Image from 'next/image';

import Card from './components/Card';
import Input from './components/Input';
import TextArea from './components/TextArea';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center py-16 gap-4'>
      <div className='flex flex-col w-full justify-center'>
        <div className='flex flex-wrap justify-center gap-8'>
          <button className='xl'><span>Play</span></button>
          <button className='xl green'><span>Create</span></button>
        </div>
      </div>
    </main>
  );
}
