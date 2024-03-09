import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div data-test='sign-in'>
      <SignIn />
    </div>
  );
}
