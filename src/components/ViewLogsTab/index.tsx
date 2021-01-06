import {Paper, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {FC} from "react";
import {useCollection, useCollectionData} from "react-firebase-hooks/firestore";
import {firebaseApp} from "../../firebaseApp";

export const ViewLogsTab: FC = (props) => {

    const MyTableCell = styled(TableCell)({
        paddingLeft: "25px",
    });

    const [loadedLogs, loading, error] = useCollection(firebaseApp.firestore().collection('Logs'));

    function getDate(value) {
        const date = new Date(value);
        let hour = "", minute = "", second = "";
        if(date.getHours() < 10)
            hour = "0"+date.getHours().toString();
        else
            hour = date.getHours().toString();

        if(date.getMinutes() < 10)
            minute = "0"+date.getMinutes().toString();
        else
            minute = date.getMinutes().toString();

        if(date.getSeconds() < 10)
            second = "0"+date.getSeconds().toString();
        else
            second = date.getSeconds().toString();

        return date.toDateString() + " " + hour + ":" + minute + ":" + second;
    }

    return <div>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date and Time</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Surname</TableCell>
                        <TableCell>Card ID</TableCell>
                        <TableCell>Access</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? <div>Loading data</div> : (loadedLogs && loadedLogs?.docs && (loadedLogs?.docs as any).map((row, i) =>
                        <TableRow key={row.id}>
                            <MyTableCell>{getDate(row.data().time.seconds * 1000)}</MyTableCell>
                            <MyTableCell>{row.data().name}</MyTableCell>
                            <MyTableCell>{row.data().surname}</MyTableCell>
                            <MyTableCell>{row.data().cardID}</MyTableCell>
                            <MyTableCell>{row.data().access}</MyTableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>;
};
