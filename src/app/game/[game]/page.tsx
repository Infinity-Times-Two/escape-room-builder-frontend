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

export default function PlayGame({ params }: { params: { game: string } }) {
  const { singleGame, setSingleGame } = useContext(SingleGameContext);
  const { savedGames, setSavedGames } = useContext(SavedGamesContext);
  const { loadedGames } = useContext(LoadedGamesContext);
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

  useEffect(() => {
    console.log('single game:');
    console.log(singleGame);
  }, [singleGame]);

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
        const response = await fetch(`/api/game/${params.game}`);
        const data = await response.json();
        console.log('Fetched game data from the server.');
        console.log(data);
        localStorage.setItem('singleGame', JSON.stringify(data));
        if (data.length === undefined) {
          setError(true);
        } else {
          saveSingleGame(data);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(true);
      }
    };

    // Grab everything from LS in case it's not in state (eg. brand new user arrives at this page from a shared link)
    const localStorageGame: any = localStorage.getItem('singleGame');
    const localStorageSavedGames: any = localStorage.getItem('savedGames');
    const localStorageLoadedGames: any = localStorage.getItem('loadedGames');

    const localStorageSingleGame: Game | null = JSON.parse(localStorageGame);
    const savedGamesArray: Game[] | null = JSON.parse(localStorageSavedGames);
    const loadedGamesArray: Game[] | null = JSON.parse(localStorageLoadedGames);

    // Load the game from 'saved games' state or local storage if it exists
    if (savedGames) {
      const savedGame = savedGames.find((game) => game.id === params.game);
      if (savedGame) {
        console.log('Found from saved games in state');
        saveSingleGame(savedGame);
      }
    } else if (savedGamesArray) {
      const savedGame = savedGamesArray.find((game) => game.id === params.game);
      if (savedGame) {
        console.log('Found from saved games in local storage');
        saveSingleGame(savedGame);
      }
    }

    // Load the game from 'loaded games' state or local storage if it exists
    if (loadedGames) {
      const loadedGame = loadedGames.find((game) => game.id === params.game);
      if (loadedGame) {
        console.log('Found from loaded games in state');
        saveSingleGame(loadedGame);
      }
    } else if (loadedGamesArray) {
      const loadedGame = loadedGamesArray.find(
        (game) => game.id === params.game
      );
      if (loadedGame) {
        console.log('Found from loaded games in local storage');
        saveSingleGame(loadedGame);
      }
    }

    // If the game was not found in state or local storage, fetch it from DB
    if (!localStorageSingleGame) {
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
        console.log('Response from deleting game from DB:');
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
      <dialog id='my_modal_1' className='modal' open>
        <div className='modal-box bg-white'>
          <h3 className='font-bold text-lg'>Hold up!</h3>
          <p className='py-4'>
            {!deleting
              ? 'Are you sure you want to delete this game? This cannot be reversed!'
              : 'Deleting room...'}
          </p>
          <div className='modal-action'>
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
    <div className='flex flex-col items-center justify-start p-16 min-h-screen gap-8'>
      {error && <p>There was an error</p>}
      {loading && <p>Loading...</p>}
      {!error && !loading && singleGame.challenges.length !== 0 && (
        <>
          <h2>{singleGame.gameTitle}</h2>
          <p>{singleGame.gameDescription}</p>
          <div className='flex flex-row justify-center gap-8'>
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
                <span>Play</span>
              </button>
            </Link>
          </div>

          <div className='chip'>
            <span>{formattedTime} minutes</span>
          </div>
          <div className='chip'>
            <span>{singleGame.challenges.length} challenges</span>
          </div>
          {showEdit && (
            <button className='small red' onClick={() => setDeleteModal(true)}>
              <span>Delete Game</span>
            </button>
          )}
          {deleteModal && <DeleteModal />}
        </>
      )}
    </div>
  );
}
