// Sample in-memory users database
const users = [
	{ id: '1', name: 'John Doe', email: 'john@example.com' },
	{ id: '2', name: 'Jane Smith', email: 'jane@example.com' }
]

/**
 * Get all users
 */
export const getUsers = (req, res) => {
	res.json({ users })
}

/**
 * Get user by ID
 */
export const getUserById = (req, res, next) => {
	const { id } = req.params
	const user = users.find((u) => u.id === id)

	if (!user) {
		res.status(404)
		return next(new Error('User not found'))
	}

	res.json({ user })
}

/**
 * Create a new user
 */
export const createUser = (req, res, next) => {
	const { name, email } = req.body

	if (!name || !email) {
		res.status(400)
		return next(new Error('Name and email are required'))
	}

	const id = String(users.length + 1)
	const newUser = { id, name, email }
	users.push(newUser)

	res.status(201).json({ user: newUser })
}

/**
 * Update user
 */
export const updateUser = (req, res, next) => {
	const { id } = req.params
	const { name, email } = req.body

	const userIndex = users.findIndex((u) => u.id === id)

	if (userIndex === -1) {
		res.status(404)
		return next(new Error('User not found'))
	}

	users[userIndex] = {
		...users[userIndex],
		...(name && { name }),
		...(email && { email })
	}

	res.json({ user: users[userIndex] })
}

/**
 * Delete user
 */
export const deleteUser = (req, res, next) => {
	const { id } = req.params
	const userIndex = users.findIndex((u) => u.id === id)

	if (userIndex === -1) {
		res.status(404)
		return next(new Error('User not found'))
	}

	const [deletedUser] = users.splice(userIndex, 1)

	res.json({ message: 'User deleted', user: deletedUser })
}
