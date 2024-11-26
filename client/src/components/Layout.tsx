import { Outlet } from "react-router-dom";
import { CourseComponentProps } from "../types/types";
import Nav from "./nav-component";

const Layout: React.FC<CourseComponentProps> = ({
  currentUser,
  setCurrentUser,
}) => {
  return (
    <>
      <Nav currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Outlet />
    </>
  );
};

export default Layout;
