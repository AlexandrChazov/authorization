const UserModel = require("../models/user-model.js");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("../service/token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");

class UserService {

  async registration(email, password) {
      const candidate = await UserModel.findOne({ email })
      if (candidate) {
        throw ApiError.BadRequest(`User with email ${email} already exists`)
      }
      const hashedPassword = await bcrypt.hash(password, 7);
      const activationLink = uuid.v4();                          // генерируется рандомная строка типа "v34fa-asfasf-142saf-sa-asf"

      const user = await UserModel.create({ email, password: hashedPassword, activationLink });
      // await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

      const userDto = new UserDto(user);            // т.о. в payload мы поместим данные: { email, id, isActivated }
                                                    // dto-шка нужна чтобы выбрать данные из объекта, так как не все данные мы хотим помещать
                                                    // в токен, пароль уж точно не следует
      const tokens = tokenService.generateTokens({ ...userDto })  // передаём в функцию обычный объект а не инстанс
      await tokenService.saveToken(userDto.id, tokens.refreshToken)
      return {...tokens, user: userDto}
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink })
    if (!user) {
      throw ApiError.BadRequest("Incorrect activation link ")
    }
    user.isActivated = true;
    await user.save()
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest(`User with email ${email} not found`)
    }
    const isPassEqual = await bcrypt.compare(password, user.password)
    if (!isPassEqual) {
      throw ApiError.BadRequest(`Incorrect password`)
    }
    const userDto = new UserDto(user);            // т.о. в payload мы поместим данные: { email, id, isActivated }
                            // dto-шка нужна чтобы выбрать данные из объекта, так как не все данные мы хотим помещать
                            // в токен, пароль уж точно не следует
    const tokens = tokenService.generateTokens({ ...userDto })  // передаём в функцию обычный объект а не инстанс
    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return {...tokens, user: userDto}
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnAuthorizedError()
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDB) {
      throw ApiError.UnAuthorizedError();
    }
    const user = await UserModel.findById(userData.id)
    const userDto = new UserDto(user);            // т.о. в payload мы поместим данные: { email, id, isActivated }
                            // dto-шка нужна чтобы выбрать данные из объекта, так как не все данные мы хотим помещать
                            // в токен, пароль уж точно не следует
    const tokens = tokenService.generateTokens({ ...userDto })  // передаём в функцию обычный объект а не инстанс
    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return {...tokens, user: userDto}
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }

}

module.exports = new UserService();
