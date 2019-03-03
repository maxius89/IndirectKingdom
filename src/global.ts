import Kingdom from './kingdom';

export default class Globals {

  highlightedKindom: Kingdom;

  resizeTimeout: number;
  runner: number;
  showPopulation: boolean;
  started: boolean;

  randomSeed: string;                  // Seed for random number generation

  kingdomNames: string[];              // Name of the kingdoms

  turnLength: number;				// ms		   // Length of a turn

  sceneRows: number;                   // Number of the rows of the Map
  sceneCols: number;                   // Number of the coloumns of the Map
}
