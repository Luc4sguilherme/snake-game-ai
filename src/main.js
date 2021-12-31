import constants from "./constants.js";
import Runner from "./runner.js";

let runner;
let chartData;
let chart;

function drawGraph() {
  chartData = {
    labels: [],
    datasets: [
      {
        name: "Max",
        values: [],
      },
      {
        name: "Average",
        values: [],
      },
      {
        name: "Min",
        values: [],
      },
    ],
  };

  chart = new Chart("#chart", {
    title: "Generation score history",
    type: "line",
    height: 180,
    data: chartData,
  });
}

drawGraph();

function initialize() {
  const { Neat } = carrot;
  let {
    elitism,
    FRAME_RATE,
    GAMES,
    GAME_SIZE,
    GAME_UNIT,
    LOWEST_SCORE_ALLOWED,
    MAX_TURNS,
    mutation_amount,
    mutation_rate,
    POINTS_ATE_FOOD,
    POINTS_MOVED_AGAINST_FOOD,
    POINTS_MOVED_TOWARDS_FOOD,
  } = constants();

  const neat = new Neat(6, 2, {
    population_size: GAMES,
    elitism: elitism,
    mutation_rate: mutation_rate,
    mutation_amount: mutation_amount,
    // fitness:null,
    equal: false,
  });

  drawGraph();

  let highestScore = 0;

  runner = new Runner({
    neat,
    games: GAMES,
    gameSize: GAME_SIZE,
    gameUnit: GAME_UNIT,
    frameRate: FRAME_RATE,
    maxTurns: MAX_TURNS,
    lowestScoreAllowed: LOWEST_SCORE_ALLOWED,
    score: {
      movedTowardsFood: POINTS_MOVED_TOWARDS_FOOD,
      movedAgainstFood: POINTS_MOVED_AGAINST_FOOD,
      ateFood: POINTS_ATE_FOOD,
    },
    onEndGeneration: ({ generation, max, avg, min }) => {
      chartData.labels.push(generation.toString());
      chartData.datasets[0].values.push(max);
      chartData.datasets[1].values.push(avg);
      chartData.datasets[2].values.push(min);

      if (chartData.labels.length > 15) {
        chartData.labels.shift();
        chartData.datasets.forEach((d) => d.values.shift());
      }

      chart.update(chartData);
      if (max > highestScore) {
        highestScore = max;
      }

      document.getElementById("generation").innerHTML = generation;
      document.getElementById("highest-score").innerHTML = highestScore;
    },
  });
}

const btn = document.querySelector(".btn");

btn.addEventListener("click", (event) => {
  if (btn.className.includes("btn-success")) {
    btn.className = "btn btn-danger";
    btn.innerHTML = "Stop Evolution";
    initialize();
    runner.startGeneration();
  } else if (btn.className.includes("btn-danger")) {
    btn.className = "btn btn-success";
    btn.innerHTML = "Start Evolution";
    runner.stopGeneration();
  }
});

const switchLabels = document.querySelectorAll(".switch");

switchLabels.forEach((label) => {
  label.addEventListener("click", (event) => {
    const toggle = label.querySelector(".fa");

    if (label.className.includes("active")) {
      label.className = "switch";
      toggle.className = "fa fa-toggle-off fa-fw";
    } else {
      label.className = "switch active";
      toggle.className = "fa fa-toggle-on fa-fw";
    }
  });
});
