const ApiError = require("../exceptions/api-error");
const tokenService = require("../service/token-service");

module.exports = function(req, res, next) {
  try {
    const authorizationToken = req.headers.authorization;
    if (!authorizationToken) {
      return next(ApiError.UnAuthorizedError());
    }
    const accessToken = authorizationToken.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.UnAuthorizedError());
    }
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnAuthorizedError());
    }
    req.user = userData;
    next();
  } catch (e) {
    return next(ApiError.UnAuthorizedError());
  }
}
