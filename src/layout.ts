function initLayout() {
	g.w.width = $(window).width();
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
	addInfoPanel();
}

function drawLayout() {
	var mapDiv = $(document.createElement('div'));
	var dashDiv = $(document.createElement('div'));

	$("body").append(mapDiv);
	$("body").append(dashDiv);

	mapDiv.attr("id","mapDiv");
	dashDiv.attr("id","dashDiv");

	$("#mapDiv").css("overflow-x", "scroll");
	$("#mapDiv").css("overflow-y", "scroll");
}

function addButtons() {
	var startButton = $("<button>").text("Start / Stop");
	startButton.click(runGame);
	$("#dashDiv").append(startButton);

	var populationButton = $("<button>").text("Show Population");
	populationButton.click(showPopulation);
	$("#dashDiv").append(populationButton);
}

function addInfoPanel() {
  var infoPanel = $(document.createElement('div'));
  $("#dashDiv").append(infoPanel);
  infoPanel.attr("id","infoPanel");
  infoPanel.css("width", g.d.thickness + "px");
  infoPanel.css("height", g.d.length/2 + "px");
  infoPanel.css("background-color","#ffffff");
  //infoPanel.html("infoPanel initialized.");

  var infoWealth = $(document.createElement("div"));
  infoWealth.attr("id","infoWealth");
  infoPanel.append(infoWealth);

	var infoIndustry = $(document.createElement("div"));
  infoIndustry.attr("id","infoIndustry");
  infoPanel.append(infoIndustry);

	var infoAgriculture = $(document.createElement("div"));
	infoAgriculture.attr("id","infoAgriculture");
	infoPanel.append(infoAgriculture);

	var infoPopulation = $(document.createElement("div"));
	infoPopulation.attr("id","infoPopulation");
	infoPanel.append(infoPopulation);

}

function createMap(width:number, height:number) {
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
			newCol.attr("type","none");
			newCol.html("&nbsp;");

			initCell(newCol);
		}
	}

	return table;
}

function updateMap() {
	g.m.listOfCells.forEach(function(cell) {
		$("#" + cell.id).attr("status",cell.owner.name);
		$("#" + cell.id).css("background-color",cell.owner.color);
	});
}

function rethinkPanels() {
	g.w.width = $(window).width();
	g.w.height = $(window).height();

	decideWindowOrientation();
	calcDashboardSize();
	calcMapSize();
	calcCellSize();
	updateLayout();

	console.log(g);
}

function decideWindowOrientation() {
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

function calcDashboardSize() {
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

function calcMapSize() {
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

function calcCellNum() {
	g.m.upscaled = upscaleCells();
	if (g.m.upscaled) return;

	g.m.downscaled = makeCellsFit();
}

function calcCellSize() {
	calcCellNum();
	resizeCells();
}

function updateLayout() {
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

function upscaleCells() {
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

function makeCellsFit() {
	var minMapSize = g.m.minDrawnCells * g.m.actualCellSize;
	if (g.m.width >= minMapSize && g.m.height >= minMapSize) return false;

	var verticalScale = g.m.width / minMapSize;
	var horizontalScale = g.m.height / minMapSize;
	var scale = Math.min(verticalScale, horizontalScale);
	g.m.actualCellSize = Math.floor(g.m.actualCellSize * scale);

	return true;
}

function resizeCells() {
	g.m.actualCellSize = Math.max(g.m.actualCellSize, g.m.minCellSize);
	g.m.actualCellSize = Math.min(g.m.actualCellSize, g.m.maxCellSize);

	$(".cell").css("height", g.m.actualCellSize + "px");
	$(".cell").css("width", g.m.actualCellSize + "px");

	var bordersize = Math.ceil(g.m.actualCellSize * g.m.borderRatio);
	$(".cell").css("box-shadow", "inset " + bordersize +"px "  + bordersize +"px #ffffff," +
															 "inset -"+ bordersize +"px -" + bordersize +"px #ffffff");

  $(".cellImg").css("height", g.m.actualCellSize/2 + "px");
	$(".cellImg").css("width", g.m.actualCellSize/2 + "px");
	$(".cellImg").css("top",  g.m.actualCellSize/8 + "px");
	$(".cellImg").css("left",  g.m.actualCellSize/8 + "px");
}

function zoom(event:Event) {
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
