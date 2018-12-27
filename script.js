$( document ).ready(function() {

// Initializations
	setConsts();
	initLayout();
	initKingdoms();

	started = 0;
	runner = null;
	alreadyHighlighted = 0;
	highlightedKindom = null;

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

  listOfKingdoms = [redKingdom, blueKingdom, greenKingdom, unclaimed];
}

function setConsts() {
	g = {};                              // Global variables
	g.w = {};                            // Window variables
	g.d = {};                            // Dashboard variables
	g.m = {};                            // Map variables

	g.randomSeed = "0001";               // Seed for random number generation

	g.kingdomNames = ["Red Kingdom", "Blue Kingdom", "Green Kingdom","unclaimed"];  // Name of the kingdoms

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

}

function clicked() {
	if (alreadyHighlighted == 0) {
		listOfKingdoms[g.kingdomNames.indexOf($(this).attr("status"))].highlighted = 1;

		alreadyHighlighted = 1;
		highlightedKindom = listOfKingdoms[g.kingdomNames.indexOf($(this).attr("status"))];
	}
	else if (listOfKingdoms[g.kingdomNames.indexOf($(this).attr("status"))] == highlightedKindom) {
		listOfKingdoms[g.kingdomNames.indexOf($(this).attr("status"))].highlighted = 0;

		alreadyHighlighted = 0;
		highlightedKindom = null;
	}

	setHighlightedCells();
}

function setHighlightedCells() {
	for (var i = 0; i < listOfKingdoms.length; i++)
	{
		$(".cell[status = '"+g.kingdomNames[i]+"']").attr("highlighted",listOfKingdoms[i].highlighted);
	}

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
	if (started == 0)
	{
		runner = setInterval(function() {
			nextRound();
		}, 100);
		started = 1;
  }
	else
	{
		clearInterval(runner);
		started = 0;
	}
}

function nextRound() {
	Math.seedrandom();

	for (var i = 0; i < listOfKingdoms.length-1; i++)
	{
		var attackList = listOfKingdoms[i].findNeighbourCells();
		var target = Math.floor(Math.random() * attackList.length);

		listOfKingdoms[i].claimTerritory(attackList[target]);
		listOfKingdoms[i].drawTerritory();
		listOfKingdoms[i].calculateEconomy();
	}

	writeToInfoPanel();
	setHighlightedCells();

	listOfKingdoms[listOfKingdoms.length-1].drawTerritory();
	listOfKingdoms[listOfKingdoms.length-1].calculateEconomy();
}

function initCell(cell) {
	Math.seedrandom(g.randomSeed + $(cell).attr("id") );
	var typeIndex =  Math.floor(Math.random() * g.m.cellTypeList.length);
	var type = g.m.cellTypeList[typeIndex];

	cell.attr("type", type);

	newCell = new Cell($(cell).attr("id"),type);
	g.m.listOfCells.push(newCell);

	var img = $(document.createElement("img"));
	cell.append(img);

	img.addClass("cellImg");
	img.css("height", g.m.actualCellSize/2 + "px");
	img.css("width", g.m.actualCellSize/2 + "px");
	img.css("top",  g.m.actualCellSize/8 + "px");
	img.css("left",  g.m.actualCellSize/8 + "px");

	switch (type) {
		// Farm
		case g.m.cellTypeList[0]:
			img.attr("src", "img/farm.svg");
			break;
		// Settlement
		case g.m.cellTypeList[1]:
			img.attr("src", "img/settlement.svg");
			break;
			// Forest
		case g.m.cellTypeList[2]:
			img.attr("src", "img/forest.svg");
			break;
			// Mountain
		case g.m.cellTypeList[3]:
			img.attr("src", "img/mountain.svg");
			break;
		default:
	}
}

function Cell(id, type) {
	this.id = id;

	switch (type) {
		// Farm
		case g.m.cellTypeList[0]:
			this.wealth = 5;
		  this.industry = 0;
		  this.food = 100;
		  this.population = 10;
			break;
		// Settlement
		case g.m.cellTypeList[1]:
			this.wealth = 50;
			this.industry = 25;
			this.food = 0;
			this.population = 100;
			break;
			// Forest
		case g.m.cellTypeList[2]:
			this.wealth = 20;
			this.industry = 25;
			this.food = 20;
			this.population = 0;
			break;
			// Mountain
		case g.m.cellTypeList[3]:
			this.wealth = 50;
			this.industry = 100;
			this.food = 0;
			this.population = 0;
			break;
		default:
		  console.warn("Cell type not defined!");
	}
}

function writeToInfoPanel()
{
	var text1 = text2 = text3 = text4 = "&nbsp;";
	if (highlightedKindom != null) {
	text1 = highlightedKindom.name + " wealth: " + highlightedKindom.econ.wealth;
	text2 = highlightedKindom.name + " industry: " + highlightedKindom.econ.industry;
	text3 = highlightedKindom.name + " food: " + highlightedKindom.econ.food;
	text4 = highlightedKindom.name + " population: " + highlightedKindom.econ.population;
	}

	$("#infoWealth").html(text1);
	$("#infoIndustry").html(text2);
	$("#infoFood").html(text3);
	$("#infoPopulation").html(text4);
}
