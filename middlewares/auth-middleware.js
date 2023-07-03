const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const { request } = require("express");
require("dotenv").config();

module.exports = async (req, res, next) => {
  const { authorization } = req.cookies;
  // token 없으면
  if (!authorization) {
    return res.status(401).json({ errorMessage: "로그인 후에 이용가능합니다." });
  }
  const [tokenType, token] = authorization.split(" ");

  if (tokenType !== "Bearer" || !token) {
    return res.status(401).json({ errorMessage: "로그인 후에 이용가능합니다." });
  }

  try {
    let tokenErr = false;
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
      if (err) {
        tokenErr = true;

        switch (err.name) {
          case "TokenExpiredError":
            // token이 만료됨.
            // 클라이언트에 있는 jwt삭제
            res.clearCookie("authorization");
            return res.status(200).json({ message: "시간이 만료되어 로그아웃되었습니다." });
          default:
            //? token decoded 에러
            return res.status(400).json(`invalid token. error name: ${err.name}`);
        }
      }
      return decoded;
    });
    if (tokenErr) {
      //! token decoded error
      return;
    }

    const userId = decodedToken.userId;

    const user = await Users.findOne({ where: { userId } });

    if (!user) {
      return res.status(401).json({ errorMessage: "해당 유저가 존재하지 않습니다." });
    }
    res.locals.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      errorMessage: "비정상적인 접근입니다."
    });
  }
};
