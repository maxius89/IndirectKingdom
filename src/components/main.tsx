import * as React from "react";
import * as CSS from 'csstype';
import Map from './map';
import InfoPanel from './infoPanel';
import Cell from '../cell';
import Kingdom from '../kingdom';
import World from '../world';
import { runGame, showPopulation } from '../script';
import Resize, {Output as SizingOutput} from "../util/resize";

export interface MainProps {
  colNum: number;
  rowNum: number;
  worldMap: Cell[][];
}

class Main extends React.Component<MainProps> {
  state: {
    highlightedKindom: (Kingdom | null);
    panelSize: SizingOutput;
  };

  componentWillMount(): void {
    this.setState(
      { panelSize: Resize.calculatePanelSizes(), highlightedKindom: null }
    );
  };

  componentDidMount(): void {
    window.addEventListener("resize", this.updateDimensions);

    const mapDiv = document.getElementById("mapDiv");
    if (mapDiv === null) return;
    mapDiv.addEventListener("wheel", this.zoomMap);
  };

  componentWillUnmount(): void {
    window.removeEventListener("resize", this.updateDimensions);

    const mapDiv = document.getElementById("mapDiv");
    if (mapDiv === null) return;
    mapDiv.removeEventListener("wheel", this.zoomMap);
  };

  updateDimensions = (): void => {
    this.setState({ panelSize: Resize.calculatePanelSizes() });
  };

  handleSelect = (kingdom : Kingdom|undefined): void => {
    if (kingdom === undefined) return;

    const clickedCellKingdom = World.listOfKingdoms.find(
      listKingdom => listKingdom === kingdom
    );

    let highlightedKindom = this.state.highlightedKindom === clickedCellKingdom
      ? null
      : clickedCellKingdom;

    this.setState({ highlightedKindom });
  };

  zoomMap = (event: MouseWheelEvent): void => {
    const panelSize = {...this.state.panelSize};
    panelSize.mapCellSize= Resize.zoomMap(event);
    this.setState({ panelSize });
  };

  public render(): React.ReactNode {
    const { rowNum, colNum, worldMap } = this.props;
    const { highlightedKindom, panelSize } = this.state;

    const absolute: CSS.PositionProperty = 'absolute';

    const mapDivStyle = {
      backgroundColor: "#00ff00",
      position: absolute,
      overflow: "scroll",
      top: 0,
      left: 0,
      width: panelSize.mapWidth,
      height: panelSize.mapHeight
    };

    const dashDivStyle = {
      backgroundColor: "#ff00ff",
      position: absolute,
      width: panelSize.dashboardWidth,
      height: panelSize.dashboardHeight,
      top: panelSize.dashboardTop,
      left: panelSize.dashboardLeft
    };

    return (
      <React.Fragment>
        <div id="mapDiv" style={ mapDivStyle }>
          <Map
            colNum={ colNum }
            rowNum={ rowNum }
            worldMap={ worldMap }
            highlightedKindom={ highlightedKindom }
            cellSize={ panelSize.mapCellSize }
            onSelect={ this.handleSelect }
        />
        </div>
        <div id="dashDiv" style={ dashDivStyle }>
          <button onClick={ runGame }>Start / Stop</button>
          <button onClick={ showPopulation }>Show Population</button>
          <InfoPanel
            highlightedKindom={ highlightedKindom }
            height={ panelSize.dashboardHeight/2 }
            width={ panelSize.dashboardWidth }
          />
        </div>
      </React.Fragment>
    );
  };

}

export default Main;
