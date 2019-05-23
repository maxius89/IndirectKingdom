import Kingdom from './kingdom';
import Person, { Profession } from './person';
import { g as Global } from './script';
import * as seedrandom from 'seedrandom';
import WeightedRandom from './util/weightedRandom';
import { BuildingCost, BuildingType, Cost, UnderConstruction } from './building';

export default class Cell {
  static counter = 0;

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
    workshops: 1,
    storages: {
      ore: 0,
      craft: 1,
      food: 0,
      wood: 0
    }
  };

  buildingUnderConstruction: UnderConstruction;

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
    this.buildingUnderConstruction = new UnderConstruction(this.id);
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
        professionRaffle.addEntry(Profession.Craftsman, 0.8);
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

  doSettlementProduction(this: Cell): void {
    this.updateProductionCapacity();
    this.resetProductivity();
    this.doResidentsAction();
    this.updateStorages();
  };

  updateProductionCapacity(): void {
    this.productionCapacity.ore = this.buildings.mines;
    this.productionCapacity.craft = this.buildings.workshops;
    this.productionCapacity.food = this.buildings.farms + this.buildings.hunterCamps;
    this.productionCapacity.wood = this.buildings.lumberCamps;
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

  construct(this: Cell): void {
    console.log(this);
    // remove resources from storages, finish building if cost is payed
    const cost = this.buildingUnderConstruction.build(this.storage);
    Object.keys(this.storage).forEach(k => {
      if (cost[k] === undefined) cost[k] = 0;
      this.storage[k] -= cost[k]
    });

  };

  decideNextBuilding(): void { //TODO
    if (!this.buildingUnderConstruction.type) {
      this.buildingUnderConstruction.type = BuildingType.House;
      this.buildingUnderConstruction.remainingCost = BuildingCost.House;
    }
  };

  nextRound(this: Cell): void {
    //  console.log(Cell.counter++)
    this.doSettlementProduction();

    //if (this.id === "r0c0") {

    console.group();
    console.log(this.id + " " + this.buildingUnderConstruction.remainingCost.craft)

    this.construct();

    console.log(this.id + " " + this.buildingUnderConstruction.remainingCost.craft)
    console.groupEnd();
    //}

  };

  workFarmer(production: number) { this.productivity.food += production; };
  workLumber(production: number) { this.productivity.wood += production; };
  workHunter(production: number) { this.productivity.food += production; };
  workMiner(production: number) { this.productivity.ore += production; };
  workCraftsman(production: number) { this.productivity.craft += production; };
  workTrader() { };//TODO: Trading
  workLeader() { this.decideNextBuilding(); };//TODO: Leading

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
