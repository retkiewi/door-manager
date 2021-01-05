import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { LoginBox } from "./components/LoginBox";
import { Sidebar } from "./components/Sidebar";
import { DoorManagerView } from "./components/DoorManagerView";
import { UserManagerView} from "./components/UserManagerView";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const viewMap = {
    0: DoorManagerView,
    1: UserManagerView,
  }

  const CurrentView = viewMap[0]
  return (
    <div className="App">
      {!isLoggedIn ? (
        <LoginBox isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <div className="MainFrame">
          <Sidebar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}></Sidebar>
          <CurrentView></CurrentView>
        </div>
      )}
    </div>
  );
}

export default App;
