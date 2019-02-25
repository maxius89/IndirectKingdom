import Globals from './global';
import Kingdom from './kingdom';
import Cell from './cell';
import Layout from './layout';
var g = new Globals;
export default g;

var layout = new Layout;

$(document).ready(function() {

  // Initializations
  setConsts();
  layout.initLayout();
  //initKingdoms();

  // Event Listeners

  //	$(".cell").click(clicked);
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
	/*for (var i = 0; i < g.listOfKingdoms.length; i++)
	{
		g.listOfKingdoms[i].init();
	}*/

  //setTimeout(test,500);
});


function initKingdoms() {
  let redKingdom = new Kingdom(g.kingdomNames[0], "red", ["r0c0", "r0c1", "r1c0", "r2c0"]);
  let blueKingdom = new Kingdom(g.kingdomNames[1], "blue", ["r4c2", "r3c2", "r4c3", "r3c3"]);
  let greenKingdom = new Kingdom(g.kingdomNames[2], "green", ["r9c7", "r9c6", "r9c5", "r8c6"]);
  let unclaimed = new Kingdom(g.kingdomNames[3], "#7777cc", []);
  unclaimed.updateCellsList();

  g.listOfKingdoms = [redKingdom, blueKingdom, greenKingdom, unclaimed];

  //updateMap();
}

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

  //g.m.cellTypeList = ["Farm", "Settlement", "Forest", "Mountain"]; // Cell types on the map
  //g.m.listOfCells = [];                // List of map cells for data storage

  g.LandType = {
    Farm: 0,
    Settlement: 1,
    Forest: 2,
    Mountain: 3,
  };
}
/*
function clicked() {
	for (var i = 0; i < listOfKingdoms.length; i++)
	{
		listOfKingdoms[i].highlighted = false;
	}

	if ( g.highlightedKindom === listOfKingdoms[g.kingdomNames.indexOf($(this).attr("status"))])
	{
		g.highlightedKindom = null;
	}
	else
	{
		listOfKingdoms[g.kingdomNames.indexOf($(this).attr("status"))].highlighted = true;
		g.highlightedKindom = listOfKingdoms[g.kingdomNames.indexOf($(this).attr("status"))];
	}

	setHighlightedCells();
	writeToInfoPanel();
}

function setHighlightedCells() {
	listOfKingdoms.forEach(function(kingdom,i) {
		$(".cell[status = '"+kingdom.name+"']").attr("highlighted",kingdom.highlighted);
	});

  var clickedCells = $(".cell[highlighted = false]");
	var nonClickedCells = $(".cell[highlighted = true]");

	var clickedBorderSize = Math.ceil(g.m.actualCellSize * g.m.borderRatio);
  var nonClickedBorderSize = Math.ceil(g.m.actualCellSize * g.m.borderRatio)*2;

	clickedCells.css("box-shadow", "inset " + clickedBorderSize +"px "  + clickedBorderSize +"px #ffffff," +
																 "inset -"+ clickedBorderSize +"px -" + clickedBorderSize +"px #ffffff");

	nonClickedCells.css("box-shadow", "inset " + nonClickedBorderSize +"px "  + nonClickedBorderSize +"px #dddd55," +
																		"inset -"+ nonClickedBorderSize +"px -" + nonClickedBorderSize +"px #dddd55");
}

function runGame() {
	if (g.started === false)
	{
		g.runner = setInterval(function() {
			nextRound();
		}, g.turnLength);
		g.started = true;
  }
	else
	{
		clearInterval(g.runner);
		g.started = false;
	}
}

function nextRound() {
	g.m.listOfCells.forEach(function(cell) {
		cell.tick();
	});

	Math.seedrandom();
	var numOfActiveKingdoms = listOfKingdoms.length - 1;

	for (var i = 0; i < numOfActiveKingdoms; i++)
	{
		var attackList = listOfKingdoms[i].findNeighbourCells();
		var target = Math.floor(Math.random() * attackList.length);

		listOfKingdoms[i].claimTerritory(attackList[target]);
		listOfKingdoms[i].calculateEconomy();
	}

	unclaimed.calculateEconomy();

	writeToInfoPanel();
	setHighlightedCells();

	updateMap();

console.log(g.showPopulation);
	if (g.showPopulation){  // TODO: Temporary solution
		g.m.listOfCells.forEach(function(cell) {
			$(".cell[id='"+cell.id+"']").html(Math.round(cell.population));
		});
	}
}
*/
function initCell(cell): void {
  //Math.seedrandom(g.randomSeed + $(cell).attr("id") );
  var typeIndex = Math.floor(Math.random() * g.m.cellTypeList.length);
  var type = g.m.cellTypeList[typeIndex];

  cell.attr("type", type);

  var unclaimedOwner = new Kingdom("unclaimed", "#7777cc", []);
  let newCell = new Cell($(cell).attr("id"), type, unclaimedOwner);
  g.m.listOfCells.push(newCell);

  var img = $(document.createElement("img"));
  cell.append(img);

  img.addClass("cellImg");
  //	img.css("height", g.m.actualCellSize/2 + "px");
  //	img.css("width", g.m.actualCellSize/2 + "px");
  //	img.css("top",  g.m.actualCellSize/8 + "px");
  //	img.css("left",  g.m.actualCellSize/8 + "px");

  switch (type) {
    case g.m.cellTypeList[g.LandType.Farm]:
      img.attr("src", "img/farm.svg");
      break;
    case g.m.cellTypeList[g.LandType.Settlement]:
      img.attr("src", "img/settlement.svg");
      break;
    case g.m.cellTypeList[g.LandType.Forest]:
      img.attr("src", "img/forest.svg");
      break;
    case g.m.cellTypeList[g.LandType.Mountain]:
      img.attr("src", "img/mountain.svg");
      break;
    default:
  }
}
/*
function writeToInfoPanel()
{
	var text1 = text2 = text3 = text4 = "&nbsp;";
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

function showPopulation()
{
	g.showPopulation = true;
}
*/
