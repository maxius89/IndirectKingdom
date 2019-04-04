import Globals from './global';
import World from './world';
import Layout from './layout';
export var g = new Globals;

$(document).ready(function() {

  // Initializations
  setConsts();
  new World({ cols: g.sceneCols, rows: g.sceneRows });
  Layout.initLayout();

  // Event Listeners
  $(window).resize(function() {
    if (g.resizeTimeout != 0) clearTimeout(g.resizeTimeout);
    g.resizeTimeout = setTimeout(function() {
      Layout.rethinkPanels();
      g.resizeTimeout = 0;
    }, 200);
  });

  $(".cell").click(Layout.clicked);
  $("#mapDiv")[0].addEventListener("wheel", Layout.zoom.bind(Layout));

  //setTimeout(test,500);
});

function setConsts(): boolean {

  // System variables
  g.highlightedKindom = null;
  g.resizeTimeout = 0;
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
  if (g.started === false) {
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

  Layout.writeToInfoPanel();
  Layout.setHighlightedCells();

  Layout.updateMap();

  if (g.showPopulation) {  // TODO: Temporary solution
    World.listOfCells.forEach(cell =>
      $(".cell[id='" + cell.id + "']").html(String(Math.round(cell.population)))
    );
  }
}

export function showPopulation(): void {
  g.showPopulation = true;
}
