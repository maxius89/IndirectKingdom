
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
