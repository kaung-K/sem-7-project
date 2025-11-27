const User = require("../models/User")

module.exports = async function getUser(req, res, next) {
  const userId = req.cookies?.userId
  if (!userId) {
    req.user = null
    return next()
  }

  try {
    const user = await User.findById(userId)
    req.user = user || null
  } catch (err) {
    req.user = null
  }

  next()
}
