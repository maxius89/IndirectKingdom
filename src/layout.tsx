import * as React from 'react';
import * as ReactDOM from "react-dom";
import World from './world';
import Main from "./components/main";
import {g} from './script';

export default class Layout {
  static renderLayout(): void {
    ReactDOM.render(
      <Main colNum={g.sceneCols} rowNum={g.sceneRows} worldMap={World.map}/>,
      document.getElementById("main")
    );
  }
}
