const jwt = require("jsonwebtoken");
const { RequestError } = require("../helpers");
const { User } = require("../models");
const { JWT_SECRET_KEY } = process.env;

const auth = async (req, _, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  try {
    if (bearer !== "Bearer") {
      throw RequestError(401, "Not authorized");
    }
    const { id } = jwt.verify(token, JWT_SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token) {
      throw RequestError(401, "Not authorized");
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.message === "invalid signature") {
      error.status = 401;
    }
    next(error);
  }
};

module.exports = auth;
