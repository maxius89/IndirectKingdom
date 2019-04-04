import * as React from "react";
import * as CSS from 'csstype';
import Cell from '../cell';
import Kingdom from '../kingdom';
import World from '../world';
import Map from './map';
import InfoPanel from './infoPanel';
import {runGame, showPopulation } from '../script';

export interface MainProps { colNum: number; rowNum: number; worldMap:Cell[][]}

class Main extends React.Component<MainProps>  {
  state: {
    highlightedKindom: Kingdom;
  };

  componentWillMount() {
    this.setState({
      highlightedKindom: null
    });
  }

  handleSelect = (kingdom: Kingdom) => {
    const clickedCellKingdom = World.listOfKingdoms.find(listKingdom =>
        listKingdom === kingdom);
        console.log(clickedCellKingdom.name);

    World.listOfKingdoms.forEach(kingdom => kingdom.highlighted = false);

    if (this.state.highlightedKindom === clickedCellKingdom){
      this.setState({highlightedKindom: null});
    }
    else {
      //clickedCellKingdom.highlighted = true;
      this.setState({highlightedKindom: clickedCellKingdom});
    }

    console.log(this.state.highlightedKindom);

  /*
    Layout.setHighlightedCells();
    Layout.writeToInfoPanel();*/

  };

  public render() {
    const { rowNum, colNum, worldMap } = this.props;

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
          <Map colNum={colNum} rowNum={rowNum} worldMap={worldMap} onSelect={this.handleSelect}/>
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
