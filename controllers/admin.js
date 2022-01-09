const User = require("../models").User
const post = require("../models").Post
const comment = require("../models").Comment
var bcrypt = require("bcryptjs");
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
module.exports = {
    // create account for user
    signUpAdmin: (req, res) => {
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            role: "ADMIN",
        }).then((user) => {
            return res.status(200).json({
                "message": "Admin is created successfully",
                user
            })
        }).catch(err => {
            return res.status(400).json({ err })
        })
    },
    signInAdmin: (req, res) => {
        console.log(req.body)
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then((user) => {
                if (!user) {
                    return res.status(404).send({ message: "Admin with this email is not found." });
                }
                var passwordIsValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                );
                if (!passwordIsValid) {
                    return res.status(401).send({
                        accessToken: null,
                        message: "Invalid Password!"
                    });
                }
                var token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: 86400 // 24 hours
                });
                res.status(200).send({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    accessToken: token
                });
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            })
    },
      // get all users
      getAllUsers: (req, res) => {
        User.findAll({
             attributes: ['name', 'email', 'role'],
            where: {role: 'SELF'},
            order: [['id', 'DESC']],
            include: [{ 
                model: post,
                as: 'posts',
                include: [{ 
                    model: comment, 
                    as: 'comments' //here is goes the alias of the association
                  }],
              }]
        }).then(users => {
            return res.status(200).json({
                users
            })
        }).catch(err => {
            return res.status(400).json({ err })
        })
    },
}