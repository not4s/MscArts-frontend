import { useContext, useEffect, useState } from "react";
import { APIService } from "../services/API";
import { Container } from "../styles/app-style";
import { ActionButton } from "../styles/dialog-style";
import {
  Fieldset,
  Form,
  Input,
  Label,
  Logo,
  Name,
  Tagline,
} from "../styles/login-style";
import { message } from "antd";

export default function Login(props: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const api = new APIService();
    api
      .login(username, password)
      .then((res: any) => {
        console.log(res);
        sessionStorage.setItem("user", res.data.accessToken);
        props.setCurrentUser(res.data.accessToken);

        api.getRole().then((res) => {
          console.log(`Role is `, res);
          props.setCurrentUserRole(res.data);
        });
      })
      .catch((res) => {
        if (res.response.status === 401) {
          message.error("Request Access from System Administrator");
        } else {
          message.error("Incorrect username or password");
        }
      });
  };

  return (
    <Container center expand dotted css={{ paddingTop: 0 }}>
      <Form onSubmit={handleLogin}>
        {/* TODO */}
        {/* <Logo
          alt="Scientia logo"
          src="assets/logo-light.svg"
          style={{ filter: `invert(${0})` }}
        /> */}
        <Name>MScArts</Name>
        <Tagline style={{ marginBottom: "2rem" }}>
          A Unified MScArts Platform
        </Tagline>

        <Fieldset>
          <Label htmlFor="Username">Username</Label>
          <Input
            name="Username"
            type="username"
            value={username}
            placeholder="abc123"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Fieldset>

        <Fieldset>
          <Label htmlFor="Password">Password</Label>
          <Input
            name="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Fieldset>

        <ActionButton.Primary type="submit" style={{ padding: "2rem inherit" }}>
          Login
        </ActionButton.Primary>
      </Form>
    </Container>
  );
}
