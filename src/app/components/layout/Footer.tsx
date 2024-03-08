import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='footer footer-center p-10 bg-base-200 text-base-content rounded border-t border-black'>
      <nav className='grid grid-flow-col gap-4'>
        <Link href='/about'>About us</Link>
        <Link href='/style-guide'>Style Guide</Link>
      </nav>
    </footer>
  );
}
