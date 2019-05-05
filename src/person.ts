import Cell from './cell';

export default class Person {

  id: string;
  name: string;
  age: number;
  profession: Profession;
  home: Cell;
  stats: {};

  constructor(profession: Profession) {
    this.profession = profession;
  }


}


export enum Profession {
  Farmer,
  Lumberman,
  Hunter,
  Miner,
  Craftsman,
  Trader,
  Leader
}
