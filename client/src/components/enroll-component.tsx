import { useState, MouseEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";
import { course_data, CourseComponentProps } from "../types/types";

const EnrollComponent = (props: CourseComponentProps) => {
  let { currentUser } = props;
  const navigate = useNavigate();
  let [searchInput, setSearchInput] = useState("");
  let [searchResult, setSearchResult] = useState<course_data[]>([]);

  const handleTakeToLogin = () => {
    navigate("/login");
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    CourseService.getCoursesByName(searchInput)
      .then((data) => {
        setSearchResult(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEnroll = (e: MouseEvent<HTMLAnchorElement>) => {
    const target = e.target as HTMLAnchorElement;
    if (target) {
      CourseService.enroll(target.id)
        .then(() => {
          window.alert("Enroll success, redirect to course page");
          navigate("/course");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>You must login first before searching for courses.</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            Take me to the login page.
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div>
          <h1>Only students can enroll in courses.</h1>
        </div>
      )}
      {currentUser && currentUser.user.role == "student" && (
        <>
          <h1>Enroll Course</h1>
          <br />
          <div className="search input-group mb-3">
            <input
              onChange={handleChangeInput}
              type="text"
              className="form-control"
              placeholder="Search courses"
            />
            <button onClick={handleSearch} className="btn btn-primary">
              Search
            </button>
          </div>
        </>
      )}
      {currentUser && searchResult && searchResult.length != 0 && (
        <div style={{ display: "flex" }}>
          {searchResult.map((course) => (
            <div
              key={course._id}
              className="card"
              style={{ width: "18rem", margin: "0.5rem" }}
            >
              <div className="card-body">
                <h5 className="card-title">{course.course}</h5>
                <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                  {course.description}
                </p>
                <br />
                <p style={{ margin: "0.5rem 0rem" }}>
                  Instructor: {course.instructor}
                </p>
                <a
                  href="#"
                  onClick={handleEnroll}
                  className="card-text btn btn-primary"
                  id={course._id}
                >
                  Enroll
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrollComponent;
