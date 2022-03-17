class CreateGamePage {
  audio: string;

  image: string;

  word: string;

  wordTranslate: string;

  main: HTMLElement;

  constructor(word?: string, wordTranslate?: string, audio?: string, image?: string) {
    this.image = <string>image;
    this.word = <string>word;
    this.wordTranslate = <string>wordTranslate;
    this.audio = <string>audio;
    this.main = <HTMLElement>document.querySelector('.main');
  }

  createRoundGameAudio() {
    this.main.innerHTML = '';
    const page = `
      <div class="wrapper-games">
        <div class="btn-nav-round">
          <div class="game-audio-close"></div>
          <div class="game-audio-fullscreen"></div>
        </div>
        <div class="game-audio-call">
          <div class="box-correct-answer"></div>
          <button class="icon-mute" data-source="${this.audio}"></button>
          <div class="block-answer-game"></div>
          <div class="block-btn-game-audio">
            <button class="button-game btn-not-know">Не знаю</button>
            <button class="button-game btn-next active-hidden">Дальше</button>
          </div>
        </div>
      </div>
    `;
    this.main.insertAdjacentHTML('beforeend', page);
  }

  createCorrectAnswer() {
    const boxCorrectAnswer = <HTMLElement>document.querySelector('.box-correct-answer');
    boxCorrectAnswer.innerHTML = '';
    const blockAnswer = `
      <div class="card-words">
        <img class="card-words-img" src="https://rslang-bak.herokuapp.com/${this.image}" alt="${this.wordTranslate}"></img>
        <p class="word">${this.word}</p>
        <div class="block-words">
          <p class="word-translate">${this.wordTranslate}</p>
          <button class="icon-audio-game" data-source="${this.audio}"></button>
        </div>
      </div>
    `;
    boxCorrectAnswer.insertAdjacentHTML('beforeend', blockAnswer);
  }

  startGameSprint() {
    this.main.innerHTML = '';
    const page = `
      <div class="wrapper-games">
        <div class="btn-nav-round">
          <div class="game-sprint-close game-audio-close"></div>
          <div class="game-audio-fullscreen"></div>
        </div>
        <div class="game-sprint">
          <div class="timer-game"><span class="time">60</span></div>
          <div class="block-score">
            <div class="point-word"><b>+</b> <span class="quality-points">10</span> очков за слово</div>
            <div class="total-point">Итого: <span class="total-score">0</span></div>
          </div>
          <div class="card-game-sprint">
            <div class="pagination-game-sprint">
              <div class="pagination-item"></div>
              <div class="pagination-item"></div>
              <div class="pagination-item"></div>
            </div>
            <div class="question-box">
              <p class="word-game">${this.word}</p>
              <p class="word-translate-game">${this.wordTranslate}</p>
            </div>
            <div class="block-btn-game-sprint">
              <button class="button-game-sprint btn-wrong">Неверно</button>
              <button class="button-game-sprint btn-correct">Верно</button>
            </div>
          </div>
        </div>
      </div>
    `;
    this.main.insertAdjacentHTML('beforeend', page);
  }

  createRoundGameSprint() {
    const questionBox = <HTMLElement>document.querySelector('.question-box');
    questionBox.innerHTML = '';
    const blockQuestion = `
      <p class="word-game">${this.word}</p>
      <p class="word-translate-game">${this.wordTranslate}</p>
    `;
    questionBox.insertAdjacentHTML('beforeend', blockQuestion);
  }

}

export default CreateGamePage;