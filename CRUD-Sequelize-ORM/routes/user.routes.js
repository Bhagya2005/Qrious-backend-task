const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");

router.post("/users", controller.createUser);
router.get("/users", controller.getAllUsers);
router.get("/users/:id", controller.getUserById);
router.put("/users/:id", controller.updateUser);
router.delete("/users/:id", controller.deleteUser);
router.patch("/users/:id",controller.patchUser);

module.exports = router;
