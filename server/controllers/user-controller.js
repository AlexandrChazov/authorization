const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");

class UserController {

  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()))
      }
      const { email, password } = req.body;
      const userData = await userService.registration(email, password);
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true });
                                                    // ВАЖНО!!!  "httpOnly: true - для того, чтобы"
                                                   // эту куку нельзы было получать и изменять внутри браузера
                                                   // если у нас https тогда можно добавить ещё флаг secure: true
      return res.json(userData)
    } catch(e) {
      next(e)                // вызывая функцию next с ошибкой мы попадаем в errorMiddleware
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true });
                                                  // ВАЖНО!!!  "httpOnly: true - для того, чтобы"
                                                  // эту куку нельзы было получать и изменять внутри браузера
                                                  // если у нас https тогда можно добавить ещё флаг secure: true
      return res.json(userData)

    } catch(e) {
      next(e)                 // вызывая функцию next с ошибкой мы попадаем в errorMiddleware
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");    // удаляем куку с рефреш токеном
      return res.json(token)
    } catch(e) {
      next(e)                 // вызывая функцию next с ошибкой мы попадаем в errorMiddleware
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL); // после того, как пользователь перешёл по ссылке нам нужно редиректнуть его
    } catch(e) {                                    // на фронтенд
      next(e)                // вызывая функцию next с ошибкой мы попадаем в errorMiddleware
    }
  }

  async refresh(req, res, next) {
    try {

    } catch(e) {

    }
  }

  async getUsers(req, res, next) {
    try {
      res.json({ message: "There are users" })
    } catch(e) {

    }
  }

}

module.exports = new UserController();
