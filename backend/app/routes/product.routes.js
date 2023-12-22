const { authJwt } = require("../middlewares");

module.exports = (app) => {
  const products = require("../controllers/product.controller.js");

  var router = require("express").Router();

  // Create a new product
  router.post("/", [authJwt.verifyToken], products.create);

  // Retrieve all products
  router.get("/", [authJwt.verifyToken], products.findAll);

  // Retrieve all published products
  router.get("/published", [authJwt.verifyToken], products.findAllPublished);

  // Retrieve a single product with id
  router.get("/:id", [authJwt.verifyToken], products.findOne);

  // Update a product with id
  router.put("/:id", [authJwt.verifyToken], products.update);

  // Delete a product with id
  router.delete("/:id", [authJwt.verifyToken], products.delete);

  // Create a new product
  router.delete("/", [authJwt.verifyToken], products.deleteAll);
  // Create a new product
  //router.delete("/", [authJwt.verifyToken], products.deleteAll);

  app.use("/api/products", router);
};
