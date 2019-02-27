import Globals from './global';
import Kingdom from './kingdom';
import Layout from './layout';
export var g = new Globals;

var layout = new Layout;

$(document).ready(function() {

  // Initializations
  setConsts();
  g.listOfCells = layout.initLayout();
  initKingdoms();

  // Event Listeners
  $(".cell").click(clicked);
  $(".cell").attr("highlighted", "false");

  $(window).resize(function() {
    if (g.resizeTimeout != null) clearTimeout(g.resizeTimeout);
    g.resizeTimeout = setTimeout(function() {
      layout.rethinkPanels();
      g.resizeTimeout = null;
    }, 200);
  });

  $("#mapDiv")[0].addEventListener("wheel", layout.zoom.bind(layout));

  // Initialize kingdoms on map
  for (var i = 0; i < g.listOfKingdoms.length; i++) {
    g.listOfKingdoms[i].init();
  }

  //setTimeout(test,500);
});


function initKingdoms() {
  let redKingdom = new Kingdom(g.kingdomNames[0], "red", ["r0c0", "r0c1", "r1c0", "r2c0"]);
  let blueKingdom = new Kingdom(g.kingdomNames[1], "blue", ["r4c2", "r3c2", "r4c3", "r3c3"]);
  let greenKingdom = new Kingdom(g.kingdomNames[2], "green", ["r9c7", "r9c6", "r9c5", "r8c6"]);
  let unclaimed = new Kingdom(g.kingdomNames[3], "#7777cc", []);
  unclaimed.updateCellsList();

  g.listOfKingdoms = [redKingdom, blueKingdom, greenKingdom, unclaimed];

  layout.updateMap(g.listOfCells);
}

function setConsts() {

  // System variables
  g.started = false;
  g.runner = null;
  g.highlightedKindom = null;
  g.showPopulation = false;
  g.resizeTimeout = null;

  g.randomSeed = "Indirect";               // Seed for random number generation

  g.kingdomNames = ["Red Kingdom", "Blue Kingdom", "Green Kingdom", "unclaimed"];  // Name of the kingdoms

  g.turnLength = 100;				// ms			 // Length of a turn

  g.sceneRows = 25;                    // Number of the rows of the Map
  g.sceneCols = 25;                    // Number of the coloumns of the Map
  console.log(g);
}

function clicked() {
  for (var i = 0; i < g.listOfKingdoms.length; i++) {
    g.listOfKingdoms[i].highlighted = false;
  }

  if (g.highlightedKindom === g.listOfKingdoms[g.kingdomNames.indexOf($(this).attr("status"))]) {
    g.highlightedKindom = null;
  }
  else {
    g.listOfKingdoms[g.kingdomNames.indexOf($(this).attr("status"))].highlighted = true;
    g.highlightedKindom = g.listOfKingdoms[g.kingdomNames.indexOf($(this).attr("status"))];
  }

  setHighlightedCells();
  writeToInfoPanel();
}

function setHighlightedCells() {
  g.listOfKingdoms.forEach(function(kingdom) {
    $(".cell[status = '" + kingdom.name + "']").attr("highlighted", String(kingdom.highlighted));
    console.log(String(kingdom.highlighted));
  });

  var clickedCells = $(".cell[highlighted = false]");
  var nonClickedCells = $(".cell[highlighted = true]");

  var clickedBorderSize = Math.ceil(layout.mActualCellSize * layout.borderRatio);
  var nonClickedBorderSize = Math.ceil(layout.mActualCellSize * layout.borderRatio) * 2;

  clickedCells.css("box-shadow", "inset " + clickedBorderSize + "px " + clickedBorderSize + "px #ffffff," +
    "inset -" + clickedBorderSize + "px -" + clickedBorderSize + "px #ffffff");

  nonClickedCells.css("box-shadow", "inset " + nonClickedBorderSize + "px " + nonClickedBorderSize + "px #dddd55," +
    "inset -" + nonClickedBorderSize + "px -" + nonClickedBorderSize + "px #dddd55");
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
  g.listOfCells.forEach(function(cell) {
    cell.tick();
  });

  var numOfActiveKingdoms = g.listOfKingdoms.length - 1;

  for (var i = 0; i < numOfActiveKingdoms; i++) {
    var attackList = g.listOfKingdoms[i].findNeighbourCells();
    var target = Math.floor(Math.random() * attackList.length);

    g.listOfKingdoms[i].claimTerritory(attackList[target]);
    g.listOfKingdoms[i].calculateEconomy();
  }

  g.listOfKingdoms[numOfActiveKingdoms].calculateEconomy();

  writeToInfoPanel();
  setHighlightedCells();

  layout.updateMap(g.listOfCells);

  console.log(g.showPopulation);
  if (g.showPopulation) {  // TODO: Temporary solution
    g.listOfCells.forEach(function(cell) {
      $(".cell[id='" + cell.id + "']").html(String(Math.round(cell.population)));
    });
  }
}

function writeToInfoPanel() {
  var text1 = "&nbsp;";
  var text2 = "&nbsp;";
  var text3 = "&nbsp;";
  var text4 = "&nbsp;";
  if (g.highlightedKindom != null) {
    text1 = g.highlightedKindom.name + " wealth: " + g.highlightedKindom.econ.wealth;
    text2 = g.highlightedKindom.name + " industry: " + g.highlightedKindom.econ.industry;
    text3 = g.highlightedKindom.name + " agriculture: " + g.highlightedKindom.econ.agriculture;
    text4 = g.highlightedKindom.name + " population: " + g.highlightedKindom.econ.population;
  }
  else {
    text1 = text2 = text3 = text4 = "&nbsp;"
  }

  $("#infoWealth").html(text1);
  $("#infoIndustry").html(text2);
  $("#infoAgriculture").html(text3);
  $("#infoPopulation").html(text4);
}

export function showPopulation() {
  g.showPopulation = true;
}
