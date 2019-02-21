var Kingdom = /** @class */ (function () {
    function Kingdom(name, color, cells) {
        this.cells = [];
        this.updateCellsList = function () {
            var _this = this;
            this.cells = g.m.listOfCells.filter(function (cell) { return cell.owner.name === _this.name; });
        };
        this.setTerritoryStatus = function () {
            this.cells.forEach(function (cell) {
                cell.owner = this;
            }, this);
        };
        this.claimTerritory = function (inputCell) {
            if (!this.cells.includes(inputCell)) {
                this.cells.push(inputCell);
                inputCell.clearPreviousOwnership();
                this.setTerritoryStatus();
            }
        };
        this.loseTerritory = function (cell) {
            this.cells.splice(this.cells.indexOf(cell), 1);
            cell.owner = listOfKingdoms[listOfKingdoms.length - 1]; // unclaimed
        };
        this.findNeighbourCells = function () {
            var neighbours = [];
            this.cells.forEach(function (cell) {
                neighbours = neighbours.concat(this.analizeNeighbours(cell));
            }, this);
            return neighbours;
        };
        this.analizeNeighbours = function (inputCell) {
            var outputList = [];
            var posRow = inputCell.id.indexOf("r");
            var posCol = inputCell.id.indexOf("c");
            var rowNum = Number(inputCell.id.slice(posRow + 1, posCol));
            var colNum = Number(inputCell.id.slice(posCol + 1));
            var checkedID;
            var targetCell;
            var checkedStatus;
            if (rowNum > 0) {
                checkedID = "r" + (rowNum - 1) + "c" + colNum;
                targetCell = this.checkTargetCellOwner(checkedID, inputCell);
                if (targetCell != null) {
                    outputList.push(targetCell);
                }
            }
            if (rowNum < g.sceneRows - 1) {
                checkedID = "r" + (rowNum + 1) + "c" + colNum;
                targetCell = this.checkTargetCellOwner(checkedID, inputCell);
                if (targetCell != null) {
                    outputList.push(targetCell);
                }
            }
            if (colNum > 0) {
                checkedID = "r" + rowNum + "c" + (colNum - 1);
                targetCell = this.checkTargetCellOwner(checkedID, inputCell);
                if (targetCell != null) {
                    outputList.push(targetCell);
                }
            }
            if (colNum < g.sceneCols - 1) {
                checkedID = "r" + rowNum + "c" + (colNum + 1);
                targetCell = this.checkTargetCellOwner(checkedID, inputCell);
                if (targetCell != null) {
                    outputList.push(targetCell);
                }
            }
            return outputList;
        };
        this.checkTargetCellOwner = function (checkedId, inputCell) {
            var targetCell = g.m.listOfCells.find(function (cell) {
                return cell.id === checkedId;
            });
            if (targetCell.owner.name != inputCell.owner.name) {
                return targetCell;
            }
            else {
                return null;
            }
        };
        this.init = function () {
            this.setTerritoryStatus();
            this.updateCellsList();
            this.calculateEconomy();
        };
        this.calculateEconomy = function () {
            var _this = this;
            Object.keys(this.econ).forEach(function (i) { return _this.econ[i] = 0; });
            this.cells.forEach(function (currentCell) {
                this.econ.wealth += currentCell.wealth;
                this.econ.industry += currentCell.industry;
                this.econ.agriculture += currentCell.agriculture;
                this.econ.population += currentCell.population;
            }, this);
        };
        this.name = name;
        this.color = color;
        this.cells = [];
        this.highlighted = false;
        this.econ = {
            wealth: 0,
            industry: 0,
            agriculture: 0,
            population: 0
        };
        this.income = {
            money: 0,
            goods: 0,
            food: 0
        };
        cells.forEach(function (cell) {
            var currentCell = g.m.listOfCells.find(function (element) {
                return element.id === cell;
            });
            this.cells.push(currentCell);
            currentCell.owner = this;
        }, this);
    }
    return Kingdom;
}());
