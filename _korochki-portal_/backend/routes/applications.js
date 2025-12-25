const express = require('express');
const pool = require('../db');

const router = express.Router();

function parseDateDDMMYYYY(str) {
  const parts = str.split('.');
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts;
  const date = new Date(`${yyyy}-${mm}-${dd}`);
  return isNaN(date) ? null : date;
}

router.get('/', async (req, res) => {
  const userId = req.query.userId;
  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: 'userId обязателен' });
  }

  try {
    const result = await pool.query(
      `SELECT a.id, c.name AS course_name, 
      TO_CHAR(a.start_date, 'DD.MM.YYYY') AS start_date,
      a.payment_method, a.status
      FROM applications a
      JOIN courses c ON a.course_id = c.id
      WHERE a.user_id = $1
      ORDER BY a.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки заявок' });
  }
});

router.post('/', async (req, res) => {
  const { userId, course_id, start_date, payment_method } = req.body;

  if (!userId || !course_id || !start_date || !payment_method) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  const dateObj = parseDateDDMMYYYY(start_date);
  if (!dateObj) {
    return res.status(400).json({ error: 'Неверный формат даты (ДД.ММ.ГГГГ)' });
  }

  try {
    const course = await pool.query('SELECT id FROM courses WHERE id = $1', [course_id]);
    if (course.rows.length === 0) {
      return res.status(400).json({ error: 'Курс не найден' });
    }

    const result = await pool.query(
      `INSERT INTO applications (user_id, course_id, start_date, payment_method)
      VALUES ($1, $2, $3, $4) RETURNING id`,
      [userId, course_id, dateObj, payment_method]
    );

    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка подачи заявки' });
  }
});

router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ['Новая', 'Идет обучение', 'Обучение завершено'];
  if (!status || !allowed.includes(status)) {
    return res.status(400).json({ error: 'Некорректный статус' });
  }

  try {
    const result = await pool.query(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING id, status',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка обновления статуса' });
  }
});

module.exports = router;