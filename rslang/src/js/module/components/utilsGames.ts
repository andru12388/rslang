import RequestsApi from '../requestsApi';
import { storeGameRound, storeUserInfo, storage, dailyStat } from '../../controller/storage';
import { ILoginUser, IGeneralInfo, IResponseWordsSignUser, IStoreGame, IResponseGetWord, IDailyStat } from './interface';

const api = new RequestsApi();

class UtilsGames {
  audioLevelUp = new Audio() as HTMLAudioElement;

  async getGamesWordsFromDifficultyPage(selectGame: string) {
    if (selectGame === 'game-sprint') {
      storeGameRound.gameSprint = [...Object.values(await api.getDifficultWordsSignupUser(storeUserInfo))
        .map((item) => (<IResponseWordsSignUser>item).paginatedResults)
        .flat()];
      storeGameRound.arrAnswerGameSprint = [...storeGameRound.gameSprint.map((item) => item.wordTranslate)];
    }
    if (selectGame === 'game-audio') {
      storeGameRound.gameAudio = [...Object.values(await api.getDifficultWordsSignupUser(storeUserInfo))
        .map((item) => (<IResponseWordsSignUser>item).paginatedResults)
        .flat()];
      storeGameRound.arrAnswerGameAudio = [...storeGameRound.gameAudio.map((item) => item.wordTranslate)];
    }
  }

  // Sprint //

  async getGamesWordsSprint(group: number, page: number) {
    storeGameRound.gameSprint = [...Object.values(await api.getTextbookWords(group, page))];
    let count = page;
    while (storeGameRound.gameSprint.length < 80) {
      count++;
      if (count > 29) count = 0;
      const newGameSprint = [...Object.values(await api.getTextbookWords(group, count))];
      storeGameRound.gameSprint = [...storeGameRound.gameSprint, ...newGameSprint];
    }
    storeGameRound.arrAnswerGameSprint = [...storeGameRound.gameSprint.map((item) => item.wordTranslate)];
  }

  async getGameSprintWords(group: number, page: number) {
    storeGameRound.gameSprint = [...Object.values(await api.getTextbookWords(group, page))];
    storeGameRound.arrAnswerGameSprint = [...storeGameRound.gameSprint.map((item) => item.wordTranslate)];
  }

  async getGamesWordsSprintTextbookSignupUser(storeUser: ILoginUser, storeGeneral: IGeneralInfo) {
    const { groupWords: newGroupWords } = storeGeneral;
    let { pageWords: newPageWords } = storeGeneral;
    storeGameRound.gameSprint = [...Object.values(await api.getGameTextbookWordsSignupUser(storeUser, storeGeneral))
      .map((item) => (<IResponseWordsSignUser>item).paginatedResults)
      .flat()];
    while (storeGameRound.gameSprint.length < 20 && newPageWords !== 0) {
      newPageWords--;
      const missingElements = 20 - storeGameRound.gameSprint.length;
      const newStoreGeneral = { groupWords: newGroupWords, pageWords: newPageWords };
      const newGameSprint = [...Object.values(await api.getGameTextbookWordsSignupUser(storeUser, newStoreGeneral))
        .map((item) => (<IResponseWordsSignUser>item).paginatedResults)
        .flat()];
      if (newGameSprint.length > missingElements) {
        storeGameRound.gameSprint = [...storeGameRound.gameSprint, ...newGameSprint.slice(0, missingElements)];
      } else {
        storeGameRound.gameSprint = [...storeGameRound.gameSprint, ...newGameSprint];
      }
    }
    storeGameRound.arrAnswerGameSprint = [...storeGameRound.gameSprint.map((item) => item.wordTranslate)];
  }

  getRandomArrAnswerSprint(word: string): string[] {
    const arrAllAnswer = storeGameRound.arrAnswerGameSprint
      .filter((item) => item !== word)
      .sort(() => Math.random() - Math.random()).slice(0, 1);
    return [...arrAllAnswer, word].sort(() => Math.random() - 0.5);
  }

  factorPointsGameSprint({ countCorrectAnswerInRowSprint }: IStoreGame) {
    const qualityPoints = <HTMLElement>document.querySelector('.quality-points');
    this.audioLevelUp.src = './assets/audio/level-up.mp3';
    this.audioLevelUp.volume = 0.3;
    const points = Number(qualityPoints.textContent);
    switch (countCorrectAnswerInRowSprint) {
      case 0:
        qualityPoints.textContent = '10';
        break;
      case 4:
        qualityPoints.textContent = `${points * 2}`;
        this.audioLevelUp.play();
        break;
      case 8:
        qualityPoints.textContent = `${points * 2}`;
        this.audioLevelUp.play();
        break;
      case 12:
        qualityPoints.textContent = `${points * 2}`;
        this.audioLevelUp.play();
        break;
    }
  }

  plusPointsInTotalScoreSprint() {
    const totalScores = <HTMLElement>document.querySelector('.total-score');
    const qualityPoints = <HTMLElement>document.querySelector('.quality-points');
    const total = Number(totalScores.textContent);
    const points = Number(qualityPoints.textContent);
    totalScores.textContent = `${total + points}`;
  }

  resetPaginationGameSprint() {
    const paginationItem = <NodeListOf<Element>>document.querySelectorAll('.pagination-item');
    if (storeGameRound.countPaginationSprint > 2) {
      storeGameRound.countPaginationSprint = 0;
      paginationItem.forEach((item) => (<HTMLElement>item).style.background = 'none');
      return false;
    } else {
      (<HTMLElement>paginationItem[storeGameRound.countPaginationSprint]).style.background = 'green';
      storeGameRound.countPaginationSprint++;
    }
  }

  // Audiocall //

  async getGamesWords(group: number, page: number) {
    storeGameRound.gameAudio = [...Object.values(await api.getTextbookWords(group, page))];
    storeGameRound.arrAnswerGameAudio = [...storeGameRound.gameAudio.map((item) => item.wordTranslate)];
  }

  async getGamesWordsTextbookSignupUser(storeUser: ILoginUser, storeGeneral: IGeneralInfo) {
    const { groupWords: newGroupWords } = storeGeneral;
    let { pageWords: newPageWords } = storeGeneral;
    storeGameRound.gameAudio = [...Object.values(await api.getGameTextbookWordsSignupUser(storeUser, storeGeneral))
      .map((item) => (<IResponseWordsSignUser>item).paginatedResults)
      .flat()];
    while (storeGameRound.gameAudio.length < 20 && newPageWords !== 0) {
      newPageWords--;
      const missingElements = 20 - storeGameRound.gameAudio.length;
      const newStoreGeneral = { groupWords: newGroupWords, pageWords: newPageWords };
      const newGameAudio = [...Object.values(await api.getGameTextbookWordsSignupUser(storeUser, newStoreGeneral))
        .map((item) => (<IResponseWordsSignUser>item).paginatedResults)
        .flat()];
      if (newGameAudio.length > missingElements) {
        storeGameRound.gameAudio = [...storeGameRound.gameAudio, ...newGameAudio.slice(0, missingElements)];
      } else {
        storeGameRound.gameAudio = [...storeGameRound.gameAudio, ...newGameAudio];
      }
    }
    storeGameRound.arrAnswerGameAudio = [...storeGameRound.gameAudio.map((item) => item.wordTranslate)];
  }

  getRandom(min = 0, max = 29): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getRandomArrAnswer(currentWord: string): string[] {
    const arrAllAnswer = storeGameRound.arrAnswerGameAudio
      .filter((item) => item !== currentWord)
      .sort(() => Math.random() - Math.random()).slice(0, 4);
    return [...arrAllAnswer, currentWord].sort(() => Math.random() - 0.5);
  }

  selectCorrectId({ gameAudio, gameSprint, countGame }: IStoreGame): string {
    let dataRound = null;
    if (storage.currentPage === 'game-sprint' || storage.currentPage === 'game-sprint-from-textbook') {
      dataRound = gameSprint[countGame];
    } else {
      dataRound = gameAudio[countGame];
    }
    let correctIdWord = '';
    if (dataRound._id === undefined) {
      correctIdWord = <string>dataRound.id;
    } else {
      correctIdWord = <string>dataRound._id;
    }
    return correctIdWord;
  }

  async selectRequestGameAudio() {
    if (storage.currentPage === 'difficult-words') {
      await this.getGamesWordsFromDifficultyPage('game-audio');
    } else {
      if (storage.isSignupUser) {
        await this.getGamesWordsTextbookSignupUser(storeUserInfo, storage);
      } else {
        await this.getGamesWords(storage.groupWords, storage.pageWords);
      }
    }
  }

  async selectRequestGameSprint() {
    if (storage.currentPage === 'difficult-words') {
      await this.getGamesWordsFromDifficultyPage('game-sprint');
    } else {
      if (storage.isSignupUser) {
        await this.getGamesWordsSprintTextbookSignupUser(storeUserInfo, storage);
      } else {
        await this.getGameSprintWords(storage.groupWords, storage.pageWords);
      }
    }
  }

  async saveInDataBaseResultCorrectGames() {
    const wordID = this.selectCorrectId(storeGameRound);
    if (storage.isSignupUser) {
      try {
        const response = await this.saveResponseGameWordInStore(wordID);
        await this.actionOnTrueRequestCorrectResult(response, wordID);
      } catch (error) {
        await this.actionOnFalseRequestCorrectResult(wordID);
      }
    }
  }

  async saveInDataBaseResultWrongGames() {
    const wordID = this.selectCorrectId(storeGameRound);
    if (storage.isSignupUser) {
      try {
        const response = await this.saveResponseGameWordInStore(wordID);
        await this.actionOnTrueRequestWrongResult(response, wordID);
      } catch (error) {
        await this.actionOnFalseRequestWrongResult(wordID);
      }
    }
  }

  createResultTrueAnswer({ gameAudio, gameSprint, countGame, trueAnswerGame }: IStoreGame) {
    const blockCorrect = <HTMLElement>document.querySelector('.block-correct');
    let dataRound = null;
    if (storage.currentPage === 'game-sprint' || storage.currentPage === 'game-sprint-from-textbook') {
      dataRound = gameSprint[countGame];
    } else {
      dataRound = gameAudio[countGame];
    }
    const dataAtrAudio = dataRound.audio;
    const correctAnswer = trueAnswerGame[this.selectCorrectId(storeGameRound)];
    const div = document.createElement('div');
    div.classList.add('answer-correct-item');
    const span = document.createElement('span');
    span.classList.add('icon-audio-popup');
    span.setAttribute('data-source', `${dataAtrAudio}`);
    div.append(span);
    const span2 = document.createElement('span');
    span2.classList.add('translate-word-correct');
    span2.textContent = `${correctAnswer}`;
    div.append(span2);
    blockCorrect.append(div);
  }

  createResultFalseAnswer({ gameAudio, gameSprint, countGame, falseAnswerGame }: IStoreGame) {
    const blockWrong = <HTMLElement>document.querySelector('.block-wrong');
    let dataRound = null;
    if (storage.currentPage === 'game-sprint' || storage.currentPage === 'game-sprint-from-textbook') {
      dataRound = gameSprint[countGame];
    } else {
      dataRound = gameAudio[countGame];
    }
    const dataAtrAudio = dataRound.audio;
    const wrongAnswer = falseAnswerGame[this.selectCorrectId(storeGameRound)];
    const div = document.createElement('div');
    div.classList.add('answer-wrong-item');
    const span = document.createElement('span');
    span.classList.add('icon-audio-popup');
    span.setAttribute('data-source', `${dataAtrAudio}`);
    div.append(span);
    const span2 = document.createElement('span');
    span2.classList.add('translate-word-wrong');
    span2.textContent = `${wrongAnswer}`;
    div.append(span2);
    blockWrong.append(div);
  }
  
  async saveResponseGameWordInStore(wordId: string): Promise<IResponseGetWord> {
    const response = await api.getGameWord(storeUserInfo, wordId);
    return {
      gamesAnswer: response.optional.gamesAnswer,
      difficultyWord: response.difficulty,
    };
  }

  async actionOnTrueRequestWrongResult(responseData: IResponseGetWord, wordId: string) {
    let { difficultyWord } = responseData;
    const { gamesAnswer } = responseData;
    if (difficultyWord === 'easy') {
      difficultyWord = 'normal';
    }
    (<number>gamesAnswer.wrong)++;
    await api.updateGameWords(storeUserInfo, gamesAnswer, difficultyWord, wordId);
  }

  async actionOnFalseRequestWrongResult(wordId: string) {
    const gamesAnswer = { correct: 0, wrong: 0 };
    const difficultyWord = 'normal';
    gamesAnswer.wrong++;
    await api.createGameWords(storeUserInfo, gamesAnswer, difficultyWord, wordId);
  }

  async actionOnTrueRequestCorrectResult(responseData: IResponseGetWord, wordId: string) {
    let { difficultyWord } = responseData;
    const { gamesAnswer } = responseData;
    (<number>gamesAnswer.correct)++;
    const differenceAnswer = <number>gamesAnswer.correct - <number>gamesAnswer.wrong;
    if (differenceAnswer >= 3 && difficultyWord !== 'hard') {
      difficultyWord = 'easy';
      storeGameRound.learnWordsInGames++;
    }
    if (differenceAnswer >= 5 && difficultyWord === 'hard') {
      difficultyWord = 'easy';
      storeGameRound.learnWordsInGames++;
    }
    await api.updateGameWords(storeUserInfo, gamesAnswer, difficultyWord, wordId);
  }

  async actionOnFalseRequestCorrectResult(wordId: string) {
    const gamesAnswer = { correct: 0, wrong: 0 };
    const difficultyWord = 'normal';
    gamesAnswer.correct++;
    await api.createGameWords(storeUserInfo, gamesAnswer, difficultyWord, wordId);
  }

}

export default UtilsGames;