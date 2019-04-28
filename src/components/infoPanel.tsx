import * as React from "react";
import Kingdom from '../kingdom';

export interface InfoPanelProps {
  highlightedKindom: (Kingdom | null);
  height: number;
  width: number;
 }

class InfoPanel extends React.Component<InfoPanelProps> {
  public render(): React.ReactNode {
    const { highlightedKindom, height, width } = this.props;

    const infoPanelStyle ={
      backgroundColor: "#ffffff",
      width,
      height
    };

    if (!highlightedKindom){return <div id ="infoPanel" style={infoPanelStyle}/>;}

    const {name, econ} = highlightedKindom;
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
  };
  
}

export default InfoPanel;
