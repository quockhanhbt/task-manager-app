import pool from '../db.js';

const VALID_STATUSES = ['todo', 'in-progress', 'done'];

export async function getAllTasks(req, res, next) {
  try {
    const { status } = req.query;
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const { rows } = status
      ? await pool.query(
          'SELECT * FROM tasks WHERE user_id = $1 AND status = $2 ORDER BY created_at DESC',
          [req.user.id, status]
        )
      : await pool.query(
          'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
          [req.user.id]
        );

    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
}

export async function getTaskById(req, res, next) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Task not found' });
    res.json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const { title, description, status = 'todo', due_date, assignee } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Title is required' });
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const { rows } = await pool.query(
      `INSERT INTO tasks (title, description, status, due_date, assignee, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title.trim(), description ?? null, status, due_date ?? null, assignee ?? null, req.user.id]
    );
    res.status(201).json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const { title, description, status, due_date, assignee } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (title !== undefined)       { fields.push(`title = $${idx++}`);       values.push(title.trim()); }
    if (description !== undefined) { fields.push(`description = $${idx++}`); values.push(description); }
    if (status !== undefined)      { fields.push(`status = $${idx++}`);      values.push(status); }
    if (due_date !== undefined)    { fields.push(`due_date = $${idx++}`);    values.push(due_date); }
    if (assignee !== undefined)    { fields.push(`assignee = $${idx++}`);    values.push(assignee); }

    if (!fields.length) return res.status(400).json({ error: 'No fields to update' });

    // Fetch current values to diff against
    const { rows: current } = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (!current.length) return res.status(404).json({ error: 'Task not found' });
    const before = current[0];

    values.push(req.params.id, req.user.id);
    const { rows } = await pool.query(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${idx} AND user_id = $${idx + 1} RETURNING *`,
      values
    );
    if (!rows.length) return res.status(404).json({ error: 'Task not found' });
    const after = rows[0];

    // Record a history entry for each changed field
    const TRACKED = ['title', 'description', 'status', 'due_date', 'assignee'];
    const historyRows = TRACKED
      .filter((f) => req.body[f] !== undefined)
      .filter((f) => String(before[f] ?? '') !== String(after[f] ?? ''))
      .map((f) => [after.id, f, before[f] ?? null, after[f] ?? null]);

    if (historyRows.length) {
      const placeholders = historyRows.map((_, i) =>
        `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`
      ).join(', ');
      await pool.query(
        `INSERT INTO task_history (task_id, field, old_value, new_value) VALUES ${placeholders}`,
        historyRows.flat()
      );
    }

    res.json({ data: after });
  } catch (err) {
    next(err);
  }
}

export async function getTaskHistory(req, res, next) {
  try {
    const { rows: task } = await pool.query(
      'SELECT id FROM tasks WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (!task.length) return res.status(404).json({ error: 'Task not found' });

    const { rows } = await pool.query(
      'SELECT * FROM task_history WHERE task_id = $1 ORDER BY changed_at DESC',
      [req.params.id]
    );
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const { rows } = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Task not found' });
    res.json({ data: { id: rows[0].id } });
  } catch (err) {
    next(err);
  }
}
