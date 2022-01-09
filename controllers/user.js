const User = require("../models").User
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { transporter } = require("../email/key");

module.exports = {
    // create account for user
    signUp: (req, res) => {
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            address: req.body.address,
            post_code: req.body.post_code,
            role: "SELF",
        }).then((user) => {
            var mailOptions = {
                from: 'info@gmail.com',
                to: user.email,
                subject: 'Login Details',
                text:'<Email>: '+ user.email+'<br>'+'<Password>: '+ req.body.password
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            return res.status(200).json({
                "message": "User created successfully",
                user
            })
        }).catch(err => {
            return res.status(400).json({ err })
        })
    },
    signIn: (req, res) => {
        console.log(req.body)
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then((user) => {
                if (!user) {
                    return res.status(404).send({ message: "User Not found." });
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
                    accessToken: token
                });
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            })
    },
    //update user profile
    updateSignUp: (req, res) => {
        let { name, email, address, post_code } = req.body
        let id = req.params.id
        User.findOne({
            where: { id: id }
        }).then(user => {
            if (user) {
                user.update({ name, email, address,post_code})
                    .then((updateUser) => {
                        return res.status(200).json({
                            "message": "User is updated successfully",
                            updateUser
                        })
                    })
            } else {
                return res.status(404).json({
                    "message": "User not found"
                })
            }
        }).catch(error => {
            return res.status(400).json({
                "error": error
            })
        })
    },
}