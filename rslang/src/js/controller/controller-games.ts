import RenderView from '../view/render';
import { storage, storeGameRound } from './storage';
import Utils from '../module/components/utils';
import UtilsGames from '../module/components/utilsGames';
import CreateGamePage from '../view/createGamesPage';

const render = new RenderView();
const utils = new Utils();
const utilsGames = new UtilsGames();

class GamesController {
  linkGameAudio = <HTMLElement>document.querySelector('#link-game-audio');

  main = <HTMLElement>document.querySelector('.main');

  footer = <HTMLElement>document.querySelector('.footer');

  wrapper = <HTMLElement>document.querySelector('.wrapper');

  menuBurg = <HTMLElement>document.querySelector('.menu-btn');

  logoLinkHome = <HTMLElement>document.querySelector('.logo');
  
  numberWrong = <HTMLElement>document.querySelector('.number-wrong');
  
  numberCorrect = <HTMLElement>document.querySelector('.number-correct');
  
  buttonExitPopupGame = <HTMLElement>document.querySelector('.button-exit');
  
  btnExitPopupGameFromTextbook = <HTMLElement>document.querySelector('.button-exit-from-textbook');
  
  buttonRepeatPopupGame = <HTMLElement>document.querySelector('.button-repeat');
  
  btnRepeatPopupGameFromTextbook = <HTMLElement>document.querySelector('.button-repeat-from-textbook');
  
  popupResultGame = <HTMLElement>document.querySelector('.popup-result-game');
  
  popupBlockCorrect = <HTMLElement>document.querySelector('.block-correct');
  
  popupBlockWrong = <HTMLElement>document.querySelector('.block-wrong');

  linkTextbook = <HTMLElement>document.querySelector('#link-textbook');

  showGameAudio() {
    this.main.innerHTML = '';
    this.main.insertAdjacentHTML('beforeend', render.renderGameAudioCall());
    this.wrapper.style.backgroundImage = 'url("./assets/img/bg-game-audio.webp")';
    const popupGameLevel = <HTMLElement>document.querySelector('.popup-game-level');
    popupGameLevel.classList.remove('active-hidden');
    this.footer.classList.add('active-hidden');
    this.selectionLevelGame();
    this.clickStartButton();
    this.exitGames();
  }

  showGameAudioFromTextbook() {
    this.main.innerHTML = '';
    this.main.insertAdjacentHTML('beforeend', render.renderGameAudioCallFromTextbook());
    this.wrapper.style.backgroundImage = 'url("./assets/img/bg-game-audio.webp")';
    const popupGameLevel = <HTMLElement>document.querySelector('.popup-game-level');
    popupGameLevel.classList.remove('active-hidden');
    this.footer.classList.add('active-hidden');
    this.clickStartButton();
    this.exitGames();
  }

  goToGameAudio() {
    this.linkGameAudio.addEventListener('click', () => {
      storage.currentPage = 'game-audio';
      localStorage.setItem('general-info', JSON.stringify(storage));
      this.btnExitPopupGameFromTextbook.classList.add('active-hidden');
      this.btnRepeatPopupGameFromTextbook.classList.add('active-hidden');
      this.buttonRepeatPopupGame.classList.remove('active-hidden');
      this.buttonExitPopupGame.classList.remove('active-hidden');
      this.showGameAudio();
      this.menuBurg.click();
    });
  }

  goToGameAudioFromPageTextbook() {
    const btnGameAudio = <HTMLElement>document.querySelector('.game-card-audio-call');
    btnGameAudio.addEventListener('click', async () => {
      storage.currentPage = 'game-audio-from-textbook';
      localStorage.setItem('general-info', JSON.stringify(storage));
      this.btnExitPopupGameFromTextbook.classList.remove('active-hidden');
      this.btnRepeatPopupGameFromTextbook.classList.remove('active-hidden');
      this.buttonRepeatPopupGame.classList.add('active-hidden');
      this.buttonExitPopupGame.classList.add('active-hidden');
      await utilsGames.getGamesWords(storage.groupWords, storage.pageWords);
      this.showGameAudioFromTextbook();
    });
  }

  transitionTextbook() {
    this.linkTextbook.addEventListener('click', async () => {
      this.goToGameAudioFromPageTextbook();
    });
  }

  exitGames() {
    const btnCancel = <HTMLElement>document.querySelector('.btn-cancel');
    btnCancel.addEventListener('click', () => {
      this.footer.classList.remove('active-hidden');
      this.logoLinkHome.click();
    });
  }

  exitRoundGame() {
    const btnExit = <HTMLElement>document.querySelector('.game-audio-close');
    btnExit.addEventListener('click', () => {
      this.popupBlockCorrect.innerHTML = '';
      this.popupBlockWrong.innerHTML = '';
      storeGameRound.countGameAudio = 0;
      storeGameRound.falseAnswerGame.length = 0;
      storeGameRound.trueAnswerGame.length = 0;
      this.footer.classList.remove('active-hidden');
      this.logoLinkHome.click();
    });
  }

  exitPopupGame() {
    this.buttonExitPopupGame.addEventListener('click', () => {
      this.popupResultGame.classList.add('active-hidden');
      this.popupBlockCorrect.innerHTML = '';
      this.popupBlockWrong.innerHTML = '';
      this.footer.classList.remove('active-hidden');
      this.logoLinkHome.click();
    });
  }

  exitPopupGameFromTextbook() {
    this.btnExitPopupGameFromTextbook.addEventListener('click', () => {
      this.popupResultGame.classList.add('active-hidden');
      this.popupBlockCorrect.innerHTML = '';
      this.popupBlockWrong.innerHTML = '';
      this.footer.classList.remove('active-hidden');
      this.logoLinkHome.click();
    });
  }

  repeatPopupGameAudio() {
    this.buttonRepeatPopupGame.addEventListener('click', () => {
      this.popupResultGame.classList.add('active-hidden');
      this.popupBlockCorrect.innerHTML = '';
      this.popupBlockWrong.innerHTML = '';
      this.showGameAudio();
    });
  }

  repeatPopupGameFromTextbook() {
    this.btnRepeatPopupGameFromTextbook.addEventListener('click', () => {
      this.popupResultGame.classList.add('active-hidden');
      this.popupBlockCorrect.innerHTML = '';
      this.popupBlockWrong.innerHTML = '';
      this.showGameAudioFromTextbook();
    });
  }

  currentLevelGame() {
    const levelGame = <NodeListOf<Element>>document.querySelectorAll('.levels-game-item');
    levelGame.forEach((item) => {
      if ((<HTMLElement>item).dataset.group === String(storage.levelGame)) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  selectionLevelGame() {
    const blockLevelsGame = <HTMLElement>document.querySelector('.levels-game');
    const btnStart = <HTMLButtonElement>document.querySelector('.btn-start');
    blockLevelsGame.addEventListener('click', async (event) => {
      const element = <HTMLElement>event.target;
      if (element.classList.contains('levels-game-item')) {
        storage.levelGame = Number(element.dataset.group);
        localStorage.setItem('general-info', JSON.stringify(storage));
        this.currentLevelGame();
        btnStart.disabled = false;
        await utilsGames.getGamesWords(storage.levelGame, utilsGames.getRandom());
      }
    });
  }

  clickStartButton() {
    const btnStart = <HTMLButtonElement>document.querySelector('.btn-start');
    btnStart.addEventListener('click', () => {
      this.startRoundGameAudio();
    });
  }

  startRoundGameAudio() {
    const dataRound = storeGameRound.gameAudio[storeGameRound.countGameAudio];
    const currentWord = dataRound.word;
    const currentWordTranslate = dataRound.wordTranslate;
    storeGameRound.divineWordTranslate = currentWordTranslate;
    storeGameRound.divineWord = currentWord;
    const arrAllAnswer = storeGameRound.arrAnswerGameAudio.reduce((total: string[], item) => {
      if (item !== currentWordTranslate) {
        total.push(item);
      }
      return total;
    }, []);
    const arrAnswer = utilsGames.getRandomArrAnswer(arrAllAnswer, currentWordTranslate);
    const createGamePage = new CreateGamePage(dataRound.audio);
    createGamePage.createRoundGameAudio();
    const blockAnswerGame = <HTMLButtonElement>document.querySelector('.block-answer-game');
    arrAnswer.forEach((item, index) => {
      const button = document.createElement('button');
      button.classList.add('button-game', 'btn-answer-item', `answer-${index + 1}`);
      button.textContent = `${index + 1} ${item}`;
      blockAnswerGame.append(button);
    });
    this.playAudioGameAudio();
    const iconMute = <HTMLButtonElement>document.querySelector('.icon-mute');
    iconMute.click();
    this.exitRoundGame();
    this.selectAnswer();
  }

  keyDownHandler() {
    document.addEventListener('keydown', (event) => {
      if ((<HTMLElement> this.main.firstElementChild).className === 'wrapper-games') {
        if (event.code == 'Space') {
          const btnNotKnow = <HTMLButtonElement>document.querySelector('.btn-not-know');
          event.preventDefault();
          btnNotKnow.click();
        }
        if (event.code == 'Enter') {
          const btnNext = <HTMLButtonElement>document.querySelector('.btn-next');
          btnNext.click();
        }
        if (event.code == 'Digit1') {
          const answerOne = <HTMLButtonElement>document.querySelector('.answer-1');
          answerOne.click();
        }
        if (event.code == 'Digit2') {
          const answerTwo = <HTMLButtonElement>document.querySelector('.answer-2');
          answerTwo.click();
        }
        if (event.code == 'Digit3') {
          const answerThree = <HTMLButtonElement>document.querySelector('.answer-3');
          answerThree.click();
        }
        if (event.code == 'Digit4'){
          const answerFour = <HTMLButtonElement>document.querySelector('.answer-4');
          answerFour.click();
        }
        if (event.code == 'Digit5'){
          const answerFive = <HTMLButtonElement>document.querySelector('.answer-5');
          answerFive.click();
        }
      } else {
        return false;
      }
    });
  }

  playAudioGameAudio() {
    const iconMute = <HTMLButtonElement>document.querySelector('.icon-mute');
    iconMute.addEventListener('click', (event) => {
      const audio = new Audio() as HTMLAudioElement;
      const element = <HTMLElement>event.target;
      audio.volume = 0.5;
      const currentAudio = <string>element.dataset.source;
      audio.src = `https://rslang-bak.herokuapp.com/${currentAudio}`;
      audio.play();
    });
  }

  playAudioAnswerGameAudio() {
    const iconAudioGame = <HTMLButtonElement>document.querySelector('.icon-audio-game');
    iconAudioGame.addEventListener('click', (event) => {
      const audio = new Audio() as HTMLAudioElement;
      const element = <HTMLElement>event.target;
      audio.volume = 0.5;
      const currentAudio = <string>element.dataset.source;
      audio.src = `https://rslang-bak.herokuapp.com/${currentAudio}`;
      audio.play();
    });
  }

  playAudioResultGameAudio() {
    const iconAudioPopup = <NodeListOf<Element>>document.querySelectorAll('.icon-audio-popup');
    iconAudioPopup.forEach((item) => {
      item.addEventListener('click', (event) => {
        const audio = new Audio() as HTMLAudioElement;
        const element = <HTMLElement>event.target;
        audio.volume = 0.5;
        const currentAudio = <string>element.dataset.source;
        audio.src = `https://rslang-bak.herokuapp.com/${currentAudio}`;
        audio.play();
      });
    });
  }

  clickBtnNotKnow() {
    const btnNotKnow = <HTMLButtonElement>document.querySelector('.btn-not-know');
    const dataRound = storeGameRound.gameAudio[storeGameRound.countGameAudio];
    const btnAnswerItem = <NodeListOf<Element>>document.querySelectorAll('.btn-answer-item');
    const iconMute = <HTMLButtonElement>document.querySelector('.icon-mute');
    const btnNext = <HTMLButtonElement>document.querySelector('.btn-next');
    btnNotKnow.addEventListener('click', () => {
      iconMute.classList.add('active-hidden');
      btnNotKnow.classList.add('active-hidden');
      btnNext.classList.remove('active-hidden');
      const createGamePage = new CreateGamePage(dataRound.audio, dataRound.id, dataRound.image, dataRound.word, dataRound.wordTranslate);
      createGamePage.createCorrectAnswer();
      btnAnswerItem.forEach((item) => {
        (<HTMLButtonElement>item).disabled = true;
        if ((<string>item.textContent).slice(2) === storeGameRound.divineWordTranslate) {
          (<HTMLElement>item).style.background = 'green';
        }
      });
      const str = `${storeGameRound.divineWord} - ${storeGameRound.divineWordTranslate}`;
      storeGameRound.falseAnswerGame.push(str);
      utilsGames.createResultFalseAnswer();
      this.playAudioAnswerGameAudio();
      this.clickBtnNext();
    });
  }

  clickBtnNext() {
    const btnNext = <HTMLButtonElement>document.querySelector('.btn-next');
    btnNext.addEventListener('click', () => {
      storeGameRound.countGameAudio++;
      if (storeGameRound.countGameAudio > 19) {
        this.popupResultGame.classList.remove('active-hidden');
        this.main.innerHTML = '';
        this.numberWrong.textContent = String(storeGameRound.falseAnswerGame.length);
        this.numberCorrect.textContent = String(storeGameRound.trueAnswerGame.length);
        storeGameRound.countGameAudio = 0;
        storeGameRound.falseAnswerGame.length = 0;
        storeGameRound.trueAnswerGame.length = 0;
        this.playAudioResultGameAudio();
        this.exitPopupGame();
        this.exitPopupGameFromTextbook();
        this.repeatPopupGameAudio();
        this.repeatPopupGameFromTextbook();
      } else {
        this.startRoundGameAudio();
      }
    });
  }

  selectAnswer() {
    this.clickBtnNotKnow();
    const blockAnswerGame = <HTMLElement>document.querySelector('.block-answer-game');
    const btnAnswerItem = <NodeListOf<Element>>document.querySelectorAll('.btn-answer-item');
    const iconMute = <HTMLButtonElement>document.querySelector('.icon-mute');
    const btnNotKnow = <HTMLButtonElement>document.querySelector('.btn-not-know');
    const btnNext = <HTMLButtonElement>document.querySelector('.btn-next');
    const dataRound = storeGameRound.gameAudio[storeGameRound.countGameAudio];
    blockAnswerGame.addEventListener('click', (event) => {
      const element = <HTMLElement>event.target;
      if (!element.classList.contains('btn-answer-item')) return false;
      const audioCorrect = new Audio() as HTMLAudioElement;
      const audioWrong = new Audio() as HTMLAudioElement;
      audioCorrect.src = './assets/audio/correct-answer.mp3';
      audioWrong.src = './assets/audio/wrong-answer.mp3';
      audioCorrect.volume = 0.3;
      audioWrong.volume = 0.3;
      const answer = (<string>element.textContent).slice(2);
      if (answer === storeGameRound.divineWordTranslate) {
        element.style.background = 'green';
        audioCorrect.play();
        iconMute.classList.add('active-hidden');
        btnNotKnow.classList.add('active-hidden');
        btnNext.classList.remove('active-hidden');
        const createGamePage = new CreateGamePage(dataRound.audio, dataRound.id, dataRound.image, dataRound.word, dataRound.wordTranslate);
        createGamePage.createCorrectAnswer();
        btnAnswerItem.forEach((item) => (<HTMLButtonElement>item).disabled = true);
        const str = `${storeGameRound.divineWord} - ${storeGameRound.divineWordTranslate}`;
        storeGameRound.trueAnswerGame.push(str);
        utilsGames.createResultTrueAnswer();
        this.playAudioAnswerGameAudio();
        this.clickBtnNext();
      } else {
        element.style.background = 'red';
        audioWrong.play();
        iconMute.classList.add('active-hidden');
        btnNotKnow.classList.add('active-hidden');
        btnNext.classList.remove('active-hidden');
        const createGamePage = new CreateGamePage(dataRound.audio, dataRound.id, dataRound.image, dataRound.word, dataRound.wordTranslate);
        createGamePage.createCorrectAnswer();
        btnAnswerItem.forEach((item) => {
          (<HTMLButtonElement>item).disabled = true;
          if ((<string>item.textContent).slice(2) === storeGameRound.divineWordTranslate) {
            (<HTMLElement>item).style.background = 'green';
          }
        });
        const str = `${storeGameRound.divineWord} - ${storeGameRound.divineWordTranslate}`;
        storeGameRound.falseAnswerGame.push(str);
        utilsGames.createResultFalseAnswer();
        this.playAudioAnswerGameAudio();
        this.clickBtnNext();
      }
    });
  }

  rebootPage() {
    window.addEventListener('load', async () => {
      if (localStorage.getItem('general-info')) {
        utils.updateStorageGeneralInfo();
        switch (storage.currentPage) {
          case 'game-audio':
            this.showGameAudio();
            this.transitionTextbook();
            break;
          case 'textbook':
            this.goToGameAudioFromPageTextbook();
            break;
          case 'game-audio-from-textbook':
            this.logoLinkHome.click();
            break;
        }
      }
    });
  }

  startAllListenerGames() {
    this.goToGameAudio();
    this.rebootPage();
    this.transitionTextbook();
    this.keyDownHandler();
  }
}

export default GamesController;