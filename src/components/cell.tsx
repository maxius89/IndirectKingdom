import * as React from "react";
import { LandType } from '../cell';
import World from '../world';
import CellObj from '../cell';

export interface CellProps { row: number; col: number; cellObj: CellObj}

class Cell extends React.Component<CellProps> {
  state= {
    status: 'unclaimed',
    highlighted: false,
    type: 'none',
    backgroundColor: '#7777cc'
  };

  componentDidMount() {
    this.updateCell();
  }

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

  updateCell = () => {
    console.log("cell updated")
    const owner = this.props.cellObj.owner;

    this.setState({
      status: owner.name,
      backgroundColor: owner.color
    });
  }

  public render() {
    const {col, row} = this.props;

    return (
      <td
        id={"r"+row+"c"+col}
        className="cell"
        style={{backgroundColor: this.state.backgroundColor}}
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
