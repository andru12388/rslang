
class RenderView {
  renderHomePage(): string {
    return `
      <div class="wrapper-home">
        <div class="main-align-center">
          <h1 class="h1">RS Lang</h1>
          <div class="title-composition"></div>
          <button class="button btn-details">Подробнее</button>
        </div>
      </div>
    `;
  }

  renderLogOut(name: string): string {
    return `
      <p class="text-hello">Привет, <span>${name}</span></p>
      <div class="avatar-img"><i class="fas fa-user-circle"></i></div>
      <button class="log-out"><i class="fas fa-sign-out-alt"></i></button>
    `;
  }

  renderLevelsWords() {
    return `
      <div class="difficulty-levels-words">
        <div class="levels-item item-1" data-group="0">1 (A1)</div>
        <div class="levels-item item-2" data-group="1">2 (A2)</div>
        <div class="levels-item item-3" data-group="2">3 (B1)</div>
        <div class="levels-item item-4" data-group="3">4 (B2)</div>
        <div class="levels-item item-5" data-group="4">5 (C1)</div>
        <div class="levels-item item-6" data-group="5">6 (C2)</div>
      </div>
    `;
  }

  renderTextbook() {
    return `
      <div class="preloader-page"><div class="pulse"></div></div>
      <div class="wrapper-textbook">
        <div class="textbook-content">
          <h2 class="textbook-title">Учебник</h2>
          <p class="title-levels-words">Уровни сложности слов</p>
          ${this.renderLevelsWords()}
          <div class="difficult-words active-hidden">Сложные слова</div>
          <div class="wrapper-card-words">
          
          </div>
          <div class="pagination-textbook"></div>
          <div class="games-block">
            <h2 class="game-title">Игры</h2>
            <div class="games-wrapper">
              <div class="game-card game-card-sprint">
                <h4 class="game-name">Спринт</h4>
                <div class="game-img game-icon-sprint"></div>
                <p class="discription-game">Игра на время. Определи верный перевод слова или нет.</p>
              </div>
              <div class="game-card game-card-audio-call">
                <h4 class="game-name">Аудиовызов</h4>
                <div class="game-img game-icon-audio"></div>
                <p class="discription-game">Попробуй понять, какое слово было произнесено.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderDifficultyPage() {
    return `
      <div class="preloader-page"><div class="pulse"></div></div>
      <div class="wrapper-difficult-words">
        <div class="nav-difficult-words">
          <button href="" class="back-to-textbook"><i class="fas fa-arrow-left"></i> назад в учебник</button>
          <button href="" class="back-to-difficult" disabled>Сложные слова</button>
          <button href="" class="link-study-word">Изученные слова</button>
        </div>
        <div class="wrapper-card-words-difficult">
          
        </div>
        <div class="games-block">
          <h2 class="game-title">Игры</h2>
          <div class="games-wrapper">
            <div class="game-card game-card-sprint">
              <h4 class="game-name">Спринт</h4>
              <div class="game-img game-icon-sprint"></div>
              <p class="discription-game">Игра на время. Определи верный перевод слова или нет.</p>
            </div>
            <div class="game-card game-card-audio-call">
              <h4 class="game-name">Аудиовызов</h4>
              <div class="game-img game-icon-audio"></div>
              <p class="discription-game">Попробуй понять, какое слово было произнесено.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderGameSprint() {
    return `
      <div class="popup-game-level active-hidden">
        <div class="block-description-game">
          <h2 class="title-game-audio-call">Спринт</h2>
          <p class="description-game-audio">Игра Спринт учит быстро переводить слова.</p>
        </div>
        <details class="description-keyboard">
          <summary>Управление на клавиатуре</summary>
          <p><button>F</button> - полноэкранный режим</p>
          <p><button><i class="fas fa-arrow-left"></i></button> - ответить неверно</p>
          <p><button><i class="fas fa-arrow-right"></i></button> - ответить верно</p>
        </details>
        <p class="selection-title-game">Выберите сложность игры</p>
        <div class="levels-game">
          <div class="levels-game-item item-1" data-group="0">1 (A1)</div>
          <div class="levels-game-item item-2" data-group="1">2 (A2)</div>
          <div class="levels-game-item item-3" data-group="2">3 (B1)</div>
          <div class="levels-game-item item-4" data-group="3">4 (B2)</div>
          <div class="levels-game-item item-5" data-group="4">5 (C1)</div>
          <div class="levels-game-item item-6" data-group="5">6 (C2)</div>
        </div>
        <div class="block-button-popap-game">
          <button class="btn-cancel">Выйти</button>
          <button class="btn-start" title="Выберите сложность" disabled>Начать</button>
        </div>
      </div>
    `;
  }

  renderGameAudioCall() {
    return `
      <div class="popup-game-level active-hidden">
        <div class="block-description-game">
          <h2 class="title-game-audio-call">Аудиовызов</h2>
          <p class="description-game-audio">Игра Аудиовызов улучшает твое восприятие речи на слух.</p>
        </div>
        <details class="description-keyboard">
          <summary>Управление на клавиатуре</summary>
          <p><button>F</button> - полноэкранный режим</p>
          <p><button>SPACE</button> - не знаю</p>
          <p><button>ENTER</button> - далее</p>
          <p><button>1,2,3,4,5</button> - варианты ответов</p>
        </details>
        <p class="selection-title-game">Выберите сложность игры</p>
        <div class="levels-game">
          <div class="levels-game-item item-1" data-group="0">1 (A1)</div>
          <div class="levels-game-item item-2" data-group="1">2 (A2)</div>
          <div class="levels-game-item item-3" data-group="2">3 (B1)</div>
          <div class="levels-game-item item-4" data-group="3">4 (B2)</div>
          <div class="levels-game-item item-5" data-group="4">5 (C1)</div>
          <div class="levels-game-item item-6" data-group="5">6 (C2)</div>
        </div>
        <div class="block-button-popap-game">
          <button class="btn-cancel">Выйти</button>
          <button class="btn-start" title="Выберите сложность" disabled>Начать</button>
        </div>
      </div>
    `;
  }

  renderGameAudioCallFromTextbook() {
    return `
      <div class="popup-game-level active-hidden">
        <div class="block-description-game">
          <h2 class="title-game-audio-call">Аудиовызов</h2>
          <p class="description-game-audio">Игра Аудиовызов улучшает твое восприятие речи на слух.</p>
        </div>
        <details class="description-keyboard">
          <summary>Управление на клавиатуре</summary>
          <p><button>F</button> - полноэкранный режим</p>
          <p><button>SPACE</button> - не знаю</p>
          <p><button>ENTER</button> - далее</p>
          <p><button>1,2,3,4,5</button> - варианты ответов</p>
        </details>
        <p class="selection-title-game">Игра начнется с словами из текущей страницы учебника. Удачи!</p>
        <div class="block-button-popap-game">
          <button class="btn-cancel">Выйти</button>
          <button class="btn-start">Начать</button>
        </div>
      </div>
    `;
  }

  renderGameSprintFromTextbook() {
    return `
      <div class="popup-game-level active-hidden">
        <div class="block-description-game">
          <h2 class="title-game-audio-call">Спринт</h2>
          <p class="description-game-audio">Игра Спринт учит быстро переводить слова.</p>
        </div>
        <details class="description-keyboard">
          <summary>Управление на клавиатуре</summary>
          <p><button>F</button> - полноэкранный режим</p>
          <p><button><i class="fas fa-arrow-left"></i></button> - ответить неверно</p>
          <p><button><i class="fas fa-arrow-right"></i></button> - ответить верно</p>
        </details>
        <p class="selection-title-game">Игра начнется с словами из текущей страницы учебника. Удачи!</p>
        <div class="block-button-popap-game">
          <button class="btn-cancel">Выйти</button>
          <button class="btn-start">Начать</button>
        </div>
      </div>
    `;
  }

  selectionRenderPage() {
    if (localStorage.getItem('general-info')) {
      const store = JSON.parse(<string>localStorage.getItem('general-info'));
      switch (store.currentPage) {
        case 'home':
          return this.renderHomePage();
        case 'textbook':
          return this.renderTextbook();
      }
    }
    return this.renderHomePage();
  }

  async render(): Promise<void> {
    const html = `
      <div class="preloader"><div class="pulse"></div></div>
      <header class="header">
        <div class="menu-burger">
          <button class="menu-btn">
            <span></span>
          </button>
        </div>
        <nav class="menu-header">
          <ul class="menu-list">
            <li class="menu-list-item">
              <a href="" class="menu-link" id="link-home"><i class="fas fa-home"></i>Главная</a>
            </li>
            <li class="menu-list-item">
              <a href="" class="menu-link" id="link-textbook"><i class="fas fa-book-reader"></i>Учебник</a>
            </li>
            <li class="menu-list-item menu-list-item-difficulty active-hidden">
              <a href="" class="menu-link" id="link-difficulty"><i class="fas fa-book"></i>Сложные слова</a>
            </li>
            <li class="menu-list-item">
              <a href="" class="sub-menu-link menu-link"><i class="fas fa-gamepad"></i>Игры</a>
              <ul class="submenu-list">
                <li class="submenu-list-item"><a href="" class="menu-link" id="link-game-sprint"><i class="fas fa-running"></i>Спринт</a></li>
                <li class="submenu-list-item"><a href="" class="menu-link" id="link-game-audio"><i class="fas fa-headphones-alt"></i>Аудиовызов</a></li>
              </ul>
            </li>
            <li class="menu-list-item menu-list-item-statistic active-hidden">
              <a href="" class="menu-link" id="link-statistic"><i class="fas fa-trophy"></i>Статистика</a>
            </li>
            <li class="menu-list-item">
              <a href="" class="menu-link" id="link-team"><i class="fas fa-user-friends"></i>О приложении</a>
            </li>
          </ul>
        </nav>
        <h2 class="h2"><a href="" class="logo">RS Lang</a></h2>
        <button class="sign-in"><i class="fas fa-sign-in-alt"></i> Войти</button>
        <div class="avatar-box">
          ${this.renderLogOut(' ')}
        </div>
      </header>
      <main class="main">
        ${this.selectionRenderPage()}
      </main>
      <footer class="footer">
        <a href="https://rs.school/" class="footer-logo" target="_blank"></a>
        <a href="https://github.com/andru12388" class="footer-git" target="_blank">Алисеев Андрей</a>
        <p class="app-dev">2022</p>
      </footer>
      <div class="top" title="Up">
        <i class="fa fa-angle-double-up"></i>
      </div>
      <div class="popup-sign-in">
        <div class="form-close-btn"></div>
        <form class="form-popap-registered">
          <p class="form-title">Регистрация</p>
          <div class="form-input-box">
            <input class="input enter-name" type="text" name="nameUser" placeholder="Имя" required>
            <input class="input enter-email" type="email" name="email" placeholder="E-mail" title="Минимально корректный e-mail (q@e.ru)" required>
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
            <input class="input enter-email" type="email" name="email" placeholder="E-mail" title="Минимально корректный e-mail (q@e.ru)" required>
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
      <div class="popup-about">
        <div class="about-close-btn"></div>
        <h2 class="popup-title">Оцените преимущества приложения</h2>
        <div class="popap-block-card">
          <div class="popup-about-card">
            <div class="popap-card-img img-textbook"></div>
            <h4 class="popap-title-card">Учебник</h4>
            <p class="popap-description-card">Библиотека из 3600 часто встречающихся слов в повседневной жизни. Изучай в своем темпе!</p>
          </div>
          <div class="popup-about-card">
            <div class="popap-card-img img-difficulty"></div>
            <h4 class="popap-title-card">Сложные слова</h4>
            <p class="popap-description-card">Для лучшего запонимания сложных слов отмечай их и повторяй отдельно. Создай свой персональный словарь для изучения слов!</p>
          </div>
          <div class="popup-about-card">
            <div class="popap-card-img img-games"></div>
            <h4 class="popap-title-card">Игры</h4>
            <p class="popap-description-card">2 разные игры помогают учить без скуки с результатом. Аудиовызов - улучшает восприятие речи на слух. Спринт - учит быстро переводить слова.</p>
          </div>
          <div class="popup-about-card">
            <div class="popap-card-img img-statistic"></div>
            <h4 class="popap-title-card">Статистика</h4>
            <p class="popap-description-card">Подробная статистика твоих достижений, изученных слов и ошибок. Ставь цели и вдохновляйся на новые достижения!</p>
          </div>
        </div>
        <h2 class="popap-team">Разработчик</h2>
        <figure class="my-foto">
					<img class="img-responsive" src="./assets/img/Avatar.jpg" alt="My photo">
				</figure>
        <a href="https://github.com/andru12388" class="popap-git" target="_blank">Андрей</a>
      </div>
      <div class="popup-result-game active-hidden">
        <h4>Результат <span class="result-game-sprint"></span></h4>
        <div class="wrapper-result">
          <div class="box-bad-answer">
            <p class="wrong-result">Ошибок <span class="number-wrong"></span></p>
            <div class="block-wrong"></div>
          </div>
          <div class="box-nice-answer">
            <p class="correct-result">Знаю <span class="number-correct"></span></p>
            <div class="block-correct"></div>
          </div>
        </div>
        <div class="box-btn-repeat-exit">
          <button class="button-repeat">Еще раз</button>
          <button class="button-exit">Закончить игру</button>
          <button class="button-repeat-from-textbook active-hidden">Еще раз</button>
          <button class="button-exit-from-textbook active-hidden">Закончить игру</button>
        </div>
      </div>
      <div class="popup-statistic">
        <div class="statistic-close-btn"></div>
        <h3 class="title-statistic">Краткосрочная статистика за сегодня</h3>
        <div class="box-statistic game-sprint-statistic">
          <h4 class="title-games-stat title-sprint-stat">Спринт</h4>
          <ul>
            <li>
              <p class="text-statistic">Всего новых слов: <span class="total-sprint-words">0</span></p>
            </li>
            <li>
              <p class="text-statistic">Процент правильных ответов: <span class="percent-answer-sprint">0%</span></p>
            </li>
            <li>
              <p class="text-statistic">Самая длинная серия правильных ответов: <span class="long-series-sprint">0</span></p>
            </li>
          </ul>
        </div>
        <div class="box-statistic game-audio-statistic">
          <h4 class="title-games-stat title-audio-stat">Аудиовызов</h4>
          <ul>
            <li>
              <p class="text-statistic">Всего новых слов: <span class="total-audio-words">0</span></p>
            </li>
            <li>
              <p class="text-statistic">Процент правильных ответов: <span class="percent-answer-audio">0%</span></p>
            </li>
            <li>
              <p class="text-statistic">Самая длинная серия правильных ответов: <span class="long-series-audio">0</span></p>
            </li>
          </ul>
        </div>
        <div class="box-statistic all-words-statistic">
          <h4 class="title-games-stat title-audio-stat">Статистика по словам</h4>
          <ul>
            <li>
              <p class="text-statistic">Всего новых слов: <span class="total-new-words">0</span></p>
            </li>
            <li>
              <p class="text-statistic">Изученных слов: <span class="learned-words-stat">0</span></p>
            </li>
            <li>
              <p class="text-statistic">Процент правильных ответов: <span class="percent-correct-answer">0%</span></p>
            </li>
          </ul>
        </div>
      </div>
    `;
    const root = document.createElement('div');
    root.classList.add('wrapper');
    root.innerHTML = html;
    document.body.appendChild(root);
  }
}

export default RenderView;