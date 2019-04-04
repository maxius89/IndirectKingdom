import * as React from "react";
import { LandType } from '../cell';
import CellObj from '../cell';

export interface CellProps {
  row: number;
  col: number;
  cellObj: CellObj,
  onClick?:(event: any) => void
};

class Cell extends React.Component<CellProps> {
  state= {
    status: this.props.cellObj.owner.name,
    highlighted: false,
    type: 'none',
    backgroundColor: this.props.cellObj.owner.color
  };

  componentDidMount() {
    this.updateCell();
  }

   showCellIcon(): JSX.Element {
    //img.css("height", Layout.mActualCellSize / 2 + "px"); //TODO
    //img.css("width", Layout.mActualCellSize / 2 + "px");
    //img.css("top", Layout.mActualCellSize / 8 + "px");
    //img.css("left", Layout.mActualCellSize / 8 + "px");
    const {cellObj} = this.props;
    const type = cellObj.type;

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
    console.log("Render cell: " + this.props.cellObj.owner.name);
    const {col, row} = this.props;

    return (
      <td
        id={"r"+row+"c"+col}
        className="cell"
        style={{backgroundColor: this.props.cellObj.owner.color}}
        onClick={this.props.onClick}
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
