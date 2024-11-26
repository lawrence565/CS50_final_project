import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { AxiosError } from "axios";

const RegisterComponent = () => {
  const navigate = useNavigate();

  let [username, setUserName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [role, setRole] = useState("");
  let [message, setMessage] = useState("");

  const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };
  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleChangeRole = (e: ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };

  const handleRegister = () => {
    AuthService.register(username, email, password, role)
      .then(() => {
        window.alert("Success, redirect to homepage");
        navigate("/login");
      })
      .catch((e: unknown) => {
        if (e instanceof AxiosError && e.response) {
          setMessage(e.response.data);
        } else {
          console.error("Unknown error:", e);
        }
      });
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        {message && <div className="alert alert-danger">{message}</div>}
        <div>
          <label htmlFor="username">Username: </label>
          <input
            onChange={handleChangeUsername}
            type="text"
            className="form-control"
            name="username"
            required
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="email">Email: </label>
          <input
            onChange={handleChangeEmail}
            type="text"
            className="form-control"
            name="email"
            required
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
            placeholder="Your password must contain at least 6 characters."
            required
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="role">Role: </label>
          <select
            name="role"
            className="form-select"
            value={role}
            onChange={handleChangeRole}
            required
          >
            <option disabled value="">
              Please select a role
            </option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>
        <br />
        <button onClick={handleRegister} className="btn btn-primary">
          <span>Register</span>
        </button>
      </div>
    </div>
  );
};

export default RegisterComponent;
