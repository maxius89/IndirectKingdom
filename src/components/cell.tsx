import * as React from "react";
import { LandType } from '../cell';
import World from '../world';

export interface CellProps { row: number; col: number; }

class Cell extends React.Component<CellProps> {
  state= {
    status: 'unclaimed',
    highlighted: false,
    type: 'none'
  };

   showCellIcon(): JSX.Element {
    //img.css("height", Layout.mActualCellSize / 2 + "px"); //TODO
    //img.css("width", Layout.mActualCellSize / 2 + "px");
    //img.css("top", Layout.mActualCellSize / 8 + "px");
    //img.css("left", Layout.mActualCellSize / 8 + "px");
    const {row, col} = this.props;
    const type = World.map[row][col].type;

    let src:string;
    switch (type) {
      case LandType.Farm:
        src = 'img/farm.svg';
        break;
      case LandType.Settlement:
        src = 'img/settlement.svg';
        break;
      case LandType.Forest:
        src = 'img/forest.svg';
        break;
      case LandType.Mountain:
        src = 'img/mountain.svg';
        break;
      default:
      //TODO: create Unknown cell-type svg.
    }
    return (<img className="cellImg" src={src}></img>);
  }

  public render() {
    const {col, row} = this.props;

    return (
      <td
        id={"r"+row+"c"+col}
        className="cell"
        /*status="unclaimed"  TODO*/
        /*highlighted="false"  TODO*/
        /*type="none"  TODO*/
        >
        {this.showCellIcon()}
      </td>
    );
  }
}

export default Cell;
