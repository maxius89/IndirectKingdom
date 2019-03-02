import { g as global } from './script';
import Cell from './cell';
import World from './world';
import { LandType } from './cell';
import { runGame, showPopulation } from './script';

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
  static mActualCellSize = 30; // Actual Cell size

  dThickness: number; // Dashboard Thickness
  dLength: number;  // Dashboard Length
  dDisabled: boolean; // Dashboard Disabled

  static readonly borderRatio = 0.02;              // Cell-size/border thickness ratio
  static readonly minCellSize = 20; 		// px      // Minimum size of the drawn cells
  static readonly maxCellSize = 100; 		// px      // Maximum size of the drawn cells
  static readonly stepCellSize = 5; 		// px      // Cell-size increment/decrement constant
  static readonly minDrawnCells = 3;               // Minimum number of drawn cells

  static readonly sceneRows = 25;                  // Number of the rows of the Map
  static readonly sceneCols = 25;                  // Number of the coloumns of the Map

  static readonly thicknessRatio = 0.2;
  static readonly minThickness = 200;   // px      // Dashboard thickness minimum
  static readonly maxThickness = 400;   // px      // Dashboard thickness maximum
  static readonly minDashboardThickessRatio = 2;   // Dashboard thickness/window shorter size minimum ratio

  initLayout(): void {

    this.wWidth = $(window).width();
    this.wHeight = $(window).height();

    this.drawLayout();
    let newMap = this.createMap(Layout.sceneCols, Layout.sceneRows);
    $("#mapDiv").append(newMap);

    $("#mapDiv").css("background-color", "#00ff00");  // Test color
    $("#dashDiv").css("background-color", "#ff00ff"); // Test color

    $("#mapDiv").css("position", "absolute");
    $("#mapDiv").css("top", "0px");
    $("#mapDiv").css("left", "0px");
    $("#dashDiv").css("position", "absolute");

    this.rethinkPanels();
    this.addButton(runGame, 'Start / Stop');
    this.addButton(showPopulation, 'Show Population');
    this.addInfoPanel();

    this.updateMap(World.listOfCells);
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

  addButton(buttonFunction: Function, buttonText: string) {
    var button = $("<button>").text(buttonText);
    button.click((evt) => buttonFunction(evt));
    $("#dashDiv").append(button);
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

  createMap(width: number, height: number): JQuery {
    var table = $(document.createElement('table'));
    table.attr("id", "map");
    var tbody = $(document.createElement('tbody'));
    table.append(tbody);

    var newListOfCells: Cell[] = [];

    for (var i = 0; i < height; ++i) {
      var newRow = $(document.createElement("tr"));
      table.append(newRow);

      for (var j = 0; j < width; ++j) {
        var newCol = $(document.createElement("td"));
        newRow.append(newCol);
        newCol.addClass("cell");
        newCol.attr("id", "r" + i + "c" + j);
        newCol.attr("status", "unclaimed");
        newCol.attr("highlighted", "false");
        newCol.attr("type", "none");
        newCol.html("&nbsp;");

        var newCell = Cell.initCell({ row: i, col: j });

        newCol.attr("type", LandType[newCell.type]);

        newListOfCells.push(newCell);
        this.showCellIcon(newCol, newCell.type);
      }
    }

    return table;
  }

  showCellIcon(cell: JQuery, type: LandType): void {
    var img = $(document.createElement("img"));
    cell.append(img);

    img.addClass("cellImg");
    img.css("height", Layout.mActualCellSize / 2 + "px");
    img.css("width", Layout.mActualCellSize / 2 + "px");
    img.css("top", Layout.mActualCellSize / 8 + "px");
    img.css("left", Layout.mActualCellSize / 8 + "px");

    switch (type) {
      case LandType.Farm:
        img.attr("src", "img/farm.svg");
        break;
      case LandType.Settlement:
        img.attr("src", "img/settlement.svg");
        break;
      case LandType.Forest:
        img.attr("src", "img/forest.svg");
        break;
      case LandType.Mountain:
        img.attr("src", "img/mountain.svg");
        break;
      default:
      //TODO: create Unknown cell-type svg.
    }
  }

  updateMap(map: Cell[]) {
    map.forEach(function(cell) {
      $("#" + cell.id).attr("status", cell.owner.name);
      $("#" + cell.id).css("background-color", cell.owner.color);
    });
  }

  rethinkPanels() {
    this.wWidth = $(window).width();
    this.wHeight = $(window).height();

    this.decideWindowOrientation();
    this.calcDashboardSize();
    this.calcMapSize();
    this.calcCellSize();
    this.updateLayout();
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
    if (this.wLong < Layout.minThickness * Layout.minDashboardThickessRatio) {
      this.dLength = 0;
      this.dThickness = 0;
      this.dDisabled = true;
    }
    else {
      this.dLength = this.wShort;
      this.dThickness = Math.floor(this.dLength * Layout.thicknessRatio);
      this.dThickness = Math.max(this.dThickness, Layout.minThickness);
      this.dThickness = Math.min(this.dThickness, Layout.maxThickness);
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
    $("#map").css("width", Layout.mActualCellSize * Layout.sceneCols + "px");

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
    var verticalMapSize = Layout.sceneRows * Layout.mActualCellSize;
    if (this.mWidth < verticalMapSize) return false;

    var horizontalMapSize = Layout.sceneCols * Layout.mActualCellSize;
    if (this.mHeight < horizontalMapSize) return false;

    var verticalScale = this.mWidth / verticalMapSize;
    var horizontalScale = this.mHeight / horizontalMapSize;
    var scale = Math.min(verticalScale, horizontalScale);
    Layout.mActualCellSize = Math.floor(Layout.mActualCellSize * scale);

    return true;
  }

  makeCellsFit() {
    var minMapSize = Layout.minDrawnCells * Layout.mActualCellSize;
    if (this.mWidth >= minMapSize && this.mHeight >= minMapSize) return false;

    var verticalScale = this.mWidth / minMapSize;
    var horizontalScale = this.mHeight / minMapSize;
    var scale = Math.min(verticalScale, horizontalScale);
    Layout.mActualCellSize = Math.floor(Layout.mActualCellSize * scale);

    return true;
  }

  resizeCells() {
    Layout.mActualCellSize = Math.max(Layout.mActualCellSize, Layout.minCellSize);
    Layout.mActualCellSize = Math.min(Layout.mActualCellSize, Layout.maxCellSize);

    $(".cell").css("height", Layout.mActualCellSize + "px");
    $(".cell").css("width", Layout.mActualCellSize + "px");

    var bordersize = Math.ceil(Layout.mActualCellSize * Layout.borderRatio);
    $(".cell").css("box-shadow", "inset " + bordersize + "px " + bordersize + "px #ffffff," +
      "inset -" + bordersize + "px -" + bordersize + "px #ffffff");

    $(".cellImg").css("height", Layout.mActualCellSize / 2 + "px");
    $(".cellImg").css("width", Layout.mActualCellSize / 2 + "px");
    $(".cellImg").css("top", Layout.mActualCellSize / 8 + "px");
    $(".cellImg").css("left", Layout.mActualCellSize / 8 + "px");
  }

  zoom(event: MouseWheelEvent) {
    if (event.ctrlKey === true) {
      event.preventDefault();

      if (event.deltaY < 0) {
        Layout.mActualCellSize += Layout.stepCellSize;
      }
      else {
        Layout.mActualCellSize -= Layout.stepCellSize;
      }

      this.resizeCells();
      $("#map").css("width", Layout.mActualCellSize * Layout.sceneCols + "px");
      $("#map").css("height", Layout.mActualCellSize * Layout.sceneRows + "px");
    }
  }


  clicked(): void {
    var clickedCellKingdom = World.listOfKingdoms[global.kingdomNames.indexOf($(this).attr("status"))];

    for (var i = 0; i < World.listOfKingdoms.length; i++) {
      World.listOfKingdoms[i].highlighted = false;
    }

    if (global.highlightedKindom === clickedCellKingdom) {
      global.highlightedKindom = null;
    }
    else {
      World.listOfKingdoms[global.kingdomNames.indexOf($(this).attr("status"))].highlighted = true;
      global.highlightedKindom = clickedCellKingdom;
    }

    Layout.setHighlightedCells();
    Layout.writeToInfoPanel();
  }

  static setHighlightedCells(): void {
    World.listOfKingdoms.forEach(function(kingdom) {
      $(".cell[status = '" + kingdom.name + "']").attr("highlighted", String(kingdom.highlighted));
    });

    var clickedCells = $(".cell[highlighted = false]");
    var nonClickedCells = $(".cell[highlighted = true]");

    var clickedBorderSize = Math.ceil(Layout.mActualCellSize * Layout.borderRatio);
    var nonClickedBorderSize = Math.ceil(Layout.mActualCellSize * Layout.borderRatio) * 2;

    clickedCells.css("box-shadow", "inset " + clickedBorderSize + "px " + clickedBorderSize + "px #ffffff," +
      "inset -" + clickedBorderSize + "px -" + clickedBorderSize + "px #ffffff");

    nonClickedCells.css("box-shadow", "inset " + nonClickedBorderSize + "px " + nonClickedBorderSize + "px #dddd55," +
      "inset -" + nonClickedBorderSize + "px -" + nonClickedBorderSize + "px #dddd55");
  }


  static writeToInfoPanel() {
    var text1 = "&nbsp;";
    var text2 = "&nbsp;";
    var text3 = "&nbsp;";
    var text4 = "&nbsp;";
    if (global.highlightedKindom != null) {
      text1 = global.highlightedKindom.name + " wealth: " + global.highlightedKindom.econ.wealth;
      text2 = global.highlightedKindom.name + " industry: " + global.highlightedKindom.econ.industry;
      text3 = global.highlightedKindom.name + " agriculture: " + global.highlightedKindom.econ.agriculture;
      text4 = global.highlightedKindom.name + " population: " + global.highlightedKindom.econ.population;
    }
    else {
      text1 = text2 = text3 = text4 = "&nbsp;"
    }

    $("#infoWealth").html(text1);
    $("#infoIndustry").html(text2);
    $("#infoAgriculture").html(text3);
    $("#infoPopulation").html(text4);
  }

}

enum Orientation {
  Portrait,
  Landscape
}
