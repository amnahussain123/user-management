const db = require("../models");
const User = db.user;
checkDuplicateEmail = (req, res, next) => {
  // Email
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if ((req.body.email == '') || (req.body.name == '') || (req.body.password == '')) {
      res.status(400).send({
        message: "Failed! Email, Name & Password fields are required!"
      });
      return;
    } else if (user) {
      res.status(400).send({
        message: "Failed! Email is already in use!"
      });
      return;
    } else
      next();
  });
};
updateEmail = (req, res, next) => {
  // Email
  User.count({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user > 1) {
      res.status(400).send({
        message: "Failed! Email is already in use!"
      });
      return;
    } else if (req.body.email == '') {
      res.status(400).send({
        message: "Failed! Email field is required!"
      });
      return;
    }
    next();
  });
};
  checkUser = (req, res, next) => {
    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
       if (user['role']=='ADMIN') {
        res.status(400).send({
          message: "Unauthorized Access!"
        });
        return;
      } else
        next();
    });
  };
const verifySignUp = {
  checkDuplicateEmail: checkDuplicateEmail,
  updateEmail: updateEmail,
  checkUser:checkUser
};
module.exports = verifySignUp;