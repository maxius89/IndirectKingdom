import * as React from "react";
import Cell from "./cell";
import CellObj from '../cell';
import Kingdom from '../kingdom';

export interface MapProps {
  colNum: number;
  rowNum: number;
  worldMap: CellObj[][];
  highlightedKindom: (Kingdom | null);
  cellSize: number;
  onSelect: (event: any) => void;
}

class Map extends React.Component<MapProps>  {

  private createTable = () => {
    const { rowNum, colNum, worldMap, highlightedKindom, cellSize } = this.props;
    let table = []

    for (let i = 0; i < rowNum; i++) {
      let rows = []
      for (let j = 0; j < colNum; j++) {
        const mapCell = worldMap[i][j];
        rows.push(
          <Cell
            key={ "r"+i + "c" + j }
            cellSize= {cellSize}
            cellObj = { mapCell }
            onSelect = { this.props.onSelect }
            isHighlighted = { mapCell.owner === highlightedKindom }
          />
         )
      }

      table.push(<tr key={"r"+i}> { rows } </tr>)
    }
    return table
  }

  public render() {
    const {cellSize, colNum} = this.props;
    const mapStyle = {width: cellSize * colNum};

    return (
      <table id= "map" style={mapStyle}>
        <tbody>
          { this.createTable() }
        </tbody>
      </table>
    );
  }
}

export default Map;
