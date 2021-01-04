import { FC, useState } from "react";
import styles from "./styles.module.css";
import { ManageAccessTab } from "../ManageAccessTab"
import { ViewLogsTab } from "../ViewLogsTab"
import {
  AppBar,
  Checkbox,
  FormControlLabel,
  Paper,
  styled,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
} from "@material-ui/core";

export const DoorManagerView: FC = (props) => {
  const tabMap = {
    0: ManageAccessTab,
    1: ViewLogsTab,
  };
  const [tab, setTab] = useState(0);
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const CurrentTab = tabMap[tab];
  return (
    <div className={styles.DoorManagerView}>
      <AppBar position={"sticky"}>
        <Tabs value={tab} onChange={handleChange} indicatorColor={"secondary"}>
          <Tab label={"Manage Access"} />
          <Tab label={"View Logs"} />
        </Tabs>
      </AppBar>
      <CurrentTab></CurrentTab>
    </div>
  );
};
