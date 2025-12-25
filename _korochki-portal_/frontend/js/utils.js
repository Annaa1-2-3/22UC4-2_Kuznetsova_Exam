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

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.getDate().toString().padStart(2, '0') + '.' +
(d.getMonth()+1).toString().padStart(2, '0') + '.' +
d.getFullYear();
}

function parseDateDDMMYYYY(str) {
  const parts = str.split('.');
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts;
  const date = new Date(`${yyyy}-${mm}-${dd}`);
  return isNaN(date) ? null : date;
}

window.utils = {
  validateLogin,
  validatePassword,
  validateFio,
  validatePhone,
  validateEmail,
  formatDate,
  parseDateDDMMYYYY
};