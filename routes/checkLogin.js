const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

router.get("/check-login", authMiddleware, (req, res) => {
  const user = res.locals.user;

  // 사용자 정보에 접근하여 필요한 정보를 반환합니다.
  res.json({
    isLoggedIn: true,
    user: {
      id: user.userId
    }
  });
});

module.exports = router;
