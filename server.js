const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const connectDB = require('./config/db')


connectDB()
const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/todo', require('./routes/todoRoutes'))

app.get('/', (req,res)=>{
   res.send("Hello World")
})

const PORT = 5000
app.listen(PORT, ()=>{
        console.log(`Server listening on port ${PORT}`)
})