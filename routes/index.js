const express = require("express");
const router = express.Router();

const usersRouter = require("./users");
const authRouter = require("./auth");
const profileRouter = require("./profile");
const postsRouter = require("./posts");
const likesRouter = require("./likes");
const followRouter = require("./followers");
const emailAuthRouter = require("./emailAuth");
const checkLoginRouter = require("./checkLogin");
const commentRouter = require("./comments");

router.use("/", [usersRouter, profileRouter, authRouter, postsRouter, followRouter, likesRouter, emailAuthRouter, checkLoginRouter, commentRouter]);

module.exports = router;
