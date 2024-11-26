import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import { CourseComponentProps } from "../types/types";

const NavComponent: React.FC<CourseComponentProps> = ({
  currentUser,
  setCurrentUser,
}) => {
  const handleLogout = () => {
    AuthService.logout(); //清空localstorage
    window.alert("Logout Success！ Redirect to homepage.");
    setCurrentUser(null);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Homepage
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              {!currentUser && (
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              )}
              {!currentUser && (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              )}
              {currentUser && (
                <li className="nav-item">
                  <Link onClick={handleLogout} className="nav-link" to="/">
                    Logout
                  </Link>
                </li>
              )}
              {currentUser && (
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    Personal
                  </Link>
                </li>
              )}
              {currentUser && (
                <li className="nav-item">
                  <Link className="nav-link" to="/course">
                    Course
                  </Link>
                </li>
              )}
              {currentUser && currentUser.user.role == "instructor" && (
                <li className="nav-item">
                  <Link className="nav-link" to="/postCourse">
                    Add Course
                  </Link>
                </li>
              )}
              {currentUser && currentUser.user.role == "student" && (
                <li className="nav-item">
                  <Link className="nav-link" to="/enroll">
                    Enroll Course
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarNav"></div>
        </div>
      </nav>
    </div>
  );
};

export default NavComponent;
