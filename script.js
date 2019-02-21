$( document ).ready(function() {

// Initializations
	setConsts();
	initLayout();
	initKingdoms();

	started = 0;
	runner = null;
	alreadyHighlighted = 0;
	highlightedKindom = null;
	showPopulation = false;

// Event Listeners
	$(".cell").click(clicked);
	$(".cell").attr("highlighted",0);

	resizeTimeout = null;
	$( window ).resize(function() {
		if (resizeTimeout != null) clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout( function() {
			rethinkPanels();
			resizeTimeout = null;
		}, 200);
	});

	document.getElementById("mapDiv").addEventListener("wheel", zoom);

// Initialize kingdoms on map
	for (var i = 0; i < listOfKingdoms.length; i++)
	{
		listOfKingdoms[i].init();
	}

	//setTimeout(test,500);
});


function initKingdoms() {
  redKingdom   = new Kingdom(g.kingdomNames[0],"red",     ["r0c0", "r0c1", "r1c0", "r2c0"]);
  blueKingdom  = new Kingdom(g.kingdomNames[1],"blue",    ["r4c2", "r3c2", "r4c3", "r3c3"]);
  greenKingdom = new Kingdom(g.kingdomNames[2],"green",   ["r9c7", "r9c6", "r9c5", "r8c6"]);
  unclaimed    = new Kingdom(g.kingdomNames[3],"#7777cc", []);
	unclaimed.updateCellsList();

  listOfKingdoms = [redKingdom, blueKingdom, greenKingdom, unclaimed];

	updateMap();
}

function setConsts() {
	g = {};                              // Global variables
	g.w = {};                            // Window variables
	g.d = {};                            // Dashboard variables
	g.m = {};                            // Map variables

	g.randomSeed = "0001";               // Seed for random number generation

	g.kingdomNames = ["Red Kingdom", "Blue Kingdom", "Green Kingdom","unclaimed"];  // Name of the kingdoms

	g.turnLength = 100;				// ms			 // Length of a turn

	g.sceneRows = 25;                    // Number of the rows of the Map
	g.sceneCols = 25;                    // Number of the coloumns of the Map

	g.m.actualCellSize = 40; 	// px      // Actual size of the drawn cells
	g.m.borderRatio = 0.02;              // Cell-size/border thickness ratio
	g.m.minCellSize = 20; 		// px      // Minimum size of the drawn cells
	g.m.maxCellSize = 100; 		// px      // Maximum size of the drawn cells
	g.m.stepCellSize = 5; 		// px      // Cell-size increment/decrement constant
	g.m.minDrawnCells = 3;               // Minimum number of drawn cells
	g.m.cellTypeList = ["Farm", "Settlement", "Forest", "Mountain"]; // Cell types on the map
	g.m.listOfCells = [];                // List of map cells for data storage

	g.d.thicknessRatio = 0.2;
	g.d.minThickness = 200;   // px      // Dashboard thickness minimum
	g.d.maxThickness = 400;   // px      // Dashboard thickness maximum
	g.d.minDashboardThickessRatio = 2;   // Dashboard thickness/window shorter size minimum ratio

	g.LandType = {
	  Farm : 0,
		Settlement : 1,
		Forest : 2,
		Mountain: 3,
 };
}

function clicked() {
	for (var i = 0; i < listOfKingdoms.length; i++)
	{
		listOfKingdoms[i].highlighted = 0;
	}

	if ( highlightedKindom === listOfKingdoms[g.kingdomNames.indexOf($(this).attr("status"))])
	{
		highlightedKindom = null;
	}
	else
	{
		listOfKingdoms[g.kingdomNames.indexOf($(this).attr("status"))].highlighted = 1;
		highlightedKindom = listOfKingdoms[g.kingdomNames.indexOf($(this).attr("status"))];
	}

	setHighlightedCells();
	writeToInfoPanel();
}

function setHighlightedCells() {
	listOfKingdoms.forEach(function(kingdom,i) {
		$(".cell[status = '"+kingdom.name+"']").attr("highlighted",kingdom.highlighted);
	});

  var clickedCells = $(".cell[highlighted = '0']");
	var nonClickedCells = $(".cell[highlighted = '1']");

	var clickedBorderSize = Math.ceil(g.m.actualCellSize * g.m.borderRatio);
  var nonClickedBorderSize = Math.ceil(g.m.actualCellSize * g.m.borderRatio)*2;

	clickedCells.css("box-shadow", "inset " + clickedBorderSize +"px "  + clickedBorderSize +"px #ffffff," +
																 "inset -"+ clickedBorderSize +"px -" + clickedBorderSize +"px #ffffff");

	nonClickedCells.css("box-shadow", "inset " + nonClickedBorderSize +"px "  + nonClickedBorderSize +"px #dddd55," +
																		"inset -"+ nonClickedBorderSize +"px -" + nonClickedBorderSize +"px #dddd55");
}

function runGame() {
	if (started === 0)
	{
		runner = setInterval(function() {
			nextRound();
		}, g.turnLength);
		started = 1;
  }
	else
	{
		clearInterval(runner);
		started = 0;
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

console.log(showPopulation);
	if (showPopulation){  // TODO: Temporary solution
		g.m.listOfCells.forEach(function(cell) {
			$(".cell[id='"+cell.id+"']").html(Math.round(cell.population));
		});
	}
}

function initCell(cell) {
	Math.seedrandom(g.randomSeed + $(cell).attr("id") );
	var typeIndex =  Math.floor(Math.random() * g.m.cellTypeList.length);
	var type = g.m.cellTypeList[typeIndex];

	cell.attr("type", type);

	var unclaimedOwner = new Kingdom("unclaimed","#7777cc", []);
	newCell = new Cell($(cell).attr("id"),type, unclaimedOwner);
	g.m.listOfCells.push(newCell);

	var img = $(document.createElement("img"));
	cell.append(img);

	img.addClass("cellImg");
	img.css("height", g.m.actualCellSize/2 + "px");
	img.css("width", g.m.actualCellSize/2 + "px");
	img.css("top",  g.m.actualCellSize/8 + "px");
	img.css("left",  g.m.actualCellSize/8 + "px");

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

function writeToInfoPanel()
{
	var text1 = text2 = text3 = text4 = "&nbsp;";
	if (highlightedKindom != null) {
	text1 = highlightedKindom.name + " wealth: " + highlightedKindom.econ.wealth;
	text2 = highlightedKindom.name + " industry: " + highlightedKindom.econ.industry;
	text3 = highlightedKindom.name + " agriculture: " + highlightedKindom.econ.agriculture;
	text4 = highlightedKindom.name + " population: " + highlightedKindom.econ.population;
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
	showPopulation = true;
}
