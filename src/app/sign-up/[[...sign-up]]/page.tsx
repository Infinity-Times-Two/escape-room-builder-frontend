import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div data-test='sign-up'>
      <SignUp />
    </div>
  );
}
