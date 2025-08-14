const ApiToken = require("../models/ApiToken");
const { UnauthorizedError } = require("./ErrorHandling");

const middleware = async (req, res, next) => {
  const token = req.header("X-API-TOKEN");

  if (!token) {
    return next(new UnauthorizedError());
  }

  try {
    const existingUser = await ApiToken.findOne({
      where: { token: token },
    });

    console.log("Existing User:", existingUser);
    if (!existingUser) {
      return next(new UnauthorizedError());
    }
  } catch (error) {
    return next(new UnauthorizedError(error));
  }
  next();
};
module.exports = middleware;
