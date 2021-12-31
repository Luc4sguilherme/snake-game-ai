export default () => {
  const GAMES = Number(document.getElementById("population-size").value);
  const elitism_percent = Number(document.getElementById("elitism-percent").value) / 100;
  const POINTS_ATE_FOOD = Number(document.getElementById("food-score").value);
  const POINTS_MOVED_TOWARDS_FOOD = Number(document.getElementById("moveTowards-score").value);
  const POINTS_MOVED_AGAINST_FOOD = Number(document.getElementById("moveAway-score").value);
  const SNAKE_LENGTH = Number(document.getElementById("initial-snake-length").value);
  const BORDER_WALLS = document.getElementById("border-walls").className.includes("fa-toggle-on") ? true : false;
  const CAN_EAT_SELF = document.getElementById("can-eat-self").className.includes("fa-toggle-on") ? true : false;
  const GROW_WHEN_EATING = document.getElementById("grow-when-eating").className.includes("fa-toggle-on") ? true : false;

  const GAME_UNIT = 5;
  const GAME_SIZE = 100;
  const FRAME_RATE = 30;
  const MAX_TURNS = 5000;
  const LOWEST_SCORE_ALLOWED = -20;
  const elitism = Math.round(elitism_percent * GAMES);
  const mutation_rate = 0.5;
  const mutation_amount = 3;

  return {
    GAMES,
    elitism_percent,
    POINTS_ATE_FOOD,
    POINTS_MOVED_TOWARDS_FOOD,
    POINTS_MOVED_AGAINST_FOOD,
    GAME_UNIT,
    GAME_SIZE,
    SNAKE_LENGTH,
    BORDER_WALLS,
    CAN_EAT_SELF,
    GROW_WHEN_EATING,
    FRAME_RATE,
    MAX_TURNS,
    LOWEST_SCORE_ALLOWED,
    elitism,
    mutation_rate,
    mutation_amount,
  };
};
