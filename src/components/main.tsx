import * as React from "react";
import * as CSS from 'csstype';
import Map from './map';
import InfoPanel from './infoPanel';
import {runGame, showPopulation } from '../script';

export interface MainProps { colNum: number; rowNum: number; }

class Main extends React.Component<MainProps>  {

  public render() {
    const { rowNum, colNum } = this.props;

    const absolute: CSS.PositionProperty = 'absolute';

    const mapDivStyle = {
      backgroundColor: "#00ff00",
      position: absolute,
      overflow: "scroll",
      top: 0,
      left: 0
    };

    const dashDivStyle = {
      backgroundColor: "#ff00ff",
      position: absolute
    };

    return (
      <React.Fragment>
        <div id="mapDiv" style={mapDivStyle}>
          <Map colNum={colNum} rowNum={rowNum}/>
        </div>
        <div id="dashDiv" style={dashDivStyle}>
          <button onClick={runGame}>Start / Stop</button>
          <button onClick={showPopulation}>Show Population</button>
          <InfoPanel/>
        </div>
      </React.Fragment>
    );
  }
}

export default Main;
