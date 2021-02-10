const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const createError = require("http-errors")
const cors = require("cors")

const app = express()

// view engine setup
app.use(cors())
app.use(express.json())
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

/* Build and deployment */
app.use("/", express.static(path.join(__dirname, "./client/build")))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build", "index.html"))
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    res.status(err.status || 500).json({
      message: err.message,
      stack: err.stack,
    })
  } else {
    res.status(err.status || 500).json(err.message)
  }
})

module.exports = app
