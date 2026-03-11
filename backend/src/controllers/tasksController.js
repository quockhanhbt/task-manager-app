import pool from '../db.js';

const VALID_STATUSES = ['todo', 'in-progress', 'done'];

export async function getAllTasks(req, res, next) {
  try {
    const { status } = req.query;
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const { rows } = status
      ? await pool.query('SELECT * FROM tasks WHERE status = $1 ORDER BY created_at DESC', [status])
      : await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');

    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
}

export async function getTaskById(req, res, next) {
  try {
    const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Task not found' });
    res.json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const { title, description, status = 'todo', due_date } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Title is required' });
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const { rows } = await pool.query(
      `INSERT INTO tasks (title, description, status, due_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title.trim(), description ?? null, status, due_date ?? null]
    );
    res.status(201).json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const { title, description, status, due_date } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    // Build dynamic SET clause from provided fields only
    const fields = [];
    const values = [];
    let idx = 1;

    if (title !== undefined)       { fields.push(`title = $${idx++}`);       values.push(title.trim()); }
    if (description !== undefined) { fields.push(`description = $${idx++}`); values.push(description); }
    if (status !== undefined)      { fields.push(`status = $${idx++}`);      values.push(status); }
    if (due_date !== undefined)    { fields.push(`due_date = $${idx++}`);    values.push(due_date); }

    if (!fields.length) return res.status(400).json({ error: 'No fields to update' });

    values.push(req.params.id);
    const { rows } = await pool.query(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    if (!rows.length) return res.status(404).json({ error: 'Task not found' });
    res.json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const { rows } = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Task not found' });
    res.json({ data: { id: rows[0].id } });
  } catch (err) {
    next(err);
  }
}
