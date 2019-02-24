export default class Globals {

    started: boolean;
    runner: any;
    highlightedKindom: any;
    showPopulation: boolean;
    resizeTimeout: any;

    randomSeed: string;               // Seed for random number generation

  	kingdomNames: string[];  // Name of the kingdoms

  	turnLength: number;				// ms			 // Length of a turn

  	sceneRows: number;                    // Number of the rows of the Map
    sceneCols: number;                    // Number of the coloumns of the Map


    //export namespace w{}                            // Window variables
  /*  export namespace d {                            // Dashboard variables
      export var thicknessRatio: number;
    	export var minThickness: number;   // px      // Dashboard thickness minimum
    	export var maxThickness: number;   // px      // Dashboard thickness maximum
    	export var minDashboardThickessRatio: number;   // Dashboard thickness/window shorter size minimum ratio
      }
  	export namespace m {                            // Map variables
      export var borderRatio: number;              // Cell-size/border thickness ratio
      export var actualCellSize: number; 	// px      // Actual size of the drawn cells
      export var minCellSize: number; 		// px      // Minimum size of the drawn cells
      export var maxCellSize: number; 		// px      // Maximum size of the drawn cells
      export var stepCellSize: number; 		// px      // Cell-size increment/decrement constant
      export var minDrawnCells: number;               // Minimum number of drawn cells
      export var cellTypeList: string[]; // Cell types on the map
      //export var listOfCells: Cell[];                // List of map cells for data storage
    }*/
}
