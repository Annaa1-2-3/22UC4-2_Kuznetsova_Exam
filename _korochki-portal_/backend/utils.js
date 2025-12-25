function validateLogin(login) {
  return /^[a-zA-Z0-9]{6,}$/.test(login);
}

function validatePassword(password) {
  return password.length >= 8;
}

function validateFio(fio) {
  return /^[а-яА-Я\s]+$/.test(fio);
}

function validatePhone(phone) {
  return /^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(phone);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const crypto = require('crypto');
function hash(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

module.exports = {
  validateLogin,
  validatePassword,
  validateFio,
  validatePhone,
  validateEmail,
  hash
};