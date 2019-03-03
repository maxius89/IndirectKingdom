import Cell from './cell';
import Kingdom from './kingdom'
import { g as global } from './script';

export default class World {

  numRows: number;
  numCols: number;
  static map: Cell[][] = [[]];
  static listOfCells: Cell[] = [];
  static listOfKingdoms: Kingdom[] = [];

  constructor(dim: Dimension) {
    this.numRows = dim.rows;
    this.numCols = dim.cols;

    this.initMap();

    if (this.numRows * this.numCols > 0) {
      this.initKingdoms();
      console.log(this);
    }

  }

  initKingdoms(): void {
    let unclaimed = new Kingdom(global.kingdomNames[0], "#7777cc", [], this);
    World.listOfCells.forEach(function(cell: Cell) { unclaimed.claimTerritory(cell); });

    let redKingdom = new Kingdom(global.kingdomNames[1], "red", ["r0c0", "r0c1", "r1c0", "r2c0"], this);
    let blueKingdom = new Kingdom(global.kingdomNames[2], "blue", ["r4c2", "r3c2", "r4c3", "r3c3"], this);
    let greenKingdom = new Kingdom(global.kingdomNames[3], "green", ["r9c7", "r9c6", "r9c5", "r8c6"], this);

    World.listOfKingdoms = [unclaimed, redKingdom, blueKingdom, greenKingdom];
    World.listOfKingdoms.forEach(function(kingdom: Kingdom) { kingdom.init(); });
  }

  initMap(): void {
    for (var i = 0; i < this.numRows; ++i) {
      World.map[i] = [];
      for (var j = 0; j < this.numCols; ++j) {
        var newCell = Cell.initCell({ row: i, col: j });
        World.listOfCells.push(newCell);
        World.map[i][j] = newCell;
      }
    }
  }

}

interface Dimension {
  rows: number;
  cols: number;
}
