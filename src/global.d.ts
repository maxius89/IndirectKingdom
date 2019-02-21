/*~ If your library has properties exposed on a global variable,
 *~ place them here.
 *~ You should also place types (interfaces and type alias) here.
 */
declare namespace globals {

export namespace G{
    let started: boolean;
    let runner: any;
    let highlightedKindom: any;
    let showPopulation: boolean;
    let resizeTimeout: any;

    let randomSeed: string;               // Seed for random number generation

  	let kingdomNames: string[];  // Name of the kingdoms

  	let turnLength: number;				// ms			 // Length of a turn

  	let sceneRows: number;                    // Number of the rows of the Map
    let sceneCols: number;                    // Number of the coloumns of the Map



    namespace w{}                            // Window variables
    namespace d {                            // Dashboard variables
      let thicknessRatio: number;
    	let minThickness: number;   // px      // Dashboard thickness minimum
    	let maxThickness: number;   // px      // Dashboard thickness maximum
    	let minDashboardThickessRatio: number;   // Dashboard thickness/window shorter size minimum ratio
      }
  	namespace m {                            // Map variables
      var actualCellSize: number; 	// px      // Actual size of the drawn cells
      var borderRatio: number;              // Cell-size/border thickness ratio
      var minCellSize: number; 		// px      // Minimum size of the drawn cells
      var maxCellSize: number; 		// px      // Maximum size of the drawn cells
      var stepCellSize: number; 		// px      // Cell-size increment/decrement constant
      var minDrawnCells: number;               // Minimum number of drawn cells
      var cellTypeList: string[]; // Cell types on the map
      var listOfCells: Cell[];                // List of map cells for data storage
      }
}
}
