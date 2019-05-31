import React from 'react';
import { BrowserRouter, Route} from "react-router-dom";
import './App.css';
import Start from './pages/Start'
import Game from './pages/MultiplayerGame'
import Computer from './pages/ComputerGame'

function App() {
  return (
      <BrowserRouter>
        <Route exact path="/" component={Start} />
        <Route path="/game/:id" component={Game} />
        <Route path="/computer" component={Computer} />
      </BrowserRouter>
  );
}

export default App;
