const express = require("express");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const pageRouter = require("./public/router");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api", routes);
app.use("/", pageRouter);

app.listen(PORT, () => {
  console.log(PORT, "포트 번호로 서버가 실행되었습니다.");
});
