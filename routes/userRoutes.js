const express = require('express')
const router = express.Router()
const { registerUser, loginUser, forgotPassword, forgotPasswordVerify, setForgotPassword } = require('../controllers/userController')

router.post('/register', registerUser)

router.post('/login', loginUser)

router.post('/forgot-password', forgotPassword)

router.get('/forgot-password/:id/:token', forgotPasswordVerify)

router.post('/set-password', setForgotPassword)


module.exports = router