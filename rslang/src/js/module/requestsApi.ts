import { ICreateUser, ILoginUser, IWords, IGeneralInfo, IOptionalGames, IDailyStat } from './components/interface';
import { storeUserInfo, storage } from '../controller/storage';
import PreloaderPage from './components/preloader';

const preloaderPage = new PreloaderPage();

class RequestsApi {
  base = 'https://rslang-bak.herokuapp.com';

  users = `${this.base}/users`;

  signin = `${this.base}/signin`;

  words = `${this.base}/words`;

  async createUser(user: ICreateUser) {
    const messageError = <HTMLElement>document.querySelector('.message-error');
    const response = await fetch(`${this.users}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (response.status === 417) {
      messageError.textContent = 'Пользователь с таким e-mail уже существует! Введите другой e-mail.';
      messageError.style.display = 'block';
    }
    const content = await response.json();
    return content;
  }

  async loginUser({ email, password }: ICreateUser) {
    const messageErrorSignin = <HTMLElement>document.querySelector('.message-error-signin');
    const response = await fetch(`${this.signin}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    switch (response.status) {
      case 404:
        messageErrorSignin.textContent = 'Не удалось найти пользователя! Проверьте логин и пароль.';
        messageErrorSignin.style.display = 'block';
        break;
      case 403:
        messageErrorSignin.textContent = 'Не верный пароль! Попробуйте еще раз.';
        messageErrorSignin.style.display = 'block';
        break;
    }
    const content = await response.json();
    localStorage.setItem('user-info', JSON.stringify(content));
  }

  async getNewUserToken({ userId, refreshToken }: ILoginUser) {
    const response = await fetch(`${this.users}/${userId}/tokens`, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const content = await response.json();
    storeUserInfo.token = content.token;
    storeUserInfo.refreshToken = content.refreshToken;
    localStorage.setItem('user-info', JSON.stringify(storeUserInfo));
  }

  async getUser({ userId, token }: ILoginUser) {
    const response = await fetch(`${this.users}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const content = await response.json();
    return content;
  }

  async getTextbookWords(group: number, page: number): Promise<IWords> {
    const response = await fetch(`${this.words}?group=${group}&page=${page}`);
    if (storage.currentPage === 'textbook') {
      if (response.ok) {
        preloaderPage.hidePreloaderPage();
      }
    }
    const content = await response.json();
    return content;
  }

  async getGameWord({ userId, token }: ILoginUser, wordId: string) {
    const response = await fetch(`${this.users}/${userId}/words/${wordId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const content = await response.json();
    return content;
  }

  async updateGameWords(
    { userId, token }: ILoginUser,
    { correct, wrong }: IOptionalGames,
    difficultyWord: string,
    wordId: string) {
    const response = await fetch(`${this.users}/${userId}/words/${wordId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        difficulty: difficultyWord,
        optional: { gamesAnswer: { correct: correct, wrong: wrong } } 
      }),
    });
    const content = await response.json();
    return content;
  }

  async createGameWords(
    { userId, token }: ILoginUser,
    { correct, wrong }: IOptionalGames,
    difficultyWord: string,
    wordId: string) {
    const response = await fetch(`${this.users}/${userId}/words/${wordId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        difficulty: difficultyWord,
        optional: { gamesAnswer: { correct: correct, wrong: wrong } } 
      }),
    });
    const content = await response.json();
    return content;
  }

  async getWord({ userId, token }: ILoginUser, { wordId }: IGeneralInfo) {
    const response = await fetch(`${this.users}/${userId}/words/${wordId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const content = await response.json();
    return content;
  }

  async createWordsDifficulty(
    { userId, token }: ILoginUser,
    { wordId }: IGeneralInfo,
    { correct, wrong }: IOptionalGames,
    levelWord: string) {
    const response = await fetch(`${this.users}/${userId}/words/${wordId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        difficulty: levelWord,
        optional: { gamesAnswer: { correct: correct, wrong: wrong } } 
      }),
    });
    const content = await response.json();
    return content;
  }

  async updateWordsDifficulty(
    { userId, token }: ILoginUser,
    { wordId }: IGeneralInfo,
    { correct, wrong }: IOptionalGames,
    levelWord: string) {
    const response = await fetch(`${this.users}/${userId}/words/${wordId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        difficulty: levelWord,
        optional: { gamesAnswer: { correct: correct, wrong: wrong } } 
      }),
    });
    const content = await response.json();
    return content;
  }

  async getTextbookWordsSignupUser({ userId, token }: ILoginUser, { groupWords, pageWords }: IGeneralInfo) {
    const response = await fetch(`${this.users}/${userId}/aggregatedWords?wordsPerPage=20&filter={"$and":[{"group":${groupWords}},{"page":${pageWords}}]}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (storage.currentPage === 'textbook') {
      if (response.ok) {
        preloaderPage.hidePreloaderPage();
      }
    }
    const content = await response.json();
    return content;
  }

  async getGameTextbookWordsSignupUser({ userId, token }: ILoginUser, { groupWords, pageWords }: IGeneralInfo) {
    const response = await fetch(`${this.users}/${userId}/aggregatedWords?group=${groupWords}&wordsPerPage=20&filter={"$and":[{"$or":[{"userWord.difficulty":"hard"},{"userWord.difficulty":"normal"},{"userWord":null}]},{"page":${pageWords}}]}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (storage.currentPage === 'textbook') {
      if (response.ok) {
        preloaderPage.hidePreloaderPage();
      }
    }
    const content = await response.json();
    return content;
  }

  async getDifficultWordsSignupUser({ userId, token }: ILoginUser) {
    const response = await fetch(`${this.users}/${userId}/aggregatedWords?wordsPerPage=3600&filter={"userWord.difficulty":"hard"}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      preloaderPage.hidePreloaderPage();
    }
    const content = await response.json();
    return content;
  }

  async getLearnedWordsSignupUser({ userId, token }: ILoginUser) {
    const response = await fetch(`${this.users}/${userId}/aggregatedWords?wordsPerPage=3600&filter={"userWord.difficulty":"easy"}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      preloaderPage.hidePreloaderPage();
    }
    const content = await response.json();
    return content;
  }

  async getStatistic({ userId, token }: ILoginUser): Promise<IDailyStat> {
    const response = await fetch(`${this.users}/${userId}/statistics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const content = await response.json();
    return content;
  }

  async updateStatistic({ userId, token }: ILoginUser, statistic: IDailyStat): Promise<IDailyStat> {
    const response = await fetch(`${this.users}/${userId}/statistics`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        learnedWords: 0,
        optional: {... statistic} 
      }),
    });
    const content = await response.json();
    return content;
  }
}

export default RequestsApi;