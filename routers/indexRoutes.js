const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const adminRouteProtect = require("../middlewares/adminProtect");
const router = express.Router();

router.post("/login", authController.login);
router.post("/admin/signup", authController.signup);

router.use(adminRouteProtect);

router.post("/admin/user", userController.createUser);

module.exports = router;
