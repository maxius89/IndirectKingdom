import Cell from './cell';

export default class Person {

  id: string;
  name: string;
  age: number;
  profession: Profession;
  home: Cell;
  stats: {};
}


enum Profession {
  Farmer,
  Hunter,
  Miner,
  Craftsman,
  Trader,
  Leader
}
