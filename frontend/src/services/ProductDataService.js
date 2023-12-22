// AuthDataService.js
import { authInstance, publicInstance } from "../http-common";

class ProductDataService {
  getAll() {
    return authInstance.get("/products");
  }

  get(id) {
    return authInstance.get(`/products/${id}`);
  }

  create(data) {
    return authInstance.post("/products", data);
  }

  update(id, data) {
    return authInstance.put(`/products/${id}`, data);
  }

  delete(id) {
    return authInstance.delete(`/products/${id}`);
  }

  deleteAll() {
    return authInstance.delete(`/products`);
  }

  findByTitle(title) {
    return authInstance.get(`/products?title=${title}`);
  }
}

export default new ProductDataService();
