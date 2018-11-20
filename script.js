// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "ready!" );
	setTimeout(later,1800);
	$(".cell").click(clicked);
	$(".cell").attr("clicked",0);
});

function later()
{
	$("#r2c2").css("background-color","#abcdef");
}

function clicked()
{ 
console.log($(this).attr("clicked"));
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
