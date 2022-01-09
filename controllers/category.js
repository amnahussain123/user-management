const category = require("../models").Category
module.exports = {
    // create category
    createCategory: (req, res) => {
        category.create({
            name: req.body.name,
        }).then((category) => {
            return res.status(200).json({
                "message": "Category is created successfully",
                category
            })
        }).catch(err => {
            return res.status(400).json({ err })
        })
    },

}