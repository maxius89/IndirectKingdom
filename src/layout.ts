import { g as global } from './script';
import Cell from './cell';
import World from './world';
import { LandType } from './cell';
import { runGame, showPopulation } from './script';

export default class Layout {

  static wWidth: number;  // Window Width
  static wHeight: number; // Window Height
  static wOrientation: Orientation; // Window Orientation
  static wShort: number; // Window Short size
  static wLong: number; // Window Long size

  static mWidth: number; // Map Width
  static mHeight: number; // Map Height
  static mUpscaled: boolean; // Map Upscaled
  static mDownscaled: boolean; // Map Downscaled
  static mActualCellSize = 30; // Actual Cell size

  static dThickness: number; // Dashboard Thickness
  static dLength: number;  // Dashboard Length
  static dDisabled: boolean; // Dashboard Disabled

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

  static initLayout(): void {

    Layout.wWidth = $(window).width();
    Layout.wHeight = $(window).height();

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

  static drawLayout(): void {
    var mapDiv = $(document.createElement('div'));
    var dashDiv = $(document.createElement('div'));

    $("body").append(mapDiv);
    $("body").append(dashDiv);

    mapDiv.attr("id", "mapDiv");
    dashDiv.attr("id", "dashDiv");

    $("#mapDiv").css("overflow-x", "scroll");
    $("#mapDiv").css("overflow-y", "scroll");
  }

  static addButton(buttonFunction: Function, buttonText: string): void {
    var button = $("<button>").text(buttonText);
    button.click((evt) => buttonFunction(evt));
    $("#dashDiv").append(button);
  }

  static addInfoPanel(): void {
    var infoPanel = $(document.createElement('div'));
    $("#dashDiv").append(infoPanel);
    infoPanel.attr("id", "infoPanel");
    infoPanel.css("width", Layout.dThickness + "px");
    infoPanel.css("height", Layout.dLength / 2 + "px");
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

  static createMap(width: number, height: number): JQuery {
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
        newCol.attr("highlighted", "false");
        newCol.attr("type", "none");
        newCol.html("&nbsp;");

        var cellType = World.map[i][j].type;
        newCol.attr("type", LandType[cellType]);
        this.showCellIcon(newCol, cellType);
      }
    }

    return table;
  }

  static showCellIcon(cell: JQuery, type: LandType): void {
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

  static updateMap(map: Cell[]): void {
    map.forEach(function(cell) {
      $("#" + cell.id).attr("status", cell.owner.name);
      $("#" + cell.id).css("background-color", cell.owner.color);
    });
  }

  static rethinkPanels(): void {
    Layout.wWidth = $(window).width();
    Layout.wHeight = $(window).height();

    this.decideWindowOrientation();
    this.calcDashboardSize();
    this.calcMapSize();
    this.calcCellSize();
    this.updateLayout();
  }

  static decideWindowOrientation(): void {
    Layout.wOrientation = (Layout.wWidth > Layout.wHeight ?
      Orientation.Landscape : Orientation.Portrait);
    if (Layout.wOrientation === Orientation.Portrait) {
      Layout.wShort = Layout.wWidth;
      Layout.wLong = Layout.wHeight;
    }
    else {
      Layout.wShort = Layout.wHeight;
      Layout.wLong = Layout.wWidth;
    }
  }

  static calcDashboardSize(): void {
    if (Layout.wLong < Layout.minThickness * Layout.minDashboardThickessRatio) {
      Layout.dLength = 0;
      Layout.dThickness = 0;
      Layout.dDisabled = true;
    }
    else {
      Layout.dLength = Layout.wShort;
      Layout.dThickness = Math.floor(Layout.dLength * Layout.thicknessRatio);
      Layout.dThickness = Math.max(Layout.dThickness, Layout.minThickness);
      Layout.dThickness = Math.min(Layout.dThickness, Layout.maxThickness);
      Layout.dDisabled = false;
    }
  }

  static calcMapSize(): void {
    Layout.mWidth = Layout.wWidth;
    Layout.mHeight = Layout.wHeight;

    if (Layout.wOrientation == Orientation.Landscape) {
      Layout.mWidth -= Layout.dThickness;
    }
    else {
      Layout.mHeight -= Layout.dThickness;
    }
  }

  static calcCellNum(): void {
    Layout.mUpscaled = this.upscaleCells();
    if (Layout.mUpscaled) return;

    Layout.mDownscaled = this.makeCellsFit();
  }

  static calcCellSize(): void {
    this.calcCellNum();
    this.resizeCells();
  }

  static updateLayout(): void {
    $("#mapDiv").css("width", Layout.mWidth + "px");
    $("#mapDiv").css("height", Layout.mHeight + "px");
    $("#map").css("width", Layout.mActualCellSize * Layout.sceneCols + "px");

    if (Layout.wOrientation == Orientation.Landscape) {
      $("#dashDiv").css("width", Layout.dThickness + "px");
      $("#dashDiv").css("height", Layout.dLength + "px");

      $("#dashDiv").css("top", "0px");
      $("#dashDiv").css("left", Layout.mWidth + "px");
    }
    else {
      $("#dashDiv").css("width", Layout.dLength + "px");
      $("#dashDiv").css("height", Layout.dThickness + "px");

      $("#dashDiv").css("top", Layout.mHeight + "px");
      $("#dashDiv").css("left", "0px");
    }
  }

  static upscaleCells(): boolean {
    var verticalMapSize = Layout.sceneRows * Layout.mActualCellSize;
    if (Layout.mWidth < verticalMapSize) return false;

    var horizontalMapSize = Layout.sceneCols * Layout.mActualCellSize;
    if (Layout.mHeight < horizontalMapSize) return false;

    var verticalScale = Layout.mWidth / verticalMapSize;
    var horizontalScale = Layout.mHeight / horizontalMapSize;
    var scale = Math.min(verticalScale, horizontalScale);
    Layout.mActualCellSize = Math.floor(Layout.mActualCellSize * scale);

    return true;
  }

  static makeCellsFit(): boolean {
    var minMapSize = Layout.minDrawnCells * Layout.mActualCellSize;
    if (Layout.mWidth >= minMapSize && Layout.mHeight >= minMapSize) return false;

    var verticalScale = Layout.mWidth / minMapSize;
    var horizontalScale = Layout.mHeight / minMapSize;
    var scale = Math.min(verticalScale, horizontalScale);
    Layout.mActualCellSize = Math.floor(Layout.mActualCellSize * scale);

    return true;
  }

  static resizeCells(): void {
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

  static zoom(event: MouseWheelEvent): void {
    if (event.ctrlKey === true) {
      event.preventDefault();

      if (event.deltaY < 0) {
        Layout.mActualCellSize += Layout.stepCellSize;
      }
      else {
        Layout.mActualCellSize -= Layout.stepCellSize;
      }

      Layout.resizeCells();
      $("#map").css("width", Layout.mActualCellSize * Layout.sceneCols + "px");
      $("#map").css("height", Layout.mActualCellSize * Layout.sceneRows + "px");
    }
  }


  static clicked(): void {
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


  static writeToInfoPanel(): void {
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
