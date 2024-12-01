import axios from "axios";
const API_USE = "http://127.0.0.1:5000/api/course";

class CourseService {
  post(title: string, description: string, credits: string) {
    let token;
    const user = localStorage.getItem("user");

    if (user) {
      token = JSON.parse(user).token;
    } else {
      token = "";
    }
    return axios.post(
      API_USE,
      { title, description, credits },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  getAllCourse() {
    let token;
    const user = localStorage.getItem("user");

    if (user) {
      token = JSON.parse(user).token;
    } else {
      token = "";
    }

    return axios.get(API_USE + "/allCourse", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // 使用學生id 尋找學生修習的課程
  getEnrolledCourses(_id: string) {
    let token;
    const user = localStorage.getItem("user");

    if (user) {
      token = JSON.parse(user).token;
    } else {
      token = "";
    }

    return axios.get(API_USE + "/student/" + _id, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // 使用課程名稱尋找課程
  getCoursesByName(name: string) {
    let token;
    const user = localStorage.getItem("user");

    if (user) {
      token = JSON.parse(user).token;
    } else {
      token = "";
    }

    return axios.get(API_USE + "/findByName/" + name, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getCoursesById(_id: string) {
    let token;
    const user = localStorage.getItem("user");

    if (user) {
      token = JSON.parse(user).token;
    } else {
      token = "";
    }

    return axios.get(API_USE + "/findById/" + _id, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  enroll(_id: string) {
    let token;
    const user = localStorage.getItem("user");

    if (user) {
      token = JSON.parse(user).token;
    } else {
      token = "";
    }
    return axios.post(
      API_USE + "/enroll/" + _id,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  // 使用講師id 尋找講師所開設的課程
  get(_id: string) {
    let token;
    const user = localStorage.getItem("user");

    if (user) {
      token = JSON.parse(user).token;
    } else {
      token = "";
    }

    return axios.get(API_USE + "/instructor/" + _id, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  edit(_id: string, title: string, description: string, credits: string) {
    let token;
    const user = localStorage.getItem("user");

    if (user) {
      token = JSON.parse(user).token;
    } else {
      token = "";
    }

    return axios.put(
      API_USE + "/edit/" + `${_id}`,
      { title, description, credits },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  delete(_id: string) {
    let token;
    const user = localStorage.getItem("user");

    if (user) {
      token = JSON.parse(user).token;
    } else {
      token = "";
    }

    return axios.delete(API_USE + "/delete/" + `${_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

export default new CourseService();
