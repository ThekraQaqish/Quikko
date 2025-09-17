const pool = require('../../config/db');

// ✅ Get all CMS pages/banners
exports.getAllCMS = async (req, res) => {
  try {
    const { status } = req.query; // optional filter by status
    let query = 'SELECT * FROM cms';
    let params = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';
    const { rows } = await pool.query(query, params);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Create CMS page/banner
exports.createCMS = async (req, res) => {
  try {
    const { title, content, type, image_url, status } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO cms (title, content, type, image_url, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, content, type, image_url, status || 'active']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update CMS content
exports.updateCMS = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type, image_url, status } = req.body;
    const { rows } = await pool.query(
      `UPDATE cms
       SET title=$1, content=$2, type=$3, image_url=$4, status=$5, updated_at=NOW()
       WHERE id=$6
       RETURNING *`,
      [title, content, type, image_url, status || 'active', id]
    );

    if (!rows[0]) return res.status(404).json({ error: 'CMS record not found' });
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete CMS content
exports.deleteCMS = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM cms WHERE id=$1', [id]);

    if (!rowCount) return res.status(404).json({ error: 'CMS record not found' });
    res.status(200).json({ message: 'CMS record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
