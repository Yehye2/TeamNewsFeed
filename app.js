const express = require("express");
const cookieParser = require("cookie-parser");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
// const postRouter = require("./routes/posts")
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use("/api", [usersRouter, authRouter]);

app.listen(PORT, () => {
  console.log(PORT, "포트 번호로 서버가 실행되었습니다.");
});
