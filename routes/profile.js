const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
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
    res.json(user);
  } catch (error) {
    // 오류가 발생한 경우 오류 메시지를 응답합니다.
    res.status(400).json({ errorMessage: "프로필 조회에 실패했습니다." });
  }
});

// 프로필 수정 API
router.patch("/users/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { nickname, profileImage, description, password, confirmPassword } = req.body;
  const nickNameExp = /^[a-z0-9]{3,}$/;
  const authorizedId = res.locals.user.dataValues.userId;

  try {
    // userId를 기준으로 해당 사용자의 프로필을 조회합니다.
    const user = await Users.findOne({ where: { userId } });
    const getUserNickname = await Users.findOne({ where: { nickname } });

    // 유효성검사
    if (authorizedId !== user.userId) {
      res.status(403).json({ errorMessage: "본인의 프로필만 수정할 수 있습니다." });
      return;
    }
    // 닉네임 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로 구성
    if (nickname.length !== 0 && !nickNameExp.test(nickname)) {
      res.status(412).json({ errorMessage: "닉네임은 최소 3자이상, 알파벳 소문자 숫자를 포함하여야합니다." });
      return;
    }
    // 비밀번호 확인
    if (password !== confirmPassword) {
      res.status(412).json({ errorMessage: "비밀번호와 비밀번호 확인이 일치하지 않습니다." });
      return;
    }
    if (getUserNickname) {
      res.status(412).json({ errorMessage: "닉네임이 중복됩니다." });
      return;
    }

    // 위의 패스워드 검증이 다 마치면 패스워드를 암호화 <- 있어야됩니다.
    const encryptedPW = await bcrypt.hash(password, saltRounds); // 비밀번호 암호화

    if (nickname) await user.update({ nickname });
    if (profileImage) await user.update({ profileImage });
    if (description) await user.update({ description });
    if (password) await user.update({ password: encryptedPW });

    // 확인 메시지를 응답합니다.
    res.json({ message: "프로필 수정에 성공했습니다." });
  } catch (error) {
    console.log(error);

    // 오류가 발생한 경우 오류 메시지를 응답합니다.
    res.status(400).json({ errorMessage: "프로필 수정에 실패했습니다." });
  }
});

// 게시글 목록 조회 API
router.get("/users/:userId/posts", async (req, res) => {
  const { userId } = req.params;

  try {
    const post = await Posts.findAll({
      where: { UserId: userId },
      order: [["createdAt", "desc"]]
    });
    // 게시물의 존재 여부를 확인합니다.
    if (!post || post.length === 0) {
      // 게시물이 존재하지 않을 경우 에러 응답을 보냅니다.
      console.log("작성한 게시물이 없습니다.");
    }
    // 조회된 게시물을 응답합니다.
    res.status(200).json(post);
  } catch (error) {
    console.log(error);

    // 오류가 발생한 경우 오류 메시지를 응답합니다.
    res.status(400).json({ errorMessage: "게시물 조회에 실패했습니다." });
  }
});

module.exports = router; // router 모듈을 외부로 내보냅니다.
