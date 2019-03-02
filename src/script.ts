import Globals from './global';
import World from './world';
import Layout from './layout';
import * as seedrandom from 'seedrandom';
export var g = new Globals;

var layout = new Layout;

$(document).ready(function() {

  // Initializations
  setConsts();
  new World([g.sceneCols, g.sceneRows]);
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

function setConsts() {

  // System variables
  g.started = false;
  g.runner = null;
  g.highlightedKindom = null;
  g.showPopulation = false;
  g.resizeTimeout = null;

  g.randomSeed = "0001";               // Seed for random number generation

  g.kingdomNames = ["Red Kingdom", "Blue Kingdom", "Green Kingdom", "unclaimed"];  // Name of the kingdoms

  g.turnLength = 100;				// ms			 // Length of a turn

  g.sceneRows = 25;                    // Number of the rows of the Map
  g.sceneCols = 25;                    // Number of the coloumns of the Map
  console.log(g);
}

export function runGame() {
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

function nextRound() {
  var rng = seedrandom();
  World.listOfCells.forEach(function(cell) {
    cell.tick();
  });

  var numOfActiveKingdoms = World.listOfKingdoms.length - 1;

  for (var i = 0; i < numOfActiveKingdoms; i++) {
    var attackList = World.listOfKingdoms[i].findNeighbourCells();
    var target = Math.floor(rng() * attackList.length);

    World.listOfKingdoms[i].claimTerritory(attackList[target]);
    World.listOfKingdoms[i].calculateEconomy();
  }

  World.listOfKingdoms[numOfActiveKingdoms].calculateEconomy();

  Layout.writeToInfoPanel();
  Layout.setHighlightedCells();

  layout.updateMap(World.listOfCells);

  if (g.showPopulation) {  // TODO: Temporary solution
    World.listOfCells.forEach(function(cell) {
      $(".cell[id='" + cell.id + "']").html(String(Math.round(cell.population)));
    });
  }
}

export function showPopulation() {
  g.showPopulation = true;
}
