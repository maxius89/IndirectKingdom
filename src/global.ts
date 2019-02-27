import Cell from './cell';
import Kingdom from './kingdom';

export default class Globals {

  started: boolean;
  runner: any;
  highlightedKindom: any;
  showPopulation: boolean;
  resizeTimeout: any;

  randomSeed: string;                   // Seed for random number generation

  kingdomNames: string[];              // Name of the kingdoms
  listOfKingdoms: Kingdom[];

  turnLength: number;				// ms			 // Length of a turn

  sceneRows: number = 25;              // Number of the rows of the Map
  sceneCols: number = 25;              // Number of the coloumns of the Map

  listOfCells: Cell[];                // List of map cells for data storage*/
}
