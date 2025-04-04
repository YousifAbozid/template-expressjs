import passport from 'passport'
import jwt from 'jsonwebtoken'
import config from '../config/index.js'

/**
 * Generate JWT token for a user
 */
export const generateToken = (user) => {
	return jwt.sign({ id: user._id }, config.jwt.secret, {
		expiresIn: config.jwt.expiresIn
	})
}

/**
 * Protect routes - JWT authentication middleware
 */
export const protect = passport.authenticate('jwt', { session: false })

/**
 * Check if user is authenticated via session
 */
export const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next()
	}
	res.status(401)
	next(new Error('Not authorized, please log in'))
}
