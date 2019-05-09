import Cell from './cell';

export default class Person {
  static counter = 0;

  id: number;
  name: string;
  age: number;
  profession: Profession;
  home: Cell;
  stats: Stats;

  constructor(profession: Profession, home: Cell) {
    this.profession = profession;
    this.home = home;
    this.age = 0;
    this.id = Person.counter++;
    this.name = this.generateName();
    this.stats = { efficiency: 100 };
  }

  generateName(): string {  // TODO
    return "";
  };

  nextRound(): number {
    ++this.age;
    this.consume();
    return this.work();
  };

  work(): number {
    return this.stats.efficiency;
  };

  consume(): void {
    //    if (this.home.foodStorage > 0)
    //      this.home.foodStorage--;
    //    else
    //      this.stats.efficiency--;
  };

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

interface Stats {
  efficiency: number;
}
