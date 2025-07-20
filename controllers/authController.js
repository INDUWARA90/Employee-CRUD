const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getAllUsers = (req, res) => {
  const sql = 'SELECT id, name, email, role FROM users';

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.status(200).json({ users: results });
  });
};


exports.getUserById = (req, res) => {
  const userId = req.params.id;

  db.query('SELECT id, name, email, role FROM users WHERE id = ?', [userId], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user: result[0] });
  });
};


exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, email, hashedPassword, role || "employee"], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Registration failed" });
      }
      res.status(201).json({ message: "User registered successfully"});
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.updateUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const userId = req.params.id;

  try {
    let sql = '';
    let values = [];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql = `UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?`;
      values = [name, email, hashedPassword, role, userId];
    } else {
      sql = `UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?`;
      values = [name, email, role, userId];
    }

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Update failed" });
      }
      res.status(200).json({ message: "User updated successfully" });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete user by ID
exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  db.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error during deletion" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  });
};
