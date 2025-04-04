import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import User from '../models/user.model.js'
import config from './index.js'

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.jwt.secret
}

// JWT strategy for token authentication
passport.use(
	new JwtStrategy(opts, async (jwt_payload, done) => {
		try {
			const user = await User.findById(jwt_payload.id)
			if (user) {
				return done(null, user)
			}
			return done(null, false)
		} catch (error) {
			return done(error, false)
		}
	})
)

// Serialize user for session
passport.serializeUser((user, done) => {
	done(null, user.id)
})

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id)
		done(null, user)
	} catch (error) {
		done(error, null)
	}
})
