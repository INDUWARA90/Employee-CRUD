const express = require('express');
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/authController');

const Router = express.Router();

Router.get('/', getAllUsers);
Router.get('/:id', getUserById);
Router.post('/', createUser);
Router.put('/:id', updateUser);
Router.delete('/:id', deleteUser);

module.exports = Router;