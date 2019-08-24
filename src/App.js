import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Root from './Root';
import AutheticationCallback from './AuthenticationCallback';

function App(props) {
  return (
    <Router>
        <Route path="/" exact component={Root} />
        <Route path="/authenticationCallback" exact component={AutheticationCallback} />
    </Router>
    
  );
}

export default App;
