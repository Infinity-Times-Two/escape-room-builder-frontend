import NewGameForm from '../../components/createGame/NewGameForm';
import Link from 'next/link';
import { SignedIn, SignedOut } from '@clerk/nextjs';

export default function EditGame({ params }: { params: { gameId: string } }) {
  return <NewGameForm editGame={params.gameId} />;
}
