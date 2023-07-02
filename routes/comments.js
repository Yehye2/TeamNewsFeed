const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");

router.post(`/posts/:postId/comments`, authMiddleware, async (req, res) => {
  const PostId = req.params.postId;
  const UserId = res.locals.user.dataValues.userId;
  try {
    const { comment } = req.body;

    if (!comment) {
      return res.status(404).json({ errorMessage: "댓글을 입력해주세요." });
    }
    await Comments.create({
      UserId,
      PostId,
      comment
    });
    res.status(200).json({ message: "댓글이 작성되었습니다." });
  } catch (error) {
    console.error(`Error: ${error.message}`);

    return res.status(400).json({
      message: "댓글 작성에 실패했습니다."
    });
  }
});

router.get("/posts/:postId/comments", async (req, res) => {
  const PostId = req.params.postId;

  const result = await Comments.findAll({
    where: { PostId },
    order: [["createdAt", "desc"]]
  });
  res.status(200).json({ data: result });
});

module.exports = router;
