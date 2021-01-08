import {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  styled,
  Table, TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from "@material-ui/core";
import {FC, useState} from "react";
import styles from "../DoorManagerView/styles.module.css";
import {useCollection} from "react-firebase-hooks/firestore";
import {firebaseApp} from "../../firebaseApp";

export const UserManagerView: FC = (props) => {

  const MyTableCell = styled(TableCell)({
    paddingLeft: "25px",
  });

  function applyFilter(value, filter) {
    value = value.replaceAll(":", "");
    filter = filter.replaceAll(":", "");
    return new RegExp(`.*${filter}.*`, "i").test(value);
  }

  const [nameFilter, setNameFilter] = useState("");

  const [surnameFilter, setSurnameFilter] = useState("");

  const [cardIdFilter, setCardIdFilter] = useState("");

  const [hasAccessFilter, setHasAccessFilter] = useState(false);

  const [loadedUsers, loading, error] = useCollection(firebaseApp.firestore().collection('Users'));

  return (
      <div className={styles.DoorManagerView}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TextField
                      variant={"outlined"}
                      size={"small"}
                      label={"Name"}
                      value={nameFilter}
                      onChange={(e) => setNameFilter(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                      variant={"outlined"}
                      size={"small"}
                      label={"Surname"}
                      value={surnameFilter}
                      onChange={(e) => setSurnameFilter(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                      variant={"outlined"}
                      size={"small"}
                      label={"Card ID"}
                      value={cardIdFilter}
                      onChange={(e) => setCardIdFilter(e.target.value)}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button variant={"contained"}>ADD</Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? <div>Loading data</div> : (loadedUsers && loadedUsers?.docs && (loadedUsers?.docs as any).map((row, i) =>
                  applyFilter(row.data().name, nameFilter) &&
                  applyFilter(row.data().surname, surnameFilter) &&
                  applyFilter(row.data().cardID, cardIdFilter) &&
                  row.data().hasAccess === hasAccessFilter ? (
                      <TableRow key={row.data().cardID}>
                        <MyTableCell>{row.data().name}</MyTableCell>
                        <MyTableCell>{row.data().surname}</MyTableCell>
                        {<MyTableCell>{row.data().cardID}</MyTableCell>}

                        <TableCell align="center">
                          <Button variant={"contained"}>Remove</Button>
                        </TableCell>

                      </TableRow>
                  ) : null
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
  );
};
