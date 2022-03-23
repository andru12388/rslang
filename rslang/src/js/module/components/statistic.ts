import RequestsApi from '../requestsApi';
import { storeGameRound, storeUserInfo, storage, dailyStat } from '../../controller/storage';
import { IStoreGame, IDailyStat } from './interface';

const api = new RequestsApi();

class StatisticGames {
  saveStatisticStorage(dataResponse: IDailyStat): IDailyStat {
    if (dataResponse.date !== new Date().toLocaleDateString()) {
      const newDailyStat: IDailyStat = JSON.parse(JSON.stringify(dailyStat));
      newDailyStat.wordsList = dataResponse.wordsList;
      storeGameRound.isClearDailyStat = true;
      return newDailyStat;
    } else {
      const newDailyStat: IDailyStat = JSON.parse(JSON.stringify(dailyStat));
      newDailyStat.date = dataResponse.date;
      newDailyStat.games = dataResponse.games;
      newDailyStat.learnedWordsDaily = dataResponse.learnedWordsDaily;
      newDailyStat.percentAllCorrect = dataResponse.percentAllCorrect;
      newDailyStat.totalNewWords = dataResponse.percentAllCorrect;
      newDailyStat.allWordsDaily = dataResponse.allWordsDaily;
      newDailyStat.wordsList = dataResponse.wordsList;
      return newDailyStat;
    }
  }

  uniqueNewWords({ trueAnswerGame, falseAnswerGame }: IStoreGame, { wordsList: { allWordsList } }: IDailyStat): Set<string> {
    const uniqueValue = new Set([...Object.keys(trueAnswerGame), ...Object.keys(falseAnswerGame), ...allWordsList]);
    return uniqueValue;
  }

  recordNewWordsGamesInStatistic({ trueAnswerGame, falseAnswerGame }: IStoreGame, { wordsList: { allWordsList } }: IDailyStat): number {
    const totalAnswer = [...Object.keys(trueAnswerGame), ...Object.keys(falseAnswerGame)];
    return totalAnswer.reduce((total, item) => {
      if (allWordsList.includes(item)) {
        return total;
      }
      total++;
      return total;
    }, 0);
  }

  updateDataStatisticGames({ trueAnswerGame, falseAnswerGame }: IStoreGame, newDailyStat: IDailyStat) {
    if (storage.currentPage === 'game-audio' || storage.currentPage === 'game-audio-from-textbook') {
      newDailyStat.games.audio.correctAnswer += Object.keys(trueAnswerGame).length;
      newDailyStat.games.audio.wrongAnswer += Object.keys(falseAnswerGame).length;
      newDailyStat.games.audio.newWords = this.recordNewWordsGamesInStatistic(storeGameRound, newDailyStat) === 0 
        ? newDailyStat.games.audio.newWords 
        : this.recordNewWordsGamesInStatistic(storeGameRound, newDailyStat);
      const totalWordsAudio = newDailyStat.games.audio.correctAnswer + newDailyStat.games.audio.wrongAnswer;
      newDailyStat.games.audio.percentCorrect = Math.round((newDailyStat.games.audio.correctAnswer / totalWordsAudio) * 100);
      newDailyStat.games.audio.longSeries = newDailyStat.games.audio.longSeries < Math.max(...storeGameRound.longSeriesAnswer)
        ? Math.max(...storeGameRound.longSeriesAnswer)
        : newDailyStat.games.audio.longSeries;
    }
    if (storage.currentPage === 'game-sprint' || storage.currentPage === 'game-sprint-from-textbook') {
      newDailyStat.games.sprint.correctAnswer += Object.keys(trueAnswerGame).length;
      newDailyStat.games.sprint.wrongAnswer += Object.keys(falseAnswerGame).length;
      newDailyStat.games.sprint.newWords = this.recordNewWordsGamesInStatistic(storeGameRound, newDailyStat) === 0 
        ? newDailyStat.games.sprint.newWords 
        : this.recordNewWordsGamesInStatistic(storeGameRound, newDailyStat);
      const totalWordsSprint = newDailyStat.games.sprint.correctAnswer + newDailyStat.games.sprint.wrongAnswer;
      newDailyStat.games.sprint.percentCorrect = Math.round((newDailyStat.games.sprint.correctAnswer / totalWordsSprint) * 100);
      newDailyStat.games.sprint.longSeries = newDailyStat.games.sprint.longSeries < Math.max(...storeGameRound.longSeriesAnswer)
        ? Math.max(...storeGameRound.longSeriesAnswer)
        : newDailyStat.games.sprint.longSeries;
    }
  }

  updateDataStatistic({ trueAnswerGame, falseAnswerGame }: IStoreGame, newDailyStat: IDailyStat) {
    const totalAnswer = Object.keys(trueAnswerGame).length + Object.keys(falseAnswerGame).length;
    this.updateDataStatisticGames(storeGameRound, newDailyStat);
    newDailyStat.allWordsDaily += totalAnswer;
    newDailyStat.totalNewWords = newDailyStat.games.sprint.newWords + newDailyStat.games.audio.newWords;
    newDailyStat.learnedWordsDaily += storeGameRound.learnWordsInGames;
    const totalCurrentAnswerAll = newDailyStat.games.audio.correctAnswer + newDailyStat.games.sprint.correctAnswer;
    newDailyStat.percentAllCorrect = Math.round((totalCurrentAnswerAll / newDailyStat.allWordsDaily) * 100);
    newDailyStat.wordsList.allWordsList = [...this.uniqueNewWords(storeGameRound, newDailyStat)];
  }

  renderStatisticInPage(newDailyStat: IDailyStat) {
    const totalSprintWords = <HTMLButtonElement>document.querySelector('.total-sprint-words');
    const percentAnswerSprint = <HTMLButtonElement>document.querySelector('.percent-answer-sprint');
    const longSeriesSprint = <HTMLButtonElement>document.querySelector('.long-series-sprint');
    const totalAudioWords = <HTMLButtonElement>document.querySelector('.total-audio-words');
    const percentAnswerAudio = <HTMLButtonElement>document.querySelector('.percent-answer-audio');
    const longSeriesAudio = <HTMLButtonElement>document.querySelector('.long-series-audio');
    const totalNewWords = <HTMLButtonElement>document.querySelector('.total-new-words');
    const learnedWordsStat = <HTMLButtonElement>document.querySelector('.learned-words-stat');
    const percentCorrectAnswer = <HTMLButtonElement>document.querySelector('.percent-correct-answer');
    totalSprintWords.textContent = `${newDailyStat.games.sprint.newWords}`;
    percentAnswerSprint.textContent = `${newDailyStat.games.sprint.percentCorrect}%`;
    longSeriesSprint.textContent = `${newDailyStat.games.sprint.longSeries}`;
    totalAudioWords.textContent = `${newDailyStat.games.audio.newWords}`;
    percentAnswerAudio.textContent = `${newDailyStat.games.audio.percentCorrect}%`;
    longSeriesAudio.textContent = `${newDailyStat.games.audio.longSeries}`;
    totalNewWords.textContent = `${newDailyStat.totalNewWords}`;
    learnedWordsStat.textContent = `${newDailyStat.learnedWordsDaily}`;
    percentCorrectAnswer.textContent = `${newDailyStat.percentAllCorrect}%`;
  }

  async saveStatisticInDataBase() {
    try {
      const { optional } = await api.getStatistic(storeUserInfo);
      const newDailyStat = this.saveStatisticStorage(optional);
      this.updateDataStatistic(storeGameRound, newDailyStat);
      this.renderStatisticInPage(newDailyStat);
      await api.updateStatistic(storeUserInfo, newDailyStat);
    } catch (error) {
      await api.updateStatistic(storeUserInfo, dailyStat);
    }
  }

  async getStatisticAfterReloadPage() {
    try {
      const { optional } = await api.getStatistic(storeUserInfo);
      const newDailyStat = this.saveStatisticStorage(optional);
      this.renderStatisticInPage(newDailyStat);
      if (storeGameRound.isClearDailyStat === true) {
        await api.updateStatistic(storeUserInfo, newDailyStat);
        storeGameRound.isClearDailyStat = false;
      }
    } catch (error) {
      await api.updateStatistic(storeUserInfo, dailyStat);
    }
  }

}

export default StatisticGames;