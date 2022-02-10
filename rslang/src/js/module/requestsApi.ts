import { ICreateUser, ILoginUser } from './components/interface';

class RequestsApi {
  base = 'https://rslang-bak.herokuapp.com';
  users = `${this.base}/users`;
  signin = `${this.base}/signin`;

  messageError = <HTMLElement>document.querySelector('.message-error');
  messageErrorSignin = <HTMLElement>document.querySelector('.message-error-signin');

  async createUser(user: ICreateUser) {
    const rawResponse = await fetch(`${this.users}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
    });
    if (rawResponse.status === 417) {
      this.messageError.textContent = 'Пользователь с таким e-mail уже существует! Введите другой e-mail.';
      this.messageError.style.display = 'block';
    }
    return await rawResponse.json();
  };

  async loginUser({ email, password }: ICreateUser) {
    const rawResponse = await fetch(`${this.signin}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    switch (rawResponse.status) {
      case 404:
        this.messageErrorSignin.textContent = 'Не удалось найти пользователя! Проверьте логин и пароль.';
        this.messageErrorSignin.style.display = 'block';
        break;
      case 403:
        this.messageErrorSignin.textContent = 'Не верный пароль! Попробуйте еще раз.';
        this.messageErrorSignin.style.display = 'block';
        break;
    }

    const content = await rawResponse.json();
    localStorage.setItem('user-info', JSON.stringify(content));
  };

  async getNewUserToken({ userId, refreshToken }: ILoginUser) {
    const rawResponse = await fetch(`${this.users}/${userId}/tokens`, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    const content = await rawResponse.json();
    localStorage.setItem('user-info', JSON.stringify(content));
  };

  async getUser({ userId, token }: ILoginUser) {
    const rawResponse = await fetch(`${this.users}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    return await rawResponse.json();
  };
}

export default RequestsApi;