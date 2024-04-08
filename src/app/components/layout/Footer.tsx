import Link from 'next/link';
// #211424
export default function Footer() {
  return (
    <footer className='footer footer-center p-10 bg-blue-900/50 text-white text-lg tracking-wide'>
      <nav className='grid grid-flow-col gap-4'>
        <Link href='/about'>About us</Link>
        <Link href='/style-guide'>Style Guide</Link>
      </nav>
    </footer>
  );
}
