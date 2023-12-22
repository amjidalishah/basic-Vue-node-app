const { authJwt } = require("../middlewares");
const user = require("../controllers/user.controller");

module.exports = (app) => {
  var router = require("express").Router();

  // Create a new product
  router.post("/", [authJwt.verifyToken], user.create);

  // Retrieve all user
  router.get("/", [authJwt.verifyToken], user.findAll);

  // Retrieve a single product with id
  router.get("/:id", [authJwt.verifyToken], user.findOne);

  // Update a product with id
  router.put("/:id", [authJwt.verifyToken], user.update);

  // Delete a product with id
  router.delete("/:id", [authJwt.verifyToken], user.delete);

  // Create a new product
  router.delete("/", [authJwt.verifyToken], user.deleteAll);

  app.use("/api/users", router);
};
