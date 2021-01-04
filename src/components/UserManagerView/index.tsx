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



export const UserManagerView: FC = (props) => {
  type User = {
    name: string;
    surname: string;
    cardId: string;
    hasAccess: boolean;
  };

  function createUserData(
      name: string,
      surname: string,
      cardId: string,
      hasAccess: boolean
  ) {
    return { name: name, surname: surname, cardId: cardId, hasAccess: hasAccess };
  }

  const rows = [
    createUserData("Adam", "Kowalski", "1234:1234:1234", true),
    createUserData("Zbigniew", "Nowak", "2234:1234:1234", false),
    createUserData("Andrzej", "Jakiś", "2234:3234:1234", true),
    createUserData("Paweł", "Inny", "4234:3234:4234", false),
  ];

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

  const [users, setUsers] = useState<User[]>(rows);

  const onCheckboxChange = (index) => {
    const arrayCopy = [...users];
    arrayCopy[index] = {
      ...arrayCopy[index],
      hasAccess: !users[index].hasAccess,
    };
    console.log(arrayCopy);
    setUsers(arrayCopy);
  };
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
              {users.map((row, i) =>
                  applyFilter(row.name, nameFilter) &&
                  applyFilter(row.surname, surnameFilter) &&
                  applyFilter(row.cardId, cardIdFilter) &&
                  row.hasAccess === hasAccessFilter ? (
                      <TableRow key={row.cardId}>
                        <MyTableCell>{row.name}</MyTableCell>
                        <MyTableCell>{row.surname}</MyTableCell>
                        <MyTableCell>{row.cardId}</MyTableCell>
                        <TableCell align="center">
                          <Button variant={"contained"}>Remove</Button>
                        </TableCell>
                      </TableRow>
                  ) : null
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
  );
};
