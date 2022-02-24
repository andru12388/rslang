class CreateGamePage {
  audio: string;

  image: string;

  word: string;

  wordTranslate: string;

  id: string;

  main: HTMLElement;

  constructor(audio?: string, id?: string, image?: string, word?: string, wordTranslate?: string) {
    this.id = <string>id;
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
        <div class="game-audio-call">
          <div class="game-audio-close"></div>
          <div class="game-audio-fullscreen"></div>
          <div class="box-correct-answer">
            
          </div>
          <button class="icon-mute" data-source="${this.audio}"></button>
          <div class="block-answer-game">
            
          </div>
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
}

export default CreateGamePage;