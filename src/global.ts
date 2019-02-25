import Cell from './cell';
import Kingdom from './kingdom';

export default class Globals {

  started: boolean;
  runner: any;
  highlightedKindom: any;
  showPopulation: boolean;
  resizeTimeout: any;

  randomSeed: string;               // Seed for random number generation

  kingdomNames: string[];  // Name of the kingdoms
  listOfKingdoms: Kingdom[];

  turnLength: number;				// ms			 // Length of a turn

  sceneRows: number = 25;                    // Number of the rows of the Map
  sceneCols: number = 25;                    // Number of the coloumns of the Map

  w: {};                            // Window variables
  d: DashboardVariables;                           // Dashboard variables
  /*  thicknessRatio: number;
    minThickness: number;   // px      // Dashboard thickness minimum
    maxThickness: number;   // px      // Dashboard thickness maximum
    minDashboardThickessRatio: number;   // Dashboard thickness/window shorter size minimum ratio*/

  m: MapVariables;                            // Map variables
  /*  borderRatio: number;              // Cell-size/border thickness ratio
    minCellSize: number; 		// px      // Minimum size of the drawn cells
    maxCellSize: number; 		// px      // Maximum size of the drawn cells
    stepCellSize: number; 		// px      // Cell-size increment/decrement constant
    minDrawnCells: number;               // Minimum number of drawn cells
    cellTypeList: string[]; // Cell types on the map
    listOfCells: Cell[];                // List of map cells for data storage*/

  LandType: {
    Farm,
    Settlement,
    Forest,
    Mountain
  };

  constructor() {
    this.randomSeed = "fasz";
  }

}

interface MapVariables {
  borderRatio: number;              // Cell-size/border thickness ratio
  minCellSize: number; 		// px      // Minimum size of the drawn cells
  maxCellSize: number; 		// px      // Maximum size of the drawn cells
  stepCellSize: number; 		// px      // Cell-size increment/decrement constant
  minDrawnCells: number;               // Minimum number of drawn cells
  cellTypeList: string[]; // Cell types on the map
  listOfCells: Cell[];                // List of map cells for data storage
};

interface DashboardVariables {
  thicknessRatio: number;
  minThickness: number;   // px      // Dashboard thickness minimum
  maxThickness: number;   // px      // Dashboard thickness maximum
  minDashboardThickessRatio: number;   // Dashboard thickness/window shorter size minimum ratio
};
