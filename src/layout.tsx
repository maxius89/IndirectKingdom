import * as React from 'react';
import * as ReactDOM from "react-dom";
import World from './world';
import Main from "./components/main";
import { g as Global } from './script';

export default function renderLayout(): void {
  ReactDOM.render(
    <Main
      colNum={ Global.sceneCols }
      rowNum={ Global.sceneRows }
      worldMap={ World.map }
    />,
    document.getElementById("main")
  );
};
