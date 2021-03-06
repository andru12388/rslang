import { ILoginUser, IGeneralInfo, IStoreGame, IDailyStat } from '../module/components/interface';

const storeUserInfo: ILoginUser = {
  message: null,
  name: null,
  refreshToken: null,
  token: null,
  userId: null,
};

let storage: IGeneralInfo = {
  currentPage: 'home',
  groupWords: 0,
  pageWords: 0,
  isSignupUser: false,
  wordId: null,
  levelGame: 0,
};

const storeGameRound: IStoreGame = {
  gameAudio: [],
  gameSprint: [],
  arrAnswerGameAudio: [],
  arrAnswerGameSprint: [],
  longSeriesAnswer: [],
  countGame: 0,
  countCorrectAnswerInRowSprint: 0,
  countPaginationSprint: 0,
  learnWordsInGames: 0,
  isClearDailyStat: false,
  currentWordTranslate: '',
  currentWord: '',
  randomWord: '',
  trueAnswerGame: {},
  falseAnswerGame: {},
  optionalAudioCall: { correct: 0, wrong: 0, total: 0 },
  optionalSprint: { correct: 0, wrong: 0, total: 0 },
  gamesAnswer: { correct: 0, wrong: 0 },
  difficultyWord: '',
};

const dailyStat: IDailyStat = {
  date: new Date().toLocaleDateString(),
  games: {
    audio: { correctAnswer: 0, wrongAnswer: 0, newWords: 0, percentCorrect: 0, longSeries: 0 },
    sprint: { correctAnswer: 0, wrongAnswer: 0, newWords: 0, percentCorrect: 0, longSeries: 0 },
  },
  totalNewWords: 0,
  learnedWordsDaily: 0,
  percentAllCorrect: 0,
  allWordsDaily: 0,
  wordsList: {
    allWordsList: [],
  },
};

window.addEventListener('load', () => {
  if (localStorage.getItem('general-info')) {
    storage = JSON.parse(<string>localStorage.getItem('general-info'));
  }
});

export { storeUserInfo, storage, storeGameRound, dailyStat };