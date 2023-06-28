const express = require("express");
const router = express.Router();
const { Posts } = require("../models");
const { Likes } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");

// 좋아요 추가하기
router.post("/:postId/like", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  const post = await Posts.findOne({
    where: { postId }
  });
  const isExLike = await Likes.findOne({
    where: { postId, userId }
  });
  console.log("isExLike = ", isExLike);
  if (!post) {
    return res.status(404).json({ errorMessage: "해당게시물이 존재하지 않습니다." });
  }
  if (isExLike) {
    return res.status(412).json({ errorMessage: "같은 게시물에 두번 좋아요를 할수 없습니다." });
  }
  await Likes.create({
    PostId: postId,
    UserId: userId
  });

  return res.status(200).json({ message: "좋아요를 눌렀습니다." });
});

// 좋이요 취소하기
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

module.exports = router;
