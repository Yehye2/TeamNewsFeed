const express = require('express');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');

const usersRouter = require('./routes/users');
const profileRouter = require('./routes/profile.js');

app.use(express.json()); // 요청의 데이터를 JSON 형식으로 파싱하기 위한 미들웨어 설정
app.use(cookieParser()); // 쿠키 파싱을 위한 미들웨어 설정

app.use('/', [usersRouter, profileRouter]);

app.listen(port, () => {
  console.log(`${port}번 포트로 서버가 열려써요`); // 서버가 시작되면 콘솔에 포트 번호를 출력합니다.
});
