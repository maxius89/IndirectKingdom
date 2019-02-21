function assert(cond, text) {
    if (cond) {
        text = "[okay] " + text;
    }
    else {
        text = "[fail] " + text;
        failCounter++;
    }
    console.groupCollapsed(text);
    console.log(g);
    console.groupEnd();
}
function initTest(width, height) {
    setConsts();
    g.w.width = width;
    g.w.height = height;
}
function test() {
    console.clear();
    failCounter = 0;
    testOrientation();
    testDashboardBeforeCorr();
    testCellUpscale();
    testCellDownscale();
    console.log("Failed tests: " + failCounter);
}
function testOrientation() {
    initTest(1024, 768);
    decideWindowOrientation();
    assert(g.w.orientation == "L", "Landscape");
    initTest(768, 1024);
    decideWindowOrientation();
    assert(g.w.orientation == "P", "Portrait");
}
function testDashboardBeforeCorr() {
    initTest(800, 600);
    decideWindowOrientation();
    calcDashboardSize();
    assert(g.d.length == 600, "Dashboard: Length");
    assert(g.d.thickness == g.d.minThickness, "Dashboard: Thickness");
    initTest(600, 800);
    decideWindowOrientation();
    calcDashboardSize();
    assert(g.d.length == 600, "Dashboard: Length");
    assert(g.d.thickness == g.d.minThickness, "Dashboard: Thickness");
    initTest(600, 600);
    decideWindowOrientation();
    calcDashboardSize();
    assert(g.d.length == 600, "Dashboard: Length");
    assert(g.d.thickness == g.d.minThickness, "Dashboard: Thickness");
    initTest(1280, 1024);
    decideWindowOrientation();
    calcDashboardSize();
    assert(g.d.length == 1024, "Dashboard: Length");
    assert(g.d.thickness == 204, "Dashboard: Thickness");
    initTest(2501, 2500);
    decideWindowOrientation();
    calcDashboardSize();
    assert(g.d.length == 2500, "Dashboard: Length");
    assert(g.d.thickness == g.d.maxThickness, "Dashboard: Thickness");
}
function initTestCellUpscale(width, height) {
    initTest(width, height);
    decideWindowOrientation();
    calcDashboardSize();
    calcMapSize();
}
function testCellUpscale() {
    initTestCellUpscale(800, 600);
    g.cols = 5;
    g.sceneRows = 5;
    calcCellNum();
    assert(g.m.upscaled, "Map: Upscaled");
    assert(g.m.actualCellSize == 120, "Map: CellUpscale");
    initTestCellUpscale(800, 600);
    g.cols = 100;
    g.sceneRows = 5;
    g.m.actualCellSize = 40;
    calcCellNum();
    assert(!g.m.upscaled, "Map: Not Upscaled");
    assert(g.m.actualCellSize == 40, "Map: CellUpscale");
    initTestCellUpscale(800, 600);
    g.cols = 5;
    g.sceneRows = 6;
    calcCellNum();
    assert(g.m.upscaled, "Map: Upscaled");
    assert(g.m.actualCellSize == 100, "Map: CellUpscale");
}
function testCellDownscale() {
    initTestCellUpscale(800, 600);
    g.cols = 5;
    g.sceneRows = 5;
    g.m.actualCellSize = 300;
    g.m.minDrawnCells = 3;
    calcCellNum();
    assert(g.m.downscaled, "Map: Downscaled");
    assert(g.m.actualCellSize == 200, "Map: CellDownscale");
    initTestCellUpscale(100, 200);
    g.cols = 5;
    g.sceneRows = 5;
    g.m.actualCellSize = 40;
    g.m.minDrawnCells = 4;
    calcCellNum();
    assert(g.m.downscaled, "Map: Downscaled");
    assert(g.m.actualCellSize == 25, "Map: CellDownscale");
}
