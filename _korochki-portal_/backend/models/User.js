const { validateLogin, validatePassword, validateFio, validatePhone, validateEmail } = require('../utils');

class User {
  constructor({ id, login, password, fio, phone, email }) {
    this.id = id;
    this.login = login;
    this.password = password;
    this.fio = fio;
    this.phone = phone;
    this.email = email;
  }

  static validate({ login, password, fio, phone, email }) {
    const errors = [];
    if (!validateLogin(login)) errors.push('Логин: 6+ латинских букв/цифр');
    if (!validatePassword(password)) errors.push('Пароль: мин 8 символов');
    if (!validateFio(fio)) errors.push('ФИО: только кириллица и пробелы');
    if (!validatePhone(phone)) errors.push('Телефон: формат 8(XXX)XXX-XX-XX');
    if (!validateEmail(email)) errors.push('Некорректный email');
    return errors;
  }
}

module.exports = User;