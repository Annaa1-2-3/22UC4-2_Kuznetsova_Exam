document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const login = document.getElementById('login').value.trim();
      const password = document.getElementById('password').value;

      const errorDiv = document.getElementById('error');

      if (!login || !password) {
        errorDiv.textContent = 'Логин и пароль обязательны';
        return;
      }

      try {
        const result = await api.login({ login, password });
        localStorage.setItem('user', JSON.stringify(result.user));
        window.location.href = 'dashboard.html';
      } catch (err) {
        errorDiv.textContent = err.message || 'Ошибка входа';
      }
    });
  }

  const regForm = document.getElementById('regForm');
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const login = document.getElementById('login').value.trim();
      const password = document.getElementById('password').value;
      const fio = document.getElementById('fio').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();

      const errors = {
        login: document.getElementById('err-login'),
        password: document.getElementById('err-password'),
        fio: document.getElementById('err-fio'),
        phone: document.getElementById('err-phone'),
        email: document.getElementById('err-email')
      };

      Object.values(errors).forEach(el => el.textContent = '');

      let valid = true;

      if (!utils.validateLogin(login)) {
        errors.login.textContent = 'Логин: 6+ латинских букв/цифр';
        valid = false;
      }

      if (!utils.validatePassword(password)) {
        errors.password.textContent = 'Пароль: минимум 8 символов';
        valid = false;
      }

      if (!utils.validateFio(fio)) {
        errors.fio.textContent = 'ФИО: только кириллица и пробелы';
        valid = false;
      }

      if (!utils.validatePhone(phone)) {
        errors.phone.textContent = 'Телефон: формат 8(XXX)XXX-XX-XX';
        valid = false;
      }

      if (!utils.validateEmail(email)) {
        errors.email.textContent = 'Некорректный email';
        valid = false;
      }

      if (!valid) return;

      try {
        const result = await api.register({ login, password, fio, phone, email });
        alert('Успешная регистрация!');
        window.location.href = 'index.html';
      } catch (err) {
        alert(err.message || 'Ошибка регистрации');
      }
    });
  }
});