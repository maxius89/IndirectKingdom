import Kingdom from './kingdom';
import Person, { Profession } from './person';
import { g as Global } from './script';
import * as seedrandom from 'seedrandom';
import WeightedRandom from './util/weightedRandom';

export default class Cell {

  id: string;
  owner: Kingdom;
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
    mines: 0,
    workshops: 0,
    storages: {
      ore: 0,
      craft: 0,
      food: 0,
      wood: 0
    }
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

  storage: Production = {
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
  };

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
    };

    const profession = professionRaffle.drawRandom();

    if (profession !== undefined)
      return profession;
    else
      console.warn('professionRaffle was unsuccessful at decideProfession(), Trader was assinged by default.')

    return Profession.Trader;
  };

  setRandomLandType(): LandType {
    const rng = seedrandom(Global.randomSeed + this.id);
    const numberOfLandTypes = Object.keys(LandType).length / 2;

    return Math.floor(rng() * numberOfLandTypes);
  };

  updateSettlement(this: Cell): void {
    this.updateProductionCapacity();
    this.resetProductivity();
    this.doResidentsAction();
    this.updateStorages();
  };

  resetProductivity(): void {
    Object.keys(this.productivity).forEach(k => this.productivity[k] = 0)
  };

  doResidentsAction(): void {
    this.listOfResidents.forEach(person => {
      const action = this.ActionMap.get(person.profession);
      if (action !== undefined) action(person.nextRound());
    });
  };

  updateStorages(): void {
    Object.keys(this.storage).forEach(k => {
      const spaceInStorage = this.buildings.storages[k] - this.storage[k];

      this.storage[k] += this.calculateProduction(
        this.productivity[k], this.productionCapacity[k], spaceInStorage
      );
    });
  };


  calculateProduction(productivity: number, capacity: number, availableSpace: number): number {
    return Math.min(productivity, capacity, availableSpace);
  };

  updateProductionCapacity(): void {
    this.productionCapacity.ore = this.buildings.mines;
    this.productionCapacity.craft = this.buildings.workshops;
    this.productionCapacity.food = this.buildings.farms + this.buildings.hunterCamps;
    this.productionCapacity.wood = this.buildings.lumberCamps;
  };

  nextRound(this: Cell): void {
    this.updateSettlement();
  };

  workFarmer(production: number) { this.productivity.food += production; };
  workLumber(production: number) { this.productivity.wood += production; };
  workHunter(production: number) { this.productivity.food += production; };
  workMiner(production: number) { this.productivity.ore += production; };
  workCraftsman(production: number) { this.productivity.craft += production; };
  workTrader() { };//TODO: Trading
  workLeader() { };//TODO: Leading

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

interface Buildings {
  houses: number;
  farms: number;
  hunterCamps: number;
  lumberCamps: number;
  mines: number;
  workshops: number;
  storages: Production;
}
