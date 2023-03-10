const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
        user:{
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
        },
        title: {
                type: String,
                required: [true, 'Please add a title']
        },
        description: {
                type: String,
                required: [true, 'Please add a description'],

        },
        priority: {
                type: String,
                required: [true, 'Please add a priority']
        },
        deadline:{
               type: Date,
               required: [true, 'Please add a deadline date']
        },
        isComplete: {
                type: Boolean,
                default: false
        }
},
        {
                timestamps: true,
        }

)

module.exports = mongoose.model('Todo', todoSchema)