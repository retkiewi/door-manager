import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { LoginBox } from "./components/LoginBox";
import { Sidebar } from "./components/Sidebar";
import { DoorManagerView } from "./components/DoorManagerView";
import { UserManagerView} from "./components/UserManagerView";
import { MqttClient } from './components/mqtt_components/mqtt_client';

function App() {
  MqttClient();

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentView, setCurrentView] = useState(0);

  const viewMap = {
    0: DoorManagerView,
    1: UserManagerView,
  };

  const CurrentViewComponent = viewMap[currentView];
  return (
      <div className="App">
        {!isLoggedIn ? (
            <LoginBox isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        ) : (
            <div className="MainFrame">
              <Sidebar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} currentView={currentView} setCurrentView={setCurrentView}/>
              <CurrentViewComponent/>
            </div>
        )}
      </div>
  );
}

export default App;
