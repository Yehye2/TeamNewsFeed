const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 로그인
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // 해당email의 유저가 있는지 확인
  const user = await Users.findOne({
    where: { email },
  });
  // 유저가 존재하지 않으면
  if (!user) {
    return res.status(412).json({ message: "일치하는 회원정보가 없습니다. " });
  }

  // 암호화된 password를 comapareSync시켜서 입력받은 password와 비교
  const pwVerification = await bcrypt.compareSync(password, user.password);

  // 틀렸을 경우 아래의 에러처리
  if (!pwVerification) {
    return res.status(412).json({ message: "비밀번호가 일치하지 않습니다." });
  }

  // jwt를 생성
  // userId를 jwt로 감싸고 secretKey와 만료기간을 1시간으로 한다.
  const token = jwt.sign({ userId: user.userId }, "secretKey", {
    expiresIn: "1h",
  });

  // 입력한 패스워드와 저장된 패스워드가 맞는지 확인
  res.status(200).json({ message: "로그인되었습니다." });
});

// jwt를 생성
// userId

// 로그아웃
router.delete("/auth/login", (req, res) => {});

module.exports = router;
