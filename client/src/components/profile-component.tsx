import React from "react";
import { CourseComponentProps } from "../types/types";

const ProfileComponent: React.FC<CourseComponentProps> = (props) => {
  let { currentUser } = props;

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && <div>Login to check the content</div>}
      {currentUser && (
        <div>
          <h2>Here's the personal inforamtion: </h2>

          <table className="table">
            <tbody>
              <tr>
                <td>
                  <strong>Name: {currentUser.user.username}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>User ID: {currentUser.user._id}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Email: {currentUser.user.email}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Role: {currentUser.user.role}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
