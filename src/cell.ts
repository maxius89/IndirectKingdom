import Kingdom from './kingdom';
import Person, { Profession } from './person';
import { g as Global } from './script';
import * as seedrandom from 'seedrandom';

export default class Cell {

  id: string;
  owner: Kingdom;
  output: Output;
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

  listOfResidents: Person[] = [];
  listOfTravelers: Person[] = [];

  baseEfficiency: BaseEfficiency;

  constructor(coordinates: CellCoordinates) {
    this.pos = coordinates;
    this.id = "r" + coordinates.row + "c" + coordinates.col;
    this.type = this.setRandomType();

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

    let initPopulation: number = 0;
    switch (this.type) {
      case LandType.Field:
        this.wealth = 5;
        this.industry = 0;
        this.agriculture = 100;
        initPopulation = 10;
        break;
      case LandType.Forest:
        this.wealth = 20;
        this.industry = 25;
        this.agriculture = 20;
        initPopulation = 5;
        break;
      case LandType.Mountain:
        this.wealth = 50;
        this.industry = 100;
        this.agriculture = 0;
        initPopulation = 5;
        break;
      default:
        console.warn("Cell type not defined!");
    }

    for (let i = 0; i < initPopulation; ++i) {
      this.listOfResidents.push(new Person(this.decideProfession()));
    }
  }

  decideProfession(): Profession {
    if (this.listOfResidents.length === 0)
      return Profession.Leader;

    let profession: Profession = Profession.Trader;
    let chance: number[] = [];
    chance[Profession.Farmer] = 0;
    chance[Profession.Lumberman] = 0;
    chance[Profession.Hunter] = 0;
    chance[Profession.Miner] = 0;
    chance[Profession.Craftsman] = 0;
    chance[Profession.Trader] = 0;

    switch (this.type) {
      case LandType.Field:
        chance[Profession.Farmer] = 0.7;
        chance[Profession.Craftsman] = 0.2;
        chance[Profession.Trader] = 0.1;
        break;
      case LandType.Forest:
        chance[Profession.Lumberman] = 0.4;
        chance[Profession.Hunter] = 0.4;
        chance[Profession.Craftsman] = 0.1;
        chance[Profession.Trader] = 0.1;
        break;
      case LandType.Mountain:
        chance[Profession.Miner] = 0.6;
        chance[Profession.Craftsman] = 0.2;
        chance[Profession.Trader] = 0.2;
        break;
      default:
        profession = Profession.Trader;
    }
    const rng = seedrandom(Global.randomSeed + this.id);
    let chanceSum = 0;
    for (let i = 0; i < chance.length; ++i) {
      chanceSum += chance[i];
      if (chanceSum >= rng()) {
        profession = Profession[Profession[i] as keyof typeof Profession];
        break;
      }
    }
    return profession;
  }

  setRandomType(): LandType {
    const rng = seedrandom(Global.randomSeed + this.id);
    const numberOfLandTypes = Object.keys(LandType).length / 2;

    return Math.floor(rng() * numberOfLandTypes);
  }

  updateCell(this: Cell): void {
    const populationPower = this.population; // TODO: Get a function with diminishing return;
    const excessFood = this.agriculture - this.population;

    this.moneyEfficiency = this.baseEfficiency.money * populationPower;
    this.industryEfficiency = this.baseEfficiency.goods * populationPower;
    this.agricultureEfficiency = this.baseEfficiency.food * populationPower;
    this.populationGrowth = this.baseEfficiency.people * populationPower * excessFood;

    this.population += this.populationGrowth;

  }

  generateOutput(this: Cell): Output {
    this.output.money = this.wealth * this.moneyEfficiency;
    this.output.goods = this.industry * this.industryEfficiency;
    this.output.food = this.agriculture * this.agricultureEfficiency;

    return this.output;
  }

  nextRound(this: Cell): void {
    this.updateCell();

    Object.keys(this.output).map(function(this: Cell, i) {
      this.owner.income[i] += this.generateOutput()[i];
    }, this);
  }

}

export enum LandType {
  Field,
  Forest,
  Mountain
}

interface BaseEfficiency {
  money: number;
  goods: number;
  food: number;
  people: number;
}

export interface CellCoordinates {
  row: number;
  col: number;
}

interface Output {
  money: number;
  goods: number;
  food: number;
  [key: string]: number;
}
