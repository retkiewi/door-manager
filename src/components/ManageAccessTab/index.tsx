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

  const onCheckboxChange = (index, value) => {
    firebaseApp.firestore().collection('Users').doc(index).set({"hasAccess" : value}, {merge:true})
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
              {loading ? <div>Loading data</div> : (loadedUsers && loadedUsers?.docs && (loadedUsers?.docs as any).map((row, i) =>
                  applyFilter(row.data().name, nameFilter) &&
                  applyFilter(row.data().surname, surnameFilter) &&
                  applyFilter(row.data().cardID, cardIdFilter) &&
                  row.data().hasAccess === hasAccessFilter ? (
                      <TableRow key={row.id}>
                        <MyTableCell>{row.data().name}</MyTableCell>
                        <MyTableCell>{row.data().surname}</MyTableCell>
                        {<MyTableCell>{row.data().cardID}</MyTableCell>}

                        <TableCell align="center">
                          <Checkbox
                              checked={row.data().hasAccess}
                              onChange={() => onCheckboxChange(row.id,!row.data().hasAccess)}
                          />
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
