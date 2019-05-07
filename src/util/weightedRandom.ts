import * as seedrandom from 'seedrandom';

export default class weightedRandom<T> {

  keys: Array<T> = [];
  chances: number[] = [];
  seed: string;

  private readonly unsuccesfulWarning = 'drawRandom was unsuccessful.';

  constructor(seed: string = "") {
    this.seed = seed;
  }

  addEntry(key: T, chance: number): void {
    this.keys.push(key);
    this.chances.push(chance);
  };

  setSeed(seed: string): void { this.seed = seed; };

  drawRandom(): T | undefined {
    const chancesSum = this.chances.reduce((a, b) => a + b, 0);
    const rng = this.seed === "" ? seedrandom() : seedrandom(this.seed);
    const rand = rng() * chancesSum;

    let chanceSum = 0;
    for (let i = 0; i < this.chances.length; ++i) {
      chanceSum += this.chances[i];
      if (chanceSum >= rand) return this.keys[i];
    };

    console.warn(this.unsuccesfulWarning)
    return undefined;
  };


}
