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

  constructor(name: string, color: string, cellIDs: string[], world: World) {
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

    cellIDs.forEach(function(this: Kingdom, cellId: string) {
      var currentCell = World.listOfCells.find(function(cell) {
        return cell.id === cellId;
      });

      this.claimTerritory(currentCell);
    }, this);
  }

  updateCellsList = function(this: Kingdom): void {
    this.cells = World.listOfCells.filter(cell => cell.owner.name === this.name);
  }

  setTerritoryStatus = function(this: Kingdom): void {
    this.cells.forEach(function(this: Kingdom, cell: Cell) {
      cell.owner = this;
    }, this);
  }

  claimTerritory = function(this: Kingdom, claimedCell: Cell): void {
    if (!this.cells.includes(claimedCell)) {
      if (claimedCell.owner != undefined) {
        claimedCell.owner.loseTerritory(claimedCell);
      }
      this.cells.push(claimedCell);
      this.setTerritoryStatus();
    }
  }

  loseTerritory = function(this: Kingdom, cell: Cell): void {
    this.cells.splice(this.cells.indexOf(cell), 1);
    cell.owner = World.listOfKingdoms[0]; // unclaimed
  }

  findNeighbourCells = function(this: Kingdom): Cell[] {
    var neighbours: Cell[] = [];

    this.cells.forEach(function(this: Kingdom, cell: Cell) {
      neighbours = neighbours.concat(this.analizeNeighbours(cell));
    }, this);
    return neighbours;
  }

  analizeNeighbours = function(this: Kingdom, inputCell: Cell): Cell[] {
    var outputList: Cell[] = [];
    var rowNum = inputCell.pos.row;
    var colNum = inputCell.pos.col;

    if (rowNum > 0) {
      outputList.push(World.map[rowNum - 1][colNum]);
    }

    if (rowNum < this.world.numRows - 1) {
      outputList.push(World.map[rowNum + 1][colNum]);
    }

    if (colNum > 0) {
      outputList.push(World.map[rowNum][colNum - 1]);
    }

    if (colNum < this.world.numCols - 1) {
      outputList.push(World.map[rowNum][colNum + 1]);
    }

    return outputList.filter(cell => cell.owner != this);
  }

  init = function(this: Kingdom): void {
    this.updateCellsList();
    this.setTerritoryStatus();
    this.calculateEconomy();
  }

  calculateEconomy = function(this: Kingdom): void {
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
