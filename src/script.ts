import Globals from './global';
import World from './world';
import renderLayout from './layout';
export var g = new Globals;

document.addEventListener("DOMContentLoaded", function(): void {
  setConsts();
  new World({ cols: g.sceneCols, rows: g.sceneRows });
  renderLayout();

  //setTimeout(test,500);
});

function setConsts(): void {
  g.randomSeed = "0001";
  g.kingdomNames = ["unclaimed", "Red Kingdom", "Blue Kingdom", "Green Kingdom"];
  g.turnLength = 100;
  g.sceneRows = 25;
  g.sceneCols = 25;
  console.log(g);
};

export function runGame(): void {
  if (!g.started) {
    g.runner = setInterval(function() {
      nextRound();
    }, g.turnLength);
    g.started = true;
  }
  else {
    clearInterval(g.runner);
    g.started = false;
  }
};

function nextRound(): void {
  World.nextRound();
  renderLayout();
};

export function showPopulation(): void {
  g.showPopulation = true;
};
