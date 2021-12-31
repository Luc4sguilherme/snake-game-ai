import Game from "./game.js";

const { methods } = carrot;

export default class Runner {
  constructor({ neat, games, gameSize, gameUnit, frameRate, maxTurns, lowestScoreAllowed, score, onEndGeneration }) {
    this.neat = neat;
    this.games = [];
    this.gamesFinished = 0;
    this.onEndGeneration = onEndGeneration;

    for (let i = 0; i < games; i++) {
      this.games.push(
        new Game({
          size: gameSize,
          unit: gameUnit,
          frameRate,
          maxTurns,
          lowestScoreAllowed,
          score,
          index: i,
          onGameOver: () => this.endGeneration(),
        })
      );
    }
  }

  startGeneration() {
    this.gamesFinished = 0;

    for (let i = 0; i < this.games.length; i++) {
      this.games[i].snake.brain = this.neat.population[i];
      this.games[i].snake.brain.score = 0;
      this.games[i].start();
    }
  }

  stopGeneration() {
    const workspace = document.querySelector("#workspace");
    this.paused = true;
    workspace.innerHTML = "";
  }

  endGeneration() {
    if (this.paused) {
      return;
    }

    if (this.gamesFinished + 1 < this.games.length) {
      this.gamesFinished++;
      return;
    }
    this.neat.sort();

    this.onEndGeneration({
      generation: this.neat.generation,
      max: this.neat.getFittest().score,
      avg: Math.round(this.neat.getAverage()),
      min: this.neat.population[this.neat.population_size - 1].score,
    });

    const newGeneration = [];
    for (let i = 0; i < this.neat.elitism; i++) {
      newGeneration.push(this.neat.population[i]);
    }

    for (let i = 0; i < this.neat.population_size - this.neat.elitism; i++) {
      newGeneration.push(this.neat.getOffspring());
    }

    this.neat.population = newGeneration;

    // this.neat.mutate()

    this.neat.population = this.neat.population.map(function (genome) {
      const current = methods.mutation.FFW[Math.floor(Math.random() * methods.mutation.FFW.length)];

      genome.mutate(current);

      return genome;
    });

    this.neat.generation++;
    this.startGeneration();
  }
}
