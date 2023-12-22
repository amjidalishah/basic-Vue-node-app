// AuthDataService.js
import { authInstance, publicInstance } from "../http-common";

class AuthDataService {
  login(data) {
    return publicInstance.post("/auth/signin", data);
  }

  signup(data) {
    return publicInstance.post(`/auth/signup`, data);
  }

  forgot(data) {
    return publicInstance.post(`/auth/request_reset_password`, data);
  }

  resetPWD(data) {
    console.log("reset pwd service");
    return publicInstance.post(`/auth/reset_passowrd`, data);
  }
}

export default new AuthDataService();
