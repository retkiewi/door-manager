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
import firebase from "firebase";
import {firebaseApp} from "../../firebaseApp";



export const ManageAccessTab: FC = (props) => {
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

  console.log(loadedUsers?.docs[0].data());
  console.log(loadedUsers?.docs[0].id);
  console.log(loadedUsers?.docs);

  const onCheckboxChange = (index) => {
    const arrayCopy = [...loadedUsers];
    arrayCopy[index] = {
      ...arrayCopy[index],
      hasAccess: !loadedUsers[index].HasAccess,
    };
    console.log(arrayCopy);
    setUsers(arrayCopy);
  };

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
              {loadedUsers && loadedUsers?.docs && (loadedUsers?.docs as any).map((row, i) =>
                  // applyFilter(row.Name, nameFilter) &&
                  // applyFilter(row.Surname, surnameFilter) &&
                  // applyFilter(row.cardId, cardIdFilter) &&
                  row.hasAccess === hasAccessFilter ? (
                      <TableRow key={row.CardID}>
                        <MyTableCell>{row.Name}</MyTableCell>
                        <MyTableCell>{row.Surname}</MyTableCell>
                        {<MyTableCell>{row.CardID}</MyTableCell>}

                        <TableCell align="center">
                          <Checkbox
                              checked={row.HasAccess}
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
