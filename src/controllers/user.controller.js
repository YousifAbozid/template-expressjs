import User from '../models/user.model.js'

/**
 * Get all users
 */
export const getUsers = async (req, res, next) => {
	try {
		const users = await User.find({})
		res.json({ users })
	} catch (error) {
		next(error)
	}
}

/**
 * Get user by ID
 */
export const getUserById = async (req, res, next) => {
	try {
		const { id } = req.params
		const user = await User.findById(id)

		if (!user) {
			res.status(404)
			return next(new Error('User not found'))
		}

		res.json({ user })
	} catch (error) {
		next(error)
	}
}

/**
 * Create a new user
 */
export const createUser = async (req, res, next) => {
	try {
		const { name, email } = req.body

		if (!name || !email) {
			res.status(400)
			return next(new Error('Name and email are required'))
		}

		const userExists = await User.findOne({ email })

		if (userExists) {
			res.status(400)
			return next(new Error('User with this email already exists'))
		}

		const newUser = await User.create({ name, email })
		res.status(201).json({ user: newUser })
	} catch (error) {
		next(error)
	}
}

/**
 * Update user
 */
export const updateUser = async (req, res, next) => {
	try {
		const { id } = req.params
		const { name, email } = req.body

		const user = await User.findById(id)

		if (!user) {
			res.status(404)
			return next(new Error('User not found'))
		}

		user.name = name || user.name
		user.email = email || user.email

		const updatedUser = await user.save()
		res.json({ user: updatedUser })
	} catch (error) {
		next(error)
	}
}

/**
 * Delete user
 */
export const deleteUser = async (req, res, next) => {
	try {
		const { id } = req.params
		const user = await User.findById(id)

		if (!user) {
			res.status(404)
			return next(new Error('User not found'))
		}

		await User.deleteOne({ _id: id })
		res.json({ message: 'User deleted', user })
	} catch (error) {
		next(error)
	}
}
