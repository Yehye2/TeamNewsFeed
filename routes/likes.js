const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");

// 좋아요 추가하기
router.post("/:postId/like", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  const post = await Posts.findOne({
    where: { postId }
  });

  if (!post) {
    return res.status(404).json({ errorMessage: "해당게시물이 존재하지 않습니다." });
  }

  await Likes.create({
    PostId: postId,
    UserId: userId
  });

  return res.status(200).json({ message: "좋아요를 눌렀습니다." });
});

// 좋아요 취소하기
router.delete("/:postId/unlike", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  const post = await Posts.findOne({
    where: { postId }
  });

  if (!post) {
    return res.status(404).json({ errorMessage: "해당게시물이 존재하지 않습니다." });
  }

  await Likes.destroy({
    where: {
      PostId: postId,
      UserId: userId
    }
  });
  return res.status(200).json({ message: "좋아요를 취소했습니다." });
});

// 좋아요 조회
router.get("/likes/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;

    const likes = await Likes.findAll({
      where: { PostId: postId }
    });
    res.status(200).json({ data: likes });
  } catch (error) {
    res.status(400).json({ errorMessage: "좋아요 조회에 실패했습니다." });
  }
});

module.exports = router;
