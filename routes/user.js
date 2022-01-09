const { verifySignUp, authJwt } = require("../middleware");
const headerMiddleware = require("../middleware/header");
const express = require('express')
const router = express.Router()
const {signUp,signIn, updateSignUp} = require('../controllers/user')
const {createPost, getAllPosts, getPostByUserId,getPostByCatId ,deleteSinglePost, deleteAllPostByUserId, updatePost} = require('../controllers/post')
const {createComment, getAllCommentByPostId, deleteComment, deleteAllCommentByUserId, updateComment} = require('../controllers/comment')

// -------------------------CUSTOM ROUTE-------------------------
//posts
router.use(headerMiddleware.header);
router.post("/sign-up",[verifySignUp.checkDuplicateEmail], signUp);
router.post("/sign-in", [verifySignUp.checkUser], signIn);
router.post("/create-post", [authJwt.verifyToken], createPost);
router.get("/get-all-posts", [authJwt.verifyToken], getAllPosts);
router.get("/get-posts-by-userId/:userId", [authJwt.verifyToken], getPostByUserId);
router.get("/get-posts-by-catId/:catId", [authJwt.verifyToken], getPostByCatId);
router.delete("/del-single-post-userId/:id/:userId", [authJwt.verifyToken], deleteSinglePost);
router.delete("/del-posts-userId/:userId", [authJwt.verifyToken], deleteAllPostByUserId);
router.put("/update-post/:id", [authJwt.verifyToken], updatePost);
//comments
router.post("/create-comment/:postId", [authJwt.verifyToken], createComment);
router.get("/get-comments-by-postId/:postId", [authJwt.verifyToken], getAllCommentByPostId);
router.delete("/del-single-comment-userId/:id/:userId", [authJwt.verifyToken], deleteComment);
router.delete("/del-comments-userId/:userId", [authJwt.verifyToken], deleteAllCommentByUserId);
router.put("/update-comment/:id", [authJwt.verifyToken], updateComment);
//profile
router.put("/update-profile/:id", [authJwt.verifyToken, verifySignUp.updateEmail], updateSignUp);

// -------------------------EXPORT ROUTER-------------------------
module.exports = router