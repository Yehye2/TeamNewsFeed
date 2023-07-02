const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// 로그인
router.post("/auth/login", async (req, res) => {
  try {
    // 먼저 로그인 되어있으면
    const { authorization } = req.cookies;
    if (authorization) {
      return res.status(412).json({ errorMessage: "현재 로그인 상태입니다." });
    }
    const { email, password } = req.body;
    // 해당email의 유저가 있는지 확인
    const user = await Users.findOne({
      where: { email }
    });
    console.log(user);

    // 유저가 존재하지 않으면
    if (!user) {
      return res.status(412).json({ errorMessage: "일치하는 회원정보가 없습니다. " });
    }

    // 암호화된 password를 comapareSync시켜서 입력받은 password와 비교
    const pwVerification = await bcrypt.compareSync(password, user.password);

    // 입력한 패스워드와 저장된 패스워드가 맞는지 확인
    // 틀렸을 경우 아래의 에러처리
    if (!pwVerification) {
      return res.status(412).json({ errorMessage: "비밀번호가 일치하지 않습니다." });
    }

    // jwt를 생성
    // userId를 jwt로 감싸고 secretKey와 만료기간을 1시간으로 한다.
    const token = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: "1h"
    });

    // bearer타입으로 클라이언트에 token을 전달
    res.cookie("authorization", `Bearer ${token}`);
    return res.status(400).json({ message: "로그인되었습니다." });
  } catch (error) {
    return res.status(200).json({ errorMessage: error });
  }
});

// 로그아웃
router.post("/auth/logout", (req, res) => {
  try {
    const { authorization } = req.cookies;
    // authorization가 없으면
    if (!authorization) {
      return res.status(401).json({ errorMessage: "로그인상태가 아닙니다." });
    }
    // 클라이언트에 있는 jwt삭제
    res.clearCookie("authorization");
    return res.status(200).json({ message: "로그아웃되었습니다." });
  } catch (error) {
    return res.status(400).json({ errorMessage: "로그인상태가 아닙니다." });
  }
});

module.exports = router;
