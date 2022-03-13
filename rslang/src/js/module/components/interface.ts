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
  arrAnswerGameAudio: string[];
  countGameAudio: number;
  currentWordTranslate: string;
  currentWord: string;
  currentId: string;
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
  difficultyWord: string;
}

interface IUserWord {
  difficulty: string;
  optional: { group: number, page: number }
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
  optionalAudioCall: IOptionalGames;
  optionalSprint: IOptionalGames;
  difficultyWord: string;
}

export { 
  ICreateUser,
  ILoginUser,
  IWords,
  IGeneralInfo,
  IResponseWordsSignUser,
  IWordsSignupUser,
  IStoreGame,
  IOptionalGames,
  IResponseGetWord
};