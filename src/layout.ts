import g from "./script";

export default class Layout {

  wWidth: number;  // Window Width
  wHeight: number; // Window Height
  wOrientation: Orientation; // Window Orientation
  wShort: number; // Window Short size
  wLong: number; // Window Long size

  mWidth: number; // Map Width
  mHeight: number; // Map Height
  mUpscaled: boolean; // Map Upscaled
  mDownscaled: boolean; // Map Downscaled
  mActualCellSize = 30; // Actual Cell size

  dThickness: number; // Dashboard Thickness
  dLength: number;  // Dashboard Length
  dDisabled: boolean; // Dashboard Disabled

  borderRatio = 0.02;              // Cell-size/border thickness ratio
  minCellSize = 20; 		// px      // Minimum size of the drawn cells
  maxCellSize = 100; 		// px      // Maximum size of the drawn cells
  stepCellSize = 5; 		// px      // Cell-size increment/decrement constant
  minDrawnCells = 3;               // Minimum number of drawn cells

  sceneRows = 25;                    // Number of the rows of the Map
  sceneCols = 25;                    // Number of the coloumns of the Map

  thicknessRatio = 0.2;
  minThickness = 200;   // px      // Dashboard thickness minimum
  maxThickness = 400;   // px      // Dashboard thickness maximum
  minDashboardThickessRatio = 2;   // Dashboard thickness/window shorter size minimum ratio

	/*constructor(name: string, color: string, cells: string[]) {

	}*/

  initLayout() {
    this.wWidth = $(window).width();
    this.wHeight = $(window).height();

    this.drawLayout();
    $("#mapDiv").append(this.createMap(this.sceneCols, this.sceneRows));

    $("#mapDiv").css("background-color", "#00ff00");  // Test color
    $("#dashDiv").css("background-color", "#ff00ff"); // Test color

    $("#mapDiv").css("position", "absolute");
    $("#mapDiv").css("top", "0px");
    $("#mapDiv").css("left", "0px");
    $("#dashDiv").css("position", "absolute");

    this.rethinkPanels();
    this.addButtons();
    this.addInfoPanel();
  }

  drawLayout() {
    var mapDiv = $(document.createElement('div'));
    var dashDiv = $(document.createElement('div'));

    $("body").append(mapDiv);
    $("body").append(dashDiv);

    mapDiv.attr("id", "mapDiv");
    dashDiv.attr("id", "dashDiv");

    $("#mapDiv").css("overflow-x", "scroll");
    $("#mapDiv").css("overflow-y", "scroll");
  }

  addButtons() {
    var startButton = $("<button>").text("Start / Stop");
    //		startButton.click(runGame);
    $("#dashDiv").append(startButton);

    var populationButton = $("<button>").text("Show Population");
    //		populationButton.click(showPopulation);
    $("#dashDiv").append(populationButton);
  }

  addInfoPanel() {
    var infoPanel = $(document.createElement('div'));
    $("#dashDiv").append(infoPanel);
    infoPanel.attr("id", "infoPanel");
    infoPanel.css("width", this.dThickness + "px");
    infoPanel.css("height", this.dLength / 2 + "px");
    infoPanel.css("background-color", "#ffffff");
    //infoPanel.html("infoPanel initialized.");

    var infoWealth = $(document.createElement("div"));
    infoWealth.attr("id", "infoWealth");
    infoPanel.append(infoWealth);

    var infoIndustry = $(document.createElement("div"));
    infoIndustry.attr("id", "infoIndustry");
    infoPanel.append(infoIndustry);

    var infoAgriculture = $(document.createElement("div"));
    infoAgriculture.attr("id", "infoAgriculture");
    infoPanel.append(infoAgriculture);

    var infoPopulation = $(document.createElement("div"));
    infoPopulation.attr("id", "infoPopulation");
    infoPanel.append(infoPopulation);

  }

  createMap(width: number, height: number) {
    var table = $(document.createElement('table'));
    table.attr("id", "map");
    var tbody = $(document.createElement('tbody'));
    table.append(tbody);

    for (var i = 0; i < height; ++i) {
      var newRow = $(document.createElement("tr"));
      table.append(newRow);

      for (var j = 0; j < width; ++j) {
        var newCol = $(document.createElement("td"));
        newRow.append(newCol);
        newCol.addClass("cell");
        newCol.attr("id", "r" + i + "c" + j);
        newCol.attr("status", "unclaimed");
        newCol.attr("type", "none");
        newCol.html("&nbsp;");

        //				initCell(newCol);
      }
    }

    return table;
  }

  updateMap() {
    /*	g.m.listOfCells.forEach(function(cell) {
        $("#" + cell.id).attr("status",cell.owner.name);
        $("#" + cell.id).css("background-color",cell.owner.color);
      });*/
  }

  rethinkPanels() {
    this.wWidth = $(window).width();
    this.wHeight = $(window).height();

    this.decideWindowOrientation();
    this.calcDashboardSize();
    this.calcMapSize();
    this.calcCellSize();
    this.updateLayout();

    console.log(g);
  }

  decideWindowOrientation() {
    this.wOrientation = (this.wWidth > this.wHeight ?
      Orientation.Landscape : Orientation.Portrait);
    if (this.wOrientation === Orientation.Portrait) {
      this.wShort = this.wWidth;
      this.wLong = this.wHeight;
    }
    else {
      this.wShort = this.wHeight;
      this.wLong = this.wWidth;
    }
  }

  calcDashboardSize() {
    if (this.wLong < this.minThickness * this.minDashboardThickessRatio) {
      this.dLength = 0;
      this.dThickness = 0;
      this.dDisabled = true;
    }
    else {
      this.dLength = this.wShort;
      this.dThickness = Math.floor(this.dLength * this.thicknessRatio);
      this.dThickness = Math.max(this.dThickness, this.minThickness);
      this.dThickness = Math.min(this.dThickness, this.maxThickness);
      this.dDisabled = false;
    }
  }

  calcMapSize() {
    this.mWidth = this.wWidth;
    this.mHeight = this.wHeight;

    if (this.wOrientation == Orientation.Landscape) {
      this.mWidth -= this.dThickness;
    }
    else {
      this.mHeight -= this.dThickness;
    }
  }

  calcCellNum() {
    this.mUpscaled = this.upscaleCells();
    if (this.mUpscaled) return;

    this.mDownscaled = this.makeCellsFit();
  }

  calcCellSize() {
    this.calcCellNum();
    this.resizeCells();
  }

  updateLayout() {
    $("#mapDiv").css("width", this.mWidth + "px");
    $("#mapDiv").css("height", this.mHeight + "px");
    $("#map").css("width", this.mActualCellSize * this.sceneCols + "px");

    if (this.wOrientation == Orientation.Landscape) {
      $("#dashDiv").css("width", this.dThickness + "px");
      $("#dashDiv").css("height", this.dLength + "px");

      $("#dashDiv").css("top", "0px");
      $("#dashDiv").css("left", this.mWidth + "px");
    }
    else {
      $("#dashDiv").css("width", this.dLength + "px");
      $("#dashDiv").css("height", this.dThickness + "px");

      $("#dashDiv").css("top", this.mHeight + "px");
      $("#dashDiv").css("left", "0px");
    }
  }

  upscaleCells() {
    var verticalMapSize = this.sceneRows * this.mActualCellSize;
    if (this.mWidth < verticalMapSize) return false;

    var horizontalMapSize = this.sceneCols * this.mActualCellSize;
    if (this.mHeight < horizontalMapSize) return false;

    var verticalScale = this.mWidth / verticalMapSize;
    var horizontalScale = this.mHeight / horizontalMapSize;
    var scale = Math.min(verticalScale, horizontalScale);
    this.mActualCellSize = Math.floor(this.mActualCellSize * scale);

    return true;
  }

  makeCellsFit() {
    var minMapSize = this.minDrawnCells * this.mActualCellSize;
    if (this.mWidth >= minMapSize && this.mHeight >= minMapSize) return false;

    var verticalScale = this.mWidth / minMapSize;
    var horizontalScale = this.mHeight / minMapSize;
    var scale = Math.min(verticalScale, horizontalScale);
    this.mActualCellSize = Math.floor(this.mActualCellSize * scale);

    return true;
  }

  resizeCells() {
    this.mActualCellSize = Math.max(this.mActualCellSize, this.minCellSize);
    this.mActualCellSize = Math.min(this.mActualCellSize, this.maxCellSize);

    $(".cell").css("height", this.mActualCellSize + "px");
    $(".cell").css("width", this.mActualCellSize + "px");

    var bordersize = Math.ceil(this.mActualCellSize * this.borderRatio);
    $(".cell").css("box-shadow", "inset " + bordersize + "px " + bordersize + "px #ffffff," +
      "inset -" + bordersize + "px -" + bordersize + "px #ffffff");

    $(".cellImg").css("height", this.mActualCellSize / 2 + "px");
    $(".cellImg").css("width", this.mActualCellSize / 2 + "px");
    $(".cellImg").css("top", this.mActualCellSize / 8 + "px");
    $(".cellImg").css("left", this.mActualCellSize / 8 + "px");
  }

  zoom(event) {
    if (event.ctrlKey === true) {
      event.preventDefault();

      if (event.deltaY < 0) {
        this.mActualCellSize += this.stepCellSize;
      }
      else {
        this.mActualCellSize -= this.stepCellSize;
      }

      this.resizeCells();
      $("#map").css("width", this.mActualCellSize * this.sceneCols + "px");
      $("#map").css("height", this.mActualCellSize * this.sceneRows + "px");
    }
  }

}

enum Orientation {
  Portrait,
  Landscape
}
