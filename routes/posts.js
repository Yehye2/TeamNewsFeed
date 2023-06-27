const express = require('express');
const router = express.Router();
const { Posts } = require('../models');
const authMiddleware = require("../middlewares/auth-middleware");


router.post('/posts',authMiddleware, create);
router.get('/posts', getAll);
router.get('/posts/:postId', getOne);
router.put('/posts/:postId',authMiddleware, update);
router.delete('/posts/:postId',authMiddleware, remove);

async function create(req, res) {
  try {
    const { title, content } = req.body;
    const { userId: UserId, nickname } = res.locals.user;
    const post = new Posts({ UserId, nickname, title, content });

    if (!title || !content) {
      return res.status(412).json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
    }

    await post.save();

    // getAll API 호출
    getAll(req, res);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(400).json({
      message: '게시글 작성에 실패했습니다.',
    });
  }
}
async function getAll(req, res) {
  try {
    const posts = await Posts.findAll({
      attributes: ['postId', 'UserId', 'nickname', 'title', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ posts });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(400).json({
      errorMessage: '게시글 조회에 실패했습니다.',
    });
  }
}

async function getOne(req, res) {
  try {
    const { postId } = req.params;
    const post = await Posts.findOne({
      attributes: ['postId', 'UserId', 'nickname', 'title', 'content', 'createdAt', 'updatedAt'],
      where: { postId },
    });

    if (!post) {
      return res.status(400).json({ errorMessage: '게시글이 존재하지 않습니다.' });
    }

    res.status(200).json({ post });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(400).json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
  }
}

async function update(req, res) {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;
    const post = await Posts.findOne({ where: { postId } });

    if (!title || !content) {
      res.status(412).json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
      return;
    }

    if (!post) {
      res.status(404).json({ errorMessage: '게시글 조회에 실패하였습니다.' });
    } else {
      try {
        await Posts.update({ title, content }, { where: { postId } });
        // getAll API 호출
        getAll(req, res);
      } catch (error) {
        res.status(401).json({ errorMessage: '게시글이 정상적으로 수정되지 않았습니다.' });
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(400).json({ errorMessage: '게시글 수정에 실패했습니다.' });
  }
}

async function remove(req, res) {
  try {
    const { postId } = req.params;
    const post = await Posts.findOne({ where: { postId } });

    // 게시글이 존재하지 않을 경우 404
    if (!post) {
      return res.status(404).json({ errorMessage: '게시글 조회에 실패하였습니다.' });
    } else {
      try {
        await Posts.destroy({ where: { postId } });
        // getAll API 호출
        getAll(req, res);
      } catch (error) {
        res.status(401).json({ errorMessage: '게시글이 정상적으로 삭제되지 않았습니다.' });
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(400).json({ errorMessage: '게시글 삭제에 실패했습니다.' });
  }
}

module.exports = router;
