import Globals from './global';
import World from './world';
import Layout from './layout';
export var g = new Globals;

$(document).ready(function() {
  setConsts();
  new World({ cols: g.sceneCols, rows: g.sceneRows });
  Layout.renderLayout();

  //setTimeout(test,500);
});

function setConsts(): boolean {

  // System variables
  g.runner = 0;
  g.showPopulation = false;
  g.started = false;

  g.randomSeed = "0001";

  g.kingdomNames = ["unclaimed", "Red Kingdom", "Blue Kingdom", "Green Kingdom"];

  g.turnLength = 100;

  g.sceneRows = 25;
  g.sceneCols = 25;
  console.log(g);

  return true;
}

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
}

function nextRound(): void {
  World.nextRound();
  Layout.renderLayout();
}

export function showPopulation(): void {
  g.showPopulation = true;
}
