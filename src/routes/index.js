import express from 'express'
import userRoutes from './user.routes.js'

const router = express.Router()

// Health check endpoint
router.get('/health', (req, res) => {
	res.status(200).json({
		status: 'ok',
		uptime: process.uptime()
	})
})

// API routes
router.use('/users', userRoutes)

export default router
