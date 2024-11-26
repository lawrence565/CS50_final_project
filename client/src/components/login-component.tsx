import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CourseComponentProps } from "../types/types";
import { AxiosError } from "axios";
import AuthService from "../services/auth.service";

const LoginComponent = (props: CourseComponentProps) => {
  let { setCurrentUser } = props;
  let navigate = useNavigate();
  let [email, setEmail] = useState<string>("");
  let [password, setPassword] = useState<string>("");
  let [message, setMessage] = useState<string>("");

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleLogin = async () => {
    try {
      setMessage("");
      let response = await AuthService.login(email, password);
      localStorage.setItem("user", JSON.stringify(response.data));
      window.alert("Login success, redirect to personal page");
      setCurrentUser(AuthService.getCurrentUser());
      navigate("/profile");
    } catch (e: unknown) {
      if (e instanceof AxiosError && e.response) {
        setMessage(e.response.data);
      } else if (e instanceof Error) {
        setMessage(e.message);
      } else {
        console.error("Unknown error:", e);
      }
    }
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        {message && <div className="alert alert-danger">{message}</div>}
        <div className="form-group">
          <label htmlFor="username">Email: </label>
          <input
            onChange={handleChangeEmail}
            type="text"
            className="form-control"
            name="email"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">Password: </label>
          <input
            onChange={handleChangePassword}
            type="password"
            className="form-control"
            name="password"
          />
        </div>
        <br />
        <div className="form-group">
          <button onClick={handleLogin} className="btn btn-primary btn-block">
            <span>Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
