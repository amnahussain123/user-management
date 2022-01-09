const comment = require("../models").Comment
const checkPost = require("../models").Post
module.exports = {
    // create commment
    createComment: (req, res) => {
        let post = req.params.postId
        checkPost.findOne({
            where: {
                id: post
            }
        }).then((checkPost) => {
            if (checkPost == null) {
                return res.status(400).json({
                    "message": "Post is not found",
                })
            } else {
                comment.create({
                    userId: req.body.userId,
                    postId: post,
                    message: req.body.comment
                }).then((comment) => {
                    return res.status(200).json({
                        "message": "comment is created on post",
                        comment
                    })
                }).catch(err => {
                    return res.status(400).json({ err })
                })
            }
        })
    },
    // get all comments by post id
    getAllCommentByPostId: (req, res) => {
        comment.findAll({
            where: { postId: req.params.postId },
        }).then(comments => {
            return res.status(200).json({
                comments
            })
        }).catch(err => {
            return res.status(400).json({ err })
        })
    },
    // delete single comment by user id & id
    deleteComment: (req, res) => {
        let userId = req.params.userId
        let id = req.params.id
        comment.destroy({
            where: { id: id, userId: userId }
        }).then((comment) => {
            if (comment == 0) {
                return res.status(200).json({
                    "message": "You are not allowed to delete this comment"
                })
            } else {
                return res.status(200).json({
                    "message": "comment is deleted successfully"
                })
            }
        }).catch(err => {
            return res.status(400).json({
                err
            })
        })
    },
    // delete all comments by user id
    deleteAllCommentByUserId: (req, res) => {
        let userId = req.params.userId
        comment.destroy({
            where: { userId: userId }
        }).then(() => {
            return res.status(200).json({
                success: true,
                "message": "All your comments are deleted"
            })
        }).catch(err => {
            return res.status(400).json({
                err
            })
        })
    },
    // update comment
    updateComment: (req, res) => {
        let message = req.body.message
        let id = req.params.id
        let userId = req.body.userId
        comment.findOne({
            where: { id: id, userId:userId }
        }).then(comment => {
            if (comment) {
                comment.update({ message })
                    .then((updateComment) => {
                        return res.status(200).json({
                            "message": "Comment is updated successfully",
                            updateComment
                        })
                    })
            } else {
                return res.status(200).json({
                    "message": "comment not found"
                })
            }
        }).catch(error => {
            return res.status(400).json({
                "error": error
            })
        })
    },
}