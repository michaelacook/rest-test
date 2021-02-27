const express = require("express")
const router = express.Router()

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({
    message: "Welcome to the Rest Test API",
  })
})

router.post("/", (req, res, next) => {
  res.json({
    body: req.body,
    query: req.query,
  })
})

module.exports = router
