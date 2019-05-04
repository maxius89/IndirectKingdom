import Cell from './cell';
import Kingdom from './kingdom'
import { g as global } from './script';
import * as seedrandom from 'seedrandom';

export default class World {

  numRows: number;
  numCols: number;
  static map: Cell[][] = [[]];
  static listOfCells: Cell[] = [];
  static listOfKingdoms: Kingdom[] = [];

  constructor(dim: Dimension) {
    this.numRows = dim.rows;
    this.numCols = dim.cols;

    if (this.numRows * this.numCols < 1) {
      console.error("Number of cells less than 1. Increase row or column number!");
    }

    this.initMap();
    this.initKingdoms();
  }

  initKingdoms(): void {
    const unclaimed = new Kingdom(global.kingdomNames[0], "#7777cc", [], false, this);
    World.listOfCells.forEach(cell => unclaimed.claimTerritory(cell));

    const redKingdom = new Kingdom(global.kingdomNames[1], "red", ["r0c0", "r0c1", "r1c0", "r2c0"], true, this);
    const blueKingdom = new Kingdom(global.kingdomNames[2], "blue", ["r4c2", "r3c2", "r4c3", "r3c3"], true, this);
    const greenKingdom = new Kingdom(global.kingdomNames[3], "green", ["r9c7", "r9c6", "r9c5", "r8c6"], true, this);

    World.listOfKingdoms = [unclaimed, redKingdom, blueKingdom, greenKingdom];
    World.listOfKingdoms.forEach(kingdom => kingdom.init());
  }

  initMap(): void {
    for (let i = 0; i < this.numRows; ++i) {
      World.map[i] = [];
      for (let j = 0; j < this.numCols; ++j) {
        var newCell = new Cell({ row: i, col: j });
        World.listOfCells.push(newCell);
        World.map[i][j] = newCell;
      }
    }
  }

  static nextRound(): void {
    var rng = seedrandom();

    World.listOfCells.forEach(cell => cell.nextRound());
    World.listOfKingdoms.forEach(kingdom => kingdom.nextRound(rng()));
  }

}

interface Dimension {
  rows: number;
  cols: number;
}
