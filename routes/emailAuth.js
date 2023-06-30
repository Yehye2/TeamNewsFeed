const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const authTemplate = require("../template/authMail.js");
const { Users } = require("../models");

// 인증 이메일 보내기
router.post("/auth/mail", async (req, res) => {
  try {
    const email = req.body.email;
    let authNum = Math.random().toString().substring(2, 6);

    const isExistUser = await Users.findOne({
      where: {
        email: email
      }
    });

    function validateEmail(email) {
      const emailRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
      return emailRegex.test(email);
    }

    if (!validateEmail(email)) {
      return res.status(412).json({ errorMessage: "이메일 형식이 올바르지 않습니다." });
    }

    if (isExistUser) {
      return res.status(409).json({ errorMessage: "이미 가입된 이메일입니다." });
    }

    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
      }
    });

    let message = {
      from: `뉴스피드 프로젝트`,
      to: email,
      subject: `이메일 확인 코드: ${authNum}`,
      html: authTemplate(authNum)
    };

    await transporter.sendMail(message, (error, info) => {
      if (error) {
        return console.log(error.message);
      }
    });
    res.status(200).json({ authNum });
  } catch (error) {
    res.status(400).send({ errorMessage: "이메일 전송에 실패했습니다." });
  }
});

module.exports = router;
