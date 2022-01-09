const post = require("../models").Post
const checkComment = require("../models").Comment
const category = require("../models").category

module.exports = {
    // create post
    createPost: (req, res) => {
        post.create({
            title: req.body.title,
            content: req.body.content,
            userId: req.body.userId,
            catId: req.body.category

        }).then((post) => {
            return res.status(201).json({
                "message": "Post is created successfully",
                post
            })
        }).catch(err => {
            return res.status(400).json({ err })
        })
    },
     // update post
     updatePost: (req, res) => {
        let title = req.body.title
        let content = req.body.content
        let id = req.params.id
        let userId = req.body.userId
        post.findOne({
            where: { id: id, userId:userId }
        }).then(post => {
            if (post) {
                post.update({title, content })
                    .then((updatePost) => {
                        return res.status(200).json({
                            "message": "Post is updated successfully",
                            updatePost
                        })
                    })
            } else {
                return res.status(200).json({
                    "message": "post not found"
                })
            }
        }).catch(error => {
            return res.status(400).json({
                "error": error
            })
        })
    },
    // get all posts
    getAllPosts: (req, res) => {
        post.findAll({
            attributes: ['id', 'title', 'content', 'catId'],
            limit: 5,
            order: [['id', 'DESC']],
            include: [{ 
                model: checkComment,
                as: 'comments'
              }]
        }).then(posts => {
            return res.status(200).json({
                posts
            })
        }).catch(err => {
            return res.status(400).json({ err })
        })
    },
    // get posts by user id
    getPostByUserId: (req, res) => {
        let userId = req.params.userId
        post.findAll({
            where: { userId: userId },
            include: [{ 
                model: checkComment,
                as: 'comments'
              }]
        }).then((posts) => {
            return res.status(200).json({ posts })
        }).catch(err => {
            return res.status(400).json({ err })
        })
    },
    // get single post by user id
    getPostByCatId: (req, res) => {
        let catId = req.params.catId
        post.findAll({
            where: { catId: catId },
            include: [{ 
                model: category,
                as: 'category'
              }]
        }).then((posts) => {
            return res.status(200).json({ posts })
        }).catch(err => {
            return res.status(400).json({ err })
        })
    },
    // delete post by id & user id
    deleteSinglePost: (req, res) => {
        let id = req.params.id
        let userId = req.params.userId
        checkComment.destroy({
            where: {
                postId: id
            }
        }).then(() => {
            post.destroy({
                where: { id: id, userId: userId }
            }).then((post) => {
                if (post == 0) {
                    return res.status(200).json({
                        "message": "You are not allowed to delete this post"
                    })
                } else {
                    return res.status(200).json({
                        "message": "post is deleted with comments successfully"
                    })
                }
            }).catch(err => {
                return res.status(400).json({ err })
            })

        })
    },
    // delete all posts
    deleteAllPostByUserId: (req, res) => {
        let userId = req.params.userId
        checkComment.destroy({
            where: {
                userId: userId
            }
        }).then(() => {
            post.destroy({
                where: { userId: userId }
            }).then(() => {
                return res.status(200).json({
                    success: true,
                    "message": "All your posts & relevant comments are deleted"
                })
            }).catch(err => {
                return res.status(400).json({
                    err
                })
            })
        })
    },
}