import * as React from "react";
import Cell from "./cell";
import CellObj from '../cell';

export interface MapProps {
  colNum: number;
  rowNum: number;
  worldMap: CellObj[][];
  onSelect:  (event: any) => void
 }

class Map extends React.Component<MapProps>  {

  private createTable = () => {
    const { rowNum, colNum, worldMap } = this.props;
     let table = []

     // Outer loop to create parent
     for (let i = 0; i < rowNum; i++) {
       let rows = []
       for (let j = 0; j < colNum; j++) {
       //Inner loop to create children
         rows.push(
           <Cell
            key={"r"+i+"c"+j}
            row={i}
            col={j}
            cellObj={worldMap[i][j]}
            onSelect={this.props.onSelect}
            />
         )
       }
       //Create the parent and add the childrens
       table.push(<tr key={"r"+i}>{rows}</tr>)
     }
     return table
   }

  public render() {
    return (
      <table id="map">
        <tbody>
          {this.createTable()}
        </tbody>
      </table>
    );
  }
}

export default Map;
