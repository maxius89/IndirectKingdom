import * as React from "react";
import { LandType } from '../cell';
import CellObj from '../cell';
import Kingdom from '../kingdom';
import { g } from '../script';

export interface CellProps {
  cellSize: number;
  cellObj: CellObj;
  onSelect: (event: Kingdom|undefined) => void;
  isHighlighted: boolean;
}

class Cell extends React.Component<CellProps> {
  readonly borderRatio = 0.02; // Cell-size/border thickness ratio

   showCellIcon(): JSX.Element {
     const { cellObj, cellSize } = this.props;
     const type = cellObj.type;
     const cellImgStyle = {
       height: cellSize / 2,
       width: cellSize /2,
       top: cellSize / 8,
       left: cellSize / 8
     };

    let src = '';
    switch (type) {
      case LandType.Field:
        src = 'img/farm.svg';
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
    return (
      <img
        className="cellImg"
        style ={ cellImgStyle }
        src={ src }
      />
    );
  }

  public render(): React.ReactNode {
    const { isHighlighted, cellSize, cellObj, onSelect } = this.props;

    const borderThickness = isHighlighted ?
      Math.ceil(cellSize * this.borderRatio) * 2 :
      Math.ceil(cellSize * this.borderRatio);

    const nonSelectedStyle = { boxShadow:
      "inset " + borderThickness + "px " + borderThickness + "px #ffffff," +
      "inset -" + borderThickness + "px -" + borderThickness + "px #ffffff" };
    const selectedStyle = { boxShadow:
      "inset " + borderThickness + "px " + borderThickness + "px #dddd55," +
      "inset -" + borderThickness + "px -" + borderThickness + "px #dddd55" };

    const boxShadowStyle = isHighlighted ? selectedStyle : nonSelectedStyle;
    const backGroundstyle = { backgroundColor: cellObj.owner.color };

    const cellStyle = {
      height: cellSize,
      width: cellSize,
      ...boxShadowStyle,
      ...backGroundstyle,
    };

    return (
      <td
        id={ "r"+cellObj.pos.row+"c"+cellObj.pos.col }
        className="cell"
        style={ cellStyle }
        onClick={() =>onSelect(cellObj.owner)}
      >
        {
          g.showPopulation ?
          String(Math.round(cellObj.population))
          : this.showCellIcon()
        }
      </td>
    );
  };

}

export default Cell;
