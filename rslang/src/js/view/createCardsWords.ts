class CreateCard {
  wrapperCardWords: HTMLElement;

  audio: string;

  image: string;

  textExample: string;

  textExampleTranslate: string;

  textMeaning: string;

  textMeaningTranslate: string;

  transcription: string;

  word: string;

  wordTranslate: string;

  id: string;

  wrapperCardWordsDifficult: HTMLElement;

  constructor(id: string, image: string, word: string, wordTranslate: string, transcription: string, audio: string, textMeaning: string, textMeaningTranslate: string, textExample: string, textExampleTranslate: string) {
    this.id = id;
    this.image = image;
    this.word = word;
    this.wordTranslate = wordTranslate;
    this.transcription = transcription;
    this.audio = audio;
    this.textMeaning = textMeaning;
    this.textMeaningTranslate = textMeaningTranslate;
    this.textExample = textExample;
    this.textExampleTranslate = textExampleTranslate;
    this.wrapperCardWords = <HTMLElement>document.querySelector('.wrapper-card-words');
    this.wrapperCardWordsDifficult = <HTMLElement>document.querySelector('.wrapper-card-words-difficult');
  }


  createAndRenderCards() {
    const card = `
      <div class="card-words">
        <img class="card-words-img" src="https://rslang-bak.herokuapp.com/${this.image}" alt="${this.wordTranslate}"></img>
        <p class="word">${this.word}</p>
        <div class="block-words">
          <p class="word-translate">${this.wordTranslate}</p>
          <p class="word-transcription">${this.transcription}</p>
          <button class="icon-audio" data-source="${this.audio}"></button>
        </div>
        <div class="block-example">
          <h3 class="h3">Значение</h3>
          <p>${this.textMeaning}</p>
          <p>${this.textMeaningTranslate}</p>
          <h3 class="h3">Пример</h3>
          <p>${this.textExample}</p>
          <p>${this.textExampleTranslate}</p>
        </div>
        <div class="block-btn active-hidden">
          <button class="button-add-difficult" data-idword="${this.id}">Сложное</button>
          <button class="button-study-word" data-idword="${this.id}">Изученное</button>
        </div>
      </div>
    `;
    this.wrapperCardWords.insertAdjacentHTML('beforeend', card);
  }

  createAndRenderCardsDifficulty() {
    const card = `
      <div class="card-words active-difficulty">
        <img class="card-words-img" src="https://rslang-bak.herokuapp.com/${this.image}" alt="${this.wordTranslate}"></img>
        <p class="word">${this.word}</p>
        <div class="block-words">
          <p class="word-translate">${this.wordTranslate}</p>
          <p class="word-transcription">${this.transcription}</p>
          <button class="icon-audio" data-source="${this.audio}"></button>
        </div>
        <div class="block-example">
          <h3 class="h3">Значение</h3>
          <p>${this.textMeaning}</p>
          <p>${this.textMeaningTranslate}</p>
          <h3 class="h3">Пример</h3>
          <p>${this.textExample}</p>
          <p>${this.textExampleTranslate}</p>
        </div>
        <div class="block-btn active-hidden">
          <button class="button-add-difficult active" data-idword="${this.id}">Сложное</button>
          <button class="button-study-word" data-idword="${this.id}">Изученное</button>
        </div>
      </div>
    `;
    this.wrapperCardWords.insertAdjacentHTML('beforeend', card);
  }

  renderCardsDifficultyPage() {
    const card = `
      <div class="card-words active-difficulty">
        <img class="card-words-img" src="https://rslang-bak.herokuapp.com/${this.image}" alt="${this.wordTranslate}"></img>
        <p class="word">${this.word}</p>
        <div class="block-words">
          <p class="word-translate">${this.wordTranslate}</p>
          <p class="word-transcription">${this.transcription}</p>
          <button class="icon-audio" data-source="${this.audio}"></button>
        </div>
        <div class="block-example">
          <h3 class="h3">Значение</h3>
          <p>${this.textMeaning}</p>
          <p>${this.textMeaningTranslate}</p>
          <h3 class="h3">Пример</h3>
          <p>${this.textExample}</p>
          <p>${this.textExampleTranslate}</p>
        </div>
        <div class="block-btn">
          <button class="button-delete-difficult active" data-idword="${this.id}">Удалить</button>
        </div>
      </div>
    `;
    this.wrapperCardWordsDifficult.insertAdjacentHTML('beforeend', card);
  }

  createAndRenderCardsLearned() {
    const card = `
      <div class="card-words active-learnt">
        <img class="card-words-img" src="https://rslang-bak.herokuapp.com/${this.image}" alt="${this.wordTranslate}"></img>
        <p class="word">${this.word}</p>
        <div class="block-words">
          <p class="word-translate">${this.wordTranslate}</p>
          <p class="word-transcription">${this.transcription}</p>
          <button class="icon-audio" data-source="${this.audio}"></button>
        </div>
        <div class="block-example">
          <h3 class="h3">Значение</h3>
          <p>${this.textMeaning}</p>
          <p>${this.textMeaningTranslate}</p>
          <h3 class="h3">Пример</h3>
          <p>${this.textExample}</p>
          <p>${this.textExampleTranslate}</p>
        </div>
        <div class="block-btn active-hidden">
          <button class="button-add-difficult" data-idword="${this.id}">Сложное</button>
          <button class="button-study-word active" data-idword="${this.id}">Изученное</button>
        </div>
      </div>
    `;
    this.wrapperCardWords.insertAdjacentHTML('beforeend', card);
  }

  renderCardsLearnedPage() {
    const card = `
      <div class="card-words active-learnt">
        <img class="card-words-img" src="https://rslang-bak.herokuapp.com/${this.image}" alt="${this.wordTranslate}"></img>
        <p class="word">${this.word}</p>
        <div class="block-words">
          <p class="word-translate">${this.wordTranslate}</p>
          <p class="word-transcription">${this.transcription}</p>
          <button class="icon-audio" data-source="${this.audio}"></button>
        </div>
        <div class="block-example">
          <h3 class="h3">Значение</h3>
          <p>${this.textMeaning}</p>
          <p>${this.textMeaningTranslate}</p>
          <h3 class="h3">Пример</h3>
          <p>${this.textExample}</p>
          <p>${this.textExampleTranslate}</p>
        </div>
        <div class="block-btn">
          <button class="button-delete-study active" data-idword="${this.id}">Удалить</button>
        </div>
      </div>
    `;
    this.wrapperCardWordsDifficult.insertAdjacentHTML('beforeend', card);
  }
}

export default CreateCard;