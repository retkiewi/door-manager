import {Paper, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {FC} from "react";

const MyTableCell = styled(TableCell)({
    paddingLeft: "25px",
});

function createLogsData(
    date: string,
    time: string,
    name: string,
    surname: string,
    cardId: string
) {
    return {date: date, time: time, name: name, surname: surname, cardId: cardId};
}

const logs = [
    createLogsData("10.09.2020", "12:00:34", "Adam", "Kowalski", "1234:1234:1234")
];

export const ViewLogsTab: FC = (props) => {
    return <div>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Surname</TableCell>
                        <TableCell>Card ID</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {logs.map((row, i) => (
                        <TableRow key={i}>
                            <MyTableCell>{row.time}</MyTableCell>
                            <MyTableCell>{row.date}</MyTableCell>
                            <MyTableCell>{row.name}</MyTableCell>
                            <MyTableCell>{row.surname}</MyTableCell>
                            <MyTableCell>{row.cardId}</MyTableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>;
};
