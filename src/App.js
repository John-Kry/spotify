import React , {useEffect}from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Root from './Root';
import AutheticationCallback from './AuthenticationCallback';

function App(props) {
  useEffect(() => {
    console.log(props)
  });
  return (
    <Router>
        <Route path="/" exact component={Root} />
        <Route path="/authenticationCallback" exact component={AutheticationCallback} />
    </Router>
    
  );
}

export default App;
