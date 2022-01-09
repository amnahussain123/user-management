const { verifySignUp, authJwt } = require("../middleware");
const headerMiddleware = require("../middleware/header");
const express = require('express')
const router = express.Router()
const {signUpAdmin,signInAdmin, getAllUsers} = require('../controllers/admin')
const {createCategory} = require('../controllers/category')

// -------------------------CUSTOM ROUTE-------------------------
router.use(headerMiddleware.header);
router.post("/sign-up",[verifySignUp.checkDuplicateEmail], signUpAdmin);
router.post("/sign-in", signInAdmin);
router.post("/add-category", [authJwt.verifyToken], createCategory);
router.get("/all-users", [authJwt.verifyToken], getAllUsers);

// -------------------------EXPORT ROUTER-------------------------
module.exports = router