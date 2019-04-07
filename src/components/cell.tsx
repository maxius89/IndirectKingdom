import * as React from "react";
import { LandType } from '../cell';
import CellObj from '../cell';
import Kingdom from '../kingdom';

export interface CellProps {
  cellSize: number;
  cellObj: CellObj;
  onSelect?:(event: Kingdom) => void;
  isHighlighted: boolean
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
    const owner = this.props.cellObj.owner;

    this.setState({
      status: owner.name,
      backgroundColor: owner.color
    });
  }

  public render() {
    const {isHighlighted, cellSize, cellObj} = this.props;

    const nonSelectedStyle = {boxShadow: "inset 1px 1px #ffffff, inset -1px -1px #ffffff"};
    const selectedStyle = {boxShadow: "inset 1px 1px #dddd55, inset -1px -1px #dddd55"}; // TODO: width calculation

    const boxShadowStyle = isHighlighted ? selectedStyle : nonSelectedStyle;
    const backGroundstyle = {backgroundColor: this.props.cellObj.owner.color};

    const cellSstyle = {
      height: cellSize,
      width: cellSize,
      ...boxShadowStyle,
      ...backGroundstyle,
    };

    return (
      <td
        id={"r"+cellObj.pos.row+"c"+cellObj.pos.col}
        className="cell"
        style={cellSstyle}
        onClick={() =>this.props.onSelect(this.props.cellObj.owner)}
      >
        {this.showCellIcon()}
      </td>
    );
  }
}

export default Cell;
