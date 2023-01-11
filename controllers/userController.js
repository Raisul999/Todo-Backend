const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')

const registerUser = async (req, res) => {
        const { name, email, password } = req.body

        // console.log('reg',name, email, password)

        if (!name || !email || !password) {
                return res.status(400).json({
                        message: "Please enter all fields"
                })
        }

        const userExists = await User.findOne({ email })

        if (userExists) {
                return res.status(400).json({
                        message: "User already exists"
                })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
                name,
                email,
                password: hashedPassword
        })

        if (user) {
                return res.status(201).json({
                        _id: user._id,
                        name: user.name,
                        email: user.email
                })
        } else {
                return res.status(400).json({

                        message: 'Invalid user'
                })
        }
}

const loginUser = async (req, res) => {
        const { email, password } = req.body
        // console.log(email, password)
        const user = await User.findOne({ email })

        if (user && (await bcrypt.compare(password, user.password))) {
                return res.status(200).json({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        token: generateToken(user._id)
                })
        } else {
                return res.status(400).json({

                        message: 'Invalid credentials'
                })
        }
}


const generateToken = (id) => {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
                expiresIn: '30d'
        })
}

module.exports = {
        registerUser,
        loginUser
}