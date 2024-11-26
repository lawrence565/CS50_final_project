import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { current_user, course_data } from "../types/types";
import CourseService from "../services/course.service";

interface CourseComponentProps {
  currentUser: current_user | undefined;
  setCurrentUser: Dispatch<SetStateAction<current_user | undefined>>;
}

const CourseComponent: React.FC<CourseComponentProps> = ({ currentUser }) => {
  let [courseData, setCourseData] = useState<course_data[]>();
  let [showAllCourse, setShowAllCourse] = useState<Boolean>(false);
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };

  const handleAllCourseButton = () => {
    setShowAllCourse(!showAllCourse);
  };

  useEffect(() => {
    let _id;

    if (currentUser) {
      _id = currentUser.user._id;
      if (currentUser.user.role == "instructor") {
        if (!showAllCourse) {
          CourseService.get(_id)
            .then((data) => {
              setCourseData(data.data);
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          CourseService.getAllCourse()
            .then((data) => {
              setCourseData(data.data);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      } else if (currentUser.user.role == "student") {
        if (!showAllCourse) {
          CourseService.getEnrolledCourses(_id)
            .then((data) => {
              setCourseData(data.data);
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          CourseService.getAllCourse()
            .then((data) => {
              setCourseData(data.data);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      }
    }
  }, [showAllCourse]);

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>Log in to check the content.</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          ></button>
        </div>
      )}
      {currentUser && currentUser.user.role == "insturctor" && (
        <div>
          <h1>Welcome to instructor page.</h1>
        </div>
      )}
      {showAllCourse && currentUser ? (
        <div>
          <h1>All Course</h1>
        </div>
      ) : (
        <div>
          <h1>Registered Course</h1>
        </div>
      )}
      {currentUser && courseData && courseData.length != 0 ? (
        <div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {courseData.map((course: course_data) => {
              return (
                <div
                  className="card"
                  style={{ width: "18rem", margin: "1rem" }}
                  key={course._id}
                >
                  <div className="card-body">
                    <h5 className="card-title">Course: {course.course}</h5>
                    <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                      {course.description}
                    </p>
                    <br />
                    <p style={{ margin: "0.5rem 0rem" }}>
                      Instructor: {course.instructor}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ height: "200px" }}>
          <h2 style={{ marginTop: "30px" }}>There's no registered course.</h2>
        </div>
      )}
      {!showAllCourse && (
        <button
          className="btn btn-primary btn-lg"
          type="button"
          onClick={handleAllCourseButton}
        >
          Check all the courses.
        </button>
      )}
      {showAllCourse && (
        <button
          className="btn btn-primary btn-lg"
          type="button"
          onClick={handleAllCourseButton}
        >
          Check registered course
        </button>
      )}
    </div>
  );
};

export default CourseComponent;