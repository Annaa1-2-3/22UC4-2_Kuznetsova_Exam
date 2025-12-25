const express = require('express');
const pool = require('../db');
const { hash } = require('../utils');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { login, password, fio, phone, email } = req.body;


  const errors = User.validate({ login, password, fio, phone, email });
  if (errors.length > 0) {
    return res.status(400).json({ error: errors[0] });
  }

  try {
    const userCheck = await pool.query(
      'SELECT id FROM users WHERE login = $1 OR email = $2',
      [login, email]
    );
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Логин или email уже заняты' });
    }

    const hashedPwd = hash(password);
    const result = await pool.query(
      `INSERT INTO users (login, password, fio, phone, email) 
      VALUES ($1, $2, $3, $4, $5) RETURNING id, login, fio`,
      [login, hashedPwd, fio, phone, email]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка регистрации' });
  }
});

router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ error: 'Логин и пароль обязательны' });
  }

  try {
    const result = await pool.query(
      'SELECT id, login, fio, password FROM users WHERE login = $1',
      [login]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    const user = result.rows[0];
    const hashedPwd = hash(password);

    if (user.password !== hashedPwd) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    delete user.password;
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка входа' });
  }
});

module.exports = router;