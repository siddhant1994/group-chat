const express = require("express");
const userController = require("../controllers/userController");
const groupController = require("../controllers/groupController");
const chatController = require("../controllers/chatController");
const protect = require("../middlewares/protect");

const router = express.Router();

router.use(protect); //  protect all router which are comming after this middleware
router.get("/user", userController.getAllUsers);

router.post("/group", groupController.createGroup);
router.get("/group", groupController.getGroupList);
router.get("/group/:name", groupController.getGroupDetails);

router.post("/chat", chatController.sendMessage);
router.post("/chat/like", chatController.likeMessage);
router.get("/chat", chatController.getGroupChat);


module.exports = router;
