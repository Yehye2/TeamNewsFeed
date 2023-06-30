const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const postsRouter = require("./routes/posts"); // 게시글 라우터 모듈 경로에 따라 수정해주세요.
app.use("/", postsRouter);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
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
        MaxResults: 5,
        start: 1,
        SearchTarget: "Book",
        output: "js",
        Version: "20131101"
      }
    })
    .then(response => {
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

const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
