const express = require("express");
const router = express.Router();
const { Users, UserInfos } = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const bcrypt = require("bcrypt");
const saltRounds = 10;

// 회원가입 API
router.post("/users/signup", async (req, res) => {
  try {
    const passwordExp = /^[^]{4,}$/; // 아무값[^]
    const nickNameExp = /^[a-z0-9]{3,}$/;
    // req.body로 받아오기
    const { email, nickname, password, confirmPassword } = req.body;
    // const { email, nickname, password, confirmPassword, verifiedEmail } = req.body;
    console.log(
      "🚀 ~ file: users.js:17 ~ router.post ~ email, nickname, password, confirmPassword, verifiedEmail:",
      email,
      nickname,
      password,
      confirmPassword
      // ,verifiedEmail
    );
    // 중복되는 닉네임과 이메일검사
    const isExistUser = await Users.findOne({
      where: {
        email: email
      }
    });
    const isExistNick = await Users.findOne({
      where: {
        nickname: nickname
      }
    });

    // email이나 nickname이 중복이 되는 유저가 있을 경우
    // email중복확인
    if (isExistUser) {
      return res.status(409).json({ errorMessage: "이미 존재하는 회원입니다." });
    }
    if (isExistNick) {
      return res.status(412).json({ errorMessage: "이미 존재하는 닉네임입니다." });
    }

    // 닉네임 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로 구성
    if (!nickNameExp.test(nickname)) {
      res.status(412).json({
        errMsg: "닉네임은 최소 3자이상, 알파벳 숫자 조합이어야합니다."
      });
    }

    // if (verifiedEmail === 0) {
    //   res.status(412).json({ errorMessage: "이메일을 인증해주세요." });
    //   return;
    // }

    // 패스워드는 최소 4자, 닉네임과 같은 값이 포함되어ㅏ 있으면 에러

    if (!passwordExp.test(password)) {
      res.status(412).json({ errorMessage: "패스워드는 최소 4자리 이상이어야합니다." });

      return;
    }
    if (password.includes(nickname)) {
      res.status(412).json({ errorMessage: "패스워드안에 닉네임이 포함되어있으면 안됩니다." });
      return;
    }

    // password와 confirmPassword를 확인
    // 패스워드와 패스워드 확인 검증
    if (password !== confirmPassword) {
      res.status(412).json({ errorMessage: "비밀번호확인이 일치하지 않습니다." });
      return;
    }

    // 위의 패스워드 검증이 다 마치면 패스워드를 암호화
    const encryptedPW = await bcrypt.hashSync(password, saltRounds); //비밀번호 암호화

    // 유저테이블에 이메일 암호화된 패스워드 닉네임을 저장
    await Users.create({
      email: email,
      password: encryptedPW,
      nickname: nickname
    });
    return res.status(200).json({ message: "회원가입이 완료되었습니다." });
  } catch (error) {
    console.log(error);

    return res.status(400).json({ errorMessage: "회원가입에 실패하였습니다." });
  }
});

module.exports = router; // router 모듈을 외부로 내보냅니다.
