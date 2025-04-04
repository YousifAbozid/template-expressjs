import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import { notFound, errorHandler } from './middleware/error.js'
import routes from './routes/index.js'
import connectDB from './config/db.js'

// Load environment variables
dotenv.config()

// Connect to MongoDB
connectDB()

// Initialize express app
const app = express()

// Apply middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('dev'))

// Apply routes
app.use('/api', routes)

// Base route
app.get('/', (req, res) => {
	res.json({
		message: 'Express.js API Template',
		documentation: '/api/docs',
		health: '/api/health'
	})
})

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
	console.error('Unhandled Rejection:', err)
	// For clean shutdown in production, consider process.exit(1)
})
