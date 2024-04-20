'use client';
import Link from 'next/link';
import { SavedGamesContext } from '@/app/contexts/savedGamesContext';
import { LoadedGamesContext } from '@/app/contexts/loadedGamesContext';
import { SingleGameContext } from '@/app/contexts/singleGameContext';
import { UserContext } from '@/app/contexts/userContext';
import { useContext, useEffect, useState } from 'react';
import { TimerContext } from '../../contexts/timerContext';
import { Game } from '@/app/types/types';
import { useRouter } from 'next/navigation';
import Card from '@/app/components/ui/Card';
import { colorVariants } from '@/app/components/ui/colorVariants';

export default function PlayGame({ params }: { params: { game: string } }) {
  const { singleGame, setSingleGame } = useContext(SingleGameContext);
  const { savedGames, setSavedGames } = useContext(SavedGamesContext);
  const { loadedGames, setLoadedGames } = useContext(LoadedGamesContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { user } = useContext(UserContext);

  const router = useRouter();

  // Check if the user created this game, either in user's savedGames array from DB or savedGames in state
  const showEdit =
    user.savedGames.includes(params.game) ||
    savedGames.some((item) => item.id === params.game);

  // Set state if game in localStorage exists, otherwise fetch from DB
  useEffect(() => {
    const saveSingleGame = (newGame: Game) => {
      localStorage.setItem('singleGame', JSON.stringify(newGame));
      setSingleGame(newGame);
    };

    const fetchSingleGame = async () => {
      setLoading(true);
      setError(false);
      try {
        console.log('Fetching game data from the DB...');
        const response = await fetch(`/api/game/${params.game}`);
        const data = await response.json();
        if (!data.Item) {
          console.log('!data.Item');
          setError(true);
        } else {
          console.log('Fetched game data from the DB:');
          console.log(data.Item);
          localStorage.setItem('singleGame', JSON.stringify(data.Item));
          saveSingleGame(data.Item);
        }
      } catch (error) {
        console.log(error);
        setError(true);
      }
      setLoading(false);
    };

    // Grab everything from LS in case it's not in state (eg. brand new user arrives at this page from a shared link)
    const localStorageSavedGames: any = localStorage.getItem('savedGames');
    const localStorageLoadedGames: any = localStorage.getItem('loadedGames');

    const savedGamesArray: Game[] | null = JSON.parse(localStorageSavedGames);
    const loadedGamesArray: Game[] | null = JSON.parse(localStorageLoadedGames);

    // Check if the game is in local storage

    const lsGame = localStorage.getItem('singleGame');
    let localStorageGame;
    if (lsGame !== null) {
      localStorageGame = JSON.parse(lsGame);
    }

    if (localStorageGame && localStorageGame.id === params.game) {
      console.log('Found game in local storage (singleGame)');
      setSingleGame(localStorageGame);
      setLoading(false);
      return; // Exit useEffect early if game is found in local storage
    }

    // Check savedGames in state, savedGamesArray, loadedGames in state, and loadedGamesArray
    if (savedGames || savedGamesArray || loadedGames || loadedGamesArray) {
      const gameFromState =
        savedGames?.find((game) => game.id === params.game) ||
        savedGamesArray?.find((game) => game.id === params.game) ||
        loadedGames?.find((game) => game.id === params.game) ||
        loadedGamesArray?.find((game) => game.id === params.game);
      if (gameFromState) {
        console.log('Found game in state');
        saveSingleGame(gameFromState);
        setLoading(false);
        return; // Exit useEffect early if game is found in state
      }

      // If the game was not found in state or local storage, fetch it from DB
      fetchSingleGame();
    }
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      try {
        const response = await fetch(`/api/game/${params.game}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
      try {
        const response = await fetch(
          `/api/updateUser/${user.id}/${params.game}`,
          {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const data = await response.json();
        console.log(
          "Response from deleting game from user's saved games in DB:"
        );
        console.log(data);
      } catch (error) {
        console.log(error);
      }
      setSavedGames((prevGames: Game[]) => {
        const newGames = prevGames.filter((game) => game.id !== params.game);
        localStorage.setItem('savedGames', JSON.stringify(newGames));
        return newGames;
      });
      setLoadedGames((prevGames: Game[]) => {
        const newGames = prevGames.filter((game) => game.id !== params.game);
        localStorage.setItem('loadedGames', JSON.stringify(newGames));
        return newGames;
      });
    } catch (error) {
      return error;
    } finally {
      setDeleting(false);
      setDeleteModal(false);
      router.push('/');
    }
  };

  const DeleteModal = () => {
    return (
      <dialog id='my_modal_1' className='modal bg-slate-500/50' open>
        <div className='modal-box bg-white shadow-none border-2 border-black'>
          <h3 className='font-bold text-lg'>Hold up!</h3>
          <p className='py-4 text-center'>
            {!deleting ? (
              <>
                Are you sure you want to delete this game?
                <br />
                This cannot be reversed!
              </>
            ) : (
              'Deleting room...'
            )}
          </p>
          <div className='modal-action justify-center'>
            <form method='dialog'>
              {!deleting && (
                <>
                  <button
                    className='small green'
                    onClick={() => setDeleteModal(false)}
                  >
                    <span>No, nevermind!</span>
                  </button>
                  <button className='small red' onClick={handleDelete}>
                    <span>Yes, delete it!</span>
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </dialog>
    );
  };

  const { setExpiry } = useContext(TimerContext);

  if (!singleGame && !loading) {
    return (
      <div className='flex flex-col items-center justify-start p-16 min-h-screen gap-8'>
        <h2>Game not found</h2>
      </div>
    );
  }

  const timeInMinutes = (singleGame.timeLimit / 60).toFixed(2);
  const formattedTime = parseFloat(timeInMinutes);

  return (
    <div className='flex flex-col items-center justify-start gap-8 w-11/12 sm:w-4/5 lg:w-1/2'>
      <Card bgColor={singleGame.titleBg}>
        <div className='flex flex-col items-center justify-start gap-8'>
          {error && <p>There was an error</p>}
          {loading && <p>Loading...</p>}
          {!error && !loading && singleGame.challenges.length !== 0 && (
            <>
              <h2>{singleGame.gameTitle}</h2>
              <p>{singleGame.gameDescription}</p>
              <div className='flex flex-row flex-wrap justify-center gap-8'>
                {showEdit && (
                  <Link href={`/edit/${singleGame.id}`} data-test='edit-game'>
                    <button className='xl'>
                      <span>Edit</span>
                    </button>
                  </Link>
                )}
                <Link
                  href={`./${singleGame.id}/${singleGame.challenges[0].id}`}
                  data-test='start-game'
                >
                  <button
                    className='xl green'
                    onClick={() =>
                      setExpiry(Date.now() + singleGame.timeLimit * 1000)
                    }
                  >
                    <span>Start</span>
                  </button>
                </Link>
              </div>
              <div className='flex flex-row flex-wrap justify-center gap-x-8'>
                <div className='badge'>
                  <span className='text-nowrap'>
                    {singleGame.challenges.length}{' '}
                    {singleGame.challenges.length > 1
                      ? 'challenges'
                      : 'challenge'}
                  </span>
                </div>
                <div className='badge'>
                  <span className='text-nowrap'>{formattedTime} minutes</span>
                </div>
              </div>
              {showEdit && (
                <button
                  className='small red'
                  onClick={() => setDeleteModal(true)}
                >
                  <span>Delete Game</span>
                </button>
              )}
            </>
          )}
        </div>
      </Card>
      {deleteModal && <DeleteModal />}
    </div>
  );
}
