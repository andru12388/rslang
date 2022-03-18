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

  saveStatisticStorage(dataResponse: IDailyStat) {
    dailyStat.date = dataResponse.date;
    dailyStat.allWordsDaily = dataResponse.allWordsDaily;
    dailyStat.games = dataResponse.games;
    dailyStat.wordsList = dataResponse.wordsList;
  }

  uniqueNewWords({ trueAnswerGame, falseAnswerGame }: IStoreGame): Set<string> {
    const uniqueValue = new Set([...Object.keys(trueAnswerGame), ...Object.keys(falseAnswerGame), ...dailyStat.wordsList]);
    return uniqueValue;
  }

  async saveStatisticInDataBase({ trueAnswerGame, falseAnswerGame }: IStoreGame) {
    const totalSprintWords = <HTMLButtonElement>document.querySelector('.total-sprint-words');
    const percentAnswerSprint = <HTMLButtonElement>document.querySelector('.percent-answer-sprint');
    const longSeriesSprint = <HTMLButtonElement>document.querySelector('.long-series-sprint');
    const totalAudioWords = <HTMLButtonElement>document.querySelector('.total-audio-words');
    const percentAnswerAudio = <HTMLButtonElement>document.querySelector('.percent-answer-audio');
    const longSeriesAudio = <HTMLButtonElement>document.querySelector('.long-series-audio');
    const totalNewWords = <HTMLButtonElement>document.querySelector('.total-new-words');
    const learnedWordsStat = <HTMLButtonElement>document.querySelector('.learned-words-stat');
    const percentCorrectAnswer = <HTMLButtonElement>document.querySelector('.percent-correct-answer');
    try {
      const response = await api.getStatistic(storeUserInfo);
      this.saveStatisticStorage(response);
      const totalAnswer = Object.keys(trueAnswerGame).length + Object.keys(falseAnswerGame).length;
      if (storage.currentPage === 'game-audio' || storage.currentPage === 'game-audio-from-textbook') {
        dailyStat.games.audio.correctAnswer += Object.keys(trueAnswerGame).length;
        dailyStat.games.audio.wrongAnswer += Object.keys(falseAnswerGame).length;
        dailyStat.games.audio.newWords += this.uniqueNewWords(storeGameRound).size;
      }
      if (storage.currentPage === 'game-sprint' || storage.currentPage === 'game-sprint-from-textbook') {
        dailyStat.games.sprint.correctAnswer += Object.keys(trueAnswerGame).length;
        dailyStat.games.sprint.wrongAnswer += Object.keys(falseAnswerGame).length;
        dailyStat.games.sprint.newWords += this.uniqueNewWords(storeGameRound).size;
      }
      dailyStat.date = new Date().toLocaleDateString();
      dailyStat.allWordsDaily += totalAnswer;
      dailyStat.wordsList = [...this.uniqueNewWords(storeGameRound)];

      const totalCurrentAnswerAll = dailyStat.games.audio.correctAnswer + dailyStat.games.sprint.correctAnswer;
      const totalWordsAudio = dailyStat.games.audio.correctAnswer + dailyStat.games.audio.wrongAnswer;
      const totalWordsSprint = dailyStat.games.sprint.correctAnswer + dailyStat.games.sprint.wrongAnswer;
      const percentSprint = (dailyStat.games.sprint.correctAnswer / totalWordsSprint) * 100;
      const percentAudio = (dailyStat.games.audio.correctAnswer / totalWordsAudio) * 100;
      const percentCurrentAll = (totalCurrentAnswerAll / dailyStat.allWordsDaily) * 100;
      
      totalSprintWords.textContent = `${dailyStat.games.sprint.newWords}`;
      percentAnswerSprint.textContent = `${percentSprint}%`;

      totalAudioWords.textContent = `${dailyStat.games.audio.newWords}`;
      percentAnswerAudio.textContent = `${percentAudio}%`;

      totalNewWords.textContent = `${dailyStat.games.sprint.newWords + dailyStat.games.audio.newWords}`;
      // learnedWordsStat.textContent = `${}`;
      percentCorrectAnswer.textContent = `${percentCurrentAll}%`;
    } catch (error) {
      
    }
  }

  // Sprint //

  async getGamesWordsSprint(group: number, page: number) {
    storeGameRound.gameSprint = [...Object.values(await api.getTextbookWords(group, page))];
    while (storeGameRound.gameSprint.length < 80) {
      page++;
      if (page > 29) page = 0;
      const newGameSprint = [...Object.values(await api.getTextbookWords(group, page))];
      storeGameRound.gameSprint = [...storeGameRound.gameSprint, ...newGameSprint];
    }
    storeGameRound.arrAnswerGameSprint = [...storeGameRound.gameSprint.map((item) => item.wordTranslate)];
  }

  async getGameSprintWords(group: number, page: number) {
    storeGameRound.gameSprint = [...Object.values(await api.getTextbookWords(group, page))];
    storeGameRound.arrAnswerGameSprint = [...storeGameRound.gameSprint.map((item) => item.wordTranslate)];
  }

  async getGamesWordsSprintTextbookSignupUser(storeUser: ILoginUser, storeGeneral: IGeneralInfo) {
    let { groupWords: newGroupWords, pageWords: newPageWords } = storeGeneral;
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
    let { groupWords: newGroupWords, pageWords: newPageWords } = storeGeneral;
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

  async actionOnTrueRequestWrongResult(wordId: string) {
    let { gamesAnswer, difficultyWord } = await this.saveResponseGameWordInStore(wordId);
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

  async actionOnTrueRequestCorrectResult(wordId: string) {
    let { gamesAnswer, difficultyWord } = await this.saveResponseGameWordInStore(wordId);
    const differenceAnswer = <number>gamesAnswer.correct - <number>gamesAnswer.wrong;
    (<number>gamesAnswer.correct)++;
    if (differenceAnswer >= 3 && difficultyWord !== 'hard') {
      difficultyWord = 'easy';
    }
    if (differenceAnswer >= 5 && difficultyWord === 'hard') {
      difficultyWord = 'easy';
    }
    await api.updateGameWords(storeUserInfo, gamesAnswer, difficultyWord, wordId);
  }

  async actionOnFalseRequestCorrectResult(wordId: string) {
    const gamesAnswer = { correct: 0, wrong: 0 };
    const difficultyWord = 'normal';
    gamesAnswer.correct++;
    await api.createGameWords(storeUserInfo, gamesAnswer, difficultyWord, wordId);
  }

  async savedWrongResultGameDataBase() {
    const resultFalse = Object.keys(storeGameRound.falseAnswerGame);
    for await (const item of resultFalse) {
      try {
        await this.actionOnTrueRequestWrongResult(item);
      } catch (error) {
        await this.actionOnFalseRequestWrongResult(item);
      }
    }
  }

  async savedCorrectResultGameDataBase() {
    const resultCorrect = Object.keys(storeGameRound.trueAnswerGame);
    for await (const item of resultCorrect) {
      try {
        await this.actionOnTrueRequestCorrectResult(item);
      } catch (error) {
        await this.actionOnFalseRequestCorrectResult(item);
      }
    }
  }

}

export default UtilsGames;