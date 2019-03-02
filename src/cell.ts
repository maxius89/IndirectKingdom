import * as seedrandom from 'seedrandom';
import Kingdom from './kingdom';
import World from './world';
import { g as global } from './script';

export default class Cell {

  id: string;
  owner: Kingdom;
  output: any;
  type: LandType;
  pos: CellCoordinates;

  moneyEfficiency: number;
  industryEfficiency: number;
  agricultureEfficiency: number;
  populationGrowth: number;

  wealth: number;
  industry: number;
  agriculture: number;
  population: number;

  baseEfficiency: BaseEfficiency;

  constructor(coordinates: CellCoordinates, type: LandType, owner: Kingdom) {
    this.pos = coordinates;
    this.id = "r" + coordinates.row + "c" + coordinates.col;
    this.owner = owner;
    this.type = type;

    this.output = {    // Object for cell output per turn
      money: 0,
      goods: 0,
      food: 0
    };

    // Efficiencies calculated from different elements for output calculation
    this.moneyEfficiency = 0;
    this.industryEfficiency = 0;
    this.agricultureEfficiency = 0;
    this.populationGrowth = 0;

    this.baseEfficiency = { // Object for production efficieny constants. Can be modified by world-events.
      money: 0.01,
      goods: 0.01,
      food: 0.01,
      people: 0.01
    };

    switch (this.type) {
      case LandType.Farm:
        this.wealth = 5;
        this.industry = 0;
        this.agriculture = 100;
        this.population = 10;
        break;
      case LandType.Settlement:
        this.wealth = 50;
        this.industry = 25;
        this.agriculture = 0;
        this.population = 100;
        break;
      case LandType.Forest:
        this.wealth = 20;
        this.industry = 25;
        this.agriculture = 20;
        this.population = 5;
        break;
      case LandType.Mountain:
        this.wealth = 50;
        this.industry = 100;
        this.agriculture = 0;
        this.population = 5;
        break;
      default:
        console.warn("Cell type not defined!");
    }
  }

  static initCell(coordinates: CellCoordinates): Cell {
    var newRnd = seedrandom(global.randomSeed + coordinates.row + coordinates.col);
    var numberOfLandTypes = Object.keys(LandType).length / 2;
    var type: LandType = Math.floor(newRnd() * numberOfLandTypes);

    var tempWorld = new World([0, 0]);
    var unclaimedOwner = new Kingdom("unclaimed", "#7777cc", [], tempWorld);
    let newCell = new Cell(coordinates, type, unclaimedOwner); // TODO: Remove unclaimedOwner dependency

    return newCell;
  }

  clearPreviousOwnership = function(this: Cell): void {
    this.owner.loseTerritory(this);
  }

  updateCell = function(this: Cell) {
    var populationPower = this.population; // TODO: Get a function with diminishing return;
    var excessFood = this.agriculture - this.population;

    this.moneyEfficiency = this.baseEfficiency.money * populationPower;
    this.industryEfficiency = this.baseEfficiency.goods * populationPower;
    this.agricultureEfficiency = this.baseEfficiency.food * populationPower;
    this.populationGrowth = this.baseEfficiency.people * populationPower * excessFood;

    this.population += this.populationGrowth;

  }

  generateOutput = function(this: Cell) {
    this.output.money = this.wealth * this.moneyEfficiency;
    this.output.goods = this.industry * this.industryEfficiency;
    this.output.food = this.agriculture * this.agricultureEfficiency;

    return this.output;
  }

  tick = function(this: Cell) {
    this.updateCell();

    Object.keys(this.output).map(function(this: Cell, i) {
      this.owner.income[i] += this.generateOutput()[i];
    }, this);
  }

}

export enum LandType {
  Farm,
  Settlement,
  Forest,
  Mountain
}

export interface CellCoordinates {
  row: number;
  col: number;
}

interface BaseEfficiency {
  money: number;
  goods: number;
  food: number;
  people: number;
}
