
class Cell {

  constructor(id, type, owner) {
    this.id = id;
    this.owner = owner

    switch (type) {
  		case g.m.cellTypeList[g.LandType.Farm]:
  			this.wealth = 5;
  		  this.industry = 0;
  		  this.food = 100;
  		  this.population = 10;
  			break;
  		case g.m.cellTypeList[g.LandType.Settlement]:
  			this.wealth = 50;
  			this.industry = 25;
  			this.food = 0;
  			this.population = 100;
  			break;
  		case g.m.cellTypeList[g.LandType.Forest]:
  			this.wealth = 20;
  			this.industry = 25;
  			this.food = 20;
  			this.population = 0;
  			break;
  		case g.m.cellTypeList[g.LandType.Mountain]:
  			this.wealth = 50;
  			this.industry = 100;
  			this.food = 0;
  			this.population = 0;
        break;
      default:
        console.warn("Cell type not defined!");
      }
   }

  clearPreviousOwnership = function() {
    this.owner.loseTerritory(this);
  }

}
