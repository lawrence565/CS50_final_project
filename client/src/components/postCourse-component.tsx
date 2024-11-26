import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CourseComponentProps } from "../types/types";
import CourseService from "../services/course.service";

const PostCourseComponent = (props: CourseComponentProps) => {
  let { currentUser } = props;
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [credits, setCredits] = useState("");
  let [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };
  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleChangeDesciption = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };
  const handleChangeCredits = (e: ChangeEvent<HTMLInputElement>) => {
    setCredits(e.target.value);
  };
  const postCourse = () => {
    CourseService.post(title, description, credits)
      .then(() => {
        window.alert("New course created.");
        navigate("/course");
      })
      .catch((error) => {
        console.log(error.response);
        setMessage(error.response.data);
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>Before creating course, you need to login.</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            Take me to the login page.
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role !== "instructor" && (
        <div>
          <p>Only instructor can create a course.</p>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div className="form-group">
          <label htmlFor="exampleforTitle">Course title: </label>
          <input
            name="title"
            type="text"
            className="form-control"
            id="exampleforTitle"
            onChange={handleChangeTitle}
          />
          <br />
          <label htmlFor="exampleforContent">Discreption: </label>
          <textarea
            className="form-control"
            id="exampleforContent"
            aria-describedby="emailHelp"
            name="content"
            onChange={handleChangeDesciption}
          />
          <br />
          <label htmlFor="exampleforCredits">Credits: </label>
          <input
            className="form-control"
            id="exampleforCredits"
            aria-describedby="emailHelp"
            name="credits"
            onChange={handleChangeCredits}
          />
          <br />
          <button className="btn btn-primary" onClick={postCourse}>
            Submit the form
          </button>
          <br />
          <br />
          {message && (
            <div className="alert alert-warning" role="alert">
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCourseComponent;
