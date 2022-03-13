import RequestsApi from '../requestsApi';
import { storeGameRound, storeUserInfo, storage } from '../../controller/storage';
import { ILoginUser, IGeneralInfo, IResponseWordsSignUser, IStoreGame, IResponseGetWord } from './interface';

const api = new RequestsApi();

class UtilsGames {

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

  getRandom(min = 0, max = 29) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getRandomArrAnswer(currentWord: string): string[] {
    const arrAllAnswer = storeGameRound.arrAnswerGameAudio
      .filter((item) => item !== currentWord)
      .sort(() => Math.random() - Math.random()).slice(0, 4);
    return [...arrAllAnswer, currentWord].sort(() => Math.random() - 0.5);
  }

  selectCorrectId({ gameAudio, countGameAudio }: IStoreGame): string {
    const dataRound = gameAudio[countGameAudio];
    let correctIdWord = '';
    if (dataRound._id === undefined) {
      correctIdWord = <string>dataRound.id;
    } else {
      correctIdWord = <string>dataRound._id;
    }
    return correctIdWord;
  }

  createResultTrueAnswer({ gameAudio, countGameAudio, trueAnswerGame }: IStoreGame) {
    const blockCorrect = <HTMLElement>document.querySelector('.block-correct');
    const dataRound = gameAudio[countGameAudio];
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

  createResultFalseAnswer({ gameAudio, countGameAudio, falseAnswerGame }: IStoreGame) {
    const blockWrong = <HTMLElement>document.querySelector('.block-wrong');
    const dataRound = gameAudio[countGameAudio];
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
      optionalAudioCall: response.optional.audiocall,
      optionalSprint: response.optional.sprint,
      difficultyWord: response.difficulty,
    };
  }

  async actionOnTrueRequestWrongResult(wordId: string) {
    let { optionalAudioCall, optionalSprint, difficultyWord } = await this.saveResponseGameWordInStore(wordId);
    if (difficultyWord === 'easy') {
      difficultyWord = 'normal';
    }
    if (storage.currentPage === 'game-audio' || storage.currentPage === 'game-audio-from-textbook') {
      (<number>optionalAudioCall.wrong)++;
      (<number>optionalAudioCall.total)++;
    }
    if (storage.currentPage === 'game-sprint' || storage.currentPage === 'game-sprint-from-textbook') {
      (<number>optionalSprint.wrong)++;
      (<number>optionalSprint.total)++;
    }
    await api.updateGameWords(storeUserInfo, optionalAudioCall, optionalSprint, difficultyWord, wordId);
  }

  async actionOnFalseRequestWrongResult(wordId: string) {
    const optionalAudioCall = { correct: 0, wrong: 0, total: 0 }
    const optionalSprint = { correct: 0, wrong: 0, total: 0 }
    const difficultyWord = 'normal';
    if (storage.currentPage === 'game-audio' || storage.currentPage === 'game-audio-from-textbook') {
      optionalAudioCall.wrong++;
      optionalAudioCall.total++;
    }
    if (storage.currentPage === 'game-sprint' || storage.currentPage === 'game-sprint-from-textbook') {
      optionalSprint.wrong++;
      optionalSprint.total++;
    }
    await api.createGameWords(storeUserInfo, optionalAudioCall, optionalSprint, difficultyWord, wordId);
  }

  async actionOnTrueRequestCorrectResult(wordId: string) {
    let { optionalAudioCall, optionalSprint, difficultyWord } = await this.saveResponseGameWordInStore(wordId);
    const differenceAnswer = <number>optionalAudioCall.correct - <number>optionalAudioCall.wrong;
    if (storage.currentPage === 'game-audio' || storage.currentPage === 'game-audio-from-textbook') {
      (<number>optionalAudioCall.correct)++;
      (<number>optionalAudioCall.total)++;
      if (differenceAnswer >= 3 && difficultyWord !== 'hard') {
        difficultyWord = 'easy';
      }
      if (differenceAnswer >= 5 && difficultyWord === 'hard') {
        difficultyWord = 'easy';
      }
    }
    if (storage.currentPage === 'game-sprint' || storage.currentPage === 'game-sprint-from-textbook') {
      (<number>optionalSprint.correct)++;
      (<number>optionalSprint.total)++;
      if (differenceAnswer >= 3 && difficultyWord !== 'hard') {
        difficultyWord = 'easy';
      }
      if (differenceAnswer >= 5 && difficultyWord === 'hard') {
        difficultyWord = 'easy';
      }
    }
    await api.updateGameWords(storeUserInfo, optionalAudioCall, optionalSprint, difficultyWord, wordId);
  }

  async actionOnFalseRequestCorrectResult(wordId: string) {
    const optionalAudioCall = { correct: 0, wrong: 0, total: 0 }
    const optionalSprint = { correct: 0, wrong: 0, total: 0 }
    const difficultyWord = 'normal';
    if (storage.currentPage === 'game-audio' || storage.currentPage === 'game-audio-from-textbook') {
      optionalAudioCall.correct++;
      optionalAudioCall.total++;
    }
    if (storage.currentPage === 'game-sprint' || storage.currentPage === 'game-sprint-from-textbook') {
      optionalSprint.correct++;
      optionalSprint.total++;
    }
    await api.createGameWords(storeUserInfo, optionalAudioCall, optionalSprint, difficultyWord, wordId);
  }

  savedWrongResultGameDataBase() {
    Object.keys(storeGameRound.falseAnswerGame).forEach(async (item) => {
      try {
        await this.actionOnTrueRequestWrongResult(item);
        // console.log('ok')
      } catch (error) {
        // console.log('error')
        await this.actionOnFalseRequestWrongResult(item);
      }
    });
    // for await (const item of resultFalse) {
    //   try {
    //     await this.actionOnTrueRequestWrongResult(item);
    //     console.log('ok')
    //   } catch (error) {
    //     console.log('error')
    //     await this.actionOnFalseRequestWrongResult(item);
    //   }
    // }
    
  }

  savedCorrectResultGameDataBase() {
    Object.keys(storeGameRound.trueAnswerGame).forEach(async (item) => {
      try {
        await this.actionOnTrueRequestCorrectResult(item);
      } catch (error) {
        await this.actionOnFalseRequestCorrectResult(item);
      }
    });
  }

}

export default UtilsGames;