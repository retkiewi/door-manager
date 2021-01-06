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
import firebase from "firebase";
import {useCollection, useCollectionData} from "react-firebase-hooks/firestore";
import {firebaseApp} from "../../firebaseApp";

export const UserManagerView: FC = (props) => {
  type User = {
    name: string;
    surname: string;
    cardID: string;
    hasAccess: boolean;
  };

  // function createUserData(
  //     name: string,
  //     surname: string,
  //     cardID: string,
  //     hasAccess: boolean
  // ) {
  //   return { name: name, surname: surname, cardID: cardID, hasAccess: hasAccess };
  // }

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

  // const usersCollection = firebaseApp.firestore().collection("Users");
  //
  // const loadedUsers = (await usersCollection.get()).docs;
  // const [loadedUsers, loading, error] = useCollection(firebaseApp.firestore().collection('Users'));

  // const [users, setUsers] = useState<User[]>(loadedUsers);

  // console.log(loadedUsers[0].data().name);
  // console.log(loadedUsers[0].id);

  // const onCheckboxChange = (index) => {
  //   const arrayCopy = [...loadedUsers];
  //   arrayCopy[index] = {
  //     ...arrayCopy[index],
  //     hasAccess: !loadedUsers[index].hasAccess,
  //   };
  //   console.log(arrayCopy);
  //   setUsers(arrayCopy);
  // };

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
                  <Button variant={"contained"}>ADD</Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

            </TableBody>
          </Table>
        </TableContainer>
      </div>
  );
  // {users.map((row, i) =>
  //     applyFilter(row.name, nameFilter) &&
  //     applyFilter(row.surname, surnameFilter) &&
  //     applyFilter(row.cardID, cardIdFilter) &&
  //     row.hasAccess === hasAccessFilter ? (
  //         <TableRow key={row.cardID}>
  //           <MyTableCell>{row.name}</MyTableCell>
  //           <MyTableCell>{row.surname}</MyTableCell>
  //           {<MyTableCell>{row.cardID}</MyTableCell>}
  //           <TableCell align="center">
  //             <Button variant={"contained"}>Remove</Button>
  //           </TableCell>
  //         </TableRow>
  //     ) : null
  // )}
};
