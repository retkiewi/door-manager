import {
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
import {useCollection, useCollectionData} from "react-firebase-hooks/firestore";
import {firebaseApp} from "../../firebaseApp";

export const ManageAccessTab: FC = (props) => {
  type User = {
    name: string;
    surname: string;
    cardID: string;
    hasAccess: boolean;
  };

  function createUserData(
      name: string,
      surname: string,
      cardID: string,
      hasAccess: boolean
  ) {
    return { name: name, surname: surname, cardID: cardID, hasAccess: hasAccess };
  }

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

  const rows = loadedUsers?.docs.map( (doc) => {
    let user = doc.data();
      console.log(user.name);
      console.log(user.surname);
      console.log(user.cardID);
      console.log(user.hasAccess);
    return createUserData(user.name,user.surname,user.cardID,user.hasAccess);
  });

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

//{loadedUsers && loadedUsers?.docs && (loadedUsers?.docs as any).map((row, i) =>
  return (
      <div>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TextField
                      variant={"outlined"}
                      size={"small"}
                      label={"name"}
                      value={nameFilter}
                      onChange={(e) => setNameFilter(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                      variant={"outlined"}
                      size={"small"}
                      label={"surname"}
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
                  <FormControlLabel
                      control={
                        <Checkbox
                            checked={hasAccessFilter}
                            onChange={(e) => setHasAccessFilter(e.target.checked)}
                        />
                      }
                      label="Has Access"
                      labelPlacement="start"
                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((row, i) =>
                  applyFilter(row.name, nameFilter) &&
                  applyFilter(row.surname, surnameFilter) &&
                  applyFilter(row.cardID, cardIdFilter) &&
                  row.hasAccess === hasAccessFilter ? (
                      <TableRow key={row.cardID}>
                        <MyTableCell>{row.name}</MyTableCell>
                        <MyTableCell>{row.surname}</MyTableCell>
                        {<MyTableCell>{row.cardID}</MyTableCell>}

                        <TableCell align="center">
                          <Checkbox
                              checked={row.hasAccess}
                              onChange={() => onCheckboxChange(i)}
                          />
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
