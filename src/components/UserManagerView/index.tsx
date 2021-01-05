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

function capitalize(s:string){
  return s.charAt(0).toUpperCase() + s.slice(1);
}

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

  const [users, setUsers] = useState<User[]>(rows);

  const [incorrectName, setIncorrectName] = useState(false);

  const [incorrectSurname, setIncorrectSurname] = useState(false);

  const [incorrectCardId, setIncorrectCardId] = useState(false);

  const onAdd = () => {
    if(nameFilter.length <=0){
      setIncorrectName(true);
      return;
    }

    if(surnameFilter.length <=0){
      setIncorrectSurname(true);
      return;
    }

    if(!/^((\d|[A-F]){2}:){3}(\d|[A-F]){2}$/i.test(cardIdFilter)){
      setIncorrectCardId(true);
      return;
    }

    const arrayCopy = [...users, createUserData(capitalize(nameFilter), capitalize(surnameFilter), cardIdFilter, false)];
    setUsers(arrayCopy);

    setNameFilter("");
    setSurnameFilter("");
    setCardIdFilter("");
  };

  const onRemove = (index) => {
    console.log(index);
    const arrayCopy = [...users];
    console.log(arrayCopy);
    setUsers(arrayCopy.filter((x, i) => i!==index));
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
                      onChange={(e) => {
                        setNameFilter(e.target.value);
                        setIncorrectName(false)
                      }}
                      error={incorrectName}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                      variant={"outlined"}
                      size={"small"}
                      label={"Surname"}
                      value={surnameFilter}
                      onChange={(e) => {
                        setSurnameFilter(e.target.value);
                        setIncorrectSurname(false);
                      }}
                      error={incorrectSurname}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                      variant={"outlined"}
                      size={"small"}
                      label={"Card ID"}
                      value={cardIdFilter}
                      onChange={(e) => {
                        setCardIdFilter(e.target.value);
                        setIncorrectCardId(false);
                      }}
                      error={incorrectCardId}
                  />
                </TableCell>
                <TableCell align="center">
                        <Button variant={"contained"} onClick={onAdd}>ADD</Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row, i) =>
                  applyFilter(row.name, nameFilter) &&
                  applyFilter(row.surname, surnameFilter) &&
                  applyFilter(row.cardId, cardIdFilter) ? (
                      <TableRow key={row.cardId}>
                        <MyTableCell>{row.name}</MyTableCell>
                        <MyTableCell>{row.surname}</MyTableCell>
                        <MyTableCell>{row.cardId}</MyTableCell>
                        <TableCell align="center">
                          <Button variant={"contained"} onClick={() => onRemove(i)}>Remove</Button>
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
