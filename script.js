$( document ).ready(function() {

// Initializations
	setConsts();
	initLayout();
	initKingdoms();

	started = 0;
	runner = null;

// Temporary test function
	$(".cell").click(clicked);
	$(".cell").attr("clicked",0);

// Event Listeners
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
  redKingdom   = new Kingdom(g.kingdomNames[0],"red",   ["r0c0", "r0c1", "r1c0", "r2c0"]);
  blueKingdom  = new Kingdom(g.kingdomNames[1],"blue",  ["r4c2", "r3c2", "r4c3", "r3c3"]);
  greenKingdom = new Kingdom(g.kingdomNames[2],"green", ["r9c7", "r9c6", "r9c5", "r8c6"]);

  listOfKingdoms = [redKingdom, blueKingdom, greenKingdom];
}

function setConsts() {
	g = {};                              // Global variables
	g.w = {};                            // Window variables
	g.d = {};                            // Dashboard variables
	g.m = {};                            // Map variables

	g.randomSeed = "0001";               // Seed for random number generation

	g.kingdomNames = ["Red Kingdom", "Blue Kingdom", "Green Kingdom"];  // Name of the kingdoms

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
	if ($(this).attr("clicked") == 1)
	{
		$(this).css("background-color","#fafafa");
		$(this).attr("clicked",0);
	}
	else
	{
		$(this).css("background-color","#fedcba");
		$(this).attr("clicked",1);
	}
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

	for (var i = 0; i < listOfKingdoms.length; i++)
	{
		var attackList = listOfKingdoms[i].findNeighbourCells();
		var target = Math.floor(Math.random() * attackList.length);

		listOfKingdoms[i].claimTerritory(attackList[target]);
		listOfKingdoms[i].drawTerritory();
		listOfKingdoms[i].calculateEconomy();
	}
}

function initCell(cell) {
	Math.seedrandom(g.randomSeed + $(cell).attr("id") );
	var typeIndex =  Math.floor(Math.random() * g.m.cellTypeList.length);
	var type = g.m.cellTypeList[typeIndex];

	cell.attr("type", type);

	newCell = new Cell($(cell).attr("id"),type);
	g.m.listOfCells.push(newCell);
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
