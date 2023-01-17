const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const nodemailer = require('nodemailer')

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

const forgotPassword = async (req, res) => {
        const { email } = req.body
        
        // console.log('email',email)
        const userExists = await User.findOne({ email })

        // console.log(userExists)

        if (!userExists) {
                return res.status(400).json({ message: 'User does not exist' })
        }

        const secret = process.env.JWT_SECRET + userExists.email

        const token = jwt.sign({ email: userExists.email, id: userExists._id }, secret, { expiresIn: '30m' })

        const link = `https://todo-app-api-a6mo.onrender.com/api/user/forgot-password/${userExists._id}/${token}`

        // console.log(process.env.SENDER_MAIL, process.env.MAIL_PASS)

        var transporter = nodemailer.createTransport({
                service: 'outlook',
                auth: {
                        user: `${process.env.SENDER_MAIL}`,
                        pass: `${process.env.MAIL_PASS}`
                }
        });

        var mailOptions = {
                from: `${process.env.SENDER_MAIL}`,
                to: `${email}`,
                subject: 'Password Reset Link',
                text: link
        };

        transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                        console.log(error);
                } else {
                        console.log('Email sent: ' + info.response);
                }
        });

        // console.log(link)

        return res.status(200).json({ message: "Reset Link sent to email" })

}

const forgotPasswordVerify = async (req, res) => {
        const { id, token } = req.params

        // console.log(id, token)

        const userExists = await User.findOne({ _id: id })

        // console.log(userExists)

        if (!userExists) {
                return res.status(400).json({ message: 'User does not exist' })
        }

        const secret = process.env.JWT_SECRET + userExists.email

        try {
                const verify = jwt.verify(token, secret)

                if (verify.email) {
                        res.redirect('http://localhost:3000/changepass')
                }


        } catch (error) {
                // console.log(error);
                res.status(403).json({message:"Not Verified"});
        }
}

const setForgotPassword = async (req, res) => {
        // const { id, token } = req.params

        const { email, password } = req.body
        // console.log('email', email)
        // console.log('password', password)

        try {
                const userExists = await User.findOne({ email })

                // console.log('checkuser',userExists)

                if (!userExists) {
                        return res.status(400).json({ message: 'User does not exist' })
                }

                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)
                
                await User.updateOne({ email }, { $set: { password: hashedPassword } })

                res.status(200).json({ message: 'Password set successfully' })

        } catch (err) {
                return res.status(400).json({ message: 'Not verified' })
        }



}


const generateToken = (id) => {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
                expiresIn: '30d'
        })
}

module.exports = {
        registerUser,
        loginUser,
        forgotPassword,
        forgotPasswordVerify,
        setForgotPassword
}