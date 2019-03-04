import Cell from './cell';
import World from './world';

export default class Kingdom {

  name: string;
  color: string;
  cells: Cell[] = [];
  world: World;
  highlighted: boolean;
  active: boolean;
  econ: Economy;
  income: Income;

  constructor(name: string, color: string, cellIDs: string[], active: boolean, world: World) {
    this.name = name;
    this.color = color;
    this.cells = [];
    this.world = world;
    this.active = active;
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
      const currentCell = World.listOfCells.find(cell => cell.id === cellId);
      this.claimTerritory(currentCell);
    }, this);
  }

  nextRound(random: number): void {
    if (this.active) {
      const attackList = this.findNeighbourCells();
      const target = Math.floor(random * attackList.length);

      this.claimTerritory(attackList[target]);
    }
    this.calculateEconomy();
  }


  updateCellsList(this: Kingdom): void {
    this.cells = World.listOfCells.filter(cell => cell.owner === this);
  }

  setTerritoryStatus(this: Kingdom): void {
    this.cells.forEach(cell => cell.owner = this);
  }

  claimTerritory(this: Kingdom, claimedCell: Cell): void {
    if (!this.cells.includes(claimedCell)) {
      if (claimedCell.owner != undefined) {
        claimedCell.owner.loseTerritory(claimedCell);
      }
      this.cells.push(claimedCell);
      this.setTerritoryStatus();
    }
  }

  loseTerritory(this: Kingdom, cell: Cell): void {
    this.cells.splice(this.cells.indexOf(cell), 1);
    cell.owner = World.listOfKingdoms[0]; // unclaimed
  }

  findNeighbourCells(this: Kingdom): Cell[] {
    let neighbours: Cell[] = [];

    this.cells.forEach(cell => {
      neighbours = neighbours.concat(this.analizeNeighbours(cell))
    });
    return neighbours;
  }

  analizeNeighbours(this: Kingdom, inputCell: Cell): Cell[] {
    let outputList: Cell[] = [];
    const rowNum = inputCell.pos.row;
    const colNum = inputCell.pos.col;

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

  init(this: Kingdom): void {
    this.updateCellsList();
    this.setTerritoryStatus();
    this.calculateEconomy();
  }

  calculateEconomy(this: Kingdom): void {
    Object.keys(this.econ).forEach(i => this.econ[i] = 0);

    this.cells.forEach(cell => {
      this.econ.wealth += cell.wealth;
      this.econ.industry += cell.industry;
      this.econ.agriculture += cell.agriculture;
      this.econ.population += cell.population;
    });
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
