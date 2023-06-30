const express = require("express");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const postsRouter = require("./routes/posts");
const likesRouter = require("./routes/likes");
const followRouter = require("./routes/followers");
const emailAuthRouter = require("./routes/emailAuth");
const path = require("path");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api", [usersRouter, profileRouter, authRouter, postsRouter, followRouter, likesRouter, emailAuthRouter]);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/search", (req, res) => {
  const query = req.query.q;

  axios
    .get("http://www.aladin.co.kr/ttb/api/ItemSearch.aspx", {
      params: {
        ttbkey: "ttbtiwh11427001",
        Query: query,
        QueryType: "Title",
        MaxResults: 10,
        start: 1,
        SearchTarget: "Book",
        output: "js", // JSON 형식의 응답을 요청
        Version: "20131101"
      }
    })
    .then(response => {
      console.log(response.data); // API 응답 데이터 확인

      const books = response.data.item;

      if (books && books.length > 0) {
        res.json(books);
      } else {
        res.json({ message: "No books found." });
      }
    })
    .catch(error => {
      console.error("Error searching books:", error);
      res.status(500).json({ error: "An error occurred while searching books." });
    });
});

app.get("/bestsellers", (req, res) => {
  axios
    .get("http://www.aladin.co.kr/ttb/api/ItemList.aspx", {
      params: {
        ttbkey: "ttbtiwh11427001",
        QueryType: "BestSeller",
        MaxResults: 10,
        start: 1,
        SearchTarget: "Book",
        output: "js",
        Version: "20131101"
      }
    })
    .then(response => {
      console.log("Aladin API response:", response.data); // API 응답 확인

      const bestsellers = response.data.item;

      if (bestsellers && bestsellers.length > 0) {
        res.json(bestsellers);
      } else {
        res.json({ message: "No bestsellers found." });
      }
    })
    .catch(error => {
      console.error("Error fetching bestsellers:", error);
      res.status(500).json({ error: "An error occurred while fetching bestsellers." });
    });
});

app.listen(PORT, () => {
  console.log(PORT, "포트 번호로 서버가 실행되었습니다.");
});
