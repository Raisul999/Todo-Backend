const express = require('express')
const router = express.Router()
const { createTodo, getTodos, updateTodo, deleteTodo, completeTodo } = require('../controllers/todoController')
const protect = require('../middlewares/authMiddleware')

router.get('/', protect, getTodos)
router.post('/', protect, createTodo)
router.post('/:id', protect, completeTodo)
router.put('/:id', protect, updateTodo)
router.delete('/:id', protect, deleteTodo)


module.exports = router