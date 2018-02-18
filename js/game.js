const randomColors = ['blue', 'rgb(0, 255, 42)', 'rgb(255, 242, 0)', 'rgb(255, 107, 0)', 'rgb(200, 0, 255)', 'rgb(255, 0, 0)'];

class Game {
  constructor(config) {
    const createRoundsFrequency = config.createRoundsFrequency || 800;
    const roundsSpeed = config.roundsSpeed || 1;
    this._rounds = [];
    this._createCat();
    this._score = document.querySelector('.rez');
    this._score.textContent = '0';
    document.body.appendChild(this._cat);
    this._createRoundTimerId = setInterval(() => this._createRound(), createRoundsFrequency);
    this._moveAndDeleteRoundsTimerId = setInterval(() => this._moveAndDeleteRounds(), roundsSpeed);
    this._changeScoreTimerId = setInterval(() => this._changeScore(), 100);
    this._onMoseMove = (event) => this._moveCat(event);
    document.body.addEventListener('mousemove', this._onMoseMove);

    this._tcheckTouchingTimerId = setInterval(() => {
      if (this._checkTouching()) {
        this.stop();
        this.onGameOver();
      }
    }, 100);
  }

  _createCat() {
    this._cat = document.createElement('div');
    this._cat.classList.add('cat');
    this._cat.innerHTML = '<img src="images/cat.png" alt="Cat">';
  }

  _createRound() {
    const newRound = document.createElement('div');
    newRound.classList.add('round');
    newRound.style.left = Math.floor(Math.random() * 100) + '%';
    const widthHeight = 50 + Math.floor(Math.random() * 50);
    newRound.style.width = widthHeight + 'px';
    newRound.style.height = widthHeight + 'px';
    const color = Math.floor(Math.random() * 11);
    if (color > 0 && color <= 2) {
      newRound.style.background = randomColors[0];
    }
    else if (color > 2 && color <= 4) {
      newRound.style.background = randomColors[1];
    }
    else if (color > 4 && color <= 6) {
      newRound.style.background = randomColors[2];
    }
    else if (color > 6 && color <= 8) {
      newRound.style.background = randomColors[3];
    }
    else if (color > 8 && color <= 10) {
      newRound.style.background = randomColors[4];
    }
    else {
      newRound.style.background = randomColors[5];
    }

    document.body.appendChild(newRound);
    this._rounds.push(newRound);
  }

  // передвигает круги и удаляет их, если они ниже окна
  _moveAndDeleteRounds() {
    this._rounds.forEach((round) => {
      round.style.top = 1 + round.getBoundingClientRect().top + 'px';
      if (round.getBoundingClientRect().top > window.innerHeight) {
        document.body.removeChild(round);
        this._rounds.splice(this._rounds.indexOf(round), 1);
      }
    });
  }

  _moveCat(event) {
    this._cat.style.left = event.clientX - 30 + 'px';
  }

  _changeScore() {
    this._score.textContent = +this._score.textContent + 1;
  }

  _checkTouching() {
    const catCoords = this._cat.getBoundingClientRect();
    const catPoints = [
      document.elementFromPoint(catCoords.left + 10, catCoords.top),
      document.elementFromPoint(catCoords.left + 50, catCoords.top),
      document.elementFromPoint(catCoords.left + 95, catCoords.top),
      document.elementFromPoint(catCoords.left + 10, catCoords.top + 20),
      document.elementFromPoint(catCoords.left, catCoords.top + 60),
      document.elementFromPoint(catCoords.left, catCoords.top + 105),
      document.elementFromPoint(catCoords.left + 8, catCoords.top + 125),
      document.elementFromPoint(catCoords.left + 92, catCoords.top + 34),
      document.elementFromPoint(catCoords.left + 100, catCoords.top + 70),
      document.elementFromPoint(catCoords.left + 120, catCoords.top + 90),
      document.elementFromPoint(catCoords.left + 120, catCoords.top + 110),
      document.elementFromPoint(catCoords.left + 6, catCoords.top + 30)
    ];

    return catPoints.filter((catPoint) => catPoint.classList.contains('round')).length > 0;
  }

  _removeRounds() {
    this._rounds.forEach((round) => document.body.removeChild(round));
    this._rounds = [];
  }

  getScore() {
    return this._score.textContent;
  }

  onGameOver() {}

  stop() {
    clearInterval(this._createRoundTimerId);
    clearInterval(this._moveAndDeleteRoundsTimerId);
    clearInterval(this._changeScoreTimerId);
    clearInterval(this._checkTouchingTimerId);
    clearInterval(this._tcheckTouchingTimerId);
    document.body.removeEventListener('mousemove', this._onMoseMove);
  }

  clearLocation() {
    document.body.removeChild(this._cat);
    this._removeRounds();
  }
}

const startModal = document.querySelector('.start-modal');
const resultModal = document.querySelector('.result-modal');
const resultWrapper = resultModal.querySelector('.result');
const bestResultWrapper = resultModal.querySelector('.best-result');
let game;

document.querySelector('.start-game-btn').addEventListener('click', () => {
  startModal.hidden = true;
  startNewGame();
});

document.querySelector('.play-again-btn').addEventListener('click', () => {
  resultModal.hidden = true;
  game.clearLocation();
  startNewGame();
});

function showResults(currentResult) {
  resultModal.hidden = false;
  resultWrapper.textContent = currentResult;
  const bestResult = localStorage.getItem('best-result');
  if (+bestResult < +currentResult) {
    localStorage.setItem('best-result', currentResult);
    bestResultWrapper.textContent = currentResult;
  } else if (bestResult > currentResult) {
    bestResultWrapper.textContent = bestResult;
  }
}

function startNewGame() {
  game = new Game({
    roundsSpeed: 0.1,
    createRoundsFrequency: 500
  });
  game.onGameOver = () => {
    showResults(game.getScore());
  };
}