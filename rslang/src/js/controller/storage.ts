import { ILoginUser, IGeneralInfo, IStoreGame } from '../module/components/interface';

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
  arrAnswerGameAudio: [],
  countGameAudio: 0,
  currentWordTranslate: '',
  currentWord: '',
  currentId: '',
  trueAnswerGame: [],
  falseAnswerGame: [],
};

window.addEventListener('load', () => {
  if (localStorage.getItem('general-info')) {
    storage = JSON.parse(<string>localStorage.getItem('general-info'));
  }
});

// window.addEventListener('beforeunload', () => {
//   localStorage.setItem('general-info', JSON.stringify(storage));
// });

export { storeUserInfo, storage, storeGameRound };