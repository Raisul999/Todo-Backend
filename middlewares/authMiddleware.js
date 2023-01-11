const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const protect = async (req, res, next) => {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                try {
                        token = req.headers.authorization.split(' ')[1]
                        // console.log('token', token)
                        const decoded = jwt.verify(token, process.env.JWT_SECRET)

                        req.user = await User.findById(decoded.id).select('-password')

                        // console.log('userCreds',req.user)

                        next()
                } catch (err) {

                        // console.log(err)
                        res.status(401).json({error:'Not authorized'})
                }
        }

        if (!token) {
                res.status(401).json({error:'Not authorized, no token'})
        }
}

module.exports = protect