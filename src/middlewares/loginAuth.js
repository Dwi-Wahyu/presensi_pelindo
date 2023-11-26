function loginAuth(req, res, next) {
  if (req.session.isAuthenticated) {
    res.redirect("/admin")
  } else {
    next()
  }
}

module.exports = loginAuth
