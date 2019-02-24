import Kingdom from './kingdom';
import g from './script';

export default class Cell {

  id : string;
  owner: Kingdom;
  output: any;

  moneyEfficiency: number;
  industryEfficiency: number;
  agricultureEfficiency: number;
  populationGrowth: number;

  wealth: number;
  industry: number;
  agriculture: number;
  population: number;

  baseEfficiency: {};

  constructor(id: string, type: string, owner: Kingdom) {
    this.id = id;
    this.owner = owner;

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

    switch (type) {
  		case g.m.cellTypeList[g.LandType.Farm]:
  			this.wealth = 5;
  		  this.industry = 0;
  		  this.agriculture = 100;
  		  this.population = 10;
  			break;
  		case g.m.cellTypeList[g.LandType.Settlement]:
  			this.wealth = 50;
  			this.industry = 25;
  			this.agriculture = 0;
  			this.population = 100;
  			break;
  		case g.m.cellTypeList[g.LandType.Forest]:
  			this.wealth = 20;
  			this.industry = 25;
  			this.agriculture = 20;
  			this.population = 5;
  			break;
  		case g.m.cellTypeList[g.LandType.Mountain]:
  			this.wealth = 50;
  			this.industry = 100;
  			this.agriculture = 0;
  			this.population = 5;
        break;
      default:
        console.warn("Cell type not defined!");
      }
   }

  clearPreviousOwnership = function() {
    this.owner.loseTerritory(this);
  }

  updateCell = function() {
    var populationPower = this.population; // TODO: Get a function with diminishing return;
    var excessFood = this.agriculture - this.population;

    this.moneyEfficiency = this.baseEfficiency.money * populationPower;
    this.industryEfficiency = this.baseEfficiency.goods * populationPower;
    this.agricultureEfficiency = this.baseEfficiency.food * populationPower;
    this.populationGrowth = this.baseEfficiency.people * populationPower * excessFood;

    this.population += this.populationGrowth;

  }

  generateOutput = function() {
    this.output.money = this.wealth * this.moneyEfficiency;
    this.output.goods = this.industry * this.industryEfficiency;
    this.output.food = this.agriculture * this.agricultureEfficiency;

    return this.output;
  }

  tick = function() {
    this.updateCell();

    Object.keys(this.output).map(function(i){
     this.owner.income[i] += this.generateOutput()[i];
   },this);

  }

}
