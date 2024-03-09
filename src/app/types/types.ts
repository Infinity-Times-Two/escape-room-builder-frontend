export interface Game {
  id: string;
  gameTitle: string;
  gameDescription: string;
  timeLimit: number;
  theme: string;
  author: string;
  titleBg: string;
  bodyBg: string;
  challenges: Challenge[];
}

export interface Challenge {
  id: string;
  type: string;
  description: string;
  clue: string | Array<string>;
  answer: string;
}

export interface DBuser {
  id: string;
  firstName: string;
  nickName: string;
  savedGames: string[];
  createdGames: string[];
  isAdmin: boolean;
}