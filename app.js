const createError = require("http-errors")
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")

const indexRouter = require("./routes/index")
const usersRouter = require("./routes/users")

const app = express()

// in production serve create-react-app index.html
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")))
  app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"))
  })
}

// view engine setup
app.use(cors())
app.use(express.json())
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/users", usersRouter)

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
