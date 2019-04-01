import * as React from "react";
import * as CSS from 'csstype';

class Main extends React.Component {

  public render() {

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
        <div id="mapDiv" style={mapDivStyle}></div>
        <div id="dashDiv" style={dashDivStyle}></div>
      </React.Fragment>
    );
  }
}

export default Main;
