import { FC } from "react";
import styles from "./styles.module.css";
import { inspect } from "util";
import { Button, styled } from "@material-ui/core";

const MenuButton = styled(Button)({
  margin: "0 10px 20px 10px",
});

const LogOutButton = styled(Button)({
  margin: "auto 10px 10px 10px",
});

export const Sidebar: FC<{
  isLoggedIn: boolean;
  setIsLoggedIn: (state: boolean) => void;
  currentView: number;
  setCurrentView: (state: number) => void;
}> = (props) => {
  function logOut() {
    props.setIsLoggedIn(false);
  }

  return (
    <div className={styles.SideBar}>
      <MenuButton
        variant={"contained"}
        color={props.currentView===1?"primary":"secondary"}
        className={styles.MenuButton}
        onClick={() => props.setCurrentView(0)}
      >
        Manage Doors
      </MenuButton>
      <MenuButton
        variant={"contained"}
        color={props.currentView===0?"primary":"secondary"}
        className={styles.MenuButton}
        onClick={() => props.setCurrentView(1)}
      >
        Manage Users
      </MenuButton>
      <LogOutButton
        variant={"contained"}
        className={styles.LogOutButton}
        onClick={logOut}
      >
        Log Out
      </LogOutButton>
    </div>
  );
};
