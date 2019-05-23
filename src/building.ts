
export const BuildingCost = {
  House: {
    ore: 0,
    craft: 5,
    wood: 10
  },
  Farm: {
    ore: 0,
    craft: 3,
    wood: 3
  },
  HunterCamp: {
    ore: 1,
    craft: 3,
    wood: 2
  },
  LumberCamp: {
    ore: 2,
    craft: 5,
    wood: 4
  },
  Mine: {
    ore: 5,
    craft: 15,
    wood: 5
  },
  Workshop: {
    ore: 10,
    craft: 15,
    wood: 10
  },
  Storage: {
    ore: 0,
    craft: 5,
    wood: 6
  }
};

export enum BuildingType {
  House,
  Farm,
  HunterCamp,
  LumberCamp,
  Mine,
  Workshop,
  Storage
}

export interface Cost {
  ore: number;
  craft: number;
  wood: number;
  [key: string]: number;
}

export class UnderConstruction {
  type: BuildingType | undefined;
  remainingCost: Cost;
  id: string;

  constructor(id: string) {
    this.type = undefined;
    this.remainingCost = {
      ore: 0,
      craft: 0,
      wood: 0
    }
    this.id = id;
  };

  build(resource: Cost): Cost {
    let cost: Cost = { ore: 0, craft: 0, wood: 0 };

    Object.keys(this.remainingCost).forEach(k => {
      cost[k] = Math.min(this.remainingCost[k], resource[k]);
      this.remainingCost[k] -= cost[k];
    });

    return cost;
  }

  checkReady(): boolean {
    const remainingTotalCost = Object.values(this.remainingCost).reduce((acc, k) => acc + k);

    return remainingTotalCost === 0 ? true : false;
  }


};
