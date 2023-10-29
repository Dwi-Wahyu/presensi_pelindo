const adminRoutes = require("./AdminRoutes")
const pagesRouter = require("./PagesRoutes")
const apiRoutes = require("./ApiRoutes")

const adminAuth = require("../middlewares/adminAuth")

const Router = require("express").Router

const routes = Router()

routes.use("/", pagesRouter)

routes.use("/admin", adminAuth, adminRoutes)

routes.use("/api", apiRoutes)

module.exports = routes
