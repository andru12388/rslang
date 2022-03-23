import RenderView from '../view/render';
import { storage, storeGameRound } from './storage';
import { IStoreGame } from '../module/components/interface';
import Utils from '../module/components/utils';
import UtilsGames from '../module/components/utilsGames';
import StatisticGames from '../module/components/statistic';
import CreateGamePage from '../view/createGamesPage';

const render = new RenderView();
const utils = new Utils();
const utilsGames = new UtilsGames();
const statistic = new StatisticGames();

class GamesController {
  linkGameAudio = <HTMLElement>document.querySelector('#link-game-audio');

  linkGameSprint = <HTMLElement>document.querySelector('#link-game-sprint');

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

  header = <HTMLElement>document.querySelector('.header');

  resultGameSprint = <HTMLElement>document.querySelector('.result-game-sprint');

  audioCorrect = new Audio() as HTMLAudioElement;

  audioWrong = new Audio() as HTMLAudioElement;

  interval: NodeJS.Timer | null = null;

  async cancelRoundGameSprint(): Promise<void> {
    const totalScores = <HTMLElement>document.querySelector('.total-score');
    const total = totalScores.textContent;
    this.resultGameSprint.textContent = `- ${total} очков`;
    clearInterval(<NodeJS.Timer> this.interval);
    await this.cancelAllRoundsGame(storeGameRound);
    this.playAudioResultGameAudio();
    this.exitPopupGame();
    this.exitPopupGameFromTextbook();
    this.repeatPopupGameAudio();
    this.repeatPopupGameFromTextbook();
  }

  timer(): void {
    const time = <HTMLElement>document.querySelector('.time');
    let timeRound = 59;
    this.interval = setInterval(async () => {
      time.textContent = `${timeRound}`;
      timeRound--;
      if (timeRound === -1) {
        clearInterval(<NodeJS.Timer> this.interval);
        await this.cancelRoundGameSprint();
      }
    }, 1000);
  }

  startRoundGameSprint({ currentWordTranslate, currentWord }: IStoreGame): void {
    storeGameRound.randomWord = utilsGames.getRandomArrAnswerSprint(currentWordTranslate)[utilsGames.getRandom(0, 1)];
    const createGamePage = new CreateGamePage(currentWord, storeGameRound.randomWord);
    createGamePage.startGameSprint();
    this.timer();
    this.selectAnswerGameSprint();
    this.exitRoundGame();
  }

  async actionOnWrongAnswerSprint({ currentWordTranslate, currentWord }: IStoreGame): Promise<void> {
    const paginationItem = <NodeListOf<Element>>document.querySelectorAll('.pagination-item');
    storeGameRound.falseAnswerGame[utilsGames.selectCorrectId(storeGameRound)] = (`${currentWord} - ${currentWordTranslate}`);
    utilsGames.createResultFalseAnswer(storeGameRound);
    this.installPathsAndVolumeAudio();
    this.audioWrong.play();
    storeGameRound.longSeriesAnswer.push(storeGameRound.countCorrectAnswerInRowSprint);
    storeGameRound.countCorrectAnswerInRowSprint = 0;
    storeGameRound.countPaginationSprint = 0;
    utilsGames.factorPointsGameSprint(storeGameRound);
    paginationItem.forEach((item) => (<HTMLElement>item).style.background = 'none');
    await utilsGames.saveInDataBaseResultWrongGames();
    storeGameRound.countGame++;
    if (storeGameRound.countGame > storeGameRound.gameSprint.length - 1) {
      await this.cancelRoundGameSprint();
    } else {
      this.saveDataRoundInStoreGameRound();
      storeGameRound.randomWord = utilsGames.getRandomArrAnswerSprint(storeGameRound.currentWordTranslate)[utilsGames.getRandom(0, 1)];
      const createGamePage = new CreateGamePage(storeGameRound.currentWord, storeGameRound.randomWord);
      createGamePage.createRoundGameSprint();
    }
  }

  async actionOnCorrectAnswerSprint({ currentWordTranslate, currentWord }: IStoreGame): Promise<void> {
    storeGameRound.trueAnswerGame[utilsGames.selectCorrectId(storeGameRound)] = (`${currentWord} - ${currentWordTranslate}`);
    utilsGames.createResultTrueAnswer(storeGameRound);
    this.installPathsAndVolumeAudio();
    this.audioCorrect.play();
    storeGameRound.countCorrectAnswerInRowSprint++;
    utilsGames.factorPointsGameSprint(storeGameRound);
    utilsGames.plusPointsInTotalScoreSprint();
    utilsGames.resetPaginationGameSprint();
    await utilsGames.saveInDataBaseResultCorrectGames();
    storeGameRound.countGame++;
    if (storeGameRound.countGame > storeGameRound.gameSprint.length - 1) {
      await this.cancelRoundGameSprint();
    } else {
      this.saveDataRoundInStoreGameRound();
      storeGameRound.randomWord = utilsGames.getRandomArrAnswerSprint(storeGameRound.currentWordTranslate)[utilsGames.getRandom(0, 1)];
      const createGamePage = new CreateGamePage(storeGameRound.currentWord, storeGameRound.randomWord);
      createGamePage.createRoundGameSprint();
    }
  }

  selectAnswerGameSprint(): void {
    const blockBtnGameSprint = <HTMLElement>document.querySelector('.block-btn-game-sprint');
    blockBtnGameSprint.addEventListener('click', async (event) => {
      const element = <HTMLElement>event.target;
      if (element.classList.contains('btn-wrong')) {
        if (storeGameRound.currentWordTranslate === storeGameRound.randomWord) {
          await this.actionOnWrongAnswerSprint(storeGameRound);
        } else {
          await this.actionOnCorrectAnswerSprint(storeGameRound);
        }
      }
      if (element.classList.contains('btn-correct')) {
        if (storeGameRound.currentWordTranslate === storeGameRound.randomWord) {
          await this.actionOnCorrectAnswerSprint(storeGameRound);
        } else {
          await this.actionOnWrongAnswerSprint(storeGameRound);
        }
      }
    });
  }

  showGameSprint(): void {
    this.main.innerHTML = '';
    this.main.insertAdjacentHTML('beforeend', render.renderGameSprint());
    this.wrapper.style.backgroundImage = 'url("./assets/img/bg-game-sprint.webp")';
    const popupGameLevel = <HTMLElement>document.querySelector('.popup-game-level');
    popupGameLevel.classList.remove('active-hidden');
    this.footer.classList.add('active-hidden');
    this.selectionLevelGame();
    this.clickStartButton();
    this.exitGames();
  }

  showGameSprintFromTextbook(): void {
    this.main.innerHTML = '';
    this.main.insertAdjacentHTML('beforeend', render.renderGameSprintFromTextbook());
    this.wrapper.style.backgroundImage = 'url("./assets/img/bg-game-sprint.webp")';
    const popupGameLevel = <HTMLElement>document.querySelector('.popup-game-level');
    popupGameLevel.classList.remove('active-hidden');
    this.footer.classList.add('active-hidden');
    this.clickStartButton();
    this.exitGames();
  }

  goToGameSprint(): void {
    this.linkGameSprint.addEventListener('click', () => {
      storage.currentPage = 'game-sprint';
      localStorage.setItem('general-info', JSON.stringify(storage));
      this.hideShowToggleBtnPopupGame();
      this.showGameSprint();
      this.menuBurg.click();
    });
  }

  goToGameSprintFromPageTextbook(): void {
    const btnGameSprint = <HTMLElement>document.querySelector('.game-card-sprint');
    btnGameSprint.addEventListener('click', async () => {
      await utilsGames.selectRequestGameSprint();
      storage.currentPage = 'game-sprint-from-textbook';
      localStorage.setItem('general-info', JSON.stringify(storage));
      this.hideShowToggleBtnPopupGame();
      this.footer.style.display = 'none';
      this.showGameSprintFromTextbook();
    });
  }

  // AudioGame //

  installPathsAndVolumeAudio(): void {
    this.audioCorrect.src = './assets/audio/correct-answer.mp3';
    this.audioWrong.src = './assets/audio/wrong-answer.mp3';
    this.audioCorrect.volume = 0.3;
    this.audioWrong.volume = 0.3;
  }

  showGameAudio(): void {
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

  showGameAudioFromTextbook(): void {
    this.main.innerHTML = '';
    this.main.insertAdjacentHTML('beforeend', render.renderGameAudioCallFromTextbook());
    this.wrapper.style.backgroundImage = 'url("./assets/img/bg-game-audio.webp")';
    const popupGameLevel = <HTMLElement>document.querySelector('.popup-game-level');
    popupGameLevel.classList.remove('active-hidden');
    this.footer.classList.add('active-hidden');
    this.clickStartButton();
    this.exitGames();
  }

  goToGameAudio(): void {
    this.linkGameAudio.addEventListener('click', () => {
      storage.currentPage = 'game-audio';
      localStorage.setItem('general-info', JSON.stringify(storage));
      this.hideShowToggleBtnPopupGame();
      this.showGameAudio();
      this.menuBurg.click();
    });
  }

  goToGameAudioFromPageTextbook(): void {
    const btnGameAudio = <HTMLElement>document.querySelector('.game-card-audio-call');
    btnGameAudio.addEventListener('click', async () => {
      await utilsGames.selectRequestGameAudio();
      storage.currentPage = 'game-audio-from-textbook';
      localStorage.setItem('general-info', JSON.stringify(storage));
      this.hideShowToggleBtnPopupGame();
      this.footer.style.display = 'none';
      this.showGameAudioFromTextbook();
    });
  }

  hideShowToggleBtnPopupGame(): void {
    if (storage.currentPage === 'game-audio' || storage.currentPage === 'game-sprint') {
      this.btnExitPopupGameFromTextbook.classList.add('active-hidden');
      this.btnRepeatPopupGameFromTextbook.classList.add('active-hidden');
      this.buttonRepeatPopupGame.classList.remove('active-hidden');
      this.buttonExitPopupGame.classList.remove('active-hidden');
    } else {
      this.btnExitPopupGameFromTextbook.classList.remove('active-hidden');
      this.btnRepeatPopupGameFromTextbook.classList.remove('active-hidden');
      this.buttonRepeatPopupGame.classList.add('active-hidden');
      this.buttonExitPopupGame.classList.add('active-hidden');
    }
  }

  saveDataRoundInStoreGameRound(): void {
    if (storage.currentPage === 'game-sprint' || storage.currentPage === 'game-sprint-from-textbook') {
      const dataRound = storeGameRound.gameSprint[storeGameRound.countGame];
      storeGameRound.currentWord = dataRound.word;
      storeGameRound.currentWordTranslate = dataRound.wordTranslate;
    } else {
      const dataRound = storeGameRound.gameAudio[storeGameRound.countGame];
      storeGameRound.currentWord = dataRound.word;
      storeGameRound.currentWordTranslate = dataRound.wordTranslate;
    }
  }

  createBtnAnswer({ currentWordTranslate }: IStoreGame): void {
    const arrAnswer = utilsGames.getRandomArrAnswer(currentWordTranslate);
    const blockAnswerGame = <HTMLButtonElement>document.querySelector('.block-answer-game');
    arrAnswer.forEach((item, index) => {
      const button = document.createElement('button');
      button.classList.add('button-game', 'btn-answer-item', `answer-${index + 1}`);
      button.textContent = `${index + 1} ${item}`;
      blockAnswerGame.append(button);
    });
  }

  startRoundGameAudio({ gameAudio, countGame }: IStoreGame): void {
    const dataRound = gameAudio[countGame];
    const createGamePage = new CreateGamePage(dataRound.word, dataRound.wordTranslate, dataRound.audio, dataRound.image);
    createGamePage.createRoundGameAudio();
    this.createBtnAnswer(storeGameRound);
    this.playAudioGameAudio();
    const iconMute = <HTMLButtonElement>document.querySelector('.icon-mute');
    iconMute.click();
    this.exitRoundGame();
    this.answerBtnNotKnow();
    this.selectAnswer(storeGameRound);
  }

  clickStartButton(): void {
    const btnStart = <HTMLButtonElement>document.querySelector('.btn-start');
    btnStart.addEventListener('click', () => {
      this.saveDataRoundInStoreGameRound();
      if (storage.currentPage === 'game-sprint' || storage.currentPage === 'game-sprint-from-textbook') {
        this.startRoundGameSprint(storeGameRound);
      } else {
        this.startRoundGameAudio(storeGameRound);
      }
    });
  }

  checkDisabledAnswer({ currentWordTranslate }: IStoreGame): void {
    const btnAnswerItem = <NodeListOf<Element>>document.querySelectorAll('.btn-answer-item');
    btnAnswerItem.forEach((item) => {
      (<HTMLButtonElement>item).disabled = true;
      if ((<string>item.textContent).slice(2) === currentWordTranslate) {
        (<HTMLElement>item).style.background = 'green';
      }
    });
  }

  hideShowBtnWhenAnswer(): void {
    const btnNotKnow = <HTMLButtonElement>document.querySelector('.btn-not-know');
    const iconMute = <HTMLButtonElement>document.querySelector('.icon-mute');
    const btnNext = <HTMLButtonElement>document.querySelector('.btn-next');
    iconMute.classList.add('active-hidden');
    btnNotKnow.classList.add('active-hidden');
    btnNext.classList.remove('active-hidden');
  }

  answerBtnNotKnow(): void {
    const btnNotKnow = <HTMLButtonElement>document.querySelector('.btn-not-know');
    btnNotKnow.addEventListener('click', () => {
      this.actionOnWrongAnswer(storeGameRound);
    });
  }

  async cancelAllRoundsGame({ falseAnswerGame, trueAnswerGame }: IStoreGame): Promise<void> {
    this.popupResultGame.classList.remove('active-hidden');
    this.main.innerHTML = '';
    this.numberWrong.textContent = String(Object.keys(falseAnswerGame).length);
    this.numberCorrect.textContent = String(Object.keys(trueAnswerGame).length);
    storeGameRound.longSeriesAnswer.push(storeGameRound.countCorrectAnswerInRowSprint);
    storeGameRound.countGame = 0;
    storeGameRound.countCorrectAnswerInRowSprint = 0;
    storeGameRound.countPaginationSprint = 0;
    if (storage.isSignupUser) {
      await statistic.saveStatisticInDataBase();
    }
    storeGameRound.longSeriesAnswer.length = 0;
    storeGameRound.learnWordsInGames = 0;
    for (const item in falseAnswerGame) delete falseAnswerGame[item];
    for (const item in trueAnswerGame) delete trueAnswerGame[item];
  }

  pressBtnNext(): void {
    const btnNext = <HTMLButtonElement>document.querySelector('.btn-next');
    btnNext.addEventListener('click', async () => {
      storeGameRound.countGame++;
      if (storeGameRound.countGame > storeGameRound.gameAudio.length - 1) {
        await this.cancelAllRoundsGame(storeGameRound);
        this.playAudioResultGameAudio();
        this.exitPopupGame();
        this.exitPopupGameFromTextbook();
        this.repeatPopupGameAudio();
        this.repeatPopupGameFromTextbook();
      } else {
        this.saveDataRoundInStoreGameRound();
        this.startRoundGameAudio(storeGameRound);
      }
    });
  }

  async actionOnCorrectAnswer({ gameAudio, countGame, currentWordTranslate, currentWord }: IStoreGame): Promise<void> {
    const btnAnswerItem = <NodeListOf<Element>>document.querySelectorAll('.btn-answer-item');
    const dataRound = gameAudio[countGame];
    const wordID = utilsGames.selectCorrectId(storeGameRound);
    this.hideShowBtnWhenAnswer();
    const createGamePage = new CreateGamePage(dataRound.word, dataRound.wordTranslate, dataRound.audio, dataRound.image);
    createGamePage.createCorrectAnswer();
    btnAnswerItem.forEach((item) => (<HTMLButtonElement>item).disabled = true);
    storeGameRound.trueAnswerGame[wordID] = (`${currentWord} - ${currentWordTranslate}`);
    storeGameRound.countCorrectAnswerInRowSprint++;
    utilsGames.createResultTrueAnswer(storeGameRound);
    this.playAudioAnswerGameAudio();
    this.pressBtnNext();
    await utilsGames.saveInDataBaseResultCorrectGames();
  }

  async actionOnWrongAnswer({ gameAudio, countGame, currentWordTranslate, currentWord }: IStoreGame): Promise<void> {
    const dataRound = gameAudio[countGame];
    const wordID = utilsGames.selectCorrectId(storeGameRound);
    this.hideShowBtnWhenAnswer();
    const createGamePage = new CreateGamePage(dataRound.word, dataRound.wordTranslate, dataRound.audio, dataRound.image);
    createGamePage.createCorrectAnswer();
    this.checkDisabledAnswer(storeGameRound);
    storeGameRound.falseAnswerGame[wordID] = (`${currentWord} - ${currentWordTranslate}`);
    storeGameRound.longSeriesAnswer.push(storeGameRound.countCorrectAnswerInRowSprint);
    storeGameRound.countCorrectAnswerInRowSprint = 0;
    utilsGames.createResultFalseAnswer(storeGameRound);
    this.playAudioAnswerGameAudio();
    this.pressBtnNext();
    await utilsGames.saveInDataBaseResultWrongGames();
  }

  selectAnswer({ currentWordTranslate }: IStoreGame): void {
    const blockAnswerGame = <HTMLElement>document.querySelector('.block-answer-game');
    blockAnswerGame.addEventListener('click', async (event) => {
      const element = <HTMLElement>event.target;
      if (!element.classList.contains('btn-answer-item')) return false;
      const answer = (<string>element.textContent).slice(2);
      if (answer === currentWordTranslate) {
        element.style.background = 'green';
        this.installPathsAndVolumeAudio();
        this.audioCorrect.play();
        await this.actionOnCorrectAnswer(storeGameRound);
      } else {
        element.style.background = 'red';
        this.installPathsAndVolumeAudio();
        this.audioWrong.play();
        await this.actionOnWrongAnswer(storeGameRound);
      }
    });
  }

  transitionTextbook(): void {
    this.linkTextbook.addEventListener('click', async () => {
      this.goToGameAudioFromPageTextbook();
      this.goToGameSprintFromPageTextbook();
    });
  }

  exitGames(): void {
    const btnCancel = <HTMLElement>document.querySelector('.btn-cancel');
    btnCancel.addEventListener('click', () => {
      this.footer.style.display = '';
      this.logoLinkHome.click();
    });
  }

  exitRoundGame(): void {
    const btnExit = <HTMLElement>document.querySelector('.game-audio-close');
    btnExit.addEventListener('click', () => {
      this.popupBlockCorrect.innerHTML = '';
      this.popupBlockWrong.innerHTML = '';
      storeGameRound.countGame = 0;
      storeGameRound.countCorrectAnswerInRowSprint = 0;
      storeGameRound.countPaginationSprint = 0;
      storeGameRound.longSeriesAnswer.length = 0;
      storeGameRound.learnWordsInGames = 0;
      clearInterval(<NodeJS.Timer> this.interval);
      for (const item in storeGameRound.falseAnswerGame) delete storeGameRound.falseAnswerGame[item];
      for (const item in storeGameRound.trueAnswerGame) delete storeGameRound.trueAnswerGame[item];
      this.footer.style.display = '';
      this.logoLinkHome.click();
    });
  }

  fullscreenRoundGame(): void {
    document.addEventListener('click', (event) => {
      const element = <HTMLElement>event.target;
      if (!element.classList.contains('game-audio-fullscreen')) return false;
      if (document.fullscreenElement) {
        document.exitFullscreen();
        this.header.style.display = '';
      } else {
        document.documentElement.requestFullscreen();
        this.header.style.display = 'none';
      }
    });
  }

  exitPopupGame(): void {
    this.buttonExitPopupGame.addEventListener('click', () => {
      this.popupResultGame.classList.add('active-hidden');
      this.popupBlockCorrect.innerHTML = '';
      this.popupBlockWrong.innerHTML = '';
      this.resultGameSprint.textContent = '';
      this.footer.style.display = '';
      this.logoLinkHome.click();
    });
  }

  exitPopupGameFromTextbook(): void {
    this.btnExitPopupGameFromTextbook.addEventListener('click', () => {
      this.buttonExitPopupGame.click();
    });
  }

  repeatPopupGameAudio(): void {
    this.buttonRepeatPopupGame.addEventListener('click', () => {
      this.popupResultGame.classList.add('active-hidden');
      this.popupBlockCorrect.innerHTML = '';
      this.popupBlockWrong.innerHTML = '';
      this.resultGameSprint.textContent = '';
      if (storage.currentPage === 'game-sprint' || storage.currentPage === 'game-sprint-from-textbook') {
        this.showGameSprint();
      } else {
        this.showGameAudio();
      }
    });
  }

  repeatPopupGameFromTextbook(): void {
    this.btnRepeatPopupGameFromTextbook.addEventListener('click', async () => {
      this.popupResultGame.classList.add('active-hidden');
      this.popupBlockCorrect.innerHTML = '';
      this.popupBlockWrong.innerHTML = '';
      this.resultGameSprint.textContent = '';
      if (storage.currentPage === 'game-sprint' || storage.currentPage === 'game-sprint-from-textbook') {
        this.showGameSprintFromTextbook();
        await utilsGames.selectRequestGameSprint();
      } else {
        this.showGameAudioFromTextbook();
        await utilsGames.selectRequestGameAudio();
      }
    });
  }

  currentLevelGame(): void {
    const levelGame = <NodeListOf<Element>>document.querySelectorAll('.levels-game-item');
    levelGame.forEach((item) => {
      if ((<HTMLElement>item).dataset.group === String(storage.levelGame)) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  selectionLevelGame(): void {
    const blockLevelsGame = <HTMLElement>document.querySelector('.levels-game');
    const btnStart = <HTMLButtonElement>document.querySelector('.btn-start');
    blockLevelsGame.addEventListener('click', async (event) => {
      const element = <HTMLElement>event.target;
      if (!element.classList.contains('levels-game-item')) return false;
      storage.levelGame = Number(element.dataset.group);
      localStorage.setItem('general-info', JSON.stringify(storage));
      this.currentLevelGame();
      btnStart.disabled = false;
      if (storage.currentPage === 'game-sprint') {
        await utilsGames.getGamesWordsSprint(storage.levelGame, utilsGames.getRandom());
      } else {
        await utilsGames.getGamesWords(storage.levelGame, utilsGames.getRandom());
      }
    });
  }

  keyDownHandler(): void {
    document.addEventListener('keydown', (event) => {
      if ((<HTMLElement> this.main.firstElementChild).className === 'wrapper-games') {
        if (event.code == 'KeyF') {
          if (document.fullscreenElement) {
            document.exitFullscreen();
            this.header.style.display = '';
          } else {
            document.documentElement.requestFullscreen();
            this.header.style.display = 'none';
          }
        }
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
        if (event.code == 'Digit4') {
          const answerFour = <HTMLButtonElement>document.querySelector('.answer-4');
          answerFour.click();
        }
        if (event.code == 'Digit5') {
          const answerFive = <HTMLButtonElement>document.querySelector('.answer-5');
          answerFive.click();
        }
        if (event.code == 'ArrowLeft') { 
          const btnWrong = <HTMLButtonElement>document.querySelector('.btn-wrong');
          btnWrong.click();
        }
        if (event.code == 'ArrowRight') { 
          const btnCorrect = <HTMLButtonElement>document.querySelector('.btn-correct');
          btnCorrect.click();
        }
      } else {
        return false;
      }
    });
  }

  playAudioGameAudio(): void {
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

  playAudioAnswerGameAudio(): void {
    const iconAudioGame = <HTMLButtonElement>document.querySelector('.icon-audio-game');
    const iconMute = <HTMLButtonElement>document.querySelector('.icon-mute');
    iconAudioGame.addEventListener('click', () => {
      iconMute.click();
    });
  }

  playAudioResultGameAudio(): void {
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

  rebootPage(): void {
    window.addEventListener('load', async () => {
      if (localStorage.getItem('general-info')) {
        utils.updateStorageGeneralInfo();
        switch (storage.currentPage) {
          case 'game-audio':
            this.showGameAudio();
            this.transitionTextbook();
            break;
          case 'game-sprint':
            this.showGameSprint();
            break;
          case 'textbook':
            this.goToGameAudioFromPageTextbook();
            this.goToGameSprintFromPageTextbook();
            break;
          case 'game-audio-from-textbook':
            this.logoLinkHome.click();
            break;
          case 'game-sprint-from-textbook':
            this.logoLinkHome.click();
            break;
        }
      }
    });
  }

  startAllListenerGames(): void {
    this.goToGameSprint();
    this.goToGameAudio();
    this.rebootPage();
    this.transitionTextbook();
    this.keyDownHandler();
    this.fullscreenRoundGame();
    this.installPathsAndVolumeAudio();
  }
}

export default GamesController;