import Cell from './cell';
import World from './world';

export default class Kingdom {
  name: string;
  color: string;
  cells: Cell[] = [];
  world: World;
  highlighted: boolean;
  econ: Economy;
  income: Income;

  constructor(name: string, color: string, cells: string[], world: World) {
    this.name = name;
    this.color = color;
    this.cells = [];
    this.world = world;
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

    cells.forEach(function(this: Kingdom, cell: string) {
      var currentCell = World.listOfCells.find(function(element) {
        return element.id === cell;
      });

      this.cells.push(currentCell);
      currentCell.owner = this;
    }, this);
  }

  updateCellsList = function(this: Kingdom) {
    this.cells = World.listOfCells.filter(cell => cell.owner.name === this.name);

    this.setTerritoryStatus();
  }

  setTerritoryStatus = function(this: Kingdom) {
    this.cells.forEach(function(this: Kingdom, cell: Cell) {
      cell.owner = this;
    }, this);
  }

  claimTerritory = function(this: Kingdom, inputCell: Cell) {
    if (!this.cells.includes(inputCell)) {
      inputCell.clearPreviousOwnership();
      this.cells.push(inputCell);
      this.setTerritoryStatus();
    }
  }

  loseTerritory = function(this: Kingdom, cell: Cell) {
    this.cells.splice(this.cells.indexOf(cell), 1);
    //cell.owner = listOfKingdoms[listOfKingdoms.length-1]; // unclaimed
  }

  findNeighbourCells = function(this: Kingdom) {
    var neighbours: Cell[] = [];

    this.cells.forEach(function(this: Kingdom, cell: Cell) {
      neighbours = neighbours.concat(this.analizeNeighbours(cell));
    }, this);
    return neighbours;
  }

  analizeNeighbours = function(this: Kingdom, inputCell: Cell) {
    var outputList: Cell[] = [];
    var rowNum = inputCell.pos.row;
    var colNum = inputCell.pos.col;

    var checkedID: string;
    var targetCell: Cell;

    if (rowNum > 0) {
      checkedID = "r" + (rowNum - 1) + "c" + colNum;

      targetCell = this.checkTargetCellOwner(checkedID, inputCell);
      if (targetCell != null) {
        outputList.push(targetCell);
      }
    }

    if (rowNum < this.world.numRows - 1) {
      checkedID = "r" + (rowNum + 1) + "c" + colNum;

      targetCell = this.checkTargetCellOwner(checkedID, inputCell);
      if (targetCell != null) {
        outputList.push(targetCell);
      }
    }

    if (colNum > 0) {
      checkedID = "r" + rowNum + "c" + (colNum - 1);

      targetCell = this.checkTargetCellOwner(checkedID, inputCell);
      if (targetCell != null) {
        outputList.push(targetCell);
      }
    }

    if (colNum < this.world.numCols - 1) {
      checkedID = "r" + rowNum + "c" + (colNum + 1);

      targetCell = this.checkTargetCellOwner(checkedID, inputCell);
      if (targetCell != null) {
        outputList.push(targetCell);
      }
    }

    return outputList;
  }

  checkTargetCellOwner = function(this: Kingdom, checkedId: string, inputCell: Cell) {
    var targetCell = World.listOfCells.find(function(cell) {
      return cell.id === checkedId;
    });

    if (targetCell.owner != inputCell.owner) {
      return targetCell;
    }
    else {
      return null;
    }
  }

  init = function(this: Kingdom) {
    this.setTerritoryStatus();
    this.updateCellsList();
    this.calculateEconomy();
  }

  calculateEconomy = function(this: Kingdom) {
    Object.keys(this.econ).forEach(i => this.econ[i] = 0);

    this.cells.forEach(function(this: Kingdom, currentCell: Cell) {
      this.econ.wealth += currentCell.wealth;
      this.econ.industry += currentCell.industry;
      this.econ.agriculture += currentCell.agriculture;
      this.econ.population += currentCell.population;
    }, this);
  }

}

interface Economy {
  wealth: number;
  industry: number;
  agriculture: number;
  population: number;
};

interface Income {
  money: number;
  goods: number;
  food: number;
};
