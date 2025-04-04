import mongoose from 'mongoose'
import config from './index.js'

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(config.db.url)

		console.log(`MongoDB Connected: ${conn.connection.host}`)
	} catch (error) {
		console.error(`Error: ${error.message}`)
		process.exit(1)
	}
}

export default connectDB
