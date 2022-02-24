import RequestsApi from '../requestsApi';
import { storeGameRound } from '../../controller/storage';

const api = new RequestsApi();

class UtilsGames {

  async getGamesWords(group: number, page: number) {
    storeGameRound.gameAudio = [...Object.values(await api.getTextbookWords(group, page))];
    storeGameRound.arrAnswerGameAudio = [...storeGameRound.gameAudio.map((item) => item.wordTranslate)];
  }

  getRandom(min = 0, max = 29) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getRandomArrAnswer(arr: string[], currentWord: string): string[] {
    const randomArrAnswer = arr.sort(() => Math.random() - Math.random()).slice(0, 4);
    const arrAnswer = [...randomArrAnswer].concat(currentWord);
    return arrAnswer.sort(() => Math.random() - 0.5);
  }

  createResultTrueAnswer() {
    const blockCorrect = <HTMLElement>document.querySelector('.block-correct');
    const dataAtrAudio = storeGameRound.gameAudio[storeGameRound.countGameAudio].audio;
    const correctAnswer = storeGameRound.trueAnswerGame[storeGameRound.trueAnswerGame.length - 1];
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

  createResultFalseAnswer() {
    const blockWrong = <HTMLElement>document.querySelector('.block-wrong');
    const dataAtrAudio = storeGameRound.gameAudio[storeGameRound.countGameAudio].audio;
    const wrongAnswer = storeGameRound.falseAnswerGame[storeGameRound.falseAnswerGame.length - 1];
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

}

export default UtilsGames;