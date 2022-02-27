module.exports = class UserDto {         // dto - data transfer object
  email;
  id;
  isActivated;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;                  // mongoDB к названию поля id добавляет нижнее подчёркивание чтобы обозначить что поле не изменяемое
    this.isActivated = model.isActivated;
  }

}
