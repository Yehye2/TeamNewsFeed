const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const { Users, Posts } = require("../models");

// 프로필 조회 API
router.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // userId를 직접 가져옵니다.

    const user = await Users.findOne({
      attributes: ["userId", "nickname", "description", "profileimage"],
      where: { userId }
    });
    // 해당 사용자의 존재 여부를 확인합니다.
    if (!user) {
      res.status(404).json({ errorMessage: "프로필을 찾을 수 없습니다." });
      return; // 추가된 return 문을 통해 함수 실행 종료
    }
    // 조회한 사용자 데이터를 응답합니다.
    res.json({ data: user });
  } catch (error) {
    console.log(error);
    // 오류가 발생한 경우 오류 메시지를 응답합니다.
    res.status(400).json({ errorMessage: "프로필 조회에 실패했습니다." });
  }
});

// 프로필 수정 API authMiddleware 일단 뺌
router.put("/users/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { nickname, profileImage, description } = req.body;
  const nickNameExp = /^[a-z0-9]{3,}$/;
  try {
    // userId를 기준으로 해당 사용자의 프로필을 조회합니다.
    const user = await Users.findOne({ where: { userId } });

    // 닉네임 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로 구성
    if (!nickNameExp.test(nickname)) {
      res.status(412).json({ errorMessage: "닉네임은 최소 3자이상, 알파벳 소문자 숫자를 포함하여야합니다." });
      return;
    }
    // 프로필을 업데이트합니다.
    if (nickname) await user.update({ nickname });
    if (profileImage) await user.update({ profileImage });
    if (description) await user.update({ description });
    // 확인 메시지를 응답합니다.
    res.json({ message: "프로필 수정에 성공했습니다." });
  } catch (error) {
    // 오류가 발생한 경우 오류 메시지를 응답합니다.
    res.status(400).json({ errorMessage: "프로필 수정에 실패했습니다." });
  }
});

// 게시글 목록 조회 API
router.get("/users/:userId/posts", async (req, res) => {
  const { userId } = req.params;

  try {
    const post = await Posts.findAll({
      where: { userId }
    });
    // 게시물의 존재 여부를 확인합니다.
    if (!post || post.length === 0) {
      // 게시물이 존재하지 않을 경우 에러 응답을 보냅니다.
      return res.status(404).json({ errorMessage: "작성한 게시물이 없습니다." });
    }
    // 조회된 게시물을 응답합니다.
    res.json({ data: post });
  } catch (error) {
    // 오류가 발생한 경우 오류 메시지를 응답합니다.
    res.status(400).json({ errorMessage: "게시물 조회에 실패했습니다." });
  }
});

module.exports = router; // router 모듈을 외부로 내보냅니다.
