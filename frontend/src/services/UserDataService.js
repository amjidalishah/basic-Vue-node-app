// AuthDataService.js
import { authInstance, publicInstance } from "../http-common";

class UserDataService {
  getAll() {
    return authInstance.get("/users");
  }

  get(id) {
    return authInstance.get(`/users/${id}`);
  }

  create(data) {
    return authInstance.post("/users", data);
  }

  update(id, data) {
    return authInstance.put(`/users/${id}`, data);
  }

  delete(id) {
    return authInstance.delete(`/users/${id}`);
  }

  deleteAll() {
    return authInstance.delete(`/users`);
  }

  findByTitle(title) {
    return authInstance.get(`/users?title=${title}`);
  }
}

export default new UserDataService();
