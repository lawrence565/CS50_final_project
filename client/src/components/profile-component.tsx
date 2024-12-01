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

          <table className="table table-bordered mt-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>User ID</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{currentUser.user.username}</strong>
                </td>
                <td>
                  <strong>{currentUser.user._id}</strong>
                </td>
                <td>
                  <strong>{currentUser.user.email}</strong>
                </td>
                <td>
                  <strong>{currentUser.user.role}</strong>
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
