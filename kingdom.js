function Kingdom(name, color, cells) {

  this.name = name;
  this.color = color;
  this.cells=[];

  for (i = 0; i < cells.length; i++)
  {
    this.cells.push(cells[i]);
  }


  this.drawTerritory = function(){
    for (i = 0; i < this.cells.length; i++)
    {
      $("#" + this.cells[i]).css("background-color",this.color);
    }
  }

  this.setTerritoryStatus = function(){
    for (i = 0; i < this.cells.length; i++)
    {
      $("#" + this.cells[i]).attr("status",this.name);
    }
  }

  this.claimTerritory = function(cell){
    this.cells.push(cell);
    this.setTerritoryStatus();
  }

  this.loseTerritory = function(cell){
    this.cells.splice( this.cells.indexOf(cell), 1 );
    $("#" + cell).attr("status","unclaimed");
  }

  this.findNeighbourCells = function(){
    var neighbours =[];
    for (i = 0; i < this.cells.length; i++)
    {
      neighbours = neighbours.concat(analizeNeighbours(this.cells[i], this.name));
    }
    return neighbours;
  }


  this.setTerritoryStatus();
}


function analizeNeighbours(inputID, kingdomName) {

  var outputList = [];
  var posRow = inputID.indexOf("r");
  var posCol = inputID.indexOf("c");

  var rowNum = Number(inputID.slice(posRow+1, posCol));
  var colNum = Number(inputID.slice(posCol+1))

  var checkedID;
  var checkedStatus;

  if (rowNum > 0)
  {
   checkedID = "r" + (rowNum-1) + "c"+ colNum;
   checkedStatus = $("#" + checkedID).attr("status");

   if (checkedStatus != kingdomName)
   {
     outputList.push(checkedID);
   }
  }

  if (rowNum < g.sceneRows-1)
  {
   checkedID = "r" + (rowNum+1) + "c"+ colNum;
   checkedStatus = $("#" + checkedID).attr("status");

   if (checkedStatus != kingdomName)
   {
     outputList.push(checkedID);
   }
  }

  if (colNum > 0)
  {
   checkedID = "r" + rowNum + "c"+ (colNum-1);
   checkedStatus = $("#" + checkedID).attr("status");

   if(checkedStatus != kingdomName)
   {
     outputList.push(checkedID);
   }
  }

  if (colNum < g.sceneCols-1)
  {
   checkedID = "r" + rowNum + "c"+ (colNum+1);
   checkedStatus = $("#" + checkedID).attr("status");

   if(checkedStatus != kingdomName)
   {
     outputList.push(checkedID);
   }
  }

  return outputList;
}
