const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const authTemplate = require("../template/authMail.js");

// 인증 이메일 보내기
router.post("/auth/mail", async (req, res) => {
  let authNum = Math.random().toString().substring(2, 6);

  function validateEmail(email) {
    const emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    return emailRegex.test(email);
  }

  const email = req.body.email;
  if (!validateEmail(email)) {
    return res.status(412).json({ errorMessage: "이메일 형식이 올바르지 않습니다." });
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
      console.log("==Error occurred==");
      console.log(error.message);
      return;
    }

    console.log("Message sent successfully!");
    console.log(nodemailer.getTestMessageUrl(info));
    res.status(200).send({ authNum });
  });
});

module.exports = router;
