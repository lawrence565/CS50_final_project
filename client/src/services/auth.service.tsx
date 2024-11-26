// 扮演一個服務器的角色
import axios from "axios";
const API_URL = "http://127.0.0.1:5000/api/user";

class AuthService {
  login(email: string, password: string) {
    return axios.post(API_URL + "/login", { email, password });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username: string, email: string, password: string, role: string) {
    return axios.post(API_URL + "/register", {
      username,
      email,
      password,
      role,
    }); // 回傳一個promise 檔案
  }

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
}

export default new AuthService(); // 執行他的Constructor
