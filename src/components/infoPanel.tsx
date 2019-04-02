import * as React from "react";

class InfoPanel extends React.Component {
  public render() {
    const infoPanelStyle ={
      backgroundColor: "#ffffff",
      width: 200,  //TODO: Layout.dThickness
      height: 377  //TODO: Layout.dLength / 2
    };

    return (
      <div id ="infoPanel" style={infoPanelStyle}>
        <div id="infoWealth"></div>
        <div id="infoIndustry"></div>
        <div id="infoAgriculture"></div>
        <div id="infoPopulation"></div>
      </div>
    );
  }
}

export default InfoPanel;
