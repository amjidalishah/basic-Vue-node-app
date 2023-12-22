import { defineStore } from "pinia";

import ProductDataService from "../services/ProductDataService";

export const useProductStore = defineStore({
  id: "products",
  state: () => ({
    products: { loading: false, data: null, error: null },
  }),
  actions: {
    async getAllProducts() {
      this.products = { loading: true, data: null, error: null };
      try {
        const products = await ProductDataService.getAll();
        this.products = { loading: false, data: products.data, error: null };
      } catch (error) {
        this.products = { loading: false, data: null, error };
      }
    },

    async createProduct(productData) {
      try {
        const newProduct = await ProductDataService.create(productData);
        // Optionally, you can update the local state with the new product
        this.products.data.push(newProduct.data);
        return newProduct;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async updateProduct({ productId, productData }) {
      try {
        const updatedProduct = await ProductDataService.update(
          productId,
          productData
        );
        // Optionally, you can update the local state with the updated product
        const index = this.products.data.findIndex(
          (product) => product.id === productId
        );
        if (index !== -1) {
          this.products.data.splice(index, 1, updatedProduct);
        }
        return updatedProduct;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async deleteProduct(productId) {
      try {
        await ProductDataService.delete(productId);
        // Optionally, you can update the local state by removing the deleted product
        this.products.data = this.products.data.filter(
          (product) => product.id !== productId
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async deleteAllProducts() {
      try {
        await ProductDataService.deleteAll();
        // Optionally, you can update the local state by removing all products
        this.products.data = [];
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async findProductsByTitle(title) {
      this.products = { loading: true, data: null, error: null };
      try {
        const products = await ProductDataService.findByTitle(title);
        this.products = { loading: false, data: products, error: null };
      } catch (error) {
        this.products = { loading: false, data: null, error };
      }
    },
  },
});
