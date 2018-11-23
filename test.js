function assert(cond, text)
{
	if (cond)
		{
			
		text ="[okay] " + text;
		}
	else
		{
		text =	"[fail] " + text;
		}
		
	console.groupCollapsed(text);
	console.log(g);
	console.groupEnd();	
	}

function initTest(width = 1024, height = 768)
{
	setConsts();
	g.wWidth = width;
	g.wHeight = height;
	
}


function test()
{
	console.clear();

	testOrientation();
}

function testOrientation()
{
	initTest(1024,768);
	decideOrientation();
	assert(g.orientation == "L", "Landscape");
	
	initTest(768,1024);
	decideOrientation();
	assert(g.orientation == "P", "Portrait");
}
