export default class Globals {

  runner: number = 0;
  showPopulation: boolean = false;
  started: boolean = false;

  randomSeed: string = "";                  // Seed for random number generation

  kingdomNames: string[] = [];              // Name of the kingdoms

  turnLength: number = 0;				// ms		   // Length of a turn

  sceneRows: number = 0;                   // Number of the rows of the Map
  sceneCols: number = 0;                   // Number of the coloumns of the Map
}
