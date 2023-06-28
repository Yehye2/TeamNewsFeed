// users.js

const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// 회원가입 API
router.post("/signup", async (req, res) => {
  try {
    const { email, nickname, password, confirmPassword } = req.body;

    // 이메일 중복 확인
    const existingEmail = await Users.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ errorMessage: "이미 존재하는 이메일입니다." });
    }

    // 닉네임 중복 확인
    const existingNickname = await Users.findOne({ where: { nickname } });
    if (existingNickname) {
      return res.status(409).json({ errorMessage: "이미 존재하는 닉네임입니다." });
    }

    // 비밀번호와 확인 비밀번호 일치 여부 확인
    if (password !== confirmPassword) {
      return res.status(400).json({ errorMessage: "비밀번호 확인이 일치하지 않습니다." });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 회원 정보 생성
    await Users.create({
      email,
      nickname,
      password: hashedPassword,
    });

    return res.status(200).json({ message: "회원가입이 완료되었습니다." });
  } catch (error) {
    console.error("회원가입에 실패하였습니다.", error);
    return res.status(500).json({ errorMessage: "회원가입에 실패하였습니다." });
  }
});

module.exports = router;
