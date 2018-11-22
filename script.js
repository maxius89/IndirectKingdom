$( document ).ready(function() {
	setConsts();

	$("body").append(createMap(g.cols, g.rows));
	setTimeout(later,1800);
	$(".cell").click(clicked);
	$(".cell").attr("clicked",0);
	
	rethinkPanels();
	
	g.resizeTimeout = null;
	$( window ).resize(function() {
		if (g.resizeTimeout != null) clearTimeout(g.resizeTimeout);
	  	g.resizeTimeout = setTimeout( function() {
			rethinkPanels();
			g.resizeTimeout = null;
		}, 200);
	});
});

function setConsts()
{
	g = {};
	g.rows = 5;
	g.cols = 5;
	g.dAspectRatio = 4/3;
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
	

	console.log(g);
}

function decideOrientation()
{
	g.wWidth = $(document).width();
	g.wHeigth = $(document).height();
	
	g.orientation = ( g.wWidth > g.wHeigth ? "L" : "P");
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

}
