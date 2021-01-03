import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {LoginBox} from "./components/LoginBox";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
  return (
    <div className="App">
      <LoginBox isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
    </div>
  );
}

export default App;
