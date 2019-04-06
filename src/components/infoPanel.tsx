import * as React from "react";
import Kingdom from '../kingdom';

export interface InfoPanelProps {
  highlightedKindom: (Kingdom | undefined);
 }

class InfoPanel extends React.Component<InfoPanelProps> {
  public render() {
    const infoPanelStyle ={
      backgroundColor: "#ffffff",
      width: 200,  //TODO: Layout.dThickness
      height: 377  //TODO: Layout.dLength / 2
    };

    if (!this.props.highlightedKindom){return <div id ="infoPanel" style={infoPanelStyle}/>;}

    const {name, econ} = this.props.highlightedKindom;
    return (
      <div id ="infoPanel" style={infoPanelStyle}>
        <div id="infoWealth">
          {name + " wealth: " + econ.wealth}
        </div>
        <div id="infoIndustry">
          {name + " industry: " + econ.industry}
        </div>
        <div id="infoAgriculture">
          {name + " agriculture: " + econ.agriculture}
        </div>
        <div id="infoPopulation">
          {name + " population: " + econ.population}
        </div>
      </div>
    );
  }
}

export default InfoPanel;
