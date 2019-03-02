import Cell from './cell';
import Kingdom from './kingdom'
import { g as global } from './script';

export default class World {

  numRows: number;
  numCols: number;
  static map: Cell[][] = [[]];
  static listOfCells: Cell[] = [];
  static listOfKingdoms: Kingdom[] = [];

  constructor(dim: number[]) {
    this.numRows = dim[0];
    this.numCols = dim[1];

    this.initMap();

    if (this.numRows * this.numCols > 0) {
      this.initKingdoms();
      console.log(this);
    }

  }

  initKingdoms(): void {
    let redKingdom = new Kingdom(global.kingdomNames[0], "red", ["r0c0", "r0c1", "r1c0", "r2c0"], this);
    let blueKingdom = new Kingdom(global.kingdomNames[1], "blue", ["r4c2", "r3c2", "r4c3", "r3c3"], this);
    let greenKingdom = new Kingdom(global.kingdomNames[2], "green", ["r9c7", "r9c6", "r9c5", "r8c6"], this);
    let unclaimed = new Kingdom(global.kingdomNames[3], "#7777cc", [], this);
    unclaimed.updateCellsList();

    World.listOfKingdoms = [redKingdom, blueKingdom, greenKingdom, unclaimed];

    //layout.updateMap(g.listOfCells);
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
