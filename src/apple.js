function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export default class Apple {
  constructor(size, unitsPerRow) {
    this.size = size;
    this.unitsPerRow = unitsPerRow;
    this.position = this.spawn();
  }

  spawn() {
    return {
      x: getRandomInt(1, this.unitsPerRow),
      y: getRandomInt(1, this.unitsPerRow),
    };
  }

  respawn() {
    this.position = this.spawn();
  }
}
