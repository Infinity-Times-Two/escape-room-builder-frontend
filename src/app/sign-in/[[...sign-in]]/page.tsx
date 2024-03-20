import { SignIn } from '@clerk/nextjs';
import { neobrutalism } from '@clerk/themes';

export default function Page() {
  return (
    <div data-test='sign-in'>
      <SignIn />
    </div>
  );
}
