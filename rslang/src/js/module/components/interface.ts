interface ICreateUser {
  name?: string;
  email: string;
  password: string;
}

interface ILoginUser {
  message?: string | null;
  name?: string | null;
  refreshToken?: string | null;
  token?: string | null;
  userId?: string | null;
}

interface IGeneralInfo {
  currentPage?: string;
  groupWords: number;
  pageWords: number;
  isSignupUser?: boolean;
  wordId?: string | null;
  levelGame?: number;
}

interface IWords {
  audio: string;
  audioExample?: string;
  audioMeaning?: string;
  group?: number;
  id?: string;
  _id?: string;
  image: string;
  page?: number;
  textExample: string;
  textExampleTranslate: string;
  textMeaning: string;
  textMeaningTranslate: string;
  transcription: string;
  word: string;
  wordTranslate: string;
}

interface IStoreGame {
  gameAudio: IWords[];
  gameSprint: IWords[];
  arrAnswerGameAudio: string[];
  arrAnswerGameSprint: string[];
  longSeriesAnswer: number[];
  countGame: number;
  countCorrectAnswerInRowSprint: number;
  countPaginationSprint: number;
  learnWordsInGames: number;
  isClearDailyStat: boolean;
  currentWordTranslate: string;
  currentWord: string;
  randomWord: string;
  trueAnswerGame: {
    [key: string]: string;
  };
  falseAnswerGame: {
    [key: string]: string;
  };
  optionalAudioCall: {
    correct?: number;
    wrong?: number;
    total?: number;
  };
  optionalSprint: {
    correct?: number;
    wrong?: number;
    total?: number;
  };
  gamesAnswer: {
    correct?: number;
    wrong?: number;
  };
  difficultyWord: string;
}

interface IUserWord {
  difficulty: string;
  optional: { gamesAnswer: { correct: number, wrong: number } }
}

interface IWordsSignupUser {
  audio: string;
  audioExample: string;
  audioMeaning: string;
  group: number;
  _id: string;
  image: string;
  page: number;
  textExample: string;
  textExampleTranslate: string;
  textMeaning: string;
  textMeaningTranslate: string;
  transcription: string;
  word: string;
  wordTranslate: string;
  userWord?: IUserWord;
}

interface IResponseWordsSignUser {
  paginatedResults: IWordsSignupUser;
  totalCount: Array<{ count: number }>;
}

interface IOptionalGames {
  correct?: number;
  wrong?: number; 
  total?: number;
}

interface IResponseGetWord {
  gamesAnswer: IOptionalGames;
  difficultyWord: string;
}

interface IGamesStatistic {
  audio: { 
    correctAnswer: number, 
    wrongAnswer: number, 
    newWords: number,
    percentCorrect: number,
    longSeries: number
  },
  sprint: { 
    correctAnswer: number, 
    wrongAnswer: number, 
    newWords: number,
    percentCorrect: number,
    longSeries: number
  }
}

interface IDailyStat {
  date: string;
  games: IGamesStatistic;
  totalNewWords: number;
  learnedWordsDaily: number;
  percentAllCorrect: number;
  allWordsDaily: number;
  wordsList: {
    allWordsList: string[],
  };
}

interface IResponseDailyStat {
  id: string;
  learnedWords: number;
  optional: IDailyStat;
}

export { 
  ICreateUser,
  ILoginUser,
  IWords,
  IGeneralInfo,
  IResponseWordsSignUser,
  IWordsSignupUser,
  IStoreGame,
  IUserWord,
  IOptionalGames,
  IResponseGetWord,
  IDailyStat,
  IResponseDailyStat,
};