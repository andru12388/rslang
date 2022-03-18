import { ICreateUser } from '../module/components/interface';
import RenderView from '../view/render';
import RequestsApi from '../module/requestsApi';
import { storeUserInfo, storage, storeGameRound } from './storage';
import Utils from '../module/components/utils';
import GamesController from './controller-games';

const api = new RequestsApi();
const render = new RenderView();
const utils = new Utils();

class AppController extends GamesController {
  wrapper = <HTMLElement>document.querySelector('.wrapper');

  main = <HTMLElement>document.querySelector('.main');

  signIn = <HTMLElement>document.querySelector('.sign-in');

  footer = <HTMLElement>document.querySelector('.footer');

  popupSignIn = <HTMLElement>document.querySelector('.popup-sign-in');

  popupAbout = <HTMLElement>document.querySelector('.popup-about');

  popupStatistic = <HTMLElement>document.querySelector('.popup-statistic');

  menuBurg = <HTMLElement>document.querySelector('.menu-btn');

  menuHeader = <HTMLElement>document.querySelector('.menu-header');

  subMenuList = <HTMLElement>document.querySelector('.submenu-list');

  subMenuLink = <HTMLElement>document.querySelector('.sub-menu-link');

  linkToRegistered = <HTMLElement>document.querySelector('.link-to-registered');

  linkToSignup = <HTMLElement>document.querySelector('.link-to-signup');

  formPopapRegistered = <HTMLElement>document.querySelector('.form-popap-registered');

  formPopapSignup = <HTMLElement>document.querySelector('.form-popap-signup');

  formCloseBtn = <HTMLElement>document.querySelector('.form-close-btn');

  aboutCloseBtn = <HTMLElement>document.querySelector('.about-close-btn');

  statisticCloseBtn = <HTMLElement>document.querySelector('.statistic-close-btn');

  messageError = <HTMLElement>document.querySelector('.message-error');

  messageErrorSignin = <HTMLElement>document.querySelector('.message-error-signin');

  logOutBox = <HTMLElement>document.querySelector('.avatar-box');

  logOutBtn = <HTMLElement>document.querySelector('.log-out');

  linkTextbook = <HTMLElement>document.querySelector('#link-textbook');

  linkHome = <HTMLElement>document.querySelector('#link-home');

  linkTeam = <HTMLElement>document.querySelector('#link-team');

  linkStatistic = <HTMLElement>document.querySelector('#link-statistic');

  logoLinkHome = <HTMLElement>document.querySelector('.logo');

  paginationTextbook = <HTMLElement>document.querySelector('.pagination-textbook');

  wrapperCardWords = <HTMLElement>document.querySelector('.wrapper-card-words');

  menuListItemDifficulty = <HTMLElement>document.querySelector('.menu-list-item-difficulty');

  audio = new Audio() as HTMLAudioElement;

  showMenu() {
    this.menuBurg.addEventListener('click', () => {
      this.menuBurg.classList.toggle('active');
      this.menuHeader.classList.toggle('active');
      this.wrapper.classList.toggle('active');
    });
  }

  async outputTextbook() {
    storage.currentPage = 'textbook';
    localStorage.setItem('general-info', JSON.stringify(storage));
    this.main.innerHTML = render.renderTextbook();
    if (storage.isSignupUser) {
      await utils.getCardsWordsSignupUser(storeUserInfo, storage);
    } else {
      await utils.getCardsWords(storage.groupWords, storage.pageWords);
    }
    utils.getPaginationCards(storage.pageWords);
    utils.toggleDisableArrowPagination();
    utils.updateStorageGeneralInfo();
    utils.showHideBtnDifficulty();
    utils.showHideSectionDifficulty();
    utils.isAllLearnedWordAndDifficulty();
    utils.activeLevelWords();
    this.addWordDifficult();
    this.addLearnedWords();
    this.transitionFromTextbookToHardWords();
  }

  async outputDifficultWordPage() {
    storage.currentPage = 'difficult-words';
    localStorage.setItem('general-info', JSON.stringify(storage));
    this.main.innerHTML = '';
    this.main.innerHTML = render.renderDifficultyPage();
    await utils.getAllDifficultyCardsWords(storeUserInfo);
    this.transitionFromHardWordsToTextbook();
    this.goToLearnedWordsPage();
    utils.removeClassActiveFromMain();
    this.listenerGamesStart();
  }

  goToTextbook() {
    this.linkTextbook.addEventListener('click', async () => {
      await this.outputTextbook();
      this.wrapper.style.backgroundImage = '';
      this.footer.classList.remove('active-hidden');
      this.menuBurg.click();
    });
  }

  goToDifficultWordsPage() {
    this.menuListItemDifficulty.addEventListener('click', async () => {
      await this.outputDifficultWordPage();
      this.wrapper.style.backgroundImage = '';
      utils.removeClassActiveFromMain();
      utils.showHideBtnIconInfoStat();
      this.menuBurg.click();
    });
  }

  goToLearnedWordsPage() {
    const linkStudyWord = <HTMLElement>document.querySelector('.link-study-word');
    const gamesBlock = <HTMLElement>document.querySelector('.games-block');
    linkStudyWord.addEventListener('click', async () => {
      storage.currentPage = 'learned-words';
      localStorage.setItem('general-info', JSON.stringify(storage));
      utils.disabledLinkFromDifficultPage();
      await utils.getAllLearnedCardsWords(storeUserInfo);
      gamesBlock.classList.add('active-hidden');
      this.returnDifficultPageFromLearnedPage();
      utils.isEmptyDifficultyWords();
      this.deleteWordLearned();
      utils.showHideBtnIconInfoStat();
    });
  }

  returnDifficultPageFromLearnedPage() {
    const backToDifficult = <HTMLElement>document.querySelector('.back-to-difficult');
    const gamesBlock = <HTMLElement>document.querySelector('.games-block');
    backToDifficult.addEventListener('click', async () => {
      await this.outputDifficultWordPage();
      gamesBlock.classList.remove('active-hidden');
      utils.isEmptyDifficultyWords();
      this.deleteWordDifficult();
      utils.showHideBtnIconInfoStat();
    });
  }

  hideBlockGame() {
    const gamesBlock = <HTMLElement>document.querySelector('.games-block');
    gamesBlock.classList.add('active-hidden');
  }

  navigationPageWords() {
    this.main.addEventListener('click', async (event) => {
      const element = <HTMLElement>event.target;
      if (element.classList.contains('next-arrow')) {
        storage.pageWords++;
        await utils.outputWordsAndPagination();
        utils.toggleDisableArrowPagination();
        utils.showHideBtnDifficulty();
        this.addWordDifficult();
        this.addLearnedWords();
      }
      if (element.classList.contains('prev-arrow')) {
        storage.pageWords--;
        await utils.outputWordsAndPagination();
        utils.toggleDisableArrowPagination();
        utils.showHideBtnDifficulty();
        this.addWordDifficult();
        this.addLearnedWords();
      }
      if (element.classList.contains('btn-pagination')) {
        const currentPage = element.dataset.page;
        storage.pageWords = +<string>currentPage;
        await utils.outputWordsAndPagination();
        utils.toggleDisableArrowPagination();
        utils.showHideBtnDifficulty();
        this.addWordDifficult();
        this.addLearnedWords();
      }
      if (element.classList.contains('levels-item')) {
        const currentGroup = element.dataset.group;
        storage.groupWords = +<string>currentGroup;
        const levelWords = <NodeListOf<Element>>document.querySelectorAll('.levels-item');
        levelWords.forEach((item) => item.classList.remove('active'));
        element.classList.add('active');
        await utils.outputWordsAndPagination();
        utils.toggleDisableArrowPagination();
        utils.showHideBtnDifficulty();
        this.addWordDifficult();
        this.addLearnedWords();
      }
    });
  }

  addWordDifficult() {
    const buttonAddDifficult = <NodeListOf<Element>>document.querySelectorAll('.button-add-difficult');
    buttonAddDifficult.forEach((item) => {
      item.addEventListener('click', async (event) => {
        const element = <HTMLElement>event.target;
        const elementCard = (<HTMLElement>element.parentNode).parentNode;
        const elementButtonEasy = <HTMLElement>element.nextElementSibling;
        storage.wordId = <string>element.dataset.idword;
        localStorage.setItem('general-info', JSON.stringify(storage));
        utils.updateStorageGeneralInfo();
        try {
          const response = await api.getWord(storeUserInfo, storage);
          storeGameRound.gamesAnswer = response.optional.gamesAnswer;
          if (element.classList.contains('active')) {
            await api.updateWordsDifficulty(storeUserInfo, storage, storeGameRound.gamesAnswer, 'normal');
          } else {
            await api.updateWordsDifficulty(storeUserInfo, storage, storeGameRound.gamesAnswer, 'hard');
          }
        } catch (error) {
          await api.createWordsDifficulty(storeUserInfo, storage, storeGameRound.gamesAnswer, 'hard');
        } finally {
          elementButtonEasy.classList.remove('active');
          element.classList.toggle('active');
          if ((<HTMLElement>elementCard).classList.contains('active-learnt')) {
            (<HTMLElement>elementCard).classList.remove('active-learnt');
          }
          (<HTMLElement>elementCard).classList.toggle('active-difficulty');
          utils.isAllLearnedWordAndDifficulty();
        }
      });
    });
  }

  deleteWordDifficult() {
    const buttonDeleteDifficult = <NodeListOf<Element>>document.querySelectorAll('.button-delete-difficult');
    buttonDeleteDifficult.forEach((item) => {
      item.addEventListener('click', async (event) => {
        const element = <HTMLElement>event.target;
        storage.wordId = <string>element.dataset.idword;
        localStorage.setItem('general-info', JSON.stringify(storage));
        utils.updateStorageGeneralInfo();
        try {
          const response = await api.getWord(storeUserInfo, storage);
          storeGameRound.gamesAnswer = response.optional.gamesAnswer;
          await api.updateWordsDifficulty(storeUserInfo, storage, storeGameRound.gamesAnswer, 'normal');
        } catch (error) {
          await api.updateWordsDifficulty(storeUserInfo, storage, storeGameRound.gamesAnswer, 'normal');
        } finally {
          await utils.getAllDifficultyCardsWords(storeUserInfo);
          utils.isEmptyDifficultyWords();
          this.deleteWordDifficult();
        }
      });
    });
  }

  deleteWordLearned() {
    const buttonDeleteStudy = <NodeListOf<Element>>document.querySelectorAll('.button-delete-study');
    buttonDeleteStudy.forEach((item) => {
      item.addEventListener('click', async (event) => {
        const element = <HTMLElement>event.target;
        storage.wordId = <string>element.dataset.idword;
        localStorage.setItem('general-info', JSON.stringify(storage));
        utils.updateStorageGeneralInfo();
        try {
          const response = await api.getWord(storeUserInfo, storage);
          storeGameRound.gamesAnswer = response.optional.gamesAnswer;
          await api.updateWordsDifficulty(storeUserInfo, storage, storeGameRound.gamesAnswer, 'normal');
        } catch (error) {
          await api.updateWordsDifficulty(storeUserInfo, storage, storeGameRound.gamesAnswer, 'normal');
        } finally {
          await utils.getAllLearnedCardsWords(storeUserInfo);
          utils.isEmptyDifficultyWords();
          this.deleteWordLearned();
        }
      });
    });
  }

  addLearnedWords() {
    const buttonStudyWord = <NodeListOf<Element>>document.querySelectorAll('.button-study-word');
    buttonStudyWord.forEach((item) => {
      item.addEventListener('click', async (event) => {
        const element = <HTMLElement>event.target;
        const elementCard = (<HTMLElement>element.parentNode).parentNode;
        const elementButtonHard = <HTMLElement>element.previousElementSibling;
        storage.wordId = <string>element.dataset.idword;
        localStorage.setItem('general-info', JSON.stringify(storage));
        utils.updateStorageGeneralInfo();
        try {
          const response = await api.getWord(storeUserInfo, storage);
          storeGameRound.gamesAnswer = response.optional.gamesAnswer;
          if (element.classList.contains('active')) {
            await api.updateWordsDifficulty(storeUserInfo, storage, storeGameRound.gamesAnswer, 'normal');
          } else {
            await api.updateWordsDifficulty(storeUserInfo, storage, storeGameRound.gamesAnswer, 'easy');
          }
        } catch (error) {
          await api.createWordsDifficulty(storeUserInfo, storage, storeGameRound.gamesAnswer, 'easy');
        } finally {
          elementButtonHard.classList.remove('active');
          element.classList.toggle('active');
          if ((<HTMLElement>elementCard).classList.contains('active-difficulty')) {
            (<HTMLElement>elementCard).classList.remove('active-difficulty');
          }
          (<HTMLElement>elementCard).classList.toggle('active-learnt');
          utils.isAllLearnedWordAndDifficulty();
        }
      });
    });
  }

  playAudioExample() {
    this.main.addEventListener('click', async (event) => {
      const element = <HTMLElement>event.target;
      if (element.classList.contains('icon-audio')) {
        let playNum = 0;
        this.audio.volume = 0.5;
        if (!this.audio.paused) {
          this.audio.pause();
          this.audio.currentTime = 0;
        }
        const currentAudio = <string>element.dataset.source;
        const arrAudio = [currentAudio, `${currentAudio.slice(0, -4)}_meaning.mp3`, `${currentAudio.slice(0, -4)}_example.mp3`];
        this.audio.src = `https://rslang-bak.herokuapp.com/${arrAudio[playNum]}`;
        this.audio.play();
        const playNext = () => {
          const newPlayNum = (playNum + 1) % arrAudio.length;
          this.audio.currentTime = 0;
          playNum = newPlayNum;
          this.audio.src = `https://rslang-bak.herokuapp.com/${arrAudio[playNum]}`;
          this.audio.play();
        };
        this.audio.addEventListener('ended', () => {
          if (playNum === 2) {
            this.audio.pause();
            this.audio.currentTime = 0;
            return false;
          }
          this.audio.pause();
          playNext();
        });
      }
    });
  }

  showHideLearningProgress() {
    this.main.addEventListener('click',  (event) => {
      const element = <HTMLElement>event.target;
      const messageElement = (<HTMLElement>event.target).nextElementSibling;
      if (!element.classList.contains('icon-info-stat')) return false;
      (<HTMLElement>messageElement).classList.toggle('active-hidden');
    });
  }

  goToHome() {
    this.linkHome.addEventListener('click', () => {
      storage.currentPage = 'home';
      localStorage.setItem('general-info', JSON.stringify(storage));
      this.main.innerHTML = render.renderHomePage();
      this.wrapper.style.backgroundImage = 'url("./assets/img/bg-home2.jpg")';
      utils.removeClassActiveFromMain();
      this.goToInfoProject();
      this.footer.classList.remove('active-hidden');
      this.menuBurg.click();
    });
    this.logoLinkHome.addEventListener('click', (event) => {
      event.preventDefault();
      storage.currentPage = 'home';
      localStorage.setItem('general-info', JSON.stringify(storage));
      this.main.innerHTML = render.renderHomePage();
      this.wrapper.style.backgroundImage = 'url("./assets/img/bg-home2.jpg")';
      this.footer.classList.remove('active-hidden');
      this.goToInfoProject();
      utils.removeClassActiveFromMain();
    });
  }

  showSubMenu() {
    this.menuHeader.addEventListener('click', (event) => {
      event.preventDefault();
      if ((event.target as HTMLElement).classList.contains('sub-menu-link') === true) {
        this.subMenuList.classList.toggle('active');
        this.subMenuLink.classList.toggle('active');
      } 
      return false;
    });
  }
  
  hideMenuClickBody() {
    this.wrapper.addEventListener('click', (event) => {
      if ((event.target as HTMLElement).classList.contains('wrapper')) {
        this.menuBurg.classList.remove('active');
        this.menuHeader.classList.remove('active');
        this.wrapper.classList.remove('active');
      }
      return false;
    });
  }
  
  showRegisteredForm() {
    this.linkToRegistered.addEventListener('click', (event) => {
      event.preventDefault();
      this.formPopapRegistered.classList.toggle('active');
      this.formPopapSignup.classList.toggle('active-hidden');
    });
  }
  
  showSigninForm() {
    this.linkToSignup.addEventListener('click', (event) => {
      event.preventDefault();
      this.formPopapRegistered.classList.toggle('active');
      this.formPopapSignup.classList.toggle('active-hidden');
    });
  }
  
  closeFormRegist() {
    this.formCloseBtn.addEventListener('click', () => {
      this.popupSignIn.classList.toggle('active');
      this.wrapper.classList.remove('active');
    });
  }

  transitionFromTextbookToHardWords() {
    const difficultWords = <HTMLElement>document.querySelector('.difficult-words');
    difficultWords.addEventListener('click', async () => {
      await this.outputDifficultWordPage();
      utils.isEmptyDifficultyWords();
      this.deleteWordDifficult();
      utils.removeClassActiveFromMain();
      utils.showHideBtnIconInfoStat();
    });
  }

  listenerGamesStart() {
    this.goToGameAudioFromPageTextbook();
    this.goToGameSprintFromPageTextbook();
  }

  transitionFromHardWordsToTextbook() {
    const backToTextbooks = <HTMLElement>document.querySelector('.back-to-textbook');
    backToTextbooks.addEventListener('click', async () => {
      await this.outputTextbook();
      this.listenerGamesStart();
    });
  }
  
  openFormRegist() {
    this.signIn.addEventListener('click', () => {
      this.popupSignIn.classList.toggle('active');
      this.wrapper.classList.add('active');
    });
  }

  showHideTeamPage() {
    this.aboutCloseBtn.addEventListener('click', () => {
      this.popupAbout.classList.remove('active');
    });
    this.linkTeam.addEventListener('click', () => {
      this.popupAbout.classList.add('active');
      this.menuBurg.click();
    });
  }

  goToInfoProject() {
    const btnInfoProject = <HTMLElement>document.querySelector('.btn-details');
    btnInfoProject.addEventListener('click', () => {
      this.popupAbout.classList.add('active');
    });
  }

  hideStatistic() {
    this.statisticCloseBtn.addEventListener('click', () => {
      this.popupStatistic.classList.remove('active');
    });
  }

  goToStatistic() {
    this.linkStatistic.addEventListener('click', () => {
      this.popupStatistic.classList.add('active');
      this.menuBurg.click();
      this.hideStatistic();
    });
  }

  showPersonalAccount() {
    this.logOutBox.classList.add('active');
    this.signIn.classList.add('active-hidden');
    this.formCloseBtn.click();
  }

  logOutUser() {
    this.wrapper.addEventListener('click', (event) => {
      if ((event.target as HTMLElement).classList.contains('log-out') !== true) return false;
      this.logOutBox.classList.remove('active');
      this.signIn.classList.remove('active-hidden');
      utils.notSignupUser();
      utils.conditionLoadWords();
      if (storage.currentPage === 'difficult-words' || storage.currentPage === 'learned-words') {
        this.logoLinkHome.click();
      }
      utils.removeClassActiveFromMain();
      localStorage.clear();
    });
  }
  
  registeredUser() {
    this.formPopapRegistered.addEventListener('submit', async (event) => {
      event.preventDefault();
      this.messageError.textContent = '';
      this.messageError.style.display = 'none';
      const newUser: ICreateUser = {
        name: (<HTMLFormElement> this.formPopapRegistered).nameUser.value,
        email: (<HTMLFormElement> this.formPopapRegistered).email.value,
        password: (<HTMLFormElement> this.formPopapRegistered).password.value,
      };
      await api.createUser(newUser);
      await api.loginUser(newUser);
      this.logOutBox.innerHTML = render.renderLogOut(<string>newUser.name);
      this.showPersonalAccount();
      utils.signupUser();
    });
  }

  async getRefreshToken() {
    try {
      await api.getNewUserToken(storeUserInfo);
      await api.getUser(storeUserInfo);
      this.logOutBox.innerHTML = render.renderLogOut(<string>storeUserInfo.name);
      this.logOutBox.classList.add('active');
      this.signIn.classList.add('active-hidden');
      utils.signupUser();
      this.addWordDifficult();
      this.addLearnedWords();
    } catch (error) {
      this.signIn.click();
      this.messageErrorSignin.textContent = 'Время прошлой сессии истекло! Войдите в свой аккаунт еще раз.';
      this.messageErrorSignin.style.display = 'block';
      utils.notSignupUser();
    }
  }
  
  loginAccountUser() {
    this.formPopapSignup.addEventListener('submit', async (event) => {
      event.preventDefault();
      this.messageErrorSignin.textContent = '';
      this.messageErrorSignin.style.display = 'none';
      const newUser: ICreateUser = {
        email: (<HTMLFormElement> this.formPopapSignup).email.value,
        password: (<HTMLFormElement> this.formPopapSignup).password.value,
      };
      await api.loginUser(newUser);
      utils.updateStorageUserInfo();
      this.logOutBox.innerHTML = render.renderLogOut(<string>storeUserInfo.name);
      this.showPersonalAccount();
      utils.signupUser();
      await utils.conditionLoadWords();
      utils.showHideBtnDifficulty();
      this.addWordDifficult();
      this.addLearnedWords();
      if (storage.currentPage === 'textbook') {
        utils.isAllLearnedWordAndDifficulty();
      }
    });
  }

  getLocalStorage() {
    window.addEventListener('load', async () => {
      if (localStorage.getItem('user-info')) {
        utils.updateStorageUserInfo();
        try {
          await api.getUser(storeUserInfo);
          this.logOutBox.innerHTML = render.renderLogOut(<string>storeUserInfo.name);
          this.logOutBox.classList.add('active');
          this.signIn.classList.add('active-hidden');
          utils.signupUser();
          this.addWordDifficult();
          this.addLearnedWords();
        } catch (error) {
          await this.getRefreshToken();
        }
      }
      if (localStorage.getItem('general-info')) {
        utils.updateStorageGeneralInfo();
        switch (storage.currentPage) {
          case 'home':
            this.wrapper.style.backgroundImage = 'url("./assets/img/bg-home2.jpg")';
            this.goToInfoProject();
            break;
          case 'textbook':
            this.wrapper.style.backgroundImage = '';
            utils.activeLevelWords();
            if (storage.isSignupUser) {
              await utils.getCardsWordsSignupUser(storeUserInfo, storage);
            } else {
              await utils.getCardsWords(storage.groupWords, storage.pageWords);
            }
            utils.getPaginationCards(storage.pageWords);
            utils.toggleDisableArrowPagination();
            utils.showHideBtnDifficulty();
            utils.showHideSectionDifficulty();
            utils.isAllLearnedWordAndDifficulty();
            this.addWordDifficult();
            this.transitionFromTextbookToHardWords();
            this.addLearnedWords();
            break;
          case 'difficult-words':
            if (storage.isSignupUser) {
              await this.outputDifficultWordPage();
              utils.isEmptyDifficultyWords();
              this.deleteWordDifficult();
              utils.showHideBtnIconInfoStat();
            }
            break;
          case 'learned-words':
            await this.outputDifficultWordPage();
            this.hideBlockGame();
            utils.disabledLinkFromDifficultPage();
            await utils.getAllLearnedCardsWords(storeUserInfo);
            this.returnDifficultPageFromLearnedPage();
            utils.isEmptyDifficultyWords();
            this.deleteWordLearned();
            utils.showHideBtnIconInfoStat();
            break;
        }
      } else {
        this.wrapper.style.backgroundImage = 'url("./assets/img/bg-home2.jpg")';
        utils.removeClassActiveFromMain();
        this.goToInfoProject();
      }
    });
  }

  listenerAll() {
    this.showMenu();
    this.showSubMenu();
    this.hideMenuClickBody();
    this.showRegisteredForm();
    this.showSigninForm();
    this.closeFormRegist();
    this.openFormRegist();
    this.registeredUser();
    this.loginAccountUser();
    this.getLocalStorage();
    this.logOutUser();
    this.goToTextbook();
    this.goToHome();
    this.navigationPageWords();
    this.playAudioExample();
    this.goToDifficultWordsPage();
    this.showHideTeamPage();
    this.showHideLearningProgress();
    this.goToStatistic();
  }
}

export default AppController;