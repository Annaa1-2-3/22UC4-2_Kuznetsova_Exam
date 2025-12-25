const express = require('express');
const pool = require('../db');

const router = express.Router();

router.post('/', async (req, res) => {
  const { application_id, text } = req.body;

  if (!application_id || !text || text.trim().length === 0) {
    return res.status(400).json({ error: 'ID заявки и текст отзыва обязательны' });
  }

  try {
    const appCheck = await pool.query(
      `SELECT status FROM applications WHERE id = $1`,
      [application_id]
    );

    if (appCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    if (appCheck.rows[0].status !== 'Обучение завершено') {
      return res.status(400).json({ error: 'Отзыв можно оставить только после завершения обучения' });
    }

    await pool.query(
      'INSERT INTO reviews (application_id, text) VALUES ($1, $2)',
      [application_id, text.trim()]
    );

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка добавления отзыва' });
  }
});

module.exports = router;