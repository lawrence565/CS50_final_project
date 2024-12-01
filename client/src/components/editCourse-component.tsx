import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CourseComponentProps } from "../types/types";
import CourseService from "../services/course.service";
import courseService from "../services/course.service";

const EditCourseComponent = (props: CourseComponentProps) => {
  const { currentUser } = props;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [credits, setCredits] = useState("");
  const [message, setMessage] = useState("");
  const { _id } = useParams<{ _id: string }>();
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

  const editCourse = () => {
    if (_id) {
      CourseService.edit(_id, title, description, credits)
        .then(() => {
          window.alert("Course edited.");
          navigate("/course");
        })
        .catch((error) => {
          console.log(error.response);
          setMessage(error.response.data);
        });
    }
  };

  useEffect(() => {
    if (_id) {
      const getCourseData = async (_id: string) => {
        try {
          const result = await courseService.getCoursesById(_id);
          return result.data;
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      getCourseData(_id)
        .then((defaultValue) => {
          setTitle(defaultValue.course);
          setDescription(defaultValue.description);
          setCredits(defaultValue.credits);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>Before editing course, you need to login.</p>
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
          <p>Only instructor can edit courses.</p>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div className="form-group">
          <h1>Edit Course Detail</h1>
          <br />
          <label htmlFor="exampleforTitle">Course title: </label>
          <input
            name="title"
            type="text"
            defaultValue={title}
            className="form-control"
            id="exampleforTitle"
            onChange={handleChangeTitle}
          />
          <br />
          <label htmlFor="exampleforContent">Discreption: </label>
          <textarea
            className="form-control"
            id="exampleforContent"
            defaultValue={description}
            aria-describedby="emailHelp"
            name="content"
            onChange={handleChangeDesciption}
          />
          <br />
          <label htmlFor="exampleforCredits">Credits: </label>
          <input
            className="form-control"
            id="exampleforCredits"
            defaultValue={credits}
            aria-describedby="emailHelp"
            name="credits"
            onChange={handleChangeCredits}
          />
          <br />
          <button className="btn btn-primary" onClick={editCourse}>
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

export default EditCourseComponent;
