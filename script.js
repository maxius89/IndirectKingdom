$( document ).ready(function() {
	setConsts();

	rethinkPanels();

	$("body").append(createMap(g.cols, g.rows));
	setTimeout(later,1800);
	$(".cell").click(clicked);
	$(".cell").attr("clicked",0);
	
	
	g.resizeTimeout = null;
	$( window ).resize(function() {
		if (g.resizeTimeout != null) clearTimeout(g.resizeTimeout);
  	g.resizeTimeout = setTimeout( function() {
			g.wWidth = $(document).width();
			g.wHeigth = $(document).height();
			rethinkPanels();
			g.resizeTimeout = null;
		}, 200);
	});
	
	setTimeout(test,500);
});

function setConsts()
{
	g = {};
	g.sceneRows = 20;
	g.sceneCols = 30;
	g.dAspectRatio = 4/3;
	g.gapRatio = 1/6;
	g.actualCellSize = 40; 	// px
	g.minCellSize = 30; 		// px
	g.stepCellSize = 5; 		// px
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
			newCol.html("&nbsp;");
		}
	}

	return table;
}


function rethinkPanels()
{
	decideOrientation();	
	calcDashboardSize();	
	calcMapSize();
	

	g.cols = 5; // tmp
	g.rows = 5; // tmp
	console.log(g);
}

function decideOrientation()
{
	g.orientation = ( g.wWidth > g.wHeight ? "L" : "P");
	if (g.orientation == "P")
	{
		g.wShort = g.wWidth;
		g.wLong = g.wHeigth;
	}
	else
	{
		g.wShort = g.wHeigth;
		g.wLong = g.wWidth;
	}
}

function calcDashboardSize()
{
	g.dShort = g.wShort;
	g.dLong = Math.floor(g.dAspectRatio * g.dShort);
}

function calcMapSize()
{
	g.mShort = g.wShort;
	g.mLong = g.wLong - g.dLong;
	
	g.mShorterSide = ( g.mShort < g.mLong ? g.mShort : g.mLong );
	// n*cell.width+(n+1)*gap =g.mShorterSide
	// cell.width * gapRatio =  gap
	// n*cell.width+ (n+1)*cell.width * gapRatio =g.mShorterSide
	//cell.width * (n+ (n+1)* gapRatio = g.mShorterSide 
	
	calcCellNum(); 
}

function calcCellNum()
{
	// ha eleg nagy a terulet --> mindent kirajzol actual merettel (g.actualCellSize)
	// ha nem                 --> g.actualCellSize = mShort/ cell.width
	
	var currentTableSize = 0; //tmp
	if (true)   // if kifer az osszes
	{
		// upscale
	}
	else  // csak resz-scene lesz mutatva
	{
		if (true)  // legalabb 3 kifer
		{
			// megmutatjuk a kiszamolt meretben
		}
		else  // nem fer ki 3
		{
			// de, 3, lemegyunk a min. meret ala
		}
	}

}

function getMapSize(cellSize)
{
	var gap = Math.floor(cellSize * g.gapRatio);
	var mapSize = 0; //tmp
	}
