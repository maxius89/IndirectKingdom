import Globals from './global';
import World from './world';
import Layout from './layout';
import * as seedrandom from 'seedrandom';
export var g = new Globals;

var layout = new Layout;

$(document).ready(function() {

  // Initializations
  setConsts();
  new World({ cols: g.sceneCols, rows: g.sceneRows });
  layout.initLayout();

  // Event Listeners
  $(window).resize(function() {
    if (g.resizeTimeout != null) clearTimeout(g.resizeTimeout);
    g.resizeTimeout = setTimeout(function() {
      layout.rethinkPanels();
      g.resizeTimeout = null;
    }, 200);
  });

  $(".cell").click(layout.clicked);
  $("#mapDiv")[0].addEventListener("wheel", layout.zoom.bind(layout));

  //setTimeout(test,500);
});

function setConsts(): void {

  // System variables
  g.highlightedKindom = null;
  g.resizeTimeout = null;
  g.runner = null;
  g.showPopulation = false;
  g.started = false;

  g.randomSeed = "0001";

  g.kingdomNames = ["unclaimed", "Red Kingdom", "Blue Kingdom", "Green Kingdom"];

  g.turnLength = 100;

  g.sceneRows = 25;
  g.sceneCols = 25;
  console.log(g);
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
  var rng = seedrandom();
  World.listOfCells.forEach(function(cell) { cell.tick(); });

  for (var i = 1; i < World.listOfKingdoms.length; i++) {
    var attackList = World.listOfKingdoms[i].findNeighbourCells();
    var target = Math.floor(rng() * attackList.length);

    World.listOfKingdoms[i].claimTerritory(attackList[target]);
    World.listOfKingdoms[i].calculateEconomy();
  }

  World.listOfKingdoms[0].calculateEconomy();

  Layout.writeToInfoPanel();
  Layout.setHighlightedCells();

  layout.updateMap(World.listOfCells);

  if (g.showPopulation) {  // TODO: Temporary solution
    World.listOfCells.forEach(function(cell) {
      $(".cell[id='" + cell.id + "']").html(String(Math.round(cell.population)));
    });
  }
}

export function showPopulation(): void {
  g.showPopulation = true;
}
