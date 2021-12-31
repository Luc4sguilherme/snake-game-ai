import Apple from "./apple.js";
import constants from "./constants.js";
import Snake from "./snake.js";

export default class Game {
  constructor({ size, unit, frameRate, maxTurns, lowestScoreAllowed, score, index, onGameOver }) {
    this.size = size;
    this.unit = unit;
    this.unitsPerRow = this.size / this.unit;
    this.frameRate = frameRate;
    this.maxTurns = maxTurns;
    this.lowestScoreAllowed = lowestScoreAllowed;
    this.onGameOver = onGameOver;
    this.status = "IDLE";
    this.grid = [];
    this.turns = 0;
    this.snake = new Snake(unit, score);
    this.apple = new Apple(unit, this.unitsPerRow);
    this.createCanvas();

    this.canvas = document.getElementById(`defaultCanvas${index}`);
  }

  start() {
    this.turns = 0;
    this.apple.respawn();
    this.snake.respawn();
    this.status = "RUNNING";
  }

  createCanvas() {
    const game = this;

    new p5((p) => {
      p.setup = () => {
        p.frameRate(game.frameRate);
        p.createCanvas(game.size, game.size);
      };

      p.draw = () => {
        if (game.status === "IDLE") {
          return;
        }

        if (["GAME_OVER"].indexOf(game.status) !== -1) {
          p.background("#EEE");
          p.fill(0);
          p.textSize(15);
          p.text(game.snake.brain.score.toString(), 5, 20);
          return;
        }

        p.background(255);

        game.snake.automove(game);
        game.snake.eatApple(game.apple);
        game.updateGameStatus();

        if (game.status === "GAME_OVER") {
          return game.onGameOver();
        }

        game.draw(p);

        game.turns++;
      };
    }, "workspace");
  }

  updateGameStatus() {
    const gameLastedLongEnough = this.turns > this.maxTurns;
    const scoreTooLow = this.snake.brain.score <= this.lowestScoreAllowed;

    if (this.checkHit() || gameLastedLongEnough || scoreTooLow) {
      this.status = "GAME_OVER";
    }
  }

  checkHit() {
    let { BORDER_WALLS, CAN_EAT_SELF } = constants();

    if (
      (this.snake.checkHitWithTail() && CAN_EAT_SELF) ||
      (this.snake.checkHitWithWall(this.unitsPerRow) && BORDER_WALLS)
    ) {
      return true;
    } else {
      return false;
    }
  }

  drawApple(canvas) {
    const game = this;

    canvas.fill("red");
    canvas.rect(
      game.apple.position.x * game.unit - game.unit,
      game.apple.position.y * game.unit - game.unit,
      game.unit,
      game.unit
    );
  }

  drawSnake(canvas) {
    const game = this;

    canvas.fill("black");
    for (let i = 0; i < this.snake.tail.length; i++) {
      canvas.rect(
        this.snake.tail[i].x * game.unit - game.unit,
        this.snake.tail[i].y * game.unit - game.unit,
        game.unit,
        game.unit
      );
    }
  }

  draw(canvas) {
    this.drawSnake(canvas);
    this.drawApple(canvas);
  }
}
