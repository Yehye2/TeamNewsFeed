const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const { Follower, Users } = require("../models"); // 팔로워 모델과 사용자 모델을 가져옵니다.

// 팔로우 API
router.post("/users/:targetUserId/follow", authMiddleware, async (req, res) => {
  try {
    const targetUserId = parseInt(req.params.targetUserId); // URL 파라미터에서 targetUserId를 가져옵니다.
    const followerId = res.locals.user.dataValues.userId; // 현재 로그인한 사용자의 userId를 가져옵니다.
    console.log(followerId);

    // 팔로워 관계 생성
    await Follower.create({
      followerId,
      followingId: targetUserId
    });

    res.status(200).json({ message: "팔로우를 성공 했습니다." });
  } catch (error) {
    res.status(400).json({ errorMessage: "알 수 없는 에러가 발생했습니다." });
  }
});

// 사용자 팔로워 수 조회 API
router.get("/users/:userId/followers", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    const getFollowers = await Follower.findAll({ where: { followingId: userId } });

    res.status(200).json({ getFollowers });
  } catch (error) {
    res.status(400).json({ errorMessage: "알 수 없는 에러가 발생했습니다." });
  }
});

module.exports = router; // router 모듈을 외부로 내보냅니다.
