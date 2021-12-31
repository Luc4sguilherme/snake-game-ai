import constants from "./constants.js";

export default class Snake {
  constructor(size, score) {
    this.x = 5;
    this.y = 5;
    this.size = size;
    this.tail = this.makeTail(constants().SNAKE_LENGTH);
    this.direction = "right";
    this.color = "black";
    this.scoreModifiers = score;
  }

  makeTail(number) {
    return Array(number)
      .fill()
      .map((_, index) => ({ x: this.x, y: this.y + index }));
  }

  respawn() {
    this.tail = this.makeTail(constants().SNAKE_LENGTH);
    this.direction = "right";
  }

  move() {
    const headTail = this.getHeadTail();
    let newRect;

    if (this.direction == "right") {
      newRect = {
        x: headTail.x + 1,
        y: headTail.y,
      };
    } else if (this.direction == "left") {
      newRect = {
        x: headTail.x - 1,
        y: headTail.y,
      };
    } else if (this.direction == "down") {
      newRect = {
        x: headTail.x,
        y: headTail.y + 1,
      };
    } else if (this.direction == "up") {
      newRect = {
        x: headTail.x,
        y: headTail.y - 1,
      };
    }

    this.tail.shift();
    this.tail.push(newRect);
  }

  automove(game) {
    let canMoveForward = 0;
    let canMoveLeft = 0;
    let canMoveRight = 0;
    let isFoodForward = 0;
    let isFoodLeft = 0;
    let isFoodRight = 0;

    let head = this.getHeadTail();

    switch (this.direction) {
      case "up":
        if (head.y !== 1) canMoveForward = 1;
        if (head.x !== 1) canMoveLeft = 1;
        if (head.x !== game.unitsPerRow) canMoveRight = 1;
        if (game.apple.position.y < head.y) isFoodForward = 1;
        if (game.apple.position.x < head.x) isFoodLeft = 1;
        if (game.apple.position.x > head.x) isFoodRight = 1;

        break;
      case "down":
        if (head.y !== game.unitsPerRow) canMoveForward = 1;
        if (head.x !== game.unitsPerRow) canMoveLeft = 1;
        if (head.x !== 1) canMoveRight = 1;
        if (game.apple.position.y > head.y) isFoodForward = 1;
        if (game.apple.position.x < head.x) isFoodRight = 1;
        if (game.apple.position.x > head.x) isFoodLeft = 1;

        break;
      case "left":
        if (head.x !== 1) canMoveForward = 1;
        if (head.y !== game.unitsPerRow) canMoveLeft = 1;
        if (head.y !== 1) canMoveRight = 1;
        if (game.apple.position.x < head.x) isFoodForward = 1;
        if (game.apple.position.y < head.y) isFoodRight = 1;
        if (game.apple.position.y > head.y) isFoodLeft = 1;

        break;
      case "right":
        if (head.x !== game.unitsPerRow) canMoveForward = 1;
        if (head.y !== 1) canMoveLeft = 1;
        if (head.y !== game.unitsPerRow) canMoveRight = 1;
        if (game.apple.position.x > head.x) isFoodForward = 1;
        if (game.apple.position.y < head.y) isFoodLeft = 1;
        if (game.apple.position.y > head.y) isFoodRight = 1;

        break;
    }

    const input = [canMoveForward, canMoveLeft, canMoveRight, isFoodForward, isFoodLeft, isFoodRight];
    const output = this.brain.activate(input).map((o) => Math.round(o));

    if (output[0]) {
      this.brain.score += isFoodLeft ? this.scoreModifiers.movedTowardsFood : this.scoreModifiers.movedAgainstFood;

      switch (this.direction) {
        case "up":
          this.direction = "left";
          break;
        case "down":
          this.direction = "right";
          break;
        case "left":
          this.direction = "down";
          break;
        case "right":
          this.direction = "up";
          break;
      }
    } else if (output[1]) {
      this.brain.score += isFoodRight ? this.scoreModifiers.movedTowardsFood : this.scoreModifiers.movedAgainstFood;

      switch (this.direction) {
        case "up":
          this.direction = "right";
          break;
        case "down":
          this.direction = "left";
          break;
        case "left":
          this.direction = "up";
          break;
        case "right":
          this.direction = "down";
          break;
      }
    } else {
      this.brain.score += isFoodForward ? this.scoreModifiers.movedTowardsFood : this.scoreModifiers.movedAgainstFood;
    }

    // move the snake
    this.move();
  }

  grow(el) {
    this.tail.push(el);
  }

  getHeadTail() {
    return this.tail[this.tail.length - 1];
  }

  checkHitWithApple(apple) {
    const headTail = this.getHeadTail();

    if (headTail.x == apple.position.x && headTail.y == apple.position.y) {
      return true;
    }
  }

  checkHitWithWall(unitsPerRow) {
    const headTail = this.getHeadTail();

    if (headTail.x == 0) {
      return true;
    } else if (headTail.x == unitsPerRow) {
      return true;
    } else if (headTail.y == 0) {
      return true;
    } else if (headTail.y == unitsPerRow) {
      return true;
    } else {
      return false;
    }
  }

  checkHitWithTail() {
    const headTail = this.getHeadTail();

    for (let i = 0; i < this.tail.length - 2; i++) {
      if (headTail.x === this.tail[i].x && headTail.y === this.tail[i].y) {
        return true;
      }
    }

    return false;
  }

  eatApple(apple) {
    let { GROW_WHEN_EATING } = constants();

    if (this.checkHitWithApple(apple)) {
      if (GROW_WHEN_EATING) {
        this.grow({ x: apple.position.x, y: apple.position.y });
      }

      this.brain.score += this.scoreModifiers.ateFood;
      apple.respawn();
    }
  }
}
