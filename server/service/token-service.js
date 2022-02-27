const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token-model");

class TokenService {

    generateTokens(payload) {
      const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "30m" })
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" })
      return {
        accessToken,
        refreshToken
      }
    }

    async saveToken(userId, refreshToken) {
      const tokenData = await tokenModel.findOne({ user: userId })   // у нас на одного юзера один токен, поэтому если пользователь попробует
                                                                     // войти в приложение с другого устройства, то с первого устройства
                                                                     // его выкинет
      if (tokenData) {
        tokenData.refreshToken = refreshToken  // перезаписываем refreshToken
        return tokenData.save()
      }
      const token = await tokenModel.create({ user: userId, refreshToken })
      return token;
    }

    async removeToken(refreshToken) {
      const tokenData = await tokenModel.deleteOne({refreshToken});
      return tokenData;
    }

}

module.exports = new TokenService();
