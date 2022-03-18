import { ILoginUser, IGeneralInfo, IResponseWordsSignUser, IWordsSignupUser } from './interface';
import RequestsApi from '../requestsApi';
import { storeUserInfo, storage } from '../../controller/storage';
import CreateCard from '../../view/createCardsWords';
import Paginator from '../../view/pagination';
import PreloaderPage from './preloader';

const api = new RequestsApi();
const preloaderPage = new PreloaderPage();


class Utils {

  async getCardsWords(group: number, page: number) {
    preloaderPage.showPreloaderPage();
    (<HTMLElement>document.querySelector('.wrapper-card-words')).innerHTML = '';
    Object.values(await api.getTextbookWords(group, page)).forEach((item) => {
      const createCards = new CreateCard(item.id, item.image, item.word, item.wordTranslate, item.transcription, item.audio, item.textMeaning, item.textMeaningTranslate, item.textExample, item.textExampleTranslate);
      createCards.createAndRenderCards();
    });
  }

  async getCardsWordsSignupUser(storeUser: ILoginUser, storeGeneral: IGeneralInfo) {
    preloaderPage.showPreloaderPage();
    (<HTMLElement>document.querySelector('.wrapper-card-words')).innerHTML = '';
    Object.values(await api.getTextbookWordsSignupUser(storeUser, storeGeneral))
      .map((item) => (<IResponseWordsSignUser>item).paginatedResults)
      .flat()
      .forEach((el: IWordsSignupUser) => {
        const createCards = new CreateCard(el._id, el.image, el.word, el.wordTranslate, el.transcription, el.audio, el.textMeaning, el.textMeaningTranslate, el.textExample, el.textExampleTranslate, el.userWord);
        if (el.userWord) {
          switch (el.userWord.difficulty) {
            case 'normal':
              createCards.createAndRenderCards();
              break;
            case 'hard':
              createCards.createAndRenderCardsDifficulty();
              break;
            case 'easy':
              createCards.createAndRenderCardsLearned();
              break;
          }
        } else {
          createCards.createAndRenderCards();
        }
      });
  }

  async getAllDifficultyCardsWords(storeUser: ILoginUser) {
    preloaderPage.showPreloaderPage();
    (<HTMLElement>document.querySelector('.wrapper-card-words-difficult')).innerHTML = '';
    Object.values(await api.getDifficultWordsSignupUser(storeUser))
      .map((item) => (<IResponseWordsSignUser>item).paginatedResults)
      .flat()
      .forEach((el: IWordsSignupUser) => {
        const createCardsDifficulty = new CreateCard(
          el._id, el.image, 
          el.word, 
          el.wordTranslate, 
          el.transcription, 
          el.audio, 
          el.textMeaning, 
          el.textMeaningTranslate, 
          el.textExample, 
          el.textExampleTranslate, 
          el.userWord,
        );
        createCardsDifficulty.renderCardsDifficultyPage();
      });
  }

  async getAllLearnedCardsWords(storeUser: ILoginUser) {
    preloaderPage.showPreloaderPage();
    (<HTMLElement>document.querySelector('.wrapper-card-words-difficult')).innerHTML = '';
    Object.values(await api.getLearnedWordsSignupUser(storeUser))
      .map((item) => (<IResponseWordsSignUser>item).paginatedResults)
      .flat()
      .forEach((el: IWordsSignupUser) => {
        const createCardsDifficulty = new CreateCard(
          el._id, 
          el.image, 
          el.word, 
          el.wordTranslate, 
          el.transcription, 
          el.audio, 
          el.textMeaning, 
          el.textMeaningTranslate, 
          el.textExample, 
          el.textExampleTranslate, 
          el.userWord,
        );
        createCardsDifficulty.renderCardsLearnedPage();
      });
  }

  getPaginationCards(pageWords: number, allPageWords = 30, parentElement: HTMLElement = <HTMLElement>document.querySelector('.pagination-textbook')) {
    parentElement.innerHTML = '';
    const paginator = new Paginator(pageWords + 1, allPageWords, parentElement);
    paginator.renderPagination();
  }

  async outputWordsAndPagination() {
    localStorage.setItem('general-info', JSON.stringify(storage));
    if (storage.isSignupUser) {
      await this.getCardsWordsSignupUser(storeUserInfo, storage);
    } else {
      await this.getCardsWords(storage.groupWords, storage.pageWords);
    }
    this.getPaginationCards(storage.pageWords);
    this.isAllLearnedWordAndDifficulty();
  }

  toggleDisableArrowPagination() {
    const nextArrow = <HTMLButtonElement>document.querySelector('.next-arrow');
    const prevArrow = <HTMLButtonElement>document.querySelector('.prev-arrow');
    switch (storage.pageWords) {
      case 29:
        nextArrow.disabled = true;
        break;
      case 0:
        prevArrow.disabled = true;
        break;
      default:
        nextArrow.disabled = false;
        prevArrow.disabled = false;
        break;
    }
  }

  isEmptyDifficultyWords() {
    const wrapperCardWordsDifficult = (<HTMLElement>document.querySelector('.wrapper-card-words-difficult'));
    if (!wrapperCardWordsDifficult.firstChild) {
      const blockMessageEmpty = '<div class="empty-block"><p class="empty-message">Пока в этой категории ничего нет.</p></div>';
      wrapperCardWordsDifficult.insertAdjacentHTML('beforeend', blockMessageEmpty);
    }
  }

  isAllLearnedWordAndDifficulty() {
    if (storage.isSignupUser) {
      const cardWords = <NodeListOf<Element>>document.querySelectorAll('.card-words');
      const main = <HTMLElement>document.querySelector('.main');
      const btnPagination = <HTMLElement>document.querySelector('.btn-pagination');
      const gameCard = <NodeListOf<Element>>document.querySelectorAll('.game-card');
      let count = 0;
      for (const element of cardWords) {
        if (element.classList.contains('active-learnt') || element.classList.contains('active-difficulty')) {
          count++;
        } else {
          break;
        }
      }
      if (count === 20) {
        main.classList.add('active-study');
        btnPagination.classList.add('active-study');
        gameCard.forEach((item) => item.classList.add('active-disabled'));
      } else {
        main.classList.remove('active-study');
        btnPagination.classList.remove('active-study');
        gameCard.forEach((item) => item.classList.remove('active-disabled'));
      }
    }
  }

  removeClassActiveFromMain() {
    const main = <HTMLElement>document.querySelector('.main');
    main.classList.remove('active-study');
    if (storage.currentPage === 'textbook') {
      const btnPagination = <HTMLElement>document.querySelector('.btn-pagination');
      const gameCard = <NodeListOf<Element>>document.querySelectorAll('.game-card');
      btnPagination.classList.remove('active-study');
      gameCard.forEach((item) => item.classList.remove('active-disabled'));
    }
  }

  disabledLinkFromDifficultPage() {
    const linkStudyWord = <HTMLElement>document.querySelector('.link-study-word');
    const backToDifficult = <HTMLElement>document.querySelector('.back-to-difficult');
    linkStudyWord.setAttribute('disabled', 'disabled');
    backToDifficult.removeAttribute('disabled');
  }

  updateStorageUserInfo() {
    const { name, token, refreshToken, userId, message } = JSON.parse(<string>localStorage.getItem('user-info'));
    storeUserInfo.name = name;
    storeUserInfo.message = message;
    storeUserInfo.token = token;
    storeUserInfo.refreshToken = refreshToken;
    storeUserInfo.userId = userId;
  }

  updateStorageGeneralInfo() {
    const { currentPage, groupWords, pageWords, isSignupUser, wordId } = JSON.parse(<string>localStorage.getItem('general-info'));
    storage.currentPage = currentPage;
    storage.groupWords = groupWords;
    storage.pageWords = pageWords;
    storage.isSignupUser = isSignupUser;
    storage.wordId = wordId;
  }

  async conditionLoadWords() {
    if (storage.isSignupUser && storage.currentPage === 'textbook') {
      await this.getCardsWordsSignupUser(storeUserInfo, storage);
    }
    if (!storage.isSignupUser && storage.currentPage === 'textbook') {
      await this.getCardsWords(storage.groupWords, storage.pageWords);
    }
  }

  signupUser() {
    storage.isSignupUser = true;
    localStorage.setItem('general-info', JSON.stringify(storage));
    const menuListItem = <NodeListOf<Element>>document.querySelectorAll('.menu-list-item');
    menuListItem.forEach((item) => item.classList.remove('active-hidden'));
    this.showHideBtnDifficulty();
    if (storage.currentPage === 'textbook') {
      const difficultWords = <HTMLElement>document.querySelector('.difficult-words');
      difficultWords.classList.remove('active-hidden');
    }
  }

  notSignupUser() {
    storage.isSignupUser = false;
    localStorage.setItem('general-info', JSON.stringify(storage));
    const menuListItemDifficulty = <HTMLElement>document.querySelector('.menu-list-item-difficulty');
    menuListItemDifficulty.classList.add('active-hidden');
    const menuListItemStatistic = <HTMLElement>document.querySelector('.menu-list-item-statistic');
    menuListItemStatistic.classList.add('active-hidden');
    this.showHideBtnDifficulty();
    if (storage.currentPage === 'textbook') {
      const difficultWords = <HTMLElement>document.querySelector('.difficult-words');
      difficultWords.classList.add('active-hidden');
    }
  }

  showHideBtnDifficulty() {
    const blockBtnDifficulty = <NodeListOf<Element>>document.querySelectorAll('.block-btn');
    if (storage.isSignupUser) {
      blockBtnDifficulty.forEach((item) => item.classList.remove('active-hidden'));
    } else {
      blockBtnDifficulty.forEach((item) => item.classList.add('active-hidden'));
    }
    this.showHideBtnIconInfoStat();
  }

  showHideBtnIconInfoStat() {
    const iconInfoStat = <NodeListOf<Element>>document.querySelectorAll('.icon-info-stat');
    if (storage.isSignupUser) {
      iconInfoStat.forEach((item) => item.classList.remove('active-hidden'));
    } else {
      iconInfoStat.forEach((item) => item.classList.add('active-hidden'));
    }
  }

  showHideSectionDifficulty() {
    const difficultWords = <HTMLElement>document.querySelector('.difficult-words');
    if (storage.isSignupUser) {
      difficultWords.classList.remove('active-hidden');
    } else {
      difficultWords.classList.add('active-hidden');
    }
  }

  activeLevelWords() {
    const levelWords = <NodeListOf<Element>>document.querySelectorAll('.levels-item');
    levelWords.forEach((item) => {
      if (Number((<HTMLElement>item).dataset.group) === storage.groupWords) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

}

export default Utils;