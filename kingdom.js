function Kingdom(name, color, cells) {

  this.name = name;
  this.color = color;
  this.cells = [];
  this.highlighted = 0;

  this.econ = {
    wealth: 0,
    industry: 0,
    food: 0,
    population: 0
  };

  for (i = 0; i < cells.length; i++)
  {
    this.cells.push(cells[i]);
  }

  this.updateCellsList = function() {
    var tempList = [];
    var listOfCells = $( ".cell[status = '"+this.name+"']" );

    $.each(listOfCells, function(i,entry){
      tempList.push($(entry).attr("id"));
    });

    this.cells = tempList;
  }

  this.drawTerritory = function() {
    for (i = 0; i < this.cells.length; i++)
    {
      $("#" + this.cells[i]).css("background-color",this.color);
    }
  }

  this.setTerritoryStatus = function() {
    for (i = 0; i < this.cells.length; i++)
    {
      $("#" + this.cells[i]).attr("status",this.name);
    }
  }

  this.claimTerritory = function(cell) {
    this.cells.push(cell);
    clearPreviousOwnership(cell);
    this.setTerritoryStatus();
  }

  this.loseTerritory = function(cell) {
    this.cells.splice( this.cells.indexOf(cell), 1 );
    $("#" + cell).attr("status","unclaimed");
  }

  this.findNeighbourCells = function() {
    var neighbours =[];
    for (i = 0; i < this.cells.length; i++)
    {
      neighbours = neighbours.concat(analizeNeighbours(this.cells[i], this.name));
    }
    return neighbours;
  }

  this.init = function() {
    this.setTerritoryStatus();
    this.drawTerritory();
    this.updateCellsList();
    this.calculateEconomy();
  }

  this.calculateEconomy = function() {
    var tempEcon = {
      wealth: 0,
      industry: 0,
      food: 0,
      population: 0
    };

    $.each(this.cells, function(i,entry){
      var currentCell = g.m.listOfCells.find( function(element) {
        return element.id === entry});

      tempEcon.wealth += currentCell.wealth;
      tempEcon.industry += currentCell.industry;
      tempEcon.food += currentCell.food;
      tempEcon.population += currentCell.population;
    });
    this.econ = tempEcon;
  }


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

function clearPreviousOwnership(inputCell) {
  var checkedStatus = $("#" + inputCell).attr("status");
  listOfKingdoms[g.kingdomNames.indexOf(checkedStatus)].loseTerritory(inputCell);
}
