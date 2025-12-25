const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/applications', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, u.fio, c.name AS course_name,
      TO_CHAR(a.start_date, 'DD.MM.YYYY') AS start_date,
      a.payment_method, a.status
      FROM applications a
      JOIN users u ON a.user_id = u.id
      JOIN courses c ON a.course_id = c.id
      ORDER BY a.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки заявок (админ)' });
  }
});

module.exports = router;