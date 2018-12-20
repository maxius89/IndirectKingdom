var redKingdom = new Kingdom("Red Kingdom","red", ["r0c0", "r0c1", "r1c0","r2c0"]);
var blueKingdom = new Kingdom("Blue Kingdom","blue", ["r4c2", "r3c2","r4c3","r3c3"]);

$( document ).ready(function() {
	setConsts();
	initLayout();

	setTimeout(later,1800);
	$(".cell").click(clicked);
	$(".cell").attr("clicked",0);

	resizeTimeout = null;
	$( window ).resize(function() {
		if (resizeTimeout != null) clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout( function() {
			g.w.width= $(window).width();
			g.w.height = $(window).height();

			rethinkPanels();
			resizeTimeout = null;
		}, 200);
	});

	document.getElementById("mapDiv").addEventListener("wheel", zoom);

	//setTimeout(test,500);
	//var redKingdom = new Kingdom("Red Kingdom","red", ["r0c0", "r0c1", "r1c0","r2c0"]);
	redKingdom.claimTerritory("r10c0");
	redKingdom.loseTerritory("r2c0");
	redKingdom.drawTerritory();

	//var blueKingdom = new Kingdom("Blue Kingdom","blue", ["r4c2", "r3c2","r4c3","r3c3"]);
	blueKingdom.drawTerritory();

});

function zoom(event)
{
  if (event.ctrlKey == true)
	{
		event.preventDefault();

		if (event.deltaY < 0)
		{
			g.m.actualCellSize += g.m.stepCellSize;
		}
		else
		{
			g.m.actualCellSize -= g.m.stepCellSize;
		}

		resizeCells();
		$("#map").css("width", g.m.actualCellSize * g.sceneCols +"px");
		$("#map").css("height", g.m.actualCellSize * g.sceneRows +"px");
	}
}

function setConsts()
{
	g = {};                              // Global variables
	g.w = {};                            // Window variables
	g.d = {};                            // Dashboard variables
	g.m = {};                            // Map variables

	g.sceneRows = 25;                    // Number of the rows of the Map
	g.sceneCols = 25;                    // Number of the coloumns of the Map

	g.m.actualCellSize = 40; 	// px      // Actual size of the drawn cells
	g.m.borderRatio = 0.02;              // Cell-size/border thickness ratio
	g.m.minCellSize = 20; 		// px      // Minimum size of the drawn cells
	g.m.maxCellSize = 100; 		// px      // Maximum size of the drawn cells
	g.m.stepCellSize = 5; 		// px      // Cell-size increment/decrement constant
	g.m.minDrawnCells = 3;               // Minimum number of drawn cells

	g.d.thicknessRatio = 0.2;
	g.d.minThickness = 200;   // px      // Dashboard thickness minimum
	g.d.maxThickness = 400;   // px      // Dashboard thickness maximum
	g.d.minDashboardThickessRatio = 2;   // Dashboard thickness/window shorter size minimum ratio

}

function initLayout()
{
	g.w.width= $(window).width();
	g.w.height = $(window).height();

	drawLayout();
	$("#mapDiv").append(createMap(g.sceneCols , g.sceneRows));

	$("#mapDiv").css("background-color","#00ff00");  // Test color
	$("#dashDiv").css("background-color","#ff00ff"); // Test color

	$("#mapDiv").css("position", "absolute");
	$("#mapDiv").css("top", "0px");
	$("#mapDiv").css("left", "0px");
	$("#dashDiv").css("position", "absolute");

	rethinkPanels();
	addButtons();
}

function updateLayout()
{
	$("#mapDiv").css("width", g.m.width + "px");
	$("#mapDiv").css("height", g.m.height + "px");
	$("#map").css("width", g.m.actualCellSize * g.sceneCols +"px");

	if (g.w.orientation == "L")
	{
		$("#dashDiv").css("width", g.d.thickness + "px");
		$("#dashDiv").css("height", g.d.length + "px");

		$("#dashDiv").css("top", "0px");
		$("#dashDiv").css("left", g.m.width + "px");
	}
	else
	{
		$("#dashDiv").css("width", g.d.length + "px");
		$("#dashDiv").css("height", g.d.thickness + "px");

		$("#dashDiv").css("top", g.m.height + "px");
		$("#dashDiv").css("left", "0px");
	}
}

function later()
{
	$("#r2c2").css("background-color","#abcdef");
}

function clicked()
{
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

function createMap(width, height)
{
	var table = $(document.createElement('table'));
	table.attr("id","map");
	var tbody = $(document.createElement('tbody'));
	table.append(tbody);

	for (var i = 0; i < height; ++i)
	{
		var newRow = $(document.createElement("tr"));
		table.append(newRow);

		for (var j = 0; j < width ; ++j)
		{
			var newCol = $(document.createElement("td"));
			newRow.append(newCol);
			newCol.addClass("cell");
			newCol.attr("id", "r" + i + "c" + j);
			newCol.attr("status","unclaimed");
			newCol.html("&nbsp;");
		}
	}

	return table;
}

function drawLayout()
{
	var mapDiv = $(document.createElement('div'));
	var dashDiv = $(document.createElement('div'));

	$("body").append(mapDiv);
	$("body").append(dashDiv);

	mapDiv.attr("id","mapDiv");
	dashDiv.attr("id","dashDiv");

	$("#mapDiv").css("overflow-x", "scroll");
	$("#mapDiv").css("overflow-y", "scroll");

}

function rethinkPanels()
{
	decideWindowOrientation();
	calcDashboardSize();
	calcMapSize();
	calcCellSize();
	updateLayout();

	console.log(g);
}

function decideWindowOrientation()
{
	g.w.orientation = ( g.w.width> g.w.height ? "L" : "P");
	if (g.w.orientation == "P")
	{
		g.w.short = g.w.width;
		g.w.long = g.w.height;
	}
	else
	{
		g.w.short = g.w.height;
		g.w.long = g.w.width;
	}
}

function calcDashboardSize()
{
	if (g.w.long < g.d.minThickness * g.d.minDashboardThickessRatio)
	{
		g.d.length = 0;
		g.d.thickness = 0;
		g.d.disabled = true;
	}
	else
	{
		g.d.length = g.w.short;
		g.d.thickness = Math.floor(g.d.length * g.d.thicknessRatio);
		g.d.thickness = Math.max(g.d.thickness, g.d.minThickness);
		g.d.thickness = Math.min(g.d.thickness, g.d.maxThickness);
		g.d.disabled = false;
	}
}

function calcMapSize()
{
	g.m.width = g.w.width;
	g.m.height = g.w.height;

	if (g.w.orientation == "L")
	{
		g.m.width -= g.d.thickness;
	}
	else
	{
		g.m.height -= g.d.thickness;
	}
}

function calcCellNum()
{
	g.m.upscaled = upscaleCells();
	if (g.m.upscaled) return;

	g.m.downscaled = makeCellsFit();
}

function calcCellSize()
{
	calcCellNum();
	resizeCells();
}

function upscaleCells()
{
	var verticalMapSize = g.sceneRows * g.m.actualCellSize;
	if (g.m.width < verticalMapSize ) return false;

	var horizontalMapSize = g.sceneCols * g.m.actualCellSize;
	if (g.m.height < horizontalMapSize ) return false;

	var verticalScale = g.m.width / verticalMapSize;
	var horizontalScale = g.m.height / horizontalMapSize;
	var scale = Math.min(verticalScale, horizontalScale);
	g.m.actualCellSize = Math.floor(g.m.actualCellSize * scale);

	return true;
}

function makeCellsFit()
{
	var minMapSize = g.m.minDrawnCells * g.m.actualCellSize;
	if (g.m.width >= minMapSize && g.m.height >= minMapSize) return false;

	var verticalScale = g.m.width / minMapSize;
	var horizontalScale = g.m.height / minMapSize;
	var scale = Math.min(verticalScale, horizontalScale);
	g.m.actualCellSize = Math.floor(g.m.actualCellSize * scale);

	return true;
}

function resizeCells()
{
	g.m.actualCellSize = Math.max(g.m.actualCellSize, g.m.minCellSize);
	g.m.actualCellSize = Math.min(g.m.actualCellSize, g.m.maxCellSize);

	$(".cell").css("height", g.m.actualCellSize + "px")
	$(".cell").css("width", g.m.actualCellSize + "px");

	var bordersize = Math.ceil(g.m.actualCellSize * g.m.borderRatio);
	$(".cell").css("box-shadow", "inset " + bordersize +"px "  + bordersize +"px #ffffff," +
															 "inset -"+ bordersize +"px -" + bordersize +"px #ffffff");
}

function addButtons()
{
	var button = $("<button>").text("Next Round");
	button.click(nextRound);
	$("#dashDiv").append(button);
}

function nextRound()
{
 var attackList = redKingdom.findNeighbourCells();
 var target = Math.floor((Math.random() * attackList.length));

 redKingdom.claimTerritory(attackList[target]);
 redKingdom.drawTerritory();
}
