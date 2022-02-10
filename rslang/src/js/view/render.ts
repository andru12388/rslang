
class RenderView {
  renderHomePage(): string {
    return `
      <main class="main">
        <div class="main-align-center">
          <h1 class="h1">RS Lang</h1>
          <p class="text-title">Самый лучший и эффективный способ для изучения английского языка.</p>
          <p class="text-title">Теперь учить английский язык легко и увлекательно!</p>
          <button class="button btn-details">Подробнее</button>
        </div>
      </main>
    `;
  }

  renderLogOut(name: string): string {
    return `
      <p class="text-hello">Привет, <span>${name}</span></p>
      <div class="avatar-img"><i class="fas fa-user-circle"></i></div>
      <button class="log-out"><i class="fas fa-sign-out-alt"></i></button>
    `;
  }

  async render(): Promise<void> {
    const html = `
      <header class="header">
        <div class="menu-burger">
          <button class="menu-btn">
            <span></span>
          </button>
        </div>
        <nav class="menu-header">
          <ul class="menu-list">
            <li class="menu-list-item">
              <a href="" class="menu-link"><i class="fas fa-home"></i>Главная</a>
            </li>
            <li class="menu-list-item">
              <a href="" class="menu-link"><i class="fas fa-book-reader"></i>Учебник</a>
            </li>
            <li class="menu-list-item">
              <a href="" class="sub-menu-link menu-link"><i class="fas fa-gamepad"></i>Игры</a>
              <ul class="submenu-list">
                <li class="submenu-list-item"><a href="" class="menu-link"><i class="fas fa-running"></i>Спринт</a></li>
                <li class="submenu-list-item"><a href="" class="menu-link"><i class="fas fa-headphones-alt"></i>Аудиовызов</a></li>
              </ul>
            </li>
            <li class="menu-list-item">
              <a href="" class="menu-link"><i class="fas fa-trophy"></i>Статистика</a>
            </li>
            <li class="menu-list-item">
              <a href="" class="menu-link"><i class="fas fa-user-friends"></i>Команда</a>
            </li>
          </ul>
        </nav>
        <h2 class="h2"><a href="" class="logo">RS Lang</a></h2>
        <button class="sign-in"><i class="fas fa-sign-in-alt"></i> Войти</button>
        <div class="avatar-box">
          ${this.renderLogOut(' ')}
        </div>
      </header>
      ${this.renderHomePage()}
      <footer class="footer">
        <a href="https://rs.school/" class="footer-logo" target="_blank"></a>
        <a href="https://github.com/andru12388" class="footer-git" target="_blank">Алисеев Андрей</a>
        <p class="app-dev">2022</p>
      </footer>
      <div class="popup-sign-in">
        <div class="form-close-btn"></div>
        <form class="form-popap-registered">
          <p class="form-title">Регистрация</p>
          <div class="form-input-box">
            <input class="input enter-name" type="text" name="nameUser" placeholder="Имя" required>
            <input class="input enter-email" type="email" name="email" placeholder="E-mail (q@e.ru)" pattern="^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$" title="Минимально корректный e-mail" required>
            <input class="input enter-password" type="password" name="password" placeholder="Пароль (от 8 до 12 символов)" minlength="8" maxlength="12" required>
          </div>
          <div class="message-error"></div>
          <button class="button-form btn-reg" type="submit">Зарегистрироваться</button>
          <div class="form-answer-box">
            <p>У вас есть аккаунт?</p>
            <a href="" class="link-to-signup">Войти</a>
          </div>
        </form>

        <form class="form-popap-signup">
          <p class="form-title">Вход</p>
          <div class="form-input-box">
            <input class="input enter-email" type="email" name="email" placeholder="E-mail (q@e.ru)" pattern="^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$" title="Минимально корректный e-mail" required>
            <input class="input enter-password" type="password" name="password" placeholder="Пароль (от 8 до 12 символов)" minlength="8" maxlength="12" required>
          </div>
          <div class="message-error-signin"></div>
          <button class="button-form btn-sign" type="submit">Войти</button>
          <div class="form-answer-box">
            <p>У вас нет аккаунта?</p>
            <a href="" class="link-to-registered">Зарегистрироваться</a>
          </div>
        </form>
      </div>
    `;
    const root = document.createElement('div');
    root.classList.add('wrapper');
    root.innerHTML = html;
    document.body.appendChild(root);
  }
}

export default RenderView;