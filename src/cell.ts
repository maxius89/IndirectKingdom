import Kingdom from './kingdom';
import Person, { Profession } from './person';
import { g as Global } from './script';
import * as seedrandom from 'seedrandom';
import WeightedRandom from './util/weightedRandom';

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

  buildings: Buildings = {
    houses: 0,
    farms: 0,
    hunterCamps: 0,
    lumberCamps: 0,
    mines: 1,
    workshops: 0
  };

  productivity: Production = {
    ore: 0,
    craft: 0,
    food: 0,
    wood: 0
  };

  productionCapacity: Production = {
    ore: 0,
    craft: 0,
    food: 0,
    wood: 0
  };

  production: Production = {
    ore: 0,
    craft: 0,
    food: 0,
    wood: 0
  };

  readonly ActionMap = new Map<Profession, (production: number) => void>([
    [Profession.Farmer, this.workFarmer.bind(this)],
    [Profession.Lumberman, this.workLumber.bind(this)],
    [Profession.Hunter, this.workHunter.bind(this)],
    [Profession.Miner, this.workMiner.bind(this)],
    [Profession.Craftsman, this.workCraftsman.bind(this)],
    [Profession.Trader, this.workTrader.bind(this)],
    [Profession.Leader, this.workLeader.bind(this)]
  ]);

  constructor(coordinates: CellCoordinates) {
    this.pos = coordinates;
    this.id = "r" + coordinates.row + "c" + coordinates.col;
    this.type = this.setRandomLandType();

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
      this.listOfResidents.push(new Person(this.decideProfession(i), this));
    }
    console.log(this.listOfResidents);
  }

  decideProfession(index: number): Profession {
    if (this.listOfResidents.length === 0)
      return Profession.Leader;

    const professionRaffle =
      new WeightedRandom<Profession>(Global.randomSeed + this.id + index);

    switch (this.type) {
      case LandType.Field:
        professionRaffle.addEntry(Profession.Farmer, 0.7);
        professionRaffle.addEntry(Profession.Craftsman, 0.2);
        professionRaffle.addEntry(Profession.Trader, 0.1);
        break;
      case LandType.Forest:
        professionRaffle.addEntry(Profession.Lumberman, 0.4);
        professionRaffle.addEntry(Profession.Hunter, 0.4);
        professionRaffle.addEntry(Profession.Craftsman, 0.1);
        professionRaffle.addEntry(Profession.Trader, 0.1);
        break;
      case LandType.Mountain:
        professionRaffle.addEntry(Profession.Miner, 0.6);
        professionRaffle.addEntry(Profession.Craftsman, 0.2);
        professionRaffle.addEntry(Profession.Trader, 0.2);
        break;
      default:
        console.warn('Undefined LandType at decideProfession().')
    }

    const profession = professionRaffle.drawRandom();

    if (profession !== undefined)
      return profession;
    else
      console.warn('professionRaffle was unsuccessful at decideProfession(), Trader was assinged by default.')

    return Profession.Trader;
  }

  setRandomLandType(): LandType {
    const rng = seedrandom(Global.randomSeed + this.id);
    const numberOfLandTypes = Object.keys(LandType).length / 2;

    return Math.floor(rng() * numberOfLandTypes);
  }

  updateCell(this: Cell): void {
    this.moneyEfficiency = 0;
    this.industryEfficiency = 0;
    this.agricultureEfficiency = 0;
    this.populationGrowth = 0;
    this.population += this.populationGrowth;

    // Calculate productivity from each Person
    Object.keys(this.productivity).forEach(k => this.productivity[k] = 0);
    this.listOfResidents.forEach(person => {
      const action = this.ActionMap.get(person.profession);
      if (action !== undefined) action(person.nextRound());
    });

    // Calculate production capacity
    this.productionCapacity.ore = this.buildings.mines;
    this.productionCapacity.craft = this.buildings.workshops;
    this.productionCapacity.food = this.buildings.farms + this.buildings.hunterCamps;
    this.productionCapacity.wood = this.buildings.lumberCamps;

    // Calculate production from productivity and capacity
    this.production.ore = this.calculateProduction(this.productivity.ore, this.productionCapacity.ore);
    this.production.craft = this.calculateProduction(this.productivity.craft, this.productionCapacity.craft);
    this.production.food = this.calculateProduction(this.productivity.food, this.productionCapacity.food);
    this.production.wood = this.calculateProduction(this.productivity.wood, this.productionCapacity.wood);
  }

  workFarmer(production: number) { this.productivity.food += production; };
  workLumber(production: number) { this.productivity.wood += production; };
  workHunter(production: number) { this.productivity.food += production; };
  workMiner(production: number) { this.productivity.ore += production; };
  workCraftsman(production: number) { this.productivity.craft += production; };
  workTrader() { };//TODO: Trading
  workLeader() { };//TODO: Leading

  calculateProduction(productivity: number, capacity: number): number {
    return Math.min(productivity / 100, capacity);
  };

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

interface Production {
  ore: number;
  craft: number;
  food: number;
  wood: number;
  [key: string]: number;
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

interface Buildings {
  houses: number;
  farms: number;
  hunterCamps: number;
  lumberCamps: number;
  mines: number;
  workshops: number;
}
