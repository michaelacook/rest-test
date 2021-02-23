const express = require("express")
const router = express.Router()

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({
    message: "Welcome to the Rest Test API",
  })
})

router.post("/", (req, res, next) => {
  res.json(req.body)
})

module.exports = router
