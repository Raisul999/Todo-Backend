const Todo = require('../models/todoModel')


const createTodo = async (req, res) => {
        const { title, description, priority, deadline, isComplete } = req.body

        console.log(title, description)
        if (!title || !description || !priority || !deadline) {
                return res.status(400).json({ message: 'Please provide all fields' })
        }

        const todo = await Todo.create({
                user: req.user.id,
                title,
                description,
                priority,
                deadline,
                isComplete,
                // user: req.user.id 
        })

        return res.status(200).json(todo)

}

const getTodos = async (req, res) => {
        console.log('userID', req.user.id)
        const todos = await Todo.find({ user: req.user.id })

        return res.status(200).json(todos)
}


const updateTodo = async (req, res) => {
        console.log('inside update')
        const { id } = req.params

        console.log('updateID', id)

        const todo = await Todo.findById(id)

        console.log('Todo' ,'line 41', todo)

        if (!todo) {
                return res.status(400).json({ message: 'Todo not found' })
        }

        if (!req.user) {
                return res.status(401).json({ message: 'User not found' })
        }

        if (todo.user.toString() !== req.user.id) {
                return res.status(401).json({ message: 'User not authorized' });
        }

        const updateTodo = await Todo.findByIdAndUpdate(id, { title: req.body.title, description: req.body.description, priority: req.body.priority }, { new: true })

        console.log('update', updateTodo)
        return res.status(200).json(updateTodo)
}

const completeTodo = async (req, res) => {
        const { id } = req.params

        const todo = await Todo.findById(id)

        console.log('status', req.body.isComplete)

        console.log('Todo', todo)

        if (!todo) {
                return res.status(400).json({ message: 'Todo not found' })
        }

        if (!req.user) {
                return res.status(401).json({ message: 'User not found' })
        }

        if (todo.user.toString() !== req.user.id) {
                return res.status(401).json({ message: 'User not authorized' });
        }

        const updateTodo = await Todo.findByIdAndUpdate(id, { isComplete: req.body.isComplete}, { new: true })

        console.log('completeTodo', updateTodo)
        return res.status(200).json(updateTodo)
}

const deleteTodo = async (req, res) => {
        const { id } = req.params

        const todo = await Todo.findById(id)

        if (!todo) {
                return res.status(400).json({ message: 'Todo not found' })
        }

        if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
        }


        if (todo.user.toString() !== req.user.id) {
                return res.status(401).json({ message: 'User not authorized' });
        }

        await todo.remove()

        return res.status(200).json({ message: 'Todo deleted successfully' })


}


module.exports = {
        createTodo,
        getTodos,
        updateTodo,
        deleteTodo,
        completeTodo
}