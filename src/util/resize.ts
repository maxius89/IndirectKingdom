import {g} from '../script';

enum Orientation {
  Portrait,
  Landscape
}

export default class Resize {

  static wWidth: number;  // Window Width
  static wHeight: number; // Window Height
  static wOrientation: Orientation; // Window Orientation
  static wShort: number; // Window Short size
  static wLong: number; // Window Long size

  static mWidth: number; // Map Width
  static mHeight: number; // Map Height
  static mActualCellSize = 30; // Actual Cell size

  static dThickness: number; // Dashboard Thickness
  static dLength: number;  // Dashboard Length
  static dDisabled: boolean; // Dashboard Disabled
  static dWidth: number;  // Dashboard Width
  static dHeight: number; // Dashboard Height
  static dTop: number; // Dashboard distance from Top
  static dLeft: number; // Dashboard distance from Left

  static readonly borderRatio = 0.02;              // Cell-size/border thickness ratio
  static readonly minCellSize = 20; 		// px      // Minimum size of the drawn cells
  static readonly maxCellSize = 100; 		// px      // Maximum size of the drawn cells
  static readonly stepCellSize = 5; 		// px      // Cell-size increment/decrement constant
  static readonly minDrawnCells = 3;               // Minimum number of drawn cells

  static readonly thicknessRatio = 0.2;            // Dashboard width/height ratio
  static readonly minThickness = 200;   // px      // Dashboard thickness minimum
  static readonly maxThickness = 400;   // px      // Dashboard thickness maximum
  static readonly minDashboardThickessRatio = 2;   // Dashboard thickness/window shorter size minimum ratio


  static calculatePanelSizes(): Output {
    Resize.wWidth = Number(window.innerWidth);
    Resize.wHeight = Number(window.innerHeight);

    Resize.decideWindowOrientation();
    Resize.calcDashboardSize();
    Resize.calcMapSize();
    Resize.positionDashboard();
    Resize.calcCellSize();

    return (
      {
        windowWidth: Resize.wWidth,
        windowHeight: Resize.wHeight,

        mapWidth: Resize.mWidth,
        mapHeight: Resize.mHeight,
        mapCellSize: Resize.mActualCellSize,

        dashboardWidth: Resize.dWidth,
        dashboardHeight: Resize.dHeight,
        dashboardTop: Resize.dTop,
        dashboardLeft: Resize.dLeft,
        dashboardDisabled: Resize.dDisabled
      }
    );
  };

  static decideWindowOrientation(): void {
    Resize.wOrientation = (Resize.wWidth > Resize.wHeight ?
      Orientation.Landscape : Orientation.Portrait);

    Resize.wShort = Resize.wOrientation === Orientation.Portrait ?
      Resize.wWidth : Resize.wHeight;

    Resize.wLong = Resize.wOrientation === Orientation.Portrait ?
      Resize.wHeight : Resize.wWidth;
  };

  static calcDashboardSize(): void {
    if (Resize.wLong < Resize.minThickness * Resize.minDashboardThickessRatio) {
      Resize.dLength = 0;
      Resize.dThickness = 0;
      Resize.dDisabled = true;
    }
    else {
      Resize.dLength = Resize.wShort;
      Resize.dThickness = Math.floor(Resize.dLength * Resize.thicknessRatio);
      Resize.dThickness = Math.max(Resize.dThickness, Resize.minThickness);
      Resize.dThickness = Math.min(Resize.dThickness, Resize.maxThickness);
      Resize.dDisabled = false;
    }
  };

  static calcMapSize(): void {
    Resize.mWidth = Resize.wWidth;
    Resize.mHeight = Resize.wHeight;

    if (Resize.wOrientation === Orientation.Landscape)
      Resize.mWidth -= Resize.dThickness;
    else
      Resize.mHeight -= Resize.dThickness;
  };

  static positionDashboard(): void {
    if (Resize.wOrientation === Orientation.Landscape) {
      Resize.dWidth = Resize.dThickness;
      Resize.dHeight = Resize.dLength;
      Resize.dTop = 0;
      Resize.dLeft = Resize.mWidth;
    }
    else {
      Resize.dWidth = Resize.dLength;
      Resize.dHeight = Resize.dThickness;
      Resize.dTop = Resize.mHeight;
      Resize.dLeft = 0;
    }
  };

  static calcCellSize(): void {
    const verticalMapSize = g.sceneRows * Resize.mActualCellSize;
    if (Resize.mHeight < verticalMapSize) return;

    const horizontalMapSize = g.sceneCols * Resize.mActualCellSize;
    if (Resize.mWidth < horizontalMapSize) return;

    const verticalScale = Resize.mHeight / verticalMapSize;
    const horizontalScale = Resize.mWidth / horizontalMapSize;
    const scale = Math.min(verticalScale, horizontalScale);
    Resize.mActualCellSize = Math.floor(Resize.mActualCellSize * scale);

    Resize.mActualCellSize =
      Resize.roundToNumber(Resize.mActualCellSize, Resize.stepCellSize);
    Resize.mActualCellSize = Resize.normalizeCellSize();
  };

  static zoomMap = (event: MouseWheelEvent): number => {
    if (event.ctrlKey === true) {
      event.preventDefault();

      Resize.mActualCellSize = event.deltaY < 0 ?
      Resize.mActualCellSize += Resize.stepCellSize:
      Resize.mActualCellSize -= Resize.stepCellSize;
    }
    return Resize.mActualCellSize = Resize.normalizeCellSize();
  };


  static roundToNumber(rounded: number, roundTo: number): number {
    return Math.round(rounded / roundTo) * roundTo;
  };

  static normalizeCellSize(): number {
    return Math.min(Resize.maxCellSize,
      Math.max(Resize.minCellSize, Resize.mActualCellSize));
  };
}

export interface Output {
  windowWidth: number,
  windowHeight: number,

  mapWidth: number,
  mapHeight: number,
  mapCellSize: number,

  dashboardWidth: number,
  dashboardHeight: number,
  dashboardTop: number,
  dashboardLeft: number,
  dashboardDisabled: boolean
}
