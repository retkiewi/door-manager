import { FC, useState } from "react";
import { Box, Button, FormControl, Paper, TextField } from "@material-ui/core";

export const LoginBox: FC<{
  isLoggedIn: boolean;
  setIsLoggedIn: (state: boolean) => void;
}> = (props) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  function onSubmit() {
    if (login === "admin" && password === "123") {
      props.setIsLoggedIn(true);
    } else {
      setIsWrongPassword(true);
    }
  }

  return (
    <Paper>
      <Box p={2}>
        <FormControl>
          <Box mb={1}>
            <TextField
              variant={"filled"}
              label={"login"}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </Box>
          <Box mb={1}>
            <TextField
              variant={"filled"}
              label={"password"}
              type={"password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setIsWrongPassword(false);
              }}
              error={isWrongPassword}
            />
          </Box>
          <Button
            type={"submit"}
            variant={"contained"}
            color={"primary"}
            style={{ paddingTop: "10px", paddingBottom: "10px" }}
            onClick={onSubmit}
          >
            Log In
          </Button>
        </FormControl>
      </Box>
    </Paper>
  );
};
