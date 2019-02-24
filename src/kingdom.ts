import Cell from './cell';
import g from './script';

export default class Kingdom {
  name: string;
  color: string;
  cells: Cell[] = [];
  highlighted: boolean;
  econ: {};
  income: {};

  constructor(name: string, color: string, cells: string[]) {
    this.name = name;
    this.color = color;
    this.cells = [];
    this.highlighted = false;

    this.econ = {
      wealth: 0,
      industry: 0,
      agriculture: 0,
      population: 0
    };

    this.income = {
      money: 0,
      goods: 0,
      food: 0
    };

    cells.forEach(function(cell) {
      var currentCell = g.m.listOfCells.find(function(element) {
        return element.id === cell});

        this.cells.push(currentCell);
        currentCell.owner = this;
    },this);
  }

  updateCellsList = function() {
    this.cells = g.m.listOfCells.filter(cell => cell.owner.name === this.name);
  }

  setTerritoryStatus = function() {
    this.cells.forEach(function(cell: Cell) {
      cell.owner = this;
    },this);
  }

  claimTerritory = function(inputCell: Cell) {
    if (!this.cells.includes(inputCell)) {
      this.cells.push(inputCell);
      inputCell.clearPreviousOwnership();
      this.setTerritoryStatus();
    }
  }

  loseTerritory = function(cell: Cell) {
    this.cells.splice( this.cells.indexOf(cell), 1 );
    //cell.owner = listOfKingdoms[listOfKingdoms.length-1]; // unclaimed
  }

  findNeighbourCells = function() {
    var neighbours : Cell[];

    this.cells.forEach(function(cell: Cell) {
      neighbours = neighbours.concat(this.analizeNeighbours(cell));
    },this);
    return neighbours;
  }

  analizeNeighbours= function(inputCell: Cell) {
    var outputList: Cell[];
    var posRow = inputCell.id.indexOf("r");
    var posCol = inputCell.id.indexOf("c");

    var rowNum = Number(inputCell.id.slice(posRow+1, posCol));
    var colNum = Number(inputCell.id.slice(posCol+1))

    var checkedID: string;
    var targetCell: Cell;

    if (rowNum > 0) {
      checkedID = "r" + (rowNum-1) + "c"+ colNum;

      targetCell = this.checkTargetCellOwner(checkedID, inputCell);
      if (targetCell != null) {
        outputList.push(targetCell);
      }
    }

    if (rowNum < g.sceneRows-1) {
      checkedID = "r" + (rowNum+1) + "c"+ colNum;

      targetCell = this.checkTargetCellOwner(checkedID, inputCell);
      if (targetCell != null) {
        outputList.push(targetCell);
      }
    }

    if (colNum > 0) {
      checkedID = "r" + rowNum + "c"+ (colNum-1);

      targetCell = this.checkTargetCellOwner(checkedID, inputCell);
      if (targetCell != null) {
        outputList.push(targetCell);
      }
    }

    if (colNum < g.sceneCols-1) {
      checkedID = "r" + rowNum + "c"+ (colNum+1);

      targetCell = this.checkTargetCellOwner(checkedID, inputCell);
      if (targetCell != null) {
       outputList.push(targetCell);
      }
    }

    return outputList;
  }

  checkTargetCellOwner = function(checkedId: string, inputCell: Cell) {
    var targetCell = g.m.listOfCells.find(function(cell) {
      return cell.id === checkedId;
    });

    if (targetCell.owner.name != inputCell.owner.name) {
      return targetCell;
    }
    else {
      return null;
    }
  }

  init = function() {
    this.setTerritoryStatus();
    this.updateCellsList();
    this.calculateEconomy();
  }

  calculateEconomy = function() {
    Object.keys(this.econ).forEach(i => this.econ[i] = 0);

      this.cells.forEach(function(currentCell: Cell) {
        this.econ.wealth += currentCell.wealth;
        this.econ.industry += currentCell.industry;
        this.econ.agriculture += currentCell.agriculture;
        this.econ.population += currentCell.population;
      },this);
  }

}
