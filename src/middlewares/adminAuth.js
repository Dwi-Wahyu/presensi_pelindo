function adminAuth(req, res, next) {
  if (req.session.isAuthenticated) {
    next()
  } else {
    res.redirect("/login")
  }
}

module.exports = adminAuth
